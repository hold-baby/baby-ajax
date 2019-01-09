'use strict'

const gulp = require('gulp')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const header = require('gulp-header')
const rename = require('gulp-rename')
const clean = require('gulp-clean')
const stripDebug = require('gulp-strip-debug');
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const pkg = require('./package.json')

const FILE_ADDR = './dist/';

// const ENV = gulp.env.env;
// const FILE_ADDR = ENV == 'dev' ? './example/static/' : './dist/';

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

gulp.task('clean', function() {
    return gulp.src('dist', {read: false}) //这里设置的dist表示删除dist文件夹及其下所有文件
        	.pipe(clean())
})

gulp.task('structure', function(){
    // 使用rollup构建
    return rollup.rollup({
        // 入口文件
        input: './index.js',
        plugins: [
            // 对原始文件启动 eslint 检查，配置参见 ./.eslintrc.json
            // eslint(),
            resolve(),
            babel({
                exclude: 'node_modules/**' // only transpile our source code
            })
        ]
    }).then(function(bundle){
        bundle.write({
            format: 'umd',
            name: 'Ajax',
            file: FILE_ADDR + 'ajax.js',
        }).then(function(){
            gulp.src(FILE_ADDR + './ajax.js')
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

gulp.task("move", function(){
    setTimeout(function(){
        gulp.src('./dist/ajax.js')
            .pipe(gulp.dest("./example/static"))
    }, 1000)
})

gulp.task("dev", ['structure','move'], function(){
	gulp.watch('./src/*.js',['structure','move'])
})
gulp.task("build", ['structure'], function(){
})
