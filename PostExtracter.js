var mm = require('marky-mark');
var moment = require('moment')
var taffy = require('taffydb')
var fs = require('fs')

var exports = module.exports = {};

var capitaliseFirstLetter = function (s) {
    return s[0].toUpperCase() + s.slice(1);
}

exports.loadGamePosts = function () {
    var posts = mm.parseDirectorySync(__dirname + "/markdown/games/")
    exports.games = taffy.taffy()
    posts.forEach(function (entry) {
        var formatedPost = {}
        formatedPost.title = entry.meta.title
        formatedPost.startDate = moment(entry.meta.startDate)
        if("youtubeId" in entry.meta) {
            formatedPost.youtubeLink = entry.meta.youtubeId /*"http://www.youtube.com/embed/" 
                                    + entry.meta.youtubeId 
                                    + "?rel=0&vq=hd720&showinfo=0"*/
        } else {
            formatedPost.imageLink = entry.meta.imageLink
        }
        formatedPost.content = entry.content
        exports.games.insert(formatedPost)
    });
}

exports.parseAllFiles = function () {
    exports.loadGamePosts()
}