import Transfer from '../src'

var mockData = [];
var len = Math.random() * 10 + 10;
for (var i = 0; i < len; i++) {
    mockData.push({
        name: '内容' + (i + 1),
        value: (i + 1),
        description: '内容' + (i + 1) + '的描述',
        chosen: Math.random() * 2 > 1
    });
}

export default class TransferDemo extends React.Component {
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

TransferDemo.displayName = 'TransferDemo';
TransferDemo.defaultProps = {};
TransferDemo.propTypes = {};