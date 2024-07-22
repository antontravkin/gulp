const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const fileIncludeSetting = {
    prefix: '@@',
    basepath: '@file',
};
//scss
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
//const autoprefixer = require('gulp-autoprefixer');
//const csso = require('gulp-csso');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: "Error <%= error.message %>",
            sound: false,
        }),
    };
}
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
//const webp = require('gulp-webp');
//const webphtml = require('gulp-webp-html');


gulp.task('clean', function (done) {
    if (fs.existsSync('./docs/')) {
        return gulp
            .src('./docs/', { read: false })
            .pipe(clean());
    }
    done();
});

gulp.task('html', function () {
    return gulp
        .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(plumber(plumberNotify('HTML')))
        //.pipe(webphtml())
        .pipe(fileInclude(fileIncludeSetting))
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourceMaps.init())

        .pipe(sassGlob())
        .pipe(sass())
        .pipe(sourceMaps.write())
        //.pipe(csso())
        //.pipe(autoprefixer())
        .pipe(gulp.dest('./dist/css/'));

});

gulp.task('images', function () {
    return gulp.src('./src/img/**/*', { encoding: false })
        //.pipe(imagemin({ verbose: true }))
        //.pipe(webp())
        .pipe(gulp.dest('./docs/img'));
})

gulp.task('fonts', function () {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./docs/fonts'));
})

gulp.task('files', function () {
    return gulp.src('./src/files/**/*')
        .pipe(gulp.dest('./docs/files'));
})

gulp.task('js', function () {
    return gulp
        .src('./src/js/*.js')
        .pipe(plumber(plumberNotify('JS')))
        .pipe(webpack(require('../webpack.config.js')))
        .pipe(gulp.dest('./docs/js'));
})

gulp.task('start', function () {
    return gulp.src('./docs/')
        .pipe(server({
            livereload: true,
            open: true
        }));
})

gulp.task('watch', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./src/**/*.html', gulp.parallel('html'));
    gulp.watch('./src/img/**/*', gulp.parallel('images'));
    gulp.watch('./src/js/*.js', gulp.parallel('js'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
    gulp.watch('./src/files/**/*', gulp.parallel('files'));
})

