const express = require('express')
const app = express()
const needle = require('needle');
let dataJSON;

url = 'https://www.cbr-xml-daily.ru/daily_json.js';
needle.get(url, (err, res) => {
    if(err) throw(err);

    dataJSON = JSON.parse(res.body);

})

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

    let calculate = (valFrom, valTo, num) => {
        let val1, val2, coef, result;
        if(valFrom == 'RUB') {
            val1 = 1;
        } else {
            val1 = dataJSON.Valute[valFrom].Value;
        }
        if(valTo == 'RUB') {
            val2 = 1;
        } else {
            val2 = dataJSON.Valute[valTo].Value
        }

        coef = val2/val1;
        result = num*coef;
        return result;
    }

    socket.on('typingFrom', (data) => {
        let result = calculate(data.valTo, data.valFrom, data.num);
        socket.emit('typingFrom', {
            result
        })
    })

    socket.on('typingTo', (data) => {
        let result = calculate(data.valFrom, data.valTo, data.num);
        socket.emit('typingTo', {
            result
        })
    })
})