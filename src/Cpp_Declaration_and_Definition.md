---
title: C++的声明与定义
author: Xilong Yang
date: 2020-02-26 
---

<div class="abstract">


偶然间看见一个声明:

struct tm *(*(*Pfunc)[3])(int(*)(int, int), float(*[])(float));

一时间感到云里雾里。为了弄懂此类复杂的声明学习一些相关的知识，在此总结。

</div>

$$toc$$

## 声明与定义的区别

### 声明

**对于C++中的声明，比较通用的描述为：一条声明语句由一个基本数据类型和紧随其后的一个声明符列表组成。每个声明符命名一个变量并指定该变量为与基本数据类型有关的某种类型。**

*声明语句：  基本数据类型  声明符1<, 声明符2, 声明符3 ...>*

例如：

``` cpp
int a, b = 2;
//int为基本数据类型， a,b为一个含有2个声明符的声明符列表，a与b都是声明符，分别声明（并定义）了名称为a, b的int型变量， 并把2赋值给b。
```

### 定义

可以看出，这条语句在声明了a, b的同时定义了它们。这里引出了声明和定义的关系：

**声明使得名字为程序所知，而定义负责建立名字与实体间的关系。**声明规定了变量的类型与名字，而定义在此基础上为变量分配存储空间，还可能为其赋一个初始值。

## extern关键字

extern关键字常用于表示一个变量已在其它文件中定义。

* 如果要**声明一个变量而不定义它**，则在声明语句前加上extern

```cpp
extern int a; //声明int型变量a，但未定义
extern int b = 2; //声明并定义int型变量b，并为其赋初始值2
```

​	 ***任何显式初始化的声明即成为定义****。即使一个声明符已用extern标记，对其进行初始化仍会导致定义行为。*

* 对于**多文件**程序，若要在多个文件中使用**同一个变量**，则必须在**所有**使用该变量的文件中**声明**它，但仅可在**一个**文件中**定义**该变量。

* **不可在函数体内部初始化**一个含有extern标记的变量。

## 复合类型

**复合类型指基于其它类型定义的类型 。**

### 1.引用

引用即对象的别名，通过将声明符写成&d的形式定义引用类型，其中d是变量名。

引用**并非对象，不占用内存空间**，仅作为一个已存在对象的别名。因此引用**必须初始化，且不能再绑定到其它对象上。**

引用**类型要与它所绑定的对象严格匹配**，且**仅能绑定在对象上**，而不能绑定在字面值或表达式的计算结果上。该规则有两个例外：

1. 对const的引用初始值可为任一能转换为引用的类型的对象、字面值或表达式结果。
2. 基类的引用或指针可绑定到派生类对象上。

例：

```cpp
int i = 2;
int &r;	//X, 引用必须初始化
int &ri = i;
double &rdi = i;//X, 引用类型不匹配
double &rd = 3.14;//X, 非const引用必须绑定到对象上
const double &crdi = i;
const double &crd = 3.14;
```

### 2.指针

指针存放对象的地址，通过将声明符写成*d的形式定义，其中d是变量名。由于指针存放的并非对象，而是对象的地址，故需要**用取地址符&取得对象地址。操作其绑定的对象时也要使用解引用符\***。

取地址符&与引用声明符虽然使用同一个符号，但意义不同，一个作用于声明符，一个作用于对象。

解引用符*与指针声明符亦然，另外解引用符和引用没有关系。

```cpp
int a = 2;
int *pa = &a; //pa是a的指针， &是取地址符
int &ra = a; //ra是a的引用， &是引用声明符
ra = 3;	//通过引用改变a的值
*pa = 0;//通过指针改变a的值
pa = 0;//改变指针本身的值
```

指针与引用类似，但有两点不同：

1. 指针本身是一个对象，允许赋值和拷贝。
2. 指针无须在定义时赋初始值，且在函数体内定义的指针有一个不确定的初始值。

#### 特别注意

1. 空指针: 不指向任何对象

```cpp
int *p1 = nullptr; //C++11
int *p2 = 0;
int *p3 = NULL; //#include<cstdlib>, 值等于0
```

2. void*指针：可指向任何对象，且不能操作所指对象。

3. 指向指针的指针

