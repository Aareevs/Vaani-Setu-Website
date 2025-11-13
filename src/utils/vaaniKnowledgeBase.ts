// Comprehensive Vaani Setu Knowledge Base

export const vaaniKnowledge = {
  // Platform Information
  platform: {
    name: "Vaani Setu",
    tagline: "Breaking Communication Barriers with AI",
    mission: "Empowering India with real-time AI-powered sign language translation to bridge communication gaps. Built by passionate Indian developers, designers, and accessibility advocates committed to making communication barrier-free for India's deaf and hard-of-hearing community.",
    users: "12,483+",
    accuracy: "95%+",
    speed: "Real-time (0.3s latency)",
    signsPerMinute: "24",
  },

  // Statistics about India
  indiaStats: {
    hearingDisabled: "18 Million+ people with hearing disabilities in India",
    deafAndHardOfHearing: "63 Million deaf and hard-of-hearing individuals across India",
  },

  // Features
  features: {
    realTimeTranslation: "AI-powered real-time sign language to text and speech conversion",
    cameraDetection: "Advanced hand gesture detection through your device camera",
    aiProcessing: "Machine learning algorithms with 95%+ accuracy for ASL",
    offlineMode: "Premium feature - works without internet (Premium plan)",
    personalizedLearning: "Custom gesture learning adapted to your style (Premium plan)",
    community: "Vibrant forum for questions, discussions, and peer support",
    tutorials: "Comprehensive lessons from beginner to advanced levels",
    multiDevice: "Works on desktop, tablet, and mobile devices",
  },

  // Pricing Plans
  pricing: {
    freemium: {
      name: "Freemium",
      price: "Free forever",
      features: [
        "Basic sign language translation",
        "Real-time camera access",
        "30 minutes of tutorial content",
        "American Sign Language (ASL) support",
        "Text-to-speech output",
        "Community forum access"
      ]
    },
    premium: {
      name: "Vaani Setu Premium",
      price: "₹199/month",
      features: [
        "Unlimited usage",
        "Offline mode",
        "Personalized gesture learning",
        "Priority support",
        "Advanced AI models",
        "No ads",
        "Custom vocabulary",
        "Progress tracking"
      ]
    },
    family: {
      name: "Family Plan",
      price: "₹499/month",
      features: [
        "All Premium features",
        "Up to 5 user accounts",
        "Shared learning progress",
        "Family dashboard",
        "Enhanced priority support",
        "Free healthcare consultations",
        "Dedicated account manager",
        "Custom training sessions"
      ]
    },
    enterprise: {
      name: "Enterprise API",
      price: "Custom pricing",
      useCases: [
        "Hospitals & Healthcare facilities",
        "Customer Care Centers",
        "Universities and educational institutions",
        "Government websites",
        "Corporate platforms"
      ],
      features: [
        "Full API access",
        "Unlimited endpoints",
        "Custom integrations",
        "SLA guarantee",
        "24/7 dedicated support",
        "HIPAA compliance",
        "White-label options",
        "On-premise deployment"
      ]
    }
  },

  // How It Works
  howItWorks: [
    {
      step: 1,
      title: "Camera Detection",
      description: "Our AI captures and analyzes hand gestures through your camera in real-time using advanced computer vision"
    },
    {
      step: 2,
      title: "AI Processing",
      description: "Machine learning algorithms trained on extensive ASL datasets interpret gestures with 95%+ accuracy"
    },
    {
      step: 3,
      title: "Text & Speech Output",
      description: "Instant conversion to text and natural-sounding speech in multiple Indian languages for seamless communication"
    }
  ],

  // Privacy & Security
  privacy: {
    localProcessing: "All video processing happens locally on your device",
    noRecording: "We do NOT record your camera feed",
    noStorage: "We do NOT store any video data",
    noTransmission: "We do NOT transmit camera data to external servers",
    noSharing: "We do NOT share your data with third parties",
    dataOwnership: "Your data stays with you - complete privacy guaranteed"
  },

  // Support
  support: {
    email: "support@vaanisetu.com",
    phone: "+91 1800-123-456",
    hours: "Monday-Friday, 9 AM - 6 PM IST",
    responseTime: "24 hours for email, instant for Premium users"
  },

  // Tutorial Categories
  tutorials: {
    beginner: ["Greetings & Introduction", "Basic Alphabet (A-Z)", "Numbers (0-100)", "Common Words", "Polite Phrases"],
    intermediate: ["Daily Conversations", "Family & Relationships", "Food & Dining", "Travel & Directions", "Weather & Time"],
    advanced: ["Professional Settings", "Medical Terminology", "Legal Terms", "Technical Vocabulary", "Regional Variations"],
    emergency: ["Help & Emergency", "Medical Emergency", "Police & Safety", "Fire & Disaster", "Lost & Found"]
  }
};

