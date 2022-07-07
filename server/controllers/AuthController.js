import User from "../models/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const getUsers = async(req, res) => {
  try {
    const users = await User.find({}, {
      _id: 1, 
      name: 1,
      email: 1
    })
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
  }
}

export const Register = async(req, res) => {
  // ambil data yg dikirim user
  const { name, email, password, confPassword, alamat, role } = req.body
  
  // cek apakah password dan confPassword sama?
  if (password !== confPassword) {
    return res.status(400).json({msg: "Password dan Confirm Password tidak sama!"})
  }

  // cek apakah email sudh digunakan
  const user = await User.findOne({email: email})
  if(user){
    return res.status(400).json({msg: "Email has been used."})
  }

  // lakukan enkripsi password
  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)

  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      alamat: alamat,
      role: role
    })
    res.json({msg: "Register berhasil"})
  } catch (error) {
    console.log(error)
  }
}

export const Login = async(req, res) => {
  try {
    // ambil data users berdasarkan email 
    const user = await User.findOne({email: req.body.email})

    // lakukan pengecekan password
    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
      return res.status(400).json({msg: "Wrong Password!"})
    }

    // ambil data user
    const userId = user._id
    const name = user.name
    const email = user.email

    const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20s'
    })
    const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    })

    // masukan refresh token ke db
    await User.updateOne({_id: userId},{refresh_token: refreshToken})

    // buat http only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // agar cookie tidak dapat diakses dari client
      maxAge: 24*60*60*1000, // masa expired cookie di client
      // secure: true // jika menggunakan server https / sudah di deploy (?) 
    })
    res.json({ accessToken, role: user.role })

  } catch (error) {
    res.status(404).json({msg: "Email tidak ditemukan"})
  }
}

export const refreshToken = async(req,res) => {
  try {
    // ambil refresh token dari cookie
    const refreshToken = req.cookies.refreshToken

    // jika refresh token tidak ada
    if (!refreshToken) {
      return res.sendStatus(401) // 401: Unauthorized 
    }

    // jika ada refresh token, maka lakukan pencarian user berdasarkan refresh token
    const user = await User.findOne({refresh_token: refreshToken})

    // jika tidak ada user yg cocok dengan refresh token
    if (!user) {
      return res.sendStatus(403) // 403: Forbidden 
    }

    // jika ada, maka generate access token berdasarkan refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403) //403: Forbidden
      }

      const userId = user.id
      const name = user.name
      const email = user.email
      const alamat = user.alamat
      const role = user.role

      // generate access token
      const accessToken = jwt.sign({userId, name, email, alamat, role}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20s'
      })

      // kirim access token ke client
      res.json({ accessToken })
    })
  } catch (error) {
    console.log(error)
  }
}

export const Logout = async(req, res) => {
  // ambil refresh token dari cookie
  const refreshToken = req.cookies.refreshToken

  // jika refresh token tidak ada
  if (!refreshToken) {
    return res.sendStatus(204) // 204: No Content 
  }

  // jika ada refresh token, maka lakukan pencarian user berdasarkan refresh token
  const user = await User.findOne({refresh_token: refreshToken})

  // jika tidak ada user yg cocok dengan refresh token
  if (!user) {
    return res.sendStatus(204) // 204: No Content 
  }

  // jika ada user yang cocok, ambil id
  const userId = user._id

  // update refresh token menjadi null
  await User.updateOne({_id: userId},{refresh_token: null})

  // hapus cookie
  res.clearCookie('refreshToken')
  return res.sendStatus(200)
}