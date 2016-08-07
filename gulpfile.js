"use strict";
var gulp = require('gulp');
var connect = require('gulp-connect');  //run a local dev
var open = require('gulp-open'); // open url web browser
var browserify = require('gulp-browserify'); // bundle the js
var reactify = require('reactify'); // tranforms react jsx to js
var rename = require('gulp-rename'); // rename the js to bundle
var source = require('vinyl-source-stream'); // use conventional text streams with gulp
var concat = require('gulp-concat'); // concatenates fiels
var eslint = require('gulp-eslint'); // lint js files with jsx
//configs
var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
        ],
        appJS: './src/app.js',
        dist: './dist'

    }
}

//start a dev server
gulp.task('connect', function () {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    })
});

gulp.task('open', ['connect'], function () {
    gulp.src('dist/index.html')
        .pipe(open({
            uri: config.devBaseUrl + ":" + config.port + '/'
        }))
});



// find the html and put it the dist and reload and connect
gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

// creage bundle of all js to bundle
gulp.task('js', function () {
    gulp.src(config.paths.appJS)
        .pipe(browserify({
            transform: ['reactify'],
            extensions: ['.js']
        }))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
})

// task for linting
gulp.task('lint', function () {
    return gulp.src(config.paths.js)
    // .pipe(eslint({
    //     config:'./eslint.json'
    // }))
    .pipe(eslint({
        useEslintrc:'true'
        }))

    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
})


gulp.task('css', function () {
    gulp.src(config.paths.css)
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(config.paths.dist + '/css'))
    .pipe(connect.reload());
})


gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js','lint']);
})

// run html and open GULP in command line
gulp.task('default', ['html', 'js','css', 'lint','open', 'watch']);
