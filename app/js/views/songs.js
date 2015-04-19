var Backbone 	= require('backbone'),
	$		 	= require('jquery'),
	Handlebars  = require('handlebars'),
	SongView 	= require('./song');

module.exports = Backbone.View.extend({

	initialize:function(){

		this.listenTo( this.collection, "add", this.addSong, this );
		this.listenTo( this.collection, "reset", this.clearList, this );

	},

	el:$('#PlaylistPrev-list'),

	render:function(newSongView){

		this.$el.append( newSongView );

	},

	addSong:function(song){

		'use strict';

		var newSongView = new SongView({ model:song });

		this.render( newSongView.render().el );

	},

	clearList:function(){

		this.$el.empty();

	}

});