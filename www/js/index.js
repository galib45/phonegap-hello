function printObj(obj) {
    console.log(JSON.stringify(obj, null, 2));
}

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('App Started');
    StatusBar.show();
    StatusBar.backgroundColorByHexString('#d0f5fc');
    StatusBar.styleDefault();
    $.mobile.allowCrossDomainPages = true;
    $.mobile.defaultPageTransition = 'slide';
}

$('#name').keypress(function(event) {
    if(event.which == 13) {
        $('#btn').click();
    }
})

$('#btn').click(function() {
    $('#greeting-text').html('Hello ' + $('#name').val());
    $('#greet').popup('open');
});

$('#popbtn').click(function() {
    $('#greet').popup('close');
});