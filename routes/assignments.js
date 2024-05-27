let Assignment = require('../model/assignment');
let auteur = require('../model/auteur');
let matiere = require('../model/matiere');
const mongoose = require('mongoose');

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
    console.log("UPDATE received assignment : ");
    console.log(req.body);

    const updateFields = {
        nom: req.body.nom,
        dateDeRendu: req.body.dateDeRendu,
        note: req.body.note,
        remarques: req.body.remarques,
        rendu: req.body.note !== null && req.body.note !== 0 // Set rendu to true if note is not null and not 0
    };

    Assignment.findByIdAndUpdate(req.body._id, { $set: updateFields }, { new: true }, (err, assignment) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.json({ message: 'Assignment updated successfully!', assignment });
        }
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

// Get assignments where rendu is false
function getAssignmentsByRenduFalse(req, res) {
    Assignment.aggregate([
        {
            $match: {
                rendu: false
            }
        },
        // {
        //     $lookup: {
        //         from: 'auteurs',
        //         localField: 'auteur',
        //         foreignField: '_id',
        //         as: 'auteurs'
        //     }
        // },
        // {
        //     $lookup: {
        //         from: 'matieres',
        //         localField: 'matiere',
        //         foreignField: '_id',
        //         as: 'matieres'
        //     }
        // },
        // {
        //     $unwind: {
        //         path: '$auteurs',
        //         preserveNullAndEmptyArrays: true
        //     }
        // },
        // {
        //     $unwind: {
        //         path: '$matieres',
        //         preserveNullAndEmptyArrays: true
        //     }
        // }
    ]).exec((err, assignments) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(assignments);
    });
}

// Get assignments where rendu is true
function getAssignmentsByRenduTrue(req, res) {
    Assignment.aggregate([
        {
            $match: {
                rendu: true
            }
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
        }
    ]).exec((err, assignments) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(assignments);
    });
}



module.exports = {
    getAssignments,
    postAssignment,
    getAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentsByRenduFalse,
    getAssignmentsByRenduTrue
};