 var Backbone 	= require('backbone'),
 	$		 	= require('jquery'),
 	Handlebars  = require('handlebars');

module.exports = Backbone.View.extend({

	initialize:function(){

		'use strict';

		this.listenTo( this.model, 'change', this.render, this );

	},

	el:$('#SongPlaying-currentSongLargeInfoContainer'),

	template:Handlebars.compile($('#songPlaying-large-template').html()),

	render:function(){

		'use strict';

		var resultHTML = this.template(this.model.toJSON());

		this.$el.html(resultHTML);

	}

});