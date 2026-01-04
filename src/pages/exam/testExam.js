import { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Header from "../../components/layouts/header"
import api from '../../config/axiosConfig'
import nProgress from 'nprogress'

const TestExam = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { autoTime } = location.state || {}
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [examTitle, setExamTitle] = useState('')
    const { id } = useParams()
    const [time, setTime] = useState(null)
    const [timeLimit, setTimeLimit] = useState(0)
    const [autoNext, setAutoNext] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const timerRef = useRef(null)

    const shuffleArray = (array = []) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    useEffect(() => {
        nProgress.start()
        api.get(`/exams/${id}`)
            .then(res => {
                const data = res.data
                setExamTitle(data.name || "Đề thi không có tên")
                setTimeLimit(data.timeLimit || 30)
                let loadedQuestions = data.sections.flatMap(section => section.questions)
                let processedQuestions = loadedQuestions.map(q => ({
                    ...q,
                    answers: shuffleArray(q.answers),
                    selectedAnswer: null,
                    answered: false
                }))
                processedQuestions = shuffleArray(processedQuestions)
                setQuestions(processedQuestions)
                if (autoTime === 0) setAutoNext(false)
            })
            .catch(err => {
                if (err.response?.status === 500) navigate('/500')
            })
            .finally(() => nProgress.done())
    }, [id])

    useEffect(() => {
        if (timeLimit && questions.length > 0) {
            setTime(timeLimit * 60)
            setIsSubmitted(false)
        }
    }, [timeLimit, questions.length])

    useEffect(() => {
        if (isSubmitted || questions.length === 0 || time === null) return;

        if (time <= 0) {
            clearInterval(timerRef.current)
            handleSubmitExam()
            return
        }

        timerRef.current = setInterval(() => {
            setTime(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timerRef.current)
    }, [time, isSubmitted, questions.length])

    const handleAnswer = (answer) => {
        const updatedQuestions = [...questions]
        const currentQ = updatedQuestions[currentIndex]
        if (!currentQ.answered) {
            currentQ.selectedAnswer = answer
            currentQ.answered = true
        }
        setQuestions(updatedQuestions)
        if (autoNext) {
            setTimeout(() => {
                setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))
            }, 2000)
        }
    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s < 10 ? '0' + s : s}`
    }

    const saveScore = async (score, time) => {
        try {
            await api.post(`exams/${id}/score`, {
                examId: id,
                score,
                time
            })
        } catch (err) {
            Swal.fire({ title: err.message || 'Lỗi khi lưu điểm', icon: 'error' })
        }
    };

    const handleSubmitExam = () => {
        if (isSubmitted || questions.length === 0) return

        clearInterval(timerRef.current)
        setIsSubmitted(true)

        const totalCorrect = questions.filter(q => q.correctAnswers.includes(q.selectedAnswer)).length
        let score = totalCorrect > 1
            ? ((totalCorrect / questions.length) * 10).toFixed(2)
            : 0

        Swal.fire({
            title: 'Đã nộp bài!',
            html: `
                <p>Số câu đúng: <b>${totalCorrect}/${questions.length}</b></p>
                <p>Điểm: <b>${score}</b></p>
                <p>Thời gian làm bài: <b>${formatTime(time)}</b></p>
            `,
            icon: 'success',
            confirmButtonText: 'OK'
        })

        saveScore(score, time)
    }

    const submitExam = () => {
        Swal.fire({
            title: "Nộp bài ?",
            showDenyButton: true,
            confirmButtonText: "Xác nhận",
            denyButtonText: `Từ chối`
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmitExam()
                Swal.fire("Nộp bài thành công!", "", "success")
            }
        })
    }

    const currentQ = questions[currentIndex]

    return (
        <div className="position-absolute top-0 right-0 left-0 bottom-0 page-bg w-100">
            <Header />
            <div className="container-fluid">
                <div className="main-content">
                    <div className="row mt-1">
                        <div className="col-lg-3 mt-1">
                            <div className="card p-3 py-3">
                                <div className="card-title border-bottom">
                                    <h5>{examTitle}</h5>
                                    <h6>Chế độ: Thi thật</h6>
                                </div>
                                <div className="card-content border-bottom">
                                    <p>Thời gian làm bài</p>
                                    <p>{formatTime(time)}</p>
                                </div>
                                <div className="py-3 d-flex justify-content-between">
                                    <div>Đã làm: {questions.filter(q => q.answered).length}/{questions.length}</div>
                                </div>
                                <div className="form-check mt-2">
                                    <input
                                        className="form-check-input mx-1"
                                        type="checkbox"
                                        checked={autoNext}
                                        onChange={() => setAutoNext(!autoNext)}
                                        id="autoNextCheckbox"
                                    />
                                    <label className="form-check-label" htmlFor="autoNextCheckbox">
                                        Tự động chuyển câu
                                    </label>
                                </div>
                                <div className="mt-2 d-flex justify-content-between">
                                    <Link to="/" className="btn btn-secondary">Trở về</Link>
                                    <button
                                        className="btn btn-danger"
                                        onClick={submitExam}
                                        disabled={isSubmitted}
                                    >
                                        Nộp bài
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Câu hỏi hiện tại */}
                        <div className="col-lg-6 mt-1">
                            <div className="card p-3 py-3">
                                <div className="card-title" style={{ whiteSpace: "pre-line" }}>
                                    <h5>Câu {currentIndex + 1}</h5>
                                    <h4 className="lh-sm">{currentQ?.text}</h4>
                                </div>
                                {currentQ?.isQuestionImage ? (
                                    <>
                                        <img style={{ width: "300px" }} src={currentQ?.imageUrl} />
                                    </>
                                ) : (
                                    <>
                                    </>
                                )}
                                <div className="card-content">
                                    <div className="options">
                                        {currentQ?.answers.map((ans, i) => {
                                            const isSelected = currentQ.selectedAnswer === ans
                                            let className = "fs-6 lh-sm btn border w-100 text-start mt-2"

                                            if (isSubmitted) {
                                                const isCorrect = currentQ.correctAnswers.includes(ans)
                                                if (isSelected && isCorrect) className = "fs-6 lh-sm btn btn-success text-white w-100 text-start mt-2"
                                                else if (isSelected && !isCorrect) className = "fs-6 lh-sm btn btn-danger text-white w-100 text-start mt-2"
                                                else if (!isSelected && isCorrect) className = "fs-6 lh-sm btn btn-success text-white w-100 text-start mt-2"
                                            } else if (isSelected) {
                                                className = "fs-6 lh-sm btn btn-info w-100 text-start mt-2"
                                            }

                                            return (
                                                <button
                                                    key={i}
                                                    className={className}
                                                    onClick={() => handleAnswer(ans)}
                                                    disabled={isSubmitted}
                                                >
                                                    {ans}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách câu hỏi */}
                        <div className="col-lg-3 mt-1">
                            <div className="card p-3 py-3">
                                <div className="card-title">
                                    <h5>Mục lục câu hỏi</h5>
                                </div>
                                <div className="card-content exam-list-questions">
                                    {questions.map((q, i) => {
                                        let btnClass = "m-1 question-btn "
                                        if (isSubmitted) {
                                            btnClass += q.correctAnswers.includes(q.selectedAnswer)
                                                ? "btn-success" : "btn-danger"
                                        } else {
                                            btnClass += q.answered ? "btn-info" : "btn-outline-info"
                                        }
                                        if (currentIndex === i) btnClass += " active"
                                        return (
                                            <button
                                                key={i}
                                                className={btnClass}
                                                onClick={() => setCurrentIndex(i)}
                                            >
                                                {i + 1}
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className="d-flex justify-content-between mt-3 border-top pt-2">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                                        disabled={currentIndex === 0}
                                    >
                                        Câu trước
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))}
                                        disabled={currentIndex === questions.length - 1}
                                    >
                                        Câu tiếp theo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestExam
