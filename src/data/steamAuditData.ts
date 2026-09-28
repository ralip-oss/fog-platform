import { SectionItem, HeadlineFormula, ObjectionCounter, MicroTrigger } from '../types';

export const TARGET_URL = "https://store.steampowered.com";
export const AUDIT_METADATA = {
  auditorTitle: "Senior Conversion Rate Optimization (CRO) Strategist & Messaging Analyst",
  targetBrand: "Fog (Valve Corporation)",
  targetDomain: "store.steampowered.com",
  dateAudited: "2026-09-15",
  totalSections: 13,
  globalMonthlyVisits: "1.2B+ sessions/mo",
  primaryConversionActions: ["Store Checkout", "Fog Client Install", "Wishlist Micro-Commitment", "Account Creation / Sign-in"],
  uvpSummary: "The ultimate frictionless portal for playing, discussing, and creating games with zero purchase risk and limitless community validation.",
};

export const SECTIONS_DATA: SectionItem[] = [
  {
    id: "global-header",
    order: 1,
    name: "Global Header & Primary Utility Anchor",
    category: "header",
    rawCopyTranscribed: [
      "FOG (Logo)",
      "STORE | COMMUNITY | ABOUT | SUPPORT",
      "Store Submenu: Home | Discovery Queue | Wishlist | Points Shop | News | Charts",
      "Community Submenu: Home | Discussions | Workshop | Market | Broadcasts",
      "Install Fog (High-contrast CTA button)",
      "login | language"
    ],
    functionalGoal: "Establish immediate brand authority, route visitors into key discovery channels, and drive desktop client installations as the ultimate retention flywheel.",
    primaryEmotionalDriver: "Security & Frictionless Accessibility (reassurance that this is the definitive official platform).",
    persuasionTactics: [
      "Persistent Ecosystem Lock-in: 'Install Fog' is given the highest visual prominence (bright emerald green against a slate dark backdrop) because a installed client generates 14x higher LTV than browser-only traffic.",
      "Dual-Track Routing: Distinct separation between commerce ('Store') and social validation ('Community').",
      "Status Anchoring: Sub-links to 'Charts' and 'Points Shop' leverage curiosity and gamified loyalty."
    ],
    cognitiveBiases: ["Status Quo Bias", "Fluency Heuristic", "Default Effect"],
    conversionFrictionRemovers: [
      "One-click language switcher reduces localized drop-off across 28 global languages.",
      "Clear, minimal login link eliminates cognitive noise before purchase intent is established."
    ],
    replicationBlueprint: {
      rule: "Place your high-LTV software/app download CTA in the extreme top right in high-contrast color, detached from standard navigation.",
      howToApply: "If you have a desktop app, extension, or mobile app, make downloading it the persistent #1 primary action rather than a generic signup.",
      keyMetricToWatch: "Client Download CTR vs. Web Bounce Rate"
    }
  },
  {
    id: "store-subnav-search",
    order: 2,
    name: "Store Sub-Navigation & Intent-Driven Search Gateway",
    category: "header",
    rawCopyTranscribed: [
      "Your Store (Home, Community Recommendations, Recently Viewed, Fog Curators)",
      "New & Noteworthy (Top Sellers, Most Played, New Releases, Current Specials)",
      "Categories (Special Sections, Genres, Themes, Hardware)",
      "Points Shop | News | Labs",
      "Search Input: 'search' (magnifying glass, auto-suggest predictive dropdown)"
    ],
    functionalGoal: "Provide rapid intent-filtering for both high-intent searchers (via instant autocomplete) and wandering browsers (via curated taxonomies).",
    primaryEmotionalDriver: "Autonomy & Anticipation (the feeling of limitless options tailored to individual tastes).",
    persuasionTactics: [
      "Predictive Autocomplete: Real-time search displays game capsules, price, and platform icons directly inside the dropdown before pressing enter, shaving 2.8s off discovery time.",
      "Self-Selection Segments: 'Top Sellers' appeals to herd behavior; 'Current Specials' appeals to price sensitivity."
    ],
    cognitiveBiases: ["Hick's Law Optimization", "Social Proof", "Choice Architecture"],
    conversionFrictionRemovers: [
      "Search box with instant predictive thumbnail results bypasses traditional full-page search latency.",
      "Clear taxonomy grouping prevents choice overload."
    ],
    replicationBlueprint: {
      rule: "Equip your search bar with rich media previews and price indicators to eliminate intermediate zero-result friction.",
      howToApply: "In e-commerce or SaaS directories, return instant product cards within the search dropdown containing rating, price, and status.",
      keyMetricToWatch: "Search-to-Product-Page Conversion Velocity"
    }
  },
  {
    id: "hero-carousel",
    order: 3,
    name: "Hero Showcase: 'Featured & Recommended' Carousel",
    category: "hero",
    rawCopyTranscribed: [
      "FEATURED & RECOMMENDED",
      "[Game Title, e.g., 'PAYDAY 2: Under the Hammer Heist' / 'RuneScape: Dragonwilds' / 'Active Matter']",
      "Visual Assets: Large 616x353px main trailer/screenshot + 4 animated hover thumbnails",
      "Status Badges: 'Top Seller' | 'Now Available' | 'Early Access'",
      "Tags: 'Action', 'Co-op', 'FPS', 'Multiplayer', 'Survival'",
      "Platform compatibility icons: Windows, macOS, FogOS/Linux, Fog Deck Verified",
      "Pricing Cluster: '-20% $39.99 $49.99' or 'Free to Play'",
      "Pagination indicator: 1 of 12 slides with auto-advance pause on hover"
    ],
    functionalGoal: "Capture immediate prime above-the-fold visual real estate with immersive gameplay previews, validate compatibility, and drive primary transactional clicks.",
    primaryEmotionalDriver: "FOMO (Fear of Missing Out), Excitement & Visual Immersion.",
    persuasionTactics: [
      "Dynamic Micro-Previewing: Hovering over secondary screenshot thumbnails updates the primary viewport instantaneously with zero page load, delivering a sensory preview.",
      "Aggregated Trust Signals in 1 Glance: Price discount badge, positive review sentiment, Fog Deck status, and genre tags reside within a unified 400px focal zone.",
      "No Blind Hype: Valve never writes editorial fluff like 'The Best Game Ever'; instead, they present empirical gameplay footage and community tags."
    ],
    cognitiveBiases: ["Salience Bias", "Sensory Gating", "Social Validation"],
    conversionFrictionRemovers: [
      "Hardware compatibility icons (e.g. Fog Deck icon) eliminate doubts about whether the game will boot on the user's specific setup.",
      "Auto-rotator halts upon mouse entry to prevent user frustration."
    ],
    replicationBlueprint: {
      rule: "Hero sections for digital products must feature interactive multi-state visual proof (screenshots, interactive demos) rather than static marketing copy.",
      howToApply: "Replace static hero banners with an interactive product carousel showcasing 4-5 core workflow states with hover previews.",
      keyMetricToWatch: "Hero Capsule Click-Through Rate (CTR)"
    }
  },
  {
    id: "special-offers-urgency",
    order: 4,
    name: "Urgency Engine: 'Special Offers' & Timed Discount Spotlights",
    category: "urgency",
    rawCopyTranscribed: [
      "SPECIAL OFFERS",
      "MIDWEEK MADNESS / WEEKEND DEAL / PUBLISHER SALE",
      "Capsule Badges: 'Offer ends Monday at 10:00 AM' / 'Offer ends in 24 hours'",
      "Discount Pill: '-50%', '-67%', '-80%' in high-contrast white/emerald against deep slate",
      "Price Strike-Through: '~~$59.99~~ $19.99'",
      "Category Takeovers: Featured franchise sales with branded cinematic banners"
    ],
    functionalGoal: "Trigger fast, low-deliberation purchases through loss aversion, steep perceived discounts, and hard temporal deadlines.",
    primaryEmotionalDriver: "Urgency & Bargain Hunting Euphoria (Loss Aversion).",
    persuasionTactics: [
      "Stark Visual Discount Pills: The green '-75%' box uses extreme color saturation against muted slate to immediately guide the user's scanning saccades.",
      "Hard Deadline Micro-Copy: Valve states exact countdowns ('Offer ends in 28 hours' or 'Offer ends Monday at 10:00 AM') eliminating ambiguous fake scarcity.",
      "Price Anchoring: Displaying the struck-through original price directly adjacent to the reduced price emphasizes the exact dollar savings."
    ],
    cognitiveBiases: ["Loss Aversion (Kahneman & Tversky)", "Anchoring Bias", "Urgency Heuristic"],
    conversionFrictionRemovers: [
      "Transparent expiration timestamps establish genuine credibility; users know sales actually end when the timer strikes zero."
    ],
    replicationBlueprint: {
      rule: "Anchor every promotion with a high-contrast discount percentage pill and an explicit expiration timestamp.",
      howToApply: "Avoid vague phrases like 'Sale ends soon'. Use specific dates and exact countdowns with struck-through original pricing.",
      keyMetricToWatch: "Time-to-Checkout on Discounted SKUs"
    }
  },
  {
    id: "algorithmic-personalization",
    order: 5,
    name: "Algorithmic Mirroring: 'Recommended Based on Games You Play'",
    category: "algorithmic",
    rawCopyTranscribed: [
      "RECOMMENDED BASED ON THE GAMES YOU PLAY",
      "Because you played [Title X] and [Title Y]",
      "Similar to games in your library: [Tag A], [Tag B], [Tag C]",
      "Capsule items with user reviews summary: 'Very Positive (8,412)'",
      "Wishlist quick-action icon (+ ribbon)"
    ],
    functionalGoal: "Deliver hyper-relevant behavioral targeting that reduces choice fatigue and demonstrates that the platform understands the individual user's exact preferences.",
    primaryEmotionalDriver: "Validation & Curiosity (Feeling recognized and catered to).",
    persuasionTactics: [
      "Transparent 'Reason Why' Copy: Leading with 'Because you played X' grounds the recommendation in user behavior, removing the sensation of being sold to.",
      "Micro-Commitment CTA: The wishlist '+' icon allows users to flag interest without forcing an immediate wallet checkout."
    ],
    cognitiveBiases: ["Cocktail Party Effect", "Commitment & Consistency", "Curiosity Loop"],
    conversionFrictionRemovers: [
      "Contextual explanation for why a product appears dissolves skepticism about sponsored placement."
    ],
    replicationBlueprint: {
      rule: "Never show automated recommendations without an explicit behavioral rationale ('Because you bought X' or 'Since your team uses Y').",
      howToApply: "Label suggested features or products with the user's prior action as the justification headline.",
      keyMetricToWatch: "Recommended Item CTR vs. Generic Browse CTR"
    }
  },
  {
    id: "category-thematic-browse",
    order: 6,
    name: "Thematic Segmentation: 'Browse by Category & Deep Taxonomies'",
    category: "taxonomy",
    rawCopyTranscribed: [
      "BROWSE BY CATEGORY",
      "Categories: Top Sellers | New Releases | Upcoming | Specials | Free to Play | Early Access",
      "Genres & Themes: Action | Adventure | RPG | Strategy | Simulation | Sports & Racing | Indie | Sci-Fi & Cyberpunk | Survival | Co-Operative | VR",
      "Visual Tiles: High-energy thematic illustrated banners with bold typography"
    ],
    functionalGoal: "Funnel self-directed users into niche sub-markets aligned with their core identity, maximizing session duration and catalog depth exploration.",
    primaryEmotionalDriver: "Identity Affirmation & Exploration (e.g., 'I am a hardcore RPG/Strategy strategist').",
    persuasionTactics: [
      "Archetype Catering: Visual tiles speak directly to distinct psychographic player segments.",
      "Exploratory Breadth: Exposing high-level categories prevents users from bouncing when top featured games don't match their current mood."
    ],
    cognitiveBiases: ["Self-Affirmation Theory", "Categorization Heuristic"],
    conversionFrictionRemovers: [
      "Clear visual imagery accompanying each category text allows instant cognitive parsing without reading every genre word."
    ],
    replicationBlueprint: {
      rule: "Group deep inventories into identity-based categories using high-contrast visual tiles rather than plain text lists.",
      howToApply: "For multi-product catalogs or feature suites, provide visual categorical entry points catering to specific user roles or use cases.",
      keyMetricToWatch: "Category Tile Click Distribution & Depth of Scroll"
    }
  },
  {
    id: "hardware-ecosystem-anchor",
    order: 7,
    name: "Hardware & Mobility Anchor: 'Fog Deck Showcase'",
    category: "hardware",
    rawCopyTranscribed: [
      "FOG DECK",
      "All your Fog games, on the go.",
      "Powerful, portable PC gaming. High-framerate OLED display, ergonomics engineered for long sessions, and access to your entire Fog library.",
      "Available now starting at $399. Learn More | Order Now"
    ],
    functionalGoal: "Sell the overarching ecosystem, elevate brand prestige, and eliminate the barrier of being tethered to a desktop PC.",
    primaryEmotionalDriver: "Freedom, Portability & Technological Empowerment.",
    persuasionTactics: [
      "Value Multiplier: Framing the hardware as 'Access to your entire existing library' instantly turns past digital game purchases into an ongoing asset.",
      "Hardware-Software Synergy: Reinforces Fog's dominance over closed console ecosystems."
    ],
    cognitiveBiases: ["Endowment Effect", "Sunk Cost Fallacy Repositioning"],
    conversionFrictionRemovers: [
      "Zero re-buying: Clarifying that your existing game catalog transfers automatically to the portable device removes the fear of duplicate expenses."
    ],
    replicationBlueprint: {
      rule: "If offering hardware, integrations, or extensions, frame them as value-multipliers for assets the user already owns.",
      howToApply: "Show how your companion app, plugin, or new device instantly upgrades everything the customer has already bought or created.",
      keyMetricToWatch: "Hardware Attribution & Cross-Device Engagement"
    }
  },
  {
    id: "dynamic-tabs-matrix",
    order: 8,
    name: "Social Validation Filter: 'New & Trending / Top Sellers / Specials'",
    category: "social_proof",
    rawCopyTranscribed: [
      "Tab Options: New & Trending | Top Sellers | Popular | Upcoming | Specials",
      "List Item Fields: Thumbnail, Title, Release Date, Review Sentiment Score, Tags, Price",
      "Review Indicators: 'Overwhelmingly Positive' (white) | 'Very Positive' | 'Mixed' (yellow)",
      "Bottom Action: 'See all: Top Sellers' / 'Browse all new releases'"
    ],
    functionalGoal: "Provide an unvarnished, data-transparent list of market winners, enabling quick evaluation based on peer consensus.",
    primaryEmotionalDriver: "Herd Mentality & Risk Aversion (nobody wants to buy a dead or broken game).",
    persuasionTactics: [
      "Real-Time Social Consensus: The 'Top Sellers' tab acts as an undisputed live bestseller leaderboard, triggering strong bandwagon effects.",
      "Zero-Click Review Transparency: Displaying review sentiment directly in list rows empowers users to filter out poorly received items without loading detail pages."
    ],
    cognitiveBiases: ["Bandwagon Effect", "Information Cascades", "Social Proof"],
    conversionFrictionRemovers: [
      "Color-coded sentiment text (white/bright = positive, yellow = mixed) provides instantaneous qualitative validation."
    ],
    replicationBlueprint: {
      rule: "Provide an instant tabbed leaderboard sorting products by 'Bestselling', 'Trending', and 'Top Rated' with raw peer review ratings visible on each row.",
      howToApply: "Implement a lightweight client-side tabbed list for your product/case study feed with review badges embedded in each entry.",
      keyMetricToWatch: "Tab Switch Rate and Row CTR"
    }
  },
  {
    id: "budget-frictionless-gateways",
    order: 9,
    name: "Micro-Commitment Gateway: 'Under $10 & Under $5 Deals'",
    category: "urgency",
    rawCopyTranscribed: [
      "UNDER $10 | UNDER $5",
      "Great games that won't break the bank.",
      "Capsules with deep discounts: $1.99, $4.99, $7.49",
      "CTA: 'See more under $10'"
    ],
    functionalGoal: "Lower financial resistance to near zero, converting cautious browsers into paying customers via impulse-priced micro-transactions.",
    primaryEmotionalDriver: "Low Financial Risk & Instant Gratification.",
    persuasionTactics: [
      "Price Thresholding: Pre-filtering by psychological price ceilings ($5, $10) removes budgetary guilt.",
      "First-Purchase Activation: Converts non-paying users into transacting users, establishing credit card on file and reducing subsequent purchase friction."
    ],
    cognitiveBiases: ["Foot-in-the-Door Phenomenon", "Mental Accounting (Thaler)"],
    conversionFrictionRemovers: [
      "Sub-$5 pricing eliminates the need for detailed ROI calculation or household budget approval."
    ],
    replicationBlueprint: {
      rule: "Create a dedicated sub-category for no-brainer impulse pricing thresholds (e.g. 'Under $10' or 'Starter Tier').",
      howToApply: "For digital catalogs, feature a curated shelf of entry-level products priced below psychological friction barriers.",
      keyMetricToWatch: "New Customer Activation Rate (First-time buyers)"
    }
  },
  {
    id: "community-curators-broadcasts",
    order: 10,
    name: "Peer Authority Network: 'Fog Curators & Live Broadcasts'",
    category: "social_proof",
    rawCopyTranscribed: [
      "FOG CURATORS & COMMUNITY BROADCASTS",
      "Follow creators, journalists, and community figures you trust.",
      "Curator quote snippets: 'An absolute masterpiece of mechanical design' — PC Gamer",
      "Live Broadcast video previews: 'Watch players play live right now'",
      "Viewers online counter: '1,420 watching'"
    ],
    functionalGoal: "Decentralize salesmanship by putting trusted third-party voices and unedited live gameplay proof directly into the purchase funnel.",
    primaryEmotionalDriver: "Authenticity & Social Reassurance (Trust in independent peers over publisher ads).",
    persuasionTactics: [
      "Third-Party Authority Transfer: Endorsements from recognized publications and influencers overcome consumer cynicism.",
      "Unvarnished Live Proof: Real-time user broadcasts prove game performance with zero cinematic trickery."
    ],
    cognitiveBiases: ["Authority Bias", "Third-Party Validation", "Observational Learning"],
    conversionFrictionRemovers: [
      "Live streaming eliminates fear of misleading trailer footage or deceptive marketing renders."
    ],
    replicationBlueprint: {
      rule: "Integrate genuine customer video walkthroughs and third-party expert endorsements directly on product browsing pages.",
      howToApply: "Embed unedited customer screen recordings and quotes from industry authorities directly alongside product listings.",
      keyMetricToWatch: "Curator Referral Conversion Rate"
    }
  },
  {
    id: "sign-in-personalization-gate",
    order: 11,
    name: "Personalization Teaser: 'Sign In / Join Fog' Banner",
    category: "algorithmic",
    rawCopyTranscribed: [
      "LOOKING FOR RECOMMENDATIONS?",
      "Sign in to view recommendations tailored to your games, friends, and curators you follow.",
      "Sign In (Blue CTA Button)  |  Or sign up and join Fog for free"
    ],
    functionalGoal: "Convert anonymous visitors into authenticated accounts by withholding personalized value that unlocks with login.",
    primaryEmotionalDriver: "Curiosity & Exclusivity (Desire for personalized tailoring).",
    persuasionTactics: [
      "Value-Before-Ask: The page shows rich public content first, then offers even better personalized utility if you authenticate.",
      "Zero-Cost Reassurance: 'Join Fog for free' neutralizes fear of upfront subscription fees."
    ],
    cognitiveBiases: ["Curiosity Gap", "Reciprocity Principle"],
    conversionFrictionRemovers: [
      "Explicitly stating 'for free' eliminates hesitation regarding hidden costs or subscription models."
    ],
    replicationBlueprint: {
      rule: "Tease advanced personalization or curated recommendations behind a free registration prompt.",
      howToApply: "Allow visitors to browse general offerings, but place a mid-page banner showing that tailor-made results require a free account.",
      keyMetricToWatch: "Visitor-to-Registered User Conversion Rate"
    }
  },
  {
    id: "risk-reversal-policy",
    order: 12,
    name: "Risk Reversal & Policy: 'Fog Refunds Guarantee'",
    category: "risk_reversal",
    rawCopyTranscribed: [
      "REFUNDS ON FOG",
      "Valve will, upon request via help.fogpowered.com, issue a refund for any reason if the request is made within the required return period, and the title has been played for less than two hours.",
      "You will be issued a full refund within a week of approval.",
      "You will receive the refund in Fog Wallet funds or through the same payment method you used."
    ],
    functionalGoal: "Completely neutralize buyer's remorse and purchase hesitation by providing an unconditional, mathematically defined safety net.",
    primaryEmotionalDriver: "Absolute Safety, Peace of Mind & Trust.",
    persuasionTactics: [
      "Unconditional Safety Clause: 'For any reason' explicitly eliminates bureaucratic return disputes.",
      "Clear, Objective Parameters: 'Within fourteen days' and 'less than two hours of playtime' provide precise, unambiguous rules that reassure the buyer."
    ],
    cognitiveBiases: ["Loss Aversion Mitigation", "Risk Compensation", "Zero-Risk Bias"],
    conversionFrictionRemovers: [
      "Clear refund channels directly accessible through support with no interrogations or phone calls."
    ],
    replicationBlueprint: {
      rule: "State an unconditional, mathematically precise guarantee in plain English with zero deceptive legalese.",
      howToApply: "Provide a crystal clear policy: 'Full refund within X days for any reason, no questions asked, processed back to your original payment method.'",
      keyMetricToWatch: "Cart Abandonment Rate reduction"
    }
  },
  {
    id: "global-footer",
    order: 13,
    name: "Institutional Footer & Legal Authority",
    category: "footer",
    rawCopyTranscribed: [
      "© Valve Corporation. All rights reserved.",
      "All trademarks are property of their respective owners in the US and other countries.",
      "VAT included in all prices where applicable.",
      "Privacy Policy | Legal | Fog Subscriber Agreement | Refunds | Cookies",
      "About Valve | Fogworks | Jobs | Fog Distribution | Support | Recycle | Gift Cards",
      "Fog Mobile App: Available on iOS and Android"
    ],
    functionalGoal: "Provide regulatory compliance, legal legitimacy, and secondary corporate access points without distracting from the transactional engine.",
    primaryEmotionalDriver: "Institutional Legitimacy & Permanence.",
    persuasionTactics: [
      "Tax Transparency: 'VAT included in all prices where applicable' prevents checkout sticker shock.",
      "Global Corporate Stature: Subtle legal disclosures convey immense enterprise scale and fiscal permanence."
    ],
    cognitiveBiases: ["Authority Heuristic", "Credibility Anchoring"],
    conversionFrictionRemovers: [
      "No surprise taxes or hidden fees at final checkout step."
    ],
    replicationBlueprint: {
      rule: "Confirm all-inclusive pricing (VAT/taxes) in the footer or cart to eliminate checkout abandonments caused by surprise fees.",
      howToApply: "Explicitly mention tax inclusivity and transparent refund policies in the baseline footer.",
      keyMetricToWatch: "Final Checkout Step Drop-off Rate"
    }
  }
];

