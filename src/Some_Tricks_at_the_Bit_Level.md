---
title: Some Tricks at the Bit-level
author: Xilong Yang
date: 2024-10-28 
---

On my journey through Chapter 2 of CSAPP, some magical tricks appeared intermittently. So I am trying to catch them by writing this article.

## Fold bits

Consider that we get a mission to check if all the odd-numbered bits in a int are set to 1. What is the faster way?

The answer is: to fold it.

```c
/*
 * allOddBits - return 1 if all odd-numbered bits in word set to 1
 *   where bits are numbered from 0 (least significant) to 31 (most significant)
 *   Examples allOddBits(0xFFFFFFFD) = 0, allOddBits(0xAAAAAAAA) = 1
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 12
 *   Rating: 2
 */
int allOddBits(int x) {
  x = x & (x >> 16);
  x = x & (x >> 8);
  x = x & (x >> 4);
  x = x & (x >> 2);
  return (x >> 1) & 1;
}
```

By using the fold technic, We can implement logical not without operator `!` by folding the 'or' operation:

```c
/*
 * logicalNeg - implement the ! operator, using all of
 *              the legal operators except !
 *   Examples: logicalNeg(3) = 0, logicalNeg(0) = 1
 *   Legal ops: ~ & ^ | + << >>
 *   Max ops: 12
 *   Rating: 4
 */
int logicalNeg(int x) {
  x = (x >> 16) | x;
  x = (x >> 8) | x;
  x = (x >> 4) | x;
  x = (x >> 2) | x;
  x = (x >> 1) | x;
  return ~x & 1;
}
```

