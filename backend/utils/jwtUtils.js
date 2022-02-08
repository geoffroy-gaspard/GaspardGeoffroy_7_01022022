const jwt = require('jsonwebtoken')

module.exports = {
  tokenSign : process.env.DB_TOKEN,
  generateToken: function (user) {
    return jwt.sign({
      userId: user.id,
    },
      this.tokenSign,
      {
        expiresIn: '24h'
      })
  },
  getUserId: function (data) {
    if (data) {
      try {
        const token = data.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.DB_TOKEN)
        userId = decodedToken.user.id
        return userId
      }
      catch (err) {
        return err
      }
    };
  }
}