let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');
let MatiereSchema = new Schema({
    id:Number,
    nom: String,
    image: String,
    nomProf: String,
    imageProf: String
});
MatiereSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Matiere', MatiereSchema);
