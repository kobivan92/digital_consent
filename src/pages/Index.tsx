
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CreditCard, TrendingUp, Banknote, User, Key, CheckCircle } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import ConsentWaiting from "@/components/ConsentWaiting";

const Index = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [waitingForConsent, setWaitingForConsent] = useState(false);

  const services = [
    {
      id: 'personal-banking',
      title: 'Personal Banking',
      description: 'Comprehensive banking solutions for your everyday financial needs',
      icon: Banknote,
      features: ['Current & Savings Accounts', 'Online Banking', 'Mobile Payments', '24/7 Support'],
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      id: 'investment',
      title: 'Investment Services',
      description: 'Grow your wealth with our expert investment management',
      icon: TrendingUp,
      features: ['Portfolio Management', 'Market Analysis', 'Risk Assessment', 'Financial Planning'],
      gradient: 'from-green-600 to-green-800'
    },
    {
      id: 'credit-solutions',
      title: 'Credit Solutions',
      description: 'Flexible credit options tailored to your financial goals',
      icon: CreditCard,
      features: ['Personal Loans', 'Credit Cards', 'Mortgage Services', 'Business Credit'],
      gradient: 'from-purple-600 to-purple-800'
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuth(false);
    setWaitingForConsent(true);
  };

  const handleConsentComplete = () => {
    setWaitingForConsent(false);
    // Here you would typically redirect to the service or show success
    alert(`Welcome! You can now access ${services.find(s => s.id === selectedService)?.title}`);
    // Reset state
    setSelectedService(null);
    setIsAuthenticated(false);
  };

  if (waitingForConsent) {
    return <ConsentWaiting onConsentComplete={handleConsentComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SecureBank
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Banking Made
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience secure, modern banking with our comprehensive financial services. 
            Your privacy and security are our top priorities with ConsentFlow authentication and Solid pod integration.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">ConsentFlow Security</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <User className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Solid Pod Privacy</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Key className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Digital Certificate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h3>
            <p className="text-xl text-gray-600">Choose the service that best fits your financial needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => handleServiceSelect(service.id)}
                      className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Bank-Grade Security</h3>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Your security and privacy are paramount. We use ConsentFlow authentication and integrate with your Solid pod 
            to ensure you have complete control over your personal data.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Key className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">ConsentFlow Authentication</h4>
              <p className="text-blue-100">Secure login with password or digital certificate</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <User className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Solid Pod Integration</h4>
              <p className="text-blue-100">You control what personal data to share</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Shield className="h-12 w-12 text-green-300 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Privacy First</h4>
              <p className="text-blue-100">Bank-grade encryption and data protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h5 className="text-xl font-bold">SecureBank</h5>
          </div>
          <p className="text-gray-400 mb-6">Secure banking for the digital age</p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal 
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
          serviceName={services.find(s => s.id === selectedService)?.title || ''}
        />
      )}
    </div>
  );
};

export default Index;
