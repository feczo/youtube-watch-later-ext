  window.gapi = {};
  window.gapi.auth = {};
  window.gapi.client = {};

  gapi.client.request = function (args) {
    if (typeof args !== 'object')
      throw new Error('args required');
    if (typeof args.callback !== 'function')
      throw new Error('callback required');
    if (typeof args.path !== 'string')
      throw new Error('path required');

    if (args.root && args.root === 'string') {
      var path = args.root + args.path;
    } else {
      var path = 'https://www.googleapis.com' + args.path;
    }

    if (typeof args.params === 'object') {
      var deliminator = '?';
      for (var i in args.params) {
        path += deliminator + encodeURIComponent(i) + "="
          + encodeURIComponent(args.params[i]);
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

    xhr.onload = function() {
      var rawResponseObject = {
        // TODO: body, headers.
        gapiRequest: {
          data: {
            status: this.status,
            statusText: this.statusText
          }
        }
      };

      var rawResp = JSON.stringify(rawResponseObject);
      if (this.response) {
        var jsonResp = JSON.parse(this.response);
        args.callback(jsonResp, rawResp);
      } else {
        args.callback(null, rawResp);
      }
    };
  };
