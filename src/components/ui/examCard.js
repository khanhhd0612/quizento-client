import { Link } from "react-router-dom"

export default function ExamCard({ id, name, imageUrl, slug, time, createdBy }) {
    return (
        <div className="card card-img-holder w-100">
            <img className="p-1" style={{ objectFit: "cover", width: "100%", height: "100%", maxHeight: "220px" }} src={imageUrl} alt="default-img" />
            <div className="card-body">
                <div className="border-bottom border-top">
                    <div className="exam-info py-1">
                        <p>{name}</p>
                        <p>{time.slice(0, 10)}</p>
                        <div className="d-flex align-items-center">
                            <img className="rounded-circle logo-user-update-exam"
                                src="/assets/images/user_img.jpg" alt="user" />
                            <div className="">{createdBy}</div>
                        </div>
                    </div>
                </div>
                <Link to={`/bai-thi/${slug}/${id}`} className="btn btn-primary w-100 mt-2">Xem đề thi </Link>
            </div>
        </div>
    )
}