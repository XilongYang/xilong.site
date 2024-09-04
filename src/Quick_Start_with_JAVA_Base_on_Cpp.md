---
title: 基于C++的Java入门笔记
author: Xilong Yang
date: 2021-09-19
---

<div class="abstract">

### 前言

Java的语法和C++实在是很相似，这一方面方便了C++选手们上手Java，另一方面也使得我们在使用Java的时候总是串语法。不得不写篇文章总结一下Java的语法差异。

</div>

$$toc$$

## 基本概念

Java分为三个版本：SE（Standard Edition）、EE（Enterprise Edition）和ME（Micro Edition）。

Java有三个重要工具：JRE（Java Runtime Environment）、JDK（Java Development Toolkit）和JVM（Java Virtual Machine）。其中JDK是开发中使用到的工具集；JRE是运行Java程序所必需的环境，它包括了JVM和一些类库等文件。

Java程序后缀为`.java`通过将其编译为后缀`.class`的字节码文件，交由JVM运行。

## 语言特性

Java是一个静态弱类型语言。即一个变量声明后就不可以改变类型，并且语言支持隐式类型转换。Java虽然是弱类型，但没有完全弱，它仅支持小类型向大类型的隐式类型转换，换言之，不存在精度丢失的问题。

同时Java中并不存在指针类型，对于大类型的处理策略是**默认为引用**，同时语言带有GC系统。这大大减少了程序员的心智负担，但同时也带来了深浅拷贝这样的需要留意的问题。

同C++相比，Java牺牲了不少运行效率。因此具体场所使用Java还是C++还需自行斟酌。不过这个时代需要极高性能的场所正在渐渐减少，且语言性能带来的提升很多时候比不上一个更优秀的算法带来的提升。

总体而言，Java是一门非常实用的语言，能带来更高的开发效率和更少的折磨。

## 程序结构

Java中的任何函数或变量都必须定义在类里，不允许出现类外的全局变量。

Java程序以一个函数签名为`public static void main(String args[]）{}`的函数为入口。这个函数同样要定义在一个类里。

### 编译单元

一个`.java`文件就是一个编译单元，每个编译单元中只能有一个`public`类。这个`public`类的名字必须与`.java`文件的名字相同。编译单元中的其它类由于不能声明为`public`，只能在编译单元内访问与使用。

### 包(Package)

Java并不存在头文件源文件之分，所有类都定义在`.java`文件中。这样的结构会引发一个经典问题——命名冲突，于是Java引入了`包(Package)`的概念，同时引入了`import`关键字用以指定一个包中的类的简称。

系统中会为每个包建立文件夹，以避免文件重名。

这其实和C++的`namespace`与`using`比较相似。不过存在一些区别：

1. 包可以嵌套，但是每个包的命名空间是独立的。也就是说不存在C++中可以访问上层命名空间中的名字的情况。
2. `import`只取`using`的声明这一层含义，并不能给类型起别名。

使用：

```java
// 编译单元开头声明，表示该编译单元属于此包
package name1[.name2.name3 ... .namen];

import name1[.name2.name3 ... .classname]; // 使用classname代替其全称。
import name1[.name2.name3 ... .*] //对包内所有public类，使用类名代替全称。
```

同时，由于包之间是独立的，默认包中的类将不能被其它包中的类访问。

## 基础语法差异

### 类型

`char`是一个16位的Unicode字符，表示一字节长的类型叫`byte`。

`boolean`类型并非数值类型，其值为`true`或`false`，不可以进行算数运算。

自动类型转换仅出现在不损失精度的运算中，大类型转小类型要使用强制类型转换，语法与C类似。

### 运算符

`<<`: 丢弃最高位，0补最低位。

`>>`: 符号位不变，高补符号位。

`>>>`：忽略符号位，0补最高位。

`instanceof`：二元中缀运算符，检测左边对象是否为右边指定类型。

### 修饰符

`default`：什么也不写，同一包内可见。

`public`：所有包可见。

`private`：同一类可见。不能修饰外部类。

`protected`：同一包内所有子类skmb。不能修饰外部类。

`static`：用以声明独立于类的变量与函数。不可以修饰局部变量。

`final`：变量不能变、函数不能重写、类不能继承。

`abstract`：声明抽象方法与抽象类，与`final`冲突，有抽象方法的类一定是抽象类。

`synchronized`：同一时间仅能被一个线程访问。

`transient`：使变量跳过序列化。

`volatile`：用来修饰需线程同步的变量。

### 表达式和语句

不产生任何副作用的表达式不是语句。

```java
int i = 0;
i;  // 非法，表达式没有任何副作用。
i++; // 合法，改变了i的值。
```

### 函数/方法

```java
<修饰符> 返回值类型 方法名(参数) {
    ...
    return value;
}
```

### 类

```java
<修饰符> 类名 {
    ...
} // 花括号后没有分号
```

构造函数名称与类名相同。

析构函数统一为`protected void finalize() {...}`。

`this`是自身的引用。`super`是直接基类的引用。

## 面向对象

