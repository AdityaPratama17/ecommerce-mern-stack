import React, {useState, useEffect} from 'react'
import axios from 'axios'
import jwt_decode from "jwt-decode"
import { numberFormat } from '../../helpers'

function Cart() {
  const [cart, setCart] = useState([])
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [alamat, setAlamat] = useState('')
  const [total, setTotal] = useState('')
  const [id_user, setIdUser] = useState('')

  useEffect(() => {
    getCart()
  },[])

  const axiosJWT = axios.create()
  axiosJWT.interceptors.request.use(async(config) => {
    const currentDate = new Date()
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:5000/api/token/')
      config.headers.Authorization = `Bearer ${response.data.accessToken}`
      setToken(response.data.accessToken)
      const decoded = jwt_decode(response.data.accessToken)
      setExpire(decoded.exp)
      setAlamat(decoded.alamat)
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  const getCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/token/')
      const decoded = await jwt_decode(response.data.accessToken)
      const carts = await axiosJWT.get(`http://localhost:5000/api/cart/${decoded.userId}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCart(carts.data)
      setIdUser(decoded.userId)
      getTotalHarga(decoded.userId)
    } catch (error) {
      console.log(error);
    }
  }
  
  const getTotalHarga = async (id) => {
    try {
      const total = await axiosJWT.get(`http://localhost:5000/api/cart/total-harga/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(total.data.length !== 0) setTotal(total.data[0].sum)
    } catch (error) {
      console.log(error);
    }
  }

  const editJumlah = async (id, jumlah) => {
    if (jumlah == 0) {
      deleteCart(id)
    } else {
      try {
        await axiosJWT.patch(`http://localhost:5000/api/cart/${id}`, {
          jumlah: jumlah
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        getCart()
      } catch (error) {
        console.log(error);
      }
    }
  }
  
  const deleteCart = async (id) => {
    try {
      await axiosJWT.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      getCart()
    } catch (error) {
      console.log(error);
    }
  }

  const checkout = async () => {
    try {
      const carts = await axiosJWT.get(`http://localhost:5000/api/checkout/${id_user}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      getCart()
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mt-4">
      {cart.map((item) => (
        <div className="box" key={item._id}>
          <div className="columns is-vcentered">
            {/* <div className="column is-1 has-text-centered">
              <input type="checkbox"></input>
            </div> */}
            <div className="column is-10">
              <div className="columns ml-4">
                <div className="column is-2">
                  <img src={item.products[0].url} alt="Image" width='80%'/>
                </div>
                <div className="column is-8">
                  <h1 className='title is-4'>{item.products[0].title}</h1>
                  <p className='subtitle is-6'>
                    Subtotal: <strong>{numberFormat(item.harga)}</strong> <br />
                    <span className='tag is-primary mt-1'>jumlah: {item.jumlah}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="column is-2 has-text-centered ">
              <p className="buttons">
                <button className="button" onClick={() => editJumlah(item._id, item.jumlah+1)}>
                  <span className="icon is-small">
                    <i className="fas fa-plus"></i>
                  </span>
                </button>
                <button className="button" onClick={() => editJumlah(item._id, item.jumlah-1)}>
                  <span className="icon is-small">
                    <i className="fas fa-minus"></i>
                  </span>
                </button>
                <button className="button" onClick={() => deleteCart(item._id)}>
                  <span className="icon is-small">
                    <i className="fas fa-trash"></i>
                  </span>
                </button>
              </p>
            </div>
          </div>
        </div>
      ))}

      {cart.length == 0 ?
        <h1 className='title is-4 has-text-centered mt-5'>Cart kosong.</h1> 
      :
        <div>
          <h1 className='title is-4 mt-2'>Total: {numberFormat(total)}</h1>
          <p className='subtitle is-6'>Alamat: {alamat}</p>
          <button className="button is-primary is-fullwidth" onClick={() => checkout()}>Checkout</button>
        </div>
      }
    </div>
  )
}

export default Cart