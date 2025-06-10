"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [todayStudents, setTodayStudents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodayStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/students-for-today');
        if (!response.ok) {
          throw new Error('Failed to fetch today\'s students');
        }
        const data = await response.json();
        setTodayStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayStudents();
  }, []);

  const handleMarkAttendance = async (studentId, dayId) => {
    try {
      const response = await fetch('http://localhost:5000/mark-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          day_id: dayId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark attendance');
      }

      // Refresh the students list after marking attendance
      const updatedResponse = await fetch('http://localhost:5000/students-for-today');
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setTodayStudents(updatedData);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const widgets = [
    {
      title: 'Add Students',
      description: 'Add new students to the classroom',
      path: '/add-student',
      icon: '👥'
    },
    {
      title: 'Set Timetable',
      description: 'Manage class schedules and timings',
      path: '/timetable',
      icon: '📅'
    },
    {
      title: 'List of Students',
      description: 'View and manage student records',
      path: '/students',
      icon: '📋'
    },
    {
      title: 'Blacklist',
      description: 'Manage blacklisted students',
      path: '/blacklist',
      icon: '⚠️'
    },
    {
      title: 'Attendance Calendar',
      description: 'Track student attendance',
      path: '/attendance',
      icon: '📊'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Limca Classroom</h1>
        
        {/* Today's Students Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Today's Students</h2>
          
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black"></div>
              <p className="mt-2 text-gray-600">Loading students...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && todayStudents && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Date: {todayStudents.date}</p>
                    <p className="text-sm text-gray-600">Day ID: {todayStudents.day_id}</p>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {todayStudents.students.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No students scheduled for today
                  </div>
                ) : (
                  todayStudents.students.map((student) => (
                    <div key={student._id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {student.profile_img ? (
                          <img
                            src={student.profile_img}
                            alt={student.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xl">👤</span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-500">{student.email}</p>
                          <p className="text-sm text-gray-500">
                            {student.location} | {student.gender} | {student.last_qualification}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMarkAttendance(student._id, todayStudents.day_id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          student.present
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {student.present ? 'Present ✓' : 'Mark Present'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <Link
              key={widget.title}
              href={widget.path}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{widget.icon}</span>
                <h2 className="text-xl font-semibold text-gray-900">{widget.title}</h2>
              </div>
              <p className="text-gray-600">{widget.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
