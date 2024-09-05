---
title: STL容器备忘总结
author: Xilong Yang
date: 2021-07-21 
---

<div class="abstract">


使用容器总有几个细节记不清，梳理一番以作备忘。

</div>

$$toc$$

## 容器类型

### 顺序容器

| 顺序容器 | 描述                                     |
| ------ | ---------------------------------------- |
| vector | 可变大小数组，快速随机访问，快速尾部增删。 |
| deque | 双端队列，快速随机访问，快速头尾增删。 |
| list | 双向列表，双向顺序访问，快速任意增删。 |
|forward_list|单向列表，单向顺序访问，快速任意增删。|
|array|固定大小数组，快速随机访问，不可增删。|
|string|与vector性质相似，专门保存字符。|

| 顺序容器适配器 | 描述     |
| -------------- | -------- |
| stack          | 栈       |
| queue          | 队列     |
| priority_queue | 优先队列 |

### 关联容器

| 关联容器           | 描述                        |
| ------------------ | --------------------------- |
| map                | 关联数组，保存key-value对。 |
| unordered_map      | map的无序版本。             |
| set                | 只保存key的容器。           |
| unordered_set      | set的无序版本。             |
| multimap           | key可重复出现的map。        |
| unordered_multimap | multimap的无序版本。        |
| multiset           | key可重复出现的set。        |
| unordered_multiset | multiset的无序版本。        |

有序关联容器要求key值类型必顺定义<运算符。无序关联容器则要求key值定义==运算符。

## 容器操作

### 通用操作

#### 类型别名

`iterator`: 容器的迭代器类型。

`const_iterator`: 迭代器的只读版本。

`size_type`: 无符号整数类型，保存最大容器大小。

`differenct_type`: 带符号整数类型，保存两个迭代器间的距离。

`value_type`: 元素类型。

`reference`: 元素的左值类型，含义为value_type&。

`const_reference`: 元素的const左值类型，含义为const value_type&。

#### 构造函数

`C c;`：默认构造函数，构造一个空容器。

`C c1(c2)`：构造c2的拷贝c1。

`C c(b, e)`：构造c并将迭代器b和e之间的元素拷贝到c。

`C c{a, b, c, d, e...}`：列表初始化c。

#### 赋值与swap

`c1 = c2`：将c1中的元素替换为c2中的元素。

`c = {a, b, c, d...}`：将c中的元素替换为列表中的元素（array不可用）。

`a.swap(b)`, `swap(a, b)`：交换a,b中的元素。

#### 大小

`c.size()`：c中元素数目。

`c.max_size()`：c最大可保存元素数目。

`c.empty`：c是否为空。

#### 增删元素（array不可用）

`c.insert(args)`：将args中的元素拷贝进c。

`c.emplace(inits)`：使用inits构造c中的一个元素。inits必需与元素的构造函数匹配。

`c.erase(args)`：删除c中的指定元素。

`c.clear()`：删除c中所有元素，返回void。

#### 关系运算符

`==`，`!=`：所有容器都支持。

`<`，`<=`，`>`，`>=`：除无序关联容器外都支持。

#### 获取迭代器

`c.begin()`，`c.end()`：返回首迭代器和尾后迭代器。

`c.cbegin()`，`c.cend()`：返回const迭代器。

#### 反向迭代器(不支持forward_list)

`reverse_iterator`：按逆序寻址元素的迭代器

`const_reverse_iterator`：反向迭代器的只读版本。

`c.rbegin()`，`c.rend()`：返回尾迭代器和首前迭代器。

`c.crbegin()`，`c.crend()`：返回const反向迭代器。

### 顺序容器操作

**总是可以使用两个迭代器的范围表示多个已存在元素，用(n, t)或{a, b, c...}表示多个新元素。将这三种表示方法称为range**

#### 构造函数

`C seq(n)`：一个包含n个元素的顺序容器。

`C seq(range)`：一个元素为range的顺序容器。

#### 赋值

`seq.assign(range)`：将seq中元素替换为迭代器range中的元素，b的e不可指向seq中的元素。

#### 关系运算符

两个大小相等且对位元素相等的顺序容器相等。

顺序容器a是另一个顺序容器b的前缀子序列时，a < b。

否则，以两容器中第一对不相等的元素的大小关系作为结果。

#### 增删元素（array不支持）

* forward_list有专有的emplace、insert和erase操作。
* forward_list不支持push_back、emplace_back和pop_back。
* vector和string不支持push_front、emplace_front和pop_front。

