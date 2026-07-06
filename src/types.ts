export interface HiringManagerProfile {
  roleName: string;
  department: string;
  traits: string[]; // Important traits
  nonNegotiables: string[]; // Strict criteria
  retentionDrivers: string[]; // What makes them stay long term
  companyCulture: string; // Brief description of culture
}

export type QuestionConstruct =
  | 'P_O_FIT_VALUE' // Person-Organization Fit (Values alignment)
  | 'P_O_FIT_ENVIRONMENT' // P-O Fit (Work environment preference)
  | 'P_J_FIT_AUTONOMY' // Person-Job Fit (Need for autonomy vs guidance)
  | 'P_J_FIT_WORKSTYLE' // P-J Fit (Detail-oriented vs rapid pace)
  | 'BIG5_CONSCIENTIOUSNESS' // Conscientiousness (Reliability, grit)
  | 'BIG5_AGREEABLENESS' // Agreeableness (Team collaboration, low conflict)
  | 'BIG5_RESILIENCE' // Emotional Stability / Resilience (Handling stress)
  | 'RETENTION_DRIVER_MATCH'; // Alignment with long-term retention triggers

export interface Question {
  id: string;
  text: string;
  construct: QuestionConstruct;
  constructLabel: string;
  type: 'scale' | 'choice' | 'scenario';
  choices?: string[]; // For scenario or choices
  category: 'Values' | 'Work Style' | 'Personality' | 'Situational Judgement';
}

export interface CandidateQuestionnaireAnswer {
  questionId: string;
  score: number; // 1 to 5 for scales and indexed choices
  textColorAnswers?: string; // Optional reasoning/text answer for scenario
}

export interface AssessmentResult {
  scoreFitOverall: number; // 0 - 100
  scoreFitJob: number; // 0 - 100
  scoreFitCulture: number; // 0 - 100
  retentionScore: number; // 0 - 100
  retentionPrediction: string; // e.g. "Low Risk (Predicted 3+ Years)", "Moderate Risk"
  conflictPoints: string[];
  successCatalysts: string[];
  cultureFitSummary: string;
  suitabilityRecommendation: string; // "Highly Recommended" | "Recommended" | "Alternative Option" | "Not Recommended"
  detailedExplanation: string;
  assessedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  headline: string;
  answers: CandidateQuestionnaireAnswer[];
  assessment?: AssessmentResult;
  status: 'pending' | 'assessing' | 'completed' | 'failed';
  appliedRole?: string; // Track which role they applied to
}
