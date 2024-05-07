let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let NoteSchema = new Schema({
    id:Number,
    note:Number
});

module.exports = mongoose.model('Note', MatiereSchema);