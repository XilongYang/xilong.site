---
title: 使用移动硬盘制作本地git仓库
author: Xilong Yang
date: 2021-06-27 
---

在一个普通的日子，突然想到用闲置的移动硬盘做一个本地git仓库。简单的理了理思路，确定了几个步骤：

1. 准备硬盘，比如分区与格式化。
2. 自动挂载硬盘，实现即插即用。
3. 使用硬盘托管代码。

于是放了一首歌，戴上耳机，哼着小曲开始了这次折腾。

## 制备硬盘

使用fdisk将这块硬盘上的分区全部删除，然后创建一个新的分区，具体步骤这里略过。

现在是时候格式化分区了，就决定是你了Ext4......等等，既然这个分区只是用来托管代码，为什么不试试没用过的文件系统呢？就决定是你了——Btrfs！

查阅了ArchWiki，Btrfs的介绍是这样的：

> Btrfs 是一种新型的写时复制 (CoW) Linux 文件系统，已经并入内核主线。Btrfs  在设计实现高级功能的同时，着重于容错、修复以及易于管理。它由 Oracle, Red Hat, Fujitsu, Intel, SUSE,  STRATO 等企业和开发者共同开发，Btrfs 以 GNU GPL 协议授权，同时也欢迎任何人的贡献。

经过了解，发现几个比较感兴趣的特点：

* 写时复制：任何写入操作都发生在空闲空间。与传统方式最显著的区别大概在于文件覆写时：传统方式直接在文件相应位置写入，而写时复制方式在空闲空间写入数据并通过修改原文件的元数据以使其相应位置的引用指向写入的位置，并在原地址引用数为0时释放其数据。
* 透明压缩：btrfs可以自动的尝试压缩文件，这样一方面减少了文件大小，另一方面显著延长了闪存介质的寿命。
* SSD TRIM：btrfs可以从支持TRIM 命令的 SSD 驱动器中释放未使用的块。已释放的空间范围不会被马上丢弃，它们会被集中起来并在稍后由一个单独的工作线程进行 TRIM，这将能改善提交延迟，以提高SSD的性能。

为了实现上述功能在挂载时需要添加两个参数：

`compress=zstd`：使用zstd算法启用自动压缩。

`discard=async`：使用SSD TRIM。

## 自动挂载

首先简单实现一个通过UUID挂载分区的脚本：

```shell
#! /bin/sh
# /usr/local/bin/mount_repo
# 挂载点
readonly target_dir="/mnt/Repo"
# 通过UUID获取分区名
label=`lsblk -f | grep 5398cf0b-266e-4874-a8e7-1ac903013b48 | grep -o -E sd..`
# 分区名存在则挂载，否则尝试卸载挂载点
if [ ${label} ]
then
    label="/dev/"${label}
    echo ${label}
    mkdir ${target_dir}
    mount -o compress=zstd,discard=async ${label} ${target_dir}
else
    echo "no device"
    umount ${target_dir}
    rmdir ${target_dir}
fi
```

现在我们有了通过指定UUID挂载分区的脚本了。问题是如何才能让硬盘插入时自动挂载呢？几经查询，发现了udev。

### 使用udev

ArchWiki对udev的介绍如下：

> udev 是 Linux 内核的设备管理器。总的来说，它取代了 devfs 和 hotplug，负责管理 `/dev` 中的设备节点。同时，udev 也处理所有用户空间发生的硬件添加、删除事件，以及某些特定设备所需的固件加载。
>
> 与传统的顺序加载相比，udev 通过并行加载内核模块提供了潜在的性能优势。异步加载模块的方式也有一个天生的缺点：无法保证每次加载模块的顺序，如果机器具有多个块设备，那么它们的设备节点可能随机变化。例如如果有两个硬盘，`/dev/sda` 可能会随机变成`/dev/sdb`。

当一个设备被添加或是移除时，udev会从kernel得知这个事件。然后遍历规则文件目录（默认在/etc/udev/rules.d）中的规则文件寻找匹配的规则，有就按规则处理，没有就作默认处理。

也就是说，我们可以通过编写规则文件的方式让udev在加载硬盘时进行挂载处理。

#### udev规则简介

