import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const inputClass =
  'w-full px-4 py-3 rounded-xl liquid-glass-morphic text-white placeholder-white/50 border border-white/25 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    details: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      const fields = gsap.utils.toArray<HTMLElement>('.form-field')
      gsap.fromTo(
        fields,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      const cards = gsap.utils.toArray<HTMLElement>('.quick-contact-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full min-h-screen py-24 md:py-32 overflow-hidden rounded-t-[3rem] md:rounded-t-[4rem] -mt-8 z-10"
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/images/japanese-estate.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />

      {/* Subtle dark scrim for readability — no blue tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="font-display text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
          >
            Have A Vision In Mind?
          </h2>
          <p
            className="text-lg text-white font-medium"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
          >
            Let's Create Something Exceptional
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Quick Contact — separate glass panel */}
          <div className="liquid-glass-morphic rounded-2xl p-8 md:p-10">
            <h3
              className="font-display text-2xl font-bold text-white mb-6"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
            >
              Quick Contact
            </h3>

            <div className="space-y-4">
              <a
                href="https://wa.me/2349031616458"
                target="_blank"
                rel="noopener noreferrer"
                className="quick-contact-card flex items-center gap-4 p-4 rounded-xl liquid-glass-morphic border border-white/20 hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/15">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                      fill="#ffffff"
                    />
                  </svg>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-white group-hover:text-white/90 transition-colors">
                    Chat on WhatsApp
                  </span>
                  <span className="text-xs text-white/75">Instant Response</span>
                </div>
              </a>

              <a
                href="mailto:bekkybekky216@gmail.com"
                className="quick-contact-card flex items-center gap-4 p-4 rounded-xl liquid-glass-morphic border border-white/20 hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/15">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                      fill="#ffffff"
                    />
                  </svg>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-white group-hover:text-white/90 transition-colors">
                    Email
                  </span>
                  <span className="text-xs text-white/75">bekkybekky216@gmail.com</span>
                </div>
              </a>
            </div>
          </div>

          {/* Form — separate glass panel */}
          <div className="liquid-glass-morphic rounded-2xl p-8 md:p-10">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-field">
                  <label className="block text-sm text-white font-medium mb-2">
                    Name <span className="text-white/60">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
                <div className="form-field">
                  <label className="block text-sm text-white font-medium mb-2">
                    Email <span className="text-white/60">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="block text-sm text-white font-medium mb-2">
                  Service Needed <span className="text-white/60">*</span>
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" className="bg-neutral-900 text-white">
                    Select a service
                  </option>
                  <option value="uiux" className="bg-neutral-900 text-white">
                    UI/UX Design
                  </option>
                  <option value="web" className="bg-neutral-900 text-white">
                    Web Design
                  </option>
                  <option value="graphic" className="bg-neutral-900 text-white">
                    Graphic Design
                  </option>
                  <option value="gfx" className="bg-neutral-900 text-white">
                    GFX Design
                  </option>
                  <option value="branding" className="bg-neutral-900 text-white">
                    Full Branding
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label className="block text-sm text-white font-medium mb-2">
                  Project Details <span className="text-white/60">*</span>
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell me about your project..."
                />
              </div>

              <div className="form-field pt-2 flex justify-center md:justify-start">
                <button
                  type="submit"
                  className="px-10 py-4 rounded-xl font-semibold text-base bg-white text-black hover:bg-white/90 transition-all shadow-lg"
                >
                  {submitted ? 'Message Sent!' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  )
}