```cpp
int *p1;
int **p2 = p1;
```

4. 指向数组的指针

```cpp
int (*p1)[3];
```

5. 函数指针

```cpp
int (*p1)(<参数列表>) = test;
int (*p2)(<参数列表>) = &test;//函数指针赋值时可以不用取地址
p1(<>);//函数指针使用时可以不用解引用
(*p1)(<>);
```

6. 指针的数组

```cpp
int *p1[5]
```

7. 常量指针

```cpp
int *const p1 = 0;
```

## const限定符

* const**作用于基本类型**或与\*连写成**\*const**（只要在\*后就表示指针本身是常量，与\*间可有空格）用以声明常量指针，受const影响的变量的值不能被改变。

* const对象**仅在文件内有效**，若要在其它文件中使用则需要在**所有声明或定义**语句前**加extern**

* 引用可绑定到const对象上形成对const的引用，也称**常量引用**。非常量引用无法绑定常量对象。

* 常量引用**不可用作修改对象的值**，另一方面**其初始值可为任一能转换为引用的类型的对象、字面值或表达式结果**，此时该常量引用实际**绑定了一个临时量**。

* 对于指针而言，**指针本身是const称为顶层const，指针指向的对象是const称为底层const**。仅底层const可用于指向常量对象。
* 在**类成员函数参数列表后使用const**将该函数声明为const成员函数，其内在原理为作用于隐式参数*this*指针，从而使其能指向常量对象。因此**类的const对象仅能调用const成员函数**。

```cpp
int i = 2; //i的值可变
const int &ri = i; //不可通过ri改变i的值
const int *pib = &i; //不可通过pib改变i的值， 可改变pib的值
int *const pib = &i; //可通过pib改变i的值， 不可改变pib的值
const int *const pib = &i;//不可通过pib改变i的值， 不可改变pib的值
const int j = 3;
int &rj = j; //X
int *pj = j; //X
int const* pj = j; //X，必须是底层const才能绑定const对象。
/*
class A{
public:
	void HW(){cout << "HelloWorld" << endl;}
	void HW_c() const {cout << "HelloWorld" << endl;}
}
*/
A a1;
a1.HW(); //合法
a1.HW_c();//合法，普通对象可调用const成员函数
const A a2;
a2.HW();//非法，即使非常量成员函数内没有改变对象的操作，仍不能被const对象调用
a2.HW_c();//合法
```

## constexpr关键字

常量表达式指在编译时就能得到值且不会改变的表达式。常见的有字面值与用常量表达式初始化的const对象。

实际使用时往往很难确定一个表达式是否是常量表达式。此时可用constexpr声明该变量， 以由编译器检查其是否为常量表达式。

constexpr在声明指针时，会将指针设为顶层const。

constexpr函数需要满足：

* 返回类型及所有形参类型都是字面值类型。
* 函数体中有且只有一条return语句。

```cpp
constexpr int *p = null; //p是指向整数的常量指针
const int *p1 = null;	//p1是指向整数常量的指针
constexpr const int *p2 = null;	//p2是指向整数常量的常量指针
const int *const p3 = null;	//p3是指向整数常量的常量指针
```

## static关键字

static将作用对象声明为静态对象，有四种主要用法：

1. 对于**全局或命名空间**作用域，使用static标记声明符使该对象**仅在此文件可用**。
2. 对于在**函数**作用域定义的变量，使用static标记使该变量在函数**调用结束后不被释放**。

3. 对于在**类**作用域定义的**数据成员**，使用static标记使该成员为**整个类共用**而不属于任何对象。通常类的静态成员必须**在类外定义及初始化**，且**不能在类外重复使用static**。
   * *字面值常量类型的constexpr静态数据成员（常量表达式并不一定是用constexpr关键字定义的）可在类内用const整数类型的初始值初始化。即便如此，仍应在类外定义该成员，否则任何编译器不能直接用该成员的值替换该成员的场景都会引起错误。且此时在类外的定义不能再提供初始值。*

4. 对于在**类**作用域定义的**函数成员**，使用static标记使该成员为**整个类共用**。静态成员函数不与任何对象绑定，不包含*this*指针，因此不能声明为const类型 。静态函数成员仅能使用其它静态成员。

