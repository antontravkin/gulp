const gulp = require('gulp');

require('./gulp/def.js');

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('html', 'sass', 'images', 'js'),
    gulp.parallel('start', 'watch')
))