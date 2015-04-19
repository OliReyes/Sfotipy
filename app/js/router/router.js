var Backbone 				= require('backbone'),
	$		 				= require('jquery'),
	Song            		= require('../models/song'),
	Songs           		= require('../collections/songs'),
	Albums          		= require('../collections/albums'),
	SongsView       		= require('../views/songs'),
	AlbumsView      		= require('../views/albums'),
	PlayerView      		= require('../views/player'),
	SongPlayingLargeView	= require('../views/songplaying_large');


module.exports = Backbone.Router.extend({

	routes:{

		'':'index',
		'album/:name':'album'

	},

	initialize:function(){

		//For demonstration purposes, disabling all links default behavior.
		$(function(){

			$(document).on('click', function(){ return false });

		});

		//Main Menu current link functionality.
		$('.MainMenu-link').on( 'click', function temporaryClicksControl(e){

			$(this).parent().parent().find('.MainMenu-link.current').removeClass('current'); 

			$(this).addClass('current');

		});


		/*Empty object to storage JSON data got from server.*/
		this.jsonData = {};

		/*Empty model in order to attach it the to the
		player view, otherwise the player view can't be
		instanced correctly. The class of a view mani-
		pulates a model or a collection. */
		this.emptySong = new Song();

		//Collections instances.
		this.albums = new Albums();
		this.songs = new Songs();

		//Views instances, initializing them with the correspondant collection or model.
		this.songsView = new SongsView( {collection: this.songs} );
		this.albumsView = new AlbumsView( {collection: this.albums} );
		this.playerView = new PlayerView( { model: this.emptySong } );
		this.songPlayingLarge = new SongPlayingLargeView({ model: this.playerView.model });

		//Listening to the event that notices when the list of songs have been loaded.
		//Then, the callback set the first song of the list to the player automatically.
		this.on('listLoaded', this.setDefaultSongToPlayer);

		//Starint Backbone's history.
		Backbone.history.start();

	},

	index:function(){

		this.getData();

		console.log("¡Raíz cargada!");

	},

	album:function(name){

		'use strict';

		var self = this;

		//If a person reaches an album writing the URL directly, not by clicking an album inside Sfotipy.
		if(Object.keys(this.jsonData).length === 0){

			this.getData().done(function callAddSongs(){

				self.addSongs(name);

			});

		}
		
		else{

			this.addSongs(name);

		}

		

	},

	getData:function(){

		'use strict';

		var self = this;

		return $.getJSON('data.json', function manipulateJSON(data){

			self.jsonData = data;

			self.addAlbums(data);

		});

	},

	addAlbums:function(json){

		'use strict';

		for(var key in json){

			if(json.hasOwnProperty(key)){

				this.albums.add([ { 

					album:key,
					author:json[key]['author'],
					cover:json[key]['cover']

				 } ]);

			}

		}		

	},

	addSongs:function(name){

		'use strict';

		var self = this;
		var albumName = this.jsonData[name];

		//Every time we change the album we have to clear the previous list.
		this.songs.reset();

		albumName['songs'].forEach(function(song,i,songs){

			self.songs.add([{

				name:song.name,
				author:albumName['author'],
				cover:albumName['cover'],
				src:song.src

			}]);	

		});

		this.trigger( 'listLoaded');	

	},

	setDefaultSongToPlayer:function(){

		'use strict';

		var firstSong = this.songs.models[0].toJSON();

		this.playerView.model.set({

				name:firstSong['name'],
				author:firstSong['author'],
				cover:firstSong['cover'],
				src:firstSong['src'] 

		});

	}

});