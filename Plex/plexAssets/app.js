App.onLaunch = function(options) {

	App.options = options;

	var jsFiles = [
		`${options.TVAppBaseURL}client/Presenter.js`,
		`${options.TVAppBaseURL}client/ResourceLoader.js`,
		`${options.TVAppBaseURL}client/q.js`,
		`${options.TVAppBaseURL}client/uri.js`,
		`${options.TVAppBaseURL}client/PlexAPI.js`,
		`${options.TVAppBaseURL}client/moment.js`
	];

	evaluateScripts(jsFiles, function(success) {
		if (success) {
			//Get a listing of local servers
			getServers();
		} else {
			var errorDoc = createAlert("Evaluate scripts error", "Error evaluating external JS files");
			navigationDocument.presentModal(errorDoc);
			console.log(this);
			console.log(typeof(window));
		}
	});
}

var getServers = function() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", App.options.TVAppBaseURL + "servers", true)
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			getSections(JSON.parse(xhr.responseText));
		}
	}
	xhr.send();
}

var getSections = function(servers) {
	if (servers.length == 0) {
		var noServersError = createAlert("No Plex Media Servers found localally");
	}

	App.client = new Plex({
				hostname: servers[0].address,
				port: servers[0].port,
			});
		
	App.client.find('/library/sections', {type: 'movie|show'}).then(function(sections) {
		//Render out library sections!
		rL = new ResourceLoader("http://" + App.client.hostname + ":" + App.client.port);
		rL.loadResource(`${App.options.TVAppBaseURL}Templates/SectionsTemplate.js`, function(resource) {
			var doc = Presenter.makeDocument(resource);
			doc.addEventListener("select", sectionSelect);
			Presenter.pushDocument(doc);
		}, sections);

	}, function(err) {
		console.log(err);
	});
}

var showVideoSection = function(sectionId) {
	App.client.find('/library/sections/' + sectionId + '/all').then(function(items) {
		rL = new ResourceLoader("http://" + App.client.hostname + ":" + App.client.port);
		rL.loadResource(`${App.options.TVAppBaseURL}Templates/SectionTemplate.js`, function(resource) {
			var doc = Presenter.makeDocument(resource);
			doc.addEventListener("select", itemSelect);
			Presenter.pushDocument(doc);
		}, items);
	}, function(err) {
		console.log(err);
	});
}

var showMovieItemDetail = function(itemId) {
	App.client.find('/library/metadata/' + itemId).then(function(data) {
		if (data.length != 1) {
			console.log("Unexepcted response from server, more than one episode for key!");
			return;
		}
		rL = new ResourceLoader("http://" + App.client.hostname + ":" + App.client.port);
		rL.loadResource(`${App.options.TVAppBaseURL}Templates/MovieTemplate.js`, function(resource) {
			var doc = Presenter.makeDocument(resource);
			doc.addEventListener("select", episodePlay);
			Presenter.pushDocument(doc);
		}, data[0]);
	}, function(err) {
		console.log(err);
	});
}

var showSeasons = function(showId, seriesTitle) {
	App.client.find('/library/metadata/' + showId + '/children').then(function(seasons) {
		rL = new ResourceLoader("http://" + App.client.hostname + ":" + App.client.port);
		rL.loadResource(`${App.options.TVAppBaseURL}Templates/SeasonsTemplate.js`, function(resource) {
			var doc = Presenter.makeDocument(resource);
			doc.addEventListener("select", seasonSelect);
			Presenter.pushDocument(doc);
		}, {"series": seriesTitle, "seasons":seasons});
	}, function(err) {
		console.log(err);
	});
}

var showSeasonList = function(seasonId, seriesTitle, seasonTitle) {
	App.client.find(seasonId).then(function(episodes) {
		rL = new ResourceLoader("http://" + App.client.hostname + ":" + App.client.port);
		rL.loadResource(`${App.options.TVAppBaseURL}Templates/SeasonTemplate.js`, function(resource) {
			var doc = Presenter.makeDocument(resource);
			doc.addEventListener("select", episodeSelect);
			Presenter.pushDocument(doc);
		}, {"series": seriesTitle, "season":seasonTitle, "episodes":episodes});
	}, function(err) {
		console.log(err);
	});
}

var showEpisode = function(episodeId) {
	App.client.find(episodeId).then(function(data) {
		if (data.length != 1) {
			console.log("Unexepcted response from server, more than one episode for key!");
			return;
		}
		rL = new ResourceLoader("http://" + App.client.hostname + ":" + App.client.port);
		rL.loadResource(`${App.options.TVAppBaseURL}Templates/EpisodeTemplate.js`, function(resource) {
			var doc = Presenter.makeDocument(resource);
			doc.addEventListener("select", episodePlay);
			Presenter.pushDocument(doc);
		}, data[0]);
	}, function(err) {
		console.log(err);
	});
}