`c.push_back(t)`，`c.emplace_back(inits)`：在尾部创建一个元素。

`c.push_front(t)`，`c.emplace_front(inits)`：在首部创建一个元素。

`c.insert(p, t)`，`c.emplace(p, inits)`：在迭代器p位置之前添加一个元素，返回新元素的迭代器。

`c.insert(p, range)`：在p之前添加n个值为t的元素。返回第一个新元素的迭代器。

**任何添加操作都会导致指向容器内元素的迭代器、指针和引用失效。**

`c.pop_back()`：删除c的尾元素，c为空时UB。

`c.pop_front()`：删除c的首元素，c为空时UB。

`c.erase(p)`：删除迭代器p指向的元素，返回下一个元素的迭代器。p为尾后迭代器时UB。

`c.erase(b, e)`：删除迭代器b, e范围内的所有元素，返回下一个元素的迭代器。

`c.clear()`：删除所有元素，返回void。

**删除deque中除首尾元素的任何元素会导致迭代器、指针和引用失效。**

**删除vector或string中的元素会导致删除点之后的迭代器、指针和引用失效。**

#### 访问元素

* at和下标操作不适用于任何list。
* back不适用forward_list。

`c.back()`：返回c中尾元素的引用。c为空时UB。

`c.front()`：返回c中首元素的引用。c为空时UB。

`c[n]`，`c.at(n)`：返回下标为n的元素的引用。[下标]越界UB。at(下标)越界抛出一个out_of_range异常。

#### 改变容器大小

`c.resize(n)`：将容器大小调整为n，若缩小则丢弃多余元素，增大则添加新元素。

`c.resize(n, t)`：若增大则添加值为t的新元素。

#### forward_list特有操作

`lst.before_begin()`：返回首前迭代器，不可解引用。

`lst.cbefore_begin()`：返回首前迭代器的只读版本。

`lst_insert_after(p, args)`，`emplace_after(p, inits)`：在p后添加元素，参数形式与通用的insert相同。

`lst_erase_after(p)`，`lst_erase_after(p, e)`：删除p之后的一个或一段元素，返回下一个位置。

#### 缓存操作

`c.shrink_to_fit()`：将实际内存占用减少为与size()相同。只适用于vector，string和deque

`c.capacity()`：已分配的实际内存可以保存多少元素。只适用于vector和string。

`c.reserve(n)`：分配至少能容纳n个元素的空间。只适用于vector和string。

#### string特有操作

##### 截取

`string s(cp, n)`：cp指向数组中前n个字符。

`string s(s2, pos, len = 0)`：字符串s2从下标pos开始的len个字符。下标越界则UB。

`s.sub_str(pos = 0, n = s.size() - pos)`：返回s从下标pos开始的n的字符的拷贝。

##### 搜索

string提供了六个不同的搜索函数，每个函数又有4个重载版本。它们成功时返回匹配位置的下标，失败则返回`string::npos`。返回数类型都是`string::size_type`，是无符号整数类型。

`s.find(args)`：args第一次出现的位置。

`s.rfind(args)`：args最后一次出现的位置。

`s.find_first_of(args)`：args中任一字符第一次出现的位置。

`s.find_last_of(args)`：args中任一字符最后一次出现的位置。

`s.find_first_not_of(args)`：第一次出现不属于args中的字符的位置。

`s.find_last_not_of(args)`：最后一次出现不属于args中的字符的位置。

args为以下四种形式之一：

`c, pos`：从pos处开始查找字符c，pos默认为0。

`str, pos`：从pos处开始查找字符串str，pos默认为0。

`cp, pos`：从pos处开始查找C风格字符串指针cp，pos默认为0。

`cp, pos, n`：从pos开始查找指针cp指向的数组的前n个字符。pos和n皆无默认值。

##### 匹配

`s.compare(args)`：跟据比较结果等于，小于或大于args，返回0，负数或正数。

args为以下形式之一：

`s2`：与字符串s2比较。

`pos1, n1, s2`：从pos1开始的n1个字符与s2比较。

`pos1, n1, s2, pos2, n2`：从pos1开始的n1人字符与s2中从pos2开始的n2的字符比较。

`cp`：与C风格字符串cp比较。

`pos1, n1, cp`：从pos1开始的n1个字符与cp比较。

