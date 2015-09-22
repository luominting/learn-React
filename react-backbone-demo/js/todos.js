var app = app || {};
(function(){
	'use strict';
	var Todos = Backbone.Collection.extend({
		model: app.Todo,
		localstorage: new Backbone.LocalStorage('todos-react-backbone'),
		completed: function(){
			return this.where({completed: true});	
		},
		remaining: function(){
			return this.where({completed: false});
		},
		nextOrder: function(){
			return this.length ? this.last().get('order') + 1 : 1; 
		},
		comparator: 'order'
	});

	app.todos = new Todos();
})();