import {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';
import {useAuth} from '../../context/AuthContext';
import {useModal} from "../ModalProvider/ModalProvider.jsx";
import {isAdmin} from '../../utils/role';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const {user, worker, isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {openModal, closeModal} = useModal();
    const admin = isAdmin(user);

    const closeMenu = () => setMenuOpen(false);
    const handleNavigate = (path) => {
        navigate(path);
        closeMenu();
    };
    const handleLogout = () => {
        closeModal();
        logout();
        navigate("/login");
        closeMenu();
    };
    const handleProfile = () => {
        if (worker) {
            openModal("view", {worker, isCurrentUser: true});
        } else {
            alert("Профиль сотрудника не найден");
        }
        closeMenu();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="container">
            <img
                src={logo}
                alt="Logo"
                className="logo logo-clickable"
                onClick={() => handleNavigate("/")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNavigate("/");
                    }
                }}
            />
            <button
                className="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Меню"
                aria-expanded={menuOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul className={menuOpen ? "nav-menu active" : "nav-menu"}>
                {isAuthenticated ? (
                    <>
                        {admin && (
                            <>
                                <li>
                                    <button
                                        className={`btn nav-btn ${isActive("/") ? "active" : ""}`}
                                        onClick={() => handleNavigate("/")}
                                    >
                                        На главную
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`btn nav-btn ${isActive("/history") ? "active" : ""}`}
                                        onClick={() => handleNavigate("/history")}
                                    >
                                        История изменений
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`btn nav-btn ${isActive("/stats") ? "active" : ""}`}
                                        onClick={() => handleNavigate("/stats")}
                                    >
                                        Статистика
                                    </button>
                                </li>
                            </>
                        )}
                        <li>
                            <button className="btn nav-btn profile-btn" onClick={handleProfile}>
                                Профиль
                            </button>
                        </li>
                        <li>
                            <button className="btn logout-btn" onClick={handleLogout}>Выйти</button>
                        </li>
                    </>
                ) : (
                    <></>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
