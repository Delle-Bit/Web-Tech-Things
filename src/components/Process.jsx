import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'Discovery & Strategy',
      description: 'We start by understanding your goals, market, and target audience to create a strategic foundation.',
    },
    {
      number: '02',
      title: 'Design & Planning',
      description: 'Our team creates wireframes and prototypes, visualizing the user experience and technical architecture.',
    },
    {
      number: '03',
      title: 'Development',
      description: 'We build scalable, performant solutions using modern technologies and best practices.',
    },
    {
      number: '04',
      title: 'Testing & Optimization',
      description: 'Comprehensive testing ensures quality, security, and performance across all platforms.',
    },
    {
      number: '05',
      title: 'Launch & Support',
      description: 'We deploy your solution and provide ongoing support to ensure continued success and growth.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Our Process</h2>
          <p className="section-subtitle">A structured approach to delivering exceptional results</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={stepVariants} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-3 w-6 h-0.5 bg-gradient-to-r from-accent-500 to-transparent"></div>
              )}

              <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="text-4xl font-bold gradient-text mb-3">{step.number}</div>

                {/* Checkmark */}
                <div className="mb-4">
                  <CheckCircle2 size={24} className="text-accent-500" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
