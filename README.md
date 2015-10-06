# uxcore-transfer

---

## TL;DR

transfer ui component for react

#### setup develop environment

```sh
$ git clone https://github.com/uxcore/uxcore-transfer
$ cd uxcore-transfer
$ npm install
$ npm run dev
```

## Usage

```
let Transfer = require('../src'); 

let mockData = [];
let len = Math.random() * 10 + 10;
for (let i = 0; i < len; i++) {
    mockData.push({
        name: '内容' + (i + 1), // 显示的文字
        value: (i + 1), // 对应的 value
        description: '内容' + (i + 1) + '的描述', // 描述
        chosen: Math.random() * 2 > 1 // 是否是在已选中的
    });
}

class TransferDemo extends React.Component {
    constructor(props){
        super(props);
    }

    _handleChange(data) {
        console.log(data);
    }

    render() {
        var me = this;
        return (
            <Transfer data={mockData} onChange={me._handleChange.bind(me)}/>
        );
    }
}
```

## demo
http://uxcore.github.io/transfer/

## API

* selectItems(arr): 使对应 value 的变成高亮状态 (selected)。  
参数：
        * arr `Array` 一个由 value 组成的数组。

## Props

|参数|类型|必需|默认值|说明|
|---|----|---|----|---|
|data|array|required|-|用于初始化 transfer 的数据，格式见 Usage，四项可以为空，但不能没有|
|leftTitle|string|optional|'未选中的'|左侧标题|
|rightTitle|string|optional|'已选中的'|右侧标题|
|onChange|func|optional|noop|选中情况变化时触发，返回选中和未选中的项|
