/* eslint-env node */
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const hbsfy = require('hbsfy');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const less = require('gulp-less');

gulp.task('browserify', () => {
  // set up the browserify instance on a task basis
  let bundler = browserify({
    entries: 'app/scripts/app.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [babelify, hbsfy],
  });

  bundler = watchify(bundler);

  const rebundle = () => bundler
    .bundle()
    .on('error', $.util.log)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    // Add transformation tasks to the pipeline here.
    .on('error', $.util.log)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./app/bundled'));


  bundler.on('update', rebundle);

  return rebundle();
});

gulp.task('less', () => {
  gulp.src('./app/styles/index.less') // path to your file
    .pipe(less().on('error', (err) => {
      console.log(err);
    }))
    .pipe(gulp.dest('./app/bundled/'));
});

