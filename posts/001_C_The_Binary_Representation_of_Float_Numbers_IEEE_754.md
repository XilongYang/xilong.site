---
title: "C: The Binary Representation of Float Numbers (IEEE 754)"
author: Xilong Yang
date: 2019-08-18
---

<div class="abstract">
<h2>Prelude</h2>
<p>
Recently, I encountered precision issues with floating-point arithmetic during my C language learning process. After researching, I found that the issue was caused by the storage method of floating-point numbers. Here is a record.
</p>
</div>

<nav role="navigation" class="toc">
    <h2>Contents</h2>
    <ol>
      <li><a href="#issue">Issue</a></li>
      <li><a href="#analysis">Analysis</a></li>
      <li><a href="#result">Result</a></li>
    </ol>
</nav>

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

After some attempts, finally, I found the reason is that the value of `a` in this program is not 3.0 but 2.9999.

After several attempts, I finally discovered that the issue is caused by the value of 'a' in this program not being 3.0, but rather 2.9999.

## Result
