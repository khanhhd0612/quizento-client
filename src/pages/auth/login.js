import "./../../assets/css/auth.css"
import { Link } from "react-router-dom"
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import nProgress from 'nprogress'
import api from "../../config/axiosConfig"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorLogin, setErrorLogin] = useState('')
    const [successLogin, setSuccessLogin] = useState('')
    const [isDisabled, setIsDisabled] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsDisabled(true)

        nProgress.start()
        try {
            const response = await api.post(`/auth/login`, { email, password })
            if (response.data.message) {
                setEmail('')
                setPassword('')
                setErrorLogin('')
                Cookies.set('token', response.data.token, { expires: 7 })
                setSuccessLogin(response.data.message)
                window.location = "/"
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorLogin(error.response.data.message)
                setSuccessLogin("")
            }
        } finally {
            nProgress.done()
            setIsDisabled(false)
        }
    }
    return (
        <div>
            <div className="content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 d-none d-lg-block">
                            <img src="/assets/images/undraw_remotely_2j6y.svg" alt="Image" className="img-fluid" />
                        </div>
                        <div className="col-md-6 contents">
                            <div className="p-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-8">
                                        <div className="mb-4">
                                            <h3>Đăng nhập </h3>
                                        </div>
                                        <form onSubmit={handleLogin}>
                                            {errorLogin && <p style={{ color: 'red' }}>{errorLogin}</p>}
                                            {successLogin && <p style={{ color: 'green' }}>{successLogin}</p>}
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputPassword1" className="form-label">Mật khẩu </label>
                                                <input type="password" className="form-control" id="exampleInputPassword1"
                                                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                                            </div>
                                            <button type="submit"
                                                className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
                                                disabled={isDisabled}
                                            >
                                                {isDisabled ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    </>
                                                ) : (
                                                    "Đăng nhập"
                                                )}
                                            </button>
                                        </form>

                                        <div className="d-flex mb-5 justify-content-between align-items-center mt-4">
                                            <span className="ml-auto"><Link to="/dang-ky" href="#" className="forgot-pass">Đăng ký </Link></span>
                                            <span className="ml-auto"><Link to="/quen-mat-khau" href="#" className="forgot-pass">Quên mật khẩu </Link></span>
                                        </div>

                                        <span className="d-block text-left my-4 text-muted">&mdash; hoặc đăng nhập với  &mdash;</span>

                                        <div className="social-login">
                                            <a href="http://localhost:4000/v1/auth/google" className="facebook">
                                                <span className="fa fa-facebook mr-3"></span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