Furthermore, we can fill all the bits in the right ( left ) side of the most ( least ) significant bit to 1 by a inverse way (the shift number's order is reversal):

```c
// All of the bits in the right side of the most significant 1 should set to 1.
compare = compare | (compare >> 1);
compare = compare | (compare >> 2);
compare = compare | (compare >> 4);
compare = compare | (compare >> 8);
compare = compare | (compare >> 16);
```

By combining those technic, it is possible to compare two integer number x and y without any arithmetic operator or compare operator:

```c
/*
 * isLessOrEqual - if x <= y  then return 1, else return 0
 *   Example: isLessOrEqual(4,5) = 1.
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 24
 *   Rating: 3
 */
int isLessOrEqual(int x, int y) {
  // Check the sign bits.
  // x <= y is possible if any of following condition is satisfied:
  // 1. The sign bits of x and y is same.
  // 2. The sign bits are not same but the x's sign bit is set to 1
  //    (which means x is negative and y is positive).
  // If any of those condition is satisfied, the sign_check will be set to 0.
  int sign_x = (x >> 31) & 1;
  int sign_y = (y >> 31) & 1;
  int diff_sign = sign_x ^ sign_y;
  int sign_check = diff_sign & (!sign_x);

  // Compare x and y.
  // For both positive number and negative number, the number which
  // contains the most significant 1 will be the greater one.
  // Get the different bits between x and y.
  int compare = x ^ y;
  // Transfer the compare result to the form '00..011..1', which means
  // all of the bits in the right of the most significant 1 should set to 1.
  compare = compare | (compare >> 1);
  compare = compare | (compare >> 2);
  compare = compare | (compare >> 4);
  compare = compare | (compare >> 8);
  compare = compare | (compare >> 16);
  // Erase all but the most significant 1.
  // For example, the formalized number 00001111 will turn to 00001000
  //   (compare >> 1): 00000111
  //   (compare &  1): 1
  //   (compare >> 1) + (compare & 1): 00001000
  // There are two special cases:
  // 1. When x == y, compare will be 0 and the result of the expression (compare & 1) will also be 0.
  //    Thus the result of the expression (compare >> 1) + (compare & 1) will be 0.
  //
  // 2. When the sign bit is difference, the result of the express (compare >> 1) will be 0xFFFFFFFFFFFFFFFF.
  //    Thus the result of the expression (compare >> 1) + (compare & 1) will be 0.
  //    That is, the expression is invalid in this case, but at least it will not interference the sign check.
  //    So it still works.
  compare = (compare >> 1) + (compare & 1);
  // If the most significant bit is contained by x, result will be 0.
  // Otherwise it will be 1.
  compare = compare & x;

  // The x <= y if and only if
  // the most significant different bit is contained by x
  // and the sign_check is passed.
  return !(compare + sign_check);
}
```

## Count bits

Consider that we need to find the minimum number of bits required to represent x in two's component. And all of the operators that allowed to use are: `! ~ & ^ | + << >>`.

First at all, the minimum number of bits is only decided by the position of the most significant 1 in the number's two's component representation. That is, consider we have `x = 00001010`, the most significant 1 is located at the 4th position from the right. So we can represent x by using 5  bits (don't forget the sign bit). 

Wait a minute. How about the negative number? Consider if the x is equals to `11110101`, what is the minimum number of bits to represent it? The answer is also 5 bits. In this situation, we need to find the position of the most significant 0 instead 1. However, it is unnecessary to distinct if the x is negative or positive. Just inverse all of the bits in a negative number, so that we can consider it as a same way to positive numbers.

```C 
// Inverse negative numbers
x = (x >> 31) ^ x;
```

It seems hard to find a easy way to find the position of the most significant 1. So we can fill all of the bits located in the right side of the most significant 1 by using the fold technic, so that the problem that find the most significant 1 is converted to the problem that count the number of bits which is set to 1.

```C
// Set the bits in the right side of most significant 1 to 1.
x |= x >> 1;
x |= x >> 2;
x |= x >> 4;
x |= x >> 8;
x |= x >> 16;
```

For a number which represented by 2 bits, it is possible to count the number of bits which is set to 1 by using a mask.

```C
mask = 01b;
// count the numbers of 1s by adding the two bits.
x = (x & mask) + ((x >> 1) & mask);
```

By using a longer mask, we can count the number of 1s for each 2 bits in a number:

```C
int mask = 0x55555555; // 01010101....
x = (x & mask) + ((x >> 1) & mask)
```

After this, the number can be considered as a list of 2 bits numbers. Each 2 bits number in the list saves the number of 1 in those 2 bits. For example:

```bash
x                              = 0x01001110
mask                           = 0x01010101
x & mask                       = 0x01000100
(x >> 1) & mask                = 0x00000101
(x & mask) + ((x >> 1) & mask) = 0x01001101
2 bits group of x              = 01 00 11 10
2 bits group of result         = 01 00 11 01 (numbers of 1s of the 2 bits group of x)
```

So we can simply count the 1s for each 4 bits and so far by using a similar way, so that we can implement a function to find the minimum number of bits required to represent x in two's component.:

```C
/* howManyBits - return the minimum number of bits required to represent x in
 *             two's complement
 *  Examples: howManyBits(12) = 5
 *            howManyBits(298) = 10
 *            howManyBits(-5) = 4
 *            howManyBits(0)  = 1
 *            howManyBits(-1) = 1
 *            howManyBits(0x80000000) = 32
 *  Legal ops: ! ~ & ^ | + << >>
 *  Max ops: 90
 *  Rating: 4
 */
int howManyBits(int x) {
  int mask_2bit = 0x55;
  int mask_4bit = 0x33;
  int mask_8bit = 0x0f;
  int mask_16bit = 0xff;
  int mask_32bit = 0xff;

  // Inverse negative
  x = (x >> 31) ^ x;

  // Set the bits in the right of most significant 1 to 1.
  x |= x >> 1;
  x |= x >> 2;
  x |= x >> 4;
  x |= x >> 8;
  x |= x >> 16;

  // Count 1s
  // Generate a 2 bit mask 0x55555555(0101....)
  mask_2bit += mask_2bit << 8;
  mask_2bit += mask_2bit << 16;

  // Group each 2 bits to present the sum of 1s in those bits.
  x = (x & mask_2bit) + ((x >> 1) & mask_2bit);

  // Generate a 4 bit mask 0x33333333(00110011....)
  mask_4bit += mask_4bit << 8;
  mask_4bit += mask_4bit << 16;

  // Group each 4 bits to present the sum of 1s in those bits.
  x = (x & mask_4bit) + ((x >> 2) & mask_4bit);

  // Generate a 8 bit mask 0x0f0f0f0f(0000111100001111....)
  mask_8bit += mask_8bit << 8;
  mask_8bit += mask_8bit << 16;

  // Group each 8 bits to present the sum of 1s in those bits.
  x = (x & mask_8bit) + ((x >> 4) & mask_8bit);

  // Generate a 16 bit mask 0x00ff00ff(00000000111111110000000011111111)
  mask_16bit += mask_16bit << 16;

  // Group each 16 bits to present the sum of 1s in those bits.
  x = (x & mask_16bit) + ((x >> 8) & mask_16bit);

  // Generate a 32 bit mask 0x00ff00ff(00000000000000001111111111111111)
  mask_32bit += mask_32bit << 8;

  // Group each 32 bits to present the sum of 1s in those bits.
  x = (x & mask_32bit) + ((x >> 16) & mask_32bit);

  // Minimum bits to present the number should be numbers of 1s + 1.
  return x + 1;
}
```

