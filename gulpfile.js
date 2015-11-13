/**
 * Created by enahum on 11/10/15.
 */
var gulp = require('gulp'),
    electron = require('gulp-electron'),
    packageJson = require('./package.json'),
    jshint = require('gulp-jshint'),
    del = require('del'),
    ignore = require('gulp-ignore');

process.NODE_ENV = 'production';

gulp.task('lint', function() {
    return gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function(done) {
    del.sync([ 'src/plugins/**', 'src/plugins/**/.*', '!src/plugins', '!src/plugins/jquery', '!src/plugins/jquery-backstretch', '!src/plugins/**/*.min.js']);

    return done();
});

gulp.task('build', function() {
    return gulp.src("")
        .pipe(electron({
            src: './src',
            packageJson: packageJson,
            release: './release',
            cache: './cache',
            version: 'v0.34.3',
            packaging: true,
            platforms: ['win32-ia32', 'win32-x64', 'darwin-x64', 'linux-x64'],
            asar: true,
            platformResources: {
                darwin: {
                    CFBundleDisplayName: packageJson.name,
                    CFBundleIdentifier: packageJson.name,
                    CFBundleName: packageJson.name,
                    CFBundleVersion: packageJson.version,
                    icon: './resources/zbox.icns'
                },
                win: {
                    "version-string": packageJson.version,
                    "file-version": packageJson.version,
                    "product-version": packageJson.version,
                    "icon": './resources/zbox.ico'
                }
            }
        }))
        .pipe(gulp.dest(""));
});

gulp.task('default', ['clean', 'build']);