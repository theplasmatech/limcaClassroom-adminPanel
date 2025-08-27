"use client"

import React, { useEffect, useState } from 'react';

export default function DeleteStudent() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch students from API
    useEffect(() => {
        fetch('https://limca-classroom-backend.vercel.app/list-of-students?expired=false')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch students');
                }
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
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;

        try {
            const res = await fetch(`https://limca-classroom-backend.vercel.app/delete-student/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error('Failed to delete student');
            }

            // Update UI after deletion
            setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <h2>Loading students...</h2>;
    if (error) return <h2>Error: {error}</h2>;

    return (
        <div>
            <h1>Delete Student</h1>
            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
<table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Joining Date</th>
                            <th>Ending Date</th>
                            <th>Gender</th>
                            <th>Qualification</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.phone}</td>
                                <td>{student.location}</td>
                                <td>{student.joining_date}</td>
                                <td>{student.ending_date}</td>
                                <td>{student.gender}</td>
                                <td>{student.last_qualification}</td>
                                <td>
                                    <button onClick={() => handleDelete(student._id)} style={{ color: 'red' }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
