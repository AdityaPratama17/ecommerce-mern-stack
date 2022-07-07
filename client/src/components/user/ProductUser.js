import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import jwt_decode from "jwt-decode"
import { numberFormat } from '../../helpers'

const ProductUser = () => {
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [products, setProducts] = useState([])

  useEffect(()=>{
    getProducts()
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

  const getProducts = async () => {
    const response = await axiosJWT.get("http://localhost:5000/api/product/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setProducts(response.data)
  }

  return (
    <div className="container mt-5">
      <div className="columns is-multiline mt-3">
        {products.map((product) => (
          <div className="column is-one-quarter mr-3" key={product._id}>
            <div className="card">
              <div className="card-image">
                <figure className="image is-4by3">
                  <img src={product.url} alt="Placeholder image"/>
                </figure>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{product.title}</p>
                    <p className="subtitle is-6">{numberFormat(product.price)}</p>
                  </div>
                </div>
              </div>
              <footer className="card-footer">
                <Link to={`/product/${product._id}`} className="card-footer-item">Beli</Link>
              </footer>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductUser