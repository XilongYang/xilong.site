---
title: Linux平台下C++库的生成与使用
author: Xilong Yang
date: 2020-06-07
---

学习C++也有一段时间了，却一直不太了解库相关的知识，今天得空学习了一些基础用法，在此记录。

## 什么是库

### 编译连接：从源码到程序

![compile](../res/post-imgs/Generating_and_Using_Cpp_Library_in_Linux/compile.png)

上图展示了C++程序的生成过程。可以看到库文件和目标代码一起被处理，可见库文件与目标代码之间应该具有某种联系。

### 库：目标文件的打包

事实上，库文件就是将一些目标文件打包而成的文件。这些文件往往与作为接口的头文件一起提供给程序使用。程序在使用库文件时不需要对文件中实现的内容进行重复编译，可以提高开发效率。

库又分为静态库与动态库。

#### 静态库

静态库在Linix系统中通常以.a作为后缀，而在Windows中以.lib作为后缀。

静态库在链接过程中将自身拷贝到最终的可执行文件中，因此可执行文件运行时并不需要该库参与。即使用静态库生成的文件是独立的，并不依赖于它所使用的静态库。这无疑为软件的分发提供了很大的方便。

另一方面，这样的使用方式令生成程序所需时间大大增加，同时大幅增加了可执行文件的体积。且每当库发生改动时就要重新生成整个程序。不利于开发。

#### 动态库

动态库在Linux系统中通常以.so作为后缀，在Windows中以.dll作为后缀。

动态库在链接过程中不把自身拷贝到可执行文件中，而是写入一些重定位和符号表信息。这样生成的可执行文件运行时必需要有库的存在，否则无法运行。这给分发软件造成了一些目标机器环境配置的麻烦。

然而，动态库大大缩减了链接所需时间和可执行程序的体积，在接口没有改动时即使改动了库文件也无需重新生成可执行文件，实现了增量修改。给开发带来了很大的便利。

#### 小结

1. 静态链接的可执行文件可以独立运行，而动态链接不可以。
2. 静态链接的可执行文件体积通常大于动态链接。
3. 静态链接的链接速度小于动态链接
4. 静态链接的可执行文件运行效率略高于动态链接
5. 库文件发生改动时，静态链接生成的可执行文件必需重新生成，而动态链接不用。

## 静态库的生成与使用

### 编写静态库源码并生成目标代码

创建静态库文件夹static，并新建静态库源代码./static/test.cc

```cpp
// ./static/test.cc
#include <iostream>
void Say_Hello()
{
    std::cout << "Hello Static Library!" << std::endl;
}
```

编译源码，生成目标文件test.o

```bash
g++ -c ./static/test.cpp -o ./static/test.o
```

### 将目标代码打包成库文件

```bash
# 库通常以libxxx.a命名
ar -rcs ./static/libtest.a ./static/test.o
```

### 为使用者提供接口

```cpp
// ./static/test.h
void Say_Hello();
```

### 使用静态库

创建main.cc

```cpp
// ./main.cc
#include "./static/test.h"
int main()
{
    Say_Hello();
    return 0;
}
```

生成并运行可执行文件

```bash
# -L指定库所在路径，-l指定库名称无需lib与后缀
g++ -o main main.cc -L./static -ltest
./main
```

运行结果

``` none
Hello Static Library!
```

## 动态库的生成与使用

### 编写动态库源码并生成目标代码

创建静态库文件夹dynamic，并新建静态库源代码./dynamic/test.cc

```cpp
// ./dynamic/test.cc
#include <iostream>
void Say_Hello()
{
    std::cout << "Hello Dynamic Library!" << std::endl;
}
```

### 制作动态库

```bash
# 动态库通常以libxxx.so命名
g++ ./dynamic/test.cc -fPIC -shared -o libtest.so
```

### 为使用者提供接口

```cpp
// ./dynamic/test.h
void Say_Hello();
```

### 使用动态库

创建main.cc

```cpp
// ./main.cc
#include "./dynamic/test.h"
int main()
{
    Say_Hello();
    return 0;
}
```

生成并运行可执行文件

```bash
# -L指定库所在路径，-l指定库名称
g++ -o main main.cc -L./dynamic -ltest
./main
```

运行结果

```none
./main: error while loading shared libraries: libtest.so: cannot open shared object file: No such file or directory
```

找不到`libtest.so`，这是因为linux是通过`/etc/ld.so.config`文件中的路径搜寻动态库的。解决方法：

1. 把`libtest.so`所在的路径添加进`/etc/ld.so.config`，再运行`idconfig`更新目录，程序就可以正常运行了。
2. 把`libtest.so`复制到`/usr/lib`，再运行程序。
3. 改变坏境变量`export LD_LIBRARY_PATH=./dynamic`，再运行程序。

由于这个程序仅作实验用，故不推荐用前两种方式改动系统设置。此处用方法3:

```bash
export LD_LIBRARY_PATH=./dynamic
./main
```

运行结果

```none
Hello Dynamic Library!
```

## 总结

库是将源码打包而形成的，以链接进其它程序的方式进行使用的文件形式。分为静态库和动态库。静态库具有链接慢，空间成本高，不易更新的缺点，优点是能够生成独立的可执行文件。动态库易于更新扩展，链接快，空间成本低，但生成的文件必需依赖库运行。
