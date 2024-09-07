---
title: Python深拷贝与浅拷贝
author: Xilong Yang
date: 2021-05-15 
---

自从上次略略学习了一些python基础就没怎么用过python了，这次遇到了深浅拷贝问题，在此记录。

## 引子

考虑下面代码：

```python
list1 = []
list2 = list1
list3 = list2

while (some condition):
    list1 = some value
    ...
    if (some condition):
        list2 = some value
    if (f(list3) < f(list2)):
        list3 = list2
        
print(list3)
```

这段代码试图在一些复杂运算中取出最优结果，并将其保存在list3中。由于平时基本是使用C++写程序，我设想它等效于以下C++代码：

```cpp
vector<T> list1;
vector<T> list2 = list1;
vector<T> list3 = list1;

while (some condition) {
    list1 = some value;
    ...
    if (some condition) {
        list2 = some value;
    }
    if (f(list3) < f(list2)) {
        list3 = list2
    }
}
//void print(const vector<T>&), 打印vector中所有元素
print(list3)
```

作为一个与C++相爱相杀近两年的人，我很确信这段代码能完成任务，事实上它的确能。但python代码却总是出错，于是我试图在list3唯一可能被修改的地方打印出它的值。

```python
...
if (f(list3) < f(list2)):
    list3 = list2
    print(list3)
...
print("final:")
print(list3)
```

令人匪夷所思的事情出现了，输出结果居然是：

```
[aaaaaaaaa]
[bbbbbbbbb]
[ccccccccc]
....
[xxxxxxxxx]
final:
[yyyyyyyyy]
```

最后一次赋值后的值居然跟最后输出的值不一样？！几经周折了解到，Python中存在深拷贝与浅拷贝的问题。

## 什么是深拷贝与浅拷贝

简单说，深拷贝就是新建一块内存空间，并将原内存空间中的数据拷贝到新的内存空间中。而浅拷贝不创建内存空间，只令对象引用已存在的内存空间。类比C++的指针：

```cpp
T *a = new T();
T *b;
b = a; // 浅拷贝
b = new T(*a); // 深拷贝
```

这里需要注意，不存在指针的语言中（如Python, Java）引用的含义和C++是不同的，更接近于C++中的指针。C++中的引用只是变量的别名，是不可以更改指向的变量的。而Python中的引用更像是一个自动的指针，可以取值也可以改变所指，并且无需显式指定操作，由语言情景决定改执行哪种操作。

## Python的对象机制

由于python中不存在指针和引用，也就无法像C++那样自由选择值传递或传引用传递。为了避免操作大对象时的巨大开销，python的应对方法是——一切皆引用。即，每个变量实际上都是引用类型，赋值（=）号通常并不新建对象，而是让变量的引用指向指定的地址。

也就是说，上面的程序中list1，list2和list3实际上是同一个对象的不同引用，验证如下：

```python
list1 = []
list2 = list1
list3 = list1
print(id(list1), " " ,id(list2), " ", id（list3)
```

可以看出它们的地址相同，即为同一个对象。那么理所应当地，我们通过哪一个引用改变变量的值都会更改这唯一的地址空间。

这里你可能对一切皆引用这个说法有所质疑，并提出如下例子：

```Python
a = 5
b = a
b = 3
print(a, id(a))
print(b, id(b))
```

输出：

```
5 139656604350896
3 139656604350832
```

这输出似乎与一切皆引用有出入，因为更改b的值既没有影响a的值，a和b的地址也不一样。这里的核心是：语句`b = 3`的语义真的是更改b的值吗？我们对这个例子稍作改动：

```python
a = 5
b = a
print(id(a), " ", id(b))
b = 3
print(id(b), " ", id(3))
```

输出：

```
140143427922352   140143427922352
140143427922288   140143427922288
```

没错，常量3也是一个引用。只不过无法改变它的指向。这里一个事实已经呼之欲出，赋值运算符（=）只改变引用的指向。即只能用作浅拷贝。

## 如何进行深拷贝

那么如何进行深拷贝呢？对一个列表，我们可能会想要使用切片创建新的内存空间：

```python
list1 = [1,2,3]
list2 = list1[:]
print(id(list1), " ", id(list2))
```

这里可以看出list2已经拥有了新的内存空间。但这种方法在处理多层列表的时候，会出现问题：

``` python
list1 = [[1], [2], [3]]
list2 = list1[:]
list1[0][0] = 2
print(list2[0][0])
```

list2的值还是被list1的修改改动了，这是因为list2虽然和list1没有指向同一块地址空间。但其中第一个元素却指向了同一块地址空间。

因此，**深拷贝唯一指定方法：copy.deepcopy()**

