import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                        <span className="menu-title">Trang chủ </span>
                        <i className="mdi mdi-home menu-icon"></i>
                    </Link>
                </li>
                <li className="nav-item">
                    <div>
                        <Link to="/them-bai-thi" className="nav-link">
                            <span className="menu-title">Tạo bài thi </span>
                            <i className="fa fa-plus-square-o menu-icon"></i></Link>
                    </div>
                </li>
                <li className="nav-item">
                    <div>
                        <Link to="/danh-sach-bai-thi" className="nav-link">
                            <span className="menu-title">Danh sách bài thi </span>
                            <i className="fa fa-list menu-icon"></i></Link>
                    </div>
                </li>
            </ul>
        </nav>
    )
}