import Header from "../../components/layouts/header"
import NavBar from "../../components/layouts/navBar"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../config/axiosConfig"
import nProgress from "nprogress"

export default function ListQuestion() {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const { examId, sectionId } = useParams()

    const fetchData = async () => {
        try {
            nProgress.start()
            const res = await api.get(`/exams/${examId}/sections/${sectionId}/questions`)
            setData(res.data.questions)
        } catch (err) {
            if (err.response?.status === 404) {
                navigate('/500');
            }
        } finally {
            nProgress.done()
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const deleteQuestion = async (questionId) => {
        try {
            nProgress.start()
            const res = await api.delete(`/exams/${examId}/sections/${sectionId}/questions/${questionId}`)

            if (res.status === 200) {
                Swal.fire({ title: res.data.message, icon: "success" })
                fetchData()
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error")
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi xóa câu hỏi", "error")
            }
        } finally {
            nProgress.done()
        }
    }

    const handleDelete = (questionId) => {
        Swal.fire({
            title: "Xóa?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đúng"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteQuestion(questionId)
            }
        })
    }
    const searchQuestion = async (query) => {
        try {
            nProgress.start()
            const res = await api.get(`/exams/${examId}/sections/${sectionId}/questions/search`, {
                params: { q: query }
            })
            if (res.data.results) {
                setData(res.data.results)
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error");
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi", "error");
            }
        } finally {
            nProgress.done()
        }
    }
    const handleSearch = async () => {
        try {
            Swal.fire({
                title: "Nhập câu hỏi",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Tìm",
                showLoaderOnConfirm: true,
                preConfirm: async (query) => {
                    searchQuestion(query)
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
                                            <h4 className="card-title">Danh sách câu hỏi</h4>
                                            <div>
                                                <div className="d-flex">
                                                    <div onClick={handleSearch} title="Tìm kiếm" className="btn btn-primary d-flex align-item-center p-2 mx-1">
                                                        <i className="fa fa-search p-1"></i>
                                                        <a className="text-white p-1 text-decoration-none d-none d-md-block">Tìm kiếm</a>
                                                    </div>
                                                    <Link
                                                        to={`/edit/exam/${examId}/section/${sectionId}/question/add`}
                                                        title="Thêm câu hỏi"
                                                        className="btn btn-success d-flex align-items-center p-2 mx-1"
                                                    >
                                                        <i className="fa fa-plus-square-o p-1"></i>
                                                        <span className="text-white p-1 text-decoration-none d-none d-md-block">
                                                            Thêm câu hỏi
                                                        </span>
                                                    </Link>
                                                    <Link
                                                        to={`/edit/exam/${examId}/section/${sectionId}/question-image/add`}
                                                        title="Thêm câu hỏi"
                                                        className="btn btn-success d-flex align-items-center p-2 mx-1"
                                                    >
                                                        <i className="fa fa-plus-square-o p-1"></i>
                                                        <span className="text-white p-1 text-decoration-none d-none d-md-block">
                                                            Thêm câu hỏi có ảnh
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            data.length > 0 ? (
                                                <>
                                                    <div className="table-responsive w-100">
                                                        <table className="table mt-2">
                                                            <thead>
                                                                <tr>
                                                                    <th>Câu hỏi</th>
                                                                    <th className="d-none d-md-table-cell">Số đáp án</th>
                                                                    <th>Trạng thái</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {data.map((item) => (
                                                                    <tr key={item._id}>
                                                                        <td
                                                                            className="text-truncate"
                                                                            style={{ maxWidth: "200px" }}
                                                                            title={item.text}
                                                                        >
                                                                            {item.text}
                                                                        </td>

                                                                        <td
                                                                            className="text-truncate d-none d-md-table-cell"
                                                                            style={{ maxWidth: "100px" }}
                                                                        >
                                                                            {item.answers.length}
                                                                        </td>

                                                                        <td>
                                                                            <Link
                                                                                to={`/edit/exam/${examId}/section/${sectionId}/question/${item._id}`}
                                                                            >
                                                                                <label className="badge badge-warning mx-1">
                                                                                    <i className="fa fa-pencil"></i>
                                                                                </label>
                                                                            </Link>
                                                                            <label
                                                                                onClick={() => handleDelete(item._id)}
                                                                                className="badge badge-danger"
                                                                            >
                                                                                <i className="fa fa-trash-o"></i>
                                                                            </label>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>Không tồn tại câu hỏi</div>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}
