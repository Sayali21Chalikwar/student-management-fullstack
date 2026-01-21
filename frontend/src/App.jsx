import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8082/api/students";

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    course: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setStudents(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editMode ? "PUT" : "POST";
    const url = editMode ? `${API_URL}/${form.id}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        age: form.age || null,
        course: form.course
      })
    });

    if (res.ok) {
      showMessage(
        editMode ? "Student updated successfully!" : "Student added successfully!",
        "success"
      );
      resetForm();
      loadStudents();
    } else {
      showMessage("Operation failed", "error");
    }
  };

  const editStudent = (student) => {
    setForm(student);
    setEditMode(true);
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    showMessage("Student deleted successfully!", "success");
    loadStudents();
  };

  const resetForm = () => {
    setForm({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      course: ""
    });
    setEditMode(false);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎓 Student Management System</h1>
        <p>Manage your student records efficiently</p>
      </div>

      <div className="content">
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="form-section">
          <h2>{editMode ? "Update Student" : "Add New Student"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
              />
            </div>

            <input
              name="course"
              placeholder="Course"
              value={form.course}
              onChange={handleChange}
            />

            <button type="submit" className="btn btn-primary">
              {editMode ? "Update Student" : "Add Student"}
            </button>

            {editMode && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First</th>
              <th>Last</th>
              <th>Email</th>
              <th>Age</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty">No students found</td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.firstName}</td>
                  <td>{s.lastName}</td>
                  <td>{s.email}</td>
                  <td>{s.age || "-"}</td>
                  <td>{s.course || "-"}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => editStudent(s)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteStudent(s.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
