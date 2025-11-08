import { vaaniKnowledge, getSignInfo, isSignAvailable, getAllSigns } from './vaaniKnowledgeBase';

export interface BotResponse {
  text: string;
  imageUrl?: string;
  signWord?: string;
  shouldFetchImage?: boolean;
}

export function getEnhancedBotResponse(userMessage: string): BotResponse {
  const lowerMessage = userMessage.toLowerCase();

  // Check for sign language requests (show me sign for X, how to sign X, X in sign language)
  const signMatch = lowerMessage.match(/(?:show|demonstrate|display|teach|how to sign|sign for|how do i sign|what is the sign for|.*in sign language)\s+(?:me\s+)?(?:the\s+)?(?:sign\s+)?(?:for\s+)?["']?([a-z\s]+)["']?/i);
  if (signMatch) {
    const word = signMatch[1].trim();
    const signInfo = getSignInfo(word);
    
    if (signInfo) {
      return {
        text: `Here's how to sign "${word}" in ISL (Indian Sign Language):\n\n📖 Description:\n${signInfo.description}\n\n👆 I'm showing you a visual representation of this sign above. Practice this gesture slowly and clearly for best results!\n\n💡 Tip: Use good lighting and keep your hands clearly visible when practicing.`,
        imageUrl: `https://source.unsplash.com/600x400/?${encodeURIComponent(signInfo.imagePrompt)}`,
        signWord: word,
        shouldFetchImage: true
      };
    } else {
      const availableSigns = getAllSigns();
      const suggestions = availableSigns.slice(0, 8).join(', ');
      return {
        text: `I don't have the sign for "${word}" in my database yet. 😔\n\nHere are some signs I can show you:\n${suggestions}\n\nTry asking:\n• "show me sign for hello"\n• "how to sign thank you"\n• "teach me sign for help"`
      };
    }
  }

  // List available signs
  if (lowerMessage.match(/(?:what signs|which signs|list of signs|available signs|signs you know|show me signs|all signs)/)) {
    const allSigns = getAllSigns();
    const categories = {
      greetings: ['hello', 'namaste', 'goodbye', 'good morning', 'good night'],
      basics: ['yes', 'no', 'please', 'thank you', 'sorry'],
      family: ['mother', 'father', 'sister', 'brother'],
      needs: ['water', 'food', 'help', 'toilet'],
      numbers: ['one', 'two', 'three', 'four', 'five'],
      emotions: ['happy', 'sad', 'angry', 'love'],
      questions: ['what', 'where', 'when', 'why', 'how'],
      emergency: ['emergency', 'danger', 'hospital', 'police']
    };
    
    return {
      text: `I can show you ISL signs for ${allSigns.length}+ words! Here are some categories:\n\n🙏 Greetings: hello, namaste, goodbye\n✋ Basics: yes, no, please, thank you\n👨‍👩‍👧 Family: mother, father, sister, brother\n🍽️ Needs: water, food, help, toilet\n🔢 Numbers: 1-5 (and more)\n😊 Emotions: happy, sad, angry, love\n❓ Questions: what, where, when, why, how\n🚨 Emergency: emergency, danger, hospital, police\n\nTry: "show me sign for hello" or "how to sign thank you"`
    };
  }

  // Platform Information - Mission
  if (lowerMessage.match(/(?:mission|purpose|goal|why vaani|about vaani setu|what is vaani)/)) {
    return {
      text: `${vaaniKnowledge.platform.tagline}\n\n${vaaniKnowledge.platform.mission}\n\nOur Stats:\n📊 ${vaaniKnowledge.platform.users} active users\n🎯 ${vaaniKnowledge.platform.accuracy} accuracy rate\n⚡ ${vaaniKnowledge.platform.speed}\n📈 ${vaaniKnowledge.platform.signsPerMinute} signs per minute\n\n${vaaniKnowledge.indiaStats.deafAndHardOfHearing} need accessible communication solutions!`
    };
  }

  // Statistics
  if (lowerMessage.match(/(?:statistics|stats|numbers|data|how many)/)) {
    return {
      text: `Vaani Setu Statistics:\n\n👥 ${vaaniKnowledge.platform.users} Active Users\n🎯 ${vaaniKnowledge.platform.accuracy} AI Accuracy\n⚡ ${vaaniKnowledge.platform.speed}\n📊 ${vaaniKnowledge.platform.signsPerMinute} Signs/Minute\n\nIndia Statistics:\n🇮🇳 ${vaaniKnowledge.indiaStats.hearingDisabled}\n📈 ${vaaniKnowledge.indiaStats.deafAndHardOfHearing}\n\nWe're making a real impact! 🚀`
    };
  }

  // Pricing Information
  if (lowerMessage.match(/(?:pricing|plans|cost|price|how much|subscription|premium|family|enterprise)/)) {
    const plans = vaaniKnowledge.pricing;
    return {
      text: `Vaani Setu Pricing Plans:\n\n🆓 ${plans.freemium.name} - ${plans.freemium.price}\n• ${plans.freemium.features.slice(0, 3).join('\\n• ')}\n\n⭐ ${plans.premium.name} - ${plans.premium.price}\n• ${plans.premium.features.slice(0, 3).join('\\n• ')}\n• + Advanced features\n\n👨‍👩‍👧 ${plans.family.name} - ${plans.family.price}\n• All Premium features\n• Up to 5 users\n• Free healthcare consultations\n\n🏢 ${plans.enterprise.name} - ${plans.enterprise.price}\n• Full API access\n• Custom integrations\n• 24/7 support\n\nVisit our Pricing page for details!`
    };
  }

  // How It Works
  if (lowerMessage.match(/(?:how it works|how does|translation process|how vaani works|how to use)/)) {
    const steps = vaaniKnowledge.howItWorks;
    return {
      text: `How Vaani Setu Works:\n\n1️⃣ ${steps[0].title}\n${steps[0].description}\n\n2️⃣ ${steps[1].title}\n${steps[1].description}\n\n3️⃣ ${steps[2].title}\n${steps[2].description}\n\nIt's that simple! Start using it now in the Interpreter page.`
    };
  }

  // Privacy & Security
  if (lowerMessage.match(/(?:privacy|security|safe|data|recording|store|secure|personal info)/)) {
    const privacy = vaaniKnowledge.privacy;
    return {
      text: `🔒 Your Privacy is Our Priority!\n\n✅ ${privacy.localProcessing}\n✅ ${privacy.noRecording}\n✅ ${privacy.noStorage}\n✅ ${privacy.noTransmission}\n✅ ${privacy.noSharing}\n\n${privacy.dataOwnership}\n\nWe're committed to protecting your privacy!`
    };
  }

  // Tutorials & Learning
  if (lowerMessage.match(/(?:tutorial|learn|course|lesson|teaching|training)/)) {
    const tutorials = vaaniKnowledge.tutorials;
    return {
      text: `📚 Vaani Setu Tutorials:\n\n🌱 Beginner Level:\n• ${tutorials.beginner.slice(0, 3).join('\\n• ')}\n\n📖 Intermediate Level:\n• ${tutorials.intermediate.slice(0, 3).join('\\n• ')}\n\n🎓 Advanced Level:\n• ${tutorials.advanced.slice(0, 3).join('\\n• ')}\n\n🚨 Emergency Signs:\n• ${tutorials.emergency.slice(0, 3).join('\\n• ')}\n\nVisit the Tutorials page to start learning!`
    };
  }

  // Support & Contact
  if (lowerMessage.match(/(?:support|contact|help|reach|phone|email|customer service)/)) {
    const support = vaaniKnowledge.support;
    return {
      text: `📞 Get Support:\n\n📧 Email: ${support.email}\n📱 Phone: ${support.phone}\n⏰ Hours: ${support.hours}\n⚡ Response Time: ${support.responseTime}\n\nWe're here to help! Premium users get instant priority support.`
    };
  }

  // Enterprise Solutions
  if (lowerMessage.match(/(?:enterprise|business|hospital|university|government|corporate|api)/)) {
    const enterprise = vaaniKnowledge.pricing.enterprise;
    return {
      text: `🏢 Enterprise Solutions:\n\nVaani Setu API is perfect for:\n${enterprise.useCases.map(use => `• ${use}`).join('\\n')}\n\nFeatures:\n${enterprise.features.slice(0, 5).map(f => `✓ ${f}`).join('\\n')}\n\nContact our sales team for custom pricing and demo!\nEmail: enterprise@vaanisetu.com`
    };
  }

  // Features
  if (lowerMessage.match(/(?:features|capabilities|what can|functions)/)) {
    const features = vaaniKnowledge.features;
    return {
      text: `✨ Vaani Setu Features:\n\n📹 ${features.realTimeTranslation}\n🎥 ${features.cameraDetection}\n🧠 ${features.aiProcessing}\n📱 ${features.multiDevice}\n💬 ${features.community}\n📚 ${features.tutorials}\n\nPremium Features:\n⚡ ${features.offlineMode}\n🎯 ${features.personalizedLearning}\n\nExplore all features on our platform!`
    };
  }

  // Accuracy
  if (lowerMessage.match(/(?:accurate|accuracy|reliable|success rate)/)) {
    return {
      text: `🎯 Vaani Setu Accuracy:\n\nOur AI achieves ${vaaniKnowledge.platform.accuracy} accuracy for ISL!\n\nTips for Best Results:\n✓ Good lighting (natural light works best)\n✓ Clear hand positioning\n✓ Moderate signing speed\n✓ Keep both hands in frame\n✓ Plain background preferred\n✓ Avoid shadows on hands\n\n${vaaniKnowledge.platform.speed} - faster than ever!\n\nWe continuously improve our AI models based on user feedback.`
    };
  }

  // Community
  if (lowerMessage.match(/(?:community|forum|users|connect|social)/)) {
    return {
      text: `👥 Vaani Setu Community:\n\nJoin ${vaaniKnowledge.platform.users} users!\n\n💬 Community Features:\n• Ask questions & get answers\n• Share experiences\n• Learn from peers\n• Post tips & tricks\n• Connect with others\n• Participate in discussions\n\nVisit the Community page to join conversations and make friends!`
    };
  }

  // Languages Supported
  if (lowerMessage.match(/(?:languages|isl|asl|bsl|which language|supported)/)) {
    return {
      text: `🌐 Supported Languages:\n\n✅ Currently Supported:\n🇮🇳 Indian Sign Language (ISL)\n\n🔜 Coming Soon:\n🇺🇸 American Sign Language (ASL)\n🇬🇧 British Sign Language (BSL)\n📍 Regional ISL variations\n\nWe're working hard to expand language support and make Vaani Setu accessible globally!`
    };
  }

  // Greetings
  if (lowerMessage.match(/\\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\\b/)) {
    return {
      text: `Hello! Welcome to Vaani Setu - Breaking Communication Barriers with AI! 👋\n\nI'm Vaani, your intelligent assistant. I can help you with:\n\n🎯 Sign language information\n📚 Platform features\n💰 Pricing plans\n🔒 Privacy & security\n📖 Tutorials & learning\n🤝 ISL sign demonstrations\n\nWhat would you like to know? Try asking:\n• "Show me sign for hello"\n• "How does Vaani Setu work?"\n• "What are the pricing plans?"`
    };
  }

  // Thank you
  if (lowerMessage.match(/\\b(thank|thanks|appreciate|grateful)\\b/)) {
    return {
      text: `You're welcome! Happy to help! 😊\n\nRemember, I can show you ISL signs, explain features, answer questions about pricing, and much more.\n\nFeel free to ask anything about Vaani Setu!`
    };
  }

  // Bye
  if (lowerMessage.match(/\\b(bye|goodbye|see you|later|gtg)\\b/)) {
    return {
      text: `Goodbye! Thanks for chatting with Vaani Setu! 👋\n\nRemember:\n• ${vaaniKnowledge.platform.users} users trust us\n• ${vaaniKnowledge.platform.accuracy} accuracy\n• Always here to help!\n\nCome back anytime. Have a great day! 🌟`
    };
  }

  // Default/Fallback
  return {
    text: `I'm not quite sure about that. Let me help you! 🤔\n\nI can assist with:\n\n📖 ISL Signs - Try: "show me sign for hello"\n ℹ️ Platform Info - Ask: "how does it work?"\n💰 Pricing - Ask: "what are the plans?"\n🎓 Tutorials - Ask: "what can I learn?"\n🔒 Privacy - Ask: "is it safe?"\n📊 Statistics - Ask: "what are the stats?"\n\nOr contact support:\n📧 ${vaaniKnowledge.support.email}\n📞 ${vaaniKnowledge.support.phone}`
  };
}