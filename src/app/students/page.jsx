"use client";

import { useEffect, useState } from "react";

const API_BASE = "https://limca-classroom-backend.vercel.app/list-of-students";

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
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#333",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ 
        marginBottom: "2rem",
        fontSize: "1.75rem",
        fontWeight: "500",
        color: "#1a1a1a"
      }}>Students</h1>

      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => setShowExpired(true)}
          style={{
            padding: "0.5rem 1.25rem",
            marginRight: "0.75rem",
            cursor: "pointer",
            backgroundColor: showExpired ? "#2563eb" : "transparent",
            color: showExpired ? "white" : "#4b5563",
            border: "1px solid #e5e7eb",
            borderRadius: "0.375rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          Active Courses
        </button>
        <button
          onClick={() => setShowExpired(false)}
          style={{
            padding: "0.5rem 1.25rem",
            cursor: "pointer",
            backgroundColor: !showExpired ? "#2563eb" : "transparent",
            color: !showExpired ? "white" : "#4b5563",
            border: "1px solid #e5e7eb",
            borderRadius: "0.375rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          All Students
        </button>
      </div>

      {loading && <p style={{ color: "#6b7280" }}>Loading...</p>}
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      {!loading && !error && (
        <>
          {students.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No students found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {students.map((s) => (
                <div
                  key={s._id}
                  style={{
                    backgroundColor: "white",
                    padding: "1.5rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  {s.profile_img ? (
                    <img
                      src={s.profile_img}
                      alt={s.name}
                      width={64}
                      height={64}
                      style={{ 
                        borderRadius: "50%", 
                        objectFit: "cover",
                        border: "2px solid #f3f4f6"
                      }}
                    />
                  ) : (
                    <img
                      src={s.gender === "male" 
                        ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E1'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"
                        : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E1'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
                      alt={s.name}
                      width={64}
                      height={64}
                      style={{ 
                        borderRadius: "50%", 
                        objectFit: "cover",
                        border: "2px solid #f3f4f6",
                        backgroundColor: "#f8fafc"
                      }}
                    />
                  )}
                  <div>
                    <h3 style={{ 
                      margin: "0 0 0.5rem 0",
                      fontSize: "1.125rem",
                      fontWeight: "500",
                      color: "#111827"
                    }}>{s.name}</h3>
                    <p style={{ 
                      margin: "0 0 0.25rem 0",
                      fontSize: "0.875rem",
                      color: "#4b5563"
                    }}>{s.email}</p>
                    <p style={{ 
                      margin: "0 0 0.25rem 0",
                      fontSize: "0.875rem",
                      color: "#6b7280"
                    }}>
                      {s.joining_date} - {s.ending_date}
                    </p>
                    <p style={{ 
                      margin: "0 0 0.25rem 0",
                      fontSize: "0.875rem",
                      color: "#6b7280"
                    }}>
                      {s.location} • {s.gender} • {s.last_qualification}
                    </p>
                    <p style={{ 
                      margin: 0,
                      fontSize: "0.875rem",
                      color: "#6b7280"
                    }}>{s.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
