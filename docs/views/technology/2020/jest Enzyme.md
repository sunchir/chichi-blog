---
title: jest && Enzyme
date: 2020-01-25 11:58:00
categories:
 - technology
tags:
  - frontend
  - jest
  - react
---

## 背景：

1. 目前前端对于开发方面从以前的设计为主的模式开始了技术导向的模式
2. 通过对于软件工程发展的学习明白了软件危机的来源：屎山
3. 解决问题的方法可测试可维护的程序。

 

### 测试分类

目前主要两大类白盒测试和黑盒测试

- 单元测试：指的是以原件的单元为单位，对软件进行测试。单元可以是一个函数，也可以是一个模块或一个组件，基本特征就是只要输入不变，必定返回同样的输出。一个软件越容易些单元测试，就表明它的模块化结构越好，给模块之间的耦合越弱。React的组件化和函数式编程，天生适合进行单元测试
- 功能测试：相当于是黑盒测试，测试者不了解程序的内部情况，不需要具备编程语言的专门知识，只知道程序的输入、输出和功能，从用户的角度针对软件界面、功能和外部结构进行测试，不考虑内部的逻辑

## Jest

    
```js
     import Enzyme from 'enzyme';
    let Adapter; //根据当前react版本自动选择
    if (process.env.REACT === '15') {
      Adapter = require('enzyme-adapter-react-15'); // eslint-disable-line
    } else {
      Adapter = require('enzyme-adapter-react-16');
    }
    
    Enzyme.configure({ adapter: new Adapter() });
```

- .jest.js 文件配置

```js
    const libDir = process.env.LIB_DIR;
    
    const transformIgnorePatterns = [
      '/dist/',
      'node_modules/[^/]+?/(?!(es|node_modules)/)', // Ignore modules without es dir
    ];
    
    module.exports = {
      verbose: true,
      testURL: 'http://localhost/',
      setupFiles: ['./tests/setup.js'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'md'],
      modulePathIgnorePatterns: ['/_site/'],
      testPathIgnorePatterns: ['/node_modules/', 'dekko', 'node','/components/'],
      transform: {
        '\\.tsx?$': './tools/jest/codePreprocessor',
        '\\.jsx?$': './tools/jest/codePreprocessor',
        '\\.md$': './tools/jest/demoPreprocessor',
      },
      testRegex: libDir === 'dist' ? 'demo\\.test\\.js$' : '.*\\.test\\.js$',
      collectCoverageFrom: [
        'components/**/*.{ts,tsx}',
        '!components/*/style/index.tsx',
        '!components/style/index.tsx',
        '!components/*/locale/index.tsx',
        '!components/*/__tests__/**/type.tsx',
        '!components/**/*/interface.{ts,tsx}',
        'components-pro/**/*.{ts,tsx}',
        '!components-pro/*/style/index.tsx',
        '!components-pro/style/index.tsx',
        '!components-pro/*/locale/index.tsx',
        '!components-pro/*/__tests__/**/type.tsx',
        '!components-pro/**/*/interface.{ts,tsx}',
      ],
      transformIgnorePatterns,
      snapshotSerializers: ['enzyme-to-json/serializer'],
      globals: {
        'ts-jest': {
          tsConfig: './tsconfig.test.json',
        },
      },
      cacheDirectory: `./.jest-cache/${libDir || 'default'}`,
    };
```

### 配置描述

