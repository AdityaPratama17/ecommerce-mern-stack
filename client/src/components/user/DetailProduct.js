import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useParams, useNavigate, Link} from 'react-router-dom'
import jwt_decode from "jwt-decode"
import { numberFormat } from '../../helpers'

function DetailProduct() {
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [product, setProduct] = useState({})
  const [id_user, setIdUser] = useState('')
  const [msg, setMsg] = useState(false)
  const {id} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getProductById()
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
      setIdUser(decoded.userId)
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  const getProductById = async () => {
    const product = await axiosJWT.get(`http://localhost:5000/api/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setProduct(product.data)
  }

  const addCart = async () => {
    try {
      await axiosJWT.post(`http://localhost:5000/api/cart/`, {
        id_user: id_user,
        id_product: id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setMsg(true)
      navigate(`/product/${id}`)
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="container mt-4">
      <div className='columns mt-3'>
        <div className="column is-4">
          <img src={product.url} className='shadow' width="100%" />
        </div>
        <div className="column is-7">
          {msg ? 
            <article className="message is-primary">
              <div className="message-header">
                Product berhasil ditambahkan ke cart.
              </div>
            </article>
          :
            ''
          }
          <p className='has-text-centered'>{msg}</p>
          <h1 className='title'>{product.title}</h1>
          <div className="column">
          <table class="table is-striped">
            <tbody>
              <tr>
                <td>Price : {numberFormat(product.price)}</td>
              </tr>
              <tr>
                <td>Category : {product.category}</td>
              </tr>
              <tr>
                <td>Stock : {product.stock}</td>
              </tr>
              <tr>
                <td>{product.description}</td>
              </tr>
            </tbody>
          </table>
          </div>
          <div className="buttons">
            <Link to='/' class="button is-primary is-light">Back</Link>
            <button class="button is-primary" onClick={()=>addCart()}>add to cart</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DetailProduct