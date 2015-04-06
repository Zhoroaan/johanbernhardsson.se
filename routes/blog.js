var express = require('express')
var router = express.Router()
var postExtracter = require('../PostExtracter.js')
postExtracter.parseAllFiles()

var pageTitle = "Johan Bernhardsson - Game development"

exports.games = function (req, res) {
    console.log("Environment: " + exports.env);
    if (exports.env === "development") {
        postExtracter.loadGamePosts()
    }
    var games = postExtracter.games().order("startDate desc").get()
    res.render('games', { title: pageTitle, games: games, env: router.env})
}

exports.env = ""