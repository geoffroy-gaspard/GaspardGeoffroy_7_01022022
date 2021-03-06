const Validator = require('fastest-validator');
const models = require('../models')


// Création de commentaire
function save(req, res) {
    const comment = {
        content: req.body.content,
        post_id: req.body.postId,
        user_id: req.decodedToken.userId
    }

    const schema = {
        content: {type: "string", optional: false, max: "500"}
    }

    const v = new Validator();
    const validationResponse = v.validate(comment, schema);

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
    }

    models.Post.findByPk(req.body.postId).then(post => {
        if(post === null){
            res.status(404).json({
                message: "Post not found"
            });
        }else{
            models.Comment.create(comment).then(result => {
                res.status(201).json({
                    message: "Comment created successfully",
                    comment: result
                });
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong",
                    error: error
                });
            });
        }

    }).catch(err => {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    });
}

// Récupération d'un commentaire unique
function show(req, res){
    const id = req.params.id;

    models.Comment.findByPk(id).then(result => {
        if(result){
            res.status(200).json(result);
        }else{
            res.status(404).json({
                message: "Comment not found!"
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        })
    });
}

// Récupération de tout les commentaires
function index(req, res){
    models.Comment.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
}

// Mise à jour d'un commentaire
function update(req, res){
    const id = req.params.id;
    const updatedComment = {
        content: req.body.content
    }

    const user_id = req.userData.id;

    const schema = {
        content: {type: "string", optional: false, max: "500"},
    }

    const v = new Validator();
    const validationResponse = v.validate(updatedComment, schema);

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
    }

    models.Comment.update(updatedComment, {where: {id:id, user_id: user_id}}).then(result => {
        res.status(200).json({
            message: "Comment updated successfully",
            post: updatedComment
        });
    }).catch(error => {
        res.status(200).json({
            message: "Something went wrong",
            error: error
        });
    })
}

// Suppression d'un commentaire
function destroy(req, res){
    const id = req.params.id;
    const user_id = req.userData.id;

    models.Comment.destroy({where:{id:id, user_id:user_id}}).then(result => {
        res.status(200).json({
            message: "Comment deleted successfully"
        });
    }).catch(error => {
        res.status(200).json({
            message: "Something went wrong",
            error: error
        });
    });
}

module.exports = {
    save: save,
    show: show,
    index: index,
    update: update,
    destroy: destroy
}