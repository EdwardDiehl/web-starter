module.exports = {
  js: {
    src: [
      // jquery
      'node_modules/jquery/dist/jquery.min.js',
      // tether
      'node_modules/tether/dist/js/tether.min.js',
      // bootstrap
      'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ],
    build: 'build/js',
    output: 'vendor.bundle.js'
  },
  css: {
    src: [
      // tether
      'node_modules/tether/dist/css/tether.min.css',
      // bootstrap
      'node_modules/bootstrap/dist/css/bootstrap.min.css'
    ],
    build: 'build/css',
    output: 'vendor.bundle.css'
  }
}