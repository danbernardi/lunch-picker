var gulp     = require('gulp'),
sourcemaps   = require('gulp-sourcemaps'),
browserSync  = require('browser-sync'),
sass         = require('gulp-sass'),
cleanCSS = require('gulp-clean-css'),
autoprefixer = require('gulp-autoprefixer'),
jade         = require('gulp-jade'),
cache        = require('gulp-cached'),
gWatch       = require('gulp-watch'),
browserify = require('browserify'),
babelify = require('babelify'),
source = require('vinyl-source-stream')
imagemin = require('gulp-imagemin')
uglify = require('gulp-uglify'),
streamify = require('gulp-streamify'),
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
lost = require('lost');

//build production
// - gulp-imagemin
// - Minify / concat js


gulp.task('default', ['build', 'watch'], function(){
  console.log('Watching files...');
});

/**
 * Build public folder
 */
gulp.task('build', ['sass', 'compile-jade', 'file:copy', 'browserify']);

/**
 * Serve our files
 */
gulp.task('serve', ['default'], function() {
  browserSync.init({
    open : false,
    ghostMode: false,
    server: {
      baseDir : './public', 
    }, 
    files: ['./public/**/*.*']
  });
});

/**
 * Compile SCSS files
 */
gulp.task('sass', function () {
  var stream = gulp.src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([lost(), autoprefixer({ browsers: ['last 2 versions', 'IE 9']})]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/css'));

    return stream;
});

/**
 * Compile jade files
 */
gulp.task('compile-jade', function() {
  var stream = gulp.src('./src/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./public/'));
  return stream;
});



/**
 * Watch files
 */
function watchFiles(path, callback){
 gWatch(path, function() {
   gulp.start(callback);
 });
};

gulp.task('watch', function(){
  watchFiles('./src/sass/**/*.scss', ['sass']);
  watchFiles('./src/**/*.jade', ['compile-jade']);
  watchFiles('./src/js/**/*.js', ['browserify']);
  watchFiles('./src/img/**/*.*', ['img:copy']);
  watchFiles('./src/assets/**/*.*', ['asset:copy']);
  watchFiles('./src/sass/vendor/**/*.*', ['vendorcss:copy']);
});

/**
 * Copy files
 */
gulp.task('file:copy', ['img:copy', 'asset:copy']);

gulp.task('img:copy', function(){
  var stream = gulp.src('./src/img/**/*.*')
    .pipe(cache('img'))
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('./public/img'));
  return stream;
});

gulp.task('asset:copy', function(){
  var stream = gulp.src('./src/assets/**/*.*')
    .pipe(cache('assets'))
    .pipe(gulp.dest('./public/assets'));
  return stream;
});

/**
 * Browserify / Babel transpile and combine files
 */
gulp.task('browserify', function () {
  return browserify({entries: './src/js/scripts.js', extensions: ['.js'], debug: true})
   .transform(babelify)
   .bundle()
   .pipe(source('scripts.js'))
   // .pipe(streamify(uglify()))
   .pipe(gulp.dest('./public/js/'));
});
