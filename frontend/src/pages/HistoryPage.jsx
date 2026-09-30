import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "../Components/Common/Loader/Loader.jsx";
import ErrorMessage from "../Components/Common/ErrorMessage/ErrorMessage.jsx";
import { getHistory } from "../api/workers.js";
import HistoryItem from "../Components/HistoryItem/HistoryItem.jsx";
import "./HistoryPage.css";

const HistoryPage = () => {
    const { isAuthenticated } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getHistory();
                setHistory(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Ошибка загрузки истории");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <main className="container main"><p>Для просмотра истории необходимо войти в систему</p></main>;
    }

    if (loading) return <main className="container main"><Loader /></main>;
    if (error) return <main className="container main"><ErrorMessage message={error} /></main>;

    return (
        <main className="container main">
            <div className="content">
                <h2>История изменений</h2>
                <div className="line"></div>

                {history.length === 0 ? (
                    <div className="empty-state"><p>История изменений пуста</p></div>
                ) : (
                    <div className="history-list">
                        {history.map(item => <HistoryItem key={item.id} item={item} />)}
                    </div>
                )}
            </div>
        </main>
    );
};

export default HistoryPage;
