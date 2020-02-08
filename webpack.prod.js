const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// const TerserPlugin = require('terser-webpack-plugin');
// const ImageminPlugin = require('imagemin-webpack-plugin').default;
// const imageminMozjpeg = require('imagemin-mozjpeg');
// const CompressionPlugin = require('compression-webpack-plugin');

// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');


module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  // optimization: {
  //   minimizer: [
  //     new TerserPlugin({
  //       test: /\.js(\?.*)?$/i,
  //       parallel: true,
  //       sourceMap: true,
  //     })
  //   ]
  // },
  // plugins: [
  //   new CompressionPlugin({
  //     test: /\.(html|css|js)(\?.*)?$/i // only compressed html/css/js, skips compressing sourcemaps etc
  //   }),
  //   new ImageminPlugin({
  //     test: /\.(jpe?g|png|gif|svg)$/i,
  //     gifsicle: { // lossless gif compressor
  //       optimizationLevel: 9
  //     },
  //     pngquant: ({ // lossy png compressor, remove for default lossless
  //       quality: '75'
  //     }),
  //     plugins: [imageminMozjpeg({ // lossy jpg compressor, remove for default lossless
  //       quality: '75'
  //     })]
  //   }),
  //   new FaviconsWebpackPlugin({
  //   // Your source logo
  //     logo: './src/images/favicon.svg',
  //     // The prefix for all image files (might be a folder or a name)
  //     prefix: 'icons/',
  //     // Emit all stats of the generated icons
  //     emitStats: false,
  //     // Generate a cache file with control hashes and
  //     // don't rebuild the favicons until those hashes change
  //     persistentCache: true,
  //     // Inject the html into the html-webpack-plugin
  //     inject: true,
  //     // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
  //     background: '#fff',

  //     // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
  //     icons: {
  //       android: true,
  //       appleIcon: true,
  //       appleStartup: true,
  //       coast: false,
  //       favicons: true,
  //       firefox: true,
  //       opengraph: false,
  //       twitter: false,
  //       yandex: false,
  //       windows: false
  //     }
  //   })
  // ]
});