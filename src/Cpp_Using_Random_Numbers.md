---
title: C++随机数的使用
author: Xilong Yang
date: 2021-05-17 
---

整理一下STL中random库和cstdlib中随机数机制的用法区别。

## cstdlib中的随机数用法

```cpp
#include <cstdlib>
#include <ctime>
#include <cstdio>

int main() {
    srand(time(0));
    for (int i = 0; i < 10; ++i) {
        print("%d\n", rand());
    }
    return 0;
}
```

这段程序使用系统当前时间作随机数种子，然后使用rand()生成10个随机数。

## STL中的随机数用法

```cpp
#include <random>
#include <ctime>
#include <cstdio>

int main() {
    default_random_engine e(time(0));
    for (int i = 0; i < 10; ++i) {
        print("%d\n", e());
    }
    return 0;
}
```

这段程序也是使用系统当前时间作随机数种子，然后使用e()生成10个随机数。

~~好了，以上就是小编带来的关于如何在c++中使用随机数的全部内容了，你学会了吗？（逃~~

## 为什么要使用STL的随机数

答：用法丰富，使用方便。直接上例子：

```cpp
#include <random>
#include <cstdlib>
#include <ctime>

int main() {
    default_random_engine e;
    // 设置种子
    srand(time(0));
    e.seed(time(0));
    // 生成一个范围内的整数
    int min = 0;
    int max = 9;
    rand() % (max - min) + min;
    uniform_int_distribution<unsigned> u(min, max);
    u(e);
    // 生成随机实数，STL的方法精度高于使用rand() / double的方式生成的实数
    uniform_real_distribution<double> u(min, max);
    u(e);
    // 生成随机布尔, 注意这个描述器不是模板
    bernoulli_distribution b;
    b(e);
    // 生成不均匀分布的随机数, 均值4， 标准差1.5
    normal_distribution<> n(4, 1.5);
    n(e);
    return 0;
}
```

相信大家已经看出来标准库的方便之处了。

## 一个非常常见的问题

```cpp
#include <cstdlib>
#include <random>
#include <ctime>

int main() {
    for (int i = 0; i < 10; ++i) {
        srand(time(0));
        rand();
        default_random_engine e;
        e();
    }
    return 0;
}
```

这种方式会生成一样的数字，原因是随机数种子被设置时会重置随机数生成器的状态（Engine e初始化时同样设置了默认种子）。应避免在生成随机数时设置种子。

```cpp
#include <cstdlib>
#include <random>
#include <ctime>

int main() {
    srand(time(0));
    default_random_engine e;
    for (int i = 0; i < 10; ++i) {
        rand();
        e();
    }
    return 0;
}
```

这样就没问题了。
