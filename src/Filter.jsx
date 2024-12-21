import React from "react";
import styles from "./Filter.module.css";
import { FaSearch } from "react-icons/fa";

class Filter extends React.Component {
  handleFilterChange = (filterName, value) => {
    this.props.onFilterChange(filterName, value);
  };

  render() {
    const { showOnlyUncompleted, sortOldestFirst, searchQuery, selectedImportance } = this.props;

    return (
      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
          <label>
            <input
              type="checkbox"
              checked={showOnlyUncompleted}
              onChange={(e) => this.handleFilterChange("showOnlyUncompleted", e.target.checked)}
              className={styles.filterCheckbox}
            />
            Скрыть выполненные
          </label>
          <label>
            <input
              type="checkbox"
              checked={sortOldestFirst}
              onChange={(e) => this.handleFilterChange("sortOldestFirst", e.target.checked)}
              className={styles.filterCheckbox}
            />
            Сначала старые задачи
          </label>
        </div>
        <div className={styles.filterGroup}>
          <label>
            Поиск:
            <div className={styles.searchInputContainer}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => this.handleFilterChange("searchQuery", e.target.value)}
                placeholder="Поиск по подстроке"
                className={styles.searchInput}
              />
            </div>
          </label>
        </div>
        <div className={styles.filterGroup}>
          <p>Важность выполнения</p>
          {["high", "medium", "low"].map(importance => (
            <label key={importance}>
              <input
                type="checkbox"
                value={importance}
                checked={selectedImportance.includes(importance)}
                onChange={(e) => this.handleFilterChange("selectedImportance", e.target.checked ? [...selectedImportance, e.target.value] : selectedImportance.filter(imp => imp !== e.target.value))}
                className={styles.filterCheckbox}
              />
              {importance === "high" ? "Срочно" : importance === "medium" ? "Средне" : "Не срочно"}
            </label>
          ))}
        </div>
      </div>
    );
  }
}

export default Filter;