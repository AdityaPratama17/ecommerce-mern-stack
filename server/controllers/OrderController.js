import Order from '../models/OrderModel.js'
import Product from '../models/ProductModel.js'

export const checkout = async(req, res) => {
  const id_user = req.params.id

  try {
    await Order.updateMany({
      id_user: id_user,
      status: 'cart'
    }, {
      status: 'pesan'
    })
    res.status(200).json({msg: 'Order berhasil dicheckout.'})
  } catch (error) {
    res.status(404).json({ message: error.message })
  }

}   

export const getOrder = async(req, res) => {
  Order.aggregate([
    // mencari data yang meliki status bukan 'cart'
    {
      $match: {
        status: {$nin: ['cart']}
      }
    },
    // ini digunakan untuk mengubah sementara struktur "id_product" menjadi ObjectId, agar "id_product" dapat dibandingkan dengan "_id" di collection products, begitu jg "id_user"
    {
      $set: {
        id_product: {
          $toObjectId: "$id_product"
        },
        id_user: {
          $toObjectId: "$id_user"
        } 
      }
    },
    // melakukan join antara collection orders dgn products berdasarkan id_product
    {
      $lookup: {
        from: 'products', // <collection to join>
        localField: 'id_product', // <field from the input documents>
        foreignField: '_id', // <field from the documents of the "from" collection>
        as: 'products' // <output array field>
      }
    },
    // melakukan join antara collection orders dgn users berdasarkan id_user
    {
      $lookup: {
        from: 'users', // <collection to join>
        localField: 'id_user', // <field from the input documents>
        foreignField: '_id', // <field from the documents of the "from" collection>
        as: 'users' // <output array field>
      }
    }
  ])
  .sort({created: -1}) // melakukan order by pada 'created' secara DESC
  .then((result) => {
    res.send(result)
  }).catch((err) => {
    res.status(409).send({
      message: err.message || "Some error while retrieving orders" // jika err.message tidak ada maka akan ditampilkan string di sebelahnya
    })
  })
}   

export const kirimOrder = async(req, res) => {
  const id_order = req.params.id_order
  const id_product = req.params.id_product

  const order = await Order.findOne({_id: id_order})
  const product = await Product.findOne({_id: id_product})
  const selisih = parseInt(product.stock) - parseInt(order.jumlah)
  if(selisih <= 0){
    res.status(400).json({msg: 'Jumlah product yang dipesan melebihi stock product. Silahkan tambahkan stock product atau tolak pesanan.'})
  } else {
    try {
      await Order.updateOne({_id: id_order}, {status: 'kirim'})
      await Product.updateOne({_id: id_product}, {stock: selisih})
      res.status(200).json({msg: 'Pesanan berhasil dikirim'})
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  }
}   

export const tolakOrder = async(req, res) => {
  const id_order = req.params.id

  try {
    await Order.updateOne({_id: id_order}, {status: 'tolak'})
    res.status(200).json({msg: 'Pesanan berhasil ditolak'})
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}   
