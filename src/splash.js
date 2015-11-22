var ipc = require('electron').ipcRenderer,
    shell = require('electron').shell;

$(document).ready(function() {
    var body = $('body'),
        msgs = $('footer div'),
        retryInterval = null;

    var handleOnline = function() {
        var isOnline = navigator.onLine;
        msgs.css('color', '#000');
        msgs.text('verificando conexión...');
        if(retryInterval) {
            clearInterval(retryInterval);
        }

        if(isOnline) {
            online();
        } else {
            offline(30);
        }
    };

    var online = function() {
        msgs.css('color', '#000');
        setTimeout(function () {
            msgs.text('verificando servicios...');
            ipc.send('check-services');
        }, 1000);
    };

    var offline = function(timeout) {
        msgs.css('color', '#d14');
        retryInterval = setInterval(function() {
            if(timeout >= 0) {
                msgs.text('Fuera de linea! reintentando por ' + timeout.toString() + ' segundos');
            } else if (timeout === -1) {
                msgs.text('Cerrando aplicación...');
            }  else {
                clearInterval(retryInterval);
                ipc.send('exit');
            }
            timeout--;
        }, 1000);
    };

    var exitWithError = function(error, timeout) {
        timeout = timeout || 3000;
        msgs.css('color', '#d14');
        msgs.text(error + ' (Cerrando aplicación)');
        setTimeout(function() {
            ipc.send('exit');
        }, timeout);
    };

    ipc.on('service-status', function(status) {
        if(status) {
            msgs.css('color', '#000');
            msgs.text('Verificando versión...');
            ipc.send('version');
        } else {
            exitWithError('Los servicios no están disponibles, intente más tarde.');
        }
    });

    ipc.on('update-error', function(msg) {
        alert(msg);
    });

    ipc.on('update-ready', function() {
        if(confirm('Hay una nueva versión de ZBox Chat\n ¿Quieres instalarla ahora?')) {
            ipc.send('install');
        }
    });

    window.addEventListener('online', handleOnline );
    window.addEventListener('offline', handleOnline );

    $.backstretch(["./splash.png"]);

    setTimeout(handleOnline, 500);
});