Java作为一门面向对象语言，引入了一些特性来提供更好的面向对象支持。除了基本类型的对象外，对象一律使用`new`来声明。因为有GC机制，并不需要使用`delete`来手动释放对象。

Java中没有提供指针，为了解决类的拷贝开销过大问题，默认使用引用的方式来使用类。换言之，用`new`声明的对象都可以看作限制版的指针。传参的时候就要注意实际上传的是值还是引用。

这时就出现了一个问题，要使用引用类型的副本可以手动拷贝一份，可是要使用值类型的引用时怎么办呢？比如一个简单的交换：

```cpp
// 使用C++可以使用引用与指针两种方式实现。
void swap(int &a, int &b) {
    int tmp = a;
    a = b;
    b = tmp;
}

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}
```

而Java里既不能使用引用也不能使用指针，就比较棘手。只能曲线救国，将基本类型封装到引用类型里，比如一个类或者数组：

```java
class Pair {
    public Pair(int fst_, int snd_) {
        fst = fst_;
        snd = snd_;
    }
    int fst;
    int snd;
}
// 此时可以使用Pair传递两个值并交换了。
void swap(Pair p) {
    int tmp = p.fst;
    p.fst = p.snd;
    p.snd = tmp;
}
// 但这样写并不如直接在Pair类里写成员函数自然。
class Pair {
    ...
    void swap() {
        int tmp = fst;
        fst = snd;
        snd = tmp;
    }
}
```

这样看来传基本类型的引用基本上是一个伪需求。

### 数组

数组使用`type[] var = new type[size]`来声明。等号左边也可以写成C风格的`type var[]`，但不推荐。也可以使用`type[] var = {...}`的方式来更方便的使用。

数组提供`length`成员保存大小。

数组的一些常用操作以`static`方法的方式提供在`java.util.Arrays`类中。

### 继承

 Java不支持多继承，即一个类只能有一个父类。子类继承父类的非`private`方法。子类使用`extend`关键字继承父类。

Java中所有类都是`java.lang.Object`类的子类。

### 重写与重载

子类可以重写父类的函数，可以理解为所有函数都是虚函数，而`abstract`函数相当于纯虚函数。

### 抽象类与接口

含有任何`abstract`函数的类或被显式声明为`abstract`的类为抽象类，抽象类不能被实例化的类。

接口使用`interface`声明，是一个抽象方法的集合。接口可以使用`extends`来继承其它接口，允许多继承。

```java
[可见度] interface [名称] [extends 其它接口名] {
    // 抽象方法，隐式指定为public abstract，同时也只能是这种类型。
    // 变量，隐式指定为public static final，同时只能是这种类型。
}
```

类可以通过`implements`关键字实现接口。抽象类可以不实现接口中的方法，但普通类必需全部实现。

## 异常处理

使用`try-catch-finally`语句块来处理异常：

```java
try {
} catch (异常类型 变量名) {
} catch (异常类型 变量名) {
} final { 
} // catch数量大于等于1个，final是可选的，处理未被catch的类型异常。
```

程序中使用`throw`抛出异常，一个可能抛出异常的函数要使用`throws`声明可能抛出的异常的类型。

```java
public void test() throws RuntimeException {
    throw new RuntimeException();
}
```

## 泛型

### 声明

泛型这个概念是C++的模板带来的，因此声明语法上也大差不差。但有两点不同：

1. 参数只能是类型，不能是值。
2. 参数必需是引用类型， 不能是基础类型。

**泛型类/接口**

```java
class name <T1, T2,...,Tn> {...}

interface name <T1, T2,...,Tn> {...}
```

**泛型函数**

``` java
public <T> T func(T obj) {}
```

### 类型擦除

Java的泛型是使用类型擦除的方式实现的，运行时丢失所有类型信息。因此不能使用与类型有关的操作，如：转型、`instanceof`和`new`。这也意味着，泛型类无法向上转型。

```java
Integer ---> Object
ArrayList<Integer> ---> List<Interger>
List<Integer> -x--> List<Object>
```

`Integer`继承了`Object`，可以转为`Object`。`ArrayList`继承了`List`，可以转为`List`。但`List<Integer>`不能转为`List<object>`。

因为泛型类并不存在独有的Class对象，即不存在`List<Object>.class`或`List<Integer>.class`，编译器会将两者都视为`List.class`。

### 类型边界

可以使用`extends`限制类型必需是某个类的子类或实现了哪些接口：

```java
<T extends A & B & C> // 可以有多个限制，使用&隔开。只有第一个限制可以是类，其它的必需是接口。
```

### 类型通配符

使用泛型类实例时可以通过通配符匹配类型，如：

```java
List<?>; // 可以是任何类型
List<? extends A & B & C>; // 匹配A & B & C的子类或实现
List<? super S> // 匹配S的父类
```

可以使用通配符实现向上转型：

```java
List<Integer> intList1 = new ArrayList<>();
List<Number>  numList1 = intList1; // Error

List<? extends Integer> intList2 = new ArrayList<>();
List<? extends Number>  numList2 = intList2; // OK
```

