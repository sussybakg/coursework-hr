import "./WorkerCard.css";
import { CiEdit, CiTrash } from "react-icons/ci";
import { PiEyeThin } from "react-icons/pi";
import avatar from "../../assets/avatar.jpg";
import { isAdmin } from "../../utils/role";
import { getAvatarUrl } from "../../utils/avatar";

const FALLBACK_TEXT = "Данные не установлены";

const fallback = (value, text = FALLBACK_TEXT) => {
    return value !== null && value !== undefined && value !== ""
        ? value
        : text;
};

const WorkerCard = ({ currentUser, worker, onEdit, onDelete, onView }) => {
    if (!worker) return null;

    const admin = isAdmin(currentUser);
    const isCurrentUser = worker.userId === currentUser?.id;

    const {
        name,
        position,
        department,
        email,
        hireDate,
        salary,
        age,
        avatarURL
    } = worker;

    const formattedHireDate = hireDate
        ? new Date(hireDate).toLocaleDateString("ru-RU")
        : FALLBACK_TEXT;

    return (
        <article className="card">
            <header className="card-header">
                <div className="card-actions">
                    <button
                        className="card-btn"
                        onClick={() => onView?.(worker)}
                        title="Просмотр"
                        aria-label="Просмотр профиля сотрудника"
                    >
                        <PiEyeThin className="card-icon" />
                    </button>

                    {admin && (
                        <>
                            <button
                                className="card-btn edit"
                                onClick={() => onEdit?.(worker)}
                                title="Редактировать"
                                aria-label="Редактировать сотрудника"
                            >
                                <CiEdit className="card-icon" />
                            </button>

                            {!isCurrentUser && (
                                <button
                                    className="card-btn danger"
                                    onClick={() => onDelete?.(worker)}
                                    title="Удалить"
                                    aria-label="Удалить сотрудника"
                                >
                                    <CiTrash className="card-icon" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </header>

            <div className="avatar">
                <img
                    src={getAvatarUrl(avatarURL) || avatar}
                    alt={fallback(name, "Имя не указано")}
                    onError={(e) => {
                        e.target.src = avatar;
                    }}
                />
            </div>

            <div className="card-content">
                <h3 className="worker-name">
                    {fallback(name, "Имя не указано")}
                </h3>

                <p className="worker-position">
                    {fallback(position)}
                </p>

                <p className="worker-department">
                    {fallback(department)}
                </p>

                <div className="meta-grid">
                    {admin && (
                        <>
                            <div className="meta">
                                <span className="meta-label">Email:</span>
                                <span className="meta-value">
                                    {fallback(email)}
                                </span>
                            </div>

                            <div className="meta">
                                <span className="meta-label">Зарплата:</span>
                                <span className="meta-value">
                                    {salary ? `${salary} Br` : FALLBACK_TEXT}
                                </span>
                            </div>
                        </>
                    )}

                    <div className="meta">
                        <span className="meta-label">Возраст:</span>
                        <span className="meta-value">
                            {fallback(age)}
                        </span>
                    </div>

                    <div className="meta">
                        <span className="meta-label">Дата приёма:</span>
                        <span className="meta-value">
                            {formattedHireDate}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default WorkerCard;
