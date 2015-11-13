var remote = require('remote');
var app = remote.require('app');
var Menu = remote.require('menu');

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
                click: function() { require('shell').openExternal('http://zboxapp.com'); }
            }
        ]
    }
];

if (process.platform == 'darwin') {
    var name = app.getName();
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
}

menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
