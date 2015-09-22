var app = app || {};
(function(){
	'use strict';

	app.TodoFooter = React.createClass({displayName: "TodoFooter",
		render: function(){
			var activeTodoWord = this.props.count === 1 ? 'item' : 'items';
			var clearButton = null;

			if(this.props.completedCount > 0){
				clearButton = (
					React.createElement("button", {
						className: "clear-completed", 
						onClick: this.props.onClearCompleted}, 
					"Clear completed"
					)
				);
			}

			var nowShowing = this.props.nowShowing;
			return (
				React.createElement("footer", {className: "footer"}, 
					React.createElement("span", {className: "todo-count"}, 
						React.createElement("strong", null,  this.props.count), 
						activeTodoWord, "left"
					), 
					React.createElement("ul", {className: "filters"}, 
						React.createElement("li", null, 
							React.createElement("a", {
								href: "#/", 
								className: className({selected: nowShowing === app.ALL_TODOS})}, 
								"All"
							)
						), 
						React.createElement("li", null, 
							React.createElement("a", {
								href: "#/active", 
								className: className({selected: nowShowing === app.ACTIVE_TODOS})}, 
								"Active"
							)
						), 
						React.createElement("li", null, 
							React.createElement("a", {
								href: "#/completed", 
								className: className({selected: nowShowing === app.COMPLETED_TODOS})}, 
								"Completed"
							)
						)
					), 
					clearButton
				)
			)
		}
	});
})();