var showOnDeck = function(sectionId) {
	App.client.find('/library/sections/' + sectionId + '/onDeck').then(function(onDeck) {
		App.client.find('/library/sections/' + sectionId + '/recentlyAdded').then(function(recentlyAdded) {
			App.client.find('/library/sections/' + sectionId + '/recentlyViewed').then(function(recentlyViewed) {
				App.client.find('/library/sections/' + sectionId + '/newest').then(function(recentlyAired) {
					var opts = {"ondeck": onDeck, 
								"recentlyAdded": recentlyAdded,
								"recentlyViewed": recentlyViewed,
								"recentlyAired": recentlyAired};
					rL = new ResourceLoader("http://" + App.client.hostname + ":" + App.client.port);
					rL.loadResource(`${App.options.TVAppBaseURL}Templates/OnDeckTemplate.js`, function(resource) {
						var doc = Presenter.makeDocument(resource);
						doc.addEventListener("select", episodeSelect);
						Presenter.pushDocument(doc);
					}, opts);
				}, function(err) {
					console.log(err);
				})
			}, function(err) {
				console.log(err);
			})
		}, function(err) {
			console.log(err);
		})
	}, function(err) {
		console.log(err)
	});
}

var sectionSelect = function(el) {
	showOnDeck(el.target.getAttribute("data-id"));
	//showVideoSection(el.target.getAttribute("data-id"));
}

var seasonSelect = function(el) {
	var id = el.target.getAttribute('data-id');
	var seasonTitle = el.target.getAttribute('data-season-title');
	var seriesTitle = el.target.getAttribute('data-series-title');
	showSeasonList(id, seriesTitle, seasonTitle);
}

var episodeSelect = function(el) {
	var id = el.target.getAttribute('data-id');
	showEpisode(id);
}

var episodePlay = function(el) {
	var videoURL = "http://" + App.client.hostname + ":" + App.client.port + el.target.getAttribute('data-video-url');
	var metadata = JSON.parse(atob(el.target.getAttribute('data-metadata')));

	var player = new Player();
	var playlist = new Playlist();
	var mediaItem = new MediaItem("video", videoURL);
	var thumbURL = "http://" + App.client.hostname + ":" + App.client.port + (metadata.hasOwnProperty('parentThumb')? metadata.parentThumb : metadata.thumb);
	mediaItem.artworkImageURL = thumbURL;
	mediaItem.description = metadata.summary
	mediaItem.title = metadata.title;
	mediaItem.subtitle = metadata.hasOwnProperty('grandparentTitle')? metadata.grandparentTitle : "";
	mediaItem.resumeTime = metadata.hasOwnProperty('viewOffset')? metadata.viewOffset/1000 : 0;
	player.playlist = playlist;
	player.playlist.push(mediaItem);
	
	var lastKnownTime = 0;

	player.addEventListener("stateDidChange", function(e){
		if (e.state !== "stopped") return;
		//if the playback reached with in 30s of end of media, update duration with end
		var currPos;
		if(lastKnownTime*1000 > (metadata.duration - 30000)) {
			currPos = metadata.duration;
		} else {
			currPos = lastKnownTime * 1000;
		}
		//ensure we have a whole number
		currPos = Math.round(currPos);
		App.client.perform("/:/timeline/?ratingKey="+metadata.ratingKey+"&duration="+metadata.duration+"&time="+currPos+"&state=stopped").then(function(){}, function(err){console.log(err);});
	});
	//Update PlexMS every 5 seconds as to our position
	player.addEventListener("timeDidChange", function(e){
		App.client.perform("/:/timeline/?ratingKey="+metadata.ratingKey+"&duration="+metadata.duration+"&time="+Math.round(e.time*1000)+"&state=stopped").then(function(){}, function(err){console.log(err);});
		lastKnownTime = e.time;
	}, {interval: 5});
	player.present();
}

var itemSelect = function(el) {
	var type = el.target.getAttribute('data-media-type');
	if (type == 'show') {
		var id = el.target.getAttribute('data-id');
		var title = el.target.getAttribute('data-title');
		showSeasons(id, title);
	} else {
		showMovieItemDetail(el.target.getAttribute('data-id'));	
	}
}


var createAlert = function(title, description) {
	var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
						 <document>
						 	<alertTemplate>
						 		<title>${title}</title>
						 		<description>${description}</description>
						 		<button>
						 			<text>OK</text>
						 		</button>
						 	</alertTemplate>
						 </document>`
	var parser = new DOMParser();
	var alertDoc = parser.parseFromString(alertString, "application/xml");
	return alertDoc;
};

String.prototype.escapeXML = function() {
	return this.replace(/&/g, '&amp;')
			   .replace(/</g, '&lt;')
			   .replace(/>/g, '&gt;')
			   .replace(/"/g, '&quot;')
			   .replace(/'/g, '&apos;')
};