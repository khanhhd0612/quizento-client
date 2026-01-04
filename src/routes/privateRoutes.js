import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const CheckLogin = ({ children }) => {
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Bạn cần đăng nhập để sử dụng chức năng này!",
            }).then(() => {
                setRedirect(true);
            });
        }
    }, []);

    if (redirect) {
        return <Navigate to="/dang-nhap" />;
    }

    const token = Cookies.get("token");
    if (!token) return null;

    return children;
};

export default CheckLogin;
