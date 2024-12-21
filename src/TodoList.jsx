import React from "react";
import Todo from "./Todo";
import styles from "./TodoList.module.css";

class TodoList extends React.Component {
  render() {
    const { todos, onTodoChecked, onTodoDelete, onTodoEdit } = this.props;

    return (
      <div className={styles.todosContainer}>
        <ul>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <Todo
                key={todo.id}
                todo={todo}
                onTodoChecked={onTodoChecked(todo.id)}
                onTodoDelete={onTodoDelete(todo.id)}
                onTodoEdit={onTodoEdit}
              />
            ))
          ) : (
            <p>По вашим критериям ничего не найдено</p>
          )}
        </ul>
      </div>
    );
  }
}

export default TodoList;