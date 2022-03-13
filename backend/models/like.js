'use strict';
module.exports = (sequelize, DataTypes) => {
  let Like = sequelize.define('Like', {
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    isLiked: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    // associations can be defined here

    models.User.belongsToMany(models.Post, {
      through: models.Like,
      foreignKey: 'user_id',
      otherKey: 'post_id',
    });

    models.Post.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'post_id',
      otherKey: 'user_id',
    });

    models.Like.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    models.Like.belongsTo(models.Post, {
      foreignKey: 'post_id',
      as: 'post',
    });
  };
  return Like;
};