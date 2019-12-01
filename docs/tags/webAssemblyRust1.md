---
title: Rust and WebAssembly 🕸
date: 2019-07-15 11:58:00
tags:
  - frontend
  - WebAssembly
  - Rust
---

这个小书描述了怎样结合rust和webassembly

## 适合谁

这个书适合于那些对于想使用rust编译成webAssembly实现更快更可靠的web编码。你需要知道一些rust以及了解JavaScript和html，css。你不需要达到精通其中任何一个。

不懂rust？[Rust 程序设计语言](https://kaisery.github.io/trpl-zh-cn/)

不懂html，css，js？ [MDN](https://developer.mozilla.org/zh-CN/)

## 怎样阅读这本书

你需要阅读使用rust结合webAssembly的动力,同样的首先需要更加熟悉概念和背景。

这个教程需要从头到尾阅读，你需要按照步骤书写，编译，运行你自己的代码。如果你以前没有使用过rust 结合 webassembly 跟随教程。仔细阅读参考切面可能在任何地方出现。

## 为什么选择rust结合webassembly 

### 更底层的控制更高效的工程

JavaScript web 应用一直难以达到可靠的表现，javascript的动态类型系统和垃圾回收机制，对于可靠没有任何帮助。如果你散漫的游走在JIT的快码上面，看起来小小的代码变化将会导致性能剧烈下降。

rust将会给程序提供更底层的控制和更可靠的表现，它摆脱了像javascript那样不确定的垃圾回收。程序员可以控制单一状态和内存释放。

### 更小.wasm 文件大小

当文件必须在互联网传递的时候，代码的大小显得十分重要。rust不需要运行依赖，所以不会有垃圾回收器这种让代码文件变大的额外开销。

### 不需要重写所有的东西

已经存在的代码不需要抛弃，你可以在现有基础功能上，选择对于javascript中对于性能敏感的函数移植使用rust来实现就可以马上获得收益。如果你觉得不需要修改的地方可以保持原状。

### 和其他的东西也可以表现的很好

rust 和 webassembly 一起使用可以完好的与javascript的工具链存在。它支持ecmascript 的 模块化 你能够继续使用你喜欢的工具链比如npm，webpack和greenkeeper这些。

### 让你所期待的

rust具有开发人员期望的现代比那里设施，比如：
强有力的包管理工具
零抽象成本
活跃的社区（不要脸还在笑）

## 背景和观念

本节提供了深入研究Rust和WebAssembly开发的必要上下文。

### 什么是webAssembly

webassembly是简单的机器模型和广泛的执行规范，他被设计的更加的轻巧紧凑并且执行速度接近机器码

作为一个程序语言，webAssembly 是包含两个相同的格式结构，尽管使用方式不同：

  1. .wat 格式叫做webassembly 文本 使用 S表达式和LIsp方言拥有相似的特性比如（scheme和clojure）

  2. .wasm 是比较低级的目的是在wasm虚拟机里面直接使用，从概念上讲类似于ELF和Mach-O

作为参考这是在.wat阶乘的算法：

```wat
(module
  (func $fac (param f64) (result f64)
    get_local 0
    f64.const 1
    f64.lt
    if (result f64)
      f64.const 1
    else
      get_local 0
      get_local 0
      f64.const 1
      f64.sub
      call $fac
      f64.mul
    end)
  (export "fac" (func $fac)))
```

如果好奇怎么搞使用wat2wasm demo 和下面的例子

## 线性储存

webAssembly 拥有简单的储存模型，一个wasm模型拥有的单线程存储，本质上是字节平面的数组。这个内存可以增加为64倍数的大小，不能再缩减了。

## webAssembly 不仅仅可以运行在web

尽管目前它引起了javascript和web社区的普遍关注，但是wasm并没有对自己的运行环境设置限制。因此，可以推测wasm将会成为各种运行环境的一种可执行文件格式。当然在今天，wasm联系最为 密切的还是javascript，不管是在web端还是node服务端。

## 配置

这个章节描述怎么样使用rust编译出webassemble程序以及配合javascript的整合。

## rust工具链

你需要标准的rust工具链，包括rustup，rusttc以及cargo。

[这里介绍rust工具链](https://www.rust-lang.org/tools/install)

rust与webassembly的使用经验是基于稳定的版本，所以我们可以不需要使用一些实验性的功能。但是需要1.3或者更高的rust版本。

## wasm-pack

wasm-pack 是一个集构建发布rust webassembly产物的一站式商城。

[wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

## cargo-generate

cargo-generae 帮助你快速使用git上面的模板构建一个rust项目。

安装cargo-generate的命令

```bash

cargo install cargo-generate

```

切换源：找到当前用户目录下 /Users/baoyachi/.cargo/ 的.cargo 文件夹，进入.cargo 当前目录，在当前目下创建 config 文件 ，打开 config 文件，编写以下内容：

```text
[source.crates-io]
registry = "https://github.com/rust-lang/crates.io-index"
replace-with = 'ustc'
[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
```

## npm

npm 是一个javascript包管理工具。我们将会使用它打包和开发服务。在最后的教程里面我们将会编译.wasm给npm登记

[获取npm](https://www.npmjs.com/get-npm)

如果你已经安装npm，确保已经使用下面的命令

```bash

npm install npm@latest -g

```

## Helo,World

这个章节将会给你展示如何创建第一个，rust结合webassembly程序：一个页面提示框提示"Hello world" 确认开始之前你已经安装了上面的工具。

## 下载模板

这个工程模板  