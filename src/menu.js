var remote = require('remote'),
    app = remote.require('app'),
    Menu = remote.require('menu'),
    shell = require('shell'),
    name = app.getName();

var clearCredentials = function() {
    var webview = document.querySelector('#mattermost-remote');
    localStorage.removeItem('credentials');
    if(webview.getUrl().indexOf('oauth.zboxapp.com') > -1) {
        webview.executeJavaScript("jQuery('#username').val(''); \ " +
            "jQuery('#password').val('');");
    }
};

var template = [
    {
        label: 'Editar',
        submenu: [
            {
                label: 'Deshacer',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: 'Rehacer',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cortar',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: 'Copiar',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: 'Pegar',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: 'Seleccionar Todo',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }
        ]
    },
    {
        label: 'Ver',
        submenu: [
            {
                label: 'Recargar',
                accelerator: 'CmdOrCtrl+R',
                click: function(item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            },
            {
                label: 'Pantalla Completa',
                accelerator: (function() {
                    if (process.platform == 'darwin')
                        return 'Ctrl+Command+F';
                    else
                        return 'F11';
                })(),
                click: function(item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            }
            //{
            //    label: 'Toggle Developer Tools',
            //    accelerator: (function() {
            //        if (process.platform == 'darwin')
            //            return 'Alt+Command+I';
            //        else
            //            return 'Ctrl+Shift+I';
            //    })(),
            //    click: function(item, focusedWindow) {
            //        if (focusedWindow)
            //            focusedWindow.toggleDevTools();
            //    }
            //}
        ]
    },
    {
        label: 'Ventana',
        role: 'window',
        submenu: [
            {
                label: 'Minimizar',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: 'Cerrar',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            }
        ]
    },
    {
        label: 'Ayuda',
        role: 'help',
        submenu: [
            {
                label: 'Conocer más',
                click: function() { shell.openExternal('http://zboxapp.com'); }
            },
            {
                label: 'Verificar actualizaciones',
                click: function(item, focusedWindow) {
                    app.checkVersion(function(data) {
                        if(data.error) {
                            return alert('Ocurrió un error comprobando la versión del software.');
                        } else if(!data.min) {
                            alert('Es necesario realizar una actualización del software para utilizar ZBox Chat\n\nImportante: La aplicación será cerrada');
                            shell.openExternal(data.link);
                            app.quit();
                        }
                        else if(data.update) {
                            if(confirm('Hay una nueva versión de ZBox Chat\n ¿Quieres descargarla ahora?')) {
                                shell.openExternal(data.link);
                            }
                        } else {
                            alert("No hay nuevas actualizaciones");
                        }
                    });
                }
            }

        ]
    }
];

if (process.platform == 'darwin') {
    template.unshift({
        label: name,
        submenu: [
            {
                label: 'Acerca ' + name,
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: 'Limpiar credenciales',
                accelerator: 'Command+Shift+L',
                click: clearCredentials
            },
            {
                type: 'separator'
            },
            {
                label: 'Servicios',
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: 'Esconder ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            },
            {
                label: 'Esconder Otros',
                accelerator: 'Command+Shift+H',
                role: 'hideothers'
            },
            {
                label: 'Mostrar Todos',
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: 'Salir',
                accelerator: 'Command+Q',
                click: function() { app.quit(); }
            }
        ]
    });
    // Window menu.
    template[3].submenu.push(
        {
            type: 'separator'
        },
        {
            label: 'Traer todos hacia adelante',
            role: 'front'
        }
    );
} else {
    template.unshift({
        label: 'Archivo',
        submenu: [
            {
                label: 'Limpiar credenciales',
                accelerator: 'Ctrl+Shift+L',
                click: clearCredentials
            },
            {
                type: 'separator'
            },
            {
                label: 'Salir',
                accelerator: 'Alt+Q',
                click: function() { app.quit(); }
            }
        ]
    });
}

menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
