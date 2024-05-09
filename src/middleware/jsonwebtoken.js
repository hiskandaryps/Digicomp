const jwt = require('jsonwebtoken');

function generateAccessToken(username) {
  const payload = { username };
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '12h' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    //console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

module.exports = { generateAccessToken, authenticateToken };