`pos1, n1, cp, n2`：从pos1开始的n1个字符与从cp开始的n2个字符比较。

##### 数值转换

`to_string(val)`：返回val的string表示。

`sto{type}(s, p, b)`：返回s起始的子串的数值，由type指定返回值类型。b表示进制，默认为10。p是size_t指针，用来保存第一个非数值字符的下标，默认为0，即不保存下标。type可以为：i (int)、l (long)、ul (unsigned long)、ll (long long)、ull (unsigned long long)。

`sto{type}(s, p)`：基本同上，返回浮点数，不能指定进制。type可以为：f (float)、d (double)、ld (long double)。

#### 容器适配器操作

`container_type`：实现适配器的底层容器类型。

* stack

  `s.pop`：删除栈顶元素。

  `s.push(item)`：压入元素item的拷贝或移动。

  `s.emplace(args)`：压入由args构造的元素。

  `s.top()`：返回栈顶元素。

* queue & priority_queue

  // 通用

  `q.pop()`：删除queue的首元素或priority_queue最高优先级的元素。

  `s.push(item)`：加入元素item的拷贝或移动。

  `s.emplace(args)`：加入由args构造的元素。

  // 仅适用于queue

  `q.front()`：返回首元素。

  `q.back()`：返回尾元素。

  // 仅适用于priority_queue

  `q.top()`：返回最高优先级元素。

### 关联容器操作

`key_type`：关键字类型。

`mapped_type`：映射类型，仅适用于map。

`value_type`：值类型，对于set与`key_type`等效，对于map等于`pair<const key_type, mapped_type>`。

##### 遍历

可以通过`begin()`和`end()`获取对应的迭代器从而实现遍历。

##### 插入元素

`c.insert(v)`：对于map和set，key值重复的插入会失败，返回一个bool表示是否成功。而multimap和multiset可以插入key值重复的元素，返回指向该元素的迭代器。

`c.emplace(args)`：行为同上，使用args构建元素。

`c.insert(b, e)`：插入迭代器范围内的元素。

`c.insert(li)`：插入初始化列表中的元素。

`c.insert(p, v)`：从迭代器位置开始插入元素。

`c.emplace(p, args)`：同上。

##### 删除元素

`c.erase(k)`：删除所有key值为k的元素。

`c.erase(p)`：删除迭代器指向的元素。

`c.erase(b, e)`：删除迭代器范围内的元素。

##### map的下标操作

`map[key]`：取得key对应的value，如果key不存在则创建新元素。

##### 访问元素

`c.find(k)`：返回指向第一个key值为k的元素的迭代器。

`c.count(k)`：返回key值为k的元素的数量。

`c.lower_bound(k)`：返回指向第一个key值不小于k的元素的迭代器。

`c.upper_bound(k)`：返回指向第一个key值大于k的元素的迭代器。

`c.equal_range(k)`：返回一个迭代器pair，表示关键字等于k的元素的范围。

##### 无序容器

无序容器`unorderd_map`和`unordered_set`，在存储上组织为一组桶，每个桶保存0或多个元素。使用hash函数将元素映射到桶。因此，无序元素的性能依赖于hash函数的质量和桶的数量与大小。

适用于有序容器的操作也适用于无序容器，此外无序容器提供了一组管理桶的函数：

`c.bucket_count()`：正在使用的桶的数目。

`c.max_bucket_count()`：容器能容纳的最多的桶的数目。

`c.bucket_size(n)`：第n个桶中有多少元素。

`c.bucket(k)`：关键字为k的元素在哪个桶中。

`local_iterator`：用来访问桶中元素的迭代器类型。

`const_local_iterator`：迭代器的const版本。

`c.begin(n)`、`c.end(n)`、`c.cbegin(n)`、`c.cend(n)`：桶n的对应迭代器。

`c.load_factor()`：每个桶的平均元素数量，返回float值。

`c.max_load_factor()`：c试图维护的平均桶大小，返回float值。c会在需要时添加新的桶，使load_factor <= max_load_factor。

`c.rehash(n)`：重组存储，使bucket_count >= n且bucket_count > size / max_load_factor。

`c.reserve(n)`：重组存储，使c可以保存n个元素而不用rehash。

```cpp
// 无序容器的使用
T1 hash(args);
bool equal(T2 a, T2 b);
// 由于模版参数接受的是类型，使用decltype取得函数的类型。
unordered_map<T2, decltype(hash)*, decltype(equal)*> foo;
```

