'use client';

import React, { useEffect, useState } from 'react';

type Student = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  missed_count: number;
  cancelled_count: number;
};

export default function BlackList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbsentStudents = async () => {
      try {
        const res = await fetch('https://limca-classroom-backend.vercel.app/absent-students');
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        setStudents(data.students || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsentStudents();
  }, []);

  if (loading) return <h2>Loading blacklist...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Blacklist</h2>

      {students.length === 0 ? (
        <p>No absent students found today.</p>
      ) : (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Missed Count</th>
              <th>Cancelled Count</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name || 'Unknown'}</td>
                <td>{student.email || 'N/A'}</td>
                <td>{student.phone || 'N/A'}</td>
                <td>{student.missed_count}</td>
                <td>{student.cancelled_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
