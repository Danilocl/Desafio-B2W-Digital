const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes']

const doc = {
    info: {
        version: "1.0.0",
        title: "Star Wars API",
        description: "Desafio B2W Digital"
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    definitions: {
        Planeta: {
            nome: 'Alderaan',
            clima: 'Temperado',
            terreno: 'Campo, montanhoso',
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js')
})