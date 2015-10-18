var extend = function(origin, add) {
  	// Don't do anything if add isn't an object
  	if (!add || (typeof add !== 'object')) return origin;

  	var keys = Object.keys(add);
  	var i = keys.length;
  	while (i--) {
  	  origin[keys[i]] = add[keys[i]];
  	}
  	return origin;
};

var withoutNulls = function(obj) {
	return obj && Object.keys(obj).reduce(function(sum, curr) {
		if (typeof obj[curr] ==='string') {
			sum[curr] = obj[curr];
		}
		return sum;
	}, {});
};

var PLEX_SERVER_PORT = 32400;

function Plex(options) {
	var opts = options || {};
	var hostname = typeof options === 'string' ? options : options.hostname;

	this.hostname = hostname;
	this.port = opts.port || PLEX_SERVER_PORT;
	this.options = opts.options || {};
	this.options.identifier = this.options.identifier || Device.vendorIdentifier;
    this.options.product = this.options.product || Device.appIdentifier;
    this.options.version = this.options.version || Device.appVersion;
    this.options.device = this.options.device || Device.model;
    this.options.deviceName = this.options.deviceName || 'AppleTV';
    this.options.platform = this.options.platform || 'tvOS';
    this.options.platformVersion = this.options.platformVersion || Device.systemVersion;

    if (typeof this.hostname !== 'string') {
        var errorDoc = createAlert("Invalid Plex server hostname!", "You have specified an invalid plex server hostname.");
		navigationDocument.presentModal(errorDoc);
    }

    this.serverUrl = hostname + ':' + this.port;
}

Plex.prototype.headers = function(plexApi, extraHeaders) {
	var options;
	if (typeof(plexApi) !== 'object') {
		var errorDoc = createAlert("Error Loading Plex API", "");
		navigationDocument.presentModal(errorDoc);
		return
	}

	options = plexApi.options;
	extraHeaders = extraHeaders || {};
	return extend(extraHeaders, {
		'X-Plex-Client-Identifier': options.identifier,
       	'X-Plex-Product': options.product,
       	'X-Plex-Version': options.version,
       	'X-Plex-Device': options.device,
       	'X-Plex-Device-Name': options.deviceName,
       	'X-Plex-Platform': options.platform,
       	'X-Plex-Platform-Version': options.platformVersion,
       	'X-Plex-Provides': 'controller'
	});
}

Plex.prototype.getHostname = function getHostname() {
	return this.hostname;
};

Plex.prototype.getPort = function getPort() {
    return this.port;
};

Plex.prototype.getIdentifier = function getIdentifier() {
    return this.options.identifier;
};

Plex.prototype.query = function query(url) {
    if (url === undefined) {
        var errorDoc = createAlert('Requires url argument', "");
		navigationDocument.presentModal(errorDoc);
    }

    return this._request(url, 'GET', true).then(uri.attach(url));
};

Plex.prototype.postQuery = function query(url) {
    if (url === undefined) {
        var errorDoc = createAlert('Requires url argument', "");
        navigationDocument.presentModal(errorDoc);
    }

    return this._request(url, 'POST', true).then(uri.attach(url));
};

Plex.prototype.perform = function perform(url) {
    if (url === undefined) {
        var errorDoc = createAlert('Requires url argument', "");
        navigationDocument.presentModal(errorDoc);
    }

    return this._request(url, 'GET', false);
};

Plex.prototype.find = function find(relativeUrl, criterias) {
    if (relativeUrl === undefined) {
        var errorDoc = createAlert('Requires url argument', "");
        navigationDocument.presentModal(errorDoc);
    }

    return this.query(relativeUrl).then(function (result) {
        return filterChildrenByCriterias(result._children, criterias);
    });
};

var request = function(reqOpts, responseHandler) {
	var xhr = new XMLHttpRequest();
	xhr.open(reqOpts.method, reqOpts.url, true);

	for(var header in reqOpts.headers) {
		xhr.setRequestHeader(header, reqOpts.headers[header]);
	}

	xhr.onreadystatechange = state_change;

	function state_change() {
		if (xhr.readyState == 4) {
			//response loaded
			if (xhr.status == 200) {
				responseHandler(null, xhr, xhr.responseText)
			} else {
				responseHandler(xhr.statusText, xhr, xhr.responseText)
			}
		}
	}
	xhr.send();
}

Plex.prototype._request = function _request(relativeUrl, method, parseResponse) {
    var self = this;
    var deferred = Q.defer();
    var reqUrl = this._generateRelativeUrl(relativeUrl);
    var reqOpts = {
        url: reqUrl,
        method: method || 'GET',
        headers: this.headers(this, {
            'Accept': 'application/json'
        })
    };

    request(reqOpts, function onResponse(err, response, body) {
        var resolveValue;

        if (err) {
            return deferred.reject(err);
        }

        resolveValue = body;

        if (response.statusCode < 200 || response.statusCode > 299) {
            return deferred.reject(new Error('Plex Server didnt respond with a valid 2xx status code, response code: ' + response.status));
        }

        if (response.getResponseHeader('Content-type') === 'application/json') //{
            resolveValue = JSON.parse(body);
        //} else if (response.headers['content-type'].indexOf('xml') > -1) {
        //    resolveValue = xmlToJSON(body.toString('utf8'), { attrkey: 'attributes' });
        //}

        return deferred.resolve(resolveValue);
    });

    return deferred.promise;
};




Plex.prototype._generateRelativeUrl = function _generateRelativeUrl(relativeUrl) {
    return this._serverScheme() + this.serverUrl + relativeUrl;
};

Plex.prototype._serverScheme = function _serverScheme() {
    return this.port === 443 ? 'https://' : 'http://';
};

function filterChildrenByCriterias(children, criterias) {
    var context = {
        criterias: criterias || {}
    };

    return children.filter(criteriasMatchChild, context);
}

function criteriasMatchChild(child) {
    var criterias = this.criterias;

    return Object.keys(criterias).reduce(function matchCriteria(hasFoundMatch, currentRule) {
        var regexToMatch = new RegExp(criterias[currentRule]);
        return regexToMatch.test(child[currentRule]);
    }, true);
}


