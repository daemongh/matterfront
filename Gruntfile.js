/**
 * Created by enahum on 11/19/15.
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'create-windows-installer': {
            x64: {
                appDirectory: './release/ZBoxChat-win32-x64',
                outputDirectory: './release/ZBoxChat-installer64',
                authors: 'ZBox Spa.',
                version: '<%= pkg.version %>',
                title: '<%= pkg.name %>',
                exe: 'ZBoxChat.exe',
                description: '<%= pkg.description %>',
                iconUrl: 'https://raw.githubusercontent.com/ZBoxApp/matterfront/master/resources/zbox.ico',
                setupIcon: './resources/zbox.ico',
                loadingGif: './resources/install-spinner.gif',
                noMsi: true
            },
            ia32: {
                appDirectory: './release/ZBoxChat-win32-ia32',
                outputDirectory: './release/ZBoxChat-installer32',
                authors: 'ZBox Spa.',
                version: '<%= pkg.version %>',
                title: '<%= pkg.name %>',
                exe: 'ZBoxChat.exe',
                description: '<%= pkg.description %>',
                iconUrl: 'https://raw.githubusercontent.com/ZBoxApp/matterfront/master/resources/zbox.ico',
                setupIcon: './resources/zbox.ico',
                loadingGif: './resources/install-spinner.gif',
                noMsi: true
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-electron-installer');

    // Default task(s).
    grunt.registerTask('default', ['create-windows-installer']);
};