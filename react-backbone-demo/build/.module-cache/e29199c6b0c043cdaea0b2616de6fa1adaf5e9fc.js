var app = app || {};

(function(){
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;

	app.TodoItem = React.createClass({displayName: "TodoItem",
		getInitialState: function(){
			return {editText: this.props.todo.get('title')};
		},
		handleSubmit: function(){
			var val = this.state.editText.trim();
			if(val){
				this.props.onSave(val);
				this.setState({editText: val});
			}else{
				this.props.onDestroy();
			}
			return false;
		},
		handleEdit: function(){
			this.props.onEdit(function(){
				var node = React.findDOMNode(this.refs.editField);
				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}.bind(this));
			this.setState({editText: this.props.todo.get('title')});
		},
		handleKeyDown: function(event){
			if (event.which === ESCAPE_KEY) {
				this.setState({editText: this.props.todo.get('title')});
				this.props.onCancel();
			}else if (event.which === ENTER_KEY){
				this.handleSubmit();
			}
		},
		handleChange: function(event){
			this.setState({editText:event.target.value});
		},
		render: function(){
			return (
				React.createElement("li", {className: className({
					completed:this.props.todo.get('completed'),
					editing: this.props.editing
				})}, 
					React.createElement("div", {className: "view"}, 
						React.createElement("input", {
							className: "toggle", 
							type: "checkbox", 
							checked: this.props.todo.get('completed'), 
							onChange: this.props.onToggle}
						), 
						React.createElement("label", {onDoubleClick: this.handleEdit}, 
							this.props.todo.get('title')
						), 
						React.createElement("button", {className: "destroy", onClick: this.props.onDestroy})
					), 
					React.createElement("input", {
						ref: "editField", 
						className: "edit", 
						value: this.state.editText, 
						onBlur: this.handleSubmit, 
						onChange: this.handleChange, 
						onKeyDown: this.handleKeyDown}
					)
				)
			);
		}
	});
})();