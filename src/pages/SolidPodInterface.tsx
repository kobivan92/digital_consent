import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Database, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { logEvent } from '@/lib/logger';
import { getGdprReason, getConsentProvidedReason } from '@/lib/reasons';

interface DataField {
  id: string;
  label: string;
  description: string;
  required: boolean;
  category: 'basic' | 'contact' | 'personal' | 'professional';
}

const SolidPodInterface = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service') || 'unknown-service';
  const serviceName = searchParams.get('serviceName') || 'Banking Service';
  
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    logEvent({
      event: 'data_request',
      service: serviceName,
      requestedFields: dataFields.map(f => f.id),
      reason: getGdprReason(serviceId, serviceName),
    });
  }, [serviceId, serviceName]);

  const dataFields: DataField[] = [
    { id: 'name', label: 'Full Name', description: 'First and last name', required: true, category: 'basic' },
    { id: 'email', label: 'Email Address', description: 'Primary email contact', required: true, category: 'contact' },
    { id: 'phone', label: 'Mobile Number', description: 'Phone number for contact', required: false, category: 'contact' },
    { id: 'address', label: 'Residential Address', description: 'Full home address', required: false, category: 'contact' },
    { id: 'dateOfBirth', label: 'Date of Birth', description: 'Birth date for age verification', required: false, category: 'personal' },
    { id: 'maritalStatus', label: 'Marital Status', description: 'Current marital status', required: false, category: 'personal' },
    { id: 'jobPosition', label: 'Job Position', description: 'Current employment title', required: false, category: 'professional' },
    { id: 'employer', label: 'Employer', description: 'Current company/organization', required: false, category: 'professional' },
    { id: 'income', label: 'Annual Income', description: 'Yearly income information', required: false, category: 'professional' },
  ];

  const requiredFields = dataFields.filter(field => field.required);
  const hasRequiredData = requiredFields.every(field => selectedData.includes(field.id));

  const handleDataToggle = (fieldId: string, checked: boolean) => {
    if (checked) {
      setSelectedData(prev => [...prev, fieldId]);
    } else {
      setSelectedData(prev => prev.filter(id => id !== fieldId));
    }
  };

  const handleProvideConsent = () => {
    setIsProcessing(true);
    
    logEvent({
      event: 'consent_provided',
      service: serviceName,
      sharedData: selectedData,
      hasRequired: hasRequiredData,
      reason: getConsentProvidedReason(serviceName),
    });
    
    // Simulate processing delay
    setTimeout(() => {
      if (hasRequiredData) {
        // Success - redirect back to bank app
        navigate(`/?consent=success&service=${encodeURIComponent(serviceName)}&data=${selectedData.join(',')}`);
      } else {
        // Insufficient data - redirect back with error
        navigate(`/?consent=insufficient&service=${encodeURIComponent(serviceName)}`);
      }
    }, 2000);
  };

  const handleDeclineConsent = () => {
    logEvent({
      event: 'consent_declined',
      service: serviceName,
    });
    navigate(`/?consent=declined&service=${encodeURIComponent(serviceName)}`);
  };

  const getCategoryFields = (category: string) => {
    return dataFields.filter(field => field.category === category);
  };

  const categories = [
    { id: 'basic', title: 'Basic Information', icon: Database },
    { id: 'contact', title: 'Contact Details', icon: Database },
    { id: 'personal', title: 'Personal Information', icon: Database },
    { id: 'professional', title: 'Professional Information', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-emerald-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-emerald-900">Solid Pod</h1>
                <p className="text-sm text-emerald-600">Personal Data Vault</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to SecureBank
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Consent Request */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-emerald-900 mb-2">Data Sharing Request</h2>
          <p className="text-lg text-emerald-700 mb-4">
            <span className="font-semibold">{serviceName}</span> is requesting access to your personal data
          </p>
          <div className="bg-emerald-100 border border-emerald-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-emerald-800 text-sm">
              You have complete control over what information you share. Select only the data you're comfortable sharing.
              Required fields are marked and must be selected to proceed.
            </p>
          </div>
        </div>

        {/* Data Selection */}
        <div className="space-y-6">
          {categories.map(category => {
            const categoryFields = getCategoryFields(category.id);
            const CategoryIcon = category.icon;
            
            return (
              <Card key={category.id} className="border-emerald-200 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-emerald-900">
                    <CategoryIcon className="h-5 w-5 text-emerald-600" />
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryFields.map(field => (
                      <div key={field.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors">
                        <Checkbox
                          id={field.id}
                          checked={selectedData.includes(field.id)}
                          onCheckedChange={(checked) => handleDataToggle(field.id, !!checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label 
                            htmlFor={field.id} 
                            className="text-emerald-900 font-medium cursor-pointer flex items-center space-x-2"
                          >
                            <span>{field.label}</span>
                            {field.required && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                Required
                              </span>
                            )}
                          </Label>
                          <p className="text-sm text-emerald-600 mt-1">{field.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selection Summary */}
        <Card className="mt-8 border-emerald-200 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-900">Selection Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700">
                  <span className="font-semibold">{selectedData.length}</span> data fields selected
                </p>
                {!hasRequiredData && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Please select all required fields to proceed
                  </p>
                )}
                {hasRequiredData && (
                  <p className="text-emerald-600 text-sm mt-1 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    All required data selected
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={handleDeclineConsent}
            disabled={isProcessing}
            className="px-8 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Decline & Return
          </Button>
          <Button
            onClick={handleProvideConsent}
            disabled={!hasRequiredData || isProcessing}
            className="px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white"
          >
            {isProcessing ? 'Processing...' : 'Provide Consent & Return'}
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="mt-12 bg-teal-50 border border-teal-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-teal-900 mb-2">Your Privacy Rights</h4>
              <ul className="text-sm text-teal-800 space-y-1">
                <li>• You can revoke consent at any time through your Solid Pod settings</li>
                <li>• Your data is encrypted and stored securely in your personal data vault</li>
                <li>• Only selected data will be shared with the requesting service</li>
                <li>• You maintain full ownership and control of your personal information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolidPodInterface;
