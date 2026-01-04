import Header from "../../components/layouts/header"
import NavBar from "../../components/layouts/navBar"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Link, useSearchParams } from "react-router-dom"
import ReactPaginate from "react-paginate"
import api from "../../config/axiosConfig"
import nProgress from "nprogress"

export default function ListExam() {
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(1)
    const [searchParams, setSearchParams] = useSearchParams()
    const page = parseInt(searchParams.get("page")) || 1

    const fetchData = async () => {
        try {
            nProgress.start()
            const res = await api.get(`/exams/user/list?page=${page}&limit=8`)
            setData(res.data.exams)
            setTotalItems(res.data.totalItems)
            setTotalPages(res.data.totalPages)
        } catch (err) {
            Swal.fire({ title: err, icon: "error" })
        } finally {
            nProgress.done()
        }
    }

    useEffect(() => {
        fetchData()
    }, [page])

    const deleteExam = async (examId) => {
        try {
            nProgress.start()
            const res = await api.delete(`/exams/${examId}`)

            if (res.status === 200) {
                Swal.fire({ title: "Xóa thành công", icon: "success" })
                fetchData()
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error");
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi xóa bài thi", "error");
            }
        } finally {
            nProgress.done()
        }
    }

    const searchExam = async (query) => {
        try {
            const res = await api.get(`/exams/user/search`, {
                params: { q: query }
            })
            if (res.data) {
                setData(res.data)
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error");
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi", "error");
            }
        } finally {

        }
    }
    const handleSearch = async () => {
        try {
            Swal.fire({
                title: "Nhập tên bài thi",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Thêm",
                showLoaderOnConfirm: true,
                preConfirm: async (query) => {
                    searchExam(query)
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
    const handleDelete = (examId) => {
        Swal.fire({
            title: "Xóa?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đúng"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteExam(examId)
            }
        })
    }

    const handlePageClick = (pageNum) => {
        setSearchParams({ page: pageNum })
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
                                            <h4 className="card-title">Danh sách bài thi - Hiển thị {data.length} / {totalItems} bài thi</h4>
                                            <div>
                                                <div className="d-flex">
                                                    <div onClick={handleSearch} title="Tìm kiếm" className="btn btn-primary d-flex align-item-center p-2 mx-1">
                                                        <i className="fa fa-search p-1"></i>
                                                        <a className="text-white p-1 text-decoration-none d-none d-md-block">Tìm kiếm</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {data.length > 0 ? (
                                            <>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>STT</th>
                                                            <th>Tên bài thi</th>
                                                            <th className="d-none d-md-table-cell">Ngày tạo</th>
                                                            <th>Trạng thái</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.map((item, index) => (
                                                            <tr key={item.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td className="d-none d-md-table-cell">{item.createdAt.slice(0, 10)}</td>
                                                                <td>
                                                                    {/* <Link title="Xem điểm" to={`/score/exam/${item._id}`}><label className="badge badge-success mx-1"><i className="fa fa-eye"></i></label></Link> */}
                                                                    <Link title="Cài đặt" to={`/setting/exam/${item.id}`}><label className="badge badge-dark mx-1"><i className="fa fa-gear"></i></label></Link>
                                                                    <Link title="Chỉnh sửa" to={`/edit/exam/${item.id}/sections/`}><label className="badge badge-warning mx-1"><i className="fa fa-pencil"></i></label></Link>
                                                                    <label title="Xóa" onClick={() => handleDelete(item.id)} className="badge badge-danger"><i className="fa fa-trash-o"></i></label>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                    <ReactPaginate
                                                        previousLabel={"←"}
                                                        nextLabel={"→"}
                                                        breakLabel={"..."}
                                                        pageCount={totalPages}
                                                        marginPagesDisplayed={2}
                                                        pageRangeDisplayed={3}
                                                        onPageChange={(selectedItem) => handlePageClick(selectedItem.selected + 1)}
                                                        containerClassName={"pagination justify-content-end mt-4"}
                                                        pageClassName={"page-item"}
                                                        pageLinkClassName={"page-link"}
                                                        previousClassName={"page-item"}
                                                        previousLinkClassName={"page-link"}
                                                        nextClassName={"page-item"}
                                                        nextLinkClassName={"page-link"}
                                                        breakClassName={"page-item"}
                                                        breakLinkClassName={"page-link"}
                                                        activeClassName={"active"}
                                                        forcePage={page - 1}
                                                    />
                                            </>
                                        ) : (
                                            <div className="fx-1">
                                                <p>Bạn chưa có bài thi nào.</p>
                                            </div>
                                        )}
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
