
var addServerUriProperty = function(server) {
    server.uri = '/system/players/' + server.address;
};

var addDirectoryUriProperty = function(parentUrl, directory) {
    if (parentUrl[parentUrl.length - 1] !== '/') {
        parentUrl += '/';
    }
    if (directory.key[0] === '/') {
        parentUrl = '';
    }
    directory.uri = parentUrl + directory.key;
};

var uriResolvers = {
    directory: function directory(parentUrl, dir) {
        addDirectoryUriProperty(parentUrl, dir);
    },

    server: function server(parentUrl, srv) {
        addServerUriProperty(srv);
    }
};

var uri = {
    attach: function attach(parentUrl) {
        return function resolveAndAttachUris(result) {
            var children = result._children || [];

            children.forEach(function (child) {
                var childType = child._elementType.toLowerCase();
                var resolver = uriResolvers[childType];

                if (resolver) {
                    resolver(parentUrl, child);
                }
            });

            return result;
        };
    }
};



