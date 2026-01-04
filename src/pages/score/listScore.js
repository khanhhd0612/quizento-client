import Header from "../../components/layouts/header"
import NavBar from "../../components/layouts/navBar"
import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import ReactPaginate from "react-paginate"
import api from "../../config/axiosConfig"
import nProgress from "nprogress"

export default function ListScore() {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [name, setName] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [searchParams, setSearchParams] = useSearchParams()
    const page = parseInt(searchParams.get("page")) || 1
    const { examId } = useParams()

    const fetchData = async () => {
        try {
            nProgress.start()
            const res = await api.get(`exams/${examId}/score?page=${page}&limit=8`)
            setData(res.data.score)
            setName(res.data.nameExam)
            setTotalPages(res.data.totalPages)
        } catch (err) {
            if (err.response?.status === 404) {
                navigate('/404');
            }
        } finally {
            nProgress.done()
        }
    }

    useEffect(() => {
        fetchData()
    }, [page])

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
                                        <h4 className="card-title">Danh sách điểm của bài thi "{name}"</h4>
                                        {data.length > 0 ? (
                                            <>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Tên người làm </th>
                                                            <th>Điểm</th>
                                                            <th>Thời gian làm bài </th>
                                                            <th>Làm lúc</th>
                                                            <th>Ngày làm</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.map((item) => (
                                                            <tr key={item._id}>
                                                                <td>{item.userId.name}</td>
                                                                <td>{item.score}</td>
                                                                <td>{item.time}</td>
                                                                <td>{item.createdAt.substring(11, 19)}</td>
                                                                <td>{item.createdAt.slice(0, 10)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {
                                                    totalPages > 1 ? (
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
                                                    ) : null
                                                }
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
