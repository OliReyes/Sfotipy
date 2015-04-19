var Backbone 	= require('backbone'),
	$		 	= require('jquery'),
	Handlebars  = require('handlebars'),
	_			= require('underscore');

module.exports = Backbone.View.extend({

	initialize:function(){

		'use strict';

		var self = this;

		/*The property random, which will store if the random
		option is enable or disabled.*/
		this.random = false;

		this.listenTo( this.model, 'change', severalCallbacks, this );

		function severalCallbacks(){

			self.setIndexOfActualSong();
			self.render(); 
			self.confirmIfSongCanBePlayed();
			self.listenToSongEnd();
			self.progressBar();
			self.setCurrentTime();
			self.checkRandomState();

		}

	},

	events:{

		'click .SongPlaying-action.icon-next':'nextSong',
		'click .SongPlaying-action.icon-prev':'prevSong',
		'click .SongPlaying-action.icon-play':'playPauseSong',
		'click .SongPlaying-action.icon-vol':'toggleVolume',
		'click .SongPlaying-action.icon-random':'toggleRandom',
		'click .SongPlaying-image':'playPauseSong'

	},

	el:$('.SongPlaying.large'),

	template:Handlebars.compile($('#player-template').html()),

	render:function(){

		'use strict';

		var resultHTML = this.template(this.model.toJSON());

		this.$el.html(resultHTML);

	},

	confirmIfSongCanBePlayed:function(){

		'use strict';

		var self = this;

		$('#Audio').on( "canplay", function(){

			$('#PlayPause').addClass('icon-stop');

			self.setDuration();

		});

	},

	nextSong:function(){

		'use strict';

		var songsList = Backbone.app.songs.models;
		var lastSongOfCollection = _.last(Backbone.app.songs.models).toJSON();


		if( this.random === false ){

			if( _.isEqual( lastSongOfCollection, this.model.toJSON()) ){

				this.model.set( songsList[0].toJSON() );

			}

			else{		

					if( this.indexOfActualSong < (songsList.length - 1) ){

						this.model.set( songsList[++this.indexOfActualSong].toJSON() );

					}
				
				}

		}

		else if( this.random === true ){

			this.generateRandomSong();

			this.model.set( songsList[this.randomNumber].toJSON() );

		}

	},

	prevSong:function(){

		'use strict';

		var songsList = Backbone.app.songs.models;
		var audio = document.getElementById('Audio');

	
			if( this.indexOfActualSong > 0 ){

				this.model.set( songsList[--this.indexOfActualSong].toJSON() );

			}

			else if( this.indexOfActualSong === 0 ){

				audio.currentTime = 0;
				audio.play();

			}

	},

	playPauseSong:function(e){

		'use strict';

			var audio = document.getElementById('Audio');

			if( audio.paused === false ){

				audio.pause();

			}

			else{

				audio.play();

			}

			$('#PlayPause').toggleClass('icon-stop');

	},

	toggleVolume:function(){

		'use strict';

		var audio = document.getElementById('Audio');


			if( audio.volume === 1 ){

				audio.volume = 0;

			}

			else{

				audio.volume = 1;

			}

			$('#Volume').toggleClass('icon-mute');

	},

	toggleRandom:function(){

		'use strict';

		if( this.random === false ){

			this.random = true;

		}

		else{

			this.random = false;

		}

		$('#Random').toggleClass('u-opaque');

	},

	progressBar:function(){

		'use strict';

		var stateBar = document.getElementById('ProgressInfo-stateBar');
		var audio 	 = document.getElementById('Audio');


		$('#Audio').on('timeupdate', function showProgress(){

			stateBar.style.width = ((audio.currentTime) / (audio.duration)) * 100 + '%';

		});

	},

	setDuration:function(){

		'use strict';

		var audio = document.getElementById('Audio');

		this.timeRender( audio.duration, '#ProgressInfo-max' );

	},

	setCurrentTime:function(){

		var audio = document.getElementById('Audio');
		var self = this;

		$('#Audio').on('timeupdate', function showCurrentTime(){

			self.timeRender( audio.currentTime, '#ProgressInfo-min' );

		});

	},

	timeRender:function(timeData, renderElement){

		'use strict';

		 	var sec = Math.floor( timeData );    
		 	var min = Math.floor( sec / 60 );

			min = min >= 10 ? min : '0' + min;    
			sec = Math.floor( sec % 60 );
			sec = sec >= 10 ? sec : '0' + sec;

			$(renderElement).text(min + ":"+ sec);

	},

	generateRandomSong:function(){

		do{

			this.randomNumber = Math.floor(Math.random() * ( (Backbone.app.songs.models.length - 1) - 0 + 1) + 0); 

		}while( this.randomNumber === this.indexOfActualSong );

	},

	checkRandomState:function(){

		if( this.random === true ){

			$('#Random').addClass('u-opaque');

		}

	},

	listenToSongEnd:function(){

		'use strict';

		var songsList = Backbone.app.songs.models;
		var self = this;
		var lastSongOfCollection = _.last(Backbone.app.songs.models).toJSON();

		function playAnotherSong(){

			self.nextSong();

		}

		function changeIcon(){

			$('#PlayPause').removeClass('icon-stop');

		}

		if( this.random === false ){

			if( _.isEqual( lastSongOfCollection, this.model.toJSON()) ){

				$('#Audio').on( 'ended', changeIcon );

			}

			else{

				$('#Audio').on( 'ended', playAnotherSong );

			}

		}

		else{

			$('#Audio').on( 'ended', playAnotherSong );

		}

	},

	setIndexOfActualSong:function(){

		'use strict';

		var songsList = Backbone.app.songs.models;

		for( var i = 0; i < songsList.length; ++i ){

				if( _.isEqual( songsList[i].toJSON(), this.model.toJSON() ) ){

					/*Storing index of the actual song in songs collection.*/
					this.indexOfActualSong = i;

				}

			}

	}

});