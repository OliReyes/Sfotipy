var Backbone 	= require('backbone'),
	$		 	= require('jquery'),
	Handlebars  = require('handlebars');

module.exports = Backbone.View.extend({


	initialize:function(){

		"use strict";

		this.listenTo( this.model, "change", this.render, this );

	},

	events:{

		"click .PlaylistPrev-songLink":"setSongToPlayer"

	},

	tagName:"li",
	className:"PlaylistPrev-listItem",

	template:Handlebars.compile($('#song-template').html()),

	render:function(){

		"use strict";

		var resultHTML = this.template(this.model.toJSON());
		this.$el.html(resultHTML);

		return this;

	},

	setSongToPlayer:function(e){

		"use strict";

		Backbone.app.playerView.model.set(this.model.toJSON());

		return false;

	}

});