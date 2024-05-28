---
title: "The Binary Representation of Float Numbers (IEEE 754)"
author: Xilong Yang
date: 2019-05-14
---

<div class="abstract">

### Prelude

The binary representation of the floating numbers was makes me very confused. Here is some note for it.

</div>

$$toc$$

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

```
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

### Normalized form

 When those k bits in the exponent area are neither all 0 nor all 1, the number is under the **normalized** form. In the form, the exponent of the number is calculated by the following expression.

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

### Denormalized form

When the bits in the exponent area are all 0, the number is under the **denormalized** form. There are only 2 difference between the normalized form and the denormalized form.

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

> Here are 2 questions about the Bias.
>
> Question 1. Why don't we use the exponent directly rather than minus a suspicious Bias? 
>
>The reason is to represent the negative exponent.
>
> Question 2. Why don't we use the $2^{k - 1}$ to be the value of the Bias, rather than $2^{k - 1} - 1$?
>
> For example, consider a number form which has *k* = 2 bit to represent the exponent and *n* = 4 bit for the fraction. The biggest **denormalized** number in the form has a bit-level represention:
>
> 0 00 1111
> 
> Increase it by 1 in the bit-level, we can get the smallest **normalized** number which has a bit-level represention:
>
> 0 01 0000
>

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

```
3e99999a
```

The result is not actually $3E999999_{16}$, this is because the float-point number arithmetic has some round rules.
