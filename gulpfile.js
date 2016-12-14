var webpackConfig = require('./webpack.config');
var webpack = require('webpack');
var babel = require('gulp-babel');
var gulp = require('gulp');
var jade = require('gulp-jade')
var exec = require('child_process').exec
var MODE = process.argv[3];
var path = require('path');

var __release = {
  _release_src:'./src/stage/*/*.jade',
  _release_out:[
    './bin/**',
    './package.json',
    './index.js',
    './dispatch.js',
    './lib/**',
    './dist/**',
    './etc/**'
  ],
  _release_dir:'./out/release',
  _release_dist:'./dist'
}

var _release_src = __release._release_src;
var _release_out = __release._release_out;
var _release_dir = __release._release_dir;
var _release_dist = __release._release_dist;
var __filemap = {}

//gulp --mode product

gulp.task('_release_out',['_release_src'], (cb) => {
  gulp.src(_release_out,{base:'./'})
    .pipe(gulp.dest(_release_dir))
    .on('end', () => {
      exec('NODE_ENV=production npm install',{cwd:_release_dir}, (err,stdout,stdin) => {
        if (err) {
          throw new Error('npm install',err);
        }
        cb();
      })
    })
})

gulp.task('_release_src',['webpack'], (cb) => {
  var pretty = MODE === 'product';
  gulp.src(_release_src,{base:'./src/stage'})
    .pipe(jade({
      locals: {__filemap},
      pretty: pretty
    }))
    .pipe(gulp.dest(_release_dist))
    .on('end',() => {
      cb()
    });
})

gulp.task('webpack',['_release_clean'], (cb) => {
  var config = webpackConfig(MODE);
  webpack(config, (err, stats) => {
    if(err){
      throw new Error('webpack',err);
    }

    __filemap = stats.toJson().assetsByChunkName;
    for (k in __filemap) {
      if ( '[object Array]'=== Object.prototype.toString.call(__filemap[k])) {
        __filemap[k] = __filemap[k][0]
      }
    }

    cb();
  });
});

gulp.task('_release_clean', (cb) => {
  exec('rm * -rf',{cwd:_release_dir},(err,stdout,stdin) => {
    exec('rm * -rf',{cwd:_release_dist},(err,stdout,stdin) => {
      cb();
    })
  })
})

gulp.task('default',['_release_out'], (cb) => {
  exec('rm ' + _release_dist + ' -rf',{cwd:'./'},(err,stdout,stdin) => {
    cb();
  })
});