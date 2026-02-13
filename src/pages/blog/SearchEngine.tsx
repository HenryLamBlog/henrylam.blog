import BlogPostLayout from '../../components/BlogPostLayout';

export default function SearchEngine() {
  return (
    <BlogPostLayout relatedSlugs={['wordle-solver', 'fashion-assistant', 'maze-game-implementing-bfs-algorithm']}>
      <h1>Building a Web-Based Search Engine</h1>
      <h2>From Crawling to Ranking — A Search Systems Deep Dive</h2>
      <p>In this project, I built a web-based search engine from scratch, implementing the core components that power modern search: a web crawler, an indexing system, and a ranking algorithm. The goal was to understand the fundamental mechanics behind how search engines discover, organize, and retrieve information.</p>

      <h2>System Components</h2>
      <h3>Web Crawler</h3>
      <p>The crawler uses a Breadth-First Search (BFS) strategy to systematically discover and download web pages. Starting from a set of seed URLs, it explores the web by following hyperlinks, maintaining a frontier queue of URLs to visit and a set of already-visited pages to avoid redundant crawling.</p>
      <p>Key design decisions in the crawler include:</p>
      <ul>
        <li>Politeness policies to respect robots.txt and avoid overwhelming servers</li>
        <li>URL normalization to handle duplicate pages with different URL formats</li>
        <li>Content extraction to strip HTML markup and extract meaningful text</li>
        <li>Link extraction to discover new pages for the crawl frontier</li>
      </ul>

      <h3>Indexing with TF-IDF</h3>
      <p>Once pages are crawled, the indexing system processes the text content and builds an inverted index — a data structure that maps each term to the list of documents containing it. The index uses TF-IDF (Term Frequency–Inverse Document Frequency) weighting to capture the importance of each term in each document.</p>
      <p>TF-IDF assigns higher weights to terms that appear frequently in a specific document but rarely across the entire corpus. This helps distinguish documents that are genuinely about a topic from those that merely mention it in passing.</p>
      <ul>
        <li>Term Frequency (TF): How often a term appears in a document, normalized by document length</li>
        <li>Inverse Document Frequency (IDF): A measure of how rare or common a term is across all documents</li>
        <li>The final TF-IDF score is the product of these two values</li>
      </ul>

      <h3>Ranking with Cosine Similarity</h3>
      <p>When a user submits a query, the search engine converts both the query and each document into TF-IDF weighted vectors. It then computes the cosine similarity between the query vector and each document vector to rank results by relevance.</p>
      <p>Cosine similarity measures the angle between two vectors in the term space, making it robust to differences in document length. Documents with vectors pointing in a similar direction to the query vector are ranked higher, regardless of their absolute term frequencies.</p>

      <h2>Architecture</h2>
      <p>The search engine follows a pipeline architecture:</p>
      <ol>
        <li>The crawler discovers and downloads web pages using BFS traversal</li>
        <li>The preprocessor cleans and tokenizes the raw HTML content</li>
        <li>The indexer builds the inverted index with TF-IDF weights</li>
        <li>The query processor converts user queries into vectors and computes similarity scores</li>
        <li>The results are ranked by cosine similarity and presented to the user</li>
      </ol>

      <h2>Challenges</h2>
      <p>Building a search engine from scratch surfaced several interesting challenges:</p>
      <ul>
        <li>Handling the scale of web data — even a small crawl can produce thousands of pages that need efficient indexing</li>
        <li>Dealing with noisy HTML content — extracting meaningful text from web pages with navigation menus, ads, and boilerplate content</li>
        <li>Query processing speed — computing cosine similarity against a large index needs optimization (sparse vector representations, inverted index lookups)</li>
        <li>Relevance quality — TF-IDF and cosine similarity provide a solid baseline but miss semantic understanding that modern search engines capture with embeddings</li>
      </ul>

      <h2>Key Takeaways</h2>
      <p>This project gave me a deep appreciation for the engineering behind search engines. Even a basic implementation requires careful attention to data structures, algorithms, and system design. The BFS crawler, TF-IDF indexing, and cosine similarity ranking form the classical foundation that more advanced techniques (PageRank, BERT embeddings, learning-to-rank) build upon.</p>
      <p>Understanding these fundamentals makes it much easier to reason about why modern search engines behave the way they do and where their limitations come from.</p>
    </BlogPostLayout>
  );
}