udev规则文件中的一行就是一条规则，一条规则包括了匹配部分和动作部分，各部分通过逗号`,`分隔。具有如下形式：

```
cond1,cond2,cond3,...,action1, action2, action3
```

可以使用换行符`\`将一条规则分成几行编写。比如，对于以下规则：

```
KERNEL=="video[0-9]*" \
  , SUBSYSTEM=="video4linux" \
  , SUBSYSTEMS=="usb" \
  , ATTRS{idVendor}=="05a9" \
  , ATTRS{idProduct}=="4519" \
  , SYMLINK+="video-cam1"
```

* `KERNEL`是设备的卷标，这条规则使用了一个正则表达式对其进行匹配。
* `SUBSYSTEM`表示设备的类型
* `ATTRS{sth.}`获取设备的某个属性，属性名写在大括号中。
* `SYMLINK`是对该设备的软链接，使用+=对设备创建一个软链接。使用+=而不是=是因为不想覆盖掉默认操作。

#### 编写自动挂载规则

根据这个例子，摸着石头过河，编写一个使用脚本自动挂载硬盘的规则：

```
KERNEL=="sd[a-z][0-9]" \
  , ACTION=="remove" \
  , ATTRS{idVendor}=="08e4" \
  , ATTRS{idProduct}=="01e8" \
  , RUN+="/usr/local/bin/mount_repo" 

KERNEL=="sd[a-z][0-9]" \
  , ACTION=="add" \
  , ATTRS{idVendor}=="08e4" \
  , ATTRS{idProduct}=="01e8" \
  , RUN+="/usr/local/bin/mount_repo"
```

使用`udevadm control --reload`重新加载规则。

到这里，非常开心地，我们掉进坑里了。这条规则可以运行，但mount命令会出错，导致并不能如预期那样工作。

然后才看见ArchWiki上这条警告：

> **警告：** 要挂载可移动设备，请**不要**通过在 udev 规则中调用 `mount` 命令的方法。对 FUSE 文件系统将会导致 `Transport endpoint not connected` 错误。应代之以 [udisks](https://wiki.archlinux.org/title/Udisks_(简体中文)) 以正确处理自动挂载。或者把挂载动作放在 udev 规则内部：
>
> 将 `/usr/lib/systemd/system/systemd-udevd.service` 复制到 `/etc/systemd/system/systemd-udevd.service`，将 `MountFlags=slave` 替换为 `MountFlags=shared`。[（来源）](https://unix.stackexchange.com/a/154318) 
>
> Keep in mind though that udev is not intended to invoke long-running processes.

试图更改systemd-udevd.service，发现没效果。几经辗转，发现使用systemd可以解决这个问题。不再需要折腾systemd-udevd.service了。

首先创建一个service，repo.service：

```
[Unit]
Description=Mount Repository Device on /mnt/Repo

[Service]
Type=oneshot
RemainAfterExit=true
ExecStart=/usr/local/bin/mount_repo
ExecStop=/usr/local/bin/mount_repo
```

使用`systemctl daemon-reload`重新加载服务。

然后将规则文件改写为：

```
KERNEL=="sd[a-z][0-9]" \
  , ACTION=="remove" \
  , ATTRS{idVendor}=="08e4" \
  , ATTRS{idProduct}=="01e8" \
  , RUN+="/bin/systemctl stop repo.service" 

KERNEL=="sd[a-z][0-9]" \
  , ACTION=="add" \
  , ATTRS{idVendor}=="08e4" \
  , ATTRS{idProduct}=="01e8" \
  , RUN+="/bin/systemctl start repo.service"
```

使用`udevadm control --reload`重新加载规则。

到这里，自动挂载就可以正常工作了。

## 在硬盘上创建仓库

在使用`git --bare init`创建一个远程仓库：

```
cd /mnt/Repo
mkdir test.git
cd test.git
git --bare init
```

为本地git仓库添加这个远程仓库：

```
cd ~/someprojects
git remote add Repo /mnt/Repo/test.git
git push remote master
```

## 后记

这次的折腾算是记录一下与udev的初次接触。使用linux的过程中总能用到以为永远不会碰的工具，这也是linux的魅力所在吧。

