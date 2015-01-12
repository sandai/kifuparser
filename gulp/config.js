"use strict";

var fs = require('fs'),
    webpack = require('webpack');

var pkg = JSON.parse(fs.readFileSync('./package.json'));

var libraryName = 'kifuParser';

var version = pkg.version;

var banner = '/**\n' +
      ' * ' + libraryName + '.js v' + version + '\n' +
      ' *\n' +
      ' * Copyright (c) ' + new Date().getFullYear() + ' ' + pkg.author + '\n' +
      ' * Released under the MIT license\n' +
      ' */\n\n';

var dest = './build';

module.exports = {
  banner: banner,

  dest: dest,

  build: {
    browser: {
      src: './lib/main.js',
      webpack: {
        plugins: [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
          })],
        output: {
          library: libraryName,
          libraryTarget: 'var',
          filename: libraryName + '-' + version + '.min.js'
        }
      }
    },
    dev: {
      strip: {
        header: "\\n*?\\/\\* ---------- header ---------- \\*\\/[\\s\\S]*?\\/\\* ---------- header ---------- \\*\\/\\n*",
        exports: "\\n*?\\/\\* ---------- exports ---------- \\*\\/[\\s\\S]*?\\/\\* ---------- exports ---------- \\*\\/\\n*"
      },
      filename: libraryName + '-' + version + '.dev.js',
      src: [
        './lib/kifuParser.prefix',
        './lib/map/*.js',
        './lib/map.js',
        './lib/functionUtils.js',
        './lib/KifuBuilder.js',
        './lib/KifParser.js',
        './lib/Piece.js',
        './lib/PieceList.js',
        './lib/Board.js',
        './lib/Ki2Completion.js',
        './lib/Ki2Parser.js',
        './lib/CsaParser.js',
        './lib/main.js',
        './lib/kifuParser.exports',
        './lib/kifuParser.suffix'
      ]
    }
  },

  jshint: {
    src: './lib/**/*.js',
    test: './test/*.test.js',
    node: './test/node/*.spec.js'
  },

  karma: {
    src: './test/*.test.js',
    options: {
      configFile: 'karma.conf.js',
      action: 'watch'
    }
  },

  test: {
    browser: {
      src: './test/*.test.js',
      options: {
        configFile: 'karma.conf.js'
      }
    },
    node: {
      src: './test/node/*.spec.js'
    }
  }
};
