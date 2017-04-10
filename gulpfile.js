const gulp = require('gulp'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  // imagemin = require('gulp-imagemin'),
  // rimraf = require('rimraf'),
  browserSync = require("browser-sync"),
  stylelint = require('gulp-stylelint'),
  reload = browserSync.reload;

const path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/main.js',
    style: 'src/style/main.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  lint: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss'
  },
  clean: './build'
};

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
  rimraf(path.clean);
});

gulp.task('html:build', () => {
  gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({ stream: true }));
});

gulp.task('js:build', () => {
  gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true }));
});

gulp.task('style:build', () => {
  gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['src/style/'],
      outputStyle: 'compressed',
      sourceMap: true,
      errLogToConsole: true
    }))
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
});

gulp.task('style:lint', () => {
  gulp.src(path.lint.style)
    .pipe(stylelint({
      failAfterError: false, // disable fail after error
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
});

gulp.task('lint', [
          // 'html:lint',
          // 'js:lint',
          'style:lint'
]);

gulp.task('build', [
          'html:build',
          'js:build',
          'style:build',
          'fonts:build',
          'image:build'
]);

gulp.task('watch', () => {
  watch([path.watch.html], () => {
    gulp.start('html:build');
  });
  watch([path.watch.style], () => {
    gulp.start('style:build');
  });
  watch([path.watch.js], () => {
    gulp.start('js:build');
  });
  watch([path.watch.img], () => {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], () => {
    gulp.start('fonts:build');
  });
});

gulp.task('default', ['lint', 'build', 'webserver', 'watch']);
