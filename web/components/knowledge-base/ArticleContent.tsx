
import React from 'react';

interface ArticleContentProps {
    content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
    // This is a simple renderer. For production, use a library like 'react-markdown'
    // But for now, we'll try to process basic markdown to HTML or just render as pre-wrap if no library available
    // Since we don't have react-markdown in package.json, let's do a very basic parser or just display text

    // Better approach: We should add react-markdown later.
    // For now, let's format paragraphs.

    const paragraphs = content.split('\n\n').filter(Boolean);

    return (
        <article className="prose prose-stone dark:prose-invert max-w-none">
            {paragraphs.map((p, idx) => {
                // Heuristic for headers
                if (p.startsWith('# ')) {
                    return <h1 key={idx} className="text-3xl font-bold font-heading mt-8 mb-4">{p.replace('# ', '')}</h1>
                }
                if (p.startsWith('## ')) {
                    return <h2 key={idx} className="text-2xl font-bold font-heading mt-8 mb-4">{p.replace('## ', '')}</h2>
                }
                if (p.startsWith('### ')) {
                    return <h3 key={idx} className="text-xl font-bold font-heading mt-6 mb-3">{p.replace('### ', '')}</h3>
                }
                // Heuristic for list items
                if (p.startsWith('- ')) {
                    const items = p.split('\n').map(line => line.replace('- ', ''));
                    return (
                        <ul key={idx} className="list-disc pl-6 space-y-2 mb-4">
                            {items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )
                }

                // Standard paragraph
                return <p key={idx} className="mb-4 leading-relaxed text-stone-600 dark:text-stone-300">{p}</p>
            })}
        </article>
    );
}
