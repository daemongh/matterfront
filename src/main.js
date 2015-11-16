var app = require('app'),
    BrowserWindow = require('browser-window'),
    NativeImage = require('native-image'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    Q = require('q'),
    ipc = require('ipc'),
    compare = require('version-comparison'),
    version = require('./package.json').version;
// Report crashes to our server.

require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null,
    splashWindow = null,
    quitting = false,
    isValid = false,
    src = null,
    config = {},
    configPaths = [
        path.join('.', 'config.json'),
        path.join(app.getPath('userData'), 'config.json'),
        path.join(app.getAppPath(), 'config.json')
    ],
    i = configPaths.length,
    appIcon = NativeImage.createFromPath(path.join(__dirname, '../resources/mattermost.ico'));


var verifyService = function(url) {
    var done = Q.defer();
    request({
        url: url,
        method: 'HEAD'
    }, function(error, response) {
        if(error) {
            return done.reject();
        } else if (response.statusCode !== 200) {
            return done.reject();
        }

        return done.resolve();
    });
    return done.promise;
};

app.checkVersion = function(cb) {
    request(config.oauth, function(err, response, body) {
        if(cb && typeof cb === "function") {
            if(err) {
                return cb({error: true});
            } else if (response.statusCode !== 200) {
                return cb({error: true});
            }

            var json = JSON.parse(body);

            data = {
                min: compare(version, json.min) >= 0,
                update: compare(version, json.current) === -1,
                link: json.link
            };

            cb(data);
        }
    });
};

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    splashWindow = new BrowserWindow({width:600, height: 307, icon: appIcon, frame: false, 'skip-taskbar': true, transparent: true});
    mainWindow = new BrowserWindow({width: 1024, height: 600, icon: appIcon, frame: true, show: false});

    splashWindow.loadUrl('file://' + __dirname + '/splash.html');

    for (; --i >= 0;) {
        try {
            config = JSON.parse(fs.readFileSync(configPaths[i]));
            break;
        } catch(e) {
            if (e instanceof Error && e.code === 'ENOENT') {
                // next
            } else { throw e; }
        }
    }

    src = config.url || 'file://' + __dirname + '/nosrc.html';

    splashWindow.on('close', function() {
        if(isValid) {
            mainWindow.show();
        }
    });

    splashWindow.on('closed', function() {
        splashWindow = null;
    });

    mainWindow.loadUrl('file://' + __dirname + '/index.html' + '?src=' + encodeURIComponent(src));

    mainWindow.on('close', function (e) {
        if (process.platform != 'darwin') {
            return;
        }
        if (quitting) {
            return;
        }

        e.preventDefault();
        mainWindow.hide();
    });

    mainWindow.webContents.on('will-navigate', function (e) {
        e.preventDefault();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

});

app.on('activate', function(e, hasVisibleWindows) {
    if (hasVisibleWindows) {
        mainWindow.focus();
    } else {
        if (mainWindow === null) {
            mainWindow = new BrowserWindow({width: 1024, height: 600});
        } else {
            mainWindow.show();
        }
    }
});

app.on('before-quit', function(e) {
    quitting = true;
});

ipc.on('check-services', function(event) {
    Q.all([ verifyService(config.oauth), verifyService(config.url) ])
        .then(function() {
            return event.sender.send('service-status', true);
        })
    .fail(function() {
            return event.sender.send('service-status', false);
        });
});

ipc.on('version', function(event) {
    app.checkVersion(function(data) {
        if(data.error) {
            return event.sender.send('version', {error: true});
        }

        return event.sender.send('version', data);
    });
});

ipc.on('exit', function() {
    app.quit();
});

ipc.on('open', function() {
    isValid = true;
    splashWindow.close();
});