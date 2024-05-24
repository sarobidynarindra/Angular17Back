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

function getAssignments(req, res) {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let aggregateQuery = Assignment.aggregate([
        {
            $lookup: {
                from: 'auteurs',
                localField: 'auteur',
                foreignField: '_id',
                as: 'auteurs'
            }
        },
        {
            $lookup: {
                from: 'matieres',
                localField: 'matiere',
                foreignField: '_id',
                as: 'matieres'
            }
        },
        {
            $unwind: '$auteurs'
        },
        {
            $unwind: '$matieres'
        }
    ]);

    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: page,
            limit: limit
        },
        (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.send(data);
        }
    );
}

module.exports = {
    getAssignments
};



// Récupérer un assignment par son id (GET)
const mongoose = require('mongoose');

function getAssignment(req, res) {
    let assignmentId = mongoose.Types.ObjectId(req.params.id);

    let aggregateQuery = Assignment.aggregate([
        {
            $match: { _id: assignmentId }
        },
        {
            $lookup: {
                from: 'auteurs',
                localField: 'auteur',
                foreignField: '_id',
                as: 'auteurs'
            }
        },
        {
            $lookup: {
                from: 'matieres',
                localField: 'matiere',
                foreignField: '_id',
                as: 'matieres'
            }
        },
        {
            $unwind: {
                path: '$auteurs',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$matieres',
                preserveNullAndEmptyArrays: true
            }
        },
    ]);

    aggregateQuery.exec((err, assignment) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!assignment || assignment.length === 0) {
            return res.status(404).send({ message: 'Assignment not found' });
        }
        res.json(assignment[0]);
    });
}

module.exports = { getAssignment };


// Ajout d'un assignment (POST)
function postAssignment(req, res) {
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

            assignment.nom = req.body.nom;
            assignment.dateDeRendu = req.body.dateDeRendu;
            assignment.rendu = false;
            assignment.auteur = auteur._id;
            assignment.matiere = matiere._id;

            console.log("POST assignment reçu :");
            console.log(assignment)

            assignment.save((err) => {
                if (err) {
                    return res.status(400).send('cant post assignment');
                    //res.send(' ', err);
                }
                res.json({ message: `${assignment.nom} saved!` })
            });
        });
    });
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: 'updated' })
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
        res.json({ message: `${assignment.nom} deleted` });
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
