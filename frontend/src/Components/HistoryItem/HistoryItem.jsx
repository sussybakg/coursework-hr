import { useState, useCallback } from "react";
import "./HistoryItem.css";
import {API_BASE} from "../../api/api.js";

const getActionColor = (action) => {
    switch (action) {
        case "Создан": return "#28a745";
        case "Обновлен": return "#ffc107";
        case "Удален": return "#dc3545";
        default: return "#6c757d";
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const formatDateOnly = (dateString) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
};

const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "Не указано";
    return new Intl.NumberFormat("ru-BY", {
        style: "currency",
        currency: "BYN",
        minimumFractionDigits: 0
    }).format(amount);
};

const HistoryItem = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <div className={`history-item ${isExpanded ? 'expanded' : ''}`}>
            <div className="history-item-header clickable" onClick={toggleExpand}>
                <div className="header-left">
                    <span className="action-badge" style={{ backgroundColor: getActionColor(item.action) }}>
                        {item.action}
                    </span>
                    <span className="entity-type">{item.entity}</span>
                </div>
                <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
            </div>

            <div className="history-item-body">
                <div className="entity-name"><strong>{item.entityName}</strong></div>
                <div className="history-meta">
                    <span className="user">Пользователь: {item.user}</span>
                    <span className="timestamp">{formatDate(item.timestamp)}</span>
                </div>
            </div>

            <div className={`history-item-details ${isExpanded ? 'expanded' : ''}`}>
                <div className="details-content">
                    <div className="data-state-info">
                        {item.action === "Создан" && <span className="state-badge state-after">Данные после создания</span>}
                        {item.action === "Обновлен" && <span className="state-badge state-before">Данные до обновления</span>}
                        {item.action === "Удален" && <span className="state-badge state-before">Данные до удаления</span>}
                    </div>
                    <div className="details-section">
                        <h4>Основная информация</h4>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">ID работника:</span>
                                <span className="detail-value">{item.workerId ?? "Не указано"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{item.email ?? "Не указано"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Возраст:</span>
                                <span className="detail-value">{item.age ?? "Не указано"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Должность:</span>
                                <span className="detail-value">{item.position ?? "Не указано"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Отдел:</span>
                                <span className="detail-value">{item.department ?? "Не указано"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Дата найма:</span>
                                <span className="detail-value">{formatDateOnly(item.hireDate)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Зарплата:</span>
                                <span className="detail-value">{formatCurrency(item.salary)}</span>
                            </div>
                            {item.avatarUrl && (
                                <div className="detail-item full-width">
                                    <span className="detail-label">Аватар:</span>
                                    <span className="detail-value">
                                            <img
                                                src={`${API_BASE || 'http://localhost:8080/'}${item.avatarUrl}`}
                                                alt={`${item.avatarUrl}`}
                                                className="avatar-img"
                                            />
                                    </span>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryItem;
