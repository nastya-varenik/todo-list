import React from "react";
import styles from "./Todo.module.css";

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isEditing: false,
      editedName: props.todo.name,
      editedDescription: props.todo.description,
      editedImportance: props.todo.importance,
    };
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  handleEditClick = () => {
    this.setState({ isEditing: true });
  };

  handleSaveClick = () => {
    const { editedName, editedDescription, editedImportance } = this.state;
    const { todo, onTodoEdit } = this.props;
    onTodoEdit(todo.id, {
      name: editedName,
      description: editedDescription,
      importance: editedImportance,
    });
    this.setState({ isEditing: false });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { todo, onTodoChecked, onTodoDelete } = this.props;
    const { isHovered, isEditing, editedName, editedDescription, editedImportance } = this.state;

    // Определяем стиль для важности
    let importanceStyle = styles.importanceLow;
    if (todo.importance === "medium") {
      importanceStyle = styles.importanceMedium;
    } else if (todo.importance === "high") {
      importanceStyle = styles.importanceHigh;
    }

    return (
      <div
        className={`${styles.todoItem} ${todo.checked ? styles.completed : ""}`}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className={styles.todoContent}>
          <input
            type="checkbox"
            checked={todo.checked}
            onChange={onTodoChecked}
            className={styles.todoCheckbox}
          />
          <div className={styles.todoDetails}>
            <strong className={todo.checked ? styles.completedText : ""}>{todo.name}</strong>
            <span className={todo.checked ? styles.completedText : ""}>{todo.description}</span>
          </div>
          <div className={styles.todoInfo}>
            <small className={styles.todoCreatedAt}>Создано: {todo.createdAt}</small>
            <span className={`${styles.importanceLabel} ${importanceStyle}`}>
              {todo.importance === "high" ? "Срочно" : todo.importance === "medium" ? "Средне" : "Не срочно"}
            </span>
          </div>
        </div>
        {isHovered && !isEditing && (
          <div className={styles.buttonsContainer}>
            <button
              className={styles.editButton}
              onClick={this.handleEditClick}
            >
              Редактировать
            </button>
            <button
              className={styles.deleteButton}
              onClick={onTodoDelete}
            >
              Удалить
            </button>
          </div>
        )}
        {isEditing && (
          <div className={styles.editForm}>
            <input
              type="text"
              name="editedName"
              value={editedName}
              onChange={this.handleInputChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="editedDescription"
              value={editedDescription}
              onChange={this.handleInputChange}
              className={styles.inputField}
            />
            <div>
              <p>Важность выполнения задачи</p>
              <label>
                <input
                  type="radio"
                  name="editedImportance"
                  value="high"
                  checked={editedImportance === "high"}
                  onChange={this.handleInputChange}
                  className={styles.radio}
                />
                Срочно
              </label>
              <label>
                <input
                  type="radio"
                  name="editedImportance"
                  value="medium"
                  checked={editedImportance === "medium"}
                  onChange={this.handleInputChange}
                  className={styles.radio}
                />
                Средне
              </label>
              <label>
                <input
                  type="radio"
                  name="editedImportance"
                  value="low"
                  checked={editedImportance === "low"}
                  onChange={this.handleInputChange}
                  className={styles.radio}
                />
                Не срочно
              </label>
            </div>
            <button onClick={this.handleSaveClick} className={styles.saveButton}>
              Сохранить
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Todo;