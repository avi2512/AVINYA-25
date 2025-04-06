export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: number;
  deadline: string;
  description: string;
  requirements: string[];
  category: 'government' | 'private';
  fields: string[];
  gpaRequirement?: number;
}

export interface StudentProfile {
  major: string;
  gpa: number;
  interests: string[];
  academicYear: string;
  nationality: string;
}