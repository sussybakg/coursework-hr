import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {login, register} = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        if (!username || username.trim().length < 3) {
            return "Имя пользователя должно содержать минимум 3 символа";
        }
        if (!isLogin && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            return "Введите корректный email адрес";
        }
        if (!password || password.length < 8) {
            return "Пароль должен содержать минимум 8 символов";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const result = isLogin
                ? await login(username.trim(), password)
                : await register(username.trim(), email.trim(), password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Произошла ошибка');
            }
        } catch {
            setError('Произошла ошибка при выполнении запроса');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Введите имя пользователя"
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Введите email"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Введите пароль"
                            minLength={8}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                </form>

                <div className="switch-mode">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setEmail('');
                        }}
                        className="switch-btn"
                    >
                        {isLogin
                            ? 'Нет аккаунта? Зарегистрироваться'
                            : 'Уже есть аккаунт? Войти'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
