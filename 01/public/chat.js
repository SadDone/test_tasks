$(function () {
    // make connetction
    var socket = io.connect('http://localhost:3000')

    // console.log(id);
    // buttons and input
    // var message = $("#message")
    // var username = $('#username')
    // var send_message = $('#send_message')
    // var send_username = $('#send_username')
    // var chatroom = $('#chatroom')
    // var userList = $('#userList')
    // var button = new Array();
    var selectFrom = document.getElementById('selectID1');
    var selectTo = document.getElementById('selectID2');
    var inputFrom = document.getElementById('inputFrom');
    var inputTo = document.getElementById('inputTo');

    inputFrom.addEventListener('input', () => { // при изменении значения в 1 инпуте, будет меняться второй инпут
        socket.emit('typingFrom', {
            valFrom: selectFrom.value, //передаем валюту, которую надо перевести
            valTo: selectTo.value, // передаем валюту, в которую надо перевести
            num: inputFrom.value // передаем значение
        })
    })

    inputTo.addEventListener('input', () => { // при изменении значения в 1 инпуте, будет меняться второй инпут
        socket.emit('typingTo', {
            valFrom: selectFrom.value, //передаем валюту, которую надо перевести
            valTo: selectTo.value, // передаем валюту, в которую надо перевести
            num: inputTo.value // передаем значение
        })
    })

    socket.on('typingFrom', (data) => {
        inputTo.value = data.result;
    })

    socket.on('typingTo', (data) => {
        inputFrom.value = data.result;
    })


    // console.log(socket);


});