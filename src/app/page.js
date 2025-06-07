import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
  const widgets = [
    {
      title: 'Add Students',
      description: 'Add new students to the classroom',
      path: '/add-students',
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
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Limca Classroom</h1>
        
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
