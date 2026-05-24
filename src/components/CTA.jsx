import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="section py-24 md:py-32 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your <span className="gradient-text">Vision</span>?
          </h2>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Let's work together to create something extraordinary. Our team is ready to bring your ideas to life with innovation and expertise.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="btn-primary inline-flex items-center justify-center gap-2">
              Start Your Project
              <ArrowRight size={18} />
            </button>
            <button className="btn-secondary">
              Schedule a Consultation
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-500 text-sm mt-8"
          >
            Response within 24 hours • Free initial consultation • No obligation
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
