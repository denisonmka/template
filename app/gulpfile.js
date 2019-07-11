/* Requiring necessary packages */
var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	browsersync = require('browser-sync').create(),
	changed = require('gulp-changed'),
	concat = require('gulp-concat'),
	cssnano = require('gulp-cssnano'),
	uglify = require('gulp-uglify-es').default,
	imagemin = require('gulp-imagemin');
	sass = require('gulp-sass'),
	clean = require('gulp-clean'),
	runSequence = require('run-sequence');

/* Setting base project constants */
const paths = {
	src: './src/',
	dest: '../dist/'
};

/* Setting an error swallower */
var swallowError = function(error) {
	console.log(error.toString())
	this.emit('end')
}

/*
* BASIC
*
* Those listed below are the basic tasks
* for compiling & distributing files
*/
gulp.task('clean', function () {
    return gulp.src([paths.dest],{read:false})
        .pipe(clean({force: true}));
});

gulp.task('html', function() {
	gulp.src([paths.src + '**/*.html'])
	.pipe(changed(paths.dest))
	.pipe(gulp.dest(paths.dest));
});


gulp.task('css', function() {
	gulp.src([paths.src + 'scss/**/[^_]*.?(s)css'])
	.pipe(changed(paths.dest))
	.pipe(sass({includePaths:['scss/**']}))
	.on('error', swallowError)
	.pipe(autoprefixer())
	.pipe(cssnano({zindex: false}))
	.pipe(concat('style.css'))
	.pipe(gulp.dest(paths.dest + 'css'));
});

gulp.task('js', function() {
	gulp.src([paths.src + 'js/**/*.js'])
	.pipe(changed(paths.dest + 'js'))
	.pipe(uglify())
	.pipe(concat('scripts.min.js'))
	.pipe(gulp.dest(paths.dest + 'js'));
});

gulp.task('img', function() {
	// Setting allowed images
	gulp.src([
		paths.src + 'img/*.jpg',
		paths.src + 'img/*.gif',
		paths.src + 'img/*.png'
		])
	.pipe(changed(paths.dest + 'img'))
	.pipe(imagemin([
			imagemin.jpegtran({progressive: true})
		]))
	.pipe(gulp.dest(paths.dest + 'img'));

	gulp.src([
		paths.src + '*.jpg',
		paths.src + '*.png',
		])
	.pipe(imagemin([
			imagemin.jpegtran({progressive: true})
		]))
	.pipe(gulp.dest(paths.dest));

});

gulp.task('svg', function() {
	// Setting allowed images
	gulp.src([
		paths.src + 'img/*.svg',
	])
		.pipe(changed(paths.dest + 'img'))
		.pipe(gulp.dest(paths.dest + 'img'));
});

gulp.task('libs', function() {
	/* 
	* Here comes all the third-party files
	* like Fontawesome, bulma...
	*/

	// CSS Libs
	gulp.src([
		'node_modules/normalize.css/normalize.css',
		])
	.pipe(changed(paths.dest + 'css'))
	.pipe(sass())
	.pipe(autoprefixer())
	.pipe(cssnano())
	.pipe(concat('libs.min.css'))
	.pipe(gulp.dest(paths.dest + 'css'));

	// JS Libs
	gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/chart.js/dist/Chart.bundle.min.js',
		'node_modules/vanilla-masker/build/vanilla-masker.min.js',
		])
	.pipe(changed(paths.dest + 'js/libs'))
	.pipe(concat('libs.min.js'))
	.pipe(gulp.dest(paths.dest + 'js/libs'));
});

gulp.task('watch', function() {
	var html = gulp.watch([paths.src + '**/*.html'], ['html']),
	css = gulp.watch([paths.src + 'scss/**/*.scss'], ['css']),
	js = gulp.watch([paths.src + 'js/**/*.js'], ['js']);

	browsersync.init([paths.dest], {
		//proxy: 'http://localhost:8888/', //for mac!
		proxy: 'http://localhost/',
		browser: 'chrome',
		port: 3042,
		notify: false
	});
});

/*
* SERVER
* This task compiles every file in
* the project, without starting
* browsersync for development
*/
gulp.task('server',function(callback){
	runSequence('clean',
		['html', 'css', 'js', 'img','svg', 'libs'],
              callback);
})

/*
* GLOBAL
*
* This task runs everything in basic
* task list, except "Deploy task"
*/

gulp.task('default',function(callback){
	runSequence('clean',
		['html', 'css', 'js', 'img','svg', 'libs'],
              'watch',
              callback);
})