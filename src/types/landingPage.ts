export interface Persona {
  id: string;
  role: string;
  badge: string;
  iconName: 'Cpu' | 'Gamepad2' | 'Sparkles';
  tagline: string;
  keyFrustration: string;
  desiredOutcome: string;
  heroQuote: string;
  steamSolution: string;
  statsHighlight: string;
}

export interface FeatureItem {
  id: string;
  name: string;
  benefit: string; // One-line outcome focused
  description: string;
  iconName: 'Cloud' | 'MonitorPlay' | 'Star' | 'Wrench' | 'ShieldCheck';
  metricTag: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Purchases & Refunds' | 'Cross-Device & Hardware' | 'Features & Social' | 'Security & Account';
}

export interface ShowcaseGame {
  id: string;
  title: string;
  genre: string;
  discount: string;
  originalPrice: string;
  salePrice: string;
  reviewSentiment: string;
  reviewPercentage: number;
  totalReviews: string;
  deckVerified: boolean;
  tag: string;
  imageThumbnail: string;
}
