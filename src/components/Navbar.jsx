import Link from 'next/link';

const Navbar = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Add Students', path: '/add-students' },
    { name: 'Set Timetable', path: '/timetable' },
    { name: 'List of Students', path: '/students' },
    { name: 'Blacklist', path: '/blacklist' },
    { name: 'Attendance Calendar', path: '/attendance' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Limca Classroom</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-600"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
