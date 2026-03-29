const API = 'http://localhost:3000/api/tasks';

async function loadTasks() {
    try {
        const res = await fetch(API);
        const tasks = await res.json();
        document.getElementById('taskCount').textContent = tasks.length;
        document.getElementById('tasksContainer').innerHTML = tasks.map(t => `
            <div class="task-card">
                <h3>${t.name}</h3>
                <p>${t.description || ''}</p>
                <div class="task-meta">
                    <span class="priority priority-${t.priority}">${t.priority.toUpperCase()}</span>
                    <span>${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No date'}</span>
                </div>
                <div class="actions">
                    <button onclick="editTask(${t.id}, '${t.name}', '${t.description || ''}', '${t.dueDate || ''}', '${t.priority}')">✏️ Edit</button>
                    <button class="delete" onclick="deleteTask(${t.id})">🗑️ Delete</button>
                </div>
            </div>
        `).join('') || '<p style="text-align:center;padding:40px;color:#666">No tasks yet! Create one ➕</p>';
    } catch(e) {
        console.error(e);
    }
}

window.deleteTask = async function(id) {
    if(confirm('Delete this task?')) {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        loadTasks();
    }
}

window.editTask = function(id, name, desc, dueDate, priority) {
    document.getElementById('name').value = name;
    document.getElementById('desc').value = desc;
    document.getElementById('dueDate').value = dueDate;
    document.getElementById('priority').value = priority;
    document.getElementById('editId').value = id;
    document.getElementById('submitBtn').textContent = '✅ Update Task';
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('app').innerHTML = `
<style>
* {margin:0;padding:0;box-sizing:border-box}
body {font-family:system-ui;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;padding:20px}
#app {max-width:1200px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 25px 50px rgba(0,0,0,.15);overflow:hidden}
header {background:linear-gradient(45deg,#667eea,#764ba2);color:white;padding:30px;text-align:center}
.stats {font-size:24px;margin-top:10px}
.form-modern {padding:30px;display:grid;gap:20px;background:#f8f9fa}
.input-group {display:grid;grid-template-columns:2fr 1fr;gap:15px}
input,select {padding:15px;border:2px solid #e1e5e9;border-radius:12px;font-size:16px}
input:focus,select:focus {outline:none;border-color:#667eea;box-shadow:0 0 0 4px rgba(102,126,234,.1)}
button {padding:15px 30px;background:linear-gradient(45deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:18px;font-weight:600;cursor:pointer;transition:all .3s}
button:hover {transform:translateY(-3px);box-shadow:0 10px 25px rgba(102,126,234,.4)}
.tasks-grid {padding:30px;display:grid;gap:20px}
.task-card {background:white;border-radius:15px;padding:25px;box-shadow:0 10px 30px rgba(0,0,0,.1);border-left:5px solid #667eea;transition:transform .3s}
.task-card:hover {transform:translateY(-5px)}
.task-meta {display:flex;gap:15px;margin:15px 0;font-size:14px;color:#666}
.priority {padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600}
.priority-low {background:#d4edda;color:#155724}
.priority-medium {background:#fff3cd;color:#856404}
.priority-high {background:#f8d7da;color:#721c24}
.actions {margin-top:20px;display:flex;gap:10px}
.actions button {padding:10px 20px;font-size:14px;flex:1}
.delete {background:#dc3545 !important}
</style>
        <header>
            <h1>🚀 Pro Task Manager</h1>
            <div class="stats"><span id="taskCount">0</span> Tasks</div>
        </header>
        <form id="taskForm" class="form-modern">
            <input type="hidden" id="editId">
            <div class="input-group">
                <input type="text" id="name" placeholder="📝 Task Name" required>
                <input type="text" id="desc" placeholder="📄 Description">
            </div>
            <div class="input-group">
                <input type="date" id="dueDate">
                <select id="priority">
                    <option value="low">📊 Low Priority</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="high">🔥 High</option>
                </select>
            </div>
            <button type="submit" id="submitBtn">➕ Create New Task</button>
        </form>
        <div class="tasks-grid" id="tasksContainer"></div>
    `;

    document.getElementById('taskForm').onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('name').value,
            description: document.getElementById('desc').value,
            dueDate: document.getElementById('dueDate').value,
            priority: document.getElementById('priority').value
        };
        const editId = document.getElementById('editId').value;
        if(editId) {
            await fetch(`${API}/${editId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
        } else {
            await fetch(API, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
        }
        document.getElementById('taskForm').reset();
        document.getElementById('editId').value = '';
        document.getElementById('submitBtn').textContent = '➕ Create New Task';
        await loadTasks();
    };

    await loadTasks();
});