* union的成员不能声明成static类型 。

```cpp
//a.cpp
static int a = 1;
int b = 2;
//b.cpp
extern int a;	//X, a.cpp内定义的a只能在本文件使用
extern int b;
extern int a = 10; // 合法， 重新定义了一个a
extern int b = 3; //非法， 重复定义
int a = 4;	//合法
int b = 5; //非法

class A{
public:
    static int c = 0; //错误， 不可在类内初始化普通静态成员
    static int d;
    static constexpr int e = 10;
    static const int f = 10; //在确定表达式为常量表达式时也可以使用const
    static void HelloWorld(){
        cout << "HelloWorld!" << endl;
    }
    static void HW();
}

//错误，不可重复static
static void A::HW(){
    cout << "HW" << endl;
}

void A::HW(){
    cout << "HW" << endl;
}

int A::d = 10;

constexpr A::e;

//void AnotherFunc(const int &A);
AnotherFunc(A::e); 
AnotherFunc(A::f);//错误，未在类外定义
```

## 类型别名

### typedef关键字

typedef <声明语句> 

```cpp
typedef int (*name)[10]; //将声明语句表示的类型用name指代
name p2; //等价于 int (*p2)[10]
```

### using关键字

using  <名称1> = <名称2>

```cpp
using SI = StringItem; //令SI等价于StringItem
SI s; //等价于 StringItem s;
```

注意无论是typedef还是using，它们的别名都是基于语义的，不可以理解成#define式的字符串替换。比如：

```cpp
typedef char *PC1;
using PC2 = char*;
// 此时PC1与PC2表示的类型都是char的指针
PC1 &p1;
// 对于这个变量，其类型为PC1的引用即char的指针的引用：char &*p1；而不是char *&p1;
// 对PC2同理，但PC2更容易犯这样的错误，如PC2& = (char*)& = char*&这样的理解是绝对不行的。
```

## 类型推导

### auto关键字

通过初始值推导类型，故而必须初始化。

* 用引用初始化以auto声明的变量时，变量会以引用的对象类型作为变量类型。如需引用类型需要明确指出。
* 以指针初始化auto声明的变量时，会忽略顶层const。如需顶层const需要明确指出。
* 要在一条语句中声明多个变量，它们的初始值应该相同。

```cpp
int i = 2;
int &a = i;
int *p = i;
const int *p1 = i;
const int *const p2 = i;
auto ii = i; //ii为int
auto aa = a; //aa为int
auto pp = p; //pp为int*
auto pp1 = p1; //pp1为 const int*
auto pp2 = p2; //pp2为 const int*

auto &raa = a; //raa为int&
const auto cpp1 = p1; //cpp1为 const int const*
const auto &rii = i; //rii为 const int&

auto b = rii, c = raa;//X, rii为const int, raa为int
```

### decltype关键字

decltype(表达式) <声明符>

* decltype检查表达式的值类型，但**不实际计算该表达式**。

* decltype并不会改变顶层const和引用。
  * 引用仅在这种用途时不作为其绑定对象的同义词。

```cpp
int i = 1;
int &r = i;
int *const p = &i;

decltype(r) rr = i; //rr为 int&
decltype(p) pp = null;//pp为 int *const
```

### 复杂声明的理解

**由内而外，由右及左。**

即优先找离声明符最近的复合类型声明。对于距离声明符距离相同的复合类型声明，优先处理声明符右边。

例如：

```cpp
struct tm *(*(*Pfunc)[3])(int(*)(int, int), float(*[])(float));
/*
	1.首先，要找到主声明符的名字，这里是Pfunc
	2.找离Pfunc最近的复合类型声明，越近则影响越大，这里离Pfunc最近的是*，即Pfunc最本质上是一个指针。
	3.采用由内而外，由右及左的顺序分析，出于语序最好使用英文
	Pfunc is a pointer to an array(size 3) about pointer to function(C1, C2) return a pointer to struct tm.
	C1: a pointer to a function(int , int) return int
	C2: an array about pointer to a function(float) return float
*/

const int *(*&i)[3] = 0;
/*
	i is a reference for pointer to an array(size 3) about pointer to const int;
	const作用是修饰基本类型，不影响判断
*/
```