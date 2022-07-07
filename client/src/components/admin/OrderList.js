import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useParams, useNavigate, Link} from 'react-router-dom'
import jwt_decode from "jwt-decode"
import { numberFormat } from '../../helpers'

function OrderList() {
  const [order, setOrder] = useState([])
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [msg, setMsg] = useState(false)

  useEffect(() => {
    getOrder()
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
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  const getOrder = async () => {
    try {
      const orders = await axiosJWT.get(`http://localhost:5000/api/order/`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setOrder(orders.data)
    } catch (error) {
      console.log(error);
    }
  }

  const kirimOrder = async (id_order, id_product) => {
    try {
      const response = await axiosJWT.get(`http://localhost:5000/api/order/kirim/${id_order}/${id_product}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setMsg({text: 'Pesanan berhasil dikirim', color: 'success'})
      getOrder()
    } catch (error) {
      setMsg({text: error.response.data.msg, color: 'danger'})
      getOrder()
    }
  }
  
  const tolakOrder = async (id_order) => {
    try {
      await axiosJWT.get(`http://localhost:5000/api/order/tolak/${id_order}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      getOrder()
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <div className="container my-3">
      {msg ? 
        <article className={`message is-${msg.color}`}>
          <div className="message-header">
            {msg.text}
          </div>
        </article>
      :
        ''
      }
      <div className="box">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Jumlah</th>
              <th>Total</th>
              <th>Pembeli</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {order.map((item, i) => (
              <tr key={item._id}>
                <th>{i+1}</th>
                <td>{item.products[0].title}</td>
                <td>{item.jumlah}</td>
                <td>{numberFormat(item.harga)}</td>
                <td>{item.users[0].name}</td>
                <td>
                  {item.status == 'pesan' ? 
                    <span className='tag is-warning'>Pesan</span>
                  :item.status == 'kirim' ?
                    <span className='tag is-success'>Terkirim</span>
                  :
                    <span className='tag is-danger'>Ditolak</span>
                  }
                </td>
                <td>
                    {item.status == 'pesan' ? 
                      <div className="buttons">
                        <button className="button is-small is-success" onClick={() => kirimOrder(item._id, item.id_product)}>Kirim</button>
                        <button className="button is-small is-danger" onClick={() => tolakOrder(item._id)}>Tolak</button>
                      </div>
                    :
                      <div className="buttons">
                        <button className="button is-small is-success" disabled>Kirim</button>
                        <button className="button is-small is-danger" disabled>Tolak</button>
                      </div>
                    }
                </td>
              </tr>

            ))}
          </tbody>
        </table>
        
      </div>
    </div>
  );
}

export default OrderList
