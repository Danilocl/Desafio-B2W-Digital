const mongoose = require ('mongoose');

const PlanetaSchema = new mongoose.Schema(

    {
        nome: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        clima: {
            type: String,
            required: true,
            trim: true
        },

        terreno: {
            type: String,
            required: true,
            trim: true
        },

        numFilmes: {
            type: Number,
            required: false,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Planeta', PlanetaSchema);