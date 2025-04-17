import React from "react";
import { useAuthStore } from "../store/useAuthStore"; // Import the auth store
import SkillCreditSystem from "./SkillCreditSystem"; // Import the SkillCreditSystem component
import MilestoneTracking from "./MilestoneTracking"; // Import the MilestoneTracking component
import SecureAgreement from "./SecureAgreement"; // Import the SecureAgreement component
import Button from "./ui/Button"; // Import the Button component
import CTA from "./ui/CTA"; // Import the CTA component

const Home = () => {
  const { isLoggedIn } = useAuthStore(); // Check if the user is logged in

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* Hero Section */}
      <header className="text-center bg-gradient-to-r from-gray-800 to-gray-900 py-32 px-6">
        <h1 className="text-6xl font-bold tracking-wide">
          Unlock Limitless Opportunities
        </h1>
        <p className="text-xl mt-6 font-medium opacity-90">
          Trade skills, collaborate, and build your career—all in one place.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="flex max-w-md w-full">
            <input
              type="text"
              placeholder="Find services..."
              className="w-full px-6 py-3 rounded-l-full focus:outline-none bg-gray-700 text-gray-100 placeholder-gray-400"
            />
            <Button
              variant="success"
              className="rounded-l-none rounded-r-full"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              }
            >
              Search
            </Button>
          </div>
        </div>
        <div className="mt-6 text-sm text-gray-400">
          Popular: Graphic Design, Web Development, Content Writing, SEO
        </div>
      </header>

      {/* Skill Credit System (Visible only to logged-in users) */}
      {isLoggedIn && <SkillCreditSystem />}

      {/* Milestone-Based Task Tracking (Visible only to logged-in users) */}
      {isLoggedIn && <MilestoneTracking />}

      {/* Secure Agreement System (Visible only to logged-in users) */}
      {isLoggedIn && <SecureAgreement />}

      {/* Trusted By Section */}
      <div className="max-w-6xl mx-auto py-12 text-center">
        <h3 className="text-gray-400 text-sm uppercase tracking-wider">
          Trusted by leading companies
        </h3>
        <div className="flex justify-center items-center gap-12 mt-6">
          <img
            src="/logo1.png"
            alt="Company 1"
            className="h-10 filter brightness-0 invert"
          />
          <img
            src="/logo2.png"
            alt="Company 2"
            className="h-10 filter brightness-0 invert"
          />
          <img
            src="/logo3.png"
            alt="Company 3"
            className="h-10 filter brightness-0 invert"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png"
            alt="Microsoft"
            className="h-10 filter brightness-0 invert"
          />
        </div>
      </div>

      {/* Services Section */}
      <section className="max-w-6xl mx-auto py-16">
        <h2 className="text-3xl font-bold text-gray-100 text-center">
          Explore the Marketplace
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <ServiceCard
            icon="🎨"
            title="Graphic Design"
            description="Logos, banners, illustrations, and more."
          />
          <ServiceCard
            icon="💻"
            title="Web Development"
            description="Build your website or app with experts."
          />
          <ServiceCard
            icon="📝"
            title="Content Writing"
            description="Engaging content for your brand."
          />
          <ServiceCard
            icon="🔍"
            title="SEO & Marketing"
            description="Boost your online presence."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto py-16 bg-gray-800">
        <h2 className="text-3xl font-bold text-gray-100 text-center">
          How It Works
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard
            step="1"
            title="Create Your Profile"
            description="Sign up and showcase your skills to the community."
          />
          <StepCard
            step="2"
            title="Browse Services"
            description="Find the services you need or offer your own."
          />
          <StepCard
            step="3"
            title="Connect & Collaborate"
            description="Connect with others and start collaborating."
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto py-16">
        <h2 className="text-3xl font-bold text-gray-100 text-center">
          What Our Users Say
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            name="Sarah Johnson"
            role="Freelance Designer"
            review="This platform has completely transformed my freelance career. I've found consistent work and built lasting relationships."
          />
          <TestimonialCard
            name="Michael Chen"
            role="Startup Founder"
            review="As a startup founder, finding skilled talent was a challenge. This platform made it easy to connect with talented professionals."
          />
          <TestimonialCard
            name="Emily Rodriguez"
            role="Content Creator"
            review="The skill exchange feature is brilliant! I've been able to trade my writing skills for web development help."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto py-16">
        <CTA
          title="Ready to Start Your Journey?"
          subtitle="Join thousands of professionals who are already trading skills and building their careers."
          primaryButtonText="Get Started"
          primaryButtonAction={() => window.location.href = "/register"}
          secondaryButtonText="Learn More"
          secondaryButtonAction={() => window.location.href = "/about"}
          primaryButtonIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          }
          secondaryButtonIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          }
        />
      </section>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

// Step Card Component
const StepCard = ({ step, title, description }) => {
  return (
    <div className="bg-gray-700 p-6 rounded-lg">
      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-gray-900 font-bold mb-4">
        {step}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, role, review }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <p className="text-gray-300 italic mb-4">"{review}"</p>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-gray-400 text-sm">{role}</p>
      </div>
    </div>
  );
};

export default Home;
