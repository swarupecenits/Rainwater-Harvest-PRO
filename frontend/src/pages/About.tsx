import React from 'react';
import { DropletIcon, PhoneIcon, MailIcon, MessageSquareIcon, GithubIcon, TwitterIcon, InstagramIcon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
const About: React.FC = () => {
  const teamMembers = [{
    name: 'Dr. Amelia Chen',
    role: 'Hydrologist',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }, {
    name: 'Marcus Johnson',
    role: 'Environmental Engineer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }, {
    name: 'Priya Patel',
    role: 'GIS Specialist',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }, {
    name: 'David Kim',
    role: 'App Developer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }];
  return <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          About RainWise
        </h1>
        <p className="text-gray-600">
          Our mission, team, and contact information
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <DropletIcon className="h-10 w-10 text-blue-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Our Mission</h2>
                <p className="text-gray-600">
                  Empowering water conservation through technology
                </p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              RainWise founded with a simple yet powerful vision: to
              make rainwater harvesting accessible, efficient, and widespread.
              In a world facing increasing water scarcity, we believe that every
              drop counts.
            </p>
            <p className="mb-4 text-gray-700">
              Our app leverages cutting-edge GIS technology, hydrological
              modeling, and user-friendly design to help homeowners, businesses,
              and communities assess their rainwater harvesting potential and
              implement effective systems.
            </p>
            <p className="mb-6 text-gray-700">
              By providing personalized assessments, educational resources, and
              practical guidance, we aim to conserve billions of liters of water
              annually while helping users save money and contribute to
              environmental sustainability.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Our Impact</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-700">50K+</p>
                  <p className="text-sm text-gray-600">Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">120M</p>
                  <p className="text-sm text-gray-600">Liters Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-700">15K+</p>
                  <p className="text-sm text-gray-600">Systems Built</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <PhoneIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">+1 (234) 567-8900</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <MailIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">info@rainwise.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <MessageSquareIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Support</h3>
                  <p className="text-gray-600">support@rainwise.com</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="primary" fullWidth>
                Send Message
              </Button>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </Card>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => <Card key={index} className="p-4 text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </Card>)}
        </div>
      </div>
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">
              How accurate are the assessment results?
            </h3>
            <p className="text-gray-700">
              Our assessments use high-quality rainfall data, GIS mapping, and
              hydrological models to provide estimates that are typically within
              85-95% accuracy. Factors such as local microclimates and specific
              property conditions may affect actual results.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Is my data secure?</h3>
            <p className="text-gray-700">
              Yes, we take data security seriously. All personal information and
              assessment data are encrypted and stored securely. We do not share
              your information with third parties without your explicit consent.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Can I use the app offline?</h3>
            <p className="text-gray-700">
              Some features of RainWise work offline, but for full
              functionality including GIS mapping and up-to-date rainfall data,
              an internet connection is recommended.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">
              Do you offer consultations for large projects?
            </h3>
            <p className="text-gray-700">
              Yes, for commercial properties, institutional buildings, or
              community projects, we offer specialized consulting services.
              Please contact our team for more information.
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Help us conserve water resources for future generations. Every
            assessment completed and system implemented makes a difference.
          </p>
          <Button variant="secondary">Start Your Assessment Today</Button>
        </div>
      </Card>
    </MainLayout>;
};
export default About;