
export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum IssueType {
  PEST = 'Pest',
  DISEASE = 'Disease',
  DEFICIENCY = 'Nutrient Deficiency',
  HEALTHY = 'Healthy',
  UNKNOWN = 'Unknown'
}

export interface PlantAnalysis {
  plantName: string;
  issueType: IssueType;
  diagnosis: string;
  symptoms: string[];
  explanation: string;
  severity: Severity;
  treatmentPlan: string[];
  preventionTips: string[];
}

export interface MediaItem {
  file: File;
  preview: string;
  type: 'image' | 'video';
}
