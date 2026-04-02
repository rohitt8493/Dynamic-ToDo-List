/* script.js
   Dynamic To-Do List functionality
   Author: Rohit Kumar
   Date: 2026-04-02
*/

document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');
  const pendingCount = document.getElementById('pendingCount');
  const completedCount = document.getElementById('completedCount');

  // In-memory tasks array (id, text, completed)
  let tasks = [];

  // Utility to render counts
  function updateCounts() {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    pendingCount.textContent = `Pending: ${pending}`;
    completedCount.textContent = `Completed: ${completed}`;
  }

  // Create DOM element for a task
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    // Left side: checkbox + text
    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task complete');

    const text = document.createElement('div');
    text.className = 'task-text';
    text.textContent = task.text;
    if (task.completed) text.classList.add('completed');

    left.appendChild(checkbox);
    left.appendChild(text);

    // Actions: Edit / Save / Delete
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn edit';
    editBtn.textContent = 'Edit';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'icon-btn save';
    saveBtn.textContent = 'Save';
    saveBtn.style.display = 'none';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn delete';
    deleteBtn.textContent = 'Delete';

    actions.appendChild(editBtn);
    actions.appendChild(saveBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(actions);

    // Event: toggle completion
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      if (task.completed) text.classList.add('completed');
      else text.classList.remove('completed');
      updateTaskInStore(task);
      updateCounts();
    });

    // Event: delete
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      li.remove();
      updateCounts();
    });

    // Event: edit
    editBtn.addEventListener('click', () => {
      // Replace text div with input
      const input = document.createElement('input');
      input.type = 'text';
      input.value = task.text;
      input.className = 'task-edit-input';
      input.style.flex = '1';
      left.replaceChild(input, text);
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-block';
      input.focus();
      // allow Enter to save
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveBtn.click();
      });
    });

    // Event: save edited text
    saveBtn.addEventListener('click', () => {
      const input = left.querySelector('.task-edit-input');
      if (!input) return;
      const newText = input.value.trim();
      if (newText === '') {
        // Do not allow empty task text; keep editing
        input.classList.add('invalid');
        input.placeholder = 'Task cannot be empty';
        input.focus();
        return;
      }
      task.text = newText;
      // restore text div
      text.textContent = task.text;
      left.replaceChild(text, input);
      editBtn.style.display = 'inline-block';
      saveBtn.style.display = 'none';
      updateTaskInStore(task);
    });

    return li;
  }

  // Update task in in-memory store (placeholder for persistence)
  function updateTaskInStore(updatedTask) {
    tasks = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
  }

  // Add a new task
  function addTask(text) {
    const trimmed = text.trim();
    if (trimmed === '') return false;
    const newTask = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false
    };
    tasks.push(newTask);
    const el = createTaskElement(newTask);
    taskList.prepend(el);
    updateCounts();
    return true;
  }

  // Hook up Add button and Enter key
  addBtn.addEventListener('click', () => {
    const ok = addTask(taskInput.value);
    if (ok) {
      taskInput.value = '';
      taskInput.focus();
    } else {
      // simple feedback for empty input
      taskInput.classList.add('invalid');
      setTimeout(() => taskInput.classList.remove('invalid'), 800);
    }
  });

  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBtn.click();
  });

  // Optional: seed with example tasks (comment out if not desired)
  // addTask('Buy groceries');
  // addTask('Finish lab assignment');

  // Initial counts
  updateCounts();
});