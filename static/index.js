const API_BASE = 'http://127.0.0.1:5000/api/v1.to-do-list/task';

let todos = [];

// Fetch and render todos from backend
async function renderTodos() {
  try {
    const res = await fetch(`${API_BASE}/read`);
    todos = await res.json();
  } catch (err) {
    console.error("Error fetching todos:", err);
    todos = [];
  }

  const list = document.getElementById('todoList');
  list.innerHTML = '';

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';

    li.innerHTML = `
      <span>${todo.text}</span>
      <div>
        <button class="done-btn" onclick="toggleDone('${todo.id}')">✔</button>
        <button class="edit-btn" onclick="editTodo('${todo.id}')">✏</button>
        <button class="delete-btn" onclick="deleteTodo('${todo.id}')">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Add new todo
async function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return alert('Please enter a task');

  try {
    
    await fetch(`${API_BASE}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, completed: false, id: crypto.randomUUID() })
    });
    input.value = '';
    renderTodos();
  } catch (err) {
    console.error("Error adding todo:", err);
  }
}

// Delete todo
async function deleteTodo(id) {
  try {
    await fetch(`${API_BASE}/delete/${id}`, { method: 'DELETE' });
    renderTodos();
  } catch (err) {
    console.error("Error deleting todo:", err);
  }
}

// Toggle completion
async function toggleDone(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  try {
    await fetch(`${API_BASE}/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    });
    renderTodos();
  } catch (err) {
    console.error("Error toggling todo:", err);
  }
}

// Edit todo
async function editTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  const newText = prompt('Edit your task:', todo.text);
  if (newText && newText.trim()) {
    try {
      await fetch(`${API_BASE}/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText.trim() })
      });
      renderTodos();
    } catch (err) {
      console.error("Error editing todo:", err);
    }
  }
}

// Initial render
renderTodos();
