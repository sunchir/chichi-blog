---
title: div居中方案
date: 2020-12-25 11:58:00
categories:
 - technology
tags:
  - frontend
  - css
  - react
---
项目中解决modal居中问题，既要满足可以自由拖拽也要满足初始化居中，看似简单的问题其实在实际实现中会出现样式互斥问题。为了解决这个问题首先要明白:

- 如何实现居中
- 如何实现自由拖拽

下面已经区分了这个两个问题

### 居中

这个算这次总结的重点内容：

- **Dom 结构**

```html
<div class="parent">
  <div class="child"></div>
</div>
```

1. flex布局（首选不需要知道宽高）

    ```css
    div.parent {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /*
    * 原理：通过justify-content和align-items两个属性来实现水平垂直居中，一个定义的是水平轴山上的对齐方式，另一个则定义的是垂直轴上的对齐方式。
    */
    ```

2. 绝对定位1（一定要知道子集的宽高）

    ```css
    div.parent {
        position: relative; 
    }
    /* 或者 */
    div.child {
        width: 50px;
        height: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -25px;
        margin-top: -5px;
    }

    /**
    原理：这个的实现方法原理还是很好理解的。相对父元素定位，距上边和左边个一半，然后在减去子元素的一半。
    */
    ```

3. 绝对定位2（一定要知道子集的宽高）

    ```css
    /* 或 */
    div.child {
        width: 50px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }

    /*具有流体特性绝对定位元素的margin:auto的填充规则和普通流体元素一模一样：
    	如果一侧定值，一侧auto，auto为剩余空间大小；
      如果两侧均是auto, 则平分剩余空间；*/
    ```

4. 绝对定位3（可以不需要子集宽高，但是设置动画或者性能不好会导致出现闪屏）

    ```css

    div.child {
        position: absolute; 
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);  
    }
    ```

5. flex2(因为改变了父容器的display，多个子节点不好)

    ```css
    div.parent{
      display:flex;
    }
    div.child{
      margin:auto;
    }
    ```

6. gride(因为改变了父容器的display，多个子节点不好)

    ```css
    div.parent{ display:grid; } div.child{ margin:auto; }

    ```

7. css3 (注意兼容和动画效果影响)

    ```css
    div.child{    
    		position: absolute;
        left: 50%;
        top: 50%;
        z-index: 1;
        transform: translate3d(-50%,-50%,0);
    }
    ```

8. table 布局（因为改变了父容器的display，多个子节点不好）

    ```css
    div.parent {
    display: table;
    }
    div.child {
    display: table-cell
    vertical-align: middle;
    text-align: center;
    }
    ```

9. vertical-aligin (子集必须为指定的display)

    ```css
    div.parent {
        font-size: 0;
        text-align: center;
        &::before {
            content: "";
            display: inline-block;
            width: 0;
            height: 100%;
            vertical-align: middle;
        }
    }
    div.child{
      display: inline-block;
      vertical-align: middle;
    }

    /*
    ，那么伪类撑开了父元素的基准线（高度是100%），使得此时文字的基准线就是整个div.parent的中心了，另外vertical-align只影响inline或者inline-block的，所以div.child设置vertical-align就能居中了
    */
    ```

### 拖拽

当前项目使用的React所以我直接放代码了

```tsx
@autobind
  handleHeaderMouseDown(downEvent: MouseEvent) {
    const { element } = this;
    if (element) {
      const { prefixCls } = this;
      const { clientX, clientY } = downEvent;
      const { offsetLeft, offsetTop } = element;
      this.moveEvent
        .addEventListener('mousemove', (moveEvent: MouseEvent) => {
          const { clientX: moveX, clientY: moveY } = moveEvent;
          classes(element).remove(`${prefixCls}-center`);
          const left = pxToRem(Math.max(offsetLeft + moveX - clientX, 0));
          const top = pxToRem(Math.max(offsetTop + moveY - clientY, 0));
          this.offset = [left, top];
          Object.assign(element.style, {
            left,
            top,
          });
        })
        .addEventListener('mouseup', () => {
          this.moveEvent.clear();
        });
    }
  }
```

1. 定位使用position:Fixed   ex:当对元素设置固定定位后，它将脱离标准文档流的控制，始终依据浏览器窗口来定义自己的显示位置。
2. 使用top 和 left来定位位置
3. 所以整个dom的定位是当前偏移位置 + 鼠标移动位置 列：代码的左偏移量 （offsetLeft + （moveX - clientX））

#### 鼠标事件说明
|属性	|说明|
| --- | --- | --- | 
|clientX|	以浏览器左上顶角为原点，定位 x 轴坐标|
|clientY|	以浏览器左上顶角为原点，定位ｙ轴坐标|
|offsetX|	以当前事件的目标对象左上角为原点，定位x轴坐标|
|offsetY|	以当前事件的目标对象左上角为原点，定位y轴坐标|
|pageX|	以Document 对象（即文本窗口）左上角为原点，定位x轴坐标|
|pageY|	以Document 对象（即文本窗口）左上角为原点，定位ｙ轴坐标|
|screenX|	计算机屏幕左上角为原点，定位x轴坐标|
|screenY|	计算机屏幕左上角为原点，定位ｙ轴坐标|
|layerX|	最近的绝对定位的父元素（如果没有，则为Document对象）左上角为原点，定位x轴坐标|
|layerY|	最近的绝对定位的父元素（如果没有，则为Document对象）左上角为原点，定位ｙ轴坐标|

### 结合

- 方案一：使用默认的fixed布局结合：绝对定位2 在componentDidMount给子集设置高度。问题会导致出现内部子集异步撑开高度出现显示异常。
- 方案二:  使用绝对定位3 会出现不知道哪里的动画效果导致闪烁位置
- 方案三：flex布局 没有出现任何闪烁符合需求只是需要重新设置下parent的高度为100vh

### 总结

上面总结了很多居中方案各有优劣。我当然是觉得结合适合业务场景选择最好，在都满足条件的情况下选择代码最少，最稳定的即可，个人倾向flex。