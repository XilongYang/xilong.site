---
title: 从零开始的Haskell（七）——折叠与幺半群
author: Xilong Yang
date: 2022-01-10
---

<div class="abstract">


系列第七篇，介绍了更一般性的折叠以及幺半群。

</div>

$$toc$$

## 折叠，又见折叠

我们已经知道怎么折叠一个列表了，但我们也可以将折叠思想更一般性地用于其它数据类型。比如对于下面这个二叉树，考虑一些函数：

``` haskell
data Tree a = Empty
            | Node (Tree a) a (Tree a)
    deriving (Show, Eq)
    
leaf :: a -> Tree a
leaf x = Node Empty x Empty
```

写一个函数来计算树的节点数：

```haskell	
treeSize :: Tree a -> Integer
treeSize Empty = 0
treeSize (Node l _ r) = 1 + treeSize l + treeSize r
```

计算一个`Tree Integer`的数据总和：

```haskell
treeSum :: Tree Integer -> Integer
treeSum Empty = 0
treeSum (Node l x r) = x + treeSum l + treeSum r
```

计算树的高度：

```haskell
treeDepth :: Tree a -> Integer
treeDepth Empty = 0
treeDepth (Node l _ r) = 1 + max (treeDepth l) (treeDepth r)
```

将树内元素展开成一个列表：

```haskell
flatten :: Tree a -> [a]
flatten Empty = []
flatten (Node l x r) = flatten l ++ [x] ++ flatten r
```

你是否从中看出一些相似的模式？对于上述每个函数，有：

1. 接受一个树作为输入
2. 对输入的树进行模式匹配
3. 对于`Empty`节点，返回一个简单的值
4. 对于`Node`节点：
   1. 递归的处理左右子树
   2. 以某种方式组合递归的结果，并生成最终结果

作为一名好的程序员，我们总是希望将抽象出重复的模式。首先需要将各例子中变化的部分作为参数，它们是：

1. 返回类型
2. 空节点的值
3. 组合递归调用的方式

设树处理的类型为`a`，函数的返回类型为`b`，有：

```haskell
treeFold :: b -> (b -> a -> b -> b) -> Tree a -> b
treeFold e _ Empty = e
treeFold e f (Node l x r) = f (treeFold e f l) x (treeFold e f r)
```

有了这个折叠函数，我们就可以更轻易地定义上面的几个例子了：

``` haskell
treeSize' :: Tree a -> Integer
treeSize' = treeFold 0 (\l _ r -> l + 1 + r)

treeSum' :: Tree Integer -> Integer
treeSum' = treeFold 0 (\l x r -> l + x + r)

treeDepth' :: Tree a -> Integer
treeDepth' = treeFold 0 (\l _ r -> 1 + max l r)

flatten' :: Tree a -> [a]
flatten' = treeFold [] (\l x r -> l ++ [x] ++ r)
```

我们也可以轻松实现其它的树折叠函数：

```haskell
treeMax :: (Ord a, Bounded a) => Tree a -> a
treeMax = treeFold minBound (\l x r -> max l $ max x r)
```

这样感觉就好多了，去除了大量重复模式，非常优雅。

### 折叠表达式

回想下Homework5中的`ExprT`类型和相应的`eval`函数：

```haskell
data ExprT = Lit Integer
           | Add ExprT ExprT
           | Mul ExprT ExprT

eval :: ExprT -> Integer
eval (Lit i) = i
eval (Add a b) = eval a + eval b
eval (Mul a b) = eval a * eval b
```

看着就欠抽象！来试试这样写：

```haskell
exprTFold :: (Integer -> b) -> (b -> b -> b) -> (b -> b -> b) -> ExprT -> b
exprTFold f _ _ (Lit i) = f i
exprTFold f g h (Add a b) = g (exprTFold f g h a) (exprTFold f g h b)
exprTFold f g h (Mul a b) = h (exprTFold f g h a) (exprTFold f g h b)

eval' :: ExprT -> Integer
eval' exprTFold id (+) (*)
```

现在我们可以做一些别的事，比如计算表达式中数字的个数：

``` haskell
numLiterals :: ExprT -> Int
numLiterals = exprTFold (const 1) (+) (+)
```

### 普适的折叠

这里透露的信息是我们可以为很多（并非全部）数据类型创建折叠操作。作用于`T`类型的折叠操作会为`T`的每个构造器取一个（高层面的）参数，考虑怎么把构造器中的数据类型转换成返回值的类型——直到所有递归过程被折叠成一个结果。

很多我们可能想为`T`实现的的函数在折叠操作下会很易于表达。

## 幺半群（Monoids）

离散数学里接触过幺半群的概念，定义如下：

* 幺半群是一个带有二元运算`* : M * M -> M`的集合`M`，其符合以下公理
  * 结合律：对任意`M`内的元素`a`、`b`、`c`，有`(a * b) * c = a * (b * c)`
  * 单位元：存在`M`内的元素`e`，使任一存于`M`内的元素`a`满足`a * e = e * a = a`
  * 封闭性（内含于二元运算中）：对任意在`M`内的元素`a`、`b`，`a*b`也在`M`中

