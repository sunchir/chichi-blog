---
title: react-test
date: 2020-02-10 11:58:00
categories:
 - technology
tags:
  - frontend
  - jest
  - react
---


# react 测试环境搭建

## 开篇

     最近梳理组件代码，在主要工作就是学习,改bug以及测试。主要使用的工具链是jest + enzyme，这套的有点是能够使用类似jquery的方式进行测试在某种程度上是非常舒服的，还有一种方案使用react-creat-app 自带的测试react-testing-Library测试。两者各有优劣，所以可以更具自己的需求进行选择，最后总结的时候进行我认为的两者的选择。

### 测试集成

    这里面主要介绍怎么在react项目中集成测试，目的也很简单比如有些项目需要使用TDD方式开发就可以参考这里。比如一些其他详细介绍可以参考下面文章。

这边的测试我一律使用来演示，更加方便清晰。

    npx create-react-app my-app
    cd my-app
    npm start

### jest + enzyme

1. 项目搭建好了之后添加在package 下面引用如下依赖包，或者直接复制package.json然后运行yarn or npm i

    {
      "name": "my-app",
      "version": "0.1.0",
      "private": true,
      "dependencies": {
        "@testing-library/jest-dom": "^4.2.4",
        "@testing-library/react": "^9.3.2",
        "@testing-library/user-event": "^7.1.2",
        "react": "^16.12.0",
        "react-dom": "^16.12.0",
        "react-scripts": "3.3.1"
      },
      "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "jest --colors --coverage",
        "eject": "react-scripts eject"
      },
      "devDependencies": {
        "@babel/core": "*",
        "@babel/plugin-proposal-class-properties": "*",
        "@babel/preset-env": "*",
        "@babel/preset-react": "*",
        "babel-jest": "*",
        "enzyme": "*",
        "enzyme-adapter-react-16": "*",
        "jest": "*"
      },
      "eslintConfig": {
        "extends": "react-app"
      },
      "browserslist": {
        "production": [
          ">0.2%",
          "not dead",
          "not op_mini all"
        ],
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ]
      },
      "jest": {
        "moduleFileExtensions": [
          "js",
          "jsx"
        ],
        "moduleDirectories": [
          "node_modules"
        ],
        "moduleNameMapper": {
          "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__jest__/__mocks__/fileMock.js",
          "\\.(css|scss)$": "identity-obj-proxy",
          "^cpn(.*)$": "<rootDir>/src/components$1"
        }
      }
    }

2. 添加babel配置.babelrc.js

    module.exports = {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-proposal-class-properties']
      };

3. 由于初始项目使用了testing-library 这里的babel-jest版本会与引入的版本冲突应该后续会修复。我添加了这个文件.env

    SKIP_PREFLIGHT_CHECK=true

