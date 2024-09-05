---
title: Haskell：理解惰性求值与运算符优先级
author: Xilong Yang
date: 2022-01-08 
---

<div class="abstract">


做 [CIS 194 HomeWork6](https://www.seas.upenn.edu/~cis194/spring13/hw/06-laziness.pdf)时遇到了各种思维方面的困难。试图通过梳理它们加深对运算符优先级和惰性求值的理解。

</div>

[[toc]]

## 引言：Fibonacci数列

斐波那契数列，相信大家都很熟悉了，每个人刚接触递归与动态规划的思想时候都会看到它的身影。其定义为：

```
fib(1) = 1
fib(2) = 1
fib(n) = fib(n - 1) + fib(n - 2), n > 2
```

这在Haskell中是很容易实现的：

``` haskell
fib :: Integer -> Integer
fib 1 = 1
fib 2 = 1
fib n = fib (n - 1) + fib (n - 2)
```

## fib函数的递推实现

不难看出，上面的实现非常自然，几乎与数学方式给出的定义一样。然而大家可能都知道，这种定义方式的计算效率是很低的，在过程式语言中可以引出DP思想：

```cpp
int fib(int n) {
	int fibs[n] = {1,1};
    for (int i = 2; i < n; ++i) {
        fibs[i] = fibs[i - 1] + fibs[i - 2];
    }
    return fibs[n - 1];
}
```

这样的计算方法将可能重复使用的资源记录了下来，使用少量空间换取了大量的时间。并且也很符合人的直觉。可以拆解成两步：

1. 维护一个长度至少为n的数列。
2. 取出数列中对应的元素。

那么在Haskell这样的无副作用语言中如何实现对列表的维护呢？如果使用下面方式：

```haskell
fibs :: [Integer]
fibs = map fib [1..]
```

则不仅无法使用这个列表记录已使用的计算，反而每一步都要耗费大量的计算资源。这里如果根据直觉实现递推，或许会实现出这样的东西：

```haskell
fibs :: [Integer]
fibs = map fib' [1..]
	where
		fib' 1 = 1
		fib' 2 = 1
		fib' n = fibs!!(n - 1) + fibs!!(n - 2)
```

然而，这样会寻致计算`!!`的时候试图求出`fib`的值，因此会进入一个死循环。不可行。

那么我们在[Lecture 6](https://www.seas.upenn.edu/~cis194/spring13/lectures/06-laziness.html)中见过的`Data.Array`可以完成这个任务吗？答案是不行，它仅仅是一个对列表的封装，本身不支持处理无限列表。且此处并不需要使用映射。

黔驴技穷了，上网搜索解法，发现可以使用`zipWith`实现如下：

```haskell
fibs :: [Integer]
fibs = 1:1:zipWith (+) fibs (tail fibs)
```

于是开始了我的迷惑之旅。

## 惰性求值

对于`fibs = 1:1:zipWith (+) fibs (tail fibs)`这种形式的定义，我简直闻所未闻。定义中不仅出现了自身，甚至出现了对自身的嵌套运算。将上式转换为C++形式可以帮助我们快速发现蹊跷：

```cpp
// 1:1:zipWith (+) fibs (tail fibs) == (:) (1) ((:) (1) (zipWith (+) fibs (tail fibs)))
list cons(Num i, list tail);
list zipWith(operation op, list a, list b);
list tail(list l);
list fibs() {
    return cons(1, cons(1, zipWith(plus, fibs(), tail(fibs()))));
}
```

可以发现一个很明显的问题，这个函数没有递归终止条件。而在C++这样的直接求值语言中，这会导致传参时无限递归，计算不出任何结果。然而对于惰性求值的Haskell而言，就不存在这个问题了，首先看看`zipWith`的定义：

```Haskell
zipWith :: (a->b->c) -> [a] -> [b] -> [c]
zipWith f = go
  where
    go [] _ = []
    go _ [] = []
    go (x:xs) (y:ys) = f x y : go xs ys
```

由于这个函数没有用到如`!!`或`length`这类需要先将值计算出来的函数，符合惰性求值的作用条件，计算过程如下：

```haskell
fibs = 1:1:zipWith (+) fibs (tail fibs)
 == 1:1:(go (1: (1:ys))
 == 1:1:((1 + 1) : xs : ys)
 == 1:1:((1 + 1) : tail fibs : tail (tail fibs))
 ...
```

可以总结出一条规律，要想使用惰性求值特性，就要使每一个计算步骤都不依赖完整的结果。

## 谈谈运算符优先级

* Why not `fib = 1:1:(zipWith (+) fibs (tail fibs))`

这里的答案是`:`运算符是`cons`函数的语法糖，而`[emelments]`又是`:`的语法糖，关系如下：

```haskell
[1,2,3] == 1:2:3:[] == cons 1 (cons 2 (cons 3 []))
```

不难看出，为满足这个关系，`:`是一个右结合运算符。因此：

```haskell
1:1:(zipWith (+) fibs (tail fibs))
== 1:(1:((zipWith (+) fibs (tail fibs))))
== 1:(1:(zipWith (+) fibs (tail fibs)))
== 1:1:zipWith (+) fibs (tail fibs)
```

之所以可以将`zipWith (+) fibs (tail fibs)`看做一个整体，是因为前缀函数调用的优先级高于中缀函数。

而不可以将`zipWith (+) fibs (tail fibs)`写做`zipWith (+) fibs tail fibs`，则是因为前缀函数调用优先级相同，且从左向右开始分析。因此上式等价于：`(zipWith (+) fibs tail) fibs`。

* Why not `fib = 1:1:zipWith (+) fibs $ tail fibs`

根据`$`运算符的作用是“*省略之后的括号*”来理解，这样写是可行的，然而这个理解是错误的。`$`运算符真正的作用是，将**前后两部分都括上括号**。因此上式转换为前缀写法后，错误就显而易见了，如下：

``` haskell
($) (1:1:zipWith (+) fibs) (tail fibs)
($) (cons 1 (cons 1 (zipWith (+) fibs))) (tail fibs)
```

值得一提的是`$`的函数原型：

```haskell
($) :: (a -> b) -> a -> b
($) = id
```

即接受一个函数，然后返回该函数本身。唯一的作用就是用其极低的运算优先级来省略多余的括号。没错，是极低的优先级，这有违直觉。因为直觉上似乎是：*“`$`运算符以极高的运算优先级为它的左右两边加上了括号”*。然而我们不妨思考一下，括号的意义正是优先运算，为了让自己的左右都先于自己运算，它的优先级必然很低。（事实上`$`的运算优先级是最低的一级，参见后附优先级表。）

考虑以下例子：

```haskell
f :: a -> b
g :: c -> a

f g x == (f g) x
f $ g x /= ((f $) g) x
map + [1] /= map (+) [1]
```

为什么同样是占据高优先级函数的参数位置，中缀运算符不会被当作参数传递呢？因为当我们使用中缀函数时，实际上表达式会被当作等价的前缀形式来处理，即：

``` haskell
f $ g x == ($) (f) (g x) == ($ f) (g x) == f (g x) -- 注意：当转换为前缀形式后，由于所有的函数都成为了前缀函数，不再有优先级一说。
map + [1] == (+) (map) ([1]) == (+ map) ([1]) -- 错误：函数(+ map)参数类型与[]不匹配。
```

上例也可看出，所谓的优先级只在中缀表达式到前缀表达式的转换中有效，即：

```haskell
(f.g) x == ((.) f g) (x)
f.g $ x == ($) (f.g) (x) == ($) ((.) f g) (x)
1 + 2 * 3 + 4 
  == (+) (1 + 2 * 3) + (4) 
  == (+) ((+) (1) (2 * 3)) (4) 
  == (+) ((+) (1) ((*) 2 3)) 4
```

这里又可看出一个有趣的规律：优先级不同的运算符先转换较低级的，同级的运算符则根据结合律来决定顺序（转换顺序与结合顺序相反）。即后运算的先转换。

这种将中缀函数转换成前缀的方式可以帮助我们理解两个内容：

1. 运算符优先级。
2. 引用中缀函数时要加上括号。

## 附：运算符优先级表

```
+--------+----------------------+-----------------------+-------------------+
| Prec-  |   Left associative   |    Non-associative    | Right associative |
| edence |      operators       |       operators       |    operators      |
+--------+----------------------+-----------------------+-------------------+
| 9      | !!                   |                       | .                 |
| 8      |                      |                       | ^, ^^, **         |
| 7      | *, /, `div`,         |                       |                   |
|        | `mod`, `rem`, `quot` |                       |                   |
| 6      | +, -                 |                       |                   |
| 5      |                      |                       | :, ++             |
| 4      |                      | ==, /=, <, <=, >, >=, |                   |
|        |                      | `elem`, `notElem`     |                   |
| 3      |                      |                       | &&                |
| 2      |                      |                       | ||                |
| 1      | >>, >>=              |                       |                   |
| 0      |                      |                       | $, $!, `seq`      |
+--------+----------------------+-----------------------+-------------------+
```

* 函数调用拥有更高的优先级，可以认为其优先级是10。
