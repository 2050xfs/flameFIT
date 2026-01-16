import { KnowledgeBaseProps, ContentItem } from "@/lib/types";

const mockContent: ContentItem[] = [
    {
        id: '1',
        title: 'Perfect Barbell Squat Form',
        description: 'Master the fundamental movement pattern for lower body strength. Learn proper depth, bar position, and breathing.',
        category: 'strength',
        tags: ['squat', 'legs', 'form'],
        duration: '12:30',
        difficulty: 'intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
        videoUrl: '/videos/squat-form.mp4',
        isBookmarked: false
    },
    {
        id: '2',
        title: 'HIIT Cardio for Fat Loss',
        description: 'High-intensity interval training protocol designed to maximize fat burning and improve cardiovascular fitness.',
        category: 'cardio',
        tags: ['hiit', 'cardio', 'fat-loss'],
        duration: '25:00',
        difficulty: 'advanced',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop',
        videoUrl: '/videos/hiit-cardio.mp4',
        isBookmarked: true
    },
    {
        id: '3',
        title: 'Morning Mobility Routine',
        description: 'Wake up your body with this comprehensive mobility flow. Perfect for improving range of motion and reducing stiffness.',
        category: 'mobility',
        tags: ['mobility', 'stretching', 'morning'],
        duration: '15:00',
        difficulty: 'beginner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
        videoUrl: '/videos/mobility.mp4',
        isBookmarked: true
    },
    {
        id: '4',
        title: 'Macro Counting 101',
        description: 'Learn how to track macronutrients effectively. Understand protein, carbs, and fats for optimal body composition.',
        category: 'nutrition',
        tags: ['nutrition', 'macros', 'diet'],
        duration: '18:45',
        difficulty: 'beginner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop',
        videoUrl: '/videos/macro-counting.mp4',
        isBookmarked: false
    },
    {
        id: '5',
        title: 'Sleep Optimization Guide',
        description: 'Maximize recovery through better sleep. Strategies for improving sleep quality and duration for muscle growth.',
        category: 'recovery',
        tags: ['sleep', 'recovery', 'rest'],
        duration: '22:15',
        difficulty: 'beginner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=400&fit=crop',
        videoUrl: '/videos/sleep-guide.mp4',
        isBookmarked: false
    },
    {
        id: '6',
        title: 'Deadlift Technique',
        description: 'Build a strong posterior chain with proper deadlift form. Learn conventional vs sumo stance and common mistakes.',
        category: 'strength',
        tags: ['deadlift', 'back', 'technique'],
        duration: '16:20',
        difficulty: 'intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
        videoUrl: '/videos/deadlift.mp4',
        isBookmarked: false
    },
    {
        id: '7',
        title: 'Running Form Essentials',
        description: 'Improve your running economy and reduce injury risk. Cadence, foot strike, and posture breakdown.',
        category: 'cardio',
        tags: ['running', 'cardio', 'form'],
        duration: '14:30',
        difficulty: 'beginner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop',
        videoUrl: '/videos/running-form.mp4',
        isBookmarked: false
    },
    {
        id: '8',
        title: 'Yoga for Athletes',
        description: 'Sport-specific yoga flow designed to improve flexibility, balance, and mental focus for peak performance.',
        category: 'mobility',
        tags: ['yoga', 'flexibility', 'recovery'],
        duration: '30:00',
        difficulty: 'intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
        videoUrl: '/videos/yoga.mp4',
        isBookmarked: false
    }
];

export async function getKnowledgeBaseData(): Promise<Omit<KnowledgeBaseProps, 'onViewContent' | 'onSearch' | 'onBookmark'>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const categorized = {
        strength: mockContent.filter(c => c.category === 'strength'),
        cardio: mockContent.filter(c => c.category === 'cardio'),
        mobility: mockContent.filter(c => c.category === 'mobility'),
        nutrition: mockContent.filter(c => c.category === 'nutrition'),
        recovery: mockContent.filter(c => c.category === 'recovery')
    };

    return {
        featured: mockContent.slice(0, 1),
        categories: categorized,
        bookmarked: mockContent.filter(c => c.isBookmarked)
    };
}
