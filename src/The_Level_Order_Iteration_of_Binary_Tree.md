---
title: 二叉树的层序遍历
author: Xilong Yang
date: 2021-07-18
---

对之前的文章：[二叉树的存储结构及其非层序遍历](/posts/Memory_Structure_of_Binary_Tree_and_Its_Non_Level_Order_Iteration.html)的一点小补充。

## 原理

使用一个队列来对每个节点进行`入队-加入子节点-访问-出队`的操作即可，非常简单。

伪码表示：

``` none
输入：待访问的二叉树Tree
输出：对节点的层序访问
View:
  queue.push Tree
  while !queue.empty:
    if (Tree.left) queue.push Tree.left
    if (Tree.right) queue.push Tree.right
    Tree.show
    queue.pop
```

## C++实现

```cpp
#include <iostream>
#include <queue>

using namespace std;

// 简单实现一个二叉树
struct Tree {
    Tree() : left(nullptr), data(0), right(nullptr) {}
    Tree *left;
    char data;
    Tree *right;
};

// 层序遍历
void View(const Tree &T) {
    queue<Tree> nodeQueue;
    nodeQueue.push(T);
    while (!nodeQueue.empty()) {
        auto cur = nodeQueue.front();
        if (cur.left) nodeQueue.push(*cur.left);
        if (cur.right) nodeQueue.push(*cur.right);
        nodeQueue.pop();
        cout << cur.data;
    }
    cout << endl;
}
```

## Haskell实现

```haskell
-- 二叉树
data Tree = Empty | Node Tree String Tree
  deriving (Eq, Show)

-- 将树转变为层序遍历序列
view :: Tree -> String
view = view'.view''
    where
    -- 将一个树的列表转变为对应的值的列表
    view' :: [Tree] -> String
    view' [] = ""
    view' ((Node _ str _):xs) = str ++ view' xs
    -- 将一个树转变为其层序遍历的列表
    view'' :: Tree -> [Tree]
    view'' Empty = []
    view'' t = extend [t] 0
        where
        extend :: [Tree] -> Int -> [Tree]
        extend ts n = if(n >= length ts) then ts
            else case (ts!!n) of
                (Node left _ right) -> extend (ts
                    ++ (if (left == Empty) then [] else [left])
                    ++ (if (right == Empty) then [] else [right]))
                    (n + 1)
```

Haskell学艺不精，写得挺丑，留待日后优化吧。
