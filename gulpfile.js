/*jslint node: true */
'use strict';

var gulp = require('gulp'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    maps = require('gulp-sourcemaps'),
    cssnano	= require('gulp-cssnano'),
		del = require('del'),
		modernizr	= require('gulp-modernizr'),
		jshint = require('gulp-jshint'),
		stylish = require('jshint-stylish'),
		browserSync = require('browser-sync'),
		reload = browserSync.reload;


// ========================
// Check changes to HTML
// ========================
gulp.task('html', function(){
	gulp.src('dev/**/*.html')
	.pipe(reload({stream:true}));
});


// ========================
// Lint scripts
// ========================
gulp.task('lint', function() {
	return gulp.src(['dev/js/scripts/*.js', '!dev/js/scripts/modernizr.js'])
		.pipe(jshint())
  	.pipe(jshint.reporter(stylish));
});



// ========================
// Add Modernizr
// ========================
gulp.task('modernizr', function() {
  return gulp.src(['dev/**/*.js', 'dev/**/*.scss', '!dev/libs/**/*'])
    .pipe(modernizr({
    	'cache' : true,
    	'options' : [
        'setClasses',
        'addTest',
        'html5shiv',
        'html5printshiv',
        'testProp',
        'fnBind'
	    ]
    }))
    .pipe(gulp.dest('dev/js/'));
});


// ==============================
// Compile Sass with Autoprefix
// ==============================
gulp.task('compileSass', function(){
	return gulp.src([
			'dev/scss/build.scss'
		])
		.pipe(plumber())
		.pipe(maps.init({loadMaps: true}))
		.pipe(sass()).on('error', sass.logError)
		.pipe(autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dev/css/'))
		.pipe(reload({stream:true}));
});


// ==============================
// Browser Sync
// ==============================
// browser sync for dev
gulp.task('browser-sync', ['compileSass', 'minifyScripts'], function(){
	browserSync({
		server: {
			baseDir: './dev/'
		},
		notify: false
	});
});


// ==============================
// Watch task
// ==============================
gulp.task('watchFiles', function(){
	gulp.watch(['dev/**/*', '!dev/js/modernizr.js'], ['html', 'compileSass', 'modernizr', 'lint']);
});


// ==============================
// Build task
// ==============================

// create dist directory
gulp.task('build-copy', ['build-cleanfolder'], function(){
  return gulp.src('dev/**/*')
  .pipe(gulp.dest('dist/'));
});

gulp.task('useref', ['build-copy'], function () {
  return gulp.src('dev/*.html')
      .pipe(useref())
      .pipe(gulpIf('*.js', uglify({'mangle':true})))
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'));
});

//remove unwanted files
gulp.task('build-removefiles', ['useref'], function(){
  return del([
      'dist/scss/',
      'dist/css/!(*.min.css)',
      'dist/js/!(*.min.js)'
    ]);
});


gulp.task('default', ['html', 'compileSass', 'modernizr', 'browser-sync', 'watchFiles']);
gulp.task('build', ['build-removefiles']);
