import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../../components/layouts/header'
import NavBar from '../../components/layouts/navBar'
import ExamCard from '../../components/ui/examCard'
import NProgress from 'nprogress'
import api from '../../config/axiosConfig'



export default function Search() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const location = useLocation()

    const fetchData = async () => {
        try {
            NProgress.start()
            const q = new URLSearchParams(location.search).get("q") || ""
            const res = await api.get(`exams/search`, {
                params: { q: q }
            })
            setData(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API:", error)
        } finally {
            NProgress.done()
            setLoading(!loading)
        }
    }
    useEffect(() => {
        fetchData()
    }, [location.search])


    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-content p-xs-1">
                            {data.length > 0 && loading ? (
                                <div className="row">
                                    {
                                        data.map((item) => (
                                            <div key={item.id} className=" col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3 stretch-card grid-margin">
                                                <ExamCard
                                                    id={item._id}
                                                    name={item.name}
                                                    slug={item.slug}
                                                    imageUrl={item.imageUrl || "/assets/images/background-hoc-tap-54.jpg"}
                                                    time={item.createdAt}
                                                    createdBy={item.createdBy.name || "Không rõ"}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : (<div className="fx-1">
                                <p>Không có kết quả nào khớp với yêu cầu tìm kiếm của bạn.</p>
                                <p>Đề xuất:</p>
                                <ul>
                                    <li>Thử nhập từ khóa khác</li>
                                    <li>Bạn đang tìm bài thi theo tên ?</li>
                                </ul>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
