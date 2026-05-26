---
title: Implementing SHA-256 in Haskell
author: Xilong Yang
date: 2026-05-26
---

I am refactoring my site builder from a Python implementation to Haskell. For signature generation, I implemented SHA-256 in Haskell. The implementation is correct, but it is about 30 times slower than the Linux sha256sum tool, even after accounting for process invocation overhead.

As a result, I switched to the system tool and wrote this post to preserve my non-production SHA-256 implementation.

## SHA-256 Algorithm

### Key components:

* 8 initial hash values: the first 32 bits of the fractional parts of the **square roots** of the first eight primes
* 64 constants: the first 32 bits of the fractional parts of the **cube roots** of the first 64 primes
* Chunk size: 512 bits
* Scheduled words per chunk: 64 × 32-bit words
* Rotate-right function: `RTOR`
* Functions for expanding a chunk to words: `S0`, `S1`
* Functions for updating the result hash values: `EP0`, `EP1`, `CH`, `MAJ`

### Procedure

1. Preprocessing the message.
   1. Append a `1` bit after the message.
   2. Append `0` bits after the message until the length mod the chunk size (512) is 448.
   3. Append the length of the original message, in bits, as a 64-bit unsigned big-endian integer. So that the length of the message mod the chunk size is exactly 0. (448 + 64 = 512)
2. Split the preprocessed message into chunks of size 512 bits.
3. Let `h[]` be the 8 initial hash values; let `k[]` be the 64 constants.
4. Process each chunk iteratively to update the hash state. For a single chunk:
   1. Create a list of 32-bit words containing 64 elements: `w[64]`.
   2. Split the chunk into 16 words (512 = 32 * 16), and put them into the first 16 words.
   3. Generate the remaining words using the following recurrence relation:
      * `w[i] = w[i - 16] + S0(w[i - 15]) + w[i - 7] + S1(w[i - 2])`
      * `S0(x) = RTOR(x, 7) ^ RTOR(x, 18) ^ (x >> 3)`
      * `S1(x) = RTOR(x, 17) ^ RTOR(x, 19) ^ (x >> 10)`
   4. Make a copy of `h[]` and call it `h'[]`
   5. Iterate over `w[]` to update values in `h'[]`
      1. `t1 = h'[7] + EP1(h'[4]) + CH(h'[4], h'[5], h'[6]) + k[i] + w[i]`
         * `EP1(x) = RTOR(x, 6) ^ RTOR(x, 11) ^ RTOR(x, 25)`
         * `CH(x, y, z) = (x & y) ^ ((~x) & z)`
      2. `t2 = EP0(h'[0]) + MAJ(h'[0], h'[1], h'[2])`
         * `EP0(x) = RTOR(x, 2) ^ RTOR(x, 13) ^ RTOR(x, 22)`
         * `MAJ(x, y, z) = ((x & y) ^ (x & z) ^ (y & z))`
      3. Update `h' {a, b, c, d, e, f, g, h}` to `{t1 + t2, a, b, c, d + t1, e, f, g}`
   6. Update `h[]` by adding the corresponding values from  `h'[]` .
5. Concatenate the final hash words `h[]` to the final result. (32 * 8 = 256 bit)

## Complete Source Code

