/*jslint node: true */
'use strict';

			var gulp 					= require('gulp'),
					concat 				= require('gulp-concat'),
					uglify				= require('gulp-uglify'),
					rename				= require('gulp-rename'),
					maps					= require('gulp-sourcemaps'),
					autoprefixer 	= require('gulp-autoprefixer'),
					sass 					= require('gulp-sass'),
					plumber				= require('gulp-plumber'),
					minifycss 		= require('gulp-minify-css'),
					del 					= require('del');

// ========================
// Reset scripts
// ========================
gulp.task('resetScripts', function(cb){
	del([
		'dev/js/app.js',
		'dev/js/app.js.map',
		'dev/js/app.min.js'
	], cb);
});

// ========================
// Concat scripts
// ========================
gulp.task('concatScripts', /*['resetScripts'],*/ function() {
	console.log('start concat');
	return gulp.src([
			// add jquery as first libary
			'dev/libs/jquery.js',
			// add any other js libaries here

			// add all other JS files in the js directory. NB these will be added in alphabetical order, change, or add individually if source order needed.
			'dev/js/*.js'
		])
		.pipe(maps.init())
		.pipe(concat('app.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dev/js/'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
	return gulp.src([
			'dev/js/app.js'
		])
		.pipe(uglify())
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest('dev/js'));
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
		.pipe(gulp.dest('dev/css/'))
		.pipe(rename('style.min.css'))
		.pipe(minifycss())
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dev/css/'));
});

gulp.task('default', ['minifyScripts', 'compileSass']);