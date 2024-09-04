---
title: 从零开始的Haskell（三）——递归模式、多态和Prelude
author: Xilong Yang
date: 2021-09-03 
---

<div class="abstract">

### 前言

这是系列的第三篇，主要对Haskell中的递归模式、多态性和Prelude进行介绍。学习本篇内容可以大幅减少代码的重复现象。

之前的学习可能会使你产生Haskell程序员会花费大量的时间去编写复杂的递归函数。其实有经验的Haskell程序员几乎不使用递归函数。

为什么会这样呢？因为递归函数实质上是对递归模式的反复处理。通过将这些递归的模式抽象出来，封装成库，就使得程序员免于过多的与底层细节纠缠，从而在更高的层次进行思考——这就是全麦编程思想的目标。

</div>

$$toc$$

## 递归模式

一个关于`Int`类型的列表可以定义为：

```haskell
data IntList = Empty | Cons Int IntList
  deriving Show
```

我们可能对这个列表进行哪些操作呢？可能有这些：

* 对每一个元素分别进行某种操作。
* 基于某种判断保留列表中的一些元素并抛弃其它元素。
* 通过某种方式对列表中的元素进行“概括”，如获取所有元素的最大值，总和，乘积等。

### 映射（Map）

考虑第一种操作，对每个元素进行特定操作，即为映射操作。比如对每个元素取绝对值，可以写成如下形式：

```haskell
absAll :: IntList -> IntList
absAll Empty = Empty
absAll (Cons x xs) = Cons (abs x) (absAll xs)
```

如果要对每个元素做平方运算呢？可以写成如下形式：

```haskell
squareAll :: IntList -> IntList
squareAll Empty = Empty
squareAll (Cons x xs) = Cons (x*x) (squreAll xs)
```

有没有发现些许违和感？是的，这两个函数实在太像了，看起来非常啰嗦。我们可以用一个`Int->Int`类型的函数来指定这些操作，并且使用一个接受对应参数的函数来处理列表：

```haskell
square :: Int -> Int
square x = x * x

mapIntList :: (Int -> Int) -> IntList -> IntList
mapIntList _ Empty = Empty
mapIntList func (Cons x xs) = Cons (func x) (mapIntList func xs)
```

此时就可以通过：

```haskell
-- list是一个IntList
mapIntList abs list
mapIntList square list
```

来分别实现`absAll`和`squareAll`的功能了。

### 筛选（Filter）

考虑第二种操作，即通过某种判断保留列表中的一些元素并抛弃其它元素，即为筛选。比如仅保留列表中的偶数：

```haskell
evenOnly :: IntList -> IntList
evenOnly Empty = Empty
evenOnly (Cons x xs)
    | even x = Cons x (evenOnly xs)
    | otherwise = evenOnly xs
```

同样，我们可以对这种操作进行抽象，令它成为一个接受`(Int -> Bool)`类型与`IntList`类型参数的函数：

```haskell
filterIntList :: (Int -> Bool) -> IntList -> IntList
filterIntList _ Empty = Empty
filterIntList func (Cons x xs)
    | func x = Cons x (filterIntList xs)
    | otherwise = filterIntList xs
```

此时即可通过下面代码实现`evenOnly`的功能了：

```haskell
-- list是一个IntList
filterIntList even list
```

### 折叠（Fold）

第三种操作，获取一个列表的某种“概括”，即为折叠操作。我们将在下一篇对折叠操作进行详细讨论。

## 多态

通过上一节递归模式的抽象，我们可以漂亮的处理对`Int`列表的映射与筛选了。然而，我们要如何处理一个`Integer`、`Bool`、`String`甚至是`一个String的栈的树的列表的列表`的列表呢？如果为每个类型都写出对应的实现，那么你会发现除了操作的类型外这些函数完全一样。为了解决这个问题，我们需要使用Haskell中的多态。

### 多态的数据类型

```haskell
data List t = E | C t (List t)
```

这里的`t`叫做类型变量，可以表示任何类型，**类型变量必须以小写字母开头**。

### 多态函数

有了多态的数据类型，我们就可以写出多态的函数了。比如一个接收任何类型列表的折叠：

```haskell
filterList _ E = E
filterList func (C x xs)
    | func x = C x (filterList xs)
    | otherwise = filterList xs
```

那么filterList的类型是什么呢？通过ghci查询结果如下：

```haskell
:t filterList
filterList :: (t -> Bool) -> List t -> List t
```

可见一个多态数据类型在使用时也要接受一个类型变量作为参数。如：

```haskell
a :: List Bool
a = C True (C False (C True E))
```

## Prelude

[Prelude](https://downloads.haskell.org/~ghc/latest/docs/html/libraries/base-4.15.0.0/Prelude.html)是一个所有Haskell程序都默认包括的模块，定义了很多常用的多态数据类型和多态函数。例如`filter`和`map`就是`filterList`和`map`在`Prelude`中的对应版本。另外，`Data.List`模块中定义了一个更强大的`List`类型。

此外，一个常用的多态数据类型是`Maybe`，定义为：

```haskell
data Maybe a = Nothing | Just a
```

一个`Maybe`类型可以是`Nothing`或一个类型的值，模块`Data.Maybe`中定义了关于`Maybe`的操作。

## 全函数与偏函数

考虑一个`[a] -> a`类型的函数，如`head`。它返回一个列表的首元素，如果它接受一个空列表，就会出错。这样无法处理所有合法参数的函数，就被称为偏函数。对应地，一个无论参数取值如何都能正常工作的函数称为全函数。

### 偏函数转化为全函数

比如`head`的实现如下：

```haskell
head :: [a] -> a
head (x : _) = x
```

`head`作为一个不安全的函数是不应该出现在`Prelude`里的，这是一个失误。我们应该尽可能地不用偏函数。如果要将head转化为一个全函数，只需使用上面的`Maybe`：

```haskell
headSafe :: [Maybe a] -> Maybe a
head [] = Nothing
head (x : _) = Just x
```

尽可能地使用全函数可以大大减少我们犯错的可能。
