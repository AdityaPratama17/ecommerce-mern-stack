import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const Auth = async(e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/login/', {
        email: email,
        password: password,
      })
      if(res.data.role === 'admin'){
        navigate("/product")
      }else{
        navigate("/")
      }
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg)
      }
    }
  }

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
              <form className='box' onSubmit={ Auth }>
              <p className='has-text-centered'>{msg}</p>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="controls">
                    <input type="text" className="input" placeholder='Email'  value={email} onChange={(e) => setEmail(e.target.value)} autoFocus/>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="controls">
                    <input type="password" className="input" placeholder='******' value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <button type='submit' className="button is-success is-fullwidth">Login</button>
                  <p className='has-text-centered mt-4 subtitle is-6'>- Or Register -</p>
                  <Link to='/register' className="button is-primary is-fullwidth">Register</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login