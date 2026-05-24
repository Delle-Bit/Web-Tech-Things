import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section id="home" className="section pt-32 md:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="z-10"
          >
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Elevate Your <span className="gradient-text">Digital Presence</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg"
            >
              We craft exceptional digital experiences that transform businesses. From concept to execution, we combine strategic thinking with creative excellence.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="btn-primary inline-flex items-center justify-center gap-2">
                Start Your Project
                <ArrowRight size={18} />
              </button>
              <button className="btn-secondary">
                View Our Work
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 border-2 border-dark-900 flex items-center justify-center text-sm font-bold text-white"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-semibold">Trusted by 50+ brands</p>
                <p className="text-gray-500 text-sm">Worldwide partnerships</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative h-96 md:h-full md:min-h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-600/20 to-accent-400/20 rounded-2xl blur-3xl"></div>
              <div className="relative h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl"></div>
                </div>
                <div className="relative text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-accent-600/20 border border-accent-500/50 flex items-center justify-center">
                    <div className="w-16 h-16 bg-accent-500/30 rounded-lg"></div>
                  </div>
                  <p className="text-gray-500 font-medium">Hero Image</p>
                  <p className="text-gray-600 text-sm">Add your showcase image here</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
