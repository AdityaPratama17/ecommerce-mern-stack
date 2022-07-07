import Order from '../models/OrderModel.js'
import Product from '../models/ProductModel.js'

export const getCart = async(req, res) => {
  const id_user = req.params.id

  Order.aggregate([
    // ini digunakan untuk mencari data2 yg memiliki id_user == id_user
    {
      $match: {
        id_user: id_user,
        status: 'cart'
      }
    },
    // ini digunakan untuk mengubah sementara struktur "id_product" menjadi ObjectId, agar "id_product" dapat dibandingkan dengan "_id" di collection products 
    {
      $set: {
        id_product: {
          $toObjectId: "$id_product"
        } 
      }
    },
    // ini digunakan untuk melakukan join antara collection "orders" dgn "products"
    {
      $lookup: {
        from: 'products', // <collection to join>
        localField: 'id_product', // <field from the input documents>
        foreignField: '_id', // <field from the documents of the "from" collection>
        as: 'products' // <output array field>
      }
    }
  ])
  .then((result) => {
    res.send(result)
  }).catch((err) => {
    res.status(409).send({
      message: err.message || "Some error while retrieving orders" // jika err.message tidak ada maka akan ditampilkan string di sebelahnya
    })
  })

}   

export const getTotalHarga = async(req, res) => {
  const id_user = req.params.id

  Order.aggregate([
    // ini digunakan untuk mencari data2 yg memiliki id_user == id_user
    {
      $match: {
        id_user: id_user,
        status: 'cart'
      }
    },
    // ini digunakan untuk mencari hasil sum dari field harga
    { 
      $group: { 
        _id : null, 
        sum : { $sum: "$harga" } 
      }
    }
  ])
  .then((result) => {
    res.send(result)
  }).catch((err) => {
    res.status(409).send({
      message: err.message || "Some error while retrieving orders" // jika err.message tidak ada maka akan ditampilkan string di sebelahnya
    })
  })

}   

export const addCart = async(req, res) => {
  // get data
  const id_product = req.body.id_product
  const id_user = req.body.id_user

  const product = await Product.findOne({_id: id_product})

  const order = await Order.findOne({
    id_product: id_product,
    id_user: id_user,
    status: 'cart',
  })

  if(order){
    try {
      await Order.updateOne({_id: order._id}, {
        jumlah: order.jumlah + 1,
        harga: parseInt(order.harga) + parseInt(product.price) 
      })
      res.status(200).json({msg: 'Order berhasil ditambahkan.'})
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  } else {
    try {
      await Order.create({
        id_product: id_product,
        id_user: id_user,
        jumlah: 1,
        harga: product.price,
        status: 'cart',
      })
      res.status(200).json({msg: 'Order berhasil ditambahkan.'})
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  }
}

export const editCart = async(req, res) => {
  const id = req.params.id
  const jumlah = req.body.jumlah

  const order = await Order.findOne({_id: id})
  const harga = (parseInt(order.harga) / parseInt(order.jumlah)) * parseInt(jumlah)

  try {
    await Order.updateOne({_id: id}, {
      jumlah: jumlah,
      harga: parseInt(harga)
    })
    res.status(200).json({msg: 'Order berhasil diubah.'})
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const deleteCart = async(req, res) => {
  const id = req.params.id
  try {
    await Order.deleteOne({_id: id})
    res.status(200).json({msg: 'Order berhasil dihapus.'})
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const test = async(req, res) => {
  const id = req.params.id

  const order = await Order.findOne({_id: id})
  const harga = (parseInt(order.harga) / parseInt(order.jumlah)) * parseInt(jumlah)
  res.status(200).json({msg: 'Order berhasil diubah.'})

}