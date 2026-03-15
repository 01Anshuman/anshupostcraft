import { Link } from 'react-router-dom'

const features = [
  {
    icon: '✦',
    title: 'Clean LinkedIn Formatting',
    desc: 'Auto-breaks long paragraphs into short, punchy lines that perform well on LinkedIn.',
  },
  {
    icon: '★',
    title: 'Highlight Key Lines',
    desc: 'Select any text and bold it instantly to make your most important ideas pop.',
  },
  {
    icon: '◈',
    title: 'Story-Style Readability',
    desc: 'Formats your post with whitespace and flow that keeps readers scrolling.',
  },
  {
    icon: '⊕',
    title: 'One-Click Copy',
    desc: 'Copy your formatted post to clipboard and paste directly into LinkedIn.',
  },
]

export default function Landing() {

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-linkedin-light via-white to-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-linkedin-blue/10 text-linkedin-blue text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            LinkedIn Post Formatter
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Turn messy text into{' '}
            <span className="text-linkedin-blue">engaging LinkedIn posts.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            Paste your raw thoughts and instantly format them into a clean storytelling LinkedIn post.
          </p>
          <Link
            to="/formatter"
            className="inline-block bg-linkedin-blue text-white text-base font-semibold px-8 py-3.5 rounded-full hover:bg-linkedin-dark transition-colors shadow-md"
          >
            Try Formatter →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Everything you need to write better posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white"
              >
                <div className="text-linkedin-blue text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hook Improver Teaser */}
      <section className="py-16 px-4 bg-linkedin-light">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-linkedin-blue/10 text-linkedin-blue text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Coming Soon
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Improve Your Hook</h2>
          <p className="text-gray-500 mb-6">
            Weak opening? One click rewrites your first line into something people can't scroll past.
          </p>
          <div className="bg-white rounded-2xl p-6 text-left max-w-lg mx-auto shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Before</p>
            <p className="text-gray-700 mb-4 italic">"Networking is important."</p>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">After</p>
            <p className="text-linkedin-blue font-semibold">
              "Networking changed my career. But not the way people think."
            </p>
          </div>
          <Link
            to="/formatter"
            className="inline-block mt-8 bg-linkedin-blue text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-linkedin-dark transition-colors"
          >
            Try the Formatter Now
          </Link>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get 100 Viral LinkedIn Hooks</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Free. Straight to your inbox. Grow your creator audience fast.
          </p>
          <a
            href="mailto:manshumanmishra221122@gmail.com?subject=Interested%20in%20100%20Viral%20LinkedIn%20Hooks&body=Hey%20Anshuman%2C%0A%0AI%20am%20interested%20in%20the%20100%20Viral%20LinkedIn%20Hooks%20feature.%20Please%20send%20them%20over!%0A%0AThanks"
            className="inline-block bg-linkedin-blue text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-linkedin-dark transition-colors shadow-md"
          >
            Send Me the Hooks
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        Formatted using AnshuPostCraft
      </footer>
    </main>
  )
}