```haskell
module Modules.Utils.Sha256 (sha256Hex) where

import Data.Word
import Data.Bits
import Data.List
import Numeric (showHex)
import qualified Data.Text as Text
import qualified Data.Text.Encoding as TextEncoding
import qualified Data.ByteString as ByteString

-- ---[ Overview ]------------------------------------------------------------
-- | Pure SHA-256 implementation used by the builder.
--
-- Design notes:
-- - public API takes 'String', encodes as UTF-8, and returns lowercase hex
-- - core implementation follows SHA-256 standard flow:
--   padding -> 512-bit chunking -> word schedule expansion -> compression
-- - this module is self-contained (no external crypto dependency)

-- ---[ Public API ]------------------------------------------------------------

-- | Computes SHA-256 digest as a lowercase hexadecimal string.
--
-- Input text is encoded as UTF-8 bytes before hashing.
sha256Hex :: String -> String
sha256Hex = (concatMap byteToHex) . sha256 . utf8Encode
  where
    byteToHex :: Word8 -> String
    byteToHex b =
      let s = showHex b ""
      in if length s == 1 then '0' : s else s
    
    utf8Encode :: String -> [Word8]
    utf8Encode = ByteString.unpack . TextEncoding.encodeUtf8 . Text.pack

-- ---[ Implementation Details ]-----------------------------------------------

-- 512-bit chunk size in bytes.
chunkSize :: Int
chunkSize = 64

-- Initial hash state constants (H0..H7).
h :: [Word32]
h = [ 0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a
    , 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]

-- Round constants (K0..K63).
k :: [Word32]
k = [ 0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b
    , 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01
    , 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7
    , 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc
    , 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152
    , 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147
    , 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc
    , 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85
    , 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819
    , 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08
    , 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f
    , 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208
    , 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]

messageSizeFieldBytes :: Int
messageSizeFieldBytes = 8

-- Number of words directly parsed from one 512-bit chunk.
initialWordsCount :: Int
initialWordsCount = 16

-- Number of scheduled words per chunk after expansion.
wordsCount :: Int
wordsCount = 64

-- Small sigma 0 for message schedule.
s0 :: Word32 -> Word32
s0 x = rotateR x 7 `xor` rotateR x 18 `xor` shiftR x 3

-- Small sigma 1 for message schedule.
s1 :: Word32 -> Word32
s1 x = rotateR x 17 `xor` rotateR x 19 `xor` shiftR x 10

-- Big sigma 0 for compression rounds.
ep0 :: Word32 -> Word32
ep0 x = rotateR x 2 `xor` rotateR x 13 `xor` rotateR x 22

-- Big sigma 1 for compression rounds.
ep1 :: Word32 -> Word32
ep1 x = rotateR x 6 `xor` rotateR x 11 `xor` rotateR x 25

-- Choice function.
ch :: Word32 -> Word32 -> Word32 -> Word32
ch x y z = (x .&. y) `xor` (complement x .&. z) 

-- Majority function.
maj :: Word32 -> Word32 -> Word32 -> Word32
maj x y z = (x .&. y) `xor` (x .&. z) `xor` (y .&. z)

-- Hashes raw bytes and returns digest bytes.
sha256 :: [Word8] -> [Word8]
sha256 msg = concatMap w32ToW8s finalH
  where
    initialWords :: [[Word32]]
    initialWords = (splitChunksToWords . splitToChunks . padding) msg

    expandedWords :: [[Word32]]
    expandedWords = map expandWords initialWords

    processChunk :: [Word32] -> [Word32] -> [Word32]
    processChunk hs ws
      | length hs /= 8 = error "Wrong initial H for processChunk."
      | length ws /= wordsCount = error "Wrong words for processChunk."
      | otherwise =
          -- Start from previous hash state and run 64 compression rounds.
          let finalWorking = foldl' (refreshH ws) hs [0 .. wordsCount - 1]
          in zipWith (+) hs finalWorking
    
    finalH :: [Word32]
    finalH = foldl' processChunk h expandedWords

    w32ToW8s :: Word32 -> [Word8]
    w32ToW8s x =  
      [ fromIntegral (shiftR x 24)
      , fromIntegral (shiftR x 16)
      , fromIntegral (shiftR x 8)
      , fromIntegral x
      ]

-- Applies SHA-256 message padding:
-- append 0x80, then zero bytes, then original message bit length in BE64.
padding :: [Word8] -> [Word8]
padding msg = initBytes ++ replicate paddingSize continueByte ++ msgSizeBytes
  where
    firstByte :: Word8
    firstByte = 0x80

    continueByte :: Word8
    continueByte = 0x00
    
    initBytes :: [Word8]
    initBytes = msg ++ [firstByte]

    modSize :: Int
    modSize = length initBytes `mod` chunkSize

    targetModSize :: Int
    targetModSize = chunkSize - messageSizeFieldBytes

    paddingSize :: Int
    paddingSize = (targetModSize - modSize) `mod` chunkSize

    msgSizeBytes :: [Word8]
    msgSizeBytes = intToBE64 (fromIntegral (length msg) * 8)

    intToBE64 :: Integer -> [Word8]
    intToBE64 x =  
      let w = fromIntegral x :: Word64
      in
      [ fromIntegral (shiftR w 56)
      , fromIntegral (shiftR w 48)
      , fromIntegral (shiftR w 40)
      , fromIntegral (shiftR w 32)
      , fromIntegral (shiftR w 24)
      , fromIntegral (shiftR w 16)
      , fromIntegral (shiftR w 8)
      , fromIntegral w
      ]

-- Splits padded bytes into 512-bit chunks.
splitToChunks :: [Word8] -> [[Word8]]
splitToChunks msg 
  | length msg `mod` chunkSize /= 0 = error "Message length incorrect!"
  | otherwise = splitToChunks' msg
  where
    splitToChunks' :: [Word8] -> [[Word8]]
    splitToChunks' [] = []
    splitToChunks' msg' = 
      let (chunk, rest) = splitAt chunkSize msg'
      in chunk : splitToChunks' rest

-- Converts each 512-bit chunk into sixteen big-endian Word32 values.
splitChunksToWords :: [[Word8]] -> [[Word32]]
splitChunksToWords = map splitChunkToWords
  where
    splitChunkToWords :: [Word8] -> [Word32]
    splitChunkToWords chunk
      | length chunk `mod` 4 /= 0 = error "Chunk size incorrect!"
      | otherwise = splitChunkToWords' chunk

    splitChunkToWords' :: [Word8] -> [Word32]
    splitChunkToWords' [] = []
    splitChunkToWords' word8s =
      let (wordGroup, rest) = splitAt 4 word8s
      in bytesToWord32 wordGroup : splitChunkToWords' rest
    
    bytesToWord32 :: [Word8] -> Word32
    bytesToWord32 [w0,w1,w2,w3] = 
      shiftL (fromIntegral w0) 24 .|. 
      shiftL (fromIntegral w1) 16 .|. 
      shiftL (fromIntegral w2)  8 .|. 
      fromIntegral w3 

-- Expands 16 initial words into 64 scheduled words.
expandWords :: [Word32] -> [Word32]
expandWords initialWords
  | length initialWords /= initialWordsCount = error "Count of initial words must be 16"
  | otherwise = expandWords' initialWords initialWordsCount
  where
    expandWords' :: [Word32] -> Int -> [Word32]
    expandWords' ws i
      | i == 64 = ws
      | otherwise = expandWords' (ws ++ [nextWord ws i]) (i + 1)

    nextWord :: [Word32] -> Int -> Word32
    nextWord ws i = (ws !! (i - 16)) + s0(ws !! (i - 15)) + ws !! (i - 7) + s1(ws !! (i - 2))


-- Executes one compression round and returns the next working state.
refreshH :: [Word32] -> [Word32] -> Int -> [Word32]
refreshH ws h' i
  | i < 0 || i >= wordsCount = error "Invalid number for refresh H."
  | otherwise = 
    case h' of 
      [h0, h1, h2, h3, h4, h5, h6, h7] ->
        let t1 = h7 + ep1 h4 + (ch h4 h5 h6) + (k !! i) + (ws !! i)
            t2 = ep0 h0 + maj h0 h1 h2
        in [t1 + t2, h0, h1, h2, h3 + t1, h4, h5, h6]
      _ -> error "Wrong initial H for refresh H."
```

## Why It Is Slow

The implementation is intentionally simple and list-oriented, which makes it easy to follow but extremely inefficient.

Some major performance costs include:

- linked-list indexing via `(!!)`
- repeated list concatenation using `(++)`
- boxed list representation for bytes and words
- conversion from ByteString to `[Word8]`

Still, I like the current structure, and I am not interested in sacrificing readability for performance.
