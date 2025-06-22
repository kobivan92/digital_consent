export const getGdprReason = (serviceId: string, serviceName: string): string => {
  const serviceDetails: { [key: string]: string } = {
    'personal-banking': 'to provide Personal Banking services, including online account management and mobile payments',
    'investment': 'to provide Investment Services, including portfolio management and financial planning',
    'credit-solutions': 'to provide Credit Solutions, including personal loans and credit card services',
  };

  const detail = serviceDetails[serviceId] || `to provide ${serviceName}`;

  return `Consent obtained under GDPR Article 6(1)(a) for processing personal data ${detail}.`;
};

export const getConsentProvidedReason = (serviceName: string): string => {
  return `User provided consent to access personal data for ${serviceName}.`;
}; 