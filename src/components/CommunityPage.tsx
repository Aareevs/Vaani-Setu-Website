import { useState } from 'react';
import { Search, ThumbsUp, MessageCircle, TrendingUp, Plus, User, Star, X, Send, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { containsProfanity, getProfanityWarningMessage } from '../utils/profanityFilter';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  replies: Reply[];
}

interface Reply {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const [likedReplies, setLikedReplies] = useState<number[]>([]);
  const [likedTestimonials, setLikedTestimonials] = useState<number[]>([]);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [profanityError, setProfanityError] = useState<string | null>(null);

  const trendingTopics = [
    { tag: 'beginners', count: 234 },
    { tag: 'tips', count: 189 },
    { tag: 'questions', count: 156 },
    { tag: 'success-stories', count: 142 },
  ];

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Priya Sharma',
      avatar: '👩',
      time: '2 hours ago',
      title: 'Tips for Learning ISL as a Complete Beginner',
      content: "I've been using Vaani Setu for 3 months now and wanted to share some tips that helped me learn Indian Sign Language...",
      likes: 45,
      comments: 12,
      tags: ['beginners', 'tips'],
    },
    {
      id: 2,
      author: 'Rajesh Kumar',
      avatar: '👨',
      time: '5 hours ago',
      title: 'How accurate is the AI detection in low light?',
      content: "I've noticed the detection works great in daylight, but I'm curious about performance in low light conditions. Has anyone tested this?",
      likes: 23,
      comments: 8,
      tags: ['questions', 'technical'],
    },
    {
      id: 3,
      author: 'Anita Desai',
      avatar: '👩‍🦰',
      time: '1 day ago',
      title: 'Success Story: Helped my grandmother communicate!',
      content: "Just wanted to share this heartwarming moment. My grandmother who is hearing-impaired was able to have a full conversation with my kids using Vaani Setu...",
      likes: 89,
      comments: 24,
      tags: ['success-stories', 'inspiration'],
    },
    {
      id: 4,
      author: 'Arjun Patel',
      avatar: '👨‍💼',
      time: '2 days ago',
      title: 'Request: Add support for more regional signs',
      content: "Would love to see support for regional variations of ISL. Different states have slightly different signs for common words...",
      likes: 34,
      comments: 15,
      tags: ['feature-request', 'regional'],
    },
  ]);

  const [commentsData, setCommentsData] = useState<Record<number, Comment[]>>({
    1: [
      {
        id: 101,
        author: 'Karan Verma',
        avatar: '👨‍💻',
        content: 'Great tips! I especially found the practice routine helpful.',
        time: '1 hour ago',
        likes: 8,
        replies: [
          {
            id: 1001,
            author: 'Priya Sharma',
            avatar: '👩',
            content: 'Thank you! Glad it helped you!',
            time: '45 min ago',
            likes: 3,
          },
        ],
      },
      {
        id: 102,
        author: 'Neha Singh',
        avatar: '👩‍🎓',
        content: 'Can you share more about the daily practice schedule?',
        time: '30 min ago',
        likes: 5,
        replies: [],
      },
    ],
    2: [
      {
        id: 201,
        author: 'Amit Patel',
        avatar: '🧑‍💼',
        content: 'I tested it in low light and it works okay but definitely better with good lighting.',
        time: '3 hours ago',
        likes: 12,
        replies: [],
      },
    ],
    3: [
      {
        id: 301,
        author: 'Sanjay Kumar',
        avatar: '👨‍🏫',
        content: 'This is so heartwarming! Stories like these remind us why this platform is so important.',
        time: '20 hours ago',
        likes: 15,
        replies: [],
      },
    ],
    4: [
      {
        id: 401,
        author: 'Deepa Reddy',
        avatar: '👩‍⚕️',
        content: 'I agree! Regional variations would make it even more useful.',
        time: '1 day ago',
        likes: 7,
        replies: [],
      },
    ],
  });

  const userTestimonials = [
    {
      id: 1,
      name: 'Meera Singh',
      avatar: '👩‍🎓',
      rating: 5,
      date: 'Oct 28, 2024',
      review: 'Vaani Setu has been a game-changer for me! As a teacher with hearing-impaired students, this platform has made communication so much easier. The AI detection is incredibly accurate.',
      helpful: 24,
    },
    {
      id: 2,
      name: 'Karan Mehta',
      avatar: '👨‍💻',
      rating: 5,
      date: 'Oct 25, 2024',
      review: 'The interface is intuitive and the tutorials are very well structured. I learned basic ISL in just 2 weeks. Highly recommend for anyone wanting to learn sign language!',
      helpful: 18,
    },
    {
      id: 3,
      name: 'Sanya Kapoor',
      avatar: '👩‍⚕️',
      rating: 5,
      date: 'Oct 22, 2024',
      review: 'Great platform overall. The real-time translation is impressive. Would love to see more regional sign variations added. Still, an excellent tool for bridging communication gaps.',
      helpful: 15,
    },
    {
      id: 4,
      name: 'Vikram Reddy',
      avatar: '🧑‍🔧',
      rating: 5,
      date: 'Oct 20, 2024',
      review: 'As someone who works with the deaf community, I can say this is one of the best AI-powered sign language tools out there. The accuracy and speed are remarkable!',
      helpful: 31,
    },
    {
      id: 5,
      name: 'Anjali Verma',
      avatar: '👩‍🎨',
      rating: 5,
      date: 'Oct 18, 2024',
      review: 'My daughter is deaf and Vaani Setu has helped our entire family learn ISL together. The community support is amazing. Thank you for creating such an inclusive platform!',
      helpful: 42,
    },
    {
      id: 6,
      name: 'Rohit Sharma',
      avatar: '👨‍🏫',
      rating: 5,
      date: 'Oct 15, 2024',
      review: 'Very useful for my work as a special education teacher. The camera detection works well in most lighting conditions. A few minor bugs here and there, but overall fantastic!',
      helpful: 12,
    },
  ];

  const toggleLikePost = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes - 1 } : post
      ));
    } else {
      setLikedPosts([...likedPosts, postId]);
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    }
  };

  const toggleLikeComment = (commentId: number) => {
    if (likedComments.includes(commentId)) {
      setLikedComments(likedComments.filter(id => id !== commentId));
      setCommentsData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(postId => {
          updated[Number(postId)] = updated[Number(postId)].map(comment =>
            comment.id === commentId ? { ...comment, likes: comment.likes - 1 } : comment
          );
        });
        return updated;
      });
    } else {
      setLikedComments([...likedComments, commentId]);
      setCommentsData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(postId => {
          updated[Number(postId)] = updated[Number(postId)].map(comment =>
            comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
          );
        });
        return updated;
      });
    }
  };

  const toggleLikeReply = (replyId: number) => {
    if (likedReplies.includes(replyId)) {
      setLikedReplies(likedReplies.filter(id => id !== replyId));
      setCommentsData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(postId => {
          updated[Number(postId)] = updated[Number(postId)].map(comment => ({
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === replyId ? { ...reply, likes: reply.likes - 1 } : reply
            ),
          }));
        });
        return updated;
      });
    } else {
      setLikedReplies([...likedReplies, replyId]);
      setCommentsData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(postId => {
          updated[Number(postId)] = updated[Number(postId)].map(comment => ({
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
            ),
          }));
        });
        return updated;
      });
    }
  };

  const toggleLikeTestimonial = (testimonialId: number, currentHelpful: number) => {
    // This would update the testimonial's helpful count
    setLikedTestimonials(prev => {
      if (prev.includes(testimonialId)) {
        return prev.filter(id => id !== testimonialId);
      } else {
        return [...prev, testimonialId];
      }
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    // Check for profanity
    if (containsProfanity(newComment)) {
      setProfanityError(getProfanityWarningMessage());
      setTimeout(() => setProfanityError(null), 5000);
      return;
    }

    const newCommentObj: Comment = {
      id: Date.now(),
      author: 'You',
      avatar: '👤',
      content: newComment,
      time: 'Just now',
      likes: 0,
      replies: [],
    };

    setCommentsData(prev => ({
      ...prev,
      [selectedPost]: [...(prev[selectedPost] || []), newCommentObj],
    }));

    setPosts(posts.map(post =>
      post.id === selectedPost ? { ...post, comments: post.comments + 1 } : post
    ));

    setNewComment('');
    setProfanityError(null);
  };

  const handleAddReply = (commentId: number) => {
    if (!replyText.trim() || !selectedPost) return;

    // Check for profanity
    if (containsProfanity(replyText)) {
      setProfanityError(getProfanityWarningMessage());
      setTimeout(() => setProfanityError(null), 5000);
      return;
    }

    const newReply: Reply = {
      id: Date.now(),
      author: 'You',
      avatar: '👤',
      content: replyText,
      time: 'Just now',
      likes: 0,
    };

    setCommentsData(prev => ({
      ...prev,
      [selectedPost]: prev[selectedPost].map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      ),
    }));

    setReplyText('');
    setReplyingTo(null);
    setProfanityError(null);
  };

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl mb-2 text-gray-900 dark:text-white">Community Forum</h1>
              <p className="text-gray-600 dark:text-gray-400">Connect, share, and learn together</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-2xl">
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white">{post.author}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{post.time}</p>
                  </div>
                </div>

                {/* Post Content */}
                <h2 className="text-xl mb-3 text-gray-900 dark:text-white">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{post.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => toggleLikePost(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      likedPosts.includes(post.id)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedPost(post.id)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </motion.div>
            ))}

            {/* User Testimonials Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl text-gray-900 dark:text-white">User Testimonials</h2>
              </div>

              {/* Average Rating */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-5xl mb-2 text-gray-900 dark:text-white">5.0</div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Based on {userTestimonials.length} testimonials</p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = userTestimonials.filter((r) => r.rating === rating).length;
                    const percentage = (count / userTestimonials.length) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{rating}★</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Testimonials List */}
              <div className="space-y-6">
                {userTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                  >
                    {/* Testimonial Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-xl">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h4 className="text-gray-900 dark:text-white">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= testimonial.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{testimonial.review}</p>

                    {/* Testimonial Actions */}
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleLikeTestimonial(testimonial.id, testimonial.helpful)}
                        className={`flex items-center gap-2 text-sm transition-colors ${
                          likedTestimonials.includes(testimonial.id)
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${likedTestimonials.includes(testimonial.id) ? 'fill-current' : ''}`} />
                        <span>Helpful ({testimonial.helpful + (likedTestimonials.includes(testimonial.id) ? 1 : 0)})</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Write a Testimonial Button */}
              <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
                <Star className="w-5 h-5" />
                Write a Testimonial
              </button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg text-gray-900 dark:text-white">Trending Topics</h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                  >
                    <span className="text-gray-900 dark:text-white">#{topic.tag}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{topic.count} posts</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Community Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Total Members:</span>
                  <span className="text-xl">12,483</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Today:</span>
                  <span className="text-xl">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Posts This Week:</span>
                  <span className="text-xl">342</span>
                </div>
              </div>
            </motion.div>

            {/* Guidelines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Be respectful and inclusive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Stay on topic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>No spam or self-promotion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Help others learn</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <AnimatePresence>
        {selectedPost && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl text-gray-900 dark:text-white">Comments</h2>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {commentsData[selectedPost]?.map((comment) => (
                    <div key={comment.id} className="space-y-3">
                      {/* Comment */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                          {comment.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-gray-900 dark:text-white">{comment.author}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{comment.time}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-2 ml-2">
                            <button
                              onClick={() => toggleLikeComment(comment.id)}
                              className={`flex items-center gap-1 text-sm transition-colors ${
                                likedComments.includes(comment.id)
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                              }`}
                            >
                              <ThumbsUp className={`w-4 h-4 ${likedComments.includes(comment.id) ? 'fill-current' : ''}`} />
                              <span>{comment.likes}</span>
                            </button>
                            <button
                              onClick={() => setReplyingTo(comment.id)}
                              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              Reply
                            </button>
                          </div>

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="mt-4 space-y-3 ml-6">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                                    {reply.avatar}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-gray-100 dark:bg-gray-600 rounded-xl p-3">
                                      <div className="flex items-center justify-between mb-1">
                                        <h5 className="text-sm text-gray-900 dark:text-white">{reply.author}</h5>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{reply.time}</span>
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-300">{reply.content}</p>
                                    </div>
                                    <button
                                      onClick={() => toggleLikeReply(reply.id)}
                                      className={`flex items-center gap-1 text-xs mt-1 ml-2 transition-colors ${
                                        likedReplies.includes(reply.id)
                                          ? 'text-blue-600 dark:text-blue-400'
                                          : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                                      }`}
                                    >
                                      <ThumbsUp className={`w-3 h-3 ${likedReplies.includes(reply.id) ? 'fill-current' : ''}`} />
                                      <span>{reply.likes}</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input */}
                          {replyingTo === comment.id && (
                            <div className="mt-3 ml-6 flex gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                              />
                              <button
                                onClick={() => handleAddReply(comment.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!commentsData[selectedPost] || commentsData[selectedPost].length === 0) && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No comments yet. Be the first to comment!
                    </div>
                  )}
                </div>

                {/* Add Comment */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                  {/* Profanity Error */}
                  <AnimatePresence>
                    {profanityError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-xl flex items-start gap-2"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-300">{profanityError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button
                      onClick={handleAddComment}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
