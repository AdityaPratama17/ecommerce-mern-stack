import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import jwt_decode from "jwt-decode"

function NavbarUser() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    refreshToken()
  }, [])

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/token/')
      const decoded = jwt_decode(response.data.accessToken)
      setName(decoded.name)
      if(decoded.role !== "user"){
        navigate("/product")
      }
    } catch (error) {
      if (error.response) {
        navigate("/login")
      }
    }
  }

  const Logout = async () => {
    try {
      await axios.delete('http://localhost:5000/api/logout/')
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
      <div className="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="https://bulma.io">
            <img src="https://bulma.io/images/bulma-logo-white.png" alt="Bulma: Free, open source, and modern CSS framework based on Flexbox" width="112" height="28"/>
          </a>

          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        
        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <Link to="/" class="navbar-item">
              Products
            </Link>
            <Link to="/cart" class="navbar-item">
              Cart
            </Link>
          </div>

          <div class="navbar-end">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                {name} 
              </a>
              <div class="navbar-dropdown">
                <a href='#' onClick={Logout} class="navbar-item">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavbarUser