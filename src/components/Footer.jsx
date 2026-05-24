import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Navigation',
      links: ['Home', 'Services', 'Portfolio', 'About Us', 'Contact']
    },
    {
      title: 'Services',
      links: ['Web Development', 'UI/UX Design', 'Mobile Apps', 'Consulting', 'Support']
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press', 'Legal']
    },
  ]

  const socialLinks = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Linkedin, label: 'LinkedIn' },
    { icon: Instagram, label: 'Instagram' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <footer className="bg-dark-900 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">Studio</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Creating exceptional digital experiences that drive growth and transform businesses through innovation and excellence.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg glass hover:bg-white/20 flex items-center justify-center transition-all"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div key={sectionIndex} variants={itemVariants}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-accent-400 transition-colors duration-300 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-white mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <a href="mailto:hello@studio.com" className="flex items-start gap-3 text-gray-400 hover:text-accent-400 transition-colors text-sm group">
                <Mail size={18} className="mt-0.5 flex-shrink-0 group-hover:text-accent-400" />
                <span>hello@studio.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-start gap-3 text-gray-400 hover:text-accent-400 transition-colors text-sm group">
                <Phone size={18} className="mt-0.5 flex-shrink-0 group-hover:text-accent-400" />
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>San Francisco, CA<br/>United States</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
