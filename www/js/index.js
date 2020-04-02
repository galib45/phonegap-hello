function log(obj) {
    if(typeof obj == 'object') {
        console.log(JSON.stringify(obj, null, 2));
    } else {
        console.log(obj);
    }
}

function alert(message) {
    navigator.notification.alert(
        message, null,
        'Alert', 'Okay'
    );
}

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('App Started');
    alert('App Started');

    // handling the status bar
    StatusBar.show();
    StatusBar.backgroundColorByHexString('#d0f5fc');
    StatusBar.styleDefault();

    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.defaultPageTransition = 'slide';

    alert('initializing push');
    PushNotification.hasPermission(function() {
        alert('yes');
    }, function() {
        alert('no');
    });
    var push = PushNotification.init({
        android: {}
    });
    alert('push initialized');
    
    log(push);

    push.on('registration', function(data) {
        log(data);
        alert(
            'registrationId:\n' + 
            data.registrationId + 
            '\n\nregistrationType: ' +
            data.registrationType
        );
    });

    push.on('error', function(error) {
        alert('Error:\n' + error.message);
    })
    
    cordova.plugin.progressDialog.init({
        theme : 'DEVICE_LIGHT',
        progressStyle : 'SPINNER',
        cancelable : false,
        title : 'Loading...',
        message : 'Please wait. \nContacting server ...\n',
    });

    // get json
    var url = 'http://galib45.herokuapp.com/pathology/json';
    console.log(url);
    console.log('getting json...');
    $.ajax({
        url: url,
        success: function(result, status, xhr) {
            console.log(status);
            cordova.plugin.progressDialog.dismiss();
            prepareList(result.articles);
            console.log('done');
        },
        error: function(xhr, status, error) {
            console.log(status);
            console.log(error);
            navigator.notification.alert(error, null, 'Error', 'Okay');
        }
    });
}

function prepareList(articles) {
    var content, listContent;
    for (article of articles) {
        content = '<h1>' + article.title + '</h1>' + 
            '<h2>' + article.subtitle + '</h2>' + 
            '<span class="ui-li-count">' + article.view_count + ' views</span>' + 
            '<p>Created by <b>' + article.author + 
            '</b> on ' + article.date_created + '</p>';
        listContent = '<li id="item-' + article.id + '">' + 
            '<a href="#article-' + article.id + '">' + content + '</a></li>';
        createPage(article);
        $('#mainList').append(listContent);
    }
    $('#mainList').listview('refresh');
}

function createPage(article) {
    console.log('creating page - ' + article.id);
    pageContent = '<div data-role="page" data-theme="a" id="article-' + article.id + '">' + 
        '<div data-role="header" data-theme="c" data-position="fixed" data-id="header">' +
        '<h1 class="article-header">' + article.title + '</h1>' + 
        '<a href="#home" data-theme="b" data-direction="reverse" ' + 
        'class="ui-btn ui-btn-b ui-corner-all ui-btn-right ui-icon-carat-l ui-btn-icon-notext">Back</a></div>' +
        '<div role="main" class="post">' + article.content + '</div></div>';
    $('body').append(pageContent);
    var tables = document.getElementsByTagName('table');
    var wrapper, table;

    for (table of tables) {
        wrapper = document.createElement('div');
        table.parentNode.replaceChild(wrapper, table);
        wrapper.appendChild(table);
        wrapper.style.overflowX = 'auto';
    }
}

// swipe
$('#home').on('swipeleft', function() {
    $('#homToset').click();
});

$('#settings').on('swipeleft', function() {
    $('#setToabo').click();
});

$('#settings').on('swiperight', function() {
    $('#setTohom').click();
});

$('#about').on('swiperight', function() {
    $('#aboToset').click();
});

$(document).on('backbutton', function() {
    if($.mobile.activePage.is('#home')) {
        navigator.notification.confirm(
            'Are you sure to close the app?',
            function(buttonIndex) {
                if (buttonIndex == 1) {
                    log('exiting app...');
                    navigator.app.exitApp();
                }
            }
        );
    } else {
        history.back();
    }
});
