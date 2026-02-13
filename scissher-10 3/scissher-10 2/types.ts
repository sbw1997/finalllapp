export interface Prompt {
  id: string;
  question: string;
  answer: string;
}

export interface SocialLink {
  platform: 'Instagram' | 'TikTok' | 'Twitter' | 'LinkedIn' | 'Website';
  username: string;
  url: string;
}

export interface VibeCheck {
  label: string;
  value: string; // e.g. "Coffee" vs "Cocktails"
}

export interface TwoTruthsAndAnIllusion {
  statements: string[];
  illusionIndex: number;
}

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  distance: string;
  interests: {
    category: 'Hobbies' | 'Music' | 'Movies' | 'Vibe';
    items: string[];
  }[];
  intentions: string[];
  loveLanguage: string;
  zodiacSign: string;
  relationshipStyle: 'Monogamous' | 'ENM' | 'Polyamorous' | 'Open to either';
  prompts: Prompt[];
  
  // Prismatic Prompts
  idealFirstDate?: string;
  twoTruthsAndAnIllusion?: TwoTruthsAndAnIllusion;
  tableOrder?: string;
  describeSelfOnePhoto?: string; 
  collabProject?: string;
  moodSong?: string;
  morningRitual?: string;
  urbanEscape?: string;
  
  mainPhoto: string;
  publicPhotos: string[];
  privatePhotos: string[];
  availability: AvailabilitySlot[];
  isVerified: boolean;
  isOnline: boolean;
  isPremium: boolean;
  speedDatingTickets: number;
  socialLinks?: SocialLink[];
  currentEnergy?: string;
  prismaticLayers?: string[];
  metropolitanHotspots?: string[];
  creativeMediums?: string[];
  auraColor?: string;
  vibeChecks?: VibeCheck[];
  profileCompletion?: number;
}

export interface AvailabilitySlot {
  day: string;
  slots: string[];
}

export interface DatingEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  attendees: number;
  image: string;
  isLive?: boolean;
}

export type AppView = 'discovery' | 'calendar' | 'events' | 'profile' | 'vault' | 'live' | 'spark' | 'messages';

export type AuthState = 'landing' | 'verifying' | 'identity' | 'onboarding' | 'authorized';