module.exports = {
  js: {
    src: [
      'src/js/main.js'
    ],
    build: 'build/js/',
    output: 'main.js',
    outputMin: 'main.min.js',
    watch: 'src/js/**/*.js',
    lint: 'src/js/**/*.js'
  },
  css: {
    src: [
      'src/css/main.scss'
    ],
    build: 'build/css/',
    output: 'main.css',
    outputMin: 'main.min.css',
    watch: 'src/css/**/*.*css',
    lint: 'src/css/**/*.*css'
  },
  html: {
    src: 'src/index.html',
    build: 'build/',
    output: 'index.html',
    watch: 'src/**/*.html',
    lint: 'src/**/*.html',
  },
  img: {
    src: 'src/img/**/*.*',
    build: 'build/img/',
    watch: 'src/img/**/*.*'
  },
  fonts: {
    src: 'src/fonts/**/*.*',
    build: 'build/fonts/',
    watch: 'src/fonts/**/*.*'
  }
}
