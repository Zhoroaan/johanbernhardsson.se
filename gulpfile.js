var gulp = require('gulp');
var gjade = require('gulp-jade');
var gsass = require('gulp-sass')
var compass = require('node-libcompass');
var bourbon = require('node-bourbon');
var neat = require('node-neat');
var ghPages = require('gulp-gh-pages');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver')
var youtubeThumnail = require('./gulp-youtube-thumbnail.js')

var postExtracter = require('./PostExtracter.js')

var environment = "development"


var taskFilePaths = {
    javascript: {
        src: ['javascript/**/*']
    },
    images: {
        src: ['images/**/*']
    },
    jade: {
        src: ["./views/index.jade"],
        watch: ["views/**/*.jade", "markdown/**/*.*"]
    },
    styles: {
        src: ["./sass/*.scss"],
        watch: ["sass/**/*.scss"]
    }
}

bourbon.with('sass')
neat.with('sass')
compass.with('sass')


gulp.task('set-production', function() {
    environment = "production"
    var fs = require('fs');
    fs.writeFile("site/CNAME", "johanbernhardsson.se", function(err) {
        if(err) {
            return gutil.log(err);
        }
        gutil.log("Wrote CNAME");
    }); 
})

gulp.task('javascript', function() {
    return gulp.src(taskFilePaths.javascript.src)
        .pipe(gulp.dest('site/js'))
})

gulp.task('images', function() {
    return gulp.src(taskFilePaths.images.src)
        .pipe(gulp.dest('site/images'))
})

gulp.task('jade', function () {
    postExtracter.loadGamePosts()
    var pageTitle = "Johan Bernhardsson - Game development"
    var games = postExtracter.games().order("startDate desc").get()
    var data = {
        data: {
            title: pageTitle,
            games: games,
            env: environment
        }
    }
    return gulp.src(taskFilePaths.jade.src)
    .pipe(gjade(data))
    .pipe(gulp.dest('site'))
})

gulp.task('styles', function() {
    var sassSettings = {
        style: 'expanded',
        debug: true,
        errLogToConsole: true,
        outputStyle: 'nested',
        includePaths: bourbon.includePaths.concat(neat.includePaths).concat(compass.includePaths)
    }
    return gulp.src(taskFilePaths.styles.src)
    .pipe(gsass(sassSettings))
    .pipe(gulp.dest('site/style'))
})

gulp.task('watch', ['javascript', 'images', 'thumnails', 'jade', 'styles'], function() {
    for (var task in taskFilePaths) {
        var dirsToWatch = taskFilePaths[task].src

        if(taskFilePaths[task].watch) {
            dirsToWatch = dirsToWatch.concat(taskFilePaths[task].watch)
        }
        gutil.log("[Add watch for " + task + "]", dirsToWatch);
        gulp.watch(dirsToWatch, [task])
    }
})

gulp.task('thumnails', function() {
    postExtracter.loadGamePosts()
    var games = postExtracter.games().order("startDate desc").get()
    var youtubeIds = []
    for(var game in games) {
        youtubeIds.push(games[game].youtubeLink)
    }
    return youtubeThumnail(youtubeIds)
        .pipe(gulp.dest('site/images/thumbs'))
})

gulp.task('connect', ['watch'], function () {
  return gulp.src('site')
      .pipe(webserver({
        root: 'site',
        livereload: true,
        open: true,
        port: 4343,
        host: "0.0.0.0"
      }))
})

gulp.task('default', ['connect'], function () {
})

gulp.task('deploy', ['set-production', 'javascript', 'images', 'jade', 'thumnails', 'styles'], function() {
    var githubOptions = {
        remoteUrl: "git@github.com:Zhoroaan/zhoroaan.github.io.git",
        branch: "master"
    }
    return gulp.src('./site/**/*').pipe(ghPages(githubOptions));
});