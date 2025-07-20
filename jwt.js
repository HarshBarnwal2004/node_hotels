const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    //first check if the request has an Authorization header
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ error: 'Token not found' });


    const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    }catch(err){
      console.error('JWT verification error:', err);
      res.status(401).json({ error: 'Invalid token' });
    }
}


const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: 30000}); // Token expires in 1 hour
}
module.exports = {jwtMiddleware, generateToken};