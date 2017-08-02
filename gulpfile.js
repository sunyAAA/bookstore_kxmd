/**
 * Created by xsann on 2017/8/3.
 */
//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    cssnano =  require('gulp-cssnano'),
    browserify = require('browserify');

//js ES6转ES5并压缩
gulp.task('convertJS', function(){
    return gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});
// 合并并压缩css
gulp.task('convertCSS', function(){
    return gulp.src('src/css/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});
// browserify
gulp.task("browserify", function () {
    var b = browserify({
        entries: "dist/js/app.js"
    });

    return b.bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist/js"));
});
// 监视文件变化，自动执行任务
gulp.task('watch', function(){
    gulp.watch('src/css/*.css', ['convertCSS']);
    gulp.watch('src/js/*.js', ['convertJS', 'browserify']);
});

gulp.task('start', ['convertJS', 'convertCSS', 'watch']);