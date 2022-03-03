const jwt = require('jsonwebtoken');

function auth(req, res, next){
  try{
      const token = req.headers.authorization.split(' ')[1]; 
      const decodedToken = jwt.verify(token, process.env.DB_TOKEN);
      const userId = decodedToken.userId
      console.log(userId)
      req.decodedToken = decodedToken;
      next();
    }catch(e){
        return res.status(401).json({
            'message': "Invalid or expired token provided!",
            'error':e
        });
    }
}

module.exports = {
    auth: auth
}