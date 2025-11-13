# Vaani Setu - American Sign Language Learning Platform

A comprehensive web application for learning American Sign Language (ASL) with interactive tutorials, real-time interpretation, and community features.

## 🌟 Features

### Core Learning Features
- **Interactive Tutorials**: Structured lessons covering basic to advanced ASL
- **Real-time Interpretation**: Live sign language to text/speech conversion
- **Practice Exercises**: Hands-on learning with feedback
- **Progress Tracking**: Monitor your learning journey
- **Community Support**: Connect with other learners

### Accessibility Features
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: Comprehensive ARIA labels and announcements
- **High Contrast Mode**: Dark/light theme support
- **Responsive Design**: Works on all devices
- **Voice Commands**: Hands-free navigation (coming soon)

### User Experience
- **Modern UI/UX**: Clean, intuitive interface
- **Search & Filter**: Find tutorials by category, difficulty, duration
- **Personalized Dashboard**: Custom learning paths
- **Offline Support**: Download lessons for offline practice
- **Multi-language Support**: Content in multiple Indian languages

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation

### Backend & APIs
- **Google Gemini AI** for intelligent content generation
- **Web Speech API** for voice recognition
- **MediaDevices API** for camera access
- **Local Storage** for offline functionality

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type safety
- **PostCSS** for CSS processing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vaani-setu-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── figma/          # Figma design components
│   └── *.tsx           # Page components
├── hooks/              # Custom React hooks
│   ├── useAccessibility.ts    # Accessibility utilities
│   ├── useSearch.ts          # Search and filtering
│   ├── useToast.ts          # Toast notifications
│   └── ...
├── utils/              # Utility functions
│   ├── gemini.ts       # Google Gemini AI integration
│   ├── chatbotResponses.ts   # Chatbot logic
│   ├── voiceRecorder.ts      # Voice recording utilities
│   └── ...
├── assets/             # Static assets
├── styles/             # Global styles
└── main.tsx           # Application entry point
```

## 🎯 Key Components

### Tutorial System
- **TutorialsPage**: Main tutorial listing with search and filters
- **Tutorial Detail**: Individual tutorial view with lesson breakdown
- **Lesson Player**: Interactive lesson content with video placeholder
- **Progress Tracking**: Visual progress indicators and completion status

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support throughout the app
- **Screen Reader**: ARIA labels and live regions for announcements
- **Focus Management**: Proper focus handling and visual indicators
- **High Contrast**: Theme switching with proper contrast ratios

### Search & Filter
- **useSearch Hook**: Advanced filtering by category, difficulty, duration
- **SearchBar**: Debounced search with filter panel
- **Results Counter**: Real-time result count updates

## 🛠️ Development Guidelines

### Code Style
- Use TypeScript for all new components
- Follow React hooks best practices
- Implement proper error boundaries
- Add accessibility attributes from the start

### Accessibility Standards
- Follow WCAG 2.1 AA guidelines
- Test with keyboard navigation
- Verify screen reader compatibility
- Ensure proper color contrast

### Performance
- Implement lazy loading for components
- Optimize images and assets
- Use code splitting for large features
- Monitor bundle size

## 🔧 Configuration

### Tailwind Configuration
Custom color scheme and utilities defined in `tailwind.config.js`

### TypeScript Configuration
Strict mode enabled with comprehensive type checking

### Build Configuration
Vite configuration optimized for production builds

## 📱 Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for content generation
- American Sign Language community for content validation
- Open source community for various libraries and tools

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/guidelines/`
- Review the attributions in `/src/Attributions.md`

---

**Vaani Setu** - Bridging communication gaps through technology and education.