import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-linkedin-blue tracking-tight">
          AnshuPostCraft
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-linkedin-blue' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/formatter"
            className="text-sm font-medium bg-linkedin-blue text-white px-4 py-2 rounded-full hover:bg-linkedin-dark transition-colors"
          >
            Try Formatter
          </Link>
        </div>
      </div>
    </nav>
  )
}
