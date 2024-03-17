---
title: "C: The Binary Representation of Float Numbers (IEEE 754)"
author: Xilong Yang
date: 2019-08-18
---

<div class="abstract">

### Prelude

Recently, I encountered precision issues with floating-point arithmetic during my C language learning process. After researching, I found that the issue was caused by the storage method of floating-point numbers. Here is a record.

</div>

$$toc$$

## Issue

Code for the issue:

``` {.language-c .line-numbers .match-braces}
#include <stdio.h>

int main() {
  int arr[10] = {3, 3, 3, 3, 3, 3, 3, 3, 3, 3};

  // Calculate the mean of all the numbers in arr.
  float a = 0;
  for (int i = 0; i < 10; ++i) {
    a += (float)arr[i] / 10;   
  }
  for (int i = 0; i < 10; ++i) {
    if (arr[i] > a) {
        printf("%d ", arr[i]);
    }
  }
  return 0;
}
```

It's evident that the above program theoretically shouldn't output any data. However, the actual execution result is as follows:

```
3 3 3 3 3 3 3 3 3 3 
```

## Analysis

After several attempts, I finally discovered that the issue is caused by the value of 'a' in this program not being 3.0, but rather 2.9999. This suggests that the problem is probably linked to the precision of floating-point arithmetic.

Floating-point numbers are storaged in memory according to the IEEE 754 standard. That is, each number is allocated 4 bytes, comprising a sign bit, an 8-bit exponent bias and a 23-bit fraction. As shown in the diagram below:

|Sign|EXP|Fraction|
|-|-|-|
|0|0000 0000|000 0000 0000 0000 0000 0000|

To represent a floating-point number by the struct, we should transfer a number to the **normalized form**, which looks like scientific notation for binary numbers. A normalized number has a format like $\pm a.bbbb_2 \times 10_2^c$, where the $a$ should not be 0 (In a binary number, each digit is neither 0 or 1, so the $a$ should always be 1). 

For example, 

1. The number $1.0101_2 \times 10_2^0$ is a normalized number. 

2. The number $0.01001_2 \times 10_2^0$ is not a normalized number. We can transfer it to normalized format by change the exponent: $1.001_2 \times 10_2^{-10_2}(in\ Dec:\ 2^{-2})$.

3. The number $1001.01_2 \times 10_2^0$ is also not a normalized number. We can transfer it to normalized format by change the exponent: $1.00101_2 \times 10_2^{11_2}(in\ Dec:\ 2^{3})$.

Let's look back to the struct, the **sign bit** determines whether the number is positive or negative, with '0' indicating positive and '1' indicating negative.

**Exponent bias** represents the exponent of the number, that is:

$$
EXP(Exponent\ bias) = e(exponent\ of\ the\ number) + 127.
$$

> Why don't we use the exponent directly rather than plus a suspicious '127'? The reason is for a easier machine compute progress, which can transfer a signficated arithmetic to a simpler unsignficated arithmetic. For example, consider the compute progress: 
>
> $$
> -123_{10}(1111\ 1011_2) + 123_{10}(0111\ 1011_2) 
> = 1000\ 0101_2 + 0111\ 1011_2 
> = 0000\ 0000_2
> $$ 
>
> It can be transfer to: 
> 
> $$
> 4_{10}(0000\ 0100_2) + 250_{10}(1111 1010_2) 
> = 1111\ 1110_2
> $$
> 
> Which can void calculating the two's complement of numbers.

**Fraction** represents the right part of the point in the normalized number. That is, the $bbbb$ part of a normalized number $1.bbbb \times 10_2^c$. The leading $1$ is implicit, it will not be storaged in memory, but when we compute the value of the number, it should be consider.

For example, to represent a number $12.25_10$ in IEEE 754 standard, we should deal the number with some step:

1. Transfer the number to binary representation: $1100.01_2$.

2. Transfer the number to normalized form: $1.10001_2 \times 10_2^{11}$. 

3. The number is positive, so set the sign bit to 0: 

|Sign|EXP|Fraction|
|-|-|-|
|0|.... ....|... .... .... .... .... ....|

4. The exponent of the number is $11_2$, so set the EXP to $11_2 + 01111111_2(127_{10})$

|Sign|EXP|Fraction|
|-|-|-|
|0|10000010|... .... .... .... .... ....|

5. Set the fraction to $10001$

|Sign|EXP|Fraction|
|-|-|-|
|0|10000010|100 0100 0000 0000 0000 0000|

So we get the IEEE 754 struct for the number.

## Result

Let's back to the issue, get the IEEE 754 representation of $0.3_{10}$.

Transfer $0.3_{10}$ to normalized binary representation: 

$$
1.00110011001100110011001... \times 10_2^{-10}
$$ 

We can notice that the binary representation of $0.3_{10}$ is a unfiniate number. So it will be truncate when transfer to IEEE 754 representation:

|Sign|EXP|Fraction|
|-|-|-|
|0|01111101|001 1001 1001 1001 1001 1001|

Translate the binary representation to hex, it should be $3E999999_{16}$. We can validate it by the program:

``` {.language-c .line-numbers .match-braces}
#include<stdio.h>

int main()
{
    float a = 0.3;
    printf("%x", *(int *)&a);
    return 0;
}
```

output:

```
3e99999a
```

The result is not actually $3E999999_{16}$, this is because the float-point number arithmetic has some round rules.
