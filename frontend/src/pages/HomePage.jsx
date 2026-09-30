import {useCallback, useEffect, useMemo, useState} from "react";
import WorkerGrid from "../Components/WorkerGrid/WorkerGrid.jsx";
import WorkerFilters from "../Components/WorkerFilters/WorkerFilters.jsx";
import {deleteWorker, getWorkers} from "../api/workers.js";
import {useModal} from "../Components/ModalProvider/ModalProvider.jsx";
import {useAuth} from "../context/AuthContext.jsx";

const SORTERS = {
    name: (a, b) => (a.name || "").localeCompare(b.name || "", "ru", {sensitivity: "base"}),
    hireDate: (a, b) => new Date(b.hireDate || 0) - new Date(a.hireDate || 0),
    salary: (a, b) => (Number(b.salary) || 0) - (Number(a.salary) || 0),
    age: (a, b) => (Number(b.age) || 0) - (Number(a.age) || 0)
};

const HomePage = () => {
    const {user} = useAuth();
    const {openModal} = useModal();

    const [allWorkers, setAllWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [positionFilter, setPositionFilter] = useState("");
    const [sortBy, setSortBy] = useState("");

    const isAdmin = user?.role === "ADMIN";

    const loadWorkers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getWorkers();
            setAllWorkers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || "Ошибка загрузки сотрудников");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWorkers();
    }, [loadWorkers]);

    const {departments, positions} = useMemo(() => {
        const d = new Set();
        const p = new Set();
        allWorkers.forEach(w => {
            if (w.department) d.add(w.department);
            if (w.position) p.add(w.position);
        });
        return {
            departments: [...d].sort(),
            positions: [...p].sort()
        };
    }, [allWorkers]);

    const filteredWorkers = useMemo(() => {
        const query = searchQuery.toLowerCase();

        return allWorkers.filter(worker => {
            if (query) {
                const matches =
                    worker.name?.toLowerCase().includes(query) ||
                    worker.position?.toLowerCase().includes(query) ||
                    worker.department?.toLowerCase().includes(query) ||
                    (isAdmin && worker.email?.toLowerCase().includes(query));

                if (!matches) return false;
            }

            if (departmentFilter && worker.department !== departmentFilter) return false;
            if (positionFilter && worker.position !== positionFilter) return false;

            return true;
        });
    }, [allWorkers, searchQuery, departmentFilter, positionFilter, isAdmin]);

    const displayedWorkers = useMemo(() => {
        if (!sortBy) return filteredWorkers;
        return [...filteredWorkers].sort(SORTERS[sortBy] || (() => 0));
    }, [filteredWorkers, sortBy]);

    const handleAdd = () => openModal("add", {onSuccess: loadWorkers});
    const handleEdit = (worker) => openModal("edit", {worker, onSuccess: loadWorkers});
    const handleView = (worker) => openModal("view", {worker});

    const handleDelete = (worker) => {
        if (worker.userId === user?.id) {
            alert("Нельзя удалить свой собственный профиль");
            return;
        }

        openModal("delete", {
            worker,
            onDelete: async (w) => {
                await deleteWorker(w.id);
                setAllWorkers(prev => prev.filter(x => x.id !== w.id));
            }
        });
    };

    return (
        <main className="container main">
            <div className="content">
                <WorkerFilters
                    currentUser={user}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    departmentFilter={departmentFilter}
                    onDepartmentChange={setDepartmentFilter}
                    positionFilter={positionFilter}
                    onPositionChange={setPositionFilter}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    departments={departments}
                    positions={positions}
                    totalCount={allWorkers.length}
                    filteredCount={filteredWorkers.length}
                    setModalActive={handleAdd}
                />

                <div className="line"/>

                <WorkerGrid
                    currentUser={user}
                    workers={displayedWorkers}
                    loading={loading}
                    error={error}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                />
            </div>
        </main>
    );
};

export default HomePage;
