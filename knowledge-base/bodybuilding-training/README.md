# Bodybuilding.com Training Articles Knowledge Base

## Overview

This knowledge base contains **190 training articles** scraped from [Bodybuilding.com's Training Blog](https://shop.bodybuilding.com/blogs/training).

**Last Updated:** 2026-01-18T13:25:58.171540

## Statistics

- **Total Articles:** 190
- **Total Categories:** 0
- **Total Word Count:** 228,778

## Top Categories


## Folder Structure

```
bodybuilding-training/
├── scraper.py              # Scraping script
├── requirements.txt        # Python dependencies
├── urls.json              # All discovered article URLs
├── manifest.json          # Master index of all articles
├── progress.json          # Scraping progress tracker
├── scraping_log.txt       # Detailed operation log
├── README.md              # This file
└── articles/              # All scraped articles
    ├── article-slug-1/
    │   ├── metadata.json  # Article metadata
    │   ├── content.md     # Markdown content
    │   ├── content.html   # Original HTML
    │   └── images/        # Downloaded images
    └── article-slug-2/
        └── ...
```

## Article Structure

Each article folder contains:

- **metadata.json**: Structured metadata including title, URL, date, author, tags, word count, and image count
- **content.md**: Clean markdown version of the article content
- **content.html**: Original HTML content for reference
- **images/**: All images referenced in the article

## Usage

### Loading into Vector Database

```python
import json
from pathlib import Path

# Load manifest
with open('manifest.json', 'r') as f:
    manifest = json.load(f)

# Iterate through articles
for article in manifest['articles']:
    folder = Path(article['folder'])
    
    # Load metadata
    with open(folder / 'metadata.json', 'r') as f:
        metadata = json.load(f)
    
    # Load content
    with open(folder / 'content.md', 'r') as f:
        content = f.read()
    
    # Process for your vector DB
    # ...
```

### Searching Articles

Use the `manifest.json` file to quickly search and filter articles:

```python
# Find articles by tag
training_articles = [a for a in manifest['articles'] if 'training' in a['tags']]

# Find recent articles
from datetime import datetime
recent = sorted(manifest['articles'], key=lambda x: x.get('date', ''), reverse=True)[:10]
```

## Integration with RAG Systems

This knowledge base is optimized for Retrieval-Augmented Generation (RAG) systems:

1. **Structured Metadata**: Each article has rich metadata for filtering and ranking
2. **Clean Markdown**: Content is in clean markdown format for easy chunking
3. **Preserved Structure**: HTML version available for structure-aware processing
4. **Local Images**: All images downloaded and referenced locally
5. **Master Index**: `manifest.json` provides quick overview and search capabilities

### Recommended Chunking Strategy

- Chunk by heading sections (H2, H3)
- Include metadata in chunk context
- Preserve image references
- Target chunk size: 500-1000 tokens

## Data Quality

All articles have been validated for:
- ✅ Complete metadata
- ✅ Non-empty content
- ✅ Downloaded images
- ✅ Valid JSON structure

## License & Attribution

All content is property of Bodybuilding.com. This dataset is for personal knowledge base and research purposes only.

**Source:** https://shop.bodybuilding.com/blogs/training
