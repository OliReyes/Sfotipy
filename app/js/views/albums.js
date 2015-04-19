var Backbone 		= require('backbone'),
	$		 		= require('jquery'),
	AlbumView       = require('./album');

module.exports = Backbone.View.extend({

	initialize:function(){

		this.listenTo( this.collection, 'add', this.addAlbum, this);

	},

	el:$('.TopHits'),

	render:function(newAlbum){

		this.$el.prepend( newAlbum );

	},

	addAlbum:function(album){

		'use strict';

		var newAlbum = new AlbumView({ model:album });

		this.render( newAlbum.render().el );

	}

});