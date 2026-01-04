import Header from "../../components/layouts/header"
import NavBar from "../../components/layouts/navBar"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../config/axiosConfig"
import nProgress from "nprogress"

export default function ListSection() {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [isPublic, setIsPublic] = useState(true)
    const [timeLimit, setTimeLimit] = useState(1)
    const { examId } = useParams()

    const fetchData = async () => {
        try {
            nProgress.start()
            const res = await api.get(`/exams/${examId}/sections`)
            setData(res.data.section)
        } catch (err) {
            if (err.response?.status === 500) {
                navigate('/500');
            }
        } finally {
            nProgress.done()
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const deleteSection = async (sectionId) => {
        try {
            nProgress.start()
            const res = await api.delete(`/exams/${examId}/sections/${sectionId}`)

            if (res.status === 200) {
                Swal.fire({ title: res.data.message, icon: "success" })
                fetchData()
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error")
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi xóa bài thi", "error")
            }
        } finally {
            nProgress.done()
        }
    }

    const handleDelete = (sectionId) => {
        Swal.fire({
            title: "Xóa?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đúng"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSection(sectionId)
            }
        })
    }

    const addSection = async () => {
        try {
            Swal.fire({
                title: "Nhập tên phần thi",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Thêm",
                showLoaderOnConfirm: true,
                preConfirm: async (nameSection) => {
                    try {
                        nProgress.start()
                        const validateName = nameSection.trim()

                        if (!validateName) {
                            Swal.fire({ title: "Tên phần thi không được để trống", icon: "warning" })
                            return
                        }

                        const res = await api.post(`/exams/${examId}/sections`,
                            { name: validateName }
                        )

                        if (res.status === 200) {
                            Swal.fire({ title: res.data.message, icon: "success" })
                            fetchData()
                        }
                    } catch (error) {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    } finally {
                        nProgress.done()
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
            })


        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error")
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi thêm phần thi", "error")
            }
        }
    }
    const reNameSection = async (sectionId, nameSection) => {
        Swal.fire({
            title: "Nhập tên phần thi",
            input: "text",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Lưu",
            showLoaderOnConfirm: true,
            preConfirm: async (newNameSection) => {
                try {
                    nProgress.start()
                    try {
                        if (nameSection.trim() === newNameSection.trim()) {
                            Swal.fire({ title: "Tên chưa thay đổi", icon: "info" })
                            return;
                        }
                        const res = await api.put(`/exams/${examId}/sections/${sectionId}`,
                            {
                                name: newNameSection
                            }
                        )
                        if (res.status === 200) {
                            Swal.fire({ title: "Đổi tên thành công", icon: "success" })
                            fetchData()
                        }
                    } catch (err) {
                        if (err.response && err.response.data && err.response.data.message) {
                            Swal.fire("Lỗi", err.response.data.message, "error")
                        } else {
                            Swal.fire("Lỗi", "Đã xảy ra lỗi khi đổi tên bài thi", "error")
                        }
                    }
                } catch (error) {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                } finally {
                    nProgress.done()
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
    }
    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-lg-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h4 className="card-title">Danh sách phần thi</h4>
                                            <div>
                                                <div className="d-flex">
                                                    <div title="Tìm kiếm" onClick={addSection} className="btn btn-primary d-flex align-item-center p-2 mx-1">
                                                        <i className="fa fa-search p-1"></i>
                                                        <a className="text-white p-1 text-decoration-none d-none d-md-block">Tìm kiếm</a>
                                                    </div>
                                                    <div title="Thêm phần thi" onClick={addSection} className="btn btn-success d-flex align-item-center p-2">
                                                        <i className="fa fa-plus-square-o p-1"></i>
                                                        <a className="text-white p-1 text-decoration-none d-none d-md-block">Thêm phần thi</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Tên phần thi</th>
                                                    <th>Số câu hỏi</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item) => (
                                                    <tr key={item._id}>
                                                        <td>{item.name}</td>
                                                        <td>{item.questions?.length}</td>
                                                        <td>
                                                            <Link title="Danh sách câu hỏi" to={`/edit/exam/${examId}/section/${item._id}/questions`}><label className="badge badge-success mx-1"><i className="fa fa-th-list"></i></label></Link>
                                                            <lable title="Đổi tên phần thi" onClick={() => reNameSection(item._id, item.name)} className="badge badge-warning mx-1" ><i className="fa fa-edit"></i></lable>
                                                            <label title="Xóa" onClick={() => handleDelete(item._id)} className="badge badge-danger"><i className="fa fa-trash-o"></i></label>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
