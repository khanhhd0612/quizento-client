import Header from "../../components/layouts/header"
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../config/axiosConfig";
import nProgress from "nprogress";
import FormCard from "../../components/ui/formCard"
import NavBar from "../../components/layouts/navBar";

export default function InfomationExam() {
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()
    const [examTitle, setExamTitle] = useState('')
    const [createdBy, setCreatedBy] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const [data, setData] = useState({})
    const { id, slug } = useParams()
    const fetchData = async () => {
        try {
            nProgress.start()
            const res = await api.get(`exams/${id}`)
            if (res.status === 200) {
                setData(res.data)
                setExamTitle(res.data.name)
                setCreatedBy(res.data.createdBy.name)
                setCreatedAt(res.data.createdAt)
            }
        } catch (err) {
            if (err.response.status === 500) {
                navigate('/500')
            }
        } finally {
            nProgress.done()
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    const totalQuestions = data.sections?.reduce((total, section) => {
        return total + (section.questions?.length || 0);
    }, 0) || 0;
    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="card">
                            <div className="card-header p-3">
                                <h4>Thông tin đề thi</h4>
                            </div>
                            <div className="card-content p-3">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="my-5 px-3 w-100">
                                            <img className="w-100" src={data.imageUrl} alt="anh-bai-thi" />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mt-5 px-3">
                                            <h3>{examTitle}</h3>
                                            <div className="d-flex align-items-center mt-3">
                                                <img className="rounded-circle logo-user-update-exam"
                                                    src="/assets/images/user_img.jpg" alt="user" />
                                                <div className="">{createdBy}</div>
                                            </div>
                                            <div className="d-flex align-items-center mt-3">
                                                <span><i className="fa fa-clock-o p-1"></i></span>
                                                Thời gian làm bài : {data.timeLimit || "30"} phút
                                            </div>
                                            <div className="d-flex align-items-center mt-3">
                                                <span><i className="fa fa-clock-o p-1"></i></span>
                                                {createdAt.slice(0, 10)}
                                            </div>
                                            <div className="d-flex align-items-center mt-3">
                                                <label title="Số câu hỏi" className="badge badge-gradient-warning p-2">
                                                    <span><i className="fa fa-question-circle p-1"></i></span>
                                                    {totalQuestions}
                                                </label>

                                                <label title="Lượt thi" className="badge badge-gradient-success p-2 mx-2">
                                                    <span><i className="fa fa-bar-chart-o p-1"></i></span>
                                                    200
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mt-5 px-3">
                                            <h3>Chia sẻ đề thi</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-lg-4 mt-2">
                                        <button className="btn btn-primary w-100 px-3" onClick={() => setShowModal(true)}>
                                            <i className="fa fa-play-circle-o mx-1"></i>
                                            Bắt đầu ôn thi
                                        </button>
                                    </div>
                                    <div className="col-lg-4 mt-2">
                                        <Link to={`/bai-thi/thi-thu/${slug}/${id}`} className="btn btn-primary w-100 px-3">
                                            <i className="fa fa-play-circle-o mx-1"></i>
                                            Thi thử
                                        </Link>
                                    </div>
                                    <div className="col-lg-4 mt-2 d-none d-lg-block">
                                        <button className="btn btn-primary w-100 px-3">
                                            <i className="fa fa-download mx-1"></i>
                                            Tải xuống
                                        </button>
                                    </div>
                                    {showModal && <FormCard
                                        onClose={() => setShowModal(false)}
                                        slug={slug}
                                        id={id}
                                    />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}