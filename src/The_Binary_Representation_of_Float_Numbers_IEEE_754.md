---
title: "The Binary Representation of Floating-Point Numbers (IEEE 754)"
author: Xilong Yang
date: 2024-05-14
---

The binary representation of the floating numbers was makes me very confused many years ago. Here is a introduction to the standard IEEE 754.

## Issue

Code for the issue:

```c
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

``` none
3 3 3 3 3 3 3 3 3 3
```

## Analysis

After several attempts, I finally found that the issue is caused by the value of 'a' in this program not being 3.0, but rather 2.9999. This suggests that the problem is probably linked to the precision of the floating-point arithmetic.

Here is a introduction to the *IEEE 754* floating-point number standard, which is followed by the C programming language.

A floating-point number which according to the IEEE 754 standard has a form comprising a single **sign bit**, followed by *k* bits for the **exponent**, and *n* bits for the **fraction**.

For example, when *k* = 8 and *n* = 23, the form is shown in the diagram below,

|Sign|Exponent|Fraction|
|-|-|-|
|x|xxxx xxxx|xxx xxxx xxxx xxxx xxxx xxxx|

The **sign bit** determines whether the number is positive or negative. It will be set to '0' when the number is positive. Otherwise it will be set to '1'.

The *k* bits in **exponent** area determine one of three categories for a floating-point number and represents its exponent. Furthermore, the value of *k* also determines a **Bias** value calculated as $2^{k-1}-1$.

The *n* bits in **fraction** area determine a value of the number without exponent. Just like the coefficient of a number expressed in scientific notation.

Thus, the value of a floating-point number can be calculated by the expression:

$$
V = (-1)^S \times M \times 2^E
$$

Where S is the value of the **sign bit**, M is the value represented by the **fraction** and E is the value represented by the **exponent**.

### Normalized Values

 When the k bits in the exponent area are neither all 0s nor all 1s, the number is a **normalized** value. For a normalized value, the exponent of the number is calculated by the following expression.

$$
E = e - Bias.
$$

Where e is the unsigned number value of exponent area.

In this form, the fraction area has a implicit leadding 1 in the left of the point. That is:

$$
M = 1.fraction
$$

For example, a float-point number with *k* = 3 bits for exponent and *n* = 4 bits for fraction, which has a bit-level representation `0 001 1010`. It will yield a value:

$$
S = 0
$$
$$
Bias = 2^{k-1} - 1 = 3
$$
$$
E = 1 - Bias = -2
$$
$$
M = 1.1010
$$
$$
V = -1^0 \times 1.1010 \times 2^{-2} = 0.011010
$$

> Why don't we use the exponent value directly rather than minus a suspicious Bias?
>
> The reason is to represent the negative exponent naturally. We can easily compare two exponent just by compare its unsigned value of the bit-level representation.
>

### Denormalized Values

When the bits in the exponent area are all 0s, the number is a **denormalized** value. There are only 2 difference between a normalized value and a denormalized value.

1. The exponent of the number is calculated by the following expression.

$$
E = 1 - Bias
$$

2. The fraction has no more implicit 1 in the head. That is:

$$
M = 0.fraction
$$

For example, a float-point number with *k* = 3 bits for exponent and *n* = 4 bits for fraction, which has a bit-level representation `0 00 1010` will yield a value:

$$
S = 0
$$
$$
Bias = 2^{k-1} - 1 = 3
$$
$$
E = 1 - Bias = -2
$$
$$
M = 0.1010
$$
$$
V = -1^0 \times 0.1010 \times 2^{-2} = 0.001010
$$

> Why don't we use the $-Bias$ to be the value of the exponent, rather than $1-Bias$?
>
> The reason is to take a naturally transform from denormalized values to normalized values.
>
> For example, consider a number which has *k* = 3 bit to represent the exponent and *n* = 4 bit for the fraction. The biggest **denormalized** values in the form has a bit-level represention:
>
> 0 000 1111, the values is: $0.1111 \times 2^{1-(2^{3-1}-1)}$ = $0.001111$
>
> Increase it by 1 in the bit-level, we can get the smallest **normalized** number which has a bit-level represention:
>
> 0 001 0000, the values is: $1.0000 \times 2^{1-(2^{3-1}-1)}$ = $0.010000$
>
> If the exponent set to $-Bias$ directly, the value of the denormalized number will be:
>
> $0.1111 \times 2^{-(2^{3-1} - 1)} =  0.0001111$
>
> We can look the $1-Bias$ as $-Bias + 1$, it is a compensation for the lack of the leading 1 in a denormalized value.
>

### Special Values

When the bits in the exponent area are set to all 1s, there are 2 special form depending on whether the bits in the fraction area are set to all 0s.

1. When the fraction area are not all 0s, the value is NaN which means Not a Number.

2. When the fraction area are all 0s, the value is infinity. The value is either $+\infty$ or $-\infty$ denpending on the sign bit.

Here a some examples when *k* = 2 and *n* = 5:

|Bit-level representaion|Value|
|-|-|
|0 11 00000|$+\infty$|
|1 11 00000|$-\infty$|
|0 11 00100|NaN|
|1 11 00100|NaN|

### Precision and Rounding

The C programming language is using 32 bits to represent a `float` type，and 64 bits to represent a `double` type. Here is the detail for the representation.

|Type|Sign|Exponent|Fraction|
|-|-|-|-|
|float|1 bit|8 bit|23 bit|
|double|1 bit|11 bit|52 bit|

Limited by the memory space, there are 2 factors that can lead a lack of precision.

1. The number is so large that the exponent can not be represent. For example, the number $2^{5000}$ can not be represented even by the type `double`, because a `double` can only represents a exponent between $1 - 2^{11 - 1} + 1 = -1022$ and $2^{12} - 2 - 2^{11 - 1} + 1 =1023$.

2. The number has too many digit so that the fraction bits is not enough to represent it. For example, the number $0.1100110011001100110011000101_2$ needs 27 bit to represent its fraction (the leading 1 can be left out), but a `float` only has 23 bits to represent the fraction.

> Note
>
> The effection of the exponent is to move the point to difference posiiton of a floating-point number (that's why it is called "floating-point"), that makes it possible to get a very large value. But since we can only set the value for a limited fraction, the precision of the possible value is also limited.
>
>For example, when *k* = 8 and *n* = 3 we can simply represent $2^{100}$ by the represention:
>
>0 11100011 000
>
> But we can't represent $1.1111_2 \times 2^{100}$ since we can only control the first 3 bits actually in the hundred of 0s.
>

When we face to the precision problem, the only way we can choose is make it rounding. The default rule of rounding is called "Round-to-even".

To explain the rule, consider a number which has a form like $...xxx.xxyyyy...$. The position we want to round is between the least x and the most y. A value is on halfway between two possibilities only if it has a form like $xxx.xx1000...$, that is the most y is 1 and followed by all 0s.

1. If the value is not on the halfway between two possibilities, round to the nearer one. For example, if we want to save 2 digit after the point, the number 1.01101 will round to 1.10 and the number 1.01001 will round to 1.01.

2. If the value is on the halfway between two possibilities, we tend to make the least digit before the position we want to round to 0. For example, if we want to save 2 digit after the point, the number 1.01100 will round to 1.10 and the number 1.10100 will round to 1.10.

Because the last digit of a rounded number is always 0 (so that the number is even), the rule is called "round-to-even".

> Why it choose round-to-even instead round-to-zero?
>
> Because a half of numbers is even, a number will round upward about 50% of the time and round downward about 50% of the time. It can balance the loss which caused by rounding.
>

## Result

Let's back to the issue, get the IEEE 754 representation of $0.3_{10}$.

Transfer $0.3_{10}$ to normalized binary representation:

$$
1.00110011001100110011001... \times 10_2^{-10}
$$

We can notice that the binary representation of $0.3_{10}$ is a unfiniate number. So it will be rounding when transfer to IEEE 754 representation. Since it is bigger than halfway, it will round upward:

|Sign|EXP|Fraction|
|-|-|-|
|0|01111101|001 1001 1001 1001 1001 1010|

Translate the binary representation to hex, it should be $3e99999a_{16}$. We can validate it by the following program:

```c
#include<stdio.h>
int main()
{
    float a = 0.3;
    printf("%x", *(int *)&a);
    return 0;
}
```

output:

``` none
3e99999a
```

The result is met our expectations.
