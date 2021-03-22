const app = require('./app.js');
const router = require('./routes.js');

const porta = 3000;

app.use(router);

app.listen(porta, () => {
    console.log("Servidor iniciado na porta", porta);
});
