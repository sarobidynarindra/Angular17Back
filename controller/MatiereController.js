const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const multer = require('multer');
const Matiere = require('../model/matiere');
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

// Route POST pour créer une matière
router.post('/createMatiere', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'imageProf', maxCount: 1 }]), async (req, res) => {
    try {
        const imageResult = await streamUpload(req.files.image[0]); // Upload de l'image
        const imageProfResult = await streamUpload(req.files.imageProf[0]); // Upload de l'imageProf

        // Création de la matière avec les URLs des images
        const newMatiere = new Matiere({
            nom: req.body.nom,
            image: imageResult.url,
            nomProf: req.body.nomProf,
            imageProf: imageProfResult.url
        });

        // Insertion de la matière dans la base de données
        const insertedMatiere = await newMatiere.save();
        res.status(201).json(insertedMatiere);

    } catch (error) {
        console.error('Erreur lors de la création de la matière : ', error);
        res.status(500).json({ error: 'Erreur lors de la création de la matière' });
    }
});

router.get('/getAllMatiere', async (req, res) => {
    let aggregateQuery = Matiere.aggregate();

    Matiere.aggregatePaginate(
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
module.exports = router;
