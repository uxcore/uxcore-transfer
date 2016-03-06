let classnames = require('classnames');
let deepcopy = require('deepcopy');
let React = require('react'); 
let ReactDOM = require('react-dom');

class Transfer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            chosen: props.data.filter(function(item) {return !!item.chosen}),
            unChosen: props.data.filter(function(item) {return !item.chosen})
        }
    }

    componentDidMount() {
        let me = this;
    }

    componentWillReceiveProps(nextProps) {
        let me = this;
        if (!me._isEqual(nextProps.data, me.props.data)) {
            me.setState({
                chosen: nextProps.data.filter(function(item) {return !!item.chosen}),
                unChosen: nextProps.data.filter(function(item) {return !item.chosen})
            })
        }
    }

    _isEqual(a, b) {
        return JSON.stringify(a) == JSON.stringify(b)
    }


    /**
     * 抽取 arr1 的一部分给 arr2，返回变换后的两个数组
     * @param {array} arr1
     * @param {array} arr2
     */

    selectItems(arr) {
        let me = this;
        let data = deepcopy(this.state);
        data.chosen.forEach((item, index) => {
            if (arr.indexOf(item.value) != -1) {
                item.selected = true;
            }
        });
        data.unChosen.forEach((item, index) => {
            if (arr.indexOf(item.value) != -1) {
                item.selected = true;
            }
        });
        me.setState(data);
    }

    /**
     * 重置，取消所有的用户操作
     */

    reset() {
        let me = this;
        me.setState({
            chosen: me.props.data.filter(function(item) {return !!item.chosen}),
            unChosen: me.props.data.filter(function(item) {return !item.chosen})
        });
    }

    locateItem(value, position) {
        let data = me.state[position];
        let leftBlock = me.refs.leftBlock;
        let leftBlockEl = ReactDOM.findDOMNode(leftBlock);
        let rightBlock = me.refs.rightBlock;
        let rightBlockEl = ReactDOM.findDOMNode(rightBlock);
        let index;
        for (let i = 0; i < data.length; i++) {
            if (data[i].name.indexOf(value) !== -1) {
                index = i;
                break;
            }
            if (data[i].keywords instanceof Array) {
                let keywords = data[i].keywords;
                for (let j = 0; j < keywords.length; j++) {
                    if (keywords[j].indexOf(value) !== -1) {
                        index = i;
                        break;
                    }
                }
                if (index != undefined) break;
            }
        }
        if (index != undefined) {
            if (position == 'unChosen') {
                leftBlockEl.scrollTop = 30 * index;
            }
            else {
                rightBlock.scrollTop = 30 * index;
            }
        }
    }

    _handleSearchIconClick(position) {
        let me = this;
        let leftSearch = me.refs.leftSearch;
        let rightSearch = me.refs.rightSearch;
        let value = '';
        if (position == "unChosen") {
            value = leftSearch.value;
        }
        else {
            value = rightSearch.value;
        }
        me.locateItem(value, position);

    }

    _handleSearch(position, e) {
        let me = this;
        let leftSearch = me.refs.leftSearch;
        let rightSearch = me.refs.rightSearch;
        let value = '';
        if (e.keyCode == 13) {
            if (position == "unChosen") {
                value = leftSearch.value;
            }
            else {
                value = rightSearch.value;
            }
            me.locateItem(value, position);
        }
    }

    _changeChosenData(arr1, arr2) {
        let newArr1 = arr1.filter(function(item) {
            return !item.selected
        });
        let newArr2 = arr1.filter(function(item) {
            return item.selected;
        }).map(function(item, index) {
            item.chosen = !item.chosen;
            item.selected = false;
            item.justMoved = true;
            return item;
        }).concat(arr2);

        return {
            arr1: newArr1,
            arr2: newArr2
        }
    }

    _handleItemClick(e) {
        let me = this;
        if (me.props.disabled) return;
        let target = e.currentTarget;
        me._removeJustMoved(function(target) {
            let key = target.getAttribute('data-key');
            let isChosen = JSON.parse(target.getAttribute('data-chosen'));
            let newData = deepcopy(me.state[isChosen ? 'chosen' : 'unChosen']);
            newData[key].selected = !newData[key].selected;
            let newState = {};
            newState[isChosen ? 'chosen' : 'unChosen'] = newData;
            me.setState(newState);
        }.bind(me, target));
    }

    _removeJustMoved(cb) {
        let data = deepcopy(this.state);
        data.chosen.forEach((item, index) => {
            item.justMoved = false;
        });
        data.unChosen.forEach((item, index) => {
            item.justMoved = false;
        });
        me.setState(data, () => {
            !!cb && cb(); 
        });
    }

    _handleButtonClick(e) {
        let me = this;
        if (me.props.disabled) return;
        let target = e.currentTarget;
        let direction = target.getAttribute('data-direction');
        if (target.className.indexOf('enable') == -1) return;
        let oldChosen = deepcopy(me.state['chosen']);
        let oldUnChosen = deepcopy(me.state['unChosen']);
        let newChosen = [];
        let newUnChosen = [];
        let newData = {}
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
            me.props.onChange(me.state);
        });

    }

    _renderItem(item, index) {
        let me = this;
        window.me = me;
        return <li key={index} data-key={index} data-value={item.value} data-chosen={item.chosen} onClick={me._handleItemClick.bind(me)}>
                    <a className={classnames({
                       "selected": !!item.selected,
                       "justMoved": !!item.justMoved
                    })} href="javascript:;" title={item.description}>{item.name}</a>
               </li>
    }

    _renderUnchosen() {
        let me = this;
        let arr = me.state.unChosen.filter(function(item) {
            return !item.chosen
        }).map(me._renderItem.bind(me));
        return arr;
    }

    _renderChosen() {
        let me = this;
        let arr = me.state.chosen.filter(function(item) {
            return item.chosen;
        }).map(me._renderItem.bind(me));
        return arr;
    }

    _renderSearch(position) {
        let me = this;
        if (!me.props.showSearch) return;
        let map  = {
            "unChosen": "leftSearch",
            "chosen": "rightSearch"
        }
        return  <div className="searchBar">
                    <input type="text" ref={map[position]} className="kuma-input" placeholder={me.props.searchPlaceholder} onKeyDown={me._handleSearch.bind(me, position)}/>
                    <i className="kuma-icon kuma-icon-search" onClick={me._handleSearchIconClick.bind(me, position)}></i>
                </div>
    }

    render() {
        let me = this;
        return (
            <div className={classnames({
                "uxTransfer": true,
                "disabled": me.props.disabled
            })}>
                <table className="kuma-uxtransfer-container">
                    <thead className="kuma-uxtransfer-head">
                        <tr>
                            <th className="fn-clear left-head">
                                <span className="title">{me.props.leftTitle}</span>
                                {me._renderSearch("unChosen")}
                            </th>
                            <th>&nbsp;</th>
                            <th className="fn-clear right-head">
                                <span className="title">{me.props.rightTitle}</span>
                                {me._renderSearch("chosen")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="left-block">
                                <ul ref="leftBlock" className={classnames({
                                    "kuma-uxtransfer-block": true
                                })}>
                                    {me._renderUnchosen()}
                                </ul>
                            </td>
                            <td className="kuma-uxtransfer-buttons">
                                <a href="javascript:;" data-direction="left" className={classnames({
                                    enable: me.state.chosen.some(function(item) {
                                        return !!item.selected
                                    }) && !me.props.disabled
                                })} onClick={me._handleButtonClick.bind(me)}></a>
                                <br/>
                                <a href="javascript:;" data-direction="right" className={classnames({
                                    enable: me.state.unChosen.some(function(item) {
                                        return !!item.selected
                                    }) && !me.props.disabled
                                })} onClick={me._handleButtonClick.bind(me)}></a>
                            </td>
                            <td className="right-block">
                                <ul ref="rightBlock" className={classnames({
                                    "kuma-uxtransfer-block": true
                                })}>
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
    searchPlaceholder: '定位输入内容',
    data: [],
    leftTitle: '未选中',
    rightTitle: '已选中',
    disabled: false,
    showSearch: true,
    onChange: function() {}
};
Transfer.propTypes = {
    searchPlaceholder: React.PropTypes.string,
    data: React.PropTypes.array,
    disabled: React.PropTypes.bool,
    showSearch: React.PropTypes.bool,
    leftTitle: React.PropTypes.string,
    rightTitle: React.PropTypes.string,
    onChange: React.PropTypes.func
}

module.exports = Transfer;
