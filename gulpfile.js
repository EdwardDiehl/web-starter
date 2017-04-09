const gulp = require('gulp');

gulp.task('lint-css', () => {
  const stylelint = require('gulp-stylelint');

  return gulp.src('src/**/*.*css')
    .pipe(stylelint({
      failAfterError: false, // disable fail after error
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
});