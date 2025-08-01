---
title: 从零开始的Haskell（二）——ADT
author: Xilong Yang
date: 2021-07-17
---

这是系列的第二篇，主题是ADT：代数数据类型。

## 前言：关于Haskell与数学基础

网上冲浪时看见很多类似于“学好Haskell一定要学会抽象代数和范畴论”这类的言论，这一度动摇了我学习Haskell的信心，考虑着是不是先学习相关的数学理论。后来想了想，或许学好Haskell一定要学会这些，但在入门阶段并不需要过于在意其中的数学原理，先上手再说。

就像我们学习C++的过程中，操作系统、计算机组成和数据结构相关的知识是非常有帮助的。了解了整个计算机体系后，理解C++的涉及底层的概念会非常容易。但我们也不必因此在入门阶段就直接去学习整个计算机原理。

于是废话说完，开始这次的Haskell之旅。

## 枚举类型

Haskell使用如下语法创建枚举（Enum）类型：

```haskell
data Thing = Shoe
           | Ship
           | SealingWax
           | Cabbage
           | King
  deriving Show
```

这段代码定义了一个名为`Thing`的类型，它有5个值构造器（data constructors），这些值构造器就是`Thing`可能拥有的值。

`deriving Show`为`Thing`加载了显示功能，这使得它可以被当做字符串打印，这其中的细节之后再说。

```haskell
-- 使用Thing
-- 作为变量
shoe :: Thing
shoe = Shoe
-- 作为列表类型
listOfThings :: [Thing]
listOfThings = [Shoe, Ship, SealingWax]
-- 作为函数参数
isSmall :: Thing -> Bool
isSmall Shoe       = True
isSmall Ship       = False
isSmall SealingWax = True
isSmall Cabbage    = True
isSmall King       = False
```

可以看到枚举类型的用途和我们在其它语言中用到的enum很相似。

## 不只是枚举

其实在Haskell中，枚举类型只是一个ADT（Algebraic Data Types，代数数据类型）的特例。下面是一个不是枚举类型的ADT：

```haskell
data FailableDouble = Failure
                    | OK Double
  deriving Show
```

这个`FailableDouble`类型有两个值构造器，第一个值构造器`Failure`不接受参数，所以它本身就是`FailableDouble`的值；而第二个值构造器`OK`接受一个`Double`类型的参数，因此它本身并不成为`FailableDouble`的值，需要加上一个`Double`才能做为值。比如：

```haskell
ex01 = Failure
ex02 = OK 3.4
```

思考：`OK`的类型是什么？

它看起来像接收一个`Double`，返回一个`FailableDouble`的函数，用起来也像这样一个函数，那么我说，它就是一个`Double -> FailableDouble`类型的函数。

既然值构造器的类型是函数，那么理所当然地，**值构造器可以接受多个参数**。由此可以创建一个这样的类型：

```haskell
data Person = Person String Int Thing
  deriving Show
```

注意这里的两个`Person`是不同的，等号左侧的`Person`称为类型构造器，用于指代类型；而等号右侧的`Person`是一个与类型构造器同名的值构造器，用于生成一个具体的`Person`类型的值。比如：

```haskell
brent :: Person                      -- 类型构造器，说明类型
brent = Person "Brent" 31 SealingWax -- 值构造器，生成一个值
```

这还导致了一个有趣的现象，就是你在类型声明中使用的永远是类型构造器，而在需要这个类型的值的地方使用的永远是值构造器。

## 一般形式的ADT

通常一个ADT有一个或多个值构造器，而每个值构造器接收一个或多个参数。

```haskell
data ADT = Constr1 Type11 Type12
         | Constr2 Type21
         | Constr3 Type31 Type32 Type33
         | Constr4
{-
声明了一个名为ADT且含有4个值构造器的ADT，这四个值构造器分别接受不同数量的不同类型参数。
-}
```

注意：类型构造器与值构造器的标识符永远以大写字母开头，而变量（包括函数）永远以小写字母开头。

## 模式匹配

根本上，模式匹配就是通过找出值构造器来对值进行分解。比如说，要想对上一节定义的类型`ADT`中的值进行操作，我们只要这样写：

```haskell
foo (Constr1 a b)   = ...
foo (Constr2 a)     = ...
foo (Constr3 a b c) = ...
foo Constr4         = ...
```

注意这里使用a、b、c为值命名，以及接受参数的值构造器要包围在括号里。

这就是模式匹配的主要思想了，但还有一些值得注意的地方：

1. 下划线`_`可以匹配任何东西。

2. x@pat形式的模式可以在以pat匹配值的同时用x匹配整个值。例：

   ```haskell
   baz :: Person -> String
   baz p@(Person n _ _) = "The name field of (" ++ show p ++ ") is " ++ n

   {-
   运行：baz brent
   结果："The name field of (Person \"Brent\" 31 SealingWax) is Brent"
   -}
   ```

3. 模式可以嵌套。例：

   ```haskell
   checkFav :: Person -> String
   checkFav (Person n _ SealingWax) = n ++ ", you're my kind of person!"
   checkFav (Person n _ _)          = n ++ ", you favorite thing is lame."
   ```

   注意这里的`Person`和`SealingWax`是嵌套的模式。

注意，对于像`2`和`'c'`这样字面值，可以看做是一个不接受参数的值构造器。

## case表达式

case表达式是Haskell中一个用于模式匹配的基础结构：

```haskell
case exp of
  pat1 -> exp1
  pat2 -> exp2
  ...
```

其机制为使用exp从上而下地依次匹配模式，表达式的值为第一个匹配成功的模式对应的表达式的值。例：

```haskell
failureToZero' :: FailableDouble -> Double
failureToZero' x = case x of
                    Failure -> 0
                    OK d -> d
```

## 递归数据结构

数据结构可以是递归的，即自己可以是自己的组成部分。比如：

```haskell
-- 定义一个`Int`类型的列表
data IntList = Empty | Cons Int IntList

-- 定义一个二叉树
data Tree = Leaf Char
          | Node Tree Int Tree
  deriving Show

lst :: IntList
lst = Cons 1 (Cons 2 Empty)

tree :: Tree
tree = Node (Leaf 'x') 1 (Node (Leaf 'y') 2 (Leaf 'z'))
```

