function printObj(obj) {
    console.log(JSON.stringify(obj, null, 2));
}

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('App Started');

    // handling the status bar
    StatusBar.show();
    StatusBar.backgroundColorByHexString('#d0f5fc');
    StatusBar.styleDefault();
    
    /*navigator.notification.alert(
        'Please wait...', null,
        'Loading', 'Okay'
    );
    $.mobile.loading('show', {
        text: 'Loading...', textVisible: true,
        theme: 'c', html:''
    });*/
    cordova.plugin.progressDialog.init({
        theme : 'HOLO_DARK',
        progressStyle : 'SPINNER',
        cancelable : true,
        title : 'Please Wait...',
        message : 'Contacting server ...',
        autoHide:3000
    });
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.defaultPageTransition = 'slide';

    // get json
    var url = 'http://galib45.herokuapp.com/pathology/json';
    console.log(url);
    console.log('getting json...');
    $.ajax({
        url: url,
        success: function(result, status, xhr) {
            console.log(status);
            //$.mobile.loading('hide');
            prepareList(result.articles);
            console.log('done');
        },
        error: function(xhr, status, error) {
            console.log(status);
            //$('#home').append(status);
            console.log(error);
            //$('#home').append(error);
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
