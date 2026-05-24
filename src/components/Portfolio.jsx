import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export default function Portfolio() {
  const projects = [
    {
      category: 'E-Commerce',
      title: 'Global Retail Platform',
      description: 'Full-stack e-commerce solution with real-time inventory management and personalized recommendations.',
      tags: ['React', 'Node.js', 'MongoDB'],
    },
    {
      category: 'SaaS',
      title: 'Analytics Dashboard',
      description: 'Enterprise analytics platform processing millions of data points with intuitive visualizations.',
      tags: ['TypeScript', 'Vue.js', 'PostgreSQL'],
    },
    {
      category: 'Finance',
      title: 'Payment Gateway',
      description: 'Secure payment processing system with multi-currency support and fraud detection.',
      tags: ['React', 'Python', 'AWS'],
    },
    {
      category: 'Healthcare',
      title: 'Patient Management System',
      description: 'HIPAA-compliant platform for appointment scheduling and medical record management.',
      tags: ['React', 'Django', 'PostgreSQL'],
    },
    {
      category: 'Education',
      title: 'Learning Management System',
      description: 'Interactive platform for online education with video streaming and progress tracking.',
      tags: ['Next.js', 'Firebase', 'Tailwind'],
    },
    {
      category: 'Social',
      title: 'Community Network',
      description: 'Social platform with real-time messaging, content discovery, and user engagement tools.',
      tags: ['React', 'Node.js', 'GraphQL'],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="portfolio" className="section bg-dark-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Showcase of our recent work across diverse industries</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="glass rounded-xl overflow-hidden group cursor-pointer"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 border-b border-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500 rounded-full blur-3xl"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-accent-600/20 border border-accent-500/50 flex items-center justify-center">
                      <div className="w-10 h-10 bg-accent-500/30 rounded-lg"></div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Project Image</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-accent-600/20 border border-accent-500/50 rounded-full text-xs font-semibold text-accent-400 mb-3">
                  {project.category}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="btn-primary inline-flex items-center gap-2">
            View All Projects
            <ExternalLink size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