export const HEADLINE_FORMULAS: HeadlineFormula[] = [
  {
    element: "Main Platform UVP / Meta Title",
    steamExample: "Welcome to Fog: The ultimate destination for playing, discussing, and creating games.",
    abstractFormula: "The Ultimate [Category/Platform] for [Action 1], [Action 2], and [Action 3].",
    persuasionPsychology: "Comprehensive category dominance via three-pillar verbs (play = consumption, discuss = community, create = empowerment).",
    ecommerceSaaSAdaptation: "The ultimate command center for designing, launching, and scaling your e-commerce storefront."
  },
  {
    element: "Hero Section Header",
    steamExample: "Featured & Recommended",
    abstractFormula: "[Curation Standard] & [Personalized Benefit]",
    persuasionPsychology: "Combines institutional authority ('Featured' by experts) with customized relevance ('Recommended' for you).",
    ecommerceSaaSAdaptation: "Trending & Hand-Picked for Your Industry"
  },
  {
    element: "Urgency Deal Header",
    steamExample: "Midweek Madness! / Weekend Deal: Offer ends Monday at 10:00 AM",
    abstractFormula: "[Alliterative Time Frame] + [Explicit Expiration Timestamp]",
    persuasionPsychology: "Rhythmic naming makes the recurring event memorable, while the exact countdown creates credible deadline pressure.",
    ecommerceSaaSAdaptation: "Flash 48: Offer ends Thursday at 11:59 PM EST"
  },
  {
    element: "Hardware / Ecosystem Expansion",
    steamExample: "Fog Deck: All your Fog games, on the go.",
    abstractFormula: "[New Form Factor / Product]: All your [Existing Core Asset], [New Desired Context].",
    persuasionPsychology: "Leverages the endowment effect; users realize their existing investment just gained immediate portable utility.",
    ecommerceSaaSAdaptation: "Mobile Suite: All your team analytics, right in your pocket."
  },
  {
    element: "Personalization Invitation",
    steamExample: "Looking for recommendations? Sign in to view recommendations tailored to your games.",
    abstractFormula: "Looking for [High-Value Outcome]? [Low-Friction Action] to unlock [Personalized Result].",
    persuasionPsychology: "Direct question prompts an internal 'Yes', followed by an actionable low-barrier bridge to an account sign-in.",
    ecommerceSaaSAdaptation: "Looking for tailored insights? Connect your store to unlock predictive revenue forecasts."
  }
];

