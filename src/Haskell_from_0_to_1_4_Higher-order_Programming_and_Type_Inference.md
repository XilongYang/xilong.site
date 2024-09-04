---
title: 从零开始的Haskell（四）——高阶编程与类型接口
author: Xilong Yang
date: 2021-09-06 
---

<div class="abstract">

### 前言

不幸遭遇飞机延误，候机室写下系列第四篇，主题是高阶编程与类型接口。

</div>

$$toc$$

## 匿名函数（lambda表达式）

设想一下这样的函数，功能仅仅是简单的：保留数列中大于100的数。如：

```haskell
greaterThan100 :: [Integer] -> [Integer]
greaterThan100 [1,2,300,4,245] = [300,245]
```

我们可以使用很棒的方法实现：

```haskell
gt100 :: Integer -> Bool
gt100 x = x > 100

greaterThan100 :: [Integer] -> [Integer]
greaterThan100 xs = filter gt100 xs
```

但我们可能并不希望定义`gt100`这样的只使用一次的函数。此时就可以使用lambda表达式来代替`gt100`：

```haskell
greaterThan100_new :: [Integer] -> [Integer]
greaterThan100_new xs = filter (\x -> x > 100) xs
```

其中`\x -> x > 100`就是一个lambda表达式，它也可以有多个参数，如：

```haskell
-- 结果为6
(\x y z -> x + y + z) 1 2 3
```

lambda已经足够简单了，但这个函数还有一种更好的写法：

```haskell
greaterThan100_newer :: [Integer] -> [Integer]
greaterThan100_newer xs = filter (>100) xs
```

这里的`(>100)`是一个操作片段，操作片段允许我们使用一个函数的部分调用。对于任意一个二元操作符`?`：`(?y)`等价于`\x -> x?y`；`(y?)`等价于`\x -> y?x`。即将缺少的部分作为函数的参数。例如：

```haskell
(>100) 110 -- True
(100>) 110 -- False
map (*2) [1,2,3] -- [2,4,6]
```

## 函数组成

试写出一个类型为`(b -> c) -> (a -> b) -> (a -> c)`的函数。首先我们能知道这个函数的两个参数都是函数，并且该函数的返回值也是一个函数。首先我们给出类型签名：

```haskell
foo :: (b -> c) -> (a -> b) -> (a -> c)
```

试着写出函数的参数：

```haskell
foo f g = ...
```

由于返回值是一个函数，我们可以使用lambda表达式来实现：

```haskell
foo f g = \x -> ...
```

根据类型签名可以看出`x`先由`g`处理再由`f`处理就得到了类型为`c`的值，因此有：

```haskell
foo f g = \x -> f (g x)
```

思考一下，这个函数有什么用？答案是组合两个函数。Haskell中这样的操作是非常常用的，因此语言内置了这个操作，用操作符`.`表示，上式可写为：`f.g`。

题外话，在引入了函数式范式后，C++也能实现类似操作了（什么叫头号粉丝啊，战术后仰.jpg）：

```cpp
#include <functional>

using std::function;

template<typename a, typename b, typename c>
function<c(a)> foo(const function<c(b)> &f, const function<b(a)> &g) {
    return [&f, &g](a x) {
        return f(g(x));
    };
}
```

可见C++在这方面已经挻不错了，不过与真正的函数式编程语言相比仍有些距离。

言归正传，`.`操作乍看起来好像没什么用，但下面这个例子会为其用途提供一个有力的说明：

```haskell
test :: [Integer] -> Bool
test xs = even (length (greatThan100 xs))
-- 可以写作
test' :: [Integer] -> Bool
test' = even.length.greatThan100
```

去掉了层层叠叠的括号和有些累缀的参数后，看起来优雅多了。`.`运算将函数`test'`的定义表示为了几个小函数的组合。接下来让我们再看看`.`运算：

``` haskell
Prelude> :t (.)
(.) :: (b -> c) -> (a -> b) -> a -> c
```

疑点出现了：返回值为什么不是`(a -> c)`?

## 柯里化

回顾我们的函数定义，如：

```haskell
f :: Int -> Int -> Int
f x y = 2*x + y
```

还记得之前说过使用连续的`->`作为参数与返回值的声明背后有非常~~暖心~~优雅的理由吗？现在就是揭晓谜底的时刻了，先说结论：**Haskell中的任何函数都接收一个参数**。等等，难道上面刚定义的函数`f`不是接收了`x`和`y`两个参数吗？确实不是，实际上`f`是接收`x`作为参数，同时返回一个`Int -> Int`型的函数，`y`是作为这个返回函数的参数被接收的。实际上就是lambda演算，之后会单独写一篇文章介绍lambda演算。也就是说，函数`f`的定义等价于：

```haskell
f :: Int -> (Int -> Int)
```

由于`->`符合右结合律，因此上式括号可以不写。这也解释了上一节末尾的疑问。同时，函数调用符合左结合律，因此：

```haskell
f x y = ((f x) y)
```

