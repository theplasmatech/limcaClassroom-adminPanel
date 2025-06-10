'use client';

import { useState, useEffect } from 'react';

export default function AttendanceCalendar() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch attendance data from API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/attendance');
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Get attendance data for a specific date
  const getAttendanceForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return attendanceData.find(item => item.date === dateString);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get month and year string
  const getMonthYear = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Get attendance status color
  const getAttendanceColor = (attendance) => {
    if (!attendance || attendance.booked_students === 0) {
      return 'bg-gray-100 text-gray-400';
    }
    
    const percentage = (attendance.present_students / attendance.booked_students) * 100;
    
    if (percentage >= 80) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (percentage >= 60) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (percentage >= 40) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Attendance Data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium text-gray-800">Attendance Calendar</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-medium text-gray-700 min-w-[180px] text-center">
              {getMonthYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span>80%+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-100 rounded"></div>
              <span>60-79%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-100 rounded"></div>
              <span>40-59%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 rounded"></div>
              <span>Below 40%</span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div>
          {/* Days of the week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-20"></div>;
              }

              const attendance = getAttendanceForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  className={`h-20 border rounded p-2 flex flex-col justify-between ${
                    getAttendanceColor(attendance)
                  } ${isToday ? 'ring-1 ring-blue-400' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm">{day.getDate()}</span>
                    {isToday && (
                      <span className="text-xs text-blue-500">Today</span>
                    )}
                  </div>
                  
                  {attendance && attendance.booked_students > 0 && (
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {attendance.present_students}/{attendance.booked_students}
                      </div>
                      {attendance.subject_data && (
                        <div className="text-xs mt-1 truncate" title={attendance.subject_data.title}>
                          {attendance.subject_data.subject_name}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
              
              const monthData = attendanceData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= monthStart && itemDate <= monthEnd;
              });

              const totalClasses = monthData.filter(item => item.booked_students > 0).length;
              const totalBooked = monthData.reduce((sum, item) => sum + item.booked_students, 0);
              const totalPresent = monthData.reduce((sum, item) => sum + item.present_students, 0);
              const avgAttendance = totalBooked > 0 ? Math.round((totalPresent / totalBooked) * 100) : 0;

              return (
                <>
                  <div className="p-3 border rounded">
                    <div className="text-lg font-medium text-gray-800">{totalClasses}</div>
                    <div className="text-sm text-gray-500">Classes</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-lg font-medium text-gray-800">{totalPresent}</div>
                    <div className="text-sm text-gray-500">Present</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-lg font-medium text-gray-800">{totalBooked}</div>
                    <div className="text-sm text-gray-500">Booked</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-lg font-medium text-gray-800">{avgAttendance}%</div>
                    <div className="text-sm text-gray-500">Average</div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}