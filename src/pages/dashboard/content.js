import { useEffect, useState, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ExamCard from "../../components/ui/examCard"
import nProgress from 'nprogress'
import api from '../../config/axiosConfig'

export default function ContentDashBoard() {
    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const pageRef = useRef(1)
    const isFetchingRef = useRef(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        if (isFetchingRef.current || !hasMore) {
            return
        }

        isFetchingRef.current = true
        nProgress.start()

        try {
            const response = await api.get(`/exams?page=${pageRef.current}&limit=8`)
            const newData = response.data.exams

            if (newData.length === 0) {
                setHasMore(false)
            } else {
                setData(prevData => [...prevData, ...newData])
                pageRef.current += 1
            }
        } catch (error) {
            setHasMore(false)
        } finally {
            isFetchingRef.current = false
            nProgress.done()
        }
    }

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white me-2">
                        <i className="mdi mdi-home"></i>
                    </span> Trang chủ
                </h3>
            </div>
            <div id="scrollableDiv" className="page-content p-xs-1">
                <InfiniteScroll
                    style={{ overflowX: 'hidden' }}
                    dataLength={data.length}
                    next={fetchData}
                    hasMore={hasMore}
                    scrollableTarget="scrollableDiv"
                    loader={<h4>Loading...</h4>}
                >
                    {data.length > 0 ? (
                        <div className="row">
                            {data.map((item) => (
                                <div key={item.id} className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 stretch-card grid-margin">
                                    <ExamCard
                                        id={item.id}
                                        name={item.name}
                                        slug={item.slug}
                                        imageUrl={item.imageUrl || "/assets/images/background-hoc-tap-54.jpg"}
                                        time={item.createdAt}
                                        createdBy={item.createdBy || "Không rõ"}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p>Hiện chưa có bài thi nào.</p>
                            <p>Chúng tôi sẽ cập nhật trong thời gian sớm nhất.</p>
                        </div>
                    )}
                </InfiniteScroll>
            </div>
        </div>
    )
}