
import React from 'react';
import { getArticleBySlug } from '@/lib/api/articles';
import { ArticleContent } from '@/components/knowledge-base/ArticleContent';
import { PremiumGate } from '@/components/ui/PremiumGate';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | FlameFit Knowledge`,
        description: article.description,
        openGraph: {
            images: [article.thumbnailUrl || '/images/default-article.jpg']
        }
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
                <Link href="/knowledge-base" className="text-orange-500 hover:underline">
                    Return to Knowledge Base
                </Link>
            </div>
        );
    }

    // Structured Data for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "description": article.description,
        "image": article.thumbnailUrl,
        "datePublished": article.date,
        "author": {
            "@type": "Organization",
            "name": "FlameFit Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "FlameFit",
            "logo": {
                "@type": "ImageObject",
                "url": "https://flamefit.ai/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://flamefit.ai/knowledge-base/articles/${slug}`
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-stone-950 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[60vh] w-full bg-stone-900 overflow-hidden">
                {article.thumbnailUrl && (
                    <div className="absolute inset-0">
                        <img
                            src={article.thumbnailUrl}
                            alt={article.title}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-stone-950 to-transparent" />
                    </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-5xl mx-auto w-full">
                    <div className="max-w-3xl">
                        <Link
                            href="/knowledge-base"
                            className="inline-flex items-center gap-2 text-stone-300 hover:text-white mb-6 transition-colors w-fit text-xs font-bold uppercase tracking-widest bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Library
                        </Link>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                {article.category}
                            </span>
                            {article.isPremium && (
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-stone-300 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                                    💎 Premium Content
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white font-heading mb-8 leading-[1.1] tracking-tight text-balance">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span>{Math.ceil(article.wordCount / 200)} Min Read</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                <span>{new Date(article.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-stone-800 border border-white/10 overflow-hidden flex items-center justify-center text-[10px] text-white">
                                    FF
                                </div>
                                <span>Team FlameFit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12 -mt-10 relative z-10">

                {/* Main Content */}
                <div className="lg:col-span-3 bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-stone-950/20 border border-stone-100 dark:border-white/5">
                    <div className="article-body">
                        <PremiumGate
                            isPremiumContent={article.isPremium}
                            title={article.title}
                            description="Deep physiological insights and advanced training protocols are reserved for Pro members."
                        >
                            <ArticleContent content={article.content} />
                        </PremiumGate>
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-stone-100 dark:border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-6 flex items-center gap-2">
                                <Tag className="w-3.5 h-3.5" /> Filed Under
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map(tag => (
                                    <Link
                                        key={tag}
                                        href={`/knowledge-base?search=${tag}`}
                                        className="px-4 py-2 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all border border-stone-100 dark:border-white/5"
                                    >
                                        #{tag.toUpperCase()}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-8 hidden lg:block">
                    {/* Share Card */}
                    <div className="bg-stone-900 rounded-3xl p-6 border border-white/5 space-y-4">
                        <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Share Protocol</h4>
                        <div className="flex gap-2 text-stone-300">
                            {/* Mock Social Buttons */}
                            <button className="flex-1 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">Twitter</button>
                            <button className="flex-1 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">Link</button>
                        </div>
                    </div>

                    {/* Pro Call to Action */}
                    {!article.isPremium && (
                        <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-orange-500/10">
                            <Tag className="w-8 h-8 opacity-50" />
                            <h4 className="font-bold text-lg leading-tight">Unlock the Full Lab</h4>
                            <p className="text-sm opacity-90 leading-relaxed font-medium">Get access to IFBB Pro blueprints and advanced biometric tracking.</p>
                            <Link
                                href="/workouts/pro"
                                className="block w-full text-center py-3 bg-white text-stone-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors"
                            >
                                View Pro Access
                            </Link>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
