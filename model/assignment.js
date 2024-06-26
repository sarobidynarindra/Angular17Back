let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let AssignmentSchema = Schema({
    id: Number,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    auteur: { type: Schema.Types.ObjectId, ref: 'Auteur', required: true },
    matiere: { type: Schema.Types.ObjectId, ref: 'Matiere', required: true },
    note: { type: Number, min: 0, max: 20, default: null },
    remarques: { type:String, default: null}
});

AssignmentSchema.plugin(mongoosePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
module.exports = mongoose.model('assignments', AssignmentSchema);
    