// ASL (American Sign Language) Signs Database
export const aslSigns: { [key: string]: { description: string; imagePrompt: string } } = {
  // Greetings
  hello: {
    description: "Wave your right hand with fingers extended, palm facing forward, moving side to side",
    imagePrompt: "hand+waving+gesture+hello+greeting"
  },
  namaste: {
    description: "Both palms together in prayer position in front of chest, slight bow of head",
    imagePrompt: "namaste+hands+prayer+greeting+indian"
  },
  goodbye: {
    description: "Wave right hand with fingers extended, palm facing outward, moving back and forth",
    imagePrompt: "hand+waving+goodbye+farewell"
  },
  
  // Basic Words
  yes: {
    description: "Closed fist with thumb up, nodding motion downward twice",
    imagePrompt: "thumbs+up+approval+yes+gesture"
  },
  no: {
    description: "Index and middle finger extended, moving side to side in front of face",
    imagePrompt: "hand+gesture+no+rejection+fingers"
  },
  please: {
    description: "Right hand flat palm on chest, circular motion clockwise",
    imagePrompt: "hand+on+chest+please+gesture"
  },
  "thank you": {
    description: "Right hand fingers touching chin, move forward and down with palm up",
    imagePrompt: "hand+gesture+gratitude+thank+you"
  },
  sorry: {
    description: "Right fist on chest making circular motion, showing remorse",
    imagePrompt: "hand+on+chest+apology+sorry+gesture"
  },
  
  // Family
  mother: {
    description: "Right hand with thumb touching chin, other fingers extended upward",
    imagePrompt: "hand+gesture+mother+family+sign"
  },
  father: {
    description: "Right hand with thumb touching forehead, fingers extended upward",
    imagePrompt: "hand+gesture+father+family+sign"
  },
  sister: {
    description: "Right hand with index finger extended, circular motion near cheek",
    imagePrompt: "hand+gesture+sister+family+sign"
  },
  brother: {
    description: "Right hand forming 'B' shape, move from forehead forward",
    imagePrompt: "hand+gesture+brother+family+sign"
  },
  
  // Common Needs
  water: {
    description: "Form 'W' with three fingers, bring to lips in drinking motion",
    imagePrompt: "hand+drinking+water+gesture+glass"
  },
  food: {
    description: "Fingers bunched together, bring to mouth repeatedly",
    imagePrompt: "hand+eating+food+gesture+mouth"
  },
  help: {
    description: "Right fist on left palm, lift both hands together upward",
    imagePrompt: "hands+helping+support+assistance+gesture"
  },
  toilet: {
    description: "Form 'T' with hands, shake slightly",
    imagePrompt: "hand+gesture+restroom+toilet+sign"
  },
  
  // Numbers
  one: {
    description: "Index finger extended, other fingers closed",
    imagePrompt: "one+finger+pointing+number+hand"
  },
  two: {
    description: "Index and middle fingers extended in 'V' shape",
    imagePrompt: "two+fingers+peace+victory+hand"
  },
  three: {
    description: "Index, middle, and ring fingers extended",
    imagePrompt: "three+fingers+hand+gesture+number"
  },
  four: {
    description: "All four fingers extended, thumb folded",
    imagePrompt: "four+fingers+hand+gesture+number"
  },
  five: {
    description: "All five fingers extended, palm facing forward",
    imagePrompt: "open+palm+five+fingers+hand"
  },
  
  // Emotions
  happy: {
    description: "Both hands with fingers up, brush upward on chest twice",
    imagePrompt: "happy+smile+joyful+cheerful+person"
  },
  sad: {
    description: "Both hands starting at face, move downward showing tears",
    imagePrompt: "sad+crying+unhappy+tears+emotion"
  },
  angry: {
    description: "Claw hand shape in front of face, pull downward showing frustration",
    imagePrompt: "angry+frustrated+mad+emotion+face"
  },
  love: {
    description: "Both fists crossed over heart area",
    imagePrompt: "love+heart+hands+crossed+affection"
  },
  
  // Questions
  what: {
    description: "Both hands palms up, shrug shoulders, questioning expression",
    imagePrompt: "confused+questioning+hands+up+gesture"
  },
  where: {
    description: "Index finger pointing, move side to side in questioning motion",
    imagePrompt: "pointing+finger+direction+where+gesture"
  },
  when: {
    description: "Index finger circling in air, questioning expression",
    imagePrompt: "hand+gesture+time+clock+when"
  },
  why: {
    description: "Index finger touching forehead, then move forward questioningly",
    imagePrompt: "thinking+question+confused+why+gesture"
  },
  how: {
    description: "Both hands together, rotate inward then outward",
    imagePrompt: "hands+together+gesture+question+how"
  },
  
  // Emergency
  emergency: {
    description: "Both hands waving frantically above head, urgent expression",
    imagePrompt: "emergency+urgent+help+alert+warning"
  },
  danger: {
    description: "Fist punching forward repeatedly, alarmed expression",
    imagePrompt: "danger+warning+alert+stop+hand"
  },
  hospital: {
    description: "Form 'H' shape, draw cross on upper arm (Red Cross symbol)",
    imagePrompt: "medical+hospital+doctor+healthcare+cross"
  },
  police: {
    description: "Hand forming 'C' near shoulder, representing police badge",
    imagePrompt: "police+officer+badge+law+enforcement"
  },
  
  // Common Phrases
  "good morning": {
    description: "Right hand flat palm, arc from left to right like sunrise",
    imagePrompt: "sunrise+morning+sun+dawn+bright"
  },
  "good night": {
    description: "Right hand flat palm, arc downward like sunset",
    imagePrompt: "sunset+night+moon+evening+dark"
  },
  "how are you": {
    description: "Point to person, then both hands move from chest forward with questioning look",
    imagePrompt: "question+asking+communication+conversation+gesture"
  },
  "i love you": {
    description: "Extend thumb, index and pinky finger (ILY sign)",
    imagePrompt: "i+love+you+hand+sign+gesture"
  },
  
  // Alphabet Basics
  a: {
    description: "Closed fist with thumb on the side",
    imagePrompt: "fist+closed+hand+letter+alphabet"
  },
  b: {
    description: "Open hand with four fingers up, thumb across palm",
    imagePrompt: "open+hand+flat+palm+fingers"
  },
  c: {
    description: "Hand forming C curve shape",
    imagePrompt: "hand+curved+c+shape+gesture"
  },
  
  // Daily Activities
  eat: {
    description: "Fingers bunched to mouth in eating motion",
    imagePrompt: "eating+food+mouth+hand+gesture"
  },
  drink: {
    description: "C-shaped hand to mouth, tilting back like drinking from cup",
    imagePrompt: "drinking+beverage+cup+glass+hand"
  },
  sleep: {
    description: "Hand on cheek, head tilted, eyes closed",
    imagePrompt: "sleeping+tired+rest+pillow+person"
  },
  work: {
    description: "Both fists, one on top of the other, hammering motion",
    imagePrompt: "working+labor+job+hands+typing"
  },
  study: {
    description: "Right hand fingers wiggling pointing at left palm (like reading book)",
    imagePrompt: "studying+reading+book+learning+education"
  }
};

// Function to get sign information
export function getSignInfo(word: string): { description: string; imagePrompt: string } | null {
  const normalizedWord = word.toLowerCase().trim();
  return aslSigns[normalizedWord] || null;
}

// Function to check if word is in ASL database
export function isSignAvailable(word: string): boolean {
  const normalizedWord = word.toLowerCase().trim();
  return normalizedWord in aslSigns;
}

// Get all available signs
export function getAllSigns(): string[] {
  return Object.keys(aslSigns);
}