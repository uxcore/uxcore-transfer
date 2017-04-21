const Button = require('uxcore-button');
const React = require('react');
const Transfer = require('../src');

const mockData = [];
const len = (Math.random() * 10) + 40;
for (let i = 0; i < len; i++) {
  mockData.push({
    name: `内容${i + 1}`,
    value: (i + 1),
    description: `内容${i + 1}的描述`,
    chosen: Math.random() * 2 > 1,
    keywords: [`neirong${i + 1}`], // used in search & location
  });
}

class TransferDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: false,
      data: mockData,
    };
  }

  handleChange(data) {
    console.log(data);
  }

  handleClick() {
    this.transfer.selectItems([2, 3]);
  }

  handleClick2() {
    this.setState({
      disable: !this.state.disable,
    });
  }
  handleClick3() {
    console.log('work');
    const mockData2 = [];
    const length = (Math.random() * 10) + 40;
    for (let i = 0; i < length; i++) {
      mockData2.push({
        name: `内容${i + 1}`,
        value: (i + 1),
        description: `内容${i + 1}的描述`,
        chosen: Math.random() * 2 > 1,
        keywords: [`neirong${i + 1}`], // used in search & location
      });
    }
    this.setState({
      data: mockData2,
    });
  }

  handleClick4() {
    this.transfer.reset();
  }

  render() {
    const me = this;
    return (
      <div>
        <Transfer
          showSearch
          disabled={me.state.disable}
          ref={(c) => { this.ref = c; }}
          data={this.state.data}
          onChange={me.handleChange.bind(me)}
        />
        <div style={{ marginTop: 20 }}>
          <Button onClick={me.handleClick.bind(me)}>手动更改被选中的项</Button>
          <Button onClick={me.handleClick2.bind(me)}>更改 mode</Button>
          <Button onClick={me.handleClick3.bind(me)}>更改 props</Button>
          <Button onClick={me.handleClick4.bind(me)}>重置</Button>
        </div>
      </div>
    );
  }
}

TransferDemo.displayName = 'TransferDemo';
TransferDemo.defaultProps = {};
TransferDemo.propTypes = {};

module.exports = TransferDemo;
