import Product from '../models/ProductModel.js'
import path from 'path'
import fs from 'fs'

// fetch all product
export const fetchAllProduct = async(req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json(products)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}  

// fetch product by id
export const fetchProductById = async(req, res) => {
  const id = req.params.id
  try {
    const product = await Product.findById(id)
    res.status(200).json(product)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}  

// create product
export const createProduct = async(req, res) => {
  // get data
  const title = req.body.title
  const description = req.body.description
  const price = req.body.price
  const stock = req.body.stock
  const category = req.body.category
  
  // jika tidak ada file yang diupload
  if(req.files === null){
    return res.status(400).json({msg: "No File Uploaded"})
  }

  // get image file
  const file = req.files.image
  const fileSize = file.data.length
  const ext = path.extname(file.name)
  const fileName = file.md5 + ext
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

  // validation image file
  const allowedType = ['.png','.jpg','.jpeg']
  if(!allowedType.includes(ext.toLocaleLowerCase())){
    return res.status(422).json({msg: "Invalid image"})
  }
  if(fileSize > 5000000){
    return res.status(422).json({msg: "Image must be less than 5 MB"})
  }

  // insert data
  file.mv(`./public/images/${fileName}`, async(err) => {
    if(err){
      return res.status(500).json({msg: err.message})
    }

    try {
      await Product.create({
        title: title,
        description: description,
        price: price,
        stock: stock,
        category: category,
        image: fileName,
        url: url
      })
      res.status(201).json({msg: "Product created successfully"})
    } catch (error) {
      console.log(error.message)
    }
  })

}  

// update product 
export const updateProduct = async(req, res) => {
  // cek apakah data product ada
  const product = await Product.findById(req.params.id)
  if(!product){
    return res.status(404).json({msg: "No data found."})
  }

  let fileName = ''
  if (req.files === null) {
    fileName = product.image
  } else {
    // get image file name
    const file = req.files.image
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    fileName = file.md5 + ext

    // validation image file
    const allowedType = ['.png','.jpg','.jpeg']
    if(!allowedType.includes(ext.toLocaleLowerCase())){
      return res.status(422).json({msg: "Invalid image"})
    }
    if(fileSize > 5000000){
      return res.status(422).json({msg: "Image must be less than 5 MB"})
    }

    // delete old image file
    const filepath = `./public/images/${product.image}`
    fs.unlinkSync(filepath)

    // insert new image file
    file.mv(`./public/images/${fileName}`, async(err) => {
      if(err){
        return res.status(500).json({msg: err.message})
      }
    })
  }

  const title = req.body.title
  const description = req.body.description
  const price = req.body.price
  const stock = req.body.stock
  const category = req.body.category
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

  try {
    await Product.updateOne({id: req.params.id}, {
      title: title,
      description: description,
      price: price,
      stock: stock,
      category: category,
      image: fileName,
      url: url
    })
    res.status(201).json({msg: "Product updated successfully"})
  } catch (error) {
    console.log(error.message)
  }
}  

// delete product
export const deleteProduct = async(req, res) => {
  const product = await Product.findById(req.params.id)
  if(!product){
    return res.status(404).json({msg: "No data found."})
  }

  try {
    const filepath = `./public/images/${product.image}`
    fs.unlinkSync(filepath) //hapus gambar di public/images
    await Product.deleteOne({id: req.params.id}) // hapus data di db
    res.status(200).json({msg: "Product deleted successfully."})
  } catch (error) {
    console.log(error.message);
  }
}  