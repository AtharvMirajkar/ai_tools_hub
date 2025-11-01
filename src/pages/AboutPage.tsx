
import { Building, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">About Us</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Welcome to AI Tools Showcase, your trusted guide in the rapidly evolving world of artificial intelligence. We are a passionate team of developers, researchers, and AI enthusiasts dedicated to curating and reviewing the most innovative AI tools on the market.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-4">
              <div className="flex-none rounded-lg bg-blue-600/10 p-3">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold leading-7 text-gray-900">Our Mission</h3>
            </div>
            <p className="mt-1 flex-auto text-base leading-7 text-gray-600">
              Our mission is to empower creators, developers, and businesses by providing a clear, unbiased, and comprehensive resource for discovering the best AI tools. We believe that the right tool can unlock incredible potential, and we're here to help you find it.
            </p>
          </div>

          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-4">
              <div className="flex-none rounded-lg bg-blue-600/10 p-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold leading-7 text-gray-900">Who We Are</h3>
            </div>
            <p className="mt-1 flex-auto text-base leading-7 text-gray-600">
              We are a diverse team with a shared passion for technology and its potential to solve real-world problems. Our backgrounds span software engineering, data science, and digital marketing, giving us a unique perspective on the tools we evaluate.
            </p>
          </div>

          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-4">
              <div className="flex-none rounded-lg bg-blue-600/10 p-3">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold leading-7 text-gray-900">Our Process</h3>
            </div>
            <p className="mt-1 flex-auto text-base leading-7 text-gray-600">
              Every tool featured on our site goes through a rigorous evaluation process. We assess functionality, ease of use, pricing, and real-world performance to provide you with reviews you can trust. Our goal is to cut through the hype and deliver honest insights.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
