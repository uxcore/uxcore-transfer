import classnames from 'classnames';
import deepcopy from 'lodash/cloneDeep';
import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import isEqual from 'lodash/isEqual';

const preventDefaultClick = (e) => {
  e.preventDefault();
};

const changeChosenData = (arr1, arr2, isAsc) => {
  const newArr1 = arr1.filter(item => !item.selected);
  let newArr2 = arr1.filter(item => item.selected).map((item) => {
    const newItem = deepcopy(item);
    newItem.chosen = !newItem.chosen;
    newItem.selected = false;
    newItem.justMoved = true;
    return newItem;
  });
  newArr2 = isAsc ? arr2.concat(newArr2) : newArr2.concat(arr2);
  return {
    arr1: newArr1,
    arr2: newArr2,
  };
};

class Transfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosen: props.data.filter(item => !!item.chosen),
      unChosen: props.data.filter(item => !item.chosen),
      lastData: props.data,
    };
    this.refCbs = [];
    this.saveRef = this.saveRef.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.handleCheckLeftAll = this.handleCheckLeftAll.bind(this);
    this.handleCheckRightAll = this.handleCheckRightAll.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.data, prevState.lastData)) {
      return {
        chosen: nextProps.data.filter(item => !!item.chosen),
        unChosen: nextProps.data.filter(item => !item.chosen),
        lastData: nextProps.data,
      };
    }
    return null;
  }

  saveRef(name) {
    if (!this.refCbs[name]) {
      this.refCbs[name] = (c) => {
        this[name] = c;
      };
    }
    return this.refCbs[name];
  }

  selectItems(arr) {
    const me = this;
    const data = deepcopy(this.state);
    for (let i = 0; i < data.chosen.length; i++) {
      const item = data.chosen[i];
      if (arr.indexOf(item.value) !== -1) {
        item.selected = true;
      }
    }
    for (let i = 0; i < data.unChosen.length; i++) {
      const item = data.unChosen[i];
      if (arr.indexOf(item.value) !== -1) {
        item.selected = true;
      }
    }
    me.setState(data);
  }

  /**
   * 重置，取消所有的用户操作
   */
  reset() {
    const me = this;
    me.setState({
      chosen: me.props.data.filter(item => !!item.chosen),
      unChosen: me.props.data.filter(item => !item.chosen),
    });
  }

  locateItem(value, position) {
    const me = this;
    if (value === '') {
      return;
    }
    const data = deepcopy(me.state[position]);
    const leftBlockEl = me.leftBlock;
    const rightBlockEl = me.rightBlock;
    let index = -1;
    for (let i = 0; i < data.length; i++) {
      data[i].justMoved = false;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].name.indexOf(value) !== -1) {
        index = i;
        break;
      }
      if (data[i].keywords instanceof Array) {
        const keywords = data[i].keywords;
        for (let j = 0; j < keywords.length; j++) {
          if (keywords[j].indexOf(value) !== -1) {
            index = i;
            break;
          }
        }
        if (index !== -1) break;
      }
    }

    if (index === -1) {
      return;
    }
    data[index].justMoved = true;
    if (position === 'unChosen') {
      leftBlockEl.scrollTop = 32 * index;
    } else {
      rightBlockEl.scrollTop = 32 * index;
    }
    const obj = {};
    obj[position] = data;
    this.setState(obj);
  }

  handleSearchIconClick(position) {
    const { leftSearch, rightSearch } = this;
    const { value } = position === 'unChosen' ? leftSearch : rightSearch;
    this.locateItem(value, position);
  }

  handleSearch(position, e) {
    if (e.keyCode === 13) {
      this.handleSearchIconClick(position);
    }
  }

  handleItemClick(e) {
    const me = this;
    if (me.props.disabled) return;
    const target = e.currentTarget;
    const key = target.getAttribute('data-key');
    const isChosen = JSON.parse(target.getAttribute('data-chosen'));
    const newData = deepcopy(me.state[isChosen ? 'chosen' : 'unChosen']);
    if (newData[key].disabled) {
      return;
    }
    me.removeJustMoved(() => {
      newData[key].selected = !newData[key].selected;
      const newState = {};
      newState[isChosen ? 'chosen' : 'unChosen'] = newData;
      me.setState(newState);
    });
  }

  removeJustMoved(cb) {
    const me = this;
    const data = deepcopy(this.state);
    for (let i = 0; i < data.chosen.length; i++) {
      const item = data.chosen[i];
      item.justMoved = false;
    }
    for (let i = 0; i < data.unChosen.length; i++) {
      const item = data.unChosen[i];
      item.justMoved = false;
    }
    me.setState(data, () => {
      if (cb) { cb(); }
    });
  }

  handleButtonClick(e) {
    e.preventDefault();
    const me = this;
    if (me.props.disabled) return;
    const target = e.currentTarget;
    const direction = target.getAttribute('data-direction');
    if (target.className.indexOf('enable') === -1) return;
    const oldChosen = deepcopy(me.state.chosen);
    const oldUnChosen = deepcopy(me.state.unChosen);
    let newChosen = [];
    let newUnChosen = [];
    let newData = {};
    if (direction === 'left') {
      newData = changeChosenData(oldChosen, oldUnChosen, me.props.isAsc);
      newChosen = newData.arr1;
      newUnChosen = newData.arr2;
    } else {
      newData = changeChosenData(oldUnChosen, oldChosen, me.props.isAsc);
      newUnChosen = newData.arr1;
      newChosen = newData.arr2;
    }

    me.setState({
      chosen: newChosen,
      unChosen: newUnChosen,
    }, () => {
      me.props.onChange(me.state);
    });
  }

  handleCheckLeftAll(e) {
    e.preventDefault();
    const unChosen = deepcopy(this.state.unChosen);
    for (let i = 0; i < unChosen.length; i++) {
      const item = unChosen[i];
      if (!item.disabled) {
        item.selected = true;
      }
    }
    this.setState({
      unChosen,
    });
  }

  handleCheckRightAll(e) {
    e.preventDefault();
    const chosen = deepcopy(this.state.chosen);
    for (let i = 0; i < chosen.length; i++) {
      const item = chosen[i];
      if (!item.disabled) {
        item.selected = true;
      }
    }
    this.setState({
      chosen,
    });
  }

  renderItem(item, index) {
    const me = this;
    window.me = me;
    return (
      <li
        key={index}
        data-key={index}
        data-value={item.value}
        data-chosen={item.chosen}
        onClick={me.handleItemClick}
      >
        <a
          className={classnames({
            selected: !!item.selected,
            justMoved: !!item.justMoved,
            disabled: !!item.disabled,
          })}
          title={item.description || item.name}
          onClick={preventDefaultClick}
        >
          {item.name}

        </a>
      </li>
    );
  }

  renderUnchosen() {
    const me = this;
    const arr = me.state.unChosen.filter(item => !item.chosen).map(me.renderItem);
    return arr;
  }

  renderChosen() {
    const me = this;
    const arr = me.state.chosen.filter(item => item.chosen).map(me.renderItem);
    return arr;
  }

  renderSearch(position) {
    const me = this;
    if (!me.props.showSearch) return null;
    const map = {
      unChosen: 'leftSearch',
      chosen: 'rightSearch',
    };
    return (
      <div className="searchBar">
        <input
          type="text"
          ref={this.saveRef(map[position])}
          className="kuma-input"
          placeholder={me.props.searchPlaceholder}
          onKeyDown={me.handleSearch.bind(me, position)}
        />
        <i
          className="uxcore-icon uxicon-sousuo"
          onClick={me.handleSearchIconClick.bind(me, position)}
        />
      </div>
    );
  }

  render() {
    const me = this;
    const {
      height, showSearch, leftTitle, disabled, rightTitle, checkAllText, prefixCls,
    } = this.props;
    let style;
    if (height) {
      style = {
        height: `${height - 41 - (showSearch ? 34 : 0)}px`,
      };
    }
    return (
      <div
        className={classnames(prefixCls, {
          disabled,
        })}
      >
        <table className={`${prefixCls}-container`}>
          <thead className={`${prefixCls}-head`}>
            <tr>
              <th className="fn-clear left-head">
                <span className="title">
                  {leftTitle}
                </span>
                <a
                  className="check-all"
                  title={checkAllText}
                  onClick={this.handleCheckLeftAll}
                >
                  {checkAllText}
                </a>
              </th>
              <th />
              <th className="fn-clear right-head">
                <span className="title">
                  {rightTitle}
                </span>
                <a
                  className="check-all"
                  title={checkAllText}
                  onClick={this.handleCheckRightAll}
                >
                  {checkAllText}
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="left-block">
                {me.renderSearch('unChosen')}
                <ul
                  ref={this.saveRef('leftBlock')}
                  className={`${prefixCls}-block`}
                  style={style}
                >
                  {me.renderUnchosen()}
                </ul>
              </td>
              <td className={`${prefixCls}-buttons`}>
                <a
                  data-direction="left"
                  className={classnames({
                    enable: me.state.chosen.some(item => !!item.selected) && !disabled,
                  })}
                  onClick={me.handleButtonClick}
                />
                <br />
                <a
                  data-direction="right"
                  className={classnames({
                    enable: me.state.unChosen.some(item => !!item.selected) && !disabled,
                  })}
                  onClick={me.handleButtonClick}
                />
              </td>
              <td className="right-block">
                {me.renderSearch('chosen')}
                <ul
                  ref={this.saveRef('rightBlock')}
                  className={`${prefixCls}-block`}
                  style={style}
                >
                  {me.renderChosen()}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Transfer.displayName = 'Transfer';
Transfer.defaultProps = {
  height: 280,
  searchPlaceholder: '请输入搜索内容',
  data: [],
  leftTitle: '未选中',
  rightTitle: '已选中',
  checkAllText: '全选',
  disabled: false,
  showSearch: true,
  onChange() { },
  prefixCls: 'kuma-uxtransfer',
  isAsc: false,
};
Transfer.propTypes = {
  height: PropTypes.number,
  searchPlaceholder: PropTypes.string,
  data: PropTypes.array,
  disabled: PropTypes.bool,
  showSearch: PropTypes.bool,
  leftTitle: PropTypes.string,
  rightTitle: PropTypes.string,
  checkAllText: PropTypes.string,
  onChange: PropTypes.func,
  prefixCls: PropTypes.string,
  isAsc: PropTypes.bool,
};

polyfill(Transfer);

module.exports = Transfer;
