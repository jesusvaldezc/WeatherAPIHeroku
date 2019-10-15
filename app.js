const express = require('express')
const map = require('./weather.js')
const port = process.env.PORT || 3000
const app = express()

app.get('/', function (req, res) {
    return res.send({
        greeting: "Hola mundo"

    })
})

app.get('/weather', function (req, res) {
    if (!req.query.search) {
        return res.send({
            error: "Debes de enviar una locación valida"
        })
    }
    map.geocode(req.query.search, function (error, weatherData) {
        if (error) {
            return res.send({
                error: error
            })
        } else {
            return res.send({
                city: req.query.search,
                weatherData
                });            
        }
    })
})

app.get('/*', function (req, res) {
    return res.send({
        error: "Ruta no es valida"
    })

})

app.listen(port, function () {
    console.log('Up and running!')
})