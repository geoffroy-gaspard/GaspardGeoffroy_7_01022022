const Validator = require('fastest-validator');
const models = require('../models')
const asyncLib = require('async');

const DISLIKED = 0;
const LIKED    = 1;

    function like (req, res) {

    let user_id = req.decodedToken.userId

    // Params
    let post_id = parseInt(req.params.post_id);

    if (post_id <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.Post.findOne({
          where: { id: post_id }
        })
        .then(function(postFound) {
          done(null, postFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify post' });
        });
      },
      function(postFound, done) {
        if(postFound) {
          models.User.findOne({
            where: { id: user_id }
          })
          .then(function(userFound) {
            done(null, postFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        } else {
          res.status(404).json({ 'error': 'post already liked' });
        }
      },
      function(postFound, userFound, done) {
        if(userFound) {
          models.Like.findOne({
            where: {
              user_id: user_id,
              post_id: post_id
            }
          })
          .then(function(userAlreadyLikedFound) {
            done(null, postFound, userFound, userAlreadyLikedFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify if user already liked' });
          });
        } else {
          res.status(404).json({ 'error': 'user does not exist' });
        }
      },
      function(postFound, userFound, userAlreadyLikedFound, done) {
        if(!userAlreadyLikedFound) {
          postFound.addUser(userFound, { isLiked: LIKED })
          .then(function (alreadyLikedFound) {
            done(null, postFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to set user reaction' });
          });
        } else {
          if (userAlreadyLikedFound.isLiked === DISLIKED) {
            userAlreadyLikedFound.update({
              isLiked: LIKED,
            }).then(function() {
              done(null, postFound, userFound);
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot update user reaction' });
            });
          } else {
            res.status(409).json({ 'error': 'message already liked' });
          }
        }
      },
      function(postFound, userFound, done) {
        postFound.update({
          likes: postFound.likes + 1,
        }).then(function() {
          done(postFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update message like counter' });
        });
      },
    ], function(postFound) {
      if (postFound) {
        return res.status(201).json(postFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update message' });
      }
    });
  }





  function dislike (req, res) {

    let user_id = req.decodedToken.userId

    // Params
    let post_id = parseInt(req.params.post_id);

    if (post_id <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      function(done) {
         models.Post.findOne({
           where: { id: post_id }
         })
         .then(function(postFound) {
           done(null, postFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify post' });
         });
       },
       function(postFound, done) {
         if(postFound) {
           models.User.findOne({
             where: { id: user_id }
           })
           .then(function(userFound) {
             done(null, postFound, userFound);
           })
           .catch(function(err) {
             return res.status(500).json({ 'error': 'unable to verify user' });
           });
         } else {
           res.status(404).json({ 'error': 'post already disliked' });
         }
       },
       function(postFound, userFound, done) {
         if(userFound) {
           models.Like.findOne({
             where: {
               user_id: user_id,
               post_id: post_id
             }
           })
           .then(function(userAlreadyLikedFound) {
              done(null, postFound, userFound, userAlreadyLikedFound);
           })
           .catch(function(err) {
             return res.status(500).json({ 'error': 'unable to verify is user already disliked' });
           });
         } else {
           res.status(404).json({ 'error': 'user does not exist' });
         }
       },
       function(postFound, userFound, userAlreadyLikedFound, done) {
        if(!userAlreadyLikedFound) {
          postFound.addUser(userFound, { isLiked: DISLIKED })
          .then(function (alreadyLikedFound) {
            done(null, postFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to set user reaction' });
          });
        } else {
          if (userAlreadyLikedFound.isLiked === LIKED) {
            userAlreadyLikedFound.update({
              isLiked: DISLIKED,
            }).then(function() {
              done(null, postFound, userFound);
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot update user reaction' });
            });
          } else {
            res.status(409).json({ 'error': 'post already disliked' });
          }
        }
       },
       function(postFound, userFound, done) {
        postFound.update({
           likes: postFound.likes - 1,
         }).then(function() {
           done(postFound);
         }).catch(function(err) {
           res.status(500).json({ 'error': 'cannot update post like counter' });
         });
       },
     ], function(postFound) {
       if (postFound) {
         return res.status(201).json(postFound);
       } else {
         return res.status(500).json({ 'error': 'cannot update message' });
       }
     });
  }

  function index(req, res){
    models.Like.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
}

module.exports = {
    like: like,
    dislike: dislike,
    index: index
}