import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useParams, useNavigate, Link} from 'react-router-dom'
import jwt_decode from "jwt-decode"

function EditProduct() {
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("Baju")
  const [file, setFile] = useState("")
  const [preview, setPreview] = useState("")
  const navigate = useNavigate()
  const {id} = useParams()

  useEffect(() => {
    getProductById()
  },[])
  
  const loadImage = (e) => {
    const image = e.target.files[0]
    setFile(image)
    setPreview(URL.createObjectURL(image))
  }
    
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
  
  const getProductById = async () => {
    const product = await axiosJWT.get(`http://localhost:5000/api/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setTitle(product.data.title)
    setDescription(product.data.description)
    setPrice(product.data.price)
    setStock(product.data.stock)
    setCategory(product.data.category)
    setFile(product.data.image)
    setPreview(product.data.url)
  }
  
  const updateProduct = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('category', category)
    formData.append('image', file)
    try {
      await axiosJWT.patch(`http://localhost:5000/api/product/${id}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      })
      navigate("/product")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <div className="card">
          <div className="card-content">
            <div className="content">
              <form onSubmit={updateProduct}>
                <div className="field">
                  <label className="label">Name</label>
                  <div className="control">
                    <input type="text" className='input' placeholder='Product Name' value={title} onChange={(e) => setTitle(e.target.value)}/>
                  </div>
                </div>
                
                <div className="field">
                  <label className="label">Description</label>
                  <div className="control">
                    <textarea className="textarea" placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                  </div>
                </div>
                
                <div className="field">
                  <label className="label">Price</label>
                  <div className="control">
                    <input type="number" className='input' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)}/>
                  </div>
                </div>
                
                <div className="field">
                  <label className="label">Stock</label>
                  <div className="control">
                    <input type="number" className='input' placeholder='Stock' value={stock} onChange={(e) => setStock(e.target.value)}/>
                  </div>
                </div>
                
                <div className="field">
                  <label className="label">Category</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value='Baju'>Baju</option>
                        <option value='Jaket'>Jaket</option>
                        <option value='Topi'>Topi</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Image</label>
                  <div className="control">
                    <div className="file">
                      <label className="file-label">
                        <input type="file" className='file-input' onChange={loadImage}/>
                        <span className='file-cta'>
                          <span className="file-label">Choose a file...</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {preview ? (
                  <figure className='image is-128x128'>
                    <img src={preview} alt="Preview Image" />
                  </figure>
                ) : (
                  ""
                )}

                <div className="field is-grouped mt-3">
                  <div className="control">
                    <button type='submit' className="button is-link">Save</button>
                  </div>
                  <div className="control">
                    <Link to="/product" className="button is-link is-light">Cancel</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProduct