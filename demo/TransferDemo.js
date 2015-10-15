let Transfer = require('../src');
let Button = require('uxcore-button'); 

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

TransferDemo.displayName = 'TransferDemo';
TransferDemo.defaultProps = {};
TransferDemo.propTypes = {};

module.exports = TransferDemo;