window.gapi = {};
window.gapi.auth = {};
window.gapi.client = {};


gapi.client.request = function (args, retry) {
    retry = typeof retry !== 'undefined' ? retry : true;
    if (typeof args !== 'object') throw new Error('args required');
    if (typeof args.callback !== 'function') throw new Error('callback required');
    if (typeof args.path !== 'string') throw new Error('path required');

    if (args.root && args.root === 'string') {
        var path = args.root + args.path;
    } else {
        var path = 'https://www.googleapis.com' + args.path;
    }

    if (typeof args.params === 'object') {
        var deliminator = '?';
        for (var i in args.params) {
            path += deliminator + encodeURIComponent(i) + "=" + encodeURIComponent(args.params[i]);
            deliminator = '&';
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open(args.method || 'GET', path);
    xhr.setRequestHeader('Authorization', 'Bearer ' + args.token);
    if (typeof args.body !== 'undefined') {
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(args.body));
    } else {
        xhr.send();
    }

    xhr.onerror = function () {
        // TODO, error handling.
        debugger;
    };

    xhr.onload = function () {
        if (this.status === 401 && retry) {
            chrome.identity.removeCachedAuthToken({
                'token': args.token
            }, gapi.client.request(args, false));
        }
        if (this.response) {
            var jsonResp = JSON.parse(this.response);
            args.callback(jsonResp, this.status);
        } else {
            args.callback(null, rawResp);
        }
    };
};
