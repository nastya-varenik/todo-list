import React from "react";
import TodoForm from "../src/TodoForm.jsx";
import TodoList from "../src/TodoList.jsx";
import Filter from "../src/Filter.jsx";
import Chance from "chance";
import styles from "./App.module.css";
import { handleScroll, handleGenerateTasks } from "../src/utils.jsx"; // Обновленный импорт

const chance = new Chance();
const TASKS_PER_PAGE = 15; // Количество задач на странице
const VISIBLE_TASKS_THRESHOLD = 10; // Количество видимых задач, после которых подгружаем новые

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      todos: [],
      showOnlyUncompleted: false,
      sortOldestFirst: false,
      searchQuery: "",
      selectedImportance: [],
      errorMessageTitle: "",
      errorMessageDescription: "",
      errorMessageBoth: "",
      currentPage: 1, // Текущая страница
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    handleScroll(this.state, this.setState.bind(this));
  };

  handleTodoAdd = (todo) => {
    this.setState({
      todos: [todo, ...this.state.todos],
    });
  };

  handleTodoChecked = (id) => (e) => {
    const newTodo = { ...this.state.todos.find(todo => todo.id === id), checked: e.target.checked };
    const newTodos = this.state.todos.map(todo => (todo.id === id ? newTodo : todo));
  
    this.setState((prevState) => ({
      todos: newTodos,
      showOnlyUncompleted: prevState.showOnlyUncompleted && newTodos.filter(todo => !todo.checked).length > 0 ? true : false,
    }));
  };

  handleTodoDelete = (id) => () => {
    const newTodos = this.state.todos.filter(todo => todo.id !== id);
    this.setState({
      todos: newTodos,
    });
  };

  handleTodoEdit = (id, updatedTodo) => {
    const newTodos = this.state.todos.map(todo => (todo.id === id ? { ...todo, ...updatedTodo } : todo));
    this.setState({
      todos: newTodos,
    });
  };

  handleFilterChange = (filterName, value) => {
    this.setState({
      [filterName]: value,
      currentPage: 1, // Сбрасываем текущую страницу при изменении фильтров
    });
  };

  handleGenerateTasks = () => {
    handleGenerateTasks(this.state, this.setState.bind(this));
  };

  render() {
    const { showOnlyUncompleted, sortOldestFirst, searchQuery, selectedImportance, errorMessageTitle, errorMessageDescription, errorMessageBoth, currentPage } = this.state;

    let filteredTodos = this.state.todos;

    // Фильтр по подстроке
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTodos = filteredTodos.filter(todo =>
        todo.name.toLowerCase().includes(query) || todo.description.toLowerCase().includes(query)
      );
    }

    // Фильтр по важности
    if (selectedImportance.length > 0) {
      filteredTodos = filteredTodos.filter(todo =>
        selectedImportance.includes(todo.importance)
      );
    }

    // Фильтр "Скрыть выполненные"
    if (showOnlyUncompleted) {
      filteredTodos = filteredTodos.filter(todo => !todo.checked);
    }

    if (sortOldestFirst) {
      filteredTodos = filteredTodos.slice().reverse();
    }

    // Ограничиваем количество задач на текущей странице
    const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
    const endIndex = startIndex + TASKS_PER_PAGE;
    const displayedTodos = filteredTodos.slice(0, endIndex);

    // Проверка, применены ли фильтры и есть ли задачи, соответствующие критериям
    const hasFiltersApplied = searchQuery || selectedImportance.length > 0 || showOnlyUncompleted || sortOldestFirst;
    const noTasksFound = hasFiltersApplied && displayedTodos.length === 0;

    return (
      <div className={styles.appContainer}>
        <div className={styles.nameofapp}>
          <h1 className="text-3xl font-bold text-center">TODO LIST</h1>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.formAndButtons}>
            <TodoForm onTodoAdd={this.handleTodoAdd} onGenerateTasks={this.handleGenerateTasks} />
          </div>
          <div className={styles.filtersContainer}>
            <h2 className={styles.filtersTitle}>Фильтры</h2>
            <Filter
              showOnlyUncompleted={showOnlyUncompleted}
              sortOldestFirst={sortOldestFirst}
              searchQuery={searchQuery}
              selectedImportance={selectedImportance}
              onFilterChange={this.handleFilterChange}
              onGenerateTasks={this.handleGenerateTasks}
            />
          </div>
        </div>
        <hr className={styles.divider} />
        <div className={styles.mainContent}>
          {noTasksFound ? (
            <div className={styles.noTasksFound}>По вашим критериям ничего не найдено</div>
          ) : displayedTodos.length > 0 ? (
            <TodoList
              todos={displayedTodos}
              onTodoChecked={this.handleTodoChecked}
              onTodoDelete={this.handleTodoDelete}
              onTodoEdit={this.handleTodoEdit}
            />
          ) : (
            <div className={styles.noTasksFound}>Добавьте первую задачу</div>
          )}
        </div>
      </div>
    );
  }
}

export default App;