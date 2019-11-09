$(document).ready(function() {
    // make connetction
    var socket = io.connect('http://localhost:3000')

    let longURL = document.getElementById('longURL');
    let buttonSend = document.getElementById('sendURL');
    let divResult = document.getElementById('result');
    let buttonShow = document.getElementById('show');
    let divList = document.getElementById('list');

    buttonSend.addEventListener('click', () => {
        const urlRegExp = /^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9\.\-]+(\.[a-zA-Z]{2,5}){0,1}[\.]{0,1}([:][0-9]{2,5}){0,1}/;
        // console.log(urlRegExp.test(longURL.value));
        if(urlRegExp.test(longURL.value)) {
            socket.emit('sendingURL', {
                longURL: longURL.value
            })
        } else {
            alert('Введите корректный URL');
            longURL.value = '';
        }
    })

    socket.on('sendShortUrl', (data) => {
        console.log(data.shortURL);
        divResult.innerHTML = `<h5>Ваша сокращенная ссылка - </h5>localhost:3000/${data.shortURL}`;
    })

    buttonShow.addEventListener('click', () => {
        socket.emit('giveInfo');
    })
    socket.on('giveInfo', (data) => {
        // console.log(data);
        let p = document.createElement('p');
        p.innerHTML = `ID ссылки - ${data.inf.id} ||  Сама ссылка - ${data.inf.longURL} || Количество переходов - ${data.inf.count} <br>`;
        divList.append(p);
    })
});