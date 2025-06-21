
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, CheckCircle, Clock, ExternalLink, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ConsentWaitingProps {
  onConsentComplete: () => void;
}

const ConsentWaiting = ({ onConsentComplete }: ConsentWaitingProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Redirecting to Solid Pod",
    "Loading your personal data options",
    "Waiting for your consent selection",
    "Processing your privacy preferences"
  ];

  const dataFields = [
    { name: "Name", icon: User, description: "First and last name" },
    { name: "Email", icon: User, description: "Email address" },
    { name: "Phone", icon: User, description: "Mobile number" },
    { name: "Address", icon: User, description: "Residential address" },
    { name: "Marital Status", icon: User, description: "Current marital status" },
    { name: "Job Position", icon: User, description: "Current employment details" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return oldProgress + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((oldStep) => {
        if (oldStep >= steps.length - 1) {
          clearInterval(stepTimer);
          return oldStep;
        }
        return oldStep + 1;
      });
    }, 2000);

    return () => clearInterval(stepTimer);
  }, []);

  // Simulate consent completion
  useEffect(() => {
    const completeTimer = setTimeout(() => {
      onConsentComplete();
    }, 12000);

    return () => clearTimeout(completeTimer);
  }, [onConsentComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Data Consent Required
            </h1>
          </div>
          <p className="text-gray-600 mb-6">
            You're being redirected to your Solid Pod to select which personal data to share with SecureBank
          </p>
        </div>

        {/* Progress Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Clock className="h-6 w-6 text-blue-600" />
              <span>Waiting for Your Consent</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="text-blue-600 font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className={`flex items-center space-x-3 ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : index === currentStep ? (
                    <div className="w-5 h-5 border-2 border-blue-600 rounded-full animate-pulse"></div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  )}
                  <span className={`font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Selection Preview */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-6 w-6 text-purple-600" />
              <span>Personal Data Available for Sharing</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              These are the data fields you can choose to share from your Solid Pod:
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dataFields.map((field, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <field.icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{field.name}</p>
                    <p className="text-xs text-gray-500">{field.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 hover:bg-gray-50"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
            onClick={() => window.open('#', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Solid Pod Interface
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Your Privacy is Protected</h4>
              <p className="text-sm text-blue-800">
                You have complete control over what personal data you share. Your Solid Pod ensures that only 
                the data you explicitly consent to will be shared with SecureBank. You can revoke this consent at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentWaiting;
