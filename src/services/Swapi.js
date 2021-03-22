const axios = require('axios');

const swapi = axios.create({
    baseURL: 'https://swapi.dev/api',
});

module.exports = swapi;