var mm = require('marky-mark');
var moment = require('moment')
var TAFFY = require('taffydb')
var fs = require('fs')

var exports = module.exports = {};

var capitaliseFirstLetter = function (s) {
    return s[0].toUpperCase() + s.slice(1);
}

exports.loadBlogPosts = function () {
    console.log("loadBlogPosts\n");
    var posts = mm.parseDirectorySync(__dirname + "/markdown/blog/")
    exports.blogPosts = TAFFY.taffy()
    posts.forEach(function (entry) {
        var formatedPost = {}
        formatedPost.title = entry.meta.title
        formatedPost.jsDate = moment(entry.meta.date)
        formatedPost.friendlyTime = capitaliseFirstLetter(moment(entry.meta.date).fromNow())
        formatedPost.content = entry.content
        exports.blogPosts.insert(formatedPost)
    });
}

exports.loadGamePosts = function () {
    console.log("loadGamePosts\n");
    var posts = mm.parseDirectorySync(__dirname + "/markdown/games/")
    exports.games = TAFFY.taffy()
    posts.forEach(function (entry) {
        var formatedPost = {}
        formatedPost.title = entry.meta.title
        formatedPost.startDate = moment(entry.meta.startDate)
        formatedPost.youtubeLink = entry.meta.youtubeId /*"http://www.youtube.com/embed/" 
                                    + entry.meta.youtubeId 
                                    + "?rel=0&vq=hd720&showinfo=0"*/
        formatedPost.content = entry.content
        exports.games.insert(formatedPost)
    });
}

exports.parseAllFiles = function () {
    exports.loadBlogPosts()
    exports.loadGamePosts()
}