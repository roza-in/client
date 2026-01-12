import React from 'react';
import { Construction } from 'lucide-react';

const HospitalProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Construction className="w-24 h-24 text-gray-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-primary">UNDER DEVELOPMENT</h1>
        </div>
        <p className="text-lg text-gray-600">This page is currently under active development.</p>
      </div>
    </div>
  );
};

export default HospitalProfilePage;