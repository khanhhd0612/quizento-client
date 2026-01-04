import { useState } from "react";
import { Link } from "react-router-dom";
export default function FormCard({ onClose, slug, id }) {
    const [shuffleQuestion, setShuffleQuestion] = useState(false)
    const [shuffleAnswer, setShuffleAnswer] = useState(false)
    const [autoTime, setAutoTime] = useState(2)
    return (
        <div>
            <div
                className="modal-backdrop show"
                style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 1040
                }}
                onClick={onClose}>
            </div>
            <div
                className="modal show d-block"
                tabIndex="-1"
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1050,
                    width: "100%",
                    maxWidth: "500px"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-dialog">
                    <div className="modal-content shadow">
                        <div className="container p-5">
                            <h6 className="mb-2">Cài đặt đề thi</h6>

                            <div className="mb-2">
                                <label className="form-check">
                                    <input
                                        className="form-check-input ms-2"
                                        type="checkbox"
                                        checked={shuffleQuestion}
                                        onChange={(e) => { setShuffleQuestion(e.target.checked) }}
                                    />
                                    <span className="form-check-label">Đảo câu hỏi</span>
                                </label>
                                <label className="form-check">
                                    <input
                                        className="form-check-input ms-2"
                                        type="checkbox"
                                        checked={shuffleAnswer}
                                        onChange={(e) => { setShuffleAnswer(e.target.checked) }}
                                    />
                                    <span className="form-check-label">Đảo đáp án</span>
                                </label>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="autoNext" className="form-label">Tự động chuyển câu</label>
                                <select
                                    className="form-select"
                                    id="autoNext"
                                    value={autoTime}
                                    onChange={(e) => setAutoTime(Number(e.target.value))}
                                >
                                    <option value="0">Không</option>
                                    <option value="2">2 giây</option>
                                </select>
                            </div>

                            <Link
                                to={`/bai-thi/on-thi/${slug}/${id}`}
                                state={{ shuffleAnswer, shuffleQuestion, autoTime }}
                                className="btn btn-primary w-100">Xác nhận vào thi</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}