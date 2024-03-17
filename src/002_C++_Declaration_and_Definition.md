---
title: "C++: Declaration and Definition"
author: Xilong Yang
date: 2020-02-26
---

<div class="abstract">

### Prelude

I saw a declaration by chance, which is really confused me. To make sense of such a complex declaration, I learned more about it. Here is the summary. The declaration seems like:

`struct tm ((Pfunc)[3])(int()(int, int), float(*[])(float));` 

</div>

$$toc$$

## The Difference between Declaration and Defination

### Declaration

To the declaration in the C++, there is a general description: A declaration statement is composed of a *basic data type* and a list of *names* which follows the data type. Each name designates a variable and specifies its type, which is based on basic data type.

Declaration Statement: $[basic\ data\ type]\ name_1\ (, name_2, ... , name_n)$

Consider the statement:

```cpp
int a,b = 2;
```

In fact, this is not a declaration statement, but a definition statement. It declares two variables *a* and *b*, and defines them with the dafault value to *a* and the number 2 to *b*. 