- setupFiles ：配置文件，在运行测试案例代码之前，Jest会先运行这里的配置文件来初始化指定的测试环境
- moduleFileExtensions ：代表支持加载的文件名
- testPathIgnorePatterns ：用正则来匹配不用测试的文件
- testRegex ：正则表示的测试文件，测试文件的格式为xxx.test.js
- collectCoverage ：是否生成测试覆盖报告，如果开启，会增加测试的时间
- collectCoverageFrom ：生成测试覆盖报告是检测的覆盖文件
- moduleNameMapper ：代表需要被Mock的资源名称
- transform ：用babel-jest来编译文件，生成ES6/7的语法
- testMatch：设置识别哪些文件是测试文件（glob形式），与testRegex互斥
- testRnviroment：测试环境，默认值是：jsdom，可修改为node
- rootDir：默认值：当前目录，一般是package.json所在的目录
- transformIgnorePatterns：一个字符串数组，满足里面的元素将会跳过转化
- globals： 导出一个功能模块在所有测试模块加载完之后触发一次。ps.这里是倒入tslint规则然后对模块校验
- [更多的配置详情](https://jestjs.io/docs/en/configuration)

### global api

- describe(name, fn)：描述块，讲一组功能相关的测试用例组合在一起
- afterAll(fn, timeout)：所有测试用例跑完以后执行的方法
- beforeAll(fn, timeout)：所有测试用例执行之前执行的方法
- afterEach(fn)：在每个测试用例执行完后执行的方法
- beforeEach(fn)：在每个测试用例执行之前需要执行的方法

describe 优先级最低但是是一个块状可以包含上面四个周期

 ```js
    // 这个例子是一个用法
    describe('Tree-pro', () => {
      beforeEach(() => {
        jest.useFakeTimers(); //开始时候使用虚拟时间
      });
    
      afterEach(() => {
        jest.useRealTimers();// 结束后使用真实时间
      });
    
      it('should have a input', () => {
        const { wrapper } = setupByMount();
        expect(wrapper.find('input').length).toBe(1);
      });
    });
```

### 快照

快照会生成一个组件的UI结构，并用字符串的形式存放在__snapshots__文件里，通过比较两个字符串来判断UI是否改变，因为是字符串比较，所以性能很高。

根据这个方法来实现toMatchSnapshot

## Enzyme

Enzyme是Airbnb开源的React测试工具库库，它功能过对官方的测试工具库ReactTestUtils的二次封装，提供了一套简洁强大的 API，并内置Cheerio，

实现了jQuery风格的方式进行DOM 处理，开发体验十分友好。在开源社区有超高人气，同时也获得了React 官方的推荐。

### 渲染方法

- shallow 在单元测试的过程中，浅渲染将一个组件渲染成虚拟DOM对象，并不会渲染其内部的子组件，也不是真正完整的React Render,无法与子组件互动。
- render静态渲染API，使用enzyme's 的render函数从React树生成HTML，并分析生成的HTML结构。render返回包装非常类似于在enzyme's的其它渲染器，render使用第三方HTML解析和遍历库 Cheerio。我们相信Cheerio非常好地处理HTML的解析和遍历，并且自己复制这个功能
- mount完整的DOM渲染非常适用于组件可能与DOM API交互或需要测试包含在更高阶组件中的组件的情况。完整DOM渲染要求在全局范围内提供完整的DOM API。这意味着它必须在至少“看起来像”浏览器环境的环境中运行。如果您不想在浏览器中运行测试，推荐的使用方法mount是依赖于一个名为jsdom的库，它本质上是一个完全用JS实现的无头浏览器。

### 常用的方法

- .childAt(index) => ShallowWrapper返回具有指定索引的子元素到新的wrapper

- .find(selector) => ShallowWrapper根据选择器，找到渲染树中的节点。

- .findWhere(predicate) => ShallowWrapper找到渲染树中里被的断言函数返回true的节点 参数：predicate (ShallowWrapper => Boolean) 断言函数返回布尔值

- .filter(selector) => ShallowWrapper过滤当前包装器中与所提供的选择器不匹配的节点。

- .filterWhere(predicate) => ShallowWrapper过滤当前包装器里被断言函数predicate不返回true的节点

- .contains(nodeOrNodes) => Boolean返回给定的 节点/节点数组 是否在渲染树中的布尔值。

- .containsMatchingElement(node) => Boolean返回在浅渲染树中是否存在给定的node节点 的布尔值。

- .containsAllMatchingElements(nodes) => Boolean返回在浅渲染树中是否存在给定的 所有 react元素 的布尔值。

- .containsAnyMatchingElements(nodes) => Boolean返回在浅渲染树中是否存在给定react元素 之一 的布尔值

- .equals(node) => Boolean根据期望值，返回当前渲染树是否等于给定节点的 布尔值

- .matchesElement(node) => Boolean返回当前给定的react元素 是否 匹配浅渲染树 的布尔值

- .hasClass(className) => Boolean是否有这个className

- .is(selector) => Boolean当前节点是否与提供的选择器匹配

- .exists() => Boolean当前节点是否存在

- .isEmpty() => Boolean弃用: 用 .exists() 代替.

- .not(selector) => ShallowWrapper删除当前wrapper中与所提供的选择器匹配的节点。 (与 .filter()作用相反)

- .children() => ShallowWrapper获取当前 wrapper 中所有子节点的 wrapper.

- .childAt(index) => ShallowWrapper返回具有指定索引的子元素的 wrapper

- .parents() => ShallowWrapper获取当前节点的所有父级（祖先）

- .parent() => ShallowWrapper获取当前节点的直接父级

- .closest(selector) => ShallowWrapper根据选择器，获取当前节点的第一个祖先

- .shallow([options]) => ShallowWrapper 渲染组件不渲染其子组件返回ShallowWrapper

- .render() => CheerioWrapper返回当前节点的子树的CheerioWrapper

- .unmount() => ShallowWrapper卸载组件的方法

- .text() => String返回当前渲染树中文本节点的 字符串表示形式。

- .html() => String返回当前节点的静态HTML呈现

- .get(index) => ReactElement返回给出索引的节点 ReactElement

- .getNode() => ReactElement返回底层节点

- .getNodes() => [ReactElement]返回底层的一些节点

- .at(index) => ShallowWrapper返回 参数：索引节点的 浅wrapper。

- .first() => ShallowWrapper返回当前第一个节点 wrapper

- .last() => ShallowWrapper返回当前最后一个节点 wrapper

- .state([key]) => Any返回根组件的状态

- .context([key]) => Any返回根组件的上下文环境

- .props() => Object返回当前节点的 props

- .prop(key) => Any返回当前节点props的某个(key)属性的值

- .key() => String返回当前节点的键（key）

- .simulate(event[, data]) => ShallowWrapper模拟当前节点上的事件

- .setState(nextState) => ShallowWrapper手动setState更新根组件状态

- .setProps(nextProps) => ShallowWrapper手动更新根组件的props

- .setContext(context) => ShallowWrapper手动设置根组件的上下文

- .instance() => ReactComponent返回根组件的实例

- .update() => ShallowWrapper在根组件实例上调用.forceUpdate()

- .debug() => String返回当前浅渲染树的字符串表示形式，以便进行调试

- .type() => String|Function返回包装器(wapper)的当前节点的类型。

- .name() => String返回当前节点的名称

- .forEach(fn) => ShallowWrapper迭代当前的每个节点并执行提供的函数

- .map(fn) => Array将当前的节点数组映射到另一个数组

- .reduce(fn[, initialValue]) => Any将当前节点数组减少为一个值

- .reduceRight(fn[, initialValue]) => Any将当前节点数组从右到左减少为一个值 Reduces the current array of nodes to a value, from right to left.

- .slice([begin[, end]]) => ShallowWrapper根据Array＃slice的规则返回具有原始包装器的节点的子集的新包装器。

- .tap(intercepter) => Self点击wrapper方法链。有助于调试。 Taps into the wrapper method chain. Helpful for debugging.

- .some(selector) => Boolean返回 是否有 节点与提供的选择器匹配。

- .someWhere(predicate) => Boolean返回 是否有 节点 传递所提供的断言函数。

- .every(selector) => Boolean返回 是否 有节点与提供的选择器匹配。

- .everyWhere(predicate) => Boolean返回 是否 所有 节点都传递所提供的断言函数。

- .dive([options]) => ShallowWrapper浅渲染当前wrapper的一个非DOM子元素，并在结果周围返回一个wrapper