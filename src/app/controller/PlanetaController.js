const Planeta = require("../model/Planeta");
const swapi = require("../../services/Swapi");


class PlanetaController {

    //Listagem dos Planetas
    async index(req, res) {

        console.log("Iniciando Listagem!");

        try {

            const planets = await Planeta.find();

            if (planets.length == 0) {
                console.log("Nenhum planeta encontrado!")
                return res.status(400).json({ warning: `Nenhum planeta encontrado` });
            }

            console.log("Planetas retonados com sucesso!");

            return res.status(200).json(planets);
        } catch (error) {
            return res.status(500).send({
                error: `Erro ao realizar a consulta.`,
                data: error
            });
        }
    }
    //Cadastro do planetas
    async cadastro(req, res) {

        console.log("Iniciando Cadastro!", req.body);
        try {

            if (!req.body.nome || !req.body.clima || !req.body.terreno) {
                return res.status(400).json({ error: `Favor preencher todos os campos` });
            }

            const verifyPlanet = await Planeta.findOne({ nome: req.body.nome });

            if (verifyPlanet) {
                console.log(`Planeta ${req.body.nome} já cadastrado!`);
                return res.status(400).json({ error: `Planeta já cadastrado` });
            }

            console.log(`Iniciando a consulta Swapi!`);

            const resp = await swapi.get('planets', {
                params: {
                    search: req.body.nome,
                },
            });

            if (resp.data.results.length > 0) {
                var countFilmes = resp.data.results[0].films.length;

                if (countFilmes > 0) {
                    console.log("Participações foram encontradas");
                    req.body.numFilmes = countFilmes;
                } else {
                    console.log(`Nenhuma participação foi encontrada`);
                }
            } else {
                console.log("Planeta inválido")
            }

            const insertPlanet = await Planeta.create(req.body);

            console.log("Planeta cadastrado com sucesso!")
            return res.status(200).json(insertPlanet);

        } catch (error) {
            console.log("Erro:", error)
            console.log(`Falha ao cadastrar o planeta ${req.body.nome}`);
            return res.status(500).json({
                error: `Não foi possível cadastrar o planeta ${req.body.nome}`,
                data: error
            })
        }
    }
    //Remoção dos planetas pelo nome
    async delete(req, res) {

        console.log(`Iniciando a remoção do planeta! ${req}`);
        try {

            const nome = req.params;

            const verifyPlanet = await Planeta.findOneAndRemove(nome);

            if (!verifyPlanet) {
                console.log(`Planeta não encontrado`);
                return res.status(404).json({
                    error: `Planeta não encontrado`
                })
            }

            console.log(`Planeta removido com sucesso!`)

            return res.status(200).json({
                message: `Planeta removido com sucesso!`
            })


        } catch (error) {
            console.log(`Erro ao deletar o Planeta`);
            return res.status(500).json({
                error: `Não foi possível remover o planeta`,
                data: error
            })
        }
    }
    //Encontrar planeta pelo nome
    async findByName(req, res) {

        console.log(`Inicianod a consulta do Planeta: ${req.params.nome}`)

        try {

            const nome = req.params;

            const planet = await Planeta.findOne(nome);

            if (planet) {
                console.log(`Planeta encontrado com sucesso!`);
                return res.status(200).json(planet);
            } else {
                console.log(`Planeta não foi encontrado`);
                return res.status(404).send({ error: `Planeta não cadastrado` });
            }

        } catch (error) {
            console.log(`Erro ao realizar a consulta`)
            return res.status(500).send({ error: `Erro ao realizar a consulta` });
        }
    }
    //Encontrar planeta pelo Id
    async findByID(req, res) {

        console.log(`Inicianodo a consulta do Planeta referente ao Id: ${req.params.id}`)

        try {

            const id = req.params.id;

            const planet = await Planeta.findById(id);

            if (planet) {
                console.log(`Planeta encontrado com sucesso!`);
                return res.status(200).json(planet);
            } else {
                console.log(`Planeta não foi encontrado`);
                return res.status(404).send({ error: `Planeta não cadastrado` });
            }

        } catch (error) {
            console.log(`Erro ao realizar a consulta`)
            return res.status(500).send({ error: `Id inválido`, erro: error });
        }
    }
}

module.exports = PlanetaController;