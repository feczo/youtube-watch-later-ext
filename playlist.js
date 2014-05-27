// Some variables to remember state.
var playlistId, channelId;

function authorize(params, callback) {
  gapi.auth.authorize(params, function(accessToken) {
    if (!accessToken) {
      var error = document.createElement("p");
      error.textContent = 'Unauthorized';
      document.querySelector("body").appendChild(error);
    } else {
      callback();
    }
  });
}

function gapiIsLoaded() {
  var params = { 'immediate': false };
//  if (!(chrome && chrome.app && chrome.app.runtime)) {
//    // This part of the sample assumes that the code is run as a web page, and
//    // not an actual Chrome application, which means it takes advantage of the
//    // GAPI lib loaded from https://apis.google.com/. The client used below
//    // should be working on http://localhost:8000 to avoid origin_mismatch error
//    // when making the authorize calls.
//    params.scope = "https://www.googleapis.com/auth/youtube";
//    params.client_id = "820911436798-dpbc64pf8qbnf1dvm1slu0ocma7g43nm.apps.googleusercontent.com",
//    gapi.auth.init(authorize.bind(null, params, addToPlaylist));
//  } else {
    authorize(params, addVideoToPlaylist);
    enableForm();
//  }
}

// Enable a form to create a playlist.
function enableForm() {
  $('#playlist-button').attr('disabled', false);
}

// Add a video id from a form to a playlist.
function addVideoToPlaylist() {
  addToPlaylist($('#video-id').val());
}

function catchresult(response) {
  $('#status').html('<pre>' + JSON.stringify(response.result) + '</pre>');
}

// Add a video to a playlist.
function addToPlaylist(id) {
  sendbody = {
   "snippet": {
    "playlistId": "WL",
    "resourceId": {
     "kind": "youtube#video",
     "videoId": id
    }
   }
  }
  gapi.client.request({
    'path': '/youtube/v3/playlistItems?part=snippet',
    'callback': catchresult,
    'method': 'POST',
    'body': sendbody
  });
}
