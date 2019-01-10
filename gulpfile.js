'use strict'

const gulp = require('gulp')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const header = require('gulp-header')
const rename = require('gulp-rename')
const clean = require('gulp-clean')
const beautify = require('gulp-beautify');
const stripDebug = require('gulp-strip-debug');
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const pkg = require('./package.json')

const FILE_ADDR = './dist/';
const DEV_ADDR = './example/static/'

let rollupOpt = {
    // 入口文件
    input: './index.js',
    plugins: [
        resolve(),
        babel({
            babelrc: false,
            presets: [['env', { modules: false }]],
            exclude: 'node_modules/**' // only transpile our source code
        })
    ]
}

const banner = () => {
  return [
    '/**!',
    ' * <%= pkg.name %> - v<%= pkg.version %>',
    ' * <%= pkg.description %>',
    ' *',
    ' * <%= new Date( Date.now() ) %>',
    ' * <%= pkg.license %> (c) <%= pkg.author %>',
    '*/',
    ''
  ].join('\n')
}

gulp.task('structure', function(){
    // 使用rollup构建
    return rollup.rollup(rollupOpt)
    .then(function(bundle){
        bundle.write({
            format: 'umd',
            name: 'Ajax',
            file: FILE_ADDR + 'ajax.js',
        }).then(function(){
            gulp.src(FILE_ADDR + './ajax.js')
                .pipe(beautify({indent_size: 4}))
                .pipe(gulp.dest(FILE_ADDR))
                .pipe(stripDebug())
                .pipe(sourcemaps.init())
                // 压缩
                .pipe(uglify())
                .pipe(header(banner(), { pkg: pkg }))
                // 产出的压缩的文件名
                .pipe(rename('ajax.min.js'))
                // 生成 sourcemap
                .pipe(sourcemaps.write(''))
                .pipe(gulp.dest(FILE_ADDR))
        })
    })
})

gulp.task('dev_structure', function(){
    // 使用rollup构建
    return rollup.rollup(rollupOpt)
    .then(function(bundle){
        bundle.write({
            format: 'umd',
            name: 'Ajax',
            file: DEV_ADDR + 'ajax.js',
        }).then(function(){
            gulp.src(DEV_ADDR + 'ajax.js')
                .pipe(beautify({indent_size: 4}))
                .pipe(gulp.dest(DEV_ADDR))
        })
    })
})

gulp.task("dev", ['dev_structure'], function(){
	gulp.watch('./src/*.js',['dev_structure'])
})
gulp.task("build", ['structure'], function(){
})
