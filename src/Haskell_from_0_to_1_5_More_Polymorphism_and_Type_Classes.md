---
title: 从零开始的Haskell（五）——更多多态与类型类
author: Xilong Yang
date: 2021-09-10 
---

系列第五篇，介绍更强的多态性和类型类。

Haskell关于多态性的一个广为人知的特点是参数多态，即一个多态函数对任何类型的输入都应该有一个一致的行为。这个特性导致了许多有趣的隐患，对程序开发者和多态函数的使用者皆有影响。

## 参数化

考虑如下类型：

```haskell
a -> a -> a
```

记住`a`是一个能代表任何类型的类型变量。哪些函数是这种类型？下面这个函数怎么样？

```haskell
f :: a -> a -> a
f x y = x && y
```

这个函数是无法工作的，即使它符合语法。因为无法通过类型检查。我们可以获取以下报错信息：

```none
• Couldn't match expected type ‘Bool’ with actual type ‘a’
  ‘a’ is a rigid type variable bound by
    the type signature for:
      f :: forall a. a -> a -> a
    at test.hs:1:1-12
• In the first argument of ‘(&&)’, namely ‘x’
  In the expression: x && y
  In an equation for ‘f’: f x y = x && y
```

无法工作的原因是多态函数的调用者可以选择类型，而这个我们——函数的实现者——已经选择了一个特定的类型（Bool），但我们仍可能接收到一个`String`，或`Int`甚至是一个用户自定义类型。因此这个函数无法工作，换言之，你可以将类型声明视为一个保证，`a->a->a`保证这个函数无论接收了什么类型的参数都可以正常工作。

为了处理这种情况，我们或许为想到类似这样的处理方式：

```none
f a1 a2 = case (typeOf a1) of
   Int  -> a1 + a2
   Bool -> a1 && a2
   _    -> a1
```

这里`f`为特定类型定义特定的行为，我们可以使用C++实现出一个这样的函数：

```cpp
#include <type_traits>
#include <iostream>

using std::is_same;
using std::cout;
using std::endl;

template <typename T>
T f(T a1, T a2) {
    if (is_same<T, int>::value) {
        return a1 + a2;
    } else if (is_same<T, bool>::value) {
        return a1 && a2;
    }
    return a1;
}

int main() {
    cout << f(2, 3) << " ";
    cout << f(true, false) << " ";
    cout << f(2.1, 3.0) << endl;
	return 0;
}

// 运行结果为： 5 0 2.1
```

但这种方式在Haskell中是行不通的，Haskell并没有类似`is_same`的类型检查函数，这主要是因为Haskell是一种静态强类型语言，在通过编译期类型检查后Haskell就不再保留任何类型信息了。同时我们即将看到一个更好的理由。

C++与Java中对多态的支持主要是通过泛型提供的，而泛型编程这一思想正是受到Haskell的启发而诞生的。言归正传，什么样的函数可以是`a -> a -> a`类型的？其实只有两个函数可以：

```haskell
f1 :: a -> a -> a
f1 x y = x

f2 :: a -> a -> a
f2 x y = y
```

来做一个参数化游戏！考虑以下的多态类型，确定每种类型可能具有的行为方式。

* `a -> a`

  这类型的函数仅可能是接受一个参数并返回参数本身的函数。

* `a -> b`

  这类型的函数很难写出来，因为它的含义不是“接受一个任意类型的参数并**任意返回一个类型**的值”，而是“接受一个任意类型的参数并**返回一个任意类型**的值”。也就是说这个返回值必须能被视作任意类型。

  可能只有`f _ = undefined`与`f x = f x`符合这个要求。

* `a -> b -> a`

  这个函数可以是一个返回第一个参数并抛弃第二个参数的的函数，如`const`。

* `[a] -> [a]`

  操作列表但不操作元素的函数皆可，比如`f xs = [head xs]`。

* `(b -> c) -> (a -> b) -> (a -> c)`

  `f g h = \x -> g(h x)`，即`.`运算符。也就是对函数进行操作，但不对具体类型进行操作即可。

* `(a -> a) -> a -> a`

  由于函数的返回类型和参数类型相同，符合要求的函数可以是一个自已定义自己的函数，如：`f = f`。

经过这几个例子的思考，你可能会发现，想要实现多态性，就不要对元素进行任何操作。因为你要接受一个任意类型的参数，而无论什么操作，总会有不支持的类型。这并不只是一个约束，同时是一个非常强大的保护。这样严格的类型系统使得函数的使用者可以更放心的调用函数，同时也使得一个函数的类型说明包含了足够大致了解一个函数的信息。

比如你看到一个`a -> a`类型的函数就可以肯定这个函数接受任意接收一个类型的值并返回一个同类型的值，而无需担心其它影响。而一个函数签名为`T func(T)`的C++函数则无法提供如此担保，你可能会担心这个函数对全局状态产生影响，或是传入的类型不对导致程序崩溃。

等等，既然如此，`+`是怎么实现的？对`Integer`的加法和对`Double`的加法完全是两回事，难道不需要判断类型吗？事实上确实不需要判断类型，但也并非什么魔法，看一下`+`的定义：

```haskell
(+) :: Num a => a -> a -> a
```

又见`=>`，还有前面看起来像一个ADT的奇怪符号`Num a`。还有其它几个函数：

```haskell
(==) :: Eq a   => a -> a -> Bool
(<)  :: Ord a  => a -> a -> Bool
show :: Show a => a -> String
```

所以这些符号是什么意思？

## 类型类

