import classnames from 'classnames';
import deepcopy from 'deepcopy';
import React from 'react';
import ReactDOM from 'react-dom';

class Transfer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            chosen: props.data.filter(function(item) {return !!item.chosen}),
            unChosen: props.data.filter(function(item) {return !item.chosen}),
            isAllSelected: {unChosen:false, chosen:false}
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
            unChosen: me.props.data.filter(function(item) {return !item.chosen}),
            isAllSelected: {unChosen:false, chosen:false}
        });
    }

    locateItem(value, position) {
        let me = this;
        if (value === "") {
            return; 
        }
        let data = deepcopy( me.state[position] );
        let leftBlock = me.refs.leftBlock;
        let leftBlockEl = ReactDOM.findDOMNode(leftBlock);
        let rightBlock = me.refs.rightBlock;
        let rightBlockEl = ReactDOM.findDOMNode(rightBlock);
        let index;
        for (let i = 0; i < data.length; i++) {
             data[i].justMoved = false;
        }
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
        data[index].justMoved = true;
        if (position == 'unChosen') {
            leftBlockEl.scrollTop = 30 * index;
        }
        else {
            rightBlock.scrollTop = 30 * index;
        }
        let obj ={};
        obj[position] = data;
        this.setState( obj );
    }

    filter(value, position){
        let me = this;
        let data = deepcopy( me.state[position] );

        data.forEach((item) => {
            item.display = true;

            if (item.name.indexOf(value) == -1) {
                item.display = false;

                if(item.selected){
                    if(item.selected == true){
                        item.selected = false;
                    }
                }
            }
        });

        let obj ={};
        obj[position] = data;
        this.setState( obj );

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
        me.props.filter ? me.filter(value, position) : me.locateItem(value, position);

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
            me.props.filter ? me.filter(value, position) : me.locateItem(value, position);
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
        let me = this;
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

        //移动过后把全选状态还原
        me.setState({
            chosen: newChosen,
            unChosen: newUnChosen,
            isAllSelected: {unChosen:false, chosen:false}
        }, function() {
            me.props.onChange(me.state);
        });

    }

    _handleCheckLeftAll(e) {
        e.preventDefault();
        let { unChosen } = this.state;
        let status = !this.state.isAllSelected['unChosen'];
        this.state.isAllSelected['unChosen'] = !this.state.isAllSelected['unChosen'];

        unChosen.forEach((d) => {
            //只有显示的数据才选中，不显示的不选中
            if (d.display) {
                d.selected = status;
                d.justMoved = false;
            }
        });
        this.setState({
            unChosen: unChosen 
        });
    }

    _handleCheckRightAll(e) {
        e.preventDefault();
        let { chosen } = this.state;
        let status = !this.state.isAllSelected['chosen'];
        this.state.isAllSelected['chosen'] = !this.state.isAllSelected['chosen'];

        chosen.forEach((d) => {
            //只有显示的数据才选中，不显示的不选中
            if (d.display) {
                d.selected = status;
                d.justMoved = false;
            }
        });
        this.setState({
            chosen: chosen 
        });
    }

    _renderItem(item, index) {
        let me = this;
        window.me = me;
        return <li key={index} data-key={index} data-value={item.value} data-chosen={item.chosen} onClick={me._handleItemClick.bind(me)}>
            <a className={classnames({
                "selected": !!item.selected,
                "justMoved": !!item.justMoved,
                "hide": !item.display
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
                    <input type="text" ref={map[position]} className="kuma-input" placeholder={me.props.filter ? '搜索过滤内容' : me.props.searchPlaceholder} onKeyDown={me._handleSearch.bind(me, position)}/>
                    <i className="kuma-icon kuma-icon-search" onClick={me._handleSearchIconClick.bind(me, position)}></i>
                </div>
    }

    render() {
        let me = this;
        let style;
        if (this.props.height) {
            style = {
                height: this.props.height - 38 - (this.props.showSearch ? 28: 0)
            };
        }
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
                                <a href="#" className="check-all" title={me.props.checkAllText} onClick={this._handleCheckLeftAll.bind(this)}>{me.props.checkAllText}</a>
                            </th>
                            <th></th>
                            <th className="fn-clear right-head">
                                <span className="title">{me.props.rightTitle}</span>
                                <a href="#" className="check-all" title={me.props.checkAllText} onClick={this._handleCheckRightAll.bind(this)}>{me.props.checkAllText}</a>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="left-block">
                                {me._renderSearch("unChosen")}
                                <ul ref="leftBlock" className={classnames({
                                    "kuma-uxtransfer-block": true
                                })} style={style}>
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
                                {me._renderSearch("chosen")}
                                <ul ref="rightBlock" className={classnames({
                                    "kuma-uxtransfer-block": true
                                })} style={style}>
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
    height: 220,
    searchPlaceholder: '定位输入内容',
    data: [],
    leftTitle: '未选中',
    rightTitle: '已选中',
    checkAllText: '全选',
    disabled: false,
    showSearch: true,
    filter:false,
    onChange: function() {}
};
Transfer.propTypes = {
    height: React.PropTypes.number,
    searchPlaceholder: React.PropTypes.string,
    data: React.PropTypes.array,
    disabled: React.PropTypes.bool,
    showSearch: React.PropTypes.bool,
    filter: React.PropTypes.bool,
    leftTitle: React.PropTypes.string,
    rightTitle: React.PropTypes.string,
    checkAllText: React.PropTypes.string,
    onChange: React.PropTypes.func
}

module.exports = Transfer;
