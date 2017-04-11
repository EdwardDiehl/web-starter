const gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  del = require('del');
  concat = require('gulp-concat');
  browserSync = require("browser-sync"),
  stylelint = require('gulp-stylelint'),
  userPaths = require('./gulpfile_modules/user-paths');
  vendorPaths = require('./gulpfile_modules/vendor-paths');
  cleanPaths = require('./gulpfile_modules/clean-paths');
  reload = browserSync.reload;

const browserSyncConfig = {
  server: {
    baseDir: "./build"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: 'browsersync'
};

gulp.task('webserver', () => {
  browserSync(browserSyncConfig);
});

gulp.task('clean', () => {
  del(cleanPaths.clean);
});

gulp.task('html:build', () => {
  gulp.src(userPaths.html.src)
    .pipe(gulp.dest(userPaths.html.build))
    .pipe(reload({ stream: true }));
});

gulp.task('js:build', () => {
  gulp.src(userPaths.js.src)
    .pipe(gulp.dest(userPaths.js.build))
    .pipe(reload({ stream: true }));
});

gulp.task('css:build', () => {
  gulp.src(userPaths.css.src)
    .pipe(sass({
      includePaths: ['src/css/'],
      errLogToConsole: true
    }))
    .pipe(prefixer())
    .pipe(gulp.dest(userPaths.css.build))
    .pipe(reload({ stream: true }));
});

gulp.task('css:lint', () => {
  gulp.src(userPaths.css.lint)
    .pipe(stylelint({
      failAfterError: false, // disable fail after error
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
});

gulp.task('image:build', () => {
  gulp.src(userPaths.img.src)
    .pipe(imagemin({ // compress
      progressive: true, // .jpg
      svgoPlugins: [{
        removeViewBox: false
      }], // .svg
      use: [pngquant()],
      interlaced: true, // .gif
      optimizationLevel: 3 // compression level from 0 to 7
    }))
    .pipe(gulp.dest(userPaths.img.build))
    .pipe(reload({ stream: true }));
});

gulp.task('fonts:build', () => {
  gulp.src(userPaths.fonts.src)
    .pipe(gulp.dest(userPaths.fonts.build))
});

// build vendor assets
gulp.task('vendorJs:build', () => {
  gulp.src(vendorPaths.js.src)
    .pipe(concat(vendorPaths.js.output))
    .pipe(gulp.dest(vendorPaths.js.build));
});

gulp.task('vendorCss:build', () => {
  gulp.src(vendorPaths.css.src)
    .pipe(concat(vendorPaths.css.output))
    .pipe(gulp.dest(vendorPaths.css.build));
});

gulp.task('lint', [
          // 'html:lint',
          // 'js:lint',
          'css:lint'
]);

gulp.task('build', [
          'html:build',
          'js:build',
          'vendorJs:build',
          'css:build',
          'vendorCss:build',
          'fonts:build',
          'image:build'
]);

gulp.task('watch', () => {
  watch([userPaths.html.watch], () => {
    gulp.start('html:build');
  });
  watch([userPaths.css.watch], () => {
    gulp.start('css:build');
  });
  watch([userPaths.js.watch], () => {
    gulp.start('js:build');
  });
  watch([userPaths.img.watch], () => {
    gulp.start('image:build');
  });
  watch([userPaths.fonts.watch], () => {
    gulp.start('fonts:build');
  });
});

gulp.task('default', ['lint', 'build', 'webserver', 'watch']);
