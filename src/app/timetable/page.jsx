'use client';

import Navbar from '../../components/Navbar';
import { useState, useEffect } from 'react';

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
  const [editSubject, setEditSubject] = useState(['', '']);
  const [updating, setUpdating] = useState(false);
  const [draggedSubject, setDraggedSubject] = useState(null);

  // Subject reference data
  const subjects = [
    // Week 1
    { week: 1, number: 1, name: "Biology" },
    { week: 1, number: 2, name: "Chemical Peels" },
    { week: 1, number: 3, name: "High Frequency (HF)" },
    { week: 1, number: 4, name: "Mircrodermabrasion (MDA)" },
    { week: 1, number: 5, name: "Microneedling & Mesotherapy" },
    { week: 1, number: 6, name: "BB Glow & Radio Frequency (RF)" },
    // Week 2
    { week: 2, number: 1, name: "MNRF" },
    { week: 2, number: 2, name: "Faradic Treatment" },
    { week: 2, number: 3, name: "Galvanic Treatment" },
    { week: 2, number: 4, name: "ACNE & Hyper Pigmentation Consultation | Ultrasound" },
    { week: 2, number: 5, name: "Dermaplanning & Cautery" },
    { week: 2, number: 6, name: "Oxygeneo Facial & Hydra Facial" },
    // Week 3
    { week: 3, number: 1, name: "Diode LASER for hair Reduction" },
    { week: 3, number: 2, name: "Q Switch & PICO LASER" },
    { week: 3, number: 3, name: "Fractional CO2" },
    { week: 3, number: 4, name: "IPL" },
    { week: 3, number: 5, name: "HIFU" },
    { week: 3, number: 6, name: "Revision of LASERS" },
    // Week 4
    { week: 4, number: 1, name: "Hair Anatomy & Diseases" },
    { week: 4, number: 2, name: "HF | Ultrasound | RF" },
    { week: 4, number: 3, name: "Dandruff & Hair Shaft Study" },
    { week: 4, number: 4, name: "LAZER Helmet | Lowlight LAZER | Infrared" },
    { week: 4, number: 5, name: "Microneedling | MNRF | Meso Injections" },
    { week: 4, number: 6, name: "Hair Restoration Surgery" },
  ];

  // Get subject name from week and number
  const getSubjectName = (week, number) => {
    const subject = subjects.find(s => s.week === week && s.number === number);
    return subject ? subject.name : 'Unknown Subject';
  };

  // Date utility functions
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isMonday = (date) => {
    return date.getDay() === 1;
  };

  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const endOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = [];
    
    // Add padding days from previous month
    const firstDayOfWeek = start.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const paddingDate = new Date(start);
      paddingDate.setDate(start.getDate() - i - 1);
      days.push(paddingDate);
    }
    
    // Add all days of current month
    for (let d = 1; d <= end.getDate(); d++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), d));
    }
    
    // Add padding days from next month
    const lastDayOfWeek = end.getDay();
    for (let i = 1; i <= (6 - lastDayOfWeek); i++) {
      const paddingDate = new Date(end);
      paddingDate.setDate(end.getDate() + i);
      days.push(paddingDate);
    }
    
    return days;
  };

  // Fetch timetable data
  const fetchTimetable = async () => {
    try {
      console.log('Fetching timetable data...');
      const response = await fetch('http://localhost:5000/timetable');
      if (!response.ok) throw new Error('Failed to fetch timetable');
      const data = await response.json();
      console.log('Fetched timetable data:', data);
      setTimetable(data);
    } catch (err) {
      console.error('Error fetching timetable:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update subject for a day
  const updateSubject = async (dayId, subject) => {
    console.log('updateSubject called with:', { dayId, subject });
    
    setUpdating(true);
    try {
      // Validate subject format before sending
      let validatedSubject = null;
      
      if (subject !== null && subject !== undefined) {
        if (Array.isArray(subject)) {
          if (subject.length === 2) {
            // Ensure both elements are integers
            const [week, number] = subject;
            if (Number.isInteger(week) && Number.isInteger(number)) {
              validatedSubject = [week, number];
            } else {
              throw new Error('Subject array must contain two integers');
            }
          } else {
            throw new Error('Subject array must have exactly 2 elements');
          }
        } else {
          throw new Error('Subject must be null or an array of two integers');
        }
      }
      
      console.log('Sending validated subject:', validatedSubject);
      
      const response = await fetch(`http://localhost:5000/update-subject/${dayId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject: validatedSubject }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Server error response:', error);
        throw new Error(error.error || 'Failed to update subject');
      }

      const result = await response.json();
      console.log('Update successful:', result);
      
      await fetchTimetable();
      setEditingDay(null);
      setEditSubject(['', '']);
    } catch (err) {
      console.error('Error updating subject:', err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Handle edit start
  const startEdit = (entry) => {
    console.log('Starting edit for entry:', entry);
    setEditingDay(entry._id);
    // Convert existing subjects to strings for editing, or empty strings
    const currentSubjects = entry.subject || [null, null];
    console.log('Current subjects:', currentSubjects);
    
    // Handle the case where subject might be a single [week, number] pair
    if (Array.isArray(currentSubjects) && currentSubjects.length === 2 && 
        typeof currentSubjects[0] === 'number' && typeof currentSubjects[1] === 'number') {
      setEditSubject([
        currentSubjects[0].toString(),
        currentSubjects[1].toString()
      ]);
    } else {
      setEditSubject(['', '']);
    }
  };

  // Handle edit cancel
  const cancelEdit = () => {
    console.log('Cancelling edit');
    setEditingDay(null);
    setEditSubject(['', '']);
  };

  // Handle edit save
  const saveEdit = (dayId) => {
    console.log('saveEdit called with:', { dayId, editSubject });
    
    // Allow empty inputs (will send null)
    if (editSubject[0].trim() === '' && editSubject[1].trim() === '') {
      console.log('Both subjects empty, sending null');
      updateSubject(dayId, null);
      return;
    }
    
    // Validate that both fields have values if any field has a value
    if (editSubject[0].trim() === '' || editSubject[1].trim() === '') {
      setError('Both week and subject number must be provided, or leave both empty to clear');
      return;
    }
    
    // Convert to numbers
    const week = parseInt(editSubject[0].trim(), 10);
    const number = parseInt(editSubject[1].trim(), 10);
    
    console.log('Parsed values:', { week, number });
    
    if (isNaN(week) || isNaN(number)) {
      setError('Week and subject number must be valid numbers');
      return;
    }
    
    // Validate ranges
    if (week < 1 || week > 4) {
      setError('Week must be between 1 and 4');
      return;
    }
    
    if (number < 1 || number > 6) {
      setError('Subject number must be between 1 and 6');
      return;
    }
    
    const numericSubject = [week, number];
    console.log('Sending numeric subject:', numericSubject);
    updateSubject(dayId, numericSubject);
  };

  // Handle drag start
  const handleDragStart = (week, number) => {
    console.log('Drag started with:', { week, number });
    setDraggedSubject([week, number]);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = async (e, date) => {
    e.preventDefault();
    console.log('Drop event triggered');
    console.log('Dragged subject:', draggedSubject);
    console.log('Drop date:', date);
    
    if (!draggedSubject) {
      console.log('No dragged subject, returning');
      return;
    }

    const entry = getTimetableEntry(date);
    console.log('Target entry:', entry);
    
    if (!entry) {
      console.log('No entry found for date, returning');
      return;
    }
    
    if (isMonday(date)) {
      console.log('Cannot drop on Monday (holiday), returning');
      return;
    }

    // For drag and drop, we replace the entire subject with the new one
    // Backend expects exactly one [week, number] pair per day
    console.log('Updating with dragged subject:', draggedSubject);
    await updateSubject(entry._id, draggedSubject);
    setDraggedSubject(null);
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Find timetable entry for a specific date
  const getTimetableEntry = (date) => {
    const entry = timetable.find(entry => entry.date === formatDate(date));
    return entry;
  };

  // Handle month navigation
  const changeMonth = (offset) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  // Check if a date is from the current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth() &&
           date.getFullYear() === currentMonth.getFullYear();
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="text-gray-800 text-lg">Loading calendar...</div>
    </div>
  );
  
  if (error) return (
    <div className="bg-white min-h-screen p-4">
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-center max-w-md mx-auto">
        <strong>Error:</strong> {error}
        <button 
          onClick={() => setError(null)}
          className="ml-4 text-red-600 hover:text-red-800 underline"
        >
          Dismiss
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => changeMonth(-1)}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm border border-gray-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            {formatMonth(currentMonth)}
          </h1>
          <button
            onClick={() => changeMonth(1)}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm border border-gray-200 flex items-center gap-2"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Subjects Reference Table */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden sticky top-8">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Subject Reference</h2>
                <p className="text-sm text-gray-600 mt-1">Drag and drop subjects to assign them</p>
              </div>
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
                {[1, 2, 3, 4].map(week => (
                  <div key={week} className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Week {week}</h3>
                    <div className="space-y-2">
                      {subjects
                        .filter(s => s.week === week)
                        .map(subject => (
                          <div
                            key={subject.number}
                            draggable
                            onDragStart={() => handleDragStart(subject.week, subject.number)}
                            className="flex items-start gap-2 text-sm p-2 rounded-lg cursor-move hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                          >
                            <span className="font-medium text-blue-600 w-6">{subject.number}.</span>
                            <span className="text-gray-700">{subject.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-grow">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <div key={day} className="text-center font-medium p-4 text-gray-600 border-r border-gray-200 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {getDaysInMonth(currentMonth).map((date, index) => {
                  const entry = getTimetableEntry(date);
                  const isHoliday = isMonday(date);
                  const isCurrentMonthDay = isCurrentMonth(date);
                  const isEditing = editingDay === entry?._id;
                  
                  return (
                    <div
                      key={index}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, date)}
                      className={`min-h-40 p-4 border-r border-b border-gray-200 last:border-r-0 transition-all duration-200 ${
                        !isCurrentMonthDay 
                          ? 'bg-gray-50' 
                          : isHoliday 
                            ? 'bg-red-50' 
                            : 'bg-white hover:bg-gray-50'
                      } ${!isHoliday && isCurrentMonthDay ? 'cursor-pointer' : ''}`}
                    >
                      {/* Date Number */}
                      <div className={`font-medium text-base mb-2 ${
                        !isCurrentMonthDay 
                          ? 'text-gray-400' 
                          : isHoliday 
                            ? 'text-red-600' 
                            : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                        {isHoliday && (
                          <span className="block text-xs text-red-500 font-normal">Holiday</span>
                        )}
                      </div>

                      {/* Subject Information */}
                      {entry && !isHoliday && isCurrentMonthDay && (
                        <div className="space-y-2">
                          {!isEditing ? (
                            // Display Mode
                            <div>
                              {entry.subject && Array.isArray(entry.subject) && entry.subject.length === 2 ? (
                                <div className="group relative">
                                  <div className="flex items-center justify-between bg-green-50 rounded-lg p-2 transition-all duration-200 hover:bg-green-100">
                                    <span className="text-sm font-medium text-green-800">
                                      {getSubjectName(entry.subject[0], entry.subject[1])}
                                    </span>
                                    <button
                                      onClick={() => updateSubject(entry._id, null)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 text-sm p-1 hover:bg-red-50 rounded-full"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400 italic border-2 border-dashed border-gray-200 rounded-lg p-2 text-center">
                                  Drop subject here
                                </div>
                              )}
                            </div>
                          ) : (
                            // Edit Mode
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-gray-700 mb-1">Edit Subject:</div>
                              <input
                                type="number"
                                min="1"
                                max="4"
                                value={editSubject[0]}
                                onChange={(e) => setEditSubject([e.target.value, editSubject[1]])}
                                placeholder="Week (1-4)"
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <input
                                type="number"
                                min="1"
                                max="6"
                                value={editSubject[1]}
                                onChange={(e) => setEditSubject([editSubject[0], e.target.value])}
                                placeholder="Subject (1-6)"
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={() => saveEdit(entry._id)}
                                  disabled={updating}
                                  className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                  {updating ? '...' : 'Save'}
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span>Holiday (Monday)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span>Previous/Next Month</span>
          </div>
        </div>
      </div>
    </div>
  );
}