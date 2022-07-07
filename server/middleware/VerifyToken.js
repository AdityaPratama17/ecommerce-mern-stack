import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  // ambil access token
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // jika tidak ada access token 
  if (token == null){
    return res.sendStatus(401) // 401: Unauthorized 
  }
  
  // jika ada access token, lakukan verifikasi
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403) // 403: forbiden
    }

    req.email = decoded.email
    next()
  })
}