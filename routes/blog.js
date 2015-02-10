var express = require('express')
var router = express.Router()
var postExtracter = require('../PostExtracter.js')
postExtracter.parseAllFiles()

var pageTitle = "Johan Bernhardsson - Game development"

exports.blog = function (req, res) {
    if (exports.env === "development") {
        postExtracter.loadBlogPosts()
    }
    var blogPosts = postExtracter.blogPosts().limit(3).order("jsDate desc").get()
    res.render('blog', { title: 'testCode', blogPosts: blogPosts, env: router.env, isBlogPage: true })
}

exports.games = function (req, res) {
    console.log("Environment: " + exports.env);
    if (exports.env === "development") {
        postExtracter.loadGamePosts()
    }
    var games = postExtracter.games().order("startDate desc").get()
    res.render('games', { title: pageTitle, games: games, env: router.env, isGamesPage: true })
}

exports.env = ""