var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    minifycss    = require('gulp-clean-css'),
    rename       = require('gulp-rename'),
    browserSync  = require('browser-sync').create(),
    jade         = require('gulp-jade'),
    concat       = require('gulp-concat'),
    imagemin     = require("gulp-imagemin"),
    postcss      = require('gulp-postcss'),
    cssnext      = require('postcss-cssnext'),
    mqpacker     = require('css-mqpacker'),
    runSequence  = require('run-sequence');

var appDir = "./app";
var distDir = "./dist";

gulp.task('browser-sync', ['styles', 'jade', 'blocks', 'img'], function() {
  browserSync.init({
    server: {
      baseDir: appDir
    },
    notify: false
  });
});


gulp.task('styles', function () {
  var processors = [
      cssnext({ browsers: ['last 15 versions', '> 1%', 'ie 9'] }),
      mqpacker()
  ];
  return gulp.src(distDir + '/scss/**/*.scss')
    .pipe(sass({ style: 'expanded', sourceComments: 'map' }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(appDir + '/css'))
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(minifycss({ keepSpecialComments: 1 }))
    .pipe(gulp.dest(appDir + '/css'))
    .pipe(browserSync.stream({
      files: [appDir + '/css/**/*.css']
    }));
});

gulp.task('jade', function() {
  return gulp.src(distDir + '/pages/**/*.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(appDir))
    .pipe(browserSync.stream({
      files: [appDir + '/pages/**/*.html']
    }));
});

gulp.task('img', function () {
  return gulp.src(distDir + '/img/*')
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest(appDir + '/img'))
});

/*Vendors generator*/
gulp.task('scripts', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/jquery-ui/jquery-ui.min.js',
    'bower_components/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
    'bower_components/jquery-modal/jquery.modal.js',
    'bower_components/swiper/dist/js/swiper.jquery.js',
    'bower_components/select2/dist/js/select2.js',
  ])
  .pipe(concat('vendors.js'))
  .pipe(gulp.dest(appDir + '/libs'))
  .pipe(rename({suffix: '.min', prefix : ''}))
});

/*Blocks generator*/
gulp.task('blocks', function() {
  return runSequence(
    'blocks:html',
    'blocks:css',
    'blocks:js'
  );
});
gulp.task('blocks:js', function() {
  return gulp.src(distDir + '/blocks/**/*.js')
    .pipe(gulp.dest(appDir + '/blocks'))
});
gulp.task('blocks:html', function() {
  return gulp.src(distDir + '/blocks/**/*.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(appDir + '/blocks'))
    .pipe(browserSync.stream({
      files: [appDir + '/blocks/**/*.html']
    }));
});
gulp.task('blocks:css', function() {
  var processors = [
    cssnext({ browsers: ['last 15 versions', '> 1%', 'ie 9'] }),
    mqpacker()
  ];

  return gulp.src(distDir + '/blocks/**/*.scss')
    .pipe(sass({ style: 'expanded', sourceComments: 'map' }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(appDir + '/blocks'))
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(minifycss({ keepSpecialComments: 1 }))
    .pipe(gulp.dest(appDir + '/blocks'))
    .pipe(browserSync.stream({
      files: [appDir + '/blocks/**/*.css']
    }));
});

/*Watcher*/
gulp.task('watch', function () {
  gulp.watch(distDir + '/**/*.scss', ['styles', 'blocks']);
  gulp.watch(distDir + '/**/*.jade', ['jade', 'blocks']);
  gulp.watch(distDir + '/img/*', ['img']);
  gulp.watch(appDir + '/js/*.js').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
