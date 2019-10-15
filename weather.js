
const request = require('request')
var local
var local2

if(process.env.NODE_ENV === 'production'){
    var MAPBOX_TOKEN = process.env.API_KEY1
    var DARK_SKY_SECRET_KEY = process.env.API_KEY2
}
else
{
    const credentials = require('./credentials.js')
    var MAPBOX_TOKEN = credentials.MAPBOX_TOKEN
    var DARK_SKY_SECRET_KEY = credentials.DARK_SKY_SECRET_KEY
}

const geocode = function (city, callback) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + city + '.json?access_token=' + MAPBOX_TOKEN
    //console.log(url)
    request({ url, json: true }, function (error, response) {
        if (error) {
            console.log('HAY ERROR en la conexion a mapbox')
            callback('No se pudo establecer la conexion con el servidor de mapbox ' + error, undefined)
        }
        else {
            //console.log('NO HAY ERROR -- Verificando si no hay otros errores')
            const data = response.body

            if (data.message) {
                callback('La API key de mapbox no es valida' + data.message, undefined)
            }
            else if (data.features && data.features.length === 0) {
                callback('No existe la locación - Favor de proporcionar una direccion correcta', undefined)
            }
            else {
                const latitud = {
                    latitud: data.features[0].center[0]
                }
                const longitud = {
                    longitud: data.features[0].center[1]
                }

                const url = ' https://api.darksky.net/forecast/' + DARK_SKY_SECRET_KEY + '/' + longitud.longitud + ',' + latitud.latitud + '?units=si&lang=es'
                //console.log(url)
                request({ url, json: true }, function (error, response) {
                    if (error) {
                        console.log('HAY ERROR en la conexion a weather') 
                        callback('No se pudo establecer la conexion con el servidor de darksky ' + error, undefined)
                    }
                    else {
                        //console.log(url)
                        const data = response.body

                        if (data.code && data.code === 403) {
                            callback('La API key de darksky no es valida ' + data.error, undefined)
                        }
                        else if (data.code && data.code === 400) 
                        {
                            callback('La locacion no es valida' + data.error, undefined)
                        }
                        else {
                            //console.log(data)
                            const info = {

                                summary: data.hourly.summary,
                                temp: data.currently.apparentTemperature,
                                precip: data.currently.precipProbability

                            }

                            callback(undefined, info)

                            //console.log(info.summary)
                            //console.log('La temperatura actual es de', info.temp + 'ºC')
                            //console.log('Hay', (info.precip) * 100 + '% probabilidad de lluvia')
                        }

                    }

                })
            }

        }

    })
}

module.exports = {
    geocode: geocode,
}


