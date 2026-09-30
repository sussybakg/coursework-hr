import { useEffect, useRef, useState } from "react";
import { useModal } from "../../ModalProvider/ModalProvider.jsx";
import Modal from "../Modal/Modal.jsx";
import { CiUser } from "react-icons/ci";
import { createWorker, getWorkers, updateWorker, uploadAvatar } from "../../../api/workers.js";
import avatar from "../../../assets/avatar.jpg";
import { getAvatarUrl } from "../../../utils/avatar";
import { useAuth } from "../../../context/AuthContext";
import { isAdmin } from "../../../utils/role";

const getInitialFormState = (worker = null) => ({
    name: worker?.name || "",
    age: worker?.age !== undefined ? String(worker.age) : "",
    position: worker?.position || "",
    department: worker?.department || "",
    email: worker?.email || "",
    salary: worker?.salary !== undefined ? String(worker.salary) : "",
    hireDate: worker?.hireDate || new Date().toISOString().split("T")[0]
});

const ModalContainer = () => {
    const { modalType, modalProps, closeModal } = useModal();
    const { worker: contextWorker, updateWorkerInContext, user } = useAuth();
    const isCurrentUser = modalProps?.isCurrentUser || false;
    const worker = isCurrentUser && contextWorker ? contextWorker : modalProps?.worker;
    const admin = isAdmin(user);

    const canChangeAvatarInEdit = admin || isCurrentUser;
    const canChangeAvatarInView = isCurrentUser;

    const FALLBACK_TEXT = "Данные не установлены";

    const fileInputRef = useRef(null);

    const [formState, setFormState] = useState(() => getInitialFormState());
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        if (!modalType) return;
        setError(null);
        setSelectedAvatarFile(null);
        setAvatarPreview(null);
        setFormState(getInitialFormState(modalType === "edit" ? worker : null));
    }, [modalType, worker]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleAvatarClick = (mode) => {
        const canChange = (mode === "edit" && canChangeAvatarInEdit) || (mode === "view" && canChangeAvatarInView);
        if (canChange && fileInputRef.current) fileInputRef.current.click();
    };

    const handleAvatarFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!file.type.startsWith("image/") || !validImageTypes.includes(file.type.toLowerCase())) {
            setError("Поддерживаются только форматы: JPEG, PNG, GIF, WebP");
            e.target.value = "";
            return;
        }
        if (file.size === 0 || file.size > 5 * 1024 * 1024) {
            setError("Размер файла должен быть от 1 байта до 5MB");
            e.target.value = "";
            return;
        }

        setSelectedAvatarFile(file);
        setError(null);

        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.onerror = () => {
            setError("Ошибка при чтении файла");
            e.target.value = "";
        };
        reader.readAsDataURL(file);
    };

    const saveAvatar = async (workerId) => {
        if (!selectedAvatarFile || !workerId) return;
        setUploadingAvatar(true);
        setError(null);
        try {
            await uploadAvatar(workerId, selectedAvatarFile);
            const updatedWorkers = await getWorkers();
            const updatedWorker = updatedWorkers.find(w => w.id === workerId);
            if (updatedWorker) updateWorkerInContext(updatedWorker);
            setSelectedAvatarFile(null);
            setAvatarPreview(null);
            modalProps.onSuccess?.();
        } catch (err) {
            setError(err.response?.data?.message || "Ошибка при загрузке аватара");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const validateForm = () => {
        if (!formState.name || formState.name.trim().length < 2) return "Имя должно содержать минимум 2 символа";
        const age = parseInt(formState.age);
        if (isNaN(age) || age < 1 || age > 150) return "Возраст должен быть от 1 до 150 лет";
        if (!formState.position || formState.position.trim().length < 2) return "Должность должна содержать минимум 2 символа";
        if (!formState.department || formState.department.trim().length < 2) return "Отдел должен содержать минимум 2 символа";
        if (!formState.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) return "Введите корректный email адрес";
        const salary = parseFloat(formState.salary);
        if (isNaN(salary) || salary < 0) return "Зарплата должна быть неотрицательным числом";
        if (!formState.hireDate) return "Выберите дату приёма";
        if (new Date(formState.hireDate) > new Date()) return "Дата приёма не может быть в будущем";
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

        const workerData = {
            ...formState,
            name: formState.name.trim(),
            position: formState.position.trim(),
            department: formState.department.trim(),
            email: formState.email.trim(),
            age: parseInt(formState.age),
            salary: parseFloat(formState.salary)
        };

        try {
            let savedWorker;
            if (worker?.id) {
                savedWorker = await updateWorker(worker.id, {
                    ...workerData,
                    avatar: selectedAvatarFile ? selectedAvatarFile : worker.avatarURL
                });
            } else {
                savedWorker = await createWorker(workerData);
            }

            modalProps.onSuccess?.();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.message || "Ошибка при сохранении данных");
        } finally {
            setLoading(false);
        }
    };


    const fallback = (value, text = FALLBACK_TEXT) => {
        return value !== null && value !== undefined && value !== ""
            ? value
            : text;
    };

    const currentAvatarSrc = avatarPreview || (worker && getAvatarUrl(worker.avatarURL)) || avatar;

    switch (modalType) {
        case "add":
        case "edit":
            const isEditMode = modalType === "edit";
            return (
                <Modal active={true} setActive={closeModal}>
                    <form className="form" onSubmit={handleSubmit}>
                        <h3>{worker ? "Редактирование сотрудника" : "Добавление сотрудника"}</h3>

                        {isEditMode && canChangeAvatarInEdit && (
                            <div className="edit-avatar-section">
                                <div className="edit-avatar-container">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <div
                                        className="edit-avatar-wrapper clickable"
                                        onClick={() => handleAvatarClick("edit")}
                                        title="Нажмите, чтобы изменить аватар"
                                    >
                                        <img src={currentAvatarSrc} alt={formState.name || "Аватар"} className="edit-avatar" onError={(e) => { e.target.src = avatar; }} />
                                        <div className="edit-avatar-overlay"><span>Изменить аватар</span></div>
                                    </div>
                                </div>
                                {selectedAvatarFile && (
                                    <div className="avatar-change-notice">
                                        <span>Аватар будет сохранён вместе с остальными данными</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && <div className="modal-error-message" role="alert">{error}</div>}

                        <ul>
                            <li>
                                <label htmlFor="modal-name">Имя:</label>
                                <input id="modal-name" className="modal-input" name="name" placeholder="Иванов Иван Иванович" value={formState.name} onChange={handleChange} required />
                            </li>
                            <li>
                                <label htmlFor="modal-age">Возраст:</label>
                                <input id="modal-age" className="modal-input" name="age" type="number" placeholder="18" value={formState.age} onChange={handleChange} min="16" max="100" required />
                            </li>
                            <li>
                                <label htmlFor="modal-position">Должность:</label>
                                <input id="modal-position" className="modal-input" name="position" placeholder="UI/UX инженер" value={formState.position} onChange={handleChange} required />
                            </li>
                            <li>
                                <label htmlFor="modal-department">Отдел:</label>
                                <input id="modal-department" className="modal-input" name="department" placeholder="Дизайн-отдел" value={formState.department} onChange={handleChange} required />
                            </li>
                            <li>
                                <label htmlFor="modal-email">Почта:</label>
                                <input id="modal-email" className="modal-input" name="email" type="email" placeholder="example@gmail.com" value={formState.email} onChange={handleChange} required />
                            </li>
                            <li>
                                <label htmlFor="modal-salary">Зарплата:</label>
                                <input id="modal-salary" className="modal-input" name="salary" type="number" step="0.01" placeholder="2000" value={formState.salary} onChange={handleChange} min="0" required />
                            </li>
                            <li>
                                <label htmlFor="modal-hireDate">Дата приёма:</label>
                                <input id="modal-hireDate" className="modal-input" name="hireDate" type="date" value={formState.hireDate} onChange={handleChange} max={new Date().toISOString().split("T")[0]} required />
                            </li>

                            <button type="submit" className="add-btn" disabled={loading || uploadingAvatar}>
                                <CiUser size={16} />
                                <p>{(loading || uploadingAvatar) ? "Сохранение..." : (worker ? "Сохранить изменения" : "Добавить сотрудника")}</p>
                            </button>
                        </ul>
                    </form>
                </Modal>
            );

        case "delete":
            return (
                <Modal active={true} setActive={closeModal}>
                    <h3>Подтверждение удаления</h3>
                    <p>Вы уверены, что хотите удалить сотрудника {worker?.name}?</p>
                    <div className="modal-actions">
                        <button
                            onClick={() => { modalProps.onDelete?.(worker); closeModal(); }}
                            className="add-btn delete-btn"
                        >Удалить</button>
                        <button onClick={closeModal} className="add-btn cancel-btn">Отмена</button>
                    </div>
                </Modal>
            );

        case "view":
            if (!worker) return null;

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

            const formattedSalary = salary
                ? `${salary} Br`
                : FALLBACK_TEXT;

            const viewAvatarSrc =
                avatarPreview || getAvatarUrl(avatarURL) || avatar;

            return (
                <Modal active={true} setActive={closeModal}>
                    <div className="view-modal">
                        <h3>Профиль сотрудника</h3>

                        <div className="view-avatar-container">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarFileChange}
                                style={{ display: "none" }}
                            />

                            <div
                                className={`view-avatar-wrapper ${canChangeAvatarInView ? "clickable" : ""}`}
                                onClick={() => handleAvatarClick("view")}
                                title={canChangeAvatarInView ? "Нажмите, чтобы изменить аватар" : ""}
                            >
                                <img
                                    src={viewAvatarSrc}
                                    alt={fallback(name, "Имя не указано")}
                                    className="view-avatar"
                                    onError={(e) => { e.target.src = avatar; }}
                                />
                                {canChangeAvatarInView && (
                                    <div className="view-avatar-overlay">
                                        <span>Изменить</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="modal-error-message" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="view-content">
                            <div className="view-field">
                                <strong>Имя:</strong>
                                <span>{fallback(name, "Имя не указано")}</span>
                            </div>

                            <div className="view-field">
                                <strong>Должность:</strong>
                                <span>{fallback(position)}</span>
                            </div>

                            <div className="view-field">
                                <strong>Отдел:</strong>
                                <span>{fallback(department)}</span>
                            </div>

                            {(admin || isCurrentUser) && (
                                <>
                                    <div className="view-field">
                                        <strong>ID:</strong>
                                        <span>{fallback(worker.id)}</span>
                                    </div>

                                    <div className="view-field">
                                        <strong>Почта:</strong>
                                        <span>{fallback(email)}</span>
                                    </div>

                                    <div className="view-field">
                                        <strong>Зарплата:</strong>
                                        <span>{formattedSalary}</span>
                                    </div>
                                </>
                            )}

                            <div className="view-field">
                                <strong>Возраст:</strong>
                                <span>{fallback(age)}</span>
                            </div>

                            <div className="view-field">
                                <strong>Дата приёма:</strong>
                                <span>{formattedHireDate}</span>
                            </div>
                        </div>

                        {selectedAvatarFile && canChangeAvatarInView && (
                            <div className="modal-actions" style={{ marginTop: "20px" }}>
                                <button
                                    className="add-btn"
                                    onClick={() => saveAvatar(worker.id)}
                                    disabled={uploadingAvatar}
                                >
                                    <CiUser size={16} />
                                    <p>{uploadingAvatar ? "Загрузка..." : "Сохранить аватар"}</p>
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedAvatarFile(null);
                                        setAvatarPreview(null);
                                        setError(null);
                                    }}
                                    className="add-btn cancel-btn"
                                >
                                    Отмена
                                </button>
                            </div>
                        )}
                    </div>
                </Modal>
            );


        default:
            return null;
    }
};

export default ModalContainer;