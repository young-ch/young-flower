const webpack = require('webpack');
const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, './dist'),
  // outputDir: process.env.NODE_ENV === 'production' ? path.resolve(__dirname, './real') : path.resolve(__dirname, './dist'),
  // https://cli.vuejs.org/config/#productionsourcemap
  productionSourceMap: false,

  // https://cli.vuejs.org/config/#css-extract
  css: {
    extract: { ignoreOrder: true },
    loaderOptions: {
      sass: {
        additionalData: '@import \'~@/assets/scss/vuetify/variables\''
      },
      scss: {
        additionalData: '@import \'~@/assets/scss/vuetify/variables\';'
      }
    }
  },

  chainWebpack: (config) => {
    // Remove the following lines to add Vue Prefetch and Preload on index.html
    // https://cli.vuejs.org/guide/html-and-static-assets.html#disable-index-generation
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.plugin('provide').use(webpack.ProvidePlugin, [{
      'window.Quill': 'quill/dist/quill.js',
      'Quill': 'quill/dist/quill.js'
    }]);
  },


  devServer: {
    port: 9999
  },

  // https://cli.vuejs.org/config/#transpiledependencies
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
    'vuetify'
  ]
}
