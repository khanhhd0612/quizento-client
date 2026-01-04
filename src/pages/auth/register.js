import "./../../assets/css/auth.css"
import React, { useState } from 'react'
import nProgress from 'nprogress'
import api from "../../config/axiosConfig"
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [agree, setAgree] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    const handleRegister = (e) => {
        e.preventDefault()
        setIsDisabled(true)
        setErrors({});
        if (!agree) {
            Swal.fire({
                title: "Bạn phải đồng ý với điều khoản sử dụng !",
                icon: "error",
                draggable: true
            });
            setIsDisabled(false)
            return
        }
        if (password !== confirmPassword) {
            setError('Mật khẩu không trùng khớp!');
            setIsDisabled(false)
            return;
        } else {
            setError('');
        }
        register()
    }
    const register = async () => {
        try {
            nProgress.start()
            const response = await api.post(`/auth/register`, {
                name,
                email,
                password,
            });
            if (response.data.user) {
                setName('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setErrors('')
                setAgree(false)
                Swal.fire({
                    title: response.data.message,
                    icon: "success",
                    draggable: true
                });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data.errors);
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
                                            <h3>Đăng ký </h3>
                                        </div>
                                        <form onSubmit={handleRegister}>
                                            {error && <p style={{ color: 'red' }}>{error}</p>}
                                            {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
                                            {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
                                            {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}
                                            <div className="mb-3">
                                                <label htmlFor="name" className="form-label">Tên</label>
                                                <input type="text" className="form-control" id="name"
                                                    value={name} onChange={(e) => setName(e.target.value)} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="password" className="form-label">Mật khẩu </label>
                                                <input type="password" className="form-control" id="password"
                                                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="confirmPass" className="form-label">Xác nhận mật khẩu </label>
                                                <input type="password" className="form-control" id="confirmPass"
                                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                            </div>
                                            <div className="mb-4">
                                                <input
                                                    className="form-check-input mx-1"
                                                    type="checkbox"
                                                    checked={agree}
                                                    onChange={() => setAgree(!agree)}
                                                />
                                                <label className="form-check-label text-muted" htmlFor="autoNextCheckbox">
                                                    Tôi đồng ý với điều khoản sử dụng
                                                </label>
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
                                                    "Đăng ký"
                                                )}
                                            </button>
                                        </form>
                                        <div className="text-center mt-4 font-weight-light">Đã có tài khoản ? <Link to="/dang-nhap" className="text-primary">Đăng nhập</Link>
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
