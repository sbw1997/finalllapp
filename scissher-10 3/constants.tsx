import { User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Maya',
    age: 24,
    bio: 'Art historian by day, experimental chef by night. I date with absolute intention and zero fluff.',
    location: 'Brooklyn, NY',
    distance: '2 miles away',
    currentEnergy: 'Techno Witch',
    auraColor: '#a855f7',
    prismaticLayers: ['High Femme', 'Creative', 'Introvert'],
    metropolitanHotspots: ['Bushwick Raver', 'Prospect Park Sunsets'],
    creativeMediums: ['Oil Paint', 'Soundscapes'],
    vibeChecks: [
      { label: 'Morning Person', value: 'Night Owl' },
      { label: 'City Hikes', value: 'Museum Crawls' }
    ],
    interests: [
      { category: 'Hobbies', items: ['Abstract Art', 'Sourdough', 'Techno', 'Pottery'] },
      { category: 'Music', items: ['King Princess', 'Girl in Red', 'Fletcher', 'Muna'] }
    ],
    intentions: ['Long-term relationship'],
    loveLanguage: 'Acts of Service',
    zodiacSign: 'Scorpio',
    relationshipStyle: 'Monogamous',
    idealFirstDate: 'A rainy Tuesday at a dusty record store followed by natural wine and zero small talk.',
    tableOrder: 'A bottle of chilled orange wine, grilled halloumi with honey, and a side of deep conversation.',
    describeSelfOnePhoto: 'Captured in my natural habitat—lost in a gallery, probably over-analyzing a brushstroke.',
    collabProject: 'Co-curating a zine dedicated to the secret rave history of NYC subway lines.',
    moodSong: 'King Princess - "Prophet"',
    twoTruthsAndAnIllusion: {
      statements: [
        'I once curated a gallery show in an abandoned subway station.',
        'I have a black belt in Brazilian Jiu-Jitsu.',
        'I can bake a perfect sourdough loaf from memory.'
      ],
      illusionIndex: 1
    },
    prompts: [
      { id: 'p1', question: 'My ideal weekend involves...', answer: 'Browsing a dusty record store followed by making a 4-course meal for two.' }
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
    publicPhotos: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60'
    ],
    privatePhotos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=60'
    ],
    availability: [
      { day: 'Wed', slots: ['Evening'] },
      { day: 'Sat', slots: ['Evening'] }
    ],
    isVerified: true,
    isOnline: true,
    isPremium: false,
    speedDatingTickets: 1,
    profileCompletion: 95
  },
  {
    id: 'u2',
    name: 'Elena',
    age: 27,
    bio: 'Software engineer. I value efficiency and depth. Let’s skip the small talk and find the signal in the noise.',
    location: 'Manhattan, NY',
    distance: '5 miles away',
    currentEnergy: 'Cyber Masc',
    auraColor: '#fb7185',
    prismaticLayers: ['Stemme', 'Ambitious', 'Problem Solver'],
    metropolitanHotspots: ['Chelsea Bouldering', 'SoHo Coffee'],
    creativeMediums: ['React', 'Python', 'Film Photography'],
    vibeChecks: [
      { label: 'Early Bird', value: 'Power Napper' },
      { label: 'Outdoor Gear', value: 'High Fashion' }
    ],
    interests: [
      { category: 'Hobbies', items: ['Bouldering', 'Chess', 'Hiking'] }
    ],
    intentions: ['Short-term fun', 'Casual dating'],
    loveLanguage: 'Physical Touch',
    zodiacSign: 'Aries',
    relationshipStyle: 'Open to either',
    idealFirstDate: 'A high-intensity bouldering session followed by cold-brew and a walk across the High Line.',
    tableOrder: 'Double espresso, spicy tuna crispy rice, and zero regrets.',
    describeSelfOnePhoto: 'Post-climb endorphins and a clear mind. The only time I am truly offline.',
    collabProject: 'Building an open-source tool for mapping urban accessible outdoor spaces.',
    moodSong: 'Charli XCX - "Von dutch"',
    twoTruthsAndAnIllusion: {
      statements: [
        'I coded my first full-stack app at age 12.',
        'I have run marathons on three different continents.',
        'I am secretly a world-class poker player.'
      ],
      illusionIndex: 2
    },
    prompts: [
      { id: 'p3', question: 'We’ll get along if...', answer: 'You can out-climb me or at least enjoy the attempt. I love competitive spirits.' }
    ],
    mainPhoto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&auto=format&fit=crop&q=60',
    publicPhotos: [
      'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800&auto=format&fit=crop&q=60'
    ],
    privatePhotos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60'
    ],
    availability: [
      { day: 'Tue', slots: ['Evening'] },
      { day: 'Thu', slots: ['Evening'] }
    ],
    isVerified: true,
    isOnline: false,
    isPremium: true,
    speedDatingTickets: 999,
    profileCompletion: 92
  },
  {
    id: 'u3',
    name: 'Sasha',
    age: 29,
    bio: 'Music producer. I make sounds that feel like neon lights. Searching for a muse or just someone who can handle the bass.',
    location: 'Brooklyn, NY',
    distance: '4 miles away',
    currentEnergy: 'Main Character',
    auraColor: '#6366f1',
    prismaticLayers: ['Androgynous', 'Ambitious', 'Music Head'],
    interests: [
      { category: 'Music', items: ['House', 'Techno', 'Hyperpop'] }
    ],
    intentions: ['Creative collaboration'],
    loveLanguage: 'Words of Affirmation',
    zodiacSign: 'Leo',
    relationshipStyle: 'Polyamorous',
    idealFirstDate: 'Backstage at an underground set, sharing headphones and a secret.',
    tableOrder: 'A round of tequila shots, truffle fries, and an extra side of sass.',
    describeSelfOnePhoto: 'Caught in the strobe light. This is my natural state of being.',
    collabProject: 'Recording a binaural soundscape of 3 AM subway rides for a digital art installation.',
    moodSong: 'SOPHIE - "Immaterial"',
    twoTruthsAndAnIllusion: {
      statements: [
        'I have a Grammy nomination under a pseudonym.',
        'I can play five different instruments.',
        'I once lived in a commune in Berlin for two years.'
      ],
      illusionIndex: 0
    },
    prompts: [],
    mainPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60',
    publicPhotos: [],
    privatePhotos: [],
    availability: [],
    isVerified: true,
    isOnline: true,
    isPremium: false,
    speedDatingTickets: 0,
    profileCompletion: 78
  }
];

export const PRIMARY_HYPE_QUOTE = "Step into your power, interact with intention, and let your authentic light spark the connection you deserve. You're not just a match—you're the main event. ✨";