Haskell中幺半群是一种基本类型类，定义在`Data.Monoid`模块里：

``` haskell
class Monoid m where
    mempty  :: m
    mappend :: m -> m -> m
    
    mconcat :: [m] -> m
    mconcat = foldr mappend mempty

(<>) Monoid m => m -> m -> m
(<>) = mappend
```

其中`mempty`相当于单位元的定义，`mappend`与其符号简写`<>`为幺半群中的二元运算。`mconcat`用于将整个列表折叠成一个值，默认使用`foldr`来实现，但由于对某种特定的`Monoid`类型可能存在更高效的实现，模块中提供了它的定义供修改。

正如之前提到的幺半群的性质，对任何`Monoid`类型的值`x`、`y`、`z`有：

``` haskell
mempty <> x = x
x <> mempty = x
(x <> y) <> z = x <> (y <> z)
```

### Monoid 实例

在知道这些概念后就会发现，`Monoid`无处不在。比如一个列表：

```haskell
instance Monoid [a] where
    mempty  = []
    mappend = (++)
```

考虑下会发现这是完美符合`Monoid`性质的。同理可以发现数值类型的加法和乘法也完美符合`Monoid`的性质。但要怎样分别实现数值加法和乘法的`Monoid`呢？我们不能在一个类型类中创建同一个类型的两个不同实例，即以下方法：

``` haskell
instance Num a => Monoid a where
    mempty  = 0
    mappend = (+)

instance Num a => Monoid a where
    mempty  = 0
    mappend = (*)
```

是非法的，因为有重复定义。为解决这个问题，我们可以创建两个新类型作为数值类型的不同封装：

```haskell
newtype Sum a = Sum a
    deriving (Eq, Ord, Num, Show)

getSum :: Sum a -> a
getSum (Sum a) = a

instance Num a => Monoid (Sum a) where
    mempty  = Sum 0
    mappend = (+)

newtype Product a = Product a
    deriving (Eq, Ord, Num, Show)

getProduct :: Product a -> a
getProduct (Product a) = a

instance Num a => Monoid (Product a) where
    mempty  = Product 0
    mappend = (*)
```

> 类型的定义方式：
>
> data: ADT
>
> newtype: 单构造器的零代价ADT
>
> type: 类型别名

在上述定义后，我们可以使用以下方式计算一个数列中所有元素的乘积：

```haskell
lst :: [Integer]
lst = [1,5,8,23,423,99]

prod :: Integer
prod = getProduct . mappend . map Product $ lst
```

当然这个例子显得舍近求远，非常地蠢。但这个模式可以方便的说明`Monoid`的应用方式。

两个可以作为`Monoid`实例的类组成的`Pair`也可以作为`Monoid`的实例，如下：

```haskell
instance (Monoid a, Monoid b) => Monoid (a, b) where
    mempty  = (mempty, mempty)
    (a,b) `mappend` (c,d) = (a `mappend` c, b `mappend` d)
```

试图构造一个`Bool`类型的`Monoid`，如下：

``` haskell
newtype Or = Or {getOr :: Bool}
    deriving (Eq, Ord, Show, Read, Bounded)

instance Monoid Or where
    mempty = Or False 
    Or x `mappend` Or y = Or $ x || y
```

这个定义确实没错，但是无法通过语法检查。原因是`No instance for (Semigroup Or)`。

## 补充：半群（Semigroup）

上面的报错信息意为`Or`类型不是`Semigroup`类型类的实例，而Semigroup是半群的意思。这是怎么回事呢？

我们知道，幺半群就是有单位元的半群，则半群定义为一个带有符合结合律的二元运算符`* : M * M -> M`的集合。因此Haskell把幺半群的二元运算符部分抽象出来作为半群类型类，如下：

``` haskell
class Semigroup a where
    (<>) :: a -> a -> a
```

而幺半群的真实定义则为：

``` haskell
class Semigroup a => Monoid a where
    mempty  :: a
    mappend :: a -> a -> a
    mconcat :: foldr mappend mempty
    
(<>) Monoid m => m -> m -> m
(<>) = mappend
```

关于`<>`与`mappend`的关系更准确的说法是，`mappend`是`<>`的别名。因而，`<>`才是主要定义，就是说一个类要成为`Monoid`的实例就必须也成为`Semigroup`的实例。则`Bool`类型的`Monoid`应定义为：

``` haskell
newtype Or = Or {getOr :: Bool}
    deriving (Eq, Ord, Show, Read, Bounded)

instance Semigroup Or where
    Or x <> Or y = Or $ x || y

instance Monoid Or where
    mempty = Or False 
    
newtype And = And {getAnd :: Bool}
    deriving (Eq, Ord, Show, Read, Bounded)

instance Semigroup And where
    And x <> And y = And $ x && y

instance Monoid And where
    mempty = And True
```

甚至可以实现函数类型的`Monoid`：

```haskell
newtype Dot a = Dot {run :: a -> a}

instance Semigroup (Dot a) where
    Dot x <> Dot y = Dot $ x . y

instance Monoid (Dot a) where
    mempty = Dot id
```

