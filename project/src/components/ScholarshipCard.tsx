import React from 'react';
import { Calendar, DollarSign, GraduationCap, Building2 } from 'lucide-react';
import { Scholarship } from '../types';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onApply: (id: string) => void;
}

export function ScholarshipCard({ scholarship, onApply }: ScholarshipCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{scholarship.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          scholarship.category === 'government' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-purple-100 text-purple-800'
        }`}>
          {scholarship.category}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <Building2 className="w-5 h-5 mr-2" />
          <span>{scholarship.provider}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-5 h-5 mr-2" />
          <span>${scholarship.amount.toLocaleString()}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-5 h-5 mr-2" />
          <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
        </div>
        {scholarship.gpaRequirement && (
          <div className="flex items-center text-gray-600">
            <GraduationCap className="w-5 h-5 mr-2" />
            <span>Min. GPA: {scholarship.gpaRequirement}</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{scholarship.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {scholarship.fields.map((field) => (
          <span 
            key={field}
            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
          >
            {field}
          </span>
        ))}
      </div>

      <button
        onClick={() => onApply(scholarship.id)}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Apply Now
      </button>
    </div>
  );
}