思考一下，`f x`的类型是一个`Int -> Int`型的函数，而表达式中这个函数又接受了`y`返回一个`Int`。整个运算过程就是将参数逐个输入到对应的函数中，因此使用`->`符号来声明函数再贴切不过了。

## 函数的部分应用

函数的部分调用本质上就是对柯里化的应用，但永远记住每个函数本质上只有一个参数，因此我们**只能对函数的第一个参数进行部分应用**。唯一的例外是中缀函数，正如之前的例子所示，可以对中缀函数两个参数中的任何一个进行部分应用。

由于只能对第一个参数进行部分应用，因此我们的参数顺序应该遵循由普通到特殊的规则。即最容易相同的参数放在最前面。

## 全麦编程

记得一开始介绍过的全麦编程概念吗？站在整体的角度思考问题，考虑如何处理整个列表而不是处理列表中的元素，就像全麦面粉一样，直接对麦子打粉而不考虑脱壳。现在是时候体会下全麦风格的威力了，考虑下面程序：

```haskell
foobar :: [Integer] -> Integer
foobar [] = 0
foobar (x:xs)
    | x > 3 = (7 * x + 2) + foobar xs
    | otherwise foobar xs
```

这个程序的功能看起来很直观，但并不是良好的Haskell风格，主要存在两点问题：

1. 一个程序同时处理了过多的事务。
2. 代码工作得太底层了。

我们可以将其功能实现为：

```haskell
foobar' :: [Integer] -> Integer
foobar' sum . map (\x -> 7 * x + 2) . filter (>3)
```

这样的实现将很多只做好一件事的小函数组合起来，使得函数更加清晰与直观。

## 折叠

增加了许多知识后，我们可以讨论上一节中被搁置的折叠操作了。先来直观体会折叠操作：

```haskell
sum' :: [Integer] -> Integer
sum' [] = 0
sum' (x:xs) = x + sum' xs

product' :: [Integer] -> Integer
product' [] = 0
product' (x:xs) = x * product' xs

length' :: [a] -> Int
length' [] = 0
length' (x:xs) = 1 + length' xs
```

这三个函数的共性是什么？是通过某种方式将元素们组合成一个最终结果。我们可以将其抽象为：

```haskell
fold :: b -> (a -> b -> b) -> [a] -> b
fold z f [] = z
fold z f (x:xs) = f x (fold z f xs)
```

此时函数运算过程可以做如下展开：

```haskell
fold z f [a,b,c] == f a (f b (f c z))
-- 写成中缀形式可能更好理解
fold z f [a,b,c] == a `f` (b `f` (c `f` z))
```

看出来了吗？`fold`函数是把一个列表最右边的两个元素进行组合，并使用组合后的元素代替原来的两个函数，直到列表为空。

有了这个函数，之前的几个函数就可以写为：

```haskell
sum'' = fold 0 (+)
product'' = fold 0 (*)
length'' = fold 0 (\_ s -> s + 1)
```

观察`\_ s -> s + 1`，可以消去两边的`s`，化为`\_ -> (+1)`。

另一种思路是使用`const`函数。`const`函数的类型为`a->b->a`，效果是输入两个参数，并返回第一个参数作为结果（即丢弃第二个参数），和C++的const关键字完全不是一回事。

`\_ s -> s + 1`的作用显然是丢弃第一个参数，并返回第二个参数+1后的值。可写为`const (+1)`。

解说一下：`const (+1)  `是一个对`const`的部分应用，即使用`(+1)`作为`const`的第一个参数，此时这个部分应用变成了接受一个参数并返回`(+1)`的函数。不要忘记`(+1)`本身也是一个部分应用，其类型为`a -> a`，则`const (+1)`的类型就是`b -> a -> a`。符合了我们`fold`函数对参数`f`的要求。

具体举例，对于`f 2 3`，有：

```haskell
-- f = \_ s -> s + 1
f 2 3 == 3 + 1 == 4
-- f = \_ -> (+1)
f 2 3 == (+1) 3 == 4
-- f = const (+1)
f 2 3 == const (+1) 2 3 == (+1) 3 == 4
```

作为一个常用的函数，`fold`在`Prelude`中当然也有定义，即为`foldr`。`Prelude`中依赖于`foldr`定义的函数有：

```haskell
length :: [a] -> Int
sum :: Num a => a -> a
product :: Num a => [a] -> a
and :: [Bool] -> Bool
or :: [Bool] -> Bool
any :: (a -> Bool) -> [a] -> Bool
all :: (a-> Bool) -> [a] -> Bool
```

你可能会对`=>`感到默生，这个符号我们会在下一节进行介绍。

还有一个`foldl`函数，表示从左边折叠，与`foldr`的区别如下：

```haskell
foldr f z [a,b,c] = a `f` (b `f` (c `f` z))
foldl f z [a,b,c] = ((z `f` a) `f` b) `f` c
```

注意`foldr`和`foldl`的参数顺序与我们的`fold`函数不同。

一般来说我们还可以使用`Data.List`模块中的`foldl'`函数，它是`foldl`的一个更高性能的实现。