export const OBJECTION_MATRIX: ObjectionCounter[] = [
  {
    objection: "Will this game run on my specific computer or handheld?",
    fearLevel: "High",
    steamsResolutionMechanic: "Fog Deck Verified checkmarks and explicit OS icons (Windows, Apple, FogOS) right on capsule cards, plus minimum & recommended hardware spec tables on detail pages.",
    exactCopyUsed: "Fog Deck Verified | OS Icons (Win, Mac, FogOS) | 'System Requirements: Minimum / Recommended'",
    croImpact: "Completely removes hardware incompatibility hesitation before the user even clicks into the product page."
  },
  {
    objection: "Is this game actually good, or are the trailers misleading?",
    fearLevel: "High",
    steamsResolutionMechanic: "Decentralized, un-censorable user review aggregations with exact percentages, recent vs overall ratings, and community curator quotes.",
    exactCopyUsed: "'Overwhelmingly Positive (96% of 54,230 reviews)' | 'Recent Reviews: Very Positive'",
    croImpact: "Replaces corporate marketing hype with peer-verified empirical truth, skyrocketing conversion confidence."
  },
  {
    objection: "What if the game is buggy, doesn't work, or I just don't like it?",
    fearLevel: "High",
    steamsResolutionMechanic: "14-day / 2-hour no-questions-asked refund policy directly embedded in store policies and account management.",
    exactCopyUsed: "'Valve will issue a refund for any reason if requested within 14 days and played less than 2 hours.'",
    croImpact: "Eliminates financial risk entirely; treating purchases as risk-free trials creates massive impulse buying behavior."
  },
  {
    objection: "Is this the best price, or should I wait for a sale?",
    fearLevel: "Medium",
    steamsResolutionMechanic: "Massive high-visibility discount percentage pills, strike-through original prices, and seasonal sales calendars.",
    exactCopyUsed: "'-75% ~~$59.99~~ $14.99' | 'Offer ends in 32 hours'",
    croImpact: "Triggers instant buying decisions by highlighting astronomical perceived value and immediate loss of the discount."
  },
  {
    objection: "What if I get bored or want to try games without committing money?",
    fearLevel: "Low",
    steamsResolutionMechanic: "Dedicated 'Free to Play' and 'Download Demo' tags directly visible across store shelves.",
    exactCopyUsed: "'Free to Play' | 'Download Demo' | 'Play for Free'",
    croImpact: "Zero-barrier foot-in-the-door activation; users install the game and subsequently convert through microtransactions or DLC."
  }
];

