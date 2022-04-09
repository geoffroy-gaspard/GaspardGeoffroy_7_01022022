const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Validator = require('fastest-validator');
const models = require('../models');


// Fonction de création de compte
function signUp(req, res) {

    models.User.findOne({where:{email:req.body.email}}).then(result => {
        if(result){
            res.status(409).json({
                message: "Cet email a déjà été enregistré",
            });
        }else{
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(req.body.password, salt, function(err, hash) {
        
                    const user = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        password: hash
                    }

                    const schema = {
                        first_name: { type:'string', optional: false, max: '100'},
                        last_name: { type:'string', optional: false, max: '100'},
                        email: { type:'string', optional:false, max:'255', min:'6'},
                        password: { type:'string', optional:false, max:'100'}
                    }
                
                    const v = new Validator();
                    const validationResponse = v.validate(user, schema);
                
                    if(validationResponse !== true || (req.body.first_name == null || req.body.last_name == null || req.body.email == null)) {
                        return res.status(400).json({
                            message: 'La validation a échoué',
                            errors: validationResponse
                        });
                    }
                
                    models.User.create(user).then(result => {
                        res.status(201).json({
                            message: "Compte créé avec succès",
                            post: result
                        });
                    }).catch(error => {
                        res.status(500).json({
                            message: "Quelque chose s'est mal passé...",
                            error: error
                        });
                    });
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Quelque chose s'est mal passé...",
        })
    })
}


// Fonction de login
function login(req, res) {
    models.User.findOne({where:{email: req.body.email}}).then(user => {
        if(user === null) {
            res.status(401).json({
                message: "Informations de connexion incorrectes !",
            })
        }else{
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(result) {
                    const token = jwt.sign(
                        { userId: user.id },
                        process.env.DB_TOKEN,
                        { expiresIn: '24h' }, function(err, token){
                        res.status(200).json({
                            message: "Authentication successful!",
                            token: token,
                            infos : {
                                id: user.id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                email: user.email
                            }
                        });
                    });
                }else{
                    res.status(401).json({
                        message: "Informations de connexion incorrectes !",
                    })
                }
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Quelque chose s'est mal passé...",
        })
    });
}

// Récupération du statut d'admin d'un utilisateur
function userInfos (req, res) {
    models.User.findOne({ where: { id: req.params.id }})
        .then(user => res.status(200).json(user.isAdmin))
        .catch(error => res.status(500).json(error))
};


// Liste des utilisateurs
function allAccounts (req, res){
    models.User.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: 'Un problème est survenue'
        });
    });
}

// Suppression d'un compte
function deleteAccount (req, res) {
    const user_id = req.decodedToken.userId;
    models.User.findOne({ where: { id: user_id}})
        .then((user) => {
            models.Like.destroy({where: {user_id: user_id}})

            models.Comment.destroy({where: {user_id:user_id}})

            models.Post.destroy({where: {user_id:user_id}})

            models.User.destroy({ where: { id: user_id}})
            .then(() => res.status(200).json({ message: 'compte supprimé avec succès' }))
            .catch (error => res.status(400).json({error}))        
        })
        .catch(error => {
            res.status(500).json({
                message: 'Un problème est survenue',
                error: error
        });
    })
}

// Mise à jour d'un compte
function update  (req, res) { 
    const user_id = req.decodedToken.userId;
    const updatedUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    }
    const schema = {
        first_name: { type:'string', optional: false, max: '100'},
        last_name: { type:'string', optional: false, max: '100'},
        email: { type:'string', optional:false, max:'255', min:'6'}
    }
    const v = new Validator();
    const validationResponse = v.validate(updatedUser, schema);

    if(validationResponse !== true || (req.body.first_name == null && req.body.last_name == null && req.body.email == null)) {
        return res.status(400).json({
            message: 'La validation a échoué',
            errors: validationResponse
        });
    }

    models.User.findOne({where:{email:req.body.email}}).then(result => {
        if(result){
        res.status(409).json({
            message: "Cet email a déjà été enregistré",
        });
    }else{
        models.User.findOne({ where: { id: user_id }})
            .then(() => {
                models.User.update(updatedUser, { where: { id: user_id }})         
            .then(() => res.status(201).json({ message: 'Compte mis à jour avec succès',
            user: updatedUser }))
            .catch(error => res.status(500).json({ message: 'Un problème est survenu',
            error: error }));
            })
    }})
};

module.exports = {
    signUp: signUp,
    login: login,
    userInfos: userInfos,
    allAccounts: allAccounts,
    deleteAccount: deleteAccount,
    update: update
}