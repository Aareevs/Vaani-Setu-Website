import { useState } from 'react';
import { Search, ThumbsUp, MessageCircle, Filter, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: Date;
  category: 'discussion' | 'question' | 'success' | 'feature-request' | 'tips';
}

interface CommunityAllPageProps {
  onNavigate?: (page: any) => void;
}

export default function CommunityAllPage({ onNavigate }: CommunityAllPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'most-commented'>('newest');

  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const dataset: Post[] = Array.from({ length: 24 }).map((_, i) => {
    const id = i + 101;
    const categories: Post['category'][] = ['discussion', 'question', 'success', 'feature-request', 'tips'];
    const category = categories[i % categories.length];
    const authors = ['Emma Johnson', 'Noah Williams', 'Liam Brown', 'Olivia Miller', 'Oliver Jones', 'Sophia Davis', 'James Wilson', 'Mia Garcia', 'Benjamin Martin', 'Charlotte Thompson'];
    const avatars = ['👩', '👨', '👨‍🦱', '👩‍🎓', '👨‍💻', '👩‍💼'];
    const titles = {
      discussion: 'Community discussion on best practice routines',
      question: 'Question: Recommended webcam settings?',
      success: 'Success: Completed my first live session',
      'feature-request': 'Feature request: Export practice history',
      tips: 'Tips: Learn numbers and finger spelling faster'
    };
    const tagSets: Record<Post['category'], string[]> = {
      discussion: ['community', 'practice'],
      question: ['questions', 'technical'],
      success: ['success-stories', 'motivation'],
      'feature-request': ['feature-request'],
      tips: ['beginners', 'tips']
    };
    return {
      id,
      author: authors[i % authors.length],
      avatar: avatars[i % avatars.length],
      time: `${(i % 7) + 1} days ago`,
      title: titles[category],
      content: 'Sharing details and experiences to help others. Add your thoughts below and let’s improve together.',
      likes: 10 + (i * 2) % 80,
      comments: 3 + (i % 18),
      tags: tagSets[category],
      createdAt: new Date(Date.now() - ((i + 1) * 24 * 60 * 60 * 1000)),
      category
    };
  });

  const [posts, setPosts] = useState<Post[]>(dataset);

  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => post.tags.includes(tag));
      return matchesSearch && matchesCategory && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'most-commented':
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

  const toggleLikePost = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
      setPosts(posts.map(p => (p.id === postId ? { ...p, likes: p.likes - 1 } : p)));
    } else {
      setLikedPosts([...likedPosts, postId]);
      setPosts(posts.map(p => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => onNavigate?.('community')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-3xl mb-1 text-gray-900 dark:text-white">All Community Posts</h1>
                <p className="text-gray-600 dark:text-gray-400">Browse an extended list of discussions and stories</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setSelectedTags([])}
              className="px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="discussion">Discussion</option>
              <option value="question">Question</option>
              <option value="success">Success Story</option>
              <option value="feature-request">Feature Request</option>
              <option value="tips">Tips</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="most-commented">Most Commented</option>
            </select>
            <div className="flex flex-wrap gap-2">
              {['community', 'practice', 'questions', 'technical', 'success-stories', 'feature-request', 'beginners', 'tips'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag) ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">Showing {filteredAndSortedPosts.length} of {posts.length} posts</div>

        <div className="space-y-6">
          <AnimatePresence>
            {filteredAndSortedPosts.map((post, index) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, delay: index * 0.03 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/50 shadow">
                    <img
                      src={String(post.avatar).startsWith('http') ? post.avatar : `https://i.pravatar.cc/80?img=${(post.id % 70) + 1}`}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white">{post.author}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{post.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    post.category === 'discussion' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                    post.category === 'question' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                    post.category === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                    post.category === 'feature-request' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>{post.category}</span>
                </div>
                <h2 className="text-xl mb-3 text-gray-900 dark:text-white">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{post.content}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm">#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => toggleLikePost(post.id)} className={`flex items-center gap-2 ${likedPosts.includes(post.id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}>
                    <ThumbsUp className={`w-5 h-5 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredAndSortedPosts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}