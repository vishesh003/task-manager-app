import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Tasks() {
  const [tasks, setTasks]       = useState([]);
  const [title, setTitle]       = useState("");
  const [description, setDesc]  = useState("");
  const [loading, setLoading]   = useState(true);
  const navigate                = useNavigate();

  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user"));

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    try {
      const res  = await fetch("http://localhost:5000/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) { navigate("/login"); return; }
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (err) { console.error(err); }
  }

  async function handleCreate() {
    if (!title) return alert("Title is required!");
    const res  = await fetch("http://localhost:5000/tasks", {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ title, description })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTitle(""); setDesc("");
  }

  async function handleToggle(id) {
    const res     = await fetch(`http://localhost:5000/tasks/${id}`, {
      method:  "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    const updated = await res.json();
    setTasks(tasks.map(t => t._id === id ? updated : t));
  }

  async function handleDelete(id) {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method:  "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(tasks.filter(t => t._id !== id));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Welcome, {user?.name}!</h1>
        <button onClick={handleLogout}
          style={{ padding: "8px 16px", backgroundColor: "red", color: "white", border: "none", borderRadius: "4px" }}>
          Logout
        </button>
      </div>

      {/* Add Task Form */}
      <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Add New Task</h3>
        <input placeholder="Title" value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input placeholder="Description (optional)" value={description}
          onChange={e => setDesc(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button onClick={handleCreate}
          style={{ padding: "8px 16px", backgroundColor: "blue", color: "white", border: "none", borderRadius: "4px" }}>
          Add Task
        </button>
      </div>

      {/* Tasks List */}
      <h3>Your Tasks ({tasks.length})</h3>
      {tasks.length === 0 && <p>No tasks yet — add one above!</p>}

      {tasks.map(task => (
        <div key={task._id} style={{
          padding: "15px", border: "1px solid #ccc", borderRadius: "8px",
          marginBottom: "10px", backgroundColor: task.completed ? "#f0fff0" : "white"
        }}>
          <h4 style={{ textDecoration: task.completed ? "line-through" : "none", margin: "0 0 5px" }}>
            {task.title}
          </h4>
          {task.description && <p style={{ margin: "0 0 10px", color: "#666" }}>{task.description}</p>}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => handleToggle(task._id)}
              style={{ padding: "5px 10px", backgroundColor: task.completed ? "orange" : "green", color: "white", border: "none", borderRadius: "4px" }}>
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => handleDelete(task._id)}
              style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "4px" }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tasks;