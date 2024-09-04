---
title: CMakeLists.txt编写入门
author: Xilong Yang
date: 2021-08-02 
---

<div class="abstract">

### 前言

整理一下CMakeLists的相关知识。

</div>

$$toc$$

## 语法

听说CMake已经被证明图灵完备了，不过它的语法还是很简单的，由命令、变量和注释组成。

注释：以`#`开头的行即为注释。

命令：包括命令名和一个括号括起来的参数列表。形式如下：

```Cmake
command(arg1 arg2 ...) # 参数以空格分隔
```

变量：由命令生成或CMake环境定义，使用`$`和`{}`来引用变量：

```cmake
${SOMEVAR} # 变量的值
SOMEVAR    # 字面值
```

CMakeList.txt是逐行解析的，因此变量的定义应在使用之前。

好了，现在你已经学会CMake了。了解几个常用命令和变量就可以使用了。

## 基础命令与变量

`cmake_minimum_required(<version>)`：指定CMake的最小版本号。

`project(<name>)`：指定工程名称。

`include_directories(<dir1> <dir2> ...)`：指定include目录。

* 变量`CMAKE_SOURCE_DIR`：表示工程顶层目录。

`aux_source_directory(<dir> <var>)`：将一个目录中所有源文件赋予一个变量。

`add_executable(<target> <source1> <source2> ...)`：构建可执行文件，第一个参数为文件名称，后面的参数为源文件列表。

有了这几条命令，我们就可以编写一个能用的CMakeList.txt文件了：

```cmake
cmake_minimun_required(3.1)
project(HelloWorld)
include_directories(${CMAKE_SOURCE_DIR}/include)
aux_source_dirctory(${CMAKE_SOURCE_DIR}/src DIR_SRC)
add_executable(helloworld ${DIR_SRC})
```

## 控制流命令

* if

```cmake
if(conditon)
...
elseif(condition)
...
else()
...
endif()
```

* while

```cmake
while(condition)
...
endwhile()
```

* foreach

```cmake
foreach(var arg1 arg2 ...)
...
endforeach(var)
```

## 常用命令

`set(var value)`：为变量赋值。

`add_definitions(-Dxxxx1 -Dxxxx2 ...)`：向编译器添加-D定义，此时代码内的`#ifdef xxxx ... #endif`代码块生效。

`add_dependencies(target-name depend-target1 ...)`：添加依赖目标。

`add_library(name [STATIC|SHARED] src1 src2...)`：创建库，如果未指定库类型则默认构建STATIC库，可以通过定义变量`BUILD_SHARED_LIBS`改为默认构建SHARED库。

`target_link_library(target-name lib1 lib2 ...)`：为taget链接库。

`add_subdirectory(subdir1 subdir2 ...)`：添加子目录，使用子目录的CMakeLists.txt构建子目录中的文件。

`add_test(testname execname arg1 arg2...)`：添加测试，execname可以是任何可执行文件的名称。在生成makefile后可以使用`make test`来进行测试。

`ebable_test()`：开启测试开关，没有这条指令则任何add_test指令都是无效的。

`find_library(var NAMES name1 name2 ... PATHS path1 path2 ...)`：在path中查找基础名称为name的库，并将其完整路径赋予变量var。

`file_path(var file path1 path2 ...)`：在path中查找file，并将path路径赋予变量var。

## 常用变量

`CMAKE_BINARY_DIR` = `PROJECT_BINARY_DIR` = `<projectname>_BINARY_DIR`：可执行文件生成目录。

`CMAKE_SOURCE_DIR` = `PROJECT_SOURCE_DIR` = `<projectname>_SOURCE_DIR`：工程顶层目录。

`CMAKE_CURRENT_SOURCE_DIR`：当前文件（可以是子文件夹的CMakeLists.txt）所在目录。

`CMAKE_CURRENT_BINARY_DIR`：当前文件产生的可执行文件目录。

`CMAKE_CURRENT_LIST_FILE`：调用此变量的CMakeLists.txt的完整路径。

`CMAKE_CURRENT_LIST_LINE`：此变量所在的行。

`CMAKE_MODULE_PATH`：模块的路径。

`EXECUTABLE_OUTPUT_PATH`：可执行文件的存放路径。

`LIBRARY_OUTPUT_PATH`：库文件的存放路径。

`CMAKE_MAJOR_VERSION`：主版本号。

`CMAKE_MINOR_VERSION`：次版本号。

`CMAKE_PATCH_VERSION`：补丁等级。

`CMAKE_SYSTEM`：系统名称。

`CMAKE_SYSTEM_NAME`：不含版本的系统名。

`CMAKE_SYSTEM_PROCESSOR`：处理器名称。

`UNIX`：在unix环境下为TRUE。

`WIN32`：在win32环境下为TRUE。
