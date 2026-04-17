import { useState } from 'react';
import { Menu, X, Heart, Users, Phone, Mail, MapPin } from 'lucide-react';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import AdminAuth from './components/AdminAuth';
import Reviews from './components/Reviews';
import EnquiryForm from './components/EnquiryForm';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-2xl font-bold text-gray-800">FoodForAll</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition">Home</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition">About</a>
              <a href="#services" className="text-gray-700 hover:text-green-600 transition">Services</a>
              <a href="#reviews" className="text-gray-700 hover:text-green-600 transition">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition">Contact</a>
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Register
              </button>
              <button
                onClick={() => setShowAdminAuth(true)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
              >
                Admin
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">Home</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">About</a>
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">Services</a>
              <a href="#reviews" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">Reviews</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">Contact</a>
              <button
                onClick={() => setShowLogin(true)}
                className="w-full text-left px-3 py-2 text-green-600 hover:bg-green-50 rounded"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="w-full text-left px-3 py-2 text-green-600 hover:bg-green-50 rounded"
              >
                Register
              </button>
              <button
                onClick={() => setShowAdminAuth(true)}
                className="w-full text-left px-3 py-2 text-gray-800 hover:bg-gray-50 rounded"
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Feeding Hope, Nourishing Lives
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Join us in our mission to eliminate hunger and provide nutritious meals to those in need
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition transform hover:scale-105">
                Donate Now
              </button>
              <button className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg text-lg font-semibold hover:bg-green-50 transition transform hover:scale-105">
                Volunteer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe no one should go hungry. Our NGO works tirelessly to provide nutritious meals to underprivileged communities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-8 rounded-xl text-center hover:shadow-lg transition">
              <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h3>
              <p className="text-gray-700">People Fed Daily</p>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl text-center hover:shadow-lg transition">
              <Heart className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1,000+</h3>
              <p className="text-gray-700">Active Volunteers</p>
            </div>
            <div className="bg-orange-50 p-8 rounded-xl text-center hover:shadow-lg transition">
              <MapPin className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">25+</h3>
              <p className="text-gray-700">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive programs designed to address food insecurity and promote community wellness
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Meals</h3>
              <p className="text-gray-600">Nutritious meals provided to communities in need</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Kitchen</h3>
              <p className="text-gray-600">Large-scale cooking facilities for mass distribution</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Food Distribution</h3>
              <p className="text-gray-600">Efficient delivery to remote and urban areas</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nutrition Education</h3>
              <p className="text-gray-600">Teaching healthy eating habits and cooking skills</p>
            </div>
          </div>
        </div>
      </section>

      <Reviews />
      <EnquiryForm />

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-xl font-bold">FoodForAll</span>
              </div>
              <p className="text-gray-400">Making a difference, one meal at a time.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition">Services</a></li>
                <li><a href="#reviews" className="text-gray-400 hover:text-white transition">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center"><Phone className="h-4 w-4 mr-2" /> +1 234 567 8900</li>
                <li className="flex items-center"><Mail className="h-4 w-4 mr-2" /> info@foodforall.org</li>
                <li className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> 123 Hope Street</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Get Involved</h3>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mb-2">
                Donate
              </button>
              <button className="w-full px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition">
                Volunteer
              </button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FoodForAll NGO. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      {showAdminAuth && <AdminAuth onClose={() => setShowAdminAuth(false)} />}
    </div>
  );
}

export default App;
