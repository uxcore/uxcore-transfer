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
let Transfer = require("uxcore-transfer");
let mockData = [];
let len = Math.random() * 10 + 40;
for (let i = 0; i < len; i++) {
    mockData.push({
        name: '内容' + (i + 1),
        value: (i + 1),
        description: '内容' + (i + 1) + '的描述',
        chosen: Math.random() * 2 > 1,
        keywords: ['neirong' + (i + 1)] // used in search & location
    });
}

class TransferDemo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            disable: false
        }
    }

    _handleChange(data) {
        console.log(data);
    }

    handleClick() {
        this.refs.transfer.selectItems([2, 3]);
    }

    handleClick2() {
        this.setState({
            disable: !this.state.disable
        })
    }

    render() {
        var me = this;
        return (
            <div>
                <Transfer showSearch={true} disabled={me.state.disable} ref="transfer" data={mockData} onChange={me._handleChange.bind(me)}/>
                <Button onClick={me.handleClick.bind(me)}>手动更改被选中的项</Button>
                <Button onClick={me.handleClick2.bind(me)}>更改 mode</Button>
            </div>
        );
    }
}

```

## demo

见 http://uxcore.github.io/uxcore/components/transfer/

## API

* selectItems(arr): 使对应 value 的变成高亮状态 (selected)。    
参数：  
    * arr `Array` 一个由 value 组成的数组。
* reset(): 使 Transfer 回到与 data 对应的状态。

## Props

|参数|类型|必需|默认值|说明|
|---|----|---|----|---|
|height|number|optional|220|transfer高度|
|data|array|required|-|用于初始化 transfer 的数据，格式见 Usage，其中 name 和 value 字段必有|
|disabled|boolean|optional|false|是否启用 disable 模式|
|showSearch|boolean|optional|true|是否显示搜索条|
|searchPlaceholder|string|optional|定位输入内容||
|leftTitle|string|optional|'未选中的'|左侧标题|
|rightTitle|string|optional|'已选中的'|右侧标题|
|onChange|func|optional|noop|选中情况变化时触发，返回选中和未选中的项|
