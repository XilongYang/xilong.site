---
title: C++三/五法则
author: Xilong Yang
date: 2021-07-19 
---

<div class="abstract">


本以为三/五法则作为一个基础知识早已烂熟于心，未想纸上得来终是浅，还是在这个地方翻了次车。

</div>

[[toc]]

## 什么是三/五法则

* 三法则：C++11之前，一个需要`析构函数`的类也需要`拷贝构造函数`和`拷贝赋值运算符`。这三个组件总是成套出现，因此叫三法则。
* 五法则：C++11以后，一个需要`析构函数`的类同时需要`拷贝构造函数`、`拷贝赋值运算符`和`移动构造函数`以及`移动赋值运算符`。成套出现的组件数量变成了五，因此叫五法则。

对于这两个法则，虽然内容在添加移动语义后有一些变化，但核心思想都是一样的。即类的基础组件应该成套构成。因此合称为三/五法则。

## 翻车实况

也许你会疑惑，这么浅显的地方怎么会翻车，看了这个翻车实况或许就会发现你也可能犯这样的错误。

起因是昨天写[二叉树的层序遍历](/posts/014_The_Level_Order_Iteration_of_Binary_Tree.html)时，需要一个C++的实现，方便起见，我定义了一个非常简单的二叉链表结构来构造二叉树：

```cpp
struct Tree {
    Tree() : left(nullptr), data(0), right(nullptr) {}
    Tree *left;
    char data;
    Tree *right;
};
```

以及不可忽视的两点：

1. 我的遍历函数使用了***常量引用传递***的方式接收树

2. 遍历函数内部用到了`std::queue`作为遍历队列。存储相关语句为：

```cpp
// std::queue<Tree> nodeQueue;
// cur = nodeQueue.front();
nodeQueue.push(T);
if (cur.left)  nodeQueue.push(*cur.left);
if (cur.right) nodeQueue.push(*cur.right);
```

函数签名：`void View(const Tree& T);`

同样是方便起见，我手动构造了一棵树用于测试：

```cpp
Tree *GetTree() {
    auto T = new Tree;
    T->data = 'A';
    T->left = new Tree;
    T->left->data = 'B';
    T->right = new Tree;
    T->right->data = 'C';
    T->right->left = new Tree;
    T->right->left->data = 'D';
    T->right->right = new Tree;
    T->right->right->data = 'E';
    return T;
}

int main() {
    auto T = GetTree();
    // 正常情况下应该输出"ABCDE"
    View(*T);
    return 0;
}
```

注意这里没有`delete T`，内存是全部泄露的，不过这种简单程序反正有操作系统回收，可以先不用关心。

于是问题来了，在我用这个版本的程序完成算法的测试后，出于习惯给这个`Tree`加上了一个简单的析构函数：

```cpp
struct Tree {
    Tree() : left(nullptr), data(0), right(nullptr) {}
    ~Tree() {
        if (left) delete left;
        if (right) delete right;
    }
    Tree *left;
    char data;
    Tree *right;
};
```

并且在`main`函数内释放了内存：

```cpp
int main() {
    auto T = GetTree();
    View(*T);
    delete T;
    return 0;
}
```

这时运行程序就可以喜提一个`Segment Error`了。

## 问题解决

因为没有添加析构函数时并没有出现问题，所以总是怀疑自己对析构过程的理解有问题。难道析构函数不是自已理解的”死前抖擞精神，完成最后的任务，然后安详赴死“？对象在调用析构函数时最已经销毁了？不可能啊。

几经查阅后，发现我对析构过程的理解没有问题，对象在析构函数之后才被销毁。更离谱的是，我为了简化问题写的只存在树的构建的析构的程序运行起来完全没有出现问题。

于是我把目光投向了看起来安全的不能再安全的，接收`const Tree&`类型参数的`View`函数。在出现问题的代码中将`View(*T);`注释掉，发现还真是这个函数的问题。

说来奇怪，还没有对问题做具体的分析，就直觉地想到改一下传参方式或许可以解决，于是我将`View`改成如下形式：

函数签名：`void View(const Tree *T)`

存储语句：

```cpp
// std::queue<const Tree*> nodeQueue;
// cur = nodeQueue.front();
if (T) nodeQueue.push(T);
if (cur->left)  nodeQueue.push(cur->left);
if (cur->right) nodeQueue.push(cur->right);
```

然后果真没有问题了，这弄得我很疑惑。于是分析可能是`std::queue`相关的问题，但它也不会直接释放掉资源啊。一番思索，发现原因如下：

* 对于`std::queue<const Tree>`，它在每一次`push(T)`时创建一个`T`的拷贝，并存储，由于`Tree`没有定义拷贝相关操作，会使用默认拷贝方式，即简单复制其中的指针。
* `std::queue`在`pop()`操作时会销毁临时对象。
* 当没有为`Tree`创建析构函数时，临时对象的销毁仅仅是简单销毁自身，因此没有出现问题。
* 而对于已经创建了析构函数的`Tree`，临时对象会递归地销毁其指针指向的子节点，此时再显式地`delete T`就会导致重复delete。从而引发`Segment Error`。

因此，像上面那样使用指针传递的方式就解决了问题，这样临时对象的类型就变成了指针，从而不会对树本身产生影响。但这种方式本质上只是在逃避，并没有解决问题。

真正要解决这个问题，那还得是为`Tree`添加正确的拷贝构造函数、拷贝赋值运算符、移动构造函数和移动赋值运算符。

## 总结

遵循三/五法则是一个类正常运行的基础，绝不能偷懒省略其中的组件。还好我以这样低的成本——一个测试算法用的临时程序——完成了三/五法则的试错。
