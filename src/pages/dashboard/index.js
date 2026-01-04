import Header from "../../components/layouts/header";
import NavBar from "../../components/layouts/navBar";
import ContentDashBoard from "./content";

export default function DashBoard() {
    return (
        <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
                <NavBar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <ContentDashBoard />
                    </div>
                </div>
            </div>
        </div>
    )
}
