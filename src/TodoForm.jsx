import React from "react";
import styles from "./TodoForm.module.css";

class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      importance: "low",
      errorMessageTitle: "",
      errorMessageDescription: "",
      errorMessageBoth: "",
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });

    // Очищаем сообщения об ошибках, если они исправлены
    if (name === "name" && value.trim() !== "") {
      this.setState({ errorMessageTitle: "" });
    }
    if (name === "description" && value.trim() !== "") {
      this.setState({ errorMessageDescription: "" });
    }
    if (name === "name" || name === "description") {
      this.setState({ errorMessageBoth: "" });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, importance } = this.state;

    if (name.trim() === "" && description.trim() === "") {
      this.setState({ errorMessageBoth: "Заголовок и описание не могут быть пустыми ❤️" });
      return;
    }

    if (name.trim() === "") {
      this.setState({ errorMessageTitle: "Заголовок не может быть пустым ❤️" });
      return;
    }

    if (description.trim() === "") {
      this.setState({ errorMessageDescription: "Описание не может быть пустым ❤️" });
      return;
    }

    const newTodo = {
      id: Date.now(),
      name,
      description,
      checked: false,
      createdAt: new Date().toLocaleString(),
      importance,
    };

    this.props.onTodoAdd(newTodo);
    this.setState({
      name: "",
      description: "",
      importance: "low",
      errorMessageTitle: "",
      errorMessageDescription: "",
      errorMessageBoth: "",
    });
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    } else if (e.key === " ") {
      e.preventDefault();
      this.handleSubmit(e);
    }
  };

  render() {
    const { name, description, importance, errorMessageTitle, errorMessageDescription, errorMessageBoth } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className={styles.todoForm}>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            placeholder="Заголовок"
            className={styles.inputField}
          />
          {errorMessageTitle && <span className={styles.errorMessage}>{errorMessageTitle}</span>}
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="description"
            value={description}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            placeholder="Описание"
            className={styles.inputField}
          />
          {errorMessageDescription && <span className={styles.errorMessage}>{errorMessageDescription}</span>}
        </div>
        <div className={styles.formGroup}>
          <div className={styles.importanceAndButtons}>
            <div className={styles.importanceContainer}>
              <p className={styles.importanceTitle}>Важность выполнения задачи</p>
              <label>
                <input
                  type="radio"
                  name="importance"
                  value="high"
                  checked={importance === "high"}
                  onChange={this.handleInputChange}
                  className={styles.radio}
                />
                Срочно
              </label>
              <label>
                <input
                  type="radio"
                  name="importance"
                  value="medium"
                  checked={importance === "medium"}
                  onChange={this.handleInputChange}
                  className={styles.radio}
                />
                Средне
              </label>
              <label>
                <input
                  type="radio"
                  name="importance"
                  value="low"
                  checked={importance === "low"}
                  onChange={this.handleInputChange}
                  className={styles.radio}
                />
                Не срочно
              </label>
            </div>
            <div className={styles.buttonsContainer}>
              <button type="submit" className={styles.submitButton}>
                Создать задачу
              </button>
              <button type="button" onClick={this.props.onGenerateTasks} className={styles.generateButton}>
                Добавить 1000 задач
              </button>
            </div>
          </div>
        </div>
        {errorMessageBoth && <span className={styles.errorMessage}>{errorMessageBoth}</span>}
      </form>
    );
  }
}

export default TodoForm;