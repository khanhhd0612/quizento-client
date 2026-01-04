import { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Header from "../../components/layouts/header"
import api from '../../config/axiosConfig'
import nProgress from 'nprogress'


const DoExam = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { shuffleAnswer, shuffleQuestion, autoTime } = location.state || {}
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [examTitle, setExamTitle] = useState('')
    const { id } = useParams()
    const [time, setTime] = useState(0)
    const [autoNext, setAutoNext] = useState(true)
    const timerRef = useRef(null)

    const shuffleArray = (array = []) => {
        const shuffled = [...array]
        if (shuffleAnswer) {
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
            }
        }
        return shuffled
    }
    const shuffleQuestions = (array = []) => {
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
                const loadedQuestions = data.sections.flatMap(section => section.questions)
                let processedQuestions = loadedQuestions.map(q => ({
                    ...q,
                    answers: shuffleArray(q.answers),
                    selectedAnswer: null,
                    answered: false
                }))

                if (shuffleQuestion) {
                    processedQuestions = shuffleQuestions(processedQuestions)
                }

                setQuestions(processedQuestions)
                if (autoTime === 0) {
                    setAutoNext(false)
                }
            })
            .catch(err => {
                if (err.response.status === 500) {
                    navigate('/500')
                }
            }).finally(() => {
                nProgress.done()
            })
    }, [id])

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

    const currentQ = questions[currentIndex]
    const totalAnswered = questions.filter(q => q.answered).length
    const totalCorrect = questions.filter(q => q.correctAnswers.includes(q.selectedAnswer)).length
    const fixWrongQuestions = questions.filter(q => q.answered && !q.correctAnswers.includes(q.selectedAnswer))

    const handleRetryWrong = () => {
        const wrongQuestions = questions.filter(q => q.answered && !q.correctAnswers.includes(q.selectedAnswer))
        const resetWrong = wrongQuestions.map(q => ({
            ...q,
            selectedAnswer: null,
            answered: false
        }))
        setQuestions(resetWrong)
        setCurrentIndex(0)
    }

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTime(prev => prev + 1)
        }, 1000)

        return () => clearInterval(timerRef.current)
    }, [])

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m} : ${s < 10 ? '0' + s : s}`
    }
    const saveScore = async (score, time) => {
        try {
            const examId = id
            const res = api.post(`score`, {
                examId,
                score,
                time
            })
        } catch (err) {
            Swal.fire({
                title: err,
                icon: 'error',
            })
        }
    }

    useEffect(() => {
        if (questions.length > 0 && totalAnswered === questions.length) {
            clearInterval(timerRef.current)
            const score = ((totalCorrect / questions.length) * 10).toFixed(2)
            Swal.fire({
                title: 'Đã hoàn thành bài thi!',
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
    }, [totalAnswered, totalCorrect, questions.length])

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
                                    <h6>Chế độ : Ôn thi</h6>
                                </div>
                                <div>
                                    <div className="card-content border-bottom">
                                        <p className="d-inline">Thời gian làm bài</p>
                                        <p id="display">{formatTime(time)}</p>
                                    </div>
                                </div>
                                <div className="py-3 d-flex justify-content-between">
                                    <div>
                                        Đã làm : {totalAnswered} / {questions.length}
                                    </div>
                                    <div>
                                        Đúng : {totalCorrect}
                                    </div>
                                </div>
                                <div className="py-2 form-check mt-2">
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
                                    <Link to="/" className="btn btn-primary px-3">Trở về</Link>
                                    <button
                                        onClick={handleRetryWrong}
                                        className="btn btn-primary"
                                        disabled={!fixWrongQuestions || fixWrongQuestions.length === 0}
                                    >
                                        Làm lại câu sai
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mt-1">
                            <div className="card abc p-3 py-3">
                                <div className="card-title" style={{ whiteSpace: "pre-line" }}>
                                    <h5>Câu {currentIndex + 1}</h5>
                                    <h4 className="lh-sm" readOnly>{currentQ?.text}</h4>
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
                                    <div className="question-container">
                                        <div className="options">
                                            {currentQ?.answers.map((ans, i) => {
                                                let isCorrect = currentQ.correctAnswers.includes(ans)
                                                let isSelected = currentQ.selectedAnswer === ans
                                                let className = "w-100 p-2 mt-2 border btn text-start fs-6 lh-sm"
                                                if (currentQ.answered) {
                                                    if (isSelected && isCorrect) className = "w-100 p-2 btn btn-success fs-6 lh-sm text-white text-start"
                                                    else if (isSelected && !isCorrect) className = "w-100 p-2 mt-2 btn btn-danger fs-6 lh-sm text-white text-start"
                                                    else if (!isSelected && isCorrect) className = "w-100 p-2 mt-2 btn btn-success fs-6 lh-sm text-white text-start"
                                                }
                                                return (
                                                    <button
                                                        key={i}
                                                        className={className}
                                                        onClick={() => handleAnswer(ans)}
                                                        disabled={currentQ.answered}
                                                    >
                                                        {ans}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 mt-1">
                            <div className="card p-3 py-3">
                                <div className="card-title">
                                    <h5>Mục lục câu hỏi</h5>
                                </div>
                                <div className="card-content">
                                    <div className='exam-list-questions'>
                                        {questions.map((q, i) => {
                                            let btnClass = "m-1 question-btn "
                                            if (q.answered) {
                                                btnClass += q.correctAnswers.includes(q.selectedAnswer)
                                                    ? "btn-success" : "btn-danger"
                                            } else {
                                                btnClass += "btn-outline-primary"
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
                                    <div className="d-flex justify-content-between mt-2 border-top py-2">
                                        <button
                                            className="btn btn-secondary px-1"
                                            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                                            disabled={currentIndex === 0}
                                        >
                                            Câu trước
                                        </button>
                                        <button
                                            className="btn btn-primary px-1"
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
        </div>
    )
}

export default DoExam
