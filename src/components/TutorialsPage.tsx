import { useState } from 'react';
import { Play, CheckCircle, Lock, BookOpen, Clock, Award, ArrowLeft, ChevronRight, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SearchBar, SearchResultsCounter } from './ui/SearchBar';
import { useSearch } from '../hooks/useSearch';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  description: string;
  keyPoints: string[];
  steps: string[];
}

interface Tutorial {
  id: number;
  title: string;
  category: string;
  duration: string;
  lessons: number;
  thumbnail: string;
  description: string;
  progress: number;
  detailedLessons: Lesson[];
  overview: string;
  whatYouLearn: string[];
  prerequisites: string[];
}

export default function TutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2, 5]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const categories = [
    { id: 'all', name: 'All Tutorials', icon: '📚' },
    { id: 'beginner', name: 'Beginner', icon: '🌱' },
    { id: 'daily', name: 'Daily Use', icon: '☀️' },
    { id: 'emergency', name: 'Emergency', icon: '🚨' },
    { id: 'numbers', name: 'Numbers', icon: '🔢' },
  ];

  const tutorials: Tutorial[] = [
    {
      id: 1,
  title: 'Introduction to ASL',
      category: 'beginner',
      duration: '8 min',
      lessons: 5,
      thumbnail: 'https://images.unsplash.com/photo-1566550820504-46695b79fcd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMGdyZWV0aW5nJTIwaGVsbG98ZW58MXx8fHwxNzYyMjgyNzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Learn the basics of American Sign Language',
      progress: 100,
  overview: 'This comprehensive introduction to American Sign Language will help you understand the fundamentals of ASL communication. You\'ll learn about hand shapes, facial expressions, and the cultural context of sign language.',
      whatYouLearn: [
        'Basic hand shapes and positions',
  'Importance of facial expressions in ASL',
        'Cultural sensitivity and deaf community awareness',
        'Fundamental signing techniques',
        'Common mistakes to avoid'
      ],
      prerequisites: ['None - perfect for absolute beginners!'],
      detailedLessons: [
        {
          id: 1,
  title: 'What is ASL?',
          duration: '2 min',
          completed: true,
          locked: false,
          description: 'Understand the history and importance of American Sign Language',
          keyPoints: [
  'ASL is a complete language with its own grammar',
  'ASL is widely used across North America',
  'ASL differs from other sign languages like BSL',
            'It uses manual and non-manual markers'
          ],
          steps: [
            'Watch the introduction video',
  'Learn about ASL history',
            'Understand the deaf community',
            'Practice basic awareness'
          ]
        },
        {
          id: 2,
          title: 'Hand Shapes & Positions',
          duration: '3 min',
          completed: true,
          locked: false,
  description: 'Master the fundamental hand shapes used in ASL',
          keyPoints: [
  'There are essential hand shapes used in ASL',
            'Palm orientation matters significantly',
            'Hand position relative to body is crucial',
            'Practice with both dominant and non-dominant hands'
          ],
          steps: [
            'Learn the 5 basic hand shapes',
            'Practice each hand shape 10 times',
            'Learn palm orientations (up, down, forward, backward)',
            'Combine hand shapes with positions',
            'Quiz yourself on hand shapes'
          ]
        },
        {
          id: 3,
          title: 'Facial Expressions',
          duration: '2 min',
          completed: false,
          locked: false,
  description: 'Discover how facial expressions are crucial in ASL grammar',
          keyPoints: [
            'Facial expressions are grammatical markers',
            'Eyebrow position changes meaning',
            'Head tilt and nod convey information',
            'Eye gaze shows relationships between signs'
          ],
          steps: [
            'Practice raising eyebrows for questions',
            'Learn furrowed brows for negative statements',
            'Practice head tilts and nods',
            'Combine facial expressions with signs',
            'Record yourself and review'
          ]
        },
        {
          id: 4,
          title: 'Signing Space',
          duration: '2 min',
          completed: false,
          locked: false,
          description: 'Learn about the three-dimensional space used for signing',
          keyPoints: [
            'Signing space extends from waist to above head',
            'Use space to show locations and relationships',
            'Dominant side vs non-dominant side usage',
            'Height indicates hierarchy or time'
          ],
          steps: [
            'Identify your neutral signing space',
            'Practice signs in different areas',
            'Learn spatial referencing',
            'Practice time indicators using space'
          ]
        },
        {
          id: 5,
          title: 'Practice Session',
          duration: '3 min',
          completed: false,
          locked: false,
          description: 'Apply everything you\'ve learned in practical exercises',
          keyPoints: [
            'Review all hand shapes',
            'Combine hand shapes with facial expressions',
            'Practice in front of mirror',
            'Self-assessment checklist'
          ],
          steps: [
            'Review video demonstrations',
            'Practice each concept 5 times',
            'Record yourself signing',
            'Compare with examples',
            'Take the completion quiz'
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Common Greetings',
      category: 'beginner',
      duration: '12 min',
      lessons: 8,
      thumbnail: 'https://images.unsplash.com/photo-1730875650224-05f11eff82ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMHdhdmluZyUyMHdlbGNvbWV8ZW58MXx8fHwxNzYyMjgyNzc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Master everyday greetings and introductions',
      progress: 100,
  overview: 'Learn how to greet people, introduce yourself, and engage in basic social interactions using ASL. These are essential signs you\'ll use every day.',
      whatYouLearn: [
        'Hello, Hi, Goodbye signs',
        'Good morning, afternoon, evening signs',
        'Introduction phrases',
        'Asking "How are you?"',
        'Common responses to greetings'
      ],
  prerequisites: ['Complete Introduction to ASL first (recommended)'],
      detailedLessons: [
        {
          id: 1,
          title: 'Hello & Hi',
          duration: '2 min',
          completed: true,
          locked: false,
          description: 'Learn the most common greeting signs',
          keyPoints: [
            'Wave hand near ear for "Hello"',
            'Casual wave for "Hi"',
            'Add smile for warmth',
            'Eye contact is essential'
          ],
          steps: [
            'Watch demonstration video',
            'Practice "Hello" 10 times',
            'Practice "Hi" 10 times',
            'Practice with different facial expressions',
            'Try greeting in mirror'
          ]
        },
        {
          id: 2,
          title: 'Good Morning/Afternoon/Evening',
          duration: '3 min',
          completed: true,
          locked: false,
  description: 'Time-specific greetings in ASL',
          keyPoints: [
            'Sign for "good" combined with time of day',
            'Morning: hand rises like sun',
            'Afternoon: hand at zenith position',
            'Evening: hand sets like sun'
          ],
          steps: [
            'Learn "good" sign',
            'Learn "morning" sign',
            'Combine "good" + "morning"',
            'Practice afternoon and evening',
            'Create natural flow between signs'
          ]
        },
        {
          id: 3,
          title: 'My Name Is...',
          duration: '2 min',
          completed: false,
          locked: false,
  description: 'Introduce yourself in ASL',
          keyPoints: [
            'Point to self for "my"',
            'Touch lips then extend for "name"',
            'Fingerspell your name or use name sign',
            'Maintain eye contact throughout'
          ],
          steps: [
            'Learn "my" (point to chest)',
            'Learn "name" sign',
            'Practice fingerspelling alphabet',
            'Spell your name slowly',
            'Combine into full phrase',
            'Introduce yourself 5 times'
          ]
        },
        {
          id: 4,
          title: 'How Are You?',
          duration: '2 min',
          completed: false,
          locked: false,
          description: 'Ask about someone\'s wellbeing',
          keyPoints: [
            'Raised eyebrows indicate question',
            'Body leans slightly forward',
            'Hand moves from chest outward',
            'Maintain questioning expression'
          ],
          steps: [
            'Practice question eyebrow raise',
            'Learn "how" sign',
            'Learn "you" pointing gesture',
            'Combine with facial expression',
            'Practice asking a friend'
          ]
        },
        {
          id: 5,
          title: 'I am Fine/Good/Okay',
          duration: '2 min',
          completed: false,
          locked: false,
          description: 'Common responses to "How are you?"',
          keyPoints: [
            'Thumbs up for "good/fine"',
            'Flat hand for "okay"',
            'Head nod for affirmation',
            'Smile indicates positive feeling'
          ],
          steps: [
            'Practice "fine" sign',
            'Practice "good" sign',
            'Practice "okay" sign',
            'Add appropriate facial expressions',
            'Practice full conversation exchange'
          ]
        },
        {
          id: 6,
          title: 'Thank You & Welcome',
          duration: '2 min',
          completed: false,
          locked: false,
          description: 'Express gratitude and hospitality',
          keyPoints: [
            'Touch chin and move forward for "thank you"',
            'Open arms gesture for "welcome"',
            'Slight bow shows respect',
            'Smile is important'
          ],
          steps: [
            'Watch thank you demonstration',
            'Practice "thank you" 10 times',
            'Learn "you\'re welcome" sign',
            'Practice polite exchanges',
            'Role play scenarios'
          ]
        },
        {
          id: 7,
          title: 'Goodbye & See You Later',
          duration: '2 min',
          completed: false,
          locked: false,
  description: 'Farewell signs in ASL',
          keyPoints: [
            'Wave for "goodbye"',
            'Different waves for formal vs casual',
            '"See you later" involves time sign',
            'Facial expression shows emotion'
          ],
          steps: [
            'Practice goodbye wave',
            'Learn "see" sign',
            'Learn "later" time indicator',
            'Combine for "see you later"',
            'Practice various farewells'
          ]
        },
        {
          id: 8,
          title: 'Conversation Practice',
          duration: '3 min',
          completed: false,
          locked: false,
          description: 'Put all greetings together in conversations',
          keyPoints: [
            'Natural flow between signs',
            'Appropriate facial expressions',
            'Turn-taking in conversation',
            'Cultural appropriateness'
          ],
          steps: [
            'Review all greeting signs',
            'Practice full introduction sequence',
            'Role play with partner or mirror',
            'Record yourself',
            'Take final assessment'
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Family Members',
      category: 'daily',
      duration: '15 min',
      lessons: 10,
      thumbnail: 'https://images.unsplash.com/photo-1542037179399-bbf09c7f9888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBwb3J0cmFpdCUyMHRvZ2V0aGVyfGVufDF8fHx8MTc2MjI0OTU5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Signs for family relationships',
      progress: 60,
      overview: 'Learn to sign all family member relationships, from immediate family to extended relatives. Essential for daily conversations about family.',
      whatYouLearn: [
        'Mother, Father, Sister, Brother signs',
        'Grandparents and extended family',
        'In-law relationships',
        'Possessive indicators (my, your)',
        'Family size and structure'
      ],
      prerequisites: ['Common Greetings (recommended for introductions)'],
      detailedLessons: [
        {
          id: 1,
          title: 'Mother & Father',
          duration: '2 min',
          completed: true,
          locked: false,
          description: 'Learn to sign your parents',
          keyPoints: [
            'Mother: open hand near cheek',
            'Father: thumb on forehead',
            'Can combine with "my" for possession',
            'Respect shown through gentle movements'
          ],
          steps: [
            'Learn "mother" sign',
            'Learn "father" sign',
            'Practice "my mother"',
            'Practice "my father"',
            'Describe your parents'
          ]
        },
        // Additional lessons would follow similar pattern...
      ]
    },
    {
      id: 4,
      title: 'Food & Drinks',
      category: 'daily',
      duration: '18 min',
      lessons: 12,
      thumbnail: 'https://images.unsplash.com/photo-1610657592176-23d38cb78116?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwaGVhbHRoeSUyMG1lYWx8ZW58MXx8fHwxNzYyMjgyNzc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Common food and beverage signs',
      progress: 30,
      overview: 'Master essential signs for food, drinks, and dining. Perfect for restaurant visits and meal conversations.',
      whatYouLearn: [
        'Common foods (rice, bread, vegetables, fruits)',
        'Beverages (water, tea, coffee, milk)',
        'Meal times (breakfast, lunch, dinner)',
        'Food preferences (like, dislike, allergies)',
        'Restaurant vocabulary'
      ],
  prerequisites: ['Introduction to ASL'],
      detailedLessons: [] // Would have detailed lessons like above
    },
    {
      id: 5,
      title: 'Emergency Signs',
      category: 'emergency',
      duration: '10 min',
      lessons: 6,
      thumbnail: 'https://images.unsplash.com/photo-1758404958502-44f156617bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBtZWRpY2FsJTIwYWxlcnR8ZW58MXx8fHwxNzYyMjM2Nzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Critical signs for emergency situations',
      progress: 100,
      overview: 'Learn vital signs that could save lives. These emergency signs help communicate urgent needs quickly and clearly.',
      whatYouLearn: [
        'Help, Emergency, Danger signs',
        'Medical emergencies (pain, injury, sick)',
        'Police, Fire, Ambulance',
        'Important locations (hospital, police station)',
        'Urgent communication phrases'
      ],
      prerequisites: ['None - everyone should know these!'],
      detailedLessons: [] // Would have detailed lessons
    },
    {
      id: 6,
      title: 'Numbers 1-100',
      category: 'numbers',
      duration: '20 min',
      lessons: 15,
      thumbnail: 'https://images.unsplash.com/photo-1740062446976-94a8837e0dde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudW1iZXJzJTIwY291bnRpbmclMjBtYXRofGVufDF8fHx8MTc2MjI4Mjc3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Learn to sign numbers and counting',
      progress: 0,
      overview: 'Complete guide to signing numbers from 1 to 100, including special rules and cultural considerations.',
      whatYouLearn: [
        'Numbers 1-10 (basic hand configurations)',
        'Numbers 11-20 (combination techniques)',
        'Tens (20, 30, 40... 100)',
        'Number combinations',
        'Using numbers in sentences (age, quantity, price)'
      ],
  prerequisites: ['Hand Shapes & Positions from Introduction to ASL'],
      detailedLessons: [] // Would have detailed lessons
    },
    {
      id: 7,
      title: 'Colors',
      category: 'beginner',
      duration: '10 min',
      lessons: 8,
      thumbnail: 'https://images.unsplash.com/photo-1578521157034-273977158e71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHBhaW50JTIwcGFsZXR0ZXxlbnwxfHx8fDE3NjIyNTYxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Signs for different colors',
      progress: 0,
      overview: 'Learn to sign all major colors and describe objects by their color.',
      whatYouLearn: [
        'Primary colors (red, blue, yellow)',
        'Secondary colors (green, orange, purple)',
        'Black, white, brown, pink',
        'Describing objects with colors',
        'Color preferences and combinations'
      ],
  prerequisites: ['Introduction to ASL'],
      detailedLessons: [] // Would have detailed lessons
    },
    {
      id: 8,
      title: 'Medical Terms',
      category: 'emergency',
      duration: '14 min',
      lessons: 10,
      thumbnail: 'https://images.unsplash.com/photo-1542868727-a1fc9a8a0ab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMGhvc3BpdGFsfGVufDF8fHx8MTc2MjI4Mjc3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Healthcare and medical vocabulary',
      progress: 0,
      overview: 'Essential medical signs for healthcare settings, doctor visits, and discussing health conditions.',
      whatYouLearn: [
        'Body parts',
        'Common symptoms (pain, fever, cough)',
        'Medical professionals (doctor, nurse)',
        'Medications and treatments',
        'Health conditions'
      ],
      prerequisites: ['Emergency Signs (recommended)'],
      detailedLessons: [] // Would have detailed lessons
    },
  ];

  // Search functionality
  const { search, results, totalResults, filteredResults, query } = useSearch({
    items: tutorials,
    searchFields: ['title', 'description', 'overview', 'whatYouLearn'],
    filterableFields: ['category', 'duration'],
    initialFilters: { sortBy: 'relevance' }
  });

  // Filter tutorials by category if not showing all
  const filteredTutorials = selectedCategory === 'all' 
    ? results 
    : results.filter(tutorial => tutorial.category === selectedCategory);

  if (selectedTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              setSelectedTutorial(null);
              setSelectedLesson(null);
            }}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tutorials
          </motion.button>

          {/* Tutorial Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedTutorial.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {selectedTutorial.description}
                </p>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">{selectedTutorial.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">{selectedTutorial.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">{selectedTutorial.progress}% complete</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedTutorial.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="lg:w-80">
                <ImageWithFallback
                  src={selectedTutorial.thumbnail}
                  alt={selectedTutorial.title}
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Lesson Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lessons List */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-4"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Lessons
                </h3>
                <div className="space-y-2">
                  {selectedTutorial.detailedLessons.map((lesson, index) => (
                    <motion.button
                      key={lesson.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                        selectedLesson?.id === lesson.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {lesson.title}
                        </span>
                        {completedLessons.includes(lesson.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : lesson.locked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Lesson Content */}
            <div className="lg:col-span-2">
              {selectedLesson ? (
                <motion.div
                  key={selectedLesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedLesson.title}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedLesson.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        Video Lesson
                      </span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 mb-6">
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <Play className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Video demonstration will play here
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Key Points
                    </h3>
                    <ul className="space-y-2">
                      {selectedLesson.keyPoints.map((point, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Practice Steps
                    </h3>
                    <ol className="space-y-3">
                      {selectedLesson.steps.map((step, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">{step}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (!completedLessons.includes(selectedLesson.id)) {
                          setCompletedLessons([...completedLessons, selectedLesson.id]);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                    >
                      Mark as Complete
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      Practice Again
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
                >
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Select a Lesson
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a lesson from the sidebar to begin learning
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    totalCompleted: completedLessons.length,
    totalLessons: tutorials.reduce((acc, t) => acc + t.lessons, 0),
    hoursLearned: 12.5,
    streak: 7,
  };

  const isDark = document.documentElement.classList.contains('dark');

  const handleTutorialClick = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setSelectedLesson(null);
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.locked) {
      setSelectedLesson(lesson);
    }
  };

  const handleBackToList = () => {
    setSelectedTutorial(null);
    setSelectedLesson(null);
  };

  const handleBackToTutorial = () => {
    setSelectedLesson(null);
  };

  // Lesson Detail View
  if (selectedLesson && selectedTutorial) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBackToTutorial}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:gap-3 transition-all mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to {selectedTutorial ? (selectedTutorial as Tutorial).title : 'Tutorials'}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Video Player Area */}
            <div className="bg-gray-900 h-[500px] flex items-center justify-center relative">
              <div className="text-center">
                <Video className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Video Player</p>
                <p className="text-gray-500 text-sm mt-2">In a real implementation, video content would play here</p>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl mb-2 text-gray-900 dark:text-white">{selectedLesson.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{selectedLesson.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  {selectedLesson.duration}
                </div>
              </div>

              {/* Key Points */}
              <div className="mb-8">
                <h3 className="text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Key Points to Remember
                </h3>
                <ul className="space-y-3">
                  {selectedLesson.keyPoints.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                    >
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Guide */}
              <div className="mb-8">
                <h3 className="text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Step-by-Step Guide
                </h3>
                <div className="space-y-3">
                  {selectedLesson.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    // Mark as complete
                    handleBackToTutorial();
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Complete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Tutorial Detail View
  if (selectedTutorial) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBackToList}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:gap-3 transition-all mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tutorials
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tutorial Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sticky top-24"
              >
                <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                  <ImageWithFallback
                    src={(selectedTutorial as Tutorial).thumbnail}
                    alt={(selectedTutorial as Tutorial)?.title ?? 'Tutorial thumbnail'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-2xl mb-4 text-gray-900 dark:text-white">{(selectedTutorial as Tutorial).title}</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span>{(selectedTutorial as Tutorial).duration} total</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-5 h-5" />
                    <span>{(selectedTutorial as Tutorial).lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Award className="w-5 h-5" />
                    <span>{(selectedTutorial as Tutorial).progress}% complete</span>
                  </div>
                </div>

                {(selectedTutorial as Tutorial).progress > 0 && (
                  <div className="mb-6">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-500 transition-all"
                        style={{ width: `${(selectedTutorial as Tutorial).progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-sm mb-3 text-gray-600 dark:text-gray-400">Prerequisites</h4>
                  <ul className="space-y-2">
                    {(selectedTutorial as Tutorial).prerequisites.map((prereq, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
              >
                <h3 className="text-2xl mb-4 text-gray-900 dark:text-white">Overview</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{(selectedTutorial as Tutorial).overview}</p>

                <h4 className="text-lg mb-3 text-gray-900 dark:text-white">What You'll Learn</h4>
                <ul className="space-y-3">
                  {(selectedTutorial as Tutorial).whatYouLearn.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Lessons List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
              >
                <h3 className="text-2xl mb-6 text-gray-900 dark:text-white">Course Content</h3>
                
                <div className="space-y-3">
                  {(selectedTutorial as Tutorial).detailedLessons && (selectedTutorial as Tutorial).detailedLessons.length > 0 ? (
                    (selectedTutorial as Tutorial).detailedLessons.map((lesson, index) => (
                      <motion.button
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        onClick={() => handleLessonClick(lesson)}
                        disabled={lesson.locked}
                        className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                          lesson.completed
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 hover:shadow-lg'
                            : lesson.locked
                            ? 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed opacity-60'
                            : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              lesson.completed
                                ? 'bg-green-500 text-white'
                                : lesson.locked
                                ? 'bg-gray-400 text-white'
                                : 'bg-gradient-to-r from-blue-600 to-purple-500 text-white'
                            }`}>
                              {lesson.completed ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : lesson.locked ? (
                                <Lock className="w-6 h-6" />
                              ) : (
                                <Play className="w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-gray-900 dark:text-white">Lesson {index + 1}: {lesson.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            {lesson.duration}
                          </div>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Detailed lessons coming soon for this tutorial!</p>
  <p className="text-sm mt-2">Check out Introduction to ASL or Common Greetings for full lesson content.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Tutorials List View
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl mb-2 text-gray-900 dark:text-white">Learn Sign Language</h1>
  <p className="text-gray-600 dark:text-gray-400">Master ASL with interactive video tutorials</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/** detect current theme **/}
          <SearchBar
            onSearch={search}
            placeholder="Search tutorials by title, description, or what you'll learn..."
            darkMode={isDark}
            showFilters={true}
            categories={['beginner', 'daily', 'emergency', 'numbers']}
            difficulties={['Beginner', 'Intermediate', 'Advanced']}
            durations={['Under 5 min', '5-10 min', '10-15 min', 'Over 15 min']}
            tags={['greetings', 'family', 'numbers', 'emergency', 'basic', 'conversation']}
          />
          
          <SearchResultsCounter
            total={totalResults}
            filtered={filteredResults}
            query={query}
            darkMode={isDark}
          />
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
            </div>
            <p className="text-3xl text-gray-900 dark:text-white">{stats.totalCompleted}/{tutorials.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Hours Learned</span>
            </div>
            <p className="text-3xl text-gray-900 dark:text-white">{stats.hoursLearned}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Lessons</span>
            </div>
            <p className="text-3xl text-gray-900 dark:text-white">{stats.totalLessons}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6" />
              <span className="text-sm">Day Streak</span>
            </div>
            <p className="text-3xl">{stats.streak} 🔥</p>
          </motion.div>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              onClick={() => handleTutorialClick(tutorial)}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group border border-gray-100 dark:border-gray-700"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {tutorial.progress > 0 && (
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm shadow-lg">
                    {tutorial.progress}%
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl mb-2 text-gray-900 dark:text-white">{tutorial.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tutorial.description}</p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{tutorial.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{tutorial.lessons} lessons</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {tutorial.progress > 0 && (
                  <div className="mb-4">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-500 transition-all"
                        style={{ width: `${tutorial.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                  {tutorial.progress === 0 ? (
                    <>
                      <Play className="w-5 h-5" />
                      Start Course
                    </>
                  ) : tutorial.progress === 100 ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Review
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Continue
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