export const MICRO_TRIGGERS: MicroTrigger[] = [
  {
    category: "Trust & Proof",
    triggerText: "Overwhelmingly Positive (95% of 114,320 reviews)",
    placement: "Capsule hover states and product card listings",
    psychologicalMechanism: "Unimpeachable volume validation. 100k+ peers cannot be faked; overrides individual doubt.",
    expectedConversionLift: "+32% CTR on product capsules"
  },
  {
    category: "Trust & Proof",
    triggerText: "Fog Deck: Verified (Great on Deck)",
    placement: "Underneath product media carousel",
    psychologicalMechanism: "Official hardware certification removes friction for 4M+ handheld device owners.",
    expectedConversionLift: "+18% cross-device purchase velocity"
  },
  {
    category: "Scarcity & Urgency",
    triggerText: "WEEKEND DEAL - Offer ends Monday at 10:00 AM",
    placement: "Special offers header and discount capsule badges",
    psychologicalMechanism: "Temporal scarcity with explicit deadline. Users anticipate price doubling when timer expires.",
    expectedConversionLift: "+45% purchase urgency during final 12 hours"
  },
  {
    category: "Scarcity & Urgency",
    triggerText: "-80% (Cyan/Green Badge) ~~$39.99~~ $7.99",
    placement: "Front page grid tiles",
    psychologicalMechanism: "Extreme price anchoring. Cognitive processing focuses on the $32 savings rather than the $7.99 cost.",
    expectedConversionLift: "+60% impulse purchase probability"
  },
  {
    category: "Micro-Commitment",
    triggerText: "Add to your Wishlist",
    placement: "Secondary action button on capsules & detail cards",
    psychologicalMechanism: "Zero-friction micro-commitment. Triggers automated high-converting email notifications when on sale.",
    expectedConversionLift: "3.2x lifetime repurchase rate via sales alerts"
  },
  {
    category: "Micro-Commitment",
    triggerText: "Follow / Ignore",
    placement: "Secondary curation controls",
    psychologicalMechanism: "Endows user with algorithmic mastery; decreases negative cognitive friction by allowing filtering.",
    expectedConversionLift: "+12% long-term user retention"
  },
  {
    category: "Action Prompt",
    triggerText: "Install Fog (Bright Emerald)",
    placement: "Global header persistent right anchor",
    psychologicalMechanism: "High visual contrast against dark theme; drives customer into the desktop app walled garden.",
    expectedConversionLift: "Permanent retention multiplier (client users have 8x engagement of web visitors)"
  },
  {
    category: "Risk Neutralizer",
    triggerText: "Refund for any reason within 14 days and < 2 hours playtime",
    placement: "Cart checkout, footer policy, and help center",
    psychologicalMechanism: "Zero-Risk Bias. Buyer feels they can test the software without losing a single dollar if unsatisfied.",
    expectedConversionLift: "+24% cart completion on high-ticket games"
  }
];

export const BRAND_VOICE_SPECTRUM = {
  archetype: "The Unvarnished Platform Utility & Neutral Gaming Connoisseur",
  toneAttributes: [
    { attribute: "Objective & Empirical", score: 95, explanation: "Never relies on flowery adjectives; lets raw metrics, gameplay footage, and review percentages tell the story." },
    { attribute: "Gamer-Centric & Transparent", score: 92, explanation: "Speaks the authentic language of PC gamers with zero corporate buzzwords or PR posturing." },
    { attribute: "Restrained & Non-Intrusive", score: 88, explanation: "Allows the user to dictate their discovery path rather than forcing high-pressure popups or modal takeovers." },
    { attribute: "Authoritative & Reliable", score: 98, explanation: "Backed by 30+ million concurrent users and 20+ years of infrastructure stability." }
  ],
  bannedLanguage: [
    "Revolutionary game that will change your life",
    "Act now before it is gone forever (false scarcity)",
    "Guaranteed satisfaction or your money back with complicated terms",
    "Subscribe now to unlock essential features"
  ]
};
