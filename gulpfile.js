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
		del 					= require('del'),
		modernizr			= require('gulp-modernizr'),
		jshint				= require('gulp-jshint'),
		stylish 			= require('jshint-stylish'),
		browserSync 	= require('browser-sync'),
		reload 				= browserSync.reload;


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
// Reset scripts
// ========================
gulp.task('resetScripts', function(){
	return del([
		'dist/',
		'dev/js/temp/**',
		'dev/js/app.min.js'
	]);
});


// ========================
// Add Modernizr
// ========================
gulp.task('modernizr', ['resetScripts'], function() {
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
    .pipe(gulp.dest('dev/js/temp/'));
});

// ========================
// Concat scripts
// ========================
gulp.task('concatScripts', ['modernizr'], function() {
	return gulp.src([
			// add jquery as first libary
			'dev/libs/jquery.js',
			// add any other js libaries here

			// add all other JS files in the js directory. NB these will be added in alphabetical order, change, or add individually if source order needed.
			'dev/js/scripts/*.js',
			'dev/js/temp/*.js'
		])
		.pipe(maps.init())
		.pipe(concat('app.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dev/js/temp/'));
		// .pipe(reload({stream:true}));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
	return gulp.src([
			'dev/js/temp/app.js'
		])
		.pipe(uglify())
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest('dev/js'))
		.pipe(reload({stream:true}));
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
gulp.task('watchFiles', function() {
	gulp.watch(['dev/scss/**/*.scss', 'dev/js/scripts/*.js', 'dev/**/*.html'], ['html', 'compileSass', 'minifyScripts', 'lint']);
});


// ==============================
// Build task
// ==============================

// clear old dist folder
gulp.task('build-cleanfolder', function(cb){
	del([
		'dist/**'
	], cb);
});

// create dist directory
gulp.task('build-copy', ['build-cleanfolder'], function(){
	return gulp.src('dev/**/*')
	.pipe(gulp.dest('dist/'));
});

//remove unwanted files
gulp.task('build-removefiles', ['build-copy'], function(cb){
	del([
			'dist/scss/',
			'dist/css/!(*.min.css)',
			'dist/js/!(*.min.js)'
		], cb);
});

gulp.task('build', ['build-copy', 'build-removefiles']);

gulp.task('default', ['lint', 'compileSass', 'minifyScripts', 'browser-sync', 'watchFiles']);
