const gulp = require('gulp'),
  watch = require('gulp-watch'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  del = require('del'),
  concat = require('gulp-concat'),
  cssnano = require('gulp-cssnano'),
  gulpIf = require('gulp-if'),
  browserSync = require("browser-sync"),
  stylelint = require('gulp-stylelint'),
  notify = require("gulp-notify"),
  util = require("gulp-util"),
  userPaths = require('./gulpfile_modules/user-paths'),
  vendorPaths = require('./gulpfile_modules/vendor-paths'),
  cleanPaths = require('./gulpfile_modules/clean-paths'),
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
  const userPathsJsOutput = util.env.min ? userPaths.js.outputMin : userPaths.js.output;
  gulp.src(userPaths.js.src)
    .pipe(concat(userPathsJsOutput))
    .pipe(gulp.dest(userPaths.js.build))
    .pipe(notify('user js concatenated and converted to <%= file.relative %>'))
    .pipe(reload({ stream: true }));
});

gulp.task('css:build', () => {
  const userPathsCssOutput = util.env.min ? userPaths.css.outputMin : userPaths.css.output;
  gulp.src(userPaths.css.src)
    .pipe(sass({
      includePaths: ['src/css/'],
      errLogToConsole: true
    }))
    .pipe(concat(userPathsCssOutput))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
    .pipe(gulpIf(util.env.min, cssnano()))
    .pipe(gulp.dest(userPaths.css.build))
    .pipe(notify('user css concatenated and converted to <%= file.relative %>'))
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

gulp.task('images:build', () => {
  gulp.src(userPaths.images.src)
    .pipe(imagemin({ // compress
      progressive: true, // .jpg
      svgoPlugins: [{
        removeViewBox: false
      }], // .svg
      use: [pngquant()],
      interlaced: true, // .gif
      optimizationLevel: 3 // compression level from 0 to 7
    }))
    .pipe(gulp.dest(userPaths.images.build))
    .pipe(reload({ stream: true }));
});

gulp.task('fonts:build', () => {
  gulp.src(userPaths.fonts.src)
    .pipe(gulp.dest(userPaths.fonts.build))
});

// build vendor assets
gulp.task('vendorJs:build', () => {
  const vendorPathsJsOutput = util.env.min ? vendorPaths.js.outputMin : vendorPaths.js.output;
  gulp.src(vendorPaths.js.src)
    .pipe(concat(vendorPathsJsOutput))
    .pipe(gulp.dest(vendorPaths.js.build))
    .pipe(notify('vendor js concatenated and converted to <%= file.relative %>'))
    .pipe(reload({ stream: true }));
});

gulp.task('vendorCss:build', () => {
  const vendorPathsCssOutput = util.env.min ? vendorPaths.css.outputMin : vendorPaths.css.output;
  gulp.src(vendorPaths.css.src)
    .pipe(concat(vendorPathsCssOutput))
    .pipe(gulpIf(util.env.min, cssnano()))
    .pipe(gulp.dest(vendorPaths.css.build))
    .pipe(notify('vendor css concatenated and converted to <%= file.relative %>'))
    .pipe(reload({ stream: true }));
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
          'images:build'
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
  watch([userPaths.images.watch], () => {
    gulp.start('images:build');
  });
  watch([userPaths.fonts.watch], () => {
    gulp.start('fonts:build');
  });
});

gulp.task('default', ['lint', 'build', 'webserver', 'watch']);
