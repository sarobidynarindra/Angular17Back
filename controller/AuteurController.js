const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const multer = require('multer');
const Auteur = require('../model/auteur');
const express = require('express');

// Create a new router instance
const router = express.Router();

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: 'doqw2jsg3',
    api_key: '472566731662461',
    api_secret: 'nGIW9NMQwDsXwQDI42nQ9aNjekk',
    secure: true
});

// Configuration de Multer pour le stockage en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Fonction pour uploader un fichier vers Cloudinary
let streamUpload = (file) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

// Route POST pour créer une auteur
router.post('/createAuteur', upload.fields([{ name: 'photo', maxCount: 1 }]), async (req, res) => {
    try {
        const photoResult = await streamUpload(req.files.photo[0]); 

        const newAuteur = new Auteur({
            nom: req.body.nom,
            photo: photoResult.url
        });

        const insertionAuteur = await newAuteur.save();
        res.status(201).json(insertionAuteur);

    } catch (error) {
        console.error('Erreur lors de la création Auteur : ', error);
        res.status(500).json({ error: 'Erreur lors de la création Auteur' });
    }
});
router.get('/getAllAuteur', async (req, res) => {
    let aggregateQuery = Auteur.aggregate();

    Auteur.aggregatePaginate(
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
});
router.delete('/deleteAuteur/:id', async (req, res) => {

    Auteur.findByIdAndRemove(req.params.id, (err, auteur) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${auteur.nom} deleted`});
    })
});
module.exports = router;