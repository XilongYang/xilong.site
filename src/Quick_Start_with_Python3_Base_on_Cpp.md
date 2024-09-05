---
title: 基于C++的Python3入门笔记
author: Xilong Yang
date: 2020-06-07 
---

<div class="abstract">

### 前言

虽然Python与C++有众多区别，但基本上同属命令式语言（甚至Python的解释器是C++实现的），因此在不求深入学习Python时记住一些基础语法差异即可大概使用。

</div>

$$toc$$

## 基本区别 

python中以缩进（4个空格）而不是花括号区分代码块。

python中以换行而不是分号区分语句

python中不需要main函数，从代码第一行开始执行

### 注释

```python
# 单行注释：井号+空格
# 多行注释本质上是野生三引号字符串
'''
多行注释1:三个单引号
'''
"""
多行注释2:三个双引号
"""
```

## 变量

### 数值

python是动态类型语言，定义变量时无需指定类型，且程序运行过程中可改变类型。

```python
i = 1
f = 2.3
str = 'string'
f = 'change to string'
```

### 字符串



```python
# 单引号
'Hello""Wo\'\'rld' # Hello""Wo''rld
# 双引号
"Hello''Wo\"\"rld" #Hello''Wo""rld
# 单双引号唯一的区别是其中包含哪种引号时需要转义
# 三引号包含单双引号都不用转义，可作注释用
```

格式化

```python
# 占位符
'Hello,%s %d %.2f, %02d' % ('World!', 123, 3.14159, 1) # Hello,World! 123 3.14 01
# format(),用{0}{1}...当占位符
'Hello,{0}:{1:.1f}'.format('World!', 3.14159) # Hello,World:3.1
```

### list、tuple和dict、set

#### 定义

```python
# []、()、{}、([])
# list用[]定义, 可变长，可变元素值，可用下标位序取值
l = [1, 2, 3, 4]
# tuple用()定义，不可变长，不可变元素值，可用下标位序取值
t = (1, 2, 3, 4)
t1 = (1, ) # 若无逗号则为整数1
# dict用{}定义， 类似c++的map; set用([])定义，类似set
d = {a:1, 2:b, 3:c} # d[a] = 1, d[2] = b, d[3] = c
s = ([1, 1, 2, 2, 3, 4]) # set自动去重，s = {1, 2, 3, 4}
```

#### 操作

1. list
   1. l.append(): push_back
   2. l.pop():pop_back
   3. l.pop(i):erase(i)
   4. l.insert(pos, vue)
2. dict
   1. 'keyvalue' in d //d中是否存在key值为‘keyvalue’
   2. d.get('keyvalue', -1) //无'keyvalue'时返回-1，没有第二个参数则无返回值
   3. d.pop('keyvalue') //删除keyvalue
3. set
   1. add(key)
   2. remove(key)

## 运算符

* 算术运算符：+    -    *    /    %    **(幂)    //(整除)
* 比较运算符：==    !=    >    <    >=   <=
* 赋值运算符：=    算术=
* 位运算符：&    |    ^    ~    <<    >>
* 逻辑运算符：and    or    not
* 成员运算符：in    not in
* 身份运算符：is    is not //判断两对象地址是否相同

##  分支与循环

```python
# if-else语句
if condition:
    pass # 占位用关键字，不执行任何操作
elif condition:
    pass
else:
    pass
# 范围for
for x in l:
    pass
# 可用range(10)生成0-9的列表
# while
while condition:
    psss
```



## 函数

```python
def Add(x, y):
    return x+y

def Dont_Do_Anything(x, y)
	return x, y
#隐式返回一个元组

def Default_Function(x, y=2)
	return x**y;
#默认参数

def Add_End(L)
	L.append('End')
    return L
#多次调用会出现{End, End, End}，原因：参数并非临时变量，故而改进

def Add_End_Fixed(L=None)
    if L is None:
        L = []
    L.append('End')
    return L

def Calc(*numbers)
	sum = 0
	for x in numbers:
        sum += x
    return sum
#可变数量参数，隐式生成一个tuple, 已有list或tuple可直接前加*传入

def person(name, age, **kw)
	if 'key' in kw:
        pass

# 关键字参数，调用时连关键字一同写入，如person('Jack', 23, city='Heaven')
def person(name, *, city, age)
	pass

def person(name, *age, city)
	pass
# 命名关键字参数，跟在可变数量参数或一个空*参数后，只能传入指定关键字
```

## 类

```python
class My_Class(object):
    def __init__(self, name, score): # 前后各2下划线，类内任何函数首参数都为self
        self.name = name
        self.__score = score #前置2下划线则私有，仍可通过._My_Class__score访问
    def Get_Name(self):
        print(self.name)
    Sex = 'Male'
# 括号内表示父类，object是python中的根基类；__init__()相当于构造函数
# 构造函数外的属性相当于static成员

mc = MyClass('Jack', 70)
mc.age = 10
# 通过构造函数来实例化类对象，可以给对象添加属性
# 使用del mc.age删除属性

class Mumei(My_Class):
    def Get_Name(self):
        print(self.__score)
# 子类通过定义同名函数来重载基类函数
# 用函数isinstance(a, type)判断对象的类型是否为type， 使用type(a)得到对象类型
# 使用dir(a)获得对象的所有属性和方法
# 使用hasattr(obj, 'sth')判断是否有属性sth
# 使用getattr(obj, 'sth')取属性地址

def Name(MC):
    MC.Get_Name()
    
mumei = Mumei('Tom', '2')
Name(mc)
Name(mumei)
# 对基类和子类通用

other = Other_Class('Jerry')
Name(other)
# 任何有Get_Name的对象都可调用
```

## 高级特性

### 切片

取一个list或tuple的部分元素

```python
L = [1, 2, 3, 4, 5]
L[0:2] # 取{1, 2}即下标范围[0,2)的元素
L[:2] # 第一个参数为0时可省略
L[-1] # 取倒数第一个元素
L[-2:-1] # 取倒数两个元素
L[-2:] #-1可省略
```

### 列表生成式

用[express]生成一个列表

```python
[x * x for x in range(1, 11)] # 1x1,2x2...10x10
[x * x for x in range(1, 11) if x % 2 == 0] # 2x2,4x4...10x10
[m + n for m in 'ABC' for n in 'DEF'] # ABC与DEF的全排列
# 当if出现在for后面时，不可带else
# 当if出现在fot前面时，必须带else
```

### 生成器

生成器仅存储一个生成方法而不是具体对象，有肋于节省空间。

方法1: 用(express)生成一个生成器(generator)

```python
g = (x * x for x in range(10))
for n in g:
    print(n)
```

方法2: 用函数来生成一个生成器

```python
# 输出斐波那契数列的函数如下
# a, b = b, a + b => a, b = (b, a + b) => a = b  b = a + b(a与b的值同时改变)
 def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        print(b)
        a, b = b, a + b
        n = n + 1
    return 'done'

#把上述函数改成generator, 仅需将print(b)换成yield b
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'

f = fib(6)
for n in f:
    print(n)
```

