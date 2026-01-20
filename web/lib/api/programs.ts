
import { ProProgram } from "@/lib/types";

export interface ProgramChapter {
    id: string;
    title: string;
    description: string;
    duration: string; // e.g. "Weeks 1-4"
    exercises: number; // count
    videoUrl?: string;
    isFreePreview?: boolean;
}

export interface DetailedProProgram extends ProProgram {
    author: {
        name: string;
        title: string;
        image: string;
        bio: string;
    };
    synopsis: string;
    chapters: ProgramChapter[];
    marketing_tags: string[]; // e.g. "Best Seller", "Hypertrophy Focus"
}

// Mock Data Source
const MOCK_PROGRAMS: DetailedProProgram[] = [
    {
        id: "sadik-abs",
        title: "Abs Destruction",
        creator: "Sadik Hadzovic", // Added creator to match ProProgram
        description: "Carve a legendary core with Sadik's high-volume circuit training.",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60",
        author: {
            name: "Sadik Hadzovic",
            title: "IFBB Pro & Flame Fit Legend",
            image: "/authors/sadik.jpg",
            bio: "Classic Physique icon known for his aesthetic symmetry and legendary conditioning."
        },
        synopsis: "This isn't just about doing crunches. It's about sculpting deep, etching detail, and building a core that performs as good as it looks. Sadik's 'Abs Destruction' combines weighted movements with metabolic conditioning to burn fat while building brick-like abdominals.",
        durationWeeks: 4,
        difficulty: "advanced", // lowercase to match type
        marketing_tags: ["Core Focus", "High Intensity", "IFBB Pro"],
        chapters: [
            { id: "c1", title: "Phase 1: Foundation & Volume", description: "Building work capacity and learning the movement patterns.", duration: "Week 1", exercises: 5, isFreePreview: true },
            { id: "c2", title: "Phase 2: Weighted Integration", description: "Adding load to thicken the abdominal wall.", duration: "Weeks 2-3", exercises: 6 },
            { id: "c3", title: "Phase 3: The Peak Week", description: "Metabolic circuits to reveal the work.", duration: "Week 4", exercises: 8 }
        ]
    },
    {
        id: "aj-formula",
        title: "The Secret Formula",
        creator: "AJ Ellison", // Added creator
        description: "AJ Ellison's blueprint for a world-class physique.",
        thumbnailUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=60",
        author: {
            name: "AJ Ellison",
            title: "WBFF World Champ",
            image: "/authors/aj.jpg",
            bio: "Renowned for his perfect proportions and posing artistry."
        },
        synopsis: "Symmetry is king. This program focuses on bringing up lagging body parts while maintaining a lean, aesthetic waistline. It uses a push/pull/legs split modified for aesthetic balance.",
        durationWeeks: 12,
        difficulty: "intermediate", // lowercase
        marketing_tags: ["Aesthetics", "Full Body", "WBFF Champ"],
        chapters: [
            { id: "c1", title: "Month 1: Hypertrophy", description: "Time under tension focus.", duration: "Weeks 1-4", exercises: 12 },
            { id: "c2", title: "Month 2: Strength", description: "Lower reps, higher intensity.", duration: "Weeks 5-8", exercises: 10 },
            { id: "c3", title: "Month 3: Refinement", description: "Isolation and detailing.", duration: "Weeks 9-12", exercises: 14 }
        ]
    }
];

export async function getProPrograms(): Promise<DetailedProProgram[]> {
    // Simulate DB latency
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROGRAMS;
}

export async function getProProgramById(id: string): Promise<DetailedProProgram | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PROGRAMS.find(p => p.id === id) || null;
}
