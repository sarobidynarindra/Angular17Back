
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AuteurSchema = new Schema({
    id:Number,
    nom: String,
    photo: String
});

module.exports = mongoose.model('Auteur', AuteurSchema);