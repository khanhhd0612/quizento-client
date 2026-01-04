import "./../../assets/css/auth.css"
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from "../../config/axiosConfig"
import nProgress from 'nprogress';

export default function ResetPassword() {
    const { token } = useParams()
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isDisabled, setIsDisabled] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Mật khẩu không trùng khớp!');
            return;
        }
        resetPassword()
    }
    const resetPassword = async () => {
        setIsDisabled(true)

        try {
            nProgress.start()
            const res = await api.put(`/auth/reset-password/`,
                {
                    token,
                    password,
                });
            if (res.status === 200) {
                setError('')
                setPassword('')
                setConfirmPassword('')
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    draggable: true
                });
                window.location = "/"
            }
        } catch (err) {
            if (err.response?.status === 404) {
                Swal.fire({
                    title: err.response.data.message,
                    icon: "error",
                    draggable: true
                });
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
                                            <h3>Thay đổi mật khẩu </h3>
                                        </div>
                                        <form onSubmit={handleSubmit}>
                                            {error && <p style={{ color: 'red' }}>{error}</p>}
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
                                            <button type="submit"
                                                className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
                                                disabled={isDisabled}
                                            >
                                                {isDisabled ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    </>
                                                ) : (
                                                    "Lưu mật khẩu"
                                                )}
                                            </button>
                                        </form>
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
