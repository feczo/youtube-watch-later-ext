// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function gapiIsLoaded() {
}

function catchresult(r) {
  response = r;
}

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
}

function genericOnClick(info, tab) {
   if (info.mediaType === "image") {
       url =  encodeURI(info.srcUrl); 
   }

   if (info.linkUrl) {
       url = info.linkUrl;
   }
   alert(url);
   chrome.identity.getAuthToken({'interactive': true}, function(token) {
       gapi.client.request({
         'path': '/youtube/v3/search',
         'params' : {
             'part': 'id',
             'maxResults': 1,
             'q': url
         },
         'callback': function(response) { addToPlaylist(response.items[0].id.videoId, token)},
         'method': 'GET',
         'token': token
       });
   });
}

// Create one test item for each context type.
var contexts = ["selection","link","image","video"]

chrome.contextMenus.create({
  "title": "Watch Later",
  "targetUrlPatterns": [ "http://youtu.be/*" , "*://*.youtube.com/watch?v=*"],
  "contexts": contexts,
  "onclick": genericOnClick
});


// Add a video to a playlist.
function addToPlaylist(id, token) {
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
    'body': sendbody,
    'token': token
  });
}
