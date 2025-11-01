import { Zap, ShieldCheck, Eye, Bot, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { id: 1, name: 'Tools Reviewed', value: '150+', Icon: Bot },
  { id: 2, name: 'Happy Users', value: '10k+', Icon: Users },
  { id: 3, name: 'Avg. Rating', value: '4.8/5', Icon: Star },
];

const values = [
  {
    name: 'Innovation at Core',
    description: 'We are driven by the pursuit of the next groundbreaking AI. Our mission is to shine a light on the tools that are pushing the boundaries of what\'s possible.',
    Icon: Zap,
  },
  {
    name: 'Unwavering Integrity',
    description: 'Our reviews are independent, unbiased, and based on rigorous testing. We prioritize honesty and transparency to build a community founded on trust.',
    Icon: ShieldCheck,
  },
  {
    name: 'Clarity in Complexity',
    description: 'The AI landscape can be overwhelming. We cut through the noise, providing clear, concise, and actionable insights to help you make informed decisions with confidence.',
    Icon: Eye,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <main className="isolate">
        <div className="relative pt-14">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#8085ff] to-[#4c51bf] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Navigating the Future of AI
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Welcome to AI Tool Finder. We are a passionate team of developers, researchers, and AI enthusiasts dedicated to curating and reviewing the most innovative AI tools on the market.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="bg-gray-50 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Trusted by Innovators Worldwide
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-600">
                    We\'ve helped thousands of people discover the perfect AI tools for their needs.
                    </p>
                </div>
                <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 text-center sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
                    {stats.map((stat) => (
                    <div key={stat.id} className="flex flex-col items-center">
                        <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-blue-600 sm:text-5xl flex items-center gap-x-2">
                        <stat.Icon className="h-10 w-10 text-blue-500" aria-hidden="true" />
                        {stat.value}
                        </dd>
                    </div>
                    ))}
                </dl>
                </div>
            </div>
        </div>

        {/* Values Section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Core Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We are guided by a set of principles that ensure we always deliver the highest quality content and maintain the trust of our community.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.name} className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <value.Icon className="absolute left-1 top-1 h-5 w-5 text-blue-600" aria-hidden="true" />
                  {value.name}
                </dt>
                <dd className="inline">{' '}{value.description}</dd>
              </div>
            ))}
          </dl>
        </div>
        
        {/* CTA Section */}
        <div className="relative -z-10 my-32 px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Ready to find your next AI tool?
                <br />
                Start exploring today.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                Dive into our curated lists, in-depth reviews, and find the perfect tool to supercharge your workflow.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                    to="/tools"
                    className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Browse Tools <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
                </div>
            </div>
        </div>

      </main>
    </div>
  )
}
