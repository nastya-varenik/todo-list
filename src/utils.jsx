import Chance from "chance";

const chance = new Chance();

export const handleScroll = (state, setState) => {
  const { currentPage, todos, showOnlyUncompleted, sortOldestFirst, searchQuery, selectedImportance } = state;

  // Фильтруем задачи
  let filteredTodos = todos;
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredTodos = filteredTodos.filter(todo =>
      todo.name.toLowerCase().includes(query) || todo.description.toLowerCase().includes(query)
    );
  }
  if (selectedImportance.length > 0) {
    filteredTodos = filteredTodos.filter(todo =>
      selectedImportance.includes(todo.importance)
    );
  }
  if (showOnlyUncompleted) {
    filteredTodos = filteredTodos.filter(todo => !todo.checked);
  }
  if (sortOldestFirst) {
    filteredTodos = filteredTodos.slice().reverse();
  }

  // Ограничиваем количество задач на текущей странице
  const TASKS_PER_PAGE = 15;
  const VISIBLE_TASKS_THRESHOLD = 10;
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const endIndex = startIndex + TASKS_PER_PAGE;
  const displayedTodos = filteredTodos.slice(0, endIndex);

  // Проверяем, находится ли пользователь внизу страницы
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollHeight - scrollTop - clientHeight <= VISIBLE_TASKS_THRESHOLD * 50) { // 50 - примерная высота задачи
    setState((prevState) => ({
      currentPage: prevState.currentPage + 1,
    }));
  }
};

export const handleGenerateTasks = (state, setState) => {
  const newTodos = Array.from({ length: 1000 }, () => ({
    id: chance.guid(),
    name: chance.sentence({ words: 3 }).slice(0, -1),
    description: chance.paragraph({ sentences: 1 }),
    checked: false,
    createdAt: new Date().toLocaleString(),
    importance: chance.pickone(["high", "medium", "low"]),
  }));

  setState((prevState) => ({
    todos: [...prevState.todos, ...newTodos],
  }));
};