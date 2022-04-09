const Validator = require('fastest-validator');
const models = require('../models');

// Création d'un nouveau post
function save (req, res) {
    const post = {
        user_id: req.decodedToken.userId,
        title: req.body.title,
        content: req.body.content,
        attachment: req.body.image_url,
        likes: 0
    }

    const schema = {
        title: { type:'string', optional: false, max: '100'},
        content: { type:'string', optional:true, max:'500'},
        attachment: { type:'string', optional:true, max:'500'}
    }

    const v = new Validator();
    const validationResponse = v.validate(post, schema);

    if(validationResponse !== true || (req.body.content == null && req.body.image_url == null)) {
        return res.status(400).json({
            message: 'La validation a échoué',
            errors: validationResponse
        });
    }

    models.Post.create(post).then(result => {
        res.status(201).json({
            message: 'Post créé avec succès',
            post: result
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Un problème est survenue',
            error: error
        });
    });
}

// Récupération d'un post unique
function show (req, res) {
    const id = req.params.id;

    models.Post.findByPk(id).then(result => {
        if(result){
            res.status(200).json(result);
        }else{
            res.status(404).json({
                message: 'Nous ne trouvons pas le post que vous cherchez !'
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Un problème est survenue'
        });
    });
}

// Récupération de tout les posts
function index (req, res){
    models.Post.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: 'Un problème est survenue'
        });
    });
}

// Mise à jour d'un post
function update (req, res){
    const id = req.params.id;
    const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        attachment: req.body.image_url
    }

    const user_id = req.decodedToken.userId;

    const schema = {
        title: { type:'string', optional: false, max: '100'},
        content: { type:'string', optional:true, max:'500'},
        attachment: { type:'string', optional:true, max:'500'}
    }

    const v = new Validator();
    const validationResponse = v.validate(updatedPost, schema);

    if(validationResponse !== true || (req.body.content == null && req.body.image_url == null)) {
        return res.status(400).json({
            message: 'La validation a échoué',
            errors: validationResponse
        });
    }

    models.Post.update(updatedPost, {where: {id:id, user_id:user_id}}).then(result => {
        res.status(200).json({
            message: 'post mis à jour avec succès',
            post: updatedPost
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Un problème est survenue',
            error: error
        });
    })
}



// Suppression d'un post
function destroy(req, res){
    const id = req.params.id;
    models.Like.destroy({where: {post_id:id}})

    models.Comment.destroy({where: {post_id:id}})

    models.Post.destroy({where: {id:id}}).then(result => {
        res.status(200).json({
            message: 'post supprimé avec succès'
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Un problème est survenue',
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