- 基本上面的配置就可以实现测试了详细的测试使用方法见[jest&&enzyme](https://blog.chi-chi.store/views/technology/2020/jest%20Enzyme.html) 下面就随便找个demo 测试下，首先删除自带的测试有俩个带测试的Test文件直接删除

因为可能会和原测试冲突

4.  index.js修改  

    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import Home from './components/Home.jsx'
    import * as serviceWorker from './serviceWorker';
    
    ReactDOM.render(<Home />, document.getElementById('root'));
    
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();

5. 创建一个文件夹components 在里面创建两个文件一个**tests/Home-test.js 一个Home.jsx** 

    //**Home.jsx 
    
    import React from 'react'
    
    export default class Home extends React.Component {
        static defaultProps = {
            title: 'jest + enzyme demo',
            value: 0
        }
    
        constructor(props) {
            super(props)
            const { title, value } = props
            this.state = {
                title,
                value
            }
        }
    
        componentWillReceiveProps(newProps) {
            const { title, value } = newProps
            this.setState({ title, value })
        }
    
        render() {
            const { title, value } = this.state
            return (
                <div>
                    <h1>{title}</h1>
                    <div className='show-value'>value = {value}</div>
                    <input value={value} onChange={this.changeHandler} />
                    <button onClick={this.add}>Value++</button>
                </div>
            )
        }
    
        add = () => {
            this.setState({
                value: parseInt(this.state.value) + 1
            })
        }
    
        changeHandler = e => {
            this.setState({
                value: e.target.value
            })
        }
    
    }**

    //**tests/Home-test.js** 
    import React from 'react';
    import Enzyme, {mount} from 'enzyme';
    import Adapter from 'enzyme-adapter-react-16';
    import Home from '../Home';
    
    Enzyme.configure({adapter: new Adapter()});
    
    describe('UI test #home', () => {
        it('shoule have title', () => {
            const wrapper = mount(<Home />)
            const title = wrapper.find('h1')
            expect(title).toHaveLength(1)
        })
    
        it('should add 1 when click button', () => {
            const wrapper = mount(<Home />)
            const showValue = wrapper.find('.show-value')
            const inputOldValue = parseInt(showValue.text())
            // 模拟button点击事件
            wrapper.find('button').simulate('click')
            const inputCurrentValue = parseInt(showValue.text())
            expect(inputCurrentValue).toBe(inputOldValue + 1)
        })
    
        it('should change to the input value when input a number', () => {
            const wrapper = mount(<Home />)
            const showValue = wrapper.find('.show-value')
            // 模拟监听input输入框的change事件
            wrapper.find('input').simulate('change', {
                target: {
                    value: '5'
                }
            })
            expect(showValue.text()).toBe("value = 5")
        })
    
        it('should change when props change', () => {
            const wrapper = mount(<Home title="aaa"/>)
            const title = wrapper.find('h1')
    
            expect(title.text()).toBe('aaa')
            
            wrapper.setProps({
                title: 'bbb'
            })
    
            expect(title.text()).toBe('bbb')
        })
    
    })

运行 npm run test 

测试结果

    ----------|---------|----------|---------|---------|-------------------
    File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    ----------|---------|----------|---------|---------|-------------------
    All files |     100 |      100 |     100 |     100 |                   
     Home.jsx |     100 |      100 |     100 |     100 |                   
    ----------|---------|----------|---------|---------|-------------------
    Test Suites: 1 passed, 1 total
    Tests:       4 passed, 4 total
    Snapshots:   0 total
    Time:        3.221s

好了这样就可以测试了

### ReactTesting  Library

这个目前我使用creat-reat-app 构建它会自动创建。所以理论上可以不用配置了。如果需要引入这个测试工具。最简单加上这个在package.json

    "dependencies": {
        "@testing-library/jest-dom": "^4.2.4",
        "@testing-library/react": "^9.3.2",
        "@testing-library/user-event": "^7.1.2",
        "react": "^16.12.0",
        "react-dom": "^16.12.0",
        "react-scripts": "3.3.1"
      }

一个模板例子

    import React from 'react';
    import { render } from '@testing-library/react';
    import App from './App';
    
    test('renders learn react link', () => {
      const { getByText } = render(<App />);
      const linkElement = getByText(/learn react/i);
      expect(linkElement).toBeInTheDocument();
    });

### 测试框架选择

我的观点里面就是当希望对于测试有太多的配置需求比如mock数据还有一些关于组件内部代码的测试那就用 jest + enzyme 如果是 满足业务流程比如页面展示变化就使用ReactTesting  Library。为什么呢？ 

而一个稳定可靠的测试用例应该脱离组件内部的实现细节, 越接近用户行为的测试用例能给开发者带来越充足的自信。相较于 enzyme, react-testing-library 所提供的 api 更加贴近用户的使用行为。

比如下面列子

    class Carousel extends React.Component {
      state = {
        index: 0
      }
    
      /* 跳转到指定的页数 */
      jump = (to: number) => {
        this.setState({
          index: to
        })
      }
    
      render() {
        const { index } = this.state
        return <>
          <Swipe currentPage={index} />
          <button onClick={() => this.jump(index + 1)}>下一页</button>
          <span>`当前位于第${index}页`</span>
        </>
      }
    }

如果把index 改为 currentPage

enzyme 需要修改

    describe('Carousel Test', () => {
      it('test jump', () => {
        ...
    
    -   expect(wrapper.state('index')).toBe(0)
    +   expect(wrapper.state('currentPage')).toBe(0)
        wrapper.instance().jump(2)
    -   expect((wrapper.state('index')).toBe(2)
    +   expect((wrapper.state('currentPage')).toBe(2)
      })
    })

react-testing-library  不需要修改

    import { render, fireEvent } from '@testing-library/react'
    
    describe('Carousel Test', () => {
      it('test jump', () => {
        const { getByText } = render(<Carousel>
          <div>第一页</div>
          <div>第二页</div>
          <div>第三页</div>
        </Carousel>)
    
        expect(getByText(/当前位于第一页/)).toBeInTheDocument()
        fireEvent.click(getByText(/下一页/))
        expect(getByText(/当前位于第一页/)).not.toBeInTheDocument()
        expect(getByText(/当前位于第二页/)).toBeInTheDocument()
      })
    })

### 总结

其实对于总体来说 enzyme也可以实现react-testing-library  但是免不了会有其他粒度操作而react-testing-library  就特别简单了。仁者见仁看你的需求了。