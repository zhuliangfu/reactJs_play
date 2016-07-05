import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

var names = ['zhu','liang','fu'];
var arr = [
  <h2>Hello world!</h2>,
  <h2>React is awesome</h2>,
];

// 创建组件(component)React.createClass
// 组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM （virtual DOM）
var Demo1 = React.createClass({
	render: function(){
		return <div><h1>Hello, world!</h1></div>;
	}
});

// JSX 语法（语法糖）
// map方法
var Demo2 = React.createClass({
	render: function(){
		return <div>{
			names.map(function(name){
				return <h1>Helle,{name}</h1>
			})
		}</div>;
	}
});

// 自动展开所有成员
var Demo3 = React.createClass({
	render: function(){
		return <div>{arr}</div>
	}
});

// 组件类的 this.props 对象上获取属性
var Demo4 = React.createClass({
	render: function(){
		return <div className={this.props.className}>
			<h1>
				{this.props.id},
				{this.props.name}
			</h1>
		</div>
	}
});

// this.props.children 属性。它表示组件的所有子节点
var Demo5 = React.createClass({
	render: function(){
		return <ol>
			{
				React.Children.map(this.props.children, function(child){
					return <li>{child}</li>;
				})
			}
		</ol>
	}
});

// 组件类的PropTypes属性，就是用来验证组件实例的属性是否符合要求
var Demo6 = React.createClass({
	// TODO参数验证未报错，待研究
	// 属性参数验证
	propTypes: {
		title: React.PropTypes.string.isRequired,
	},
	// 默认属性参数
	getDefaultProps: function(){
		return {
			title : '测试title属性'
		}
	},
	render: function() {
		return <h1> {this.props.title} </h1>;
	}
});

// 获取真实的DOM节点
// 有时需要从组件获取真实 DOM 的节点，这时就要用到 ref 属性
var Demo7 = React.createClass({
	handleClick: function(){
		this.refs.myTxtIpt.focus();
		this.refs.myTxtIpt.value = "click";
	},
	render: function(){
		return <div>
			<input type="text" ref="myTxtIpt" />
			<input type="button" value="Focus" onClick={this.handleClick} />
		</div>
	}
});

// 组件免不了要与用户互动，React 的一大创新，就是将组件看成是一个状态机，一开始有一个初始状态，然后用户互动，导致状态变化，从而触发重新渲染 UI
// 由于 this.props 和 this.state 都用于描述组件的特性，可能会产生混淆。一个简单的区分方法是，this.props 表示那些一旦定义，就不再改变的特性，而 this.state 是会随着用户互动而产生变化的特性。
var Demo8 = React.createClass({
	getInitialState: function(){
		return {liked:false};
	},
	handleClick: function(){
		this.setState({liked:!this.state.liked});
	},
	render: function(){
		var text = this.state.liked ? 'like' : 'haven\'t liked';
		return (
			<p onClick={this.handleClick}>
				you {text} this. click to toggle.
			</p>
		);
	}
});

// 用户在表单填入的内容，属于用户跟组件的互动，所以不能用 this.props 读取
var Demo9 = React.createClass({
	getInitialState: function(){
		return {value: 'hello!'};
	},
	handleChange: function(event){
		this.setState({value: event.target.value});
	},
	render: function(){
		var value = this.state.value;
		return <div>
			<input type="text" value={value} onChange={this.handleChange} />
			<p>{value}</p>
		</div>
	}
});

// 组件的生命周期
// Mounting：已插入真实 DOM componentWillMount() componentDidMount()
// Updating：正在被重新渲染 componentWillUpdate、componentDidUpdate(object nextProps, object nextState)
// Unmounting：已移出真实 DOM componentWillUnmount()
var Demo10 = React.createClass({
	getInitialState: function(){
		return {
			opacity: 1
		};
	},
	componentDidMount: function(){
		this.timer = setInterval(function(){
			var opacity = this.state.opacity;
			opacity -= .05;
			if (opacity < 0.1) {
				opacity = 1;
			}
			this.setState({
				opacity: opacity
			});
		}.bind(this),100);
	},
	render:function(){
		return <div style={{opacity: this.state.opacity}}>
			hello {this.props.name}
		</div>
	}
});

// 组件的数据来源，通常是通过 Ajax 请求从服务器获取，可以使用 componentDidMount 方法设置 Ajax 请求，等到请求成功，再用 this.setState 方法重新渲染 UI
var Demo11 = React.createClass({
	getInitialState: function(){
		return {
			username: '',
			lastGistUrl: ''
		};
	},
	componentDidMount: function(){
		$.get(this.props.source, function(result){
			var lastGist = result[0];
			if(this.isMounted()){
				this.setState({
					username: lastGist.owner.login,
					lastGistUrl: lastGist.html_url
				});
			}
		}.bind(this));
	},
	render: function(){
		return <div>
			{this.state.username} is 
			<a href={this.state.lastGistUrl}>here</a>
		</div>;
	}
});


// ReactDOM.render()
var data = '123';
render(
	<div>
		<Demo1 />
		<hr/>
		<Demo2 name="testName" />
		<hr/>
		<Demo3 />
		<hr/>
		<Demo4 name="testName" id="testId" className="cor-blue" />
		<hr/>
		<Demo5>
			<span>hello</span>
			<span>world</span>
		</Demo5>
		<hr/>
		<Demo6 title={data} />
		<hr/>
		<Demo7 title={data} />
		<hr/>
		<Demo8 />
		<hr/>
		<Demo9 />
		<hr/>
		<Demo10 name="zhu" />
		<hr/>
		<Demo11 source="https://api.github.com/users/octocat/gists" />
		<hr/>
	</div>,document.getElementById('root'));