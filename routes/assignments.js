let Assignment = require('../model/assignment');
let auteur = require('../model/auteur');
let matiere = require('../model/matiere');

// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/

function getAssignments(req, res){
    let aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(
        aggregateQuery, 
        {
            page: parseInt(req.query.page) || 1, 
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if(err){
                res.send(err)
            }
    
            res.send(data);
        }
    );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;
    Assignment.findById(assignmentId, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })

    /*
    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
    */
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    auteur.findOne({ _id: req.body.auteur }, (err, auteur) => {
   
        if (err) {
          return res.status(500).send({ message: err });
        }
    
        if (!auteur) {
          return res.status(404).send({ message: "auteur not found" });
        }
    
        matiere.findOne({ _id: req.body.matiere }, (err, matiere) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
    
          if (!matiere) {
            return res.status(404).send({ message: "Matiere not found" });
          }
    
    let assignment = new Assignment();
    //assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = false;
    assignment.auteur=auteur._id;
    assignment.matiere=matiere._id;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            return res.status(400).send('cant post assignment');
            //res.send(' ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    });
});
});
}
    
// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
// l'id est bien le _id de mongoDB
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
