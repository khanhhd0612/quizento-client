import React, { useEffect, useState } from 'react';
import Header from '../../components/layouts/header';
import NavBar from '../../components/layouts/navBar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../config/axiosConfig';
import nProgress from 'nprogress';

export default function UpdateQuestionForm() {
    const navigate = useNavigate();
    const [questionText, setQuestionText] = useState('')
    const [answers, setAnswers] = useState(['']);
    const [correctAnswer, setCorrectAnswer] = useState('')
    const [isQuestionImage, setIsQuestionImage] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const { examId, sectionId, questionId } = useParams()


    const fetchData = async () => {
        try {
            const res = await api.get(
                `/exams/${examId}/sections/${sectionId}/questions/${questionId}?t=${Date.now()}`
            );
            const question = res.data.question;
            setQuestionText(question.text);
            setAnswers(question.answers);
            setCorrectAnswer(question.correctAnswers[0] || '');
            if (question.isQuestionImage) {
                setIsQuestionImage(true);
                setImageUrl(question.imageUrl);
            } else {
                setIsQuestionImage(false);
                setImageUrl('');
            }
        } catch (err) {
            if (err.response?.status === 404) {
                navigate('/500');
            }
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);

        if (correctAnswer === answers[index]) {
            setCorrectAnswer(value);
        }
    };

    const addAnswer = () => {
        setAnswers([...answers, '']);
    };

    const removeAnswer = (index) => {
        const removed = answers[index];
        if (answers.length === 1) {
            Swal.fire("Lỗi", 'Câu hỏi phải có ít nhất 1 đáp án', "error")
            return
        }
        const newAnswers = answers.filter((_, i) => i !== index);
        setAnswers(newAnswers);

        if (correctAnswer === removed) {
            setCorrectAnswer('');
        }
    };
    const handleUpdateQuestion = () => {
        Swal.fire({
            title: "Bạn muốn lưu thay đổi?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Lưu",
            denyButtonText: "Không lưu",
        }).then((result) => {
            if (result.isConfirmed) {
                updateQuestion()
            } else if (result.isDenied) {
                Swal.fire("Dữ liệu chưa được thay đổi", "", "info")
            }
        })
    }
    const updateQuestion = async () => {
        if (!questionText.trim()) {
            Swal.fire("Lỗi", 'Bạn chưa nhập câu hỏi!', "error")
            return;
        }

        if (answers.some(ans => !ans.trim())) {
            Swal.fire("Lỗi", 'Không được để trống đáp án!', "error")
            return;
        }

        if (!correctAnswer.trim()) {
            Swal.fire("Lỗi", 'Bạn chưa chọn đáp án đúng!', "error")
            return;
        }
        try {
            nProgress.start()
            const res = await api.put(`/exams/${examId}/sections/${sectionId}/questions/${questionId}`,
                {
                    text: questionText,
                    answers: answers,
                    correctAnswers: correctAnswer
                }
            )
            if (res.status === 200) {
                Swal.fire({
                    title: "Cập nhật câu hỏi thành công",
                    icon: "success",
                    draggable: true
                });
                fetchData()
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                Swal.fire("Lỗi", err.response.data.message, "error")
            }
        } finally {
            nProgress.done()
        }

    }
    const handleAddImage = async () => {
        const { value: file } = await Swal.fire({
            title: "Chọn ảnh",
            input: "file",
            inputAttributes: {
                "accept": "image/*",
                "aria-label": "Upload your profile picture"
            }
        });
        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                nProgress.start()
                const res = await api.put(`/exams/${examId}/sections/${sectionId}/questions/${questionId}/add-image`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                )
                if (res.status == 201) {
                    Swal.fire({ title: "Thêm thành công!", icon: "success" });
                    fetchData()
                }

            } catch (err) {
                Swal.fire("Error", "Lỗi", "error");
                console.error(err);
            } finally {
                nProgress.done()
            }
        }
    }
    const handleDeleteImage = async () => {
        const result = await Swal.fire({
            title: "Xóa ảnh?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa"
        });

        if (result.isConfirmed) {
            try {
                nProgress.start();
                const res = await api.delete(`/exams/${examId}/sections/${sectionId}/questions/${questionId}/delete-image`);
                if (res.status == 200) {
                    fetchData()
                    Swal.fire({
                        title: "Xóa thành công!",
                        icon: "success"
                    })
                }
            } catch (err) {
                Swal.fire("Error", "Lỗi", "error");
                console.error(err);
            } finally {
                nProgress.done();
            }
        }
    }
    const handleUpdateImage = async () => {
        const { value: file } = await Swal.fire({
            title: "Chọn ảnh",
            input: "file",
            inputAttributes: {
                "accept": "image/*",
                "aria-label": "Upload your profile picture"
            }
        });
        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                nProgress.start()
                const res = await api.put(`/exams/${examId}/sections/${sectionId}/questions/${questionId}/change-image`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                )
                if (res.status == 200) {
                    Swal.fire({ title: "Thay đổi ảnh thành công!", icon: "success" });
                    fetchData()
                }

            } catch (err) {
                Swal.fire("Error", "Lỗi", "error");
                console.error(err);
            } finally {
                nProgress.done()
            }
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
                            <div className="col-12 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h4 className="card-title">Cập nhật câu hỏi</h4>
                                            <div>
                                                <div className="d-flex">
                                                    <button
                                                        onClick={handleAddImage}
                                                        title="Thêm ảnh"
                                                        className="btn btn-success d-flex align-items-center p-2 mx-1"
                                                    >
                                                        <i className="fa fa-plus-square-o p-1"></i>
                                                        <span className="text-white p-1 d-none d-md-block">Thêm ảnh</span>
                                                    </button>

                                                    {isQuestionImage && (
                                                        <>
                                                            <button
                                                                onClick={handleUpdateImage}
                                                                title="Thay đổi ảnh"
                                                                className="btn btn-warning d-flex align-items-center p-2 mx-1"
                                                            >
                                                                <i className="fa fa-edit p-1"></i>
                                                                <span className="text-white p-1 d-none d-md-block">Thay đổi ảnh</span>
                                                            </button>

                                                            <button
                                                                onClick={handleDeleteImage}
                                                                title="Xóa ảnh"
                                                                className="btn btn-danger d-flex align-items-center p-2 mx-1"
                                                            >
                                                                <i className="fa fa-trash-o p-1"></i>
                                                                <span className="text-white p-1 d-none d-md-block">Xóa ảnh</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputName1">Câu hỏi </label>
                                            <textarea
                                                placeholder="Nhập câu hỏi"
                                                className="form-control"
                                                rows={3}
                                                value={questionText}
                                                onChange={
                                                    (e) => {
                                                        setQuestionText(e.target.value);
                                                        e.target.style.height = "auto";
                                                        e.target.style.height = e.target.scrollHeight + "px";
                                                    }
                                                }
                                            />
                                        </div>
                                        <div>
                                            {
                                                isQuestionImage ? (
                                                    <div>
                                                        <img src={imageUrl}></img>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )
                                            }
                                        </div>
                                        <div>
                                            <div><label>Đáp án </label></div>
                                            {answers.map((answer, index) => (
                                                <div key={index} className="input-group mb-2 mt-2">
                                                    <div className="input-group-text">
                                                        <input
                                                            type="radio"
                                                            name="correctAnswer"
                                                            checked={correctAnswer === answer}
                                                            onChange={() => setCorrectAnswer(answer)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder={`Đáp án ${index + 1}`}
                                                        value={answer}
                                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                                    />
                                                    <button className="btn btn-danger" onClick={() => removeAnswer(index)}>X</button>
                                                </div>
                                            ))}
                                            <button onClick={addAnswer} className="btn btn-gradient-primary me-2">Thêm đáp án</button>
                                        </div>

                                        <button className="btn btn-primary mt-2" onClick={handleUpdateQuestion}>Lưu thay đổi </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
