import {memo} from 'react';
import './WorkerFilters.css';
import {CiUser} from "react-icons/ci";
import {isAdmin} from '../../utils/role';

const WorkerFilters = memo((props) => {
    const {
        currentUser,
        searchQuery,
        onSearchChange,
        departmentFilter,
        onDepartmentChange,
        positionFilter,
        onPositionChange,
        sortBy,
        onSortChange,
        departments,
        positions,
        totalCount,
        filteredCount,
        setModalActive
    } = props;

    const admin = isAdmin(currentUser);

    const renderSelect = (id, label, value, onChange, options, defaultText) => (
        <div className='field'>
            <label htmlFor={id}>{label}</label>
            <select
                id={id}
                className='select'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label={label}
            >
                <option value="">{defaultText}</option>

                {options.map(opt => {
                    const optionValue = typeof opt === "string" ? opt : opt.value;
                    const optionLabel = typeof opt === "string" ? opt : opt.label;

                    return (
                        <option key={optionValue} value={optionValue}>
                            {optionLabel}
                        </option>
                    );
                })}
            </select>
        </div>
    );

    const baseSortOptions = [
        {value: "name", label: "По имени (А-Я)"},
        {value: "hireDate", label: "По дате приёма (новые сначала)"},
        {value: "age", label: "По возрасту (старше сначала)"}
    ];

    const salarySortOption = {value: "salary", label: "По зарплате (больше сначала)"};

    const sortOptions = admin
        ? [...baseSortOptions, salarySortOption]
        : baseSortOptions;


    return (
        <div className='filters-container'>
            <div className='filters-header'>
                <div>
                    <p className="eyebrow">Команда</p>
                    <h2>Каталог сотрудников</h2>
                    <p className='count-info'>Показано {filteredCount} из {totalCount} сотрудников</p>
                </div>
                {admin && (
                    <button className='add-btn' onClick={() => setModalActive(true)}>
                        <CiUser size={16}/>
                        <p>Добавить сотрудника</p>
                    </button>
                )}
            </div>

            <div className='filters-grid'>
                <div className='field'>
                    <label htmlFor="search-input">Поиск</label>
                    <input
                        id="search-input"
                        className='input'
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Имя, должность, отдел или email"
                        aria-label="Поиск по сотрудникам"
                    />
                </div>

                {renderSelect("department-select", "Отдел", departmentFilter, onDepartmentChange, departments, "Все отделы")}
                {renderSelect("position-select", "Должность", positionFilter, onPositionChange, positions, "Все должности")}
                {renderSelect(
                    "sort-select",
                    "Сортировка",
                    sortBy,
                    onSortChange,
                    sortOptions,
                    "Без сортировки"
                )}
            </div>
        </div>
    );
});

WorkerFilters.displayName = 'WorkerFilters';

export default WorkerFilters;
