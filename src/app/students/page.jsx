"use client";

import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/students";

export default function StudentsPage() {
  const [showExpired, setShowExpired] = useState(true);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = showExpired ? `${API_BASE}?expired=true` : API_BASE;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch students");
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [showExpired]);

  return (
    <main
      style={{
        backgroundColor: "white",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        color: "#222", // Darker text for better contrast
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Students List</h1>

      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={() => setShowExpired(true)}
          style={{
            padding: "0.5rem 1rem",
            marginRight: 10,
            cursor: "pointer",
            backgroundColor: showExpired ? "#0070f3" : "#eee",
            color: showExpired ? "white" : "#333",
            border: "none",
            borderRadius: 4,
            fontWeight: "bold",
          }}
        >
          Active Courses (expired=true)
        </button>
        <button
          onClick={() => setShowExpired(false)}
          style={{
            padding: "0.5rem 1rem",
            cursor: "pointer",
            backgroundColor: !showExpired ? "#0070f3" : "#eee",
            color: !showExpired ? "white" : "#333",
            border: "none",
            borderRadius: 4,
            fontWeight: "bold",
          }}
        >
          All Students
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          {students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                maxWidth: 600,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {students.map((s) => (
                <li
                  key={s._id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "1rem 0",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  {s.profile_img ? (
                    <img
                      src={s.profile_img}
                      alt={s.name}
                      width={50}
                      height={50}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        backgroundColor: "#ccc",
                      }}
                    />
                  )}
                  <div>
                    <strong>{s.name}</strong> <br />
                    <small>{s.email}</small> <br />
                    <small>
                      Joined: {s.joining_date} | Ends: {s.ending_date}
                    </small>
                    <br />
                    <small>
                      {s.location} | {s.gender} | {s.last_qualification}
                    </small>
                    <br />
                    <small>Phone: {s.phone}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
