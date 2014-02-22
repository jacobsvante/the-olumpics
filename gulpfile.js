'use strict';

var gulp = require('gulp'),
    sourcestream = require('vinyl-source-stream'),
    watchify = require('watchify'),
    gutil = require('gulp-util'),
    // coffee = require('gulp-coffee'),
    // coffeelint = require('gulp-coffeelint'),
    size = require('gulp-size'),
    w3cjs = require('gulp-w3cjs'),
    // concat = require('gulp-concat'),
    // browserify = require('gulp-browserify'),
    // gulpif = require('gulp-if'),
    livereload = require('gulp-livereload'),
    // NOTE: gulp-ruby-sass requires the gems in Gemfile to be installed
    // TODO: gulp-ruby-sass is much slower. Find a way to support
    //       bootstrap-sass with libsass. It gives this weird error:
    //       https://github.com/sindresorhus/grunt-sass/issues/33
    rubysass = require('gulp-ruby-sass'),
    // libsass = require('gulp-sass'),
    // compass = require('gulp-compass'),
    clean = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer'),
    // serve = require('gulp-serve'),
    tinylr = require('tiny-lr'),
    lrserver = tinylr(),
    serve = require('gulp-serve');

var SERVER_PORT = 8089,
    LIVERELOAD_PORT = 35729;

var bundler = watchify('./gui/app/scripts/index.coffee');

if (!gutil.env.debug) {
  bundler.transform('coffeeify').transform('browserify-shim').transform('brfs').transform('uglifyify');
} else {
  bundler.transform('coffeeify').transform('browserify-shim').transform('brfs');
}


// STYLES
gulp.task('styles', ['clean-styles'], function () {
  return gulp.src('./gui/app/styles/main.scss')
             // TODO: Source maps
             .pipe(rubysass({sourcemap: true,
                             compass: true}))
             // .pipe(libsass({errLogToConsole: true,
             //                sourceComments: 'map'}))
             // autoprefixer sets browser prefixes based on caniuse.com
             // statistics.
             // TODO: I suspect that running autoprefixer after the sourcemaps
             //       have been generated might make them a bit off. Look up.
             .pipe(autoprefixer('last 2 versions', 'Explorer > 8'))
             .pipe(livereload(lrserver))
             .pipe(size())
             .pipe(gulp.dest('gui/dist/styles'));
});


// SCRIPTS
gulp.task('scripts', ['clean-scripts'], function () {
  return bundler.bundle({debug: true})
    .pipe(sourcestream('app.js'))
    .pipe(livereload(lrserver))
    .pipe(gulp.dest('gui/dist/scripts'));
  // gulp.src('./gui/app/scripts/index.coffee', {'read': false})
  //     .pipe(coffeelint())
  //     .pipe(coffeelint.reporter())
  //     .pipe(size())
  //     .pipe(concat('app.js'))
  //     .pipe(livereload(lrserver))
  //     .pipe(gulp.dest('gui/dist/scripts'));
});


// HTML
gulp.task('html-validation', function () {
    gulp.src(['gui/app/*.html', 'gui/app/scripts/templates/*.html'])
        .pipe(w3cjs());
});
gulp.task('html', ['html-validation', 'clean-html'], function () {
  return gulp.src('gui/app/*.html')
        .pipe(livereload(lrserver))
        .pipe(size())
        .pipe(gulp.dest('dist'));
});


gulp.task('clean-html', function () {
  return gulp.src(['gui/dist/index.html'], {read: false}
         ).pipe(clean());
});


gulp.task('clean-scripts', function () {
  return gulp.src(['gui/dist/scripts'], {read: false}
         ).pipe(clean());
});


gulp.task('clean-styles', function () {
  return gulp.src(['gui/dist/styles'], {read: false}
         ).pipe(clean());
});



// CLEAN
gulp.task('clean', ['clean-html', 'clean-scripts', 'clean-styles']);


// BUILD
gulp.task('build', ['html', 'styles', 'scripts']); // , 'images'


// DEFAULT
gulp.task('default', ['watch']);


// WATCH
gulp.task('watch', ['build'], function () {
  lrserver.listen(LIVERELOAD_PORT, function (err) {
    if (err) {
      console.log(err);
    }
    gulp.watch('gui/app/*.html', ['html']);
    gulp.watch('gui/app/styles/*.*', ['styles']);
    gulp.watch('gui/app/scripts/*.*', ['scripts']);
    gulp.watch('gui/app/scripts/templates/*.html', ['scripts']);
  });
  gulp.start('serve');
});


gulp.task('serve', serve({
  root: 'dist',
  port: SERVER_PORT,
}));
