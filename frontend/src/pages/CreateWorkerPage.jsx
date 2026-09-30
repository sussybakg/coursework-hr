import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {createSelfWorker} from "../api/workers.js";
import Loader from "../Components/Common/Loader/Loader.jsx";

const CreateWorkerPage = () => {
    const {user, setWorker} = useAuth();
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        name: "",
        age: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormState(prev => ({...prev, [name]: value}));
        if (error) setError(null);
    };

    const validateForm = () => {
        if (!formState.name || formState.name.trim().length < 2) {
            return "Имя должно содержать минимум 2 символа";
        }
        const age = parseInt(formState.age);
        if (isNaN(age) || age < 16 || age > 100) {
            return "Возраст должен быть от 16 до 100 лет";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const worker = await createSelfWorker({
                name: formState.name.trim(),
                age: parseInt(formState.age),
                email: user.email
            });
            setWorker(worker);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Ошибка при создании работника");
            setLoading(false);
        }
    };
    if (!user) return null;

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Завершите регистрацию</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="worker-name">Имя и фамилия</label>
                        <input
                            id="worker-name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            placeholder="Иванов Иван"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="worker-age">Возраст</label>
                        <input
                            id="worker-age"
                            name="age"
                            type="number"
                            value={formState.age}
                            onChange={handleChange}
                            placeholder="18"
                            min="16"
                            max="100"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="worker-email">Email</label>
                        <input
                            id="worker-email"
                            name="email"
                            value={user.email}
                            disabled
                            className="disabled-input"
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Создание профиля..." : "Завершить регистрацию"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkerPage;