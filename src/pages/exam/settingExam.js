import Header from "../../components/layouts/header"
import NavBar from "../../components/layouts/navBar"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../config/axiosConfig"
import nProgress from "nprogress"

export default function SettingExam() {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [isPublic, setIsPublic] = useState(true)
    const [timeLimit, setTimeLimit] = useState(1)
    const [nameExam, setNameExam] = useState('')
    const { examId } = useParams()

    const fetchData = async () => {
        try {
            nProgress.start()
            const res = await api.get(`/exams/${examId}/sections`)
            setNameExam(res.data.exam)
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
    const handleUpdateExam = async () => {
        try {
            nProgress.start()
            const res = await api.put(`/exams/${examId}`,
                {
                    name: nameExam,
                    isPublic: isPublic,
                    timeLimit: timeLimit
                }
            )
            if (res.status === 200) {
                Swal.fire({ title: res.data.message, icon: "success" })
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error")
            } else {
                Swal.fire("Lỗi", "Đã xảy ra lỗi khi đổi tên bài thi", "error")
            }
        } finally {
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
                        <div className="row">
                            <div class="col-12 grid-margin stretch-card">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 className="card-title">Bài thi</h4>
                                        <form class="forms-sample">
                                            <div class="form-group">
                                                <label htmlFor="exampleInputName1">Tên bài thi</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="exampleInputName1"
                                                    value={nameExam}
                                                    onChange={(e) => setNameExam(e.target.value)} />
                                            </div>
                                            <div class="form-group">
                                                <label htmlFor="exampleSelectPublic">Quyền riêng tư</label>
                                                <select
                                                    class="form-select"
                                                    id="exampleSelectPublic"
                                                    value={isPublic.toString()}
                                                    onChange={(e) => setIsPublic(e.target.value === 'true')}
                                                >
                                                    <option value="true">Công khai</option>
                                                    <option value="false">Chỉ mình tôi</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label htmlFor="inputGroupSelect01">Giới hạn thời gian</label>
                                                <select
                                                    value={timeLimit}
                                                    onChange={(e) => setTimeLimit(e.target.value)}
                                                    className="form-select"
                                                    id="inputGroupSelect01"
                                                >
                                                    <option value="10">10 phút</option>
                                                    <option value="15">15 phút</option>
                                                    <option value="30">30 phút</option>
                                                    <option value="60">60 phút</option>
                                                    <option value="90">90 phút</option>
                                                    <option value="120">120 phút</option>
                                                </select>
                                            </div>
                                            <a onClick={handleUpdateExam} class="btn btn-gradient-primary me-2">Lưu thay đổi</a>
                                            <Link to="/danh-sach-bai-thi" class="btn btn-light">Trở về</Link>
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
