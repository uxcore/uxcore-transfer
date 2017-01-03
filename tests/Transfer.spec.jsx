import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
// http://sinonjs.org/docs/
import Transfer from '../src';


const mockData1 = [];
const mockData2 = [];
const mockData3 = [];
const len = 10;
for (let i = 0; i < len; i += 1) {
  mockData1.push({
    name: `内容${i + 1}`,
    value: (i + 1),
    keywords: ['内容7', '内容8'],
    description: `内容${i + 1}的描述`,
    chosen: Math.random() * 2 > 1,
  });

  mockData2.push({
    name: `内容2${i + 1}`,
    value: (i + 1),
    description: `内容${i + 1}的描述`,
    chosen: Math.random() * 2 > 1,
  });
}


mockData3.push({
  name: '内容1',
  value: 1,
  description: '内容1的描述',
  selected: true,
}, {
  name: '内容2',
  value: 2,
  description: '内容3的描述',
  selected: true,
}, {
  name: '内容3',
  value: 3,
  description: '内容3的描述',
  selected: true,
  chosen: true,
});


describe('Transfer', () => {
  let instance;

  it('componentDidMount', () => {
    const spy = sinon.spy(Transfer.prototype, 'componentDidMount');
    instance = mount(<Transfer />);
    expect(Transfer.prototype.componentDidMount.calledOnce).to.equal(true);
    spy.restore();
  });

// https://github.com/airbnb/enzyme/blob/4d1517ab01c01011d7e7d1b4e9ae4201cd23268d/docs/api/ShallowWrapper/setProps.md
  it('componentWillReceiveProps', () => {
    const spy = sinon.spy(Transfer.prototype, 'componentWillReceiveProps');
    instance = mount(<Transfer data={mockData1} />);
    expect(spy.calledOnce).to.equal(false);
    instance.setProps({ data: mockData2 });
    expect(spy.calledOnce).to.equal(true);
    spy.restore();
  });


  it('showSearch props', () => {
    instance = mount(<Transfer showSearch data={mockData3} />);
    expect(instance.find('.searchBar').length).to.equal(2);
    instance.unmount();
    instance = mount(<Transfer showSearch={false} data={mockData3} />);
    expect(instance.find('.searchBar').length).to.equal(0);
  });

  it('searchPlaceholder props', () => {
    instance = mount(<Transfer searchPlaceholder="test" data={mockData3} />);
    expect(instance.props().searchPlaceholder).to.equal('test');
    expect(instance.find('.kuma-input[placeholder="test"]').length).to.equal(2);
  });


  it('selectItems method', () => {
    const spy = sinon.spy(Transfer.prototype, 'selectItems');
    instance = mount(<Transfer data={mockData3} />);
    const args = [2, 3];
    Transfer.prototype.selectItems.withArgs(args);
    instance.component.getInstance().selectItems(args);
    expect(Transfer.prototype.selectItems.withArgs(args).calledOnce).to.equal(true);
    spy.restore();
  });

  it('reset method', () => {
    const spy = sinon.spy(Transfer.prototype, 'reset');
    instance = mount(<Transfer data={mockData1} />);
    instance.component.getInstance().reset();
    expect(Transfer.prototype.reset.calledOnce).to.equal(true);
    spy.restore();
  });

  it('_handleItemClick method', () => {
    const spy = sinon.spy(Transfer.prototype, '_handleItemClick');
    instance = mount(<Transfer data={mockData1} disabled={false} />);
    instance.find('.kuma-uxtransfer-block li a').forEach((node) => {
      node.simulate('click');
    });
    expect(Transfer.prototype._handleItemClick.called).to.equal(true);
    expect(Transfer.prototype._handleItemClick.callCount).to.equal(instance.find('.kuma-uxtransfer-block li a').length);
    spy.restore();
  });

  it('left click event', () => {
    const spy = sinon.spy(Transfer.prototype, '_handleButtonClick');
    instance = mount(<Transfer data={mockData3} disabled={false} />);
    instance.find('.left-block .kuma-input').node.value = '5';
    instance.find('[data-direction="left"]').simulate('click');
    expect(Transfer.prototype._handleButtonClick.calledOnce).to.equal(true);
    spy.restore();
  });

  it('right click event', () => {
    const spy = sinon.spy(Transfer.prototype, '_handleButtonClick');
    // spy.withArgs('chosen');
    instance = mount(<Transfer data={mockData3} disabled={false} />);
    instance.find('.right-block .kuma-input').node.value = '6';
    instance.find('[data-direction="right"]').simulate('click', 'chosen');
    expect(Transfer.prototype._handleButtonClick.calledOnce).to.equal(true);
    spy.restore();
  });

  it('unChosen _handleSearchIconClick method', () => {
    const spy = sinon.spy(Transfer.prototype, '_handleSearchIconClick');
    instance = mount(<Transfer data={mockData1} />);
    instance.find('.left-block .kuma-input').node.value = '7';
    instance.find('.left-block .kuma-icon-search').simulate('click', 'unChosen');
    expect(Transfer.prototype._handleSearchIconClick.calledOnce).to.equal(true);
    spy.restore();
  });

  it('chosen _handleSearchIconClick method', () => {
    const spy = sinon.spy(Transfer.prototype, '_handleSearchIconClick');
    instance = mount(<Transfer data={mockData1} />);
    instance.find('.right-block .kuma-input').node.value = '8';
    instance.find('.right-block .kuma-icon-search').simulate('click', 'chosen');
    expect(Transfer.prototype._handleSearchIconClick.calledOnce).to.equal(true);
    spy.restore();
  });


  it('left _handleSearch method', () => {
    const spy = sinon.spy(Transfer.prototype, '_handleSearch');
    instance = mount(<Transfer data={mockData1} />);
    instance.find('.left-block .kuma-input').simulate('keyDown', { keyCode: 13 });
    expect(Transfer.prototype._handleSearch.calledOnce).to.equal(true);
    spy.restore();
  });

  it('right _handleSearch method', () => {
    const spy = sinon.spy(Transfer.prototype, '_handleSearch');
    instance = mount(<Transfer data={mockData1} />);
    instance.find('.right-block .kuma-input').simulate('keyDown', { keyCode: 13 });
    expect(Transfer.prototype._handleSearch.calledOnce).to.equal(true);
    spy.restore();
  });


  it('left  check-all', () => {
    const spy = sinon.spy(Transfer.prototype, '_handleCheckLeftAll');
    instance = mount(<Transfer data={mockData1} />);
    instance.find('.left-head .check-all').simulate('click');
    expect(Transfer.prototype._handleCheckLeftAll.calledOnce).to.equal(true);
    spy.restore();
  });

  it('right  check-all', () => {
    const spy = sinon.spy(Transfer.prototype, '_handleCheckRightAll');
    instance = mount(<Transfer data={mockData1} />);
    instance.find('.right-head .check-all').simulate('click');
    expect(Transfer.prototype._handleCheckRightAll.calledOnce).to.equal(true);
    spy.restore();
  });
});
