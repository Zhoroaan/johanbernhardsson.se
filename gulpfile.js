var gulp = require('gulp');
var gjade = require('gulp-jade');
var gsass = require('gulp-sass')
var compass = require('node-libcompass');
var bourbon = require('node-bourbon');
var neat = require('node-neat');
var livereload = require('gulp-livereload');
var ghPages = require('gulp-gh-pages');

var postExtracter = require('./PostExtracter.js')

bourbon.with('sass')
neat.with('sass')
compass.with('sass')

gulp.task('move-images', function() {
    gulp.src(['public/images/**/*'])
        .pipe(gulp.dest('site/images'))
        .pipe(livereload())
})

gulp.task('compile-jade', function () {
    postExtracter.loadGamePosts()
    var pageTitle = "Johan Bernhardsson - Game development"
    var games = postExtracter.games().order("startDate desc").get()
    var data = {
        data: {
            title: pageTitle,
            games: games
        }
    }
    gulp.src('./views/index.jade')
    .pipe(gjade(data))
    .pipe(gulp.dest('site'))
    .pipe(livereload())
})

gulp.task('styles', function() {
    var sassSettings = {
        style: 'expanded',
        debug: true,
        errLogToConsole: true,
        outputStyle: 'nested',
        includePaths: bourbon.includePaths.concat(neat.includePaths).concat(compass.includePaths)
    }
    return gulp.src('sass/*.scss')
    .pipe(gsass(sassSettings))
    .pipe(gulp.dest('site/style'))
    .pipe(livereload())
})

gulp.task('default', function () {
    livereload.listen();
    gulp.run('move-images')
    gulp.run('compile-jade')
    gulp.run('styles')

    gulp.watch("public/images/**/*", function (event) {
        gulp.run('move-images');
        gulp.run('styles');
    })
    gulp.watch(["views/**/*.jade", "markdown/**/*.*"], function (event) {
        gulp.run('compile-jade');
    })

    gulp.watch("sass/**/*.scss", function (event) {
        gulp.run('styles');
    })
})

gulp.task('deploy', function() {
    gulp.run('move-images')
    gulp.run('compile-jade')
    gulp.run('styles')
    var githubOptions = {
        remoteUrl: "git@github.com:Zhoroaan/zhoroaan.github.io.git",
        branch: "master"
    }
    return gulp.src('./site/**/*').pipe(ghPages());
});