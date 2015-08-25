import classnames from 'classnames';
var update = React.addons.update;
class Transfer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            chosen: props.data.filter(function(item) {return item.chosen}),
            unChosen: props.data.filter(function(item) {return !item.chosen})
        }
    }

    componentDidMount() {
        var me = this;
    }


    /**
     * 抽取 arr1 的一部分给 arr2，返回变换后的两个数组
     * @param {array} arr1
     * @param {array} arr2
     */

    _changeChosenData(arr1, arr2) {
        var newArr1 = arr1.filter(function(item) {
            return !item.selected
        });
        var newArr2 = arr2.concat(arr1.filter(function(item) {
            return item.selected;
        }).map(function(item, index) {
            item.chosen = !item.chosen;
            return item; 
        }));

        return {
            arr1: newArr1,
            arr2: newArr2
        }
    }

    _handleItemClick(e) {
        var me = this;
        var target = e.currentTarget;
        var key = target.getAttribute('data-key');
        var isChosen = JSON.parse(target.getAttribute('data-chosen'));
        var newData = update(me.state[isChosen ? 'chosen' : 'unChosen'], {});
        newData[key].selected = !newData[key].selected;
        var newState = {};
        newState[isChosen ? 'chosen' : 'unChosen'] = newData;
        me.setState(newState);
    }

    _handleButtonClick(e) {
        var me = this;
        var target = e.currentTarget;
        var direction = target.getAttribute('data-direction');
        if (target.className.indexOf('enable') == -1) return;
        var oldChosen = update(me.state['chosen'], {});
        var oldUnChosen = update(me.state['unChosen'], {});
        var newChosen = [];
        var newUnChosen = [];
        var newData = {}
        if (direction == 'left') {
            newData = me._changeChosenData(oldChosen, oldUnChosen);
            newChosen = newData.arr1;
            newUnChosen = newData.arr2;
        }
        else {
            newData = me._changeChosenData(oldUnChosen, oldChosen);
            newUnChosen = newData.arr1;
            newChosen = newData.arr2;
        }

        me.setState({
            chosen: newChosen,
            unChosen: newUnChosen
        }, function() {
            me.props.onChange(me.state.chosen);
        });

    }

    _renderItem(item, index) {
        var me = this;
        window.me = me;
        return <li key={index} data-key={index} data-value={item.value} data-chosen={item.chosen} onClick={me._handleItemClick.bind(me)}>
                    <a className={classnames({
                       "selected": !!item.selected 
                    })} href="javascript:;" title={item.description}>{item.name}</a>
               </li>
    }

    _renderUnchosen() {
        var me = this;
        var arr = me.state.unChosen.filter(function(item) {
            return !item.chosen
        }).map(me._renderItem.bind(me));
        return arr;
    }

    _renderChosen() {
        var me = this;
        var arr = me.state.chosen.filter(function(item) {
            return item.chosen;
        }).map(me._renderItem.bind(me));
        return arr;
    }

    render() {
        var me = this;
        return (
            <div className="uxTransfer">
                <table className="kuma-transfer-container">
                    <thead>
                        <tr>
                            <th>{me.props.leftTitle}</th>
                            <th>&nbsp;</th>
                            <th>{me.props.rightTitle}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul className="kuma-transfer-block">
                                    {me._renderUnchosen()}
                                </ul>
                            </td>
                            <td className="kuma-transfer-buttons">
                                <a href="javascript:;" data-direction="left" className={classnames({
                                    enable: me.state.chosen.some(function(item) {
                                        return !!item.selected
                                    })
                                })} onClick={me._handleButtonClick.bind(me)}></a>
                                <br/>
                                <a href="javascript:;" data-direction="right" className={classnames({
                                    enable: me.state.unChosen.some(function(item) {
                                        return !!item.selected
                                    })
                                })} onClick={me._handleButtonClick.bind(me)}></a>
                            </td>
                            <td>
                                <ul className="kuma-transfer-block">
                                    {me._renderChosen()}
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

Transfer.displayName = "Transfer";
Transfer.defaultProps = {
    data: [],
    leftTitle: '未选中的',
    rightTitle: '已选中的',
    onChange: function() {}
};
Transfer.propTypes = {
    data: React.PropTypes.array,
    leftTitle: React.PropTypes.string,
    rightTitle: React.PropTypes.string,
    onChange: React.PropTypes.func
}

module.exports = Transfer;