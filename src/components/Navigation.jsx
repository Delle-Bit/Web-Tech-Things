import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'About', href: '#about' },
  ]

  const handleNavClick = () => {
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full bg-dark-900/95 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="ml-2 text-xl font-bold text-white hidden sm:inline">Studio</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium text-sm"
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block btn-primary text-sm"
          >
            Get Started
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden border-t border-gray-800 overflow-hidden"
      >
        <div className="px-4 py-4 space-y-2 bg-dark-800">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={handleNavClick}
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button className="w-full mt-4 btn-primary text-sm justify-center">
            Get Started
          </button>
        </div>
      </motion.div>
    </nav>
  )
}
