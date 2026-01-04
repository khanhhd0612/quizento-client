import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import Header from "../../components/layouts/header"
import NavBar from "../../components/layouts/navBar"
import api from "../../config/axiosConfig"

export default function Information() {
    const [data, setData] = useState({})
    const [name, setName] = useState('')

    const fetchData = async () => {
        const res = await api.get(`/users/profile`)
        setData(res.data)
        setName(res.data.name)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleChangeName = (e) => {
        e.preventDefault()
        Swal.fire({
            title: "Bạn muốn lưu thay đổi?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Lưu",
            denyButtonText: "Không lưu",
        }).then((result) => {
            if (result.isConfirmed) {
                changeName()
            } else if (result.isDenied) {
                Swal.fire("Dữ liệu chưa được thay đổi", "", "info")
            }
        })
    }

    const changeName = async () => {
        const res = await api.put(`/users/name`,
            {
                name,
            }
        )

        if (res.status === 200) {
            Swal.fire({
                title: "Thay đổi tên thành công!",
                icon: "success",
                draggable: true,
            })
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
                                <h4 className="card-title">Thông tin người dùng</h4>
                                <form onSubmit={handleChangeName} className="forms-sample">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputUsername1">Email</label>
                                        <input type="text" className="form-control" id="exampleInputUsername1" placeholder="Email" value={data.email} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Tên người dùng</label>
                                        <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Tên mới" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputConfirmPassword1">Vai trò</label>
                                        <input type="text" className="form-control" id="exampleInputConfirmPassword1" placeholder="Vai trò" value={data.role} readOnly />
                                    </div>
                                    <button type="submit" className="btn btn-gradient-primary m-2">Lưu </button>
                                    <Link to="/doi-mat-khau" className="btn btn-gradient-primary m-2 ">Đổi mật khẩu</Link>
                                    <Link to="/" className="btn btn-light m-2">Hủy</Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
