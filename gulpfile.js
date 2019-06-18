/**********************************************************
 * Wordpress gulp theme build
 * ********************************************************
 *
 * Gulp example theme by Eremenko Igor 17.6.2019 @MerelyiGor
 * Variable declaration
 * file paths for settings below
 * path to parent directories and source folder,
 * customize according to your project
 *
 * ********************************************************
 * ********************************************************/
const root_dir_build = 'root_dir/';
const root_src_APP = 'src/';
const root_src_sass = root_src_APP + 'sass/**/*.sass';
const root_src_php = root_src_APP + 'template/**/*';
const root_src_js = root_src_APP + 'js/**/*.js';
const root_src_libs = root_src_APP + 'libs/**/*';
const root_src_image = root_src_APP + 'images/**/*';

const build_dir_css = root_dir_build + '/css';
const build_dir_php = root_dir_build;
const build_dir_js = root_dir_build + '/js';
const build_dir_libs = root_dir_build + '/libs';
const build_dir_image = root_dir_build + '/images';

/***************----------------------------------------------------------------**************
 * Settings upload to server
 * FTP UPLOAD COMAND "$ gulp deploy"
 ***************----------------------------------------------------------------**************/
const ftp_host = 'host';
const ftp_user = 'user';
const ftp_password = 'password';
const local_directory_src = root_dir_build;
const FTP_directory_deploy = '/sub/domain.com/to/server/directory';
/***************----------------------------------------------------------------**************/

// We connect Gulp and all necessary libraries
const gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    bourbon = require('node-bourbon'),
    ftp = require('vinyl-ftp'),
    del = require('del');


// scissors and paste main.css
gulp.task('sass', function () {
    return gulp.src(root_src_sass)
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(cleanCSS())
        .pipe(gulp.dest(build_dir_css));
});

// delete files on demand - (cash and so on)
gulp.task('clean', function () {
    return del(['/root_dir/*', '!root_dir']);
});

// assembly php
gulp.task('php:build', function () {
    gulp.src(root_src_php)
        .pipe(gulp.dest(build_dir_php))
});

// assembly js
gulp.task('js:build', function () {
    gulp.src(root_src_js)
        .pipe(gulp.dest(build_dir_js))
});

// library relocation
gulp.task('libs:build', function () {
    gulp.src(root_src_libs)
        .pipe(gulp.dest(build_dir_libs))
});

// moving images
gulp.task('image:build', function () {
    gulp.src(root_src_image)
        .pipe(gulp.dest(build_dir_image))
});

// File monitoring
gulp.task('watch', ['sass'], function () {
    gulp.watch(root_src_sass, ['sass']);
    gulp.watch(root_src_php, ['php:build']);
    gulp.watch(root_src_js, ['js:build']);
    gulp.watch(root_src_libs, ['libs:build']);
    gulp.watch(root_src_image, ['image:build']);
});

// Uploading changes to hosting
gulp.task('deploy', function () {
    const conn = ftp.create({
        host: ftp_host,
        user: ftp_user,
        password: ftp_password,
        parallel: 10,
        log: gutil.log
    });
    const globs = [local_directory_src];
    return gulp.src(globs, {buffer: false})
        .pipe(conn.dest(FTP_directory_deploy));
});

gulp.task('build', [
    'clean',
    'sass',
    'php:build',
    'js:build',
    'libs:build',
    'image:build',
]);

gulp.task('default', ['watch']);