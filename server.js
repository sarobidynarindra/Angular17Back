let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');
var AuthController = require('./controller/AuthController');
const MatiereController = require('./controller/MatiereController');
const AuteurController = require('./controller/AuteurController');
const multer = require('multer');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
// const uri = 'mongodb+srv://ravaka:ravaka@cluster0.o8xl4n2.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0';
const uri = 'mongodb+srv://ratsaraefadahysarobidy:Sarobidy@cluster0.muz7h6p.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:" + port + "/api/assignments que cela fonctionne")
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Obligatoire si déploiement dans le cloud !
let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

// http://serveur..../assignments
app.route(prefix + '/assignments')
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment)
  .get(assignment.getAssignments)

app.route(prefix + '/assignments/getAssignmentsByRenduFalse')
  .get(assignment.getAssignmentsByRenduFalse)

app.route(prefix + '/assignments/getAssignmentsByRenduTrue')
  .get(assignment.getAssignmentsByRenduTrue);

app.route(prefix + '/assignments/updateAssignmentNoteRemarque')
  .put(assignment.updateAssignmentNoteRemarque);


app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);


app.use(prefix + '/auth', AuthController);

app.use(prefix + '/matiere', MatiereController);
app.use(prefix + '/auteur', AuteurController);


app.route(prefix + '/assignments/postAssignmentDB')
  .post(assignment.postAssignmentDB)

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


