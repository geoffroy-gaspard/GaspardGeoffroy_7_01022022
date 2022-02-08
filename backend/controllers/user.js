const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Validator = require('fastest-validator');
const models = require('../models');
const utils = require('../utils/jwtUtils');

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

function login(req, res) {
    models.User.findOne({where:{email: req.body.email}}).then(user => {
        if(user === null) {
            res.status(401).json({
                message: "Informations de connexion incorrectes !",
            })
        }else{
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user.id
                    }, process.env.DB_TOKEN, function(err, token){
                        res.status(200).json({
                            message: "Authentication successful!",
                            token: token
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

function userInfos (req, res) {
    const id = utils.getUserId(req.headers.authorization);
    models.User.findOne({
        attributes: ['first_name','last_name', 'email'],
        where: { id: id }
    })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json(error))
};

module.exports = {
    signUp: signUp,
    login: login,
    userInfos: userInfos
}