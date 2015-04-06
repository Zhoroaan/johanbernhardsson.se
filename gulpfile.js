var gulp = require('gulp');
var gjade = require('gulp-jade');
var gsass = require('gulp-sass')
var compass = require('node-libcompass');
var bourbon = require('node-bourbon');
var neat = require('node-neat');
var livereload = require('gulp-livereload');
var ghPages = require('gulp-gh-pages');
var gutil = require('gulp-util');

var postExtracter = require('./PostExtracter.js')

var environment = "development"

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
            games: games,
            env: environment
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

gulp.task('default', ['move-images', 'compile-jade', 'styles'], function () {
    livereload.listen();

    gulp.watch("public/images/**/*", ['move-images', 'styles'])

    gulp.watch(["views/**/*.jade", "markdown/**/*.*"], ['compile-jade'])

    gulp.watch("sass/**/*.scss", ['styles'])
})

gulp.task('deploy', ['set-production', 'move-images', 'compile-jade', 'styles'], function() {
    var githubOptions = {
        remoteUrl: "git@github.com:Zhoroaan/zhoroaan.github.io.git",
        branch: "master"
    }
    return gulp.src('./site/**/*').pipe(ghPages(githubOptions));
});