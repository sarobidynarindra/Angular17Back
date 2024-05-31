# AngularMBDSMadagascar2024

## Les membres du groupe : 
- **26 - RAKOTONARIVO Saholintsoa Ravaka**
- **46 - RATSARAEFADAHY Narindra Sarobidy**

## Installation

Pour que le projet fonctionne sur votre machine, suivez ces étapes :
- Clonez ce repository sur votre machine 
- lancer ces commandes dans un terminal autre que powershell:
    - **En angular :**
	    - npm install
	    - ng serve
    - **En node js :**
        - npm install
	    - npm run start

## Données de Test pour le login admin :
- email: admin@gmail.com 
- motdepasse: admin
 	
 	
## Voici les fonctionnalités que nous avons implémentées sur notre site :

- 🌟 Ajout du Toolbar et du Sidenav dans toutes les pages

- 🌟 Login administrateur avec JWT :
Les administrateurs peuvent se connecter en saisissant leur email et mot de passe. 
Seuls les administrateurs ont le privilège de modifier et supprimer des devoirs (assignments).

- 🌟 Ajout des auteurs : 
Cette fonctionnalité permet d'inclure le nom de l'élève ainsi que sa photo.
Upload des photos avec Cloudinary pour une gestion efficace des images des auteurs . 

- 🌟 Liste des auteurs avec pagination et suppression : 
Nous avons mis en place une liste des auteurs avec une fonction de pagination pour une navigation facilitée, ainsi qu'une option de suppression des auteurs.

- 🌟 Ajout des matières : 
Cette fonctionnalité permet d'inclure le nom et l'image de la matière, ainsi que le  nom du professeur  et l’upload des photos associées  .

- 🌟 Liste des matières avec pagination et suppression : 
 Une liste des matières a été ajoutée avec une pagination pour une gestion plus fluide, incluant également une fonction de suppression des matières.

- 🌟 Ajout des assignments avec formulaire de types Stepper :
 Nous avons introduit un formulaire de types Stepper pour créer des devoirs en spécifiant le nom, la date de remise, la sélection de la personne chargée de réaliser le devoir, ainsi que la matière concernée.

- 🌟 Edition des assignments avec formulaire de types Stepper

- 🌟 Optimisation de l'affichage des listes d'assignments sous forme de card et séparations des listes des assignments rendus et non rendus.

- 🌟 Fonctionnalité de drag and drop pour les assignments non rendus : 
Cette amélioration permet de déplacer les devoirs non rendus vers la section "Rendus", puis d'entrer la note et les remarques associées lorsque le devoir se trouve dans cette section.