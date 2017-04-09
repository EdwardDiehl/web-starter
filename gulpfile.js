const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('lint-scss', () => {
  const stylelint = require('gulp-stylelint');

  return gulp.src('./src/scss/**/*.*css')
    .pipe(stylelint({
      failAfterError: false, // disable fail after error
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
});

gulp.task('scss', function () {
  return gulp.src('./src/scss/**/*.*css')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('watch', () => {
  gulp.watch('./src/scss/**/*.*css', ['lint-scss', 'scss']);
})