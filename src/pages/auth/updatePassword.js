import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/layouts/header";
import NavBar from "../../components/layouts/navBar";
import api from "../../config/axiosConfig"
import nProgress from "nprogress";

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        Swal.fire({
            title: "Bạn muốn lưu thay đổi?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Lưu",
            denyButtonText: "Không lưu",
        }).then((result) => {
            if (result.isConfirmed) {
                updatePassword()
            } else if (result.isDenied) {
                Swal.fire("Dữ liệu chưa được thay đổi", "", "info")
            }
        })
    }
    const updatePassword = async () => {
        if (password !== confirmPassword) {
            Swal.fire("Lỗi", 'Mật khẩu không trùng khớp', "error");
            return;
        }
        try {
            nProgress.start()
            const res = await api.put(`/users/password`, {
                oldPassword,
                password,
            })
            if (res.status === 200) {
                setPassword('')
                setOldPassword('')
                setConfirmPassword('')
                Swal.fire({
                    title: "Đổi mật khẩu thành công !",
                    icon: "success",
                    draggable: true
                });
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error");
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi đổi mật khẩu", "error");
            }
        } finally{
            nProgress.done()
        }
    }
    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Đổi mật khẩu</h4>
                                <form onSubmit={handleUpdatePassword} className="forms-sample">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputUsername1">Mật khẩu cũ </label>
                                        <input type="password" className="form-control" id="exampleInputUsername1" placeholder="Mật khẩu cũ " value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Mật khẩu mới </label>
                                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Mật khẩu mới " value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputConfirmPassword1">Xác nhận mật khẩu </label>
                                        <input type="password" className="form-control" id="exampleInputConfirmPassword1"
                                            placeholder="Xác nhận mật khẩu " value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="btn btn-gradient-primary me-2">Gửi </button>
                                    <Link to="/thong-tin-nguoi-dung" className="btn btn-light">Cancel</Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}