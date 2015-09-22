var app = app || {};

(function(){
	'use strict';

	app.todo = Backbone.Model.extend({
		defaults:{
			title:'',
			completed: false
		},
		toggle: function(){
			this.save({
				completed: !this.get('completed')
			});
		}
	});
})();