揭晓答案的时候到了，`Num`、`Eq`、`Ord`和`Show`都是类型类，并且使用了类型类的函数称为“类型类多态”。类型类是对函数接受的类型的约束，它表示定义了指定操作的类型的集合。同时类型类多态函数仅为符合类型类定义的类型工作。

通俗点说，C++等语言中的函数无论什么参数都得先请进来看看，不合适再请出去，或者一个想不开就崩溃了。而Haskell的函数做为一等公民比较霸道，可以事先对参数类型作一个要求，并且让那些达不到要求的参数爬。这个要求就是类型类，例如`Eq`的定义如下：

```haskell
class Eq a where
  (==) :: a -> a -> Bool
  (/=) :: a -> a -> Bool
```

这个定义可以这么理解：一个接受一个参数的类型类`Eq`，符合`Eq`要求的类型必须定义两个操作：`==`和`/=`。比如要使`Int`成为`Eq`的实例，就必须定义函数`(==) :: Int -> Int -> Bool`和`(/=) :: Int -> Int -> Bool`。再看看`(==)`的定义：

```haskell
(==) :: Eq a => a -> a -> Bool
```

这个定义理解为：一个类型如果是`Eq`的实例，那么对两个参数进行比较并返回比较结果，如果参数不是`Eq`的实例则解释期报错。一个普通多态函数保证对任何类型生效，而一个类型类多态函数仅保证对类型类实例类生效。

需要注意的是，当调用`(==)`时，编译器根据类型选择使用哪个实例。这个机制与C++中的多态比较类似，即根据类型选择合适的实例。

为了更好的掌握类型类的概念，我们来构建一个ADT并使其成为`Eq`的实例。

```haskell
data Foo = F Int | G Char

instance Eq Foo where
  (F i1) == (F i2) = i1 == i2
  (G c1) == (G c2) = c1 == c2
  _ == _ = False
  
  foo1 /= foo2 = not (foo1 == foo2)
```

定义了`==`还要定义`/=`。我们可以修改一下`Eq`的定义，来为`/=`定义一个默认实现模式。

```haskell
class Eq a where
  (==) :: a -> a -> Bool
  (/=) :: a -> a -> Bool
  x /= y = not (x == y)
```

这样就可以仅定义`==`，由默认实现模式去生成`/=`的定义。实际上`Eq`的定义如下：

```haskell
class Eq a where
  (==), (/=) :: a -> a -> Bool
  x == y = not (x /= y)
  x /= y = x == y
```

这个定义可以使我们只用定义`==`与`/=`中的任意一个，但要小心，如果我们一个也没定义就会导致一个无限循环。

对于`Eq`与其它几个比较特殊的类型类，GHC可以为我们自动生成它们的实例，就像我们之前使用过的那样：

```haskell
data Foo' = F' Int | G' Char
  deriving (Eq, Ord, Show)
```

### 类型类与面向对象接口

类型类可能看起来与面向对象语言中的接口比较相似，但它更为强大，体现在：

1. 接口的实例类一但定义就必须实现所有接口，而类型类可以被每个类型自由组合。

2. 类型类在处理多类型时更为强大，目前Java没有简单的方法可以做到：

   ```haskell
   class Blerg a b where
     blerg :: a -> b -> Bool
   ```

3. 并且类型类可以更方便的处理多元运算，如：

   ``` haskell
   class Num a where
     (+) :: a -> a -> a
   ```

   而在Java或C++中，对多元运算符的重载总是以某一个类型为主，比较尴尬。

### 其它标准类型类

`Ord`：确保类型可以被完全排序，在C++中的常见做法是实现`<`运算符。

`Num`：数字类型，使得类型可以进行加减法等运算。一个非常重要的事情是，数字常量也是类型类多态：

``` haskell
Prelude> :t 5
5 :: Num a => a
```

这意味着5可以被用作任何数字类型，包括自己定义的类型。

`Show`：定义模式show，将值转换为`String`类型。

`Read`：`Show`的逆运算。

`Integal`：表示整数类型，如`Int`和`Integer`。

### 类型类实例

这一节我们来定义一个自己的类型类，如下：

```haskell
class Listable a where
  toList :: a -> [Int]
```

`Listable`类型类表示可以转换为`Int`列表的类型。首先，`Int`和`Bool`都可以简单的转换为一个只有一个元素的列表：

``` haskell
instance Listable Int where
  toList x = [x]

instance Listable Bool where
  toList True = [1]
  toList False = [0]
```

我们无需对`[Int]`类型进行转换：

```haskell
instance Listable [Int] where
  toList = id
```

最后，我们也可以将一个自定义类型转换为`[Int]`列表：

```haskell
data Tree a = Empty | Node a (Tree a) (Tree a)

instance Listable (Tree Int) where
  toList Empty = []
  toList (Node x l r) = toList l ++ [x] ++ toList r
```

我们可以使用`Listable`的特性定义其它函数，如：

```haskell
sumL :: Listable a => a -> Int
sumL x = sum (toList x)
```

`sumL`只为`Listable`类型工作，那么下面的函数呢？

```haskell
foo x y = sum (toList x) == sum (toList y) || x < y
```

`foo`的类型为：

```haskell
foo :: (Listable a, Ord a) => a -> a -> Bool
```

即它的参数类型必须同时是`Listable`和`Ord`的实例。

最后，来看一个复杂点的实例：

```haskell
instance (Listable a, Listable b) => Listable (a, b) where
  toList (x, y) = toList x ++ toList y
```

只要类型变量在函数定义中，我们就可以为它指定类型类。注意，这个函数并不是递归函数，调用的`toList x`与`toList y`是其它类型的实例，而不是该函数本身。
