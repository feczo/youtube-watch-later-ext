var authtoken;

function searchAddLink(info, tab) {
    if (info.mediaType === "image") {
        url = encodeURI(info.srcUrl);
    }
    if (info.linkUrl) {
        url = info.linkUrl;
    }
    chrome.identity.getAuthToken({
        'interactive': true
    }, function (token) {
        authtoken = token;
        gapi.client.request({
            'path': '/youtube/v3/search',
            'params': {
                'part': 'id',
                'maxResults': 1,
                'q': url
            },
            'callback': function (json, status) {
                if (status == 200) {
                    addToPlaylist(json.items[0].id.videoId, token)
                }
            },
            'method': 'GET',
            'token': token
        });
    });
}

var contexts = ["selection", "link", "image", "video"];
var targets = ["http://youtu.be/*", "*://*.youtube.com/watch?v=*"];

chrome.contextMenus.create({
    "title": "Watch Later",
    "targetUrlPatterns": targets,
    "contexts": contexts,
    "onclick": searchAddLink
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
            'callback': function (result) {
            return result
        },
            'method': 'POST',
            'body': sendbody,
            'token': token
    });
}
