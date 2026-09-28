export interface SectionItem {
  id: string;
  order: number;
  name: string;
  category: 'header' | 'hero' | 'urgency' | 'algorithmic' | 'taxonomy' | 'hardware' | 'social_proof' | 'risk_reversal' | 'footer';
  rawCopyTranscribed: string[];
  functionalGoal: string;
  primaryEmotionalDriver: string;
  persuasionTactics: string[];
  cognitiveBiases: string[];
  conversionFrictionRemovers: string[];
  replicationBlueprint: {
    rule: string;
    howToApply: string;
    keyMetricToWatch: string;
  };
}

export interface HeadlineFormula {
  element: string;
  steamExample: string;
  abstractFormula: string;
  persuasionPsychology: string;
  ecommerceSaaSAdaptation: string;
}

export interface ObjectionCounter {
  objection: string;
  fearLevel: 'Low' | 'Medium' | 'High';
  steamsResolutionMechanic: string;
  exactCopyUsed: string;
  croImpact: string;
}

export interface MicroTrigger {
  category: 'Trust & Proof' | 'Scarcity & Urgency' | 'Micro-Commitment' | 'Action Prompt' | 'Risk Neutralizer';
  triggerText: string;
  placement: string;
  psychologicalMechanism: string;
  expectedConversionLift: string;
}
