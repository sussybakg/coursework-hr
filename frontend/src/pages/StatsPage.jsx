import {useEffect, useState} from "react";
import {getStats} from "../api/workers.js";
import Loader from "../Components/Common/Loader/Loader.jsx";
import ErrorMessage from "../Components/Common/ErrorMessage/ErrorMessage.jsx";
import "./StatsPage.css";

const StatCard = ({title, value}) => (
    <div className="stat-card">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value ?? "—"}</div>
    </div>
);

const StatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getStats();
                setStats(data);
            } catch (e) {
                setError(e.message || "Не удалось загрузить статистику");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <main className="container main">
                <Loader/>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container main">
                <ErrorMessage message={error}/>
            </main>
        );
    }

    const formatCurrency = (value) => {
        if (value === null || value === undefined) return "—";
        return new Intl.NumberFormat("ru-BY", {
            style: "currency",
            currency: "BYN",
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (value) => {
        if (!value) return "—";
        try {
            return new Date(value).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        } catch {
            return "—";
        }
    };

    return (
        <main className="container main">
            <div className="content">
                <div className="stats-header">
                    <h2>Статистика</h2>
                    <p>Краткий обзор ключевых показателей по сотрудникам</p>
                </div>

                <div className="stats-grid">
                    <StatCard title="Всего сотрудников" value={stats.totalWorkers}/>
                    <StatCard title="Отделы" value={stats.uniqueDepartments}/>
                    <StatCard title="Должности" value={stats.uniquePositions}/>
                    <StatCard title="Средняя зарплата" value={formatCurrency(stats.averageSalary)}/>
                    <StatCard title="Мин. зарплата" value={formatCurrency(stats.minSalary)}/>
                    <StatCard title="Макс. зарплата" value={formatCurrency(stats.maxSalary)}/>
                    <StatCard title="Самый ранний найм" value={formatDate(stats.earliestHireDate)}/>
                    <StatCard title="Самый поздний найм" value={formatDate(stats.latestHireDate)}/>
                </div>

                {stats.departmentStats && stats.departmentStats.length > 0 && (
                    <div className="dept-section">
                        <h3>Отделы</h3>
                        <p className="dept-hint">Численность и средняя зарплата по отделам</p>
                        <div className="dept-table">
                            <div className="dept-row header">
                                <span>Отдел</span>
                                <span>Сотрудников</span>
                                <span>Средняя зарплата</span>
                            </div>
                            {stats.departmentStats.map((dep) => (
                                <div key={dep.department} className="dept-row">
                                    <span className="no-label">{dep.department || "Не указан"}</span>
                                    <span data-label="Сотрудников">{dep.employees}</span>
                                    <span data-label="Средняя зарплата">{formatCurrency(dep.averageSalary)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default StatsPage;

