const express = require('express')
const app = express()
// const needle = require('needle');
const mysql = require('mysql');

const connection = mysql.createConnection({ //данные для базы данных
    host: "localhost",
    user: "root",
    database: 'usersdb',
    // password: "123456"
});


connection.query("CREATE DATABASE if not exists usersdb", //создаем бд
    function (err, results) {
        if (err) console.log(err);
        else console.log("База данных создана");
    });

let sql = `create table if not exists url( 
    id int primary key auto_increment,
    longURL varchar(255) not null,
    count int not null
  )`; // создаем таблицу

connection.query(sql, function (err, results) {
    if (err) console.log(err);
    else console.log("Таблица создана");
});


app.set('view engine', 'ejs')


app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index')
})

// Listen on port 3000
server = app.listen(3000)

//socket.io instantiation
const io = require("socket.io").listen(server);




// listen on every connetction
io.on('connection', (socket) => {


    socket.on('sendingURL', (data) => { //принимаем данные с клиента
        let sql = `INSERT INTO url(longURL, count) VALUES (?, ?)`; //добавляем данные с бд
        var shortURL;
        let inf = [data.longURL, 0]
        connection.query(sql, inf, (err, results) => {
            if (err) console.log(err);
            shortURL = results.insertId.toString(36); // из ID ссылки в бд делаем уникальный url, переводя id в 36 ричный код
            socket.emit('sendShortUrl', {
                shortURL: shortURL
            })
        })
    })


    socket.on('giveInfo', () => {
        connection.query('SELECT * FROM url', (err, result) => {
            if(err) console.log(err);
            let arr = result;
            for(let i = 0; i < arr.length; i++) {
                // console.log(arr[i]);
                socket.emit('giveInfo', {
                    inf: arr[i]
                })
            }
        })
    })

})

app.get('/:url', (req, res) => { 

    let idLong = parseInt(req.url.slice(1, req.url.length), 36); //узнаем id нашей длинной ссылки в БД переводя из 36 ричной системы в 10
    let sql = `SELECT * FROM url WHERE id = ?`;
    let longURL, count;

    connection.query(sql, idLong, (err, results) => {
        if (err) console.log(err)
        console.log(results);
        longURL = results[0].longURL; //узнаем длинную ссылку
        count = results[0].count; //узнаем количество переходов по ссылке
        console.log(count);

        sql = `UPDATE url SET count = ? WHERE id = ?`;
        let inf = [++count, idLong];

        connection.query(sql, inf, (err, result) => { //добавляем при каждом переходе count
            if (err) console.log(err);
            console.log(result);
        })

        res.redirect(301, longURL); // переходим по длинной ссылке

    })
});
