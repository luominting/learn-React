var app = app || {};
(function(){
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';

	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;

	var ENTRY_KEY = 13;

	var BackboneMixin = {
		componentDidMount: function(){
			this.getBackboneCollections().forEach(function (collection){
				collection.on('add remove change', this.forceUpdate.bind(this, null));
			},this);
		},
		componentWillUnmount: function(){
			this.getBackboneCollections().forEach(function (collection){
				collection.off(null, null, this);
			},this);
		}
	};

	var TodoApp = React.createClass({displayName: "TodoApp",
		mixins: [BackboneMixin],
		getBackboneCollections: function(){
			return [this.props.todos];
		},
		getInitialState: function(){
			return {editing: null};
		},
		componentDidMount: function(){
			var Router = Backbone.Router.extend({
				routes: {
					'':'all',
					'active': 'active',
					'completed': 'completed'
				},
				all: this.setState.bind(this, {nowShowing: app.ALL_TODOS}),
				active: this.setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				completed: this.setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
			});

			new Router();
			Backbone.history.start();
			// this.props.todos.fecth();
		},
		componentDidUpdate: function(){
			this.props.todos.forEach(function (todo){
				todo.save();
			});
		},
		handleNewTodoKeyDown: function(event){
			if(event.which !== ENTRY_KEY){
				return;
			}
			var val = React.findDOMNode(this.refs.newField).value.trim();
			if(val){
				this.props.todos.create({
					title: val,
					completed: false,
					order: this.props.todos.nextOrder()
				});
				React.findDOMNode(this.refs.newField).value = '';
			}

			event.pteventDefault();
		},
		toggleAll: function (event){
			var checked = event.target.checked;
			this.props.todos.forEach(function (todo){
				todo.set('completed', checked);
			});
		},
		edit: function(todo, callback){
			this.setState({editing: todo.get('id')}, callback);
		},
		save: function (todo, text) {
			todo.save({title: text});
			this.setState({editing: null});
		},
		cancel: function () {
			this.setState({editing: null});
		},
		clearCompleted: function () {
			this.props.todos.completed().forEach(function (todo) {
				todo.destroy();
			});
		},
		render: function(){
			var footer;
			var main;
			var todos = this.props.todos;

			var shownTodos = todos.filter(function (todo){
				switch (this.state.nowShowing){
					case app.ACTIVE_TODOS:
						return !todo.get('completed');
					case app.COMPLETED_TODOS:
						return todo.get('completed');
					default:
						return true;
				}
			}, this);

			var todoItems = shownTodos.map(function (todo){
				return (
					React.createElement(TodoItem, {
						key: todo.get('id'), 
						todo: todo, 
						onToggle: todo.toggle.bind(todo), 
						onDestroy: todo.destroy.bind(todo), 
						onEdit: this.edit.bind(this, todo), 
						editing: this.state.editing === todo.get('id'), 
						onSave: this.save.bind(this, todo), 
						onCancel: this.cancel})
				);
			},this);

			var activeTodoCount = todos.reduce(function (accum, todo){
				return todo.get('completed') ? accum : accum + 1;
			}, 0);

			var completedCount = todos.length - activeTodoCount;

			if(activeTodoCount || completedCount){
				footer = React.createElement(TodoFooter, {
					count: activeTodoCount, 
					completedCount: completedCount, 
					nowShowing: this.state.nowShowing, 
					onClearCompleted: this.clearCompleted});
			}

			if (todos.length) {
				main = (
					React.createElement("section", {className: "main"}, 
						React.createElement("input", {
							className: "toggle-all", 
							type: "checkbox", 
							onChange: this.toggleAll, 
							checked: activeTodoCount === 0}), 
						React.createElement("ul", {className: "todo-list"}, 
							todoItems
						)
					)
				);
			}

			return (
				React.createElement("div", null, 
					React.createElement("header", {className: "header"}, 
						React.createElement("input", {
							ref: "newField", 
							className: "new-todo", 
							onKeyDown: this.handleNewTodoKeyDown, 
							autoFocus: true}
						)
					), 
					main, 
					footer
				)
			);
		}
	});

	React.render(
		React.createElement(TodoApp, {todos: app.todos}),
		document.getElementsByClassName('todoapp')[0]
	);
})();