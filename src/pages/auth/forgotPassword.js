import "./../../assets/css/auth.css"
import React, { useState } from 'react'
import nProgress from 'nprogress'
import api from "../../config/axiosConfig"
import Swal from "sweetalert2";

export default function Test() {
    const [email, setEmail] = useState('')
    const [isDisabled, setIsDisabled] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsDisabled(true)

        nProgress.start()
        try {
            const res = await api.post(`/auth/forgot-password`, { email })
            if (res.status === 200) {
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    draggable: true,
                })
                setEmail("")
            }
        } catch (err) {
            Swal.fire({
                title: err.response?.data?.message || "Đã có lỗi xảy ra",
                icon: "error",
                draggable: true,
            })
        } finally {
            setIsDisabled(false)
            nProgress.done()
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
                                            <h3>Quên mật khẩu </h3>
                                        </div>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
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
                                                    "Gửi"
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
