import {NavLink, Outlet, useNavigate} from "react-router-dom";
import PageAnimate from "../../../components/Animate/PageAnimate";
import {getSession} from "../../../utils/cacheHelper";

const DashboardAdmin = () => {

    const session = getSession();
    // const navigate = useNavigate();

    if (session) {
        return (
            <PageAnimate>
                
                <header className={"flex gap-6 font-bold text-xl capitalize"}>
                    {navs.map((nav, index) => (
                        <div key={index} className="nav">
                            <NavLink to={`${nav.link}`}>{nav.name}</NavLink>
                        </div>
                    ))}
                </header>

                <Outlet />

            </PageAnimate>
        );
    } else (<></>);

}

export default DashboardAdmin;

/* -------------- */

const navs = [
    {
        name: "Shop",
        link: '/home/shop',
    },
    {
        name: "My Orders",
        link: '/orders',
    },
    {
        name: "Help",
        link: '/help',
    },
]
