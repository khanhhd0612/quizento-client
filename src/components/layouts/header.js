import React, { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

export default function Header() {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [isLogin, setIsLogin] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const dropdownRef = useRef(null)

    useEffect(() => {
        const token = Cookies.get("token")
        setIsLogin(!!token)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (query) {
            navigate(`/tim-kiem?q=${query}`)
        }
    }

    const handleLogout = () => {
        Cookies.remove("token")
        window.location = "/dang-nhap"
    }

    const handleClickFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Lỗi khi bật full screen: ${err.message}`)
            })
        } else {
            document.exitFullscreen()
        }
    }

    const toggleClick = () => {
        const body = document.body
        body.classList.toggle("sidebar-icon-only")
    }

    const handleClickNavBar = () => {
        setIsSidebarOpen(!isSidebarOpen)
        document.getElementById('sidebar')?.classList.toggle('active')
    }

    const handleClickUser = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    return (
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
                <Link to="/" className="navbar-brand brand-logo">
                    <img src={process.env.PUBLIC_URL + "/assets/images/logo.jpg"} alt="logo" />
                </Link>
                <Link to="/" className="navbar-brand brand-logo-mini">
                    <img src={process.env.PUBLIC_URL + "/assets/images/logo-mini.svg"} alt="logo" />
                </Link>
            </div>
            <div className="navbar-menu-wrapper d-flex align-items-stretch">
                <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={toggleClick}>
                    <span className="mdi mdi-menu"></span>
                </button>
                <div className="search-field d-none d-md-block">
                    <form className="d-flex align-items-center h-100" onSubmit={handleSearch}>
                        <div className="input-group">
                            <div className="input-group-prepend bg-transparent">
                                <i className="input-group-text border-0 mdi mdi-magnify"></i>
                            </div>
                            <input
                                type="text"
                                className="form-control bg-transparent border-0"
                                placeholder="Tìm kiếm..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                required
                            />
                        </div>
                    </form>
                </div>
                <ul className="navbar-nav navbar-nav-right">
                    {isLogin ? (
                        <li className="nav-item nav-profile dropdown" ref={dropdownRef}>
                            <button className="nav-link" id="profileDropdown" onClick={handleClickUser}>
                                <div className="nav-profile-img">
                                    <img src={process.env.PUBLIC_URL + "/assets/images/user_img.png"} alt="user" />
                                    <span className="availability-status online"></span>
                                </div>
                            </button>
                            <div className={`dropdown-menu navbar-dropdown ${isDropdownOpen ? "show" : ""}`}>
                                <Link to="/thong-tin-nguoi-dung" className="dropdown-item">
                                    <i className="mdi mdi-cached me-2 text-success"></i> Hồ sơ
                                </Link>
                                <button onClick={handleLogout} className="dropdown-item">
                                    <i className="mdi mdi-logout me-2 text-primary"></i> Đăng xuất
                                </button>
                            </div>
                        </li>
                    ) : (
                        <li>
                            <p className="p-3 d-none d-md-inline">Bạn chưa đăng nhập</p>
                            <Link to="/dang-nhap" className="btn btn-primary">Đăng nhập</Link>
                        </li>
                    )
                    }
                    <li className="nav-item d-none d-lg-block full-screen-link">
                        <button className="nav-link">
                            <i className="mdi mdi-fullscreen" onClick={handleClickFullScreen}></i>
                        </button>
                    </li>
                </ul>
                <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button"
                    onClick={handleClickNavBar}>
                    <span className="mdi mdi-menu"></span>
                </button>
            </div>
        </nav>
    )
}
