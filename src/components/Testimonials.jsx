import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CEO, TechVenture',
      content: 'The team transformed our vision into reality. Their attention to detail and commitment to excellence exceeded our expectations.',
      rating: 5,
    },
    {
      name: 'Marcus Johnson',
      role: 'Founder, Growth Labs',
      content: 'Working with them was a game-changer. They brought both strategic thinking and technical excellence to every aspect of the project.',
      rating: 5,
    },
    {
      name: 'Elena Rodriguez',
      role: 'Product Director, Innovate Inc',
      content: 'Exceptional service from start to finish. Their ability to understand our needs and deliver solutions was remarkable.',
      rating: 5,
    },
    {
      name: 'David Park',
      role: 'CTO, FinanceFlow',
      content: 'Best partnership we could ask for. The professionalism and technical expertise they brought was invaluable to our success.',
      rating: 5,
    },
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

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Client Testimonials</h2>
          <p className="section-subtitle">Trusted by industry leaders and innovative companies</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="glass rounded-xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent-400 text-accent-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
              <div className="pt-4 border-t border-gray-700">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
