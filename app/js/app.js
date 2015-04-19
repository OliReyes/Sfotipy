var Backbone 	= require('backbone'),
	$		 	= require('jquery'),
	Router   	= require('./router/router');
	Backbone.$	= $;

$(function(){
	Backbone.app = new Router();
});

