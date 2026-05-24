import { motion } from 'framer-motion'

export default function Stats() {
  const stats = [
    { value: '500+', label: 'Projects Completed', icon: '📊' },
    { value: '98%', label: 'Client Satisfaction', icon: '⭐' },
    { value: '12+', label: 'Years of Excellence', icon: '🏆' },
    { value: '150+', label: 'Team Members', icon: '👥' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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
    <section className="section bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass rounded-xl p-6 md:p-8 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-3">
                {stat.value}
              </div>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
