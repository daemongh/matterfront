(function() {
    "use strict";

    var ipc = require('electron').ipcRenderer,
        shell = require('electron').shell;

    var mentionCount = 0;
    var unreadCount = 0;

    var notifyHost = function () {
        // send back the counts to the webview host
        ipc.sendToHost('mention-count', mentionCount);
        ipc.sendToHost('unread-count', unreadCount);
    };

    // we'll only notify if there's a change in the counts
    var checkActivity = function () {
        var notify = false;
        var localMentionCount = 0;
        // get the actual count of mentions from Mattermost
        $('.unread-title.has-badge .badge').each(function () {
            localMentionCount += parseInt($(this).text(), 10);
        });

        // set flag to notify if the mention count has changed
        if (localMentionCount != mentionCount) {
            mentionCount = localMentionCount;
            notify = true;
        }

        var localUnreadCount = $('.unread-title').length;
        // set flag to notify if the unread count has changed
        if (localUnreadCount != unreadCount) {
            unreadCount = localUnreadCount;
            notify = true;
        }

        if (notify) notifyHost();
    };

    document.addEventListener("DOMContentLoaded", function () {
        // observe the DOM for mutations, specifically the .ps-container
        // which contains all the sidebar channels
        var MutationObserver = window.MutationObserver;
        var list = document.querySelector('#sidebar-left');

        var observer = new MutationObserver(function (mutations) {
            if (mutations.length) {
                checkActivity();
            }
        });

        if (list) {
            observer.observe(list, {
                subtree: true,
                attributes: true,
                childList: true
            });
        }

        // initial one time notification
        checkActivity();

        if(window.location.host === "oauth.zboxapp.com") {
            jQuery('#submit-form').on('click', function() {
                var data = {
                    username: jQuery('#username').val(),
                    password: jQuery('#password').val()
                };
                ipc.sendToHost('credentials', data);
            });
        }
    });
})();