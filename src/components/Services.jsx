import { motion } from 'framer-motion'
import { Code, Palette, Zap, Smartphone, Settings, BarChart3 } from 'lucide-react'

export default function Services() {
  const services = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom-built web applications powered by modern technology stacks and scalable architecture.'
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Thoughtfully crafted interfaces that balance aesthetics with functionality and user needs.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Solutions',
      description: 'Native and cross-platform mobile applications designed for performance and engagement.'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimized systems that deliver speed, reliability, and exceptional user experiences.'
    },
    {
      icon: Settings,
      title: 'Integration',
      description: 'Seamless integration with existing systems and third-party services for unified workflows.'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Data-driven insights and comprehensive reporting to measure success and drive growth.'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="services" className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">Comprehensive solutions tailored to drive your business forward</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="glass rounded-xl p-8 group hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
