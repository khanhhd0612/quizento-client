import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Header from '../../components/layouts/header';
import NavBar from '../../components/layouts/navBar';
import api from '../../config/axiosConfig';
import nProgress from 'nprogress';

export default function AddExam() {
    const [nameExam, setNameExam] = useState('');
    const [rawInput, setRawInput] = useState('');
    const [timeLimit, setTimeLimit] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [results, setResults] = useState(null);
    const [parsedHtml, setParsedHtml] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');

    const parseQuestions = (text) => {
        const lines = text.split('\n');
        const result = {
            sections: [],
            validQuestions: [],
            errors: [],
        };

        let currentSection = {
            name: 'Phần thi chung',
            questions: [],
        };
        result.sections.push(currentSection);

        let currentQuestion = null;
        let lineNumber = 0;

        const isQuestionLine = (line) => /^Câu\s*\d+[:\.]/i.test(line);

        for (let i = 0; i < lines.length; i++) {
            lineNumber++;
            const line = lines[i].trim();
            if (line === '') continue;

            if (line.startsWith("'")) {
                const sectionName = line.substring(1).trim();
                if (sectionName === '') {
                    result.errors.push({
                        line: lineNumber,
                        message: 'Tên phần thi không được trống',
                    });
                    continue;
                }
                currentSection = {
                    name: sectionName,
                    questions: [],
                };
                result.sections.push(currentSection);
                continue;
            }

            if (isQuestionLine(line)) {
                if (currentQuestion) {
                    if (validateQuestion(currentQuestion)) {
                        currentSection.questions.push(currentQuestion);
                        result.validQuestions.push(currentQuestion);
                    } else {
                        result.errors.push({
                            line: currentQuestion.startLine,
                            message: 'Câu hỏi thiếu đáp án đúng hoặc không đủ đáp án',
                            question: currentQuestion.text,
                        });
                    }
                }

                currentQuestion = {
                    text: line,
                    answers: [],
                    correctAnswers: [],
                    startLine: lineNumber,
                };
            } else if (currentQuestion) {
                if (line.startsWith('*')) {
                    const answer = line.substring(1).trim();
                    currentQuestion.answers.push(answer);
                    currentQuestion.correctAnswers.push(answer);
                } else {
                    currentQuestion.answers.push(line);
                }
            }
        }

        if (currentQuestion) {
            if (validateQuestion(currentQuestion)) {
                currentSection.questions.push(currentQuestion);
                result.validQuestions.push(currentQuestion);
            } else {
                result.errors.push({
                    line: currentQuestion.startLine,
                    message: 'Câu hỏi thiếu đáp án đúng hoặc không đủ đáp án',
                    question: currentQuestion.text,
                });
            }
        }

        return result;
    };

    const validateQuestion = (q) => q.answers.length >= 2 && q.correctAnswers.length > 0;

    const handleParse = () => {
        const parsed = parseQuestions(rawInput);
        setResults(parsed);
        setParsedHtml(renderResults(parsed));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageName(file.name);
        }
    };

    const handleExport = async () => {
        if (!results || results.validQuestions.length === 0) {
            alert('Không có câu hỏi hợp lệ để xuất!');
            return;
        }

        try {
            setLoading(true);
            nProgress.start()

            const formData = new FormData();
            formData.append('name', nameExam);
            formData.append('isPublic', JSON.stringify(isPublic));
            formData.append('timeLimit', timeLimit);
            formData.append('sections', JSON.stringify(results.sections));
            if (image) {
                formData.append('image', image);
            } else {
                Swal.fire({
                    title: "Ảnh đề thi không được để trống",
                    icon: "warning"
                })
                return
            }

            const response = await api.post(`/exams`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                Swal.fire({
                    title: "Thêm đề thi thành công",
                    icon: "success",
                    draggable: true
                });
                setNameExam('');
                setRawInput('');
                setResults(null);
                setParsedHtml('');
                setImage(null);
                setImageName('');
            } else {
                alert('Có lỗi xảy ra khi xuất đề!');
            }
        } catch (err) {
            Swal.fire({
                title: "Lỗi",
                text: err.response.data.message,
                icon: "error",
                draggable: true
            });
        } finally {
            setLoading(false);
            nProgress.done()
        }
    };

    const renderResults = (results) => {
        let html = '';

        if (results.errors.length > 0) {
            html += `<div class="alert alert-warning"><h5>${results.errors.length} lỗi cấu trúc</h5><ul>`;
            results.errors.forEach((err) => {
                html += `<li>Dòng ${err.line}: ${err.message}`;
                if (err.question) {
                    html += `<br/><small class="text-muted">"${err.question}"</small>`;
                }
                html += `</li>`;
            });
            html += '</ul></div>';
        }

        let total = 0;
        results.sections.forEach((section) => {
            if (section.questions.length > 0) {
                html += `<div class="card mb-4 border">
                    <div class="card-header bg-secondary text-white">${section.name}</div>
                    <div class="card-body">`;

                section.questions.forEach((q) => {
                    total++;
                    html += `<div class="card border question-card mb-3"><div class="card-body">
                        <h6>Câu ${total}: ${q.text}</h6><ul class="list-group">`;
                    q.answers.forEach((ans) => {
                        const isCorrect = q.correctAnswers.includes(ans);
                        html += `<li class="list-group-item ${isCorrect ? 'bg-success text-white' : ''}">
                            ${isCorrect ? '' : ''}${ans}
                            </li>`;
                    });
                    html += '</ul></div></div>';
                });

                html += '</div></div>';
            }
        });

        if (total === 0) {
            html += `<div class="alert alert-danger">Không có câu hỏi hợp lệ!</div>`;
        } else {
            html = `<div class="alert alert-success">Đã phân tích ${total} câu hỏi hợp lệ</div>` + html;
        }

        return html;
    };

    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="card">
                                    <div className="card-header bg-primary text-white">Nhập tên đề thi</div>
                                    <div className="card-body">
                                        <input
                                            type="text"
                                            className="form-control rounded"
                                            placeholder="Nhập tên đề thi"
                                            value={nameExam}
                                            onChange={(e) => setNameExam(e.target.value)}
                                        />

                                        <div className="mt-3">
                                            <input
                                                id="imageInput"
                                                type="file"
                                                className="form-control rounded"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            {imageName && (
                                                <small className="d-block text-muted mt-2">
                                                    ✓ Đã chọn: {imageName}
                                                </small>
                                            )}
                                        </div>

                                        <div className="input-group mb-3 mt-3">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Quyền riêng tư </label>
                                            <select
                                                value={isPublic}
                                                onChange={(e) => setIsPublic(e.target.value === 'true')}
                                                className="form-select"
                                                id="inputGroupSelect01"
                                            >
                                                <option value="true">Công khai</option>
                                                <option value="false">Chỉ mình tôi </option>
                                            </select>
                                        </div>
                                        <div className="input-group mb-3 mt-3">
                                            <label className="input-group-text" htmlFor="inputGroupSelect022">Giới hạn thời gian </label>
                                            <select
                                                value={timeLimit}
                                                onChange={(e) => setTimeLimit(e.target.value)}
                                                className="form-select"
                                                id="inputGroupSelect022"
                                            >
                                                <option value="10">10 phút</option>
                                                <option value="15">15 phút</option>
                                                <option value="30">30 phút</option>
                                                <option value="60">60 phút</option>
                                                <option value="90">90 phút</option>
                                                <option value="120">120 phút</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mt-3">
                                    <div className="card-header bg-primary text-white">Kết quả phân tích</div>
                                    <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                        <div dangerouslySetInnerHTML={{ __html: parsedHtml }}></div>
                                    </div>
                                </div>

                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleExport}
                                        disabled={!results || results.validQuestions.length === 0 || loading}
                                    >
                                        {loading ? 'Đang xuất...' : 'Xuất Đề Thi'}
                                    </button>
                                </div>
                            </div>

                            <div className="col-md-6">


                                <div className="card">
                                    <div className="card-header bg-primary text-white">Nhập dữ liệu câu hỏi</div>
                                    <div className="card-body">
                                        <textarea
                                            className="form-control"
                                            rows="15"
                                            placeholder="Nhập dữ liệu câu hỏi:

                                                    Câu 1: Nội dung câu hỏi?
                                                    Đáp án 1
                                                    *Đáp án đúng (thêm * ở đầu)
                                                    Đáp án 3

                                                    Câu 2: Câu hỏi thứ 2?
                                                    *Đáp án đúng
                                                    Đáp án sai

                                                    'Tên phần thi mới (bắt đầu bằng ')
                                                    Câu 3: Câu hỏi phần mới?
                                                    *Đáp án đúng
                                                    Đáp án 2
                                                    Đáp án 3"
                                            value={rawInput}
                                            onChange={(e) => setRawInput(e.target.value)}
                                        ></textarea>
                                        <button className="btn btn-primary w-100 mt-3" onClick={handleParse}>
                                            Phân tích và xem trước
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}