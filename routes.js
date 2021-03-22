const Router = require('express');
const PlanetaController = require('./src/app/controller/PlanetaController');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const planet = new PlanetaController();

const routes = new Router();

routes.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Desafio Backend - Star Wars (Node.JS) - B2W Digital',
        listarPlanetas: 'http://localhost:3000/planets',
        cadastrarPlanetas: 'http://localhost:3000/planets/insert',
        deletarPlanetas: 'http://localhost:3000/planets/:nome',
        buscarPorId: 'http://localhost:3000/planets/:id'
    });
});

//Documentação gerada automaticamente pelo Swagger
routes.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

routes.post('/planets/insert', planet.cadastro, () => {
    // #swagger.description = 'Endpoint para cadastrar um planeta.'
    /* #swagger.parameters['Planeta'] = {
              in: 'body',
              description: 'Informações do planeta.',
              required: true,
              type: 'object',
              schema: { $ref: "#/definitions/Planeta" }
       } */
});

routes.get('/planets', planet.index, () => {
    // #swagger.description = 'Endpoint para listar todos os planetas.'
    /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/Planeta" },
              description: 'Segue abaixo a lista do Planetas!.' 
       } */
});

routes.get('/planets/:id', planet.findByID, () => {
    // #swagger.description = 'Endpoint para obter um planeta pelo id.'
    /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/Planeta" },
              description: 'Planeta Encontrado!.' 
       } */
});

routes.get('/planets/busca/:nome', planet.findByName, () => {
    // #swagger.description = 'Endpoint para obter um planeta pelo nome.'
    /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/Planeta" },
              description: 'Planeta Encontrado!.' 
       } */
});

routes.delete('/planets/:nome', planet.delete, () => {
    // #swagger.description = 'Endpoint para deletar um planeta.'
    /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/Planeta" },
              description: 'Planeta Deletado com sucesso!.' 
       } */
});

module.exports = routes;

