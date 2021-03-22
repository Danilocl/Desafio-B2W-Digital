const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');

const planetaComFilmes = {
  nome: 'Alderaan',
  clima: 'Temperado ',
  terreno: 'Campo, montanhoso',
};

const planetaSemFilmes = {
  nome: 'Terra',
  clima: 'Variado',
  terreno: 'Variado',
};

const planetNull = {
  nome: '',
  clima: '',
  terreno: '',
};

const planetaInvalido = {
  nome: 'Krypton',
  clima: 'frio',
  terreno: 'montanhoso',
  id: '5e694ed53603f00555a748bf',
};

describe('Desafio B2W - Teste API', () => {

  let mongoServer;
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();

    mongoose.connect(process.env.MONGO_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  });

  afterAll(async () => {
    mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany();
    }
  });

  it('# Cadastrar um novo planeta com a quantidade de aparições em filmes >= 1', async () => {
    const response = await request(app)
      .post('/planets/insert')
      .send(planetaComFilmes);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.numFilmes).toBeGreaterThanOrEqual(1);
  });

  it('# Cadastrar um novo planeta com a quantidade de aparições em filmes = 0', async () => {
    const response = await request(app)
      .post('/planets/insert')
      .send(planetaSemFilmes);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.numFilmes).toBe(0);
  });

  it('# Criticar um planeta com os campos inválidos', async () => {
    const response = await request(app)
      .post('/planets/insert')
      .send(planetNull);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('# Criticar ao tentar criar um planeta já existente', async () => {
    await request(app)
      .post('/planets/insert')
      .send(planetaComFilmes);

    const response = await request(app)
      .post('/planets/insert')
      .send(planetaComFilmes);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('# Consultando um planeta pelo nome', async () => {
    await request(app)
      .post('/planets/insert')
      .send(planetaComFilmes);

    const response = await request(app).get(
      `/planets/busca/${planetaComFilmes.nome}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });


  it('# Consultando planeta pelo nome que não está existe no BD', async () => {
    const response = await request(app).get(
      `/planets/busca/${planetaInvalido.nome}`
    );

    expect(response.status).toBe(404);
  });


  it('# Consultando planeta sem informar o nome', async () => {
    const response = await request(app).get('/planets/busca/');

    expect(response.status).toBe(500);
  });

  it('# Consultando planeta com ID inválido', async () => {
    const response = await request(app).get(`/planets/${planetaInvalido.id}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: `Planeta não cadastrado`
    });
  });

  it('# Retornar a lista de todos os planetas cadastrados', async () => {
    await request(app)
      .post('/planets/insert')
      .send(planetaComFilmes);

      await request(app)
      .post('/planets/insert')
      .send(planetaSemFilmes);

    const response = await request(app).get('/planets');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('# Remover um planeta válido', async () => {
    await request(app)
      .post('/planets/insert')
      .send(planetaComFilmes);

    const response = await request(app).delete(
      `/planets/${planetaComFilmes.nome}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: `Planeta removido com sucesso!`
    });
  });

  it('# Tentando remover um planeta não cadastrado', async () => {
    const response = await request(app).delete(
      `/planets/${planetaInvalido.nome}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: `Planeta não encontrado`
    });
  });

});