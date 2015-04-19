var Backbone 	= require('backbone'),
	$		 	= require('jquery'),
	Handlebars  = require('handlebars');

module.exports = Backbone.View.extend({

	initialize:function(){

		this.listenTo( this.model, 'change', this.render, this );

	},

	events:{

		'click':'navigate'

	},

	tagName:'article',
	className:'TopHits-songItem',

	template:Handlebars.compile($('#album-template').html()),

	render:function(){

		'use strict';

		var resultHTML = this.template(this.model.toJSON());

		this.$el.html(resultHTML);

		return this;

	},

	navigate:function(){

		Backbone.app.navigate('album/' + this.model.toJSON()['album'], {trigger:true});

	}

});