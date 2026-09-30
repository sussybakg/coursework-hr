import './WorkerGrid.css';
import WorkerCard from "../WorkerCard/WorkerCard.jsx";

const WorkerGrid = ({
                        currentUser,
                        workers = [],
                        loading = false,
                        error = null,
                        onEdit,
                        onDelete,
                        onView
                    }) => {
    if (loading) {
        return (
            <div className="container grid">
                <div className="grid-loader">Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container grid">
                <div className="grid-error">{error}</div>
            </div>
        );
    }

    if (!workers.length) {
        return (
            <div className="container grid">
                <div className="empty-grid">
                    <div className="empty-card">
                        <p className="empty-title">Никого не нашли</p>
                        <p className="empty-subtitle">
                            Попробуйте изменить фильтры или добавить нового сотрудника.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container grid">
            {workers.map(worker => (
                <WorkerCard
                    key={worker.id}
                    currentUser={currentUser}
                    worker={worker}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            ))}
        </div>
    );
};

export default WorkerGrid;
