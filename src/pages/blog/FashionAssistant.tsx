import BlogPostLayout from '../../components/BlogPostLayout';

export default function FashionAssistant() {
  return (
    <BlogPostLayout relatedSlugs={['colorization-of-grayscale-images', 'distinguishing-people-with-masks', 'wordle-solver']}>
      <h1>Personalized Clothing Style and Fashion Assistant</h1>
      <h2>Final Year Project — AI-Powered Fashion Recommendations</h2>
      <p>For my final year project at HKUST, I designed and developed a mobile platform that leverages AI to deliver personalized clothing recommendations. The system combines content-based and collaborative filtering techniques with advanced image recognition to help users discover fashion items that match their personal style.</p>

      <h2>Project Overview</h2>
      <p>The fashion industry generates an overwhelming amount of choices for consumers. Finding clothing that matches your personal style can be time-consuming and frustrating. This project addresses that challenge by building an intelligent assistant that learns from user preferences and visual similarities to recommend relevant fashion items.</p>
      <p>The platform allows users to upload images of clothing they like, and the system identifies visually similar items from a curated catalog. Combined with collaborative filtering that learns from user behavior patterns, the recommendations become increasingly personalized over time.</p>

      <h2>Technical Approach</h2>
      <h3>Hybrid Filtering System</h3>
      <p>The recommendation engine uses a hybrid approach combining two complementary techniques:</p>
      <ul>
        <li>Content-based filtering analyzes the visual and textual attributes of clothing items (color, pattern, style, category) to find similar items based on what the user has previously liked.</li>
        <li>Collaborative filtering identifies patterns across multiple users to suggest items that people with similar tastes have enjoyed, even if those items differ from the user's explicit preferences.</li>
      </ul>
      <p>By combining both approaches, the system overcomes the cold-start problem common in pure collaborative filtering while also introducing serendipitous discoveries that pure content-based systems miss.</p>

      <h3>Image Recognition</h3>
      <p>A key feature of the platform is the ability to match user-uploaded images with visually similar fashion items in the catalog. The image recognition pipeline uses deep learning models to extract visual features from clothing images, including:</p>
      <ul>
        <li>Color palette extraction</li>
        <li>Pattern and texture classification</li>
        <li>Garment type identification</li>
        <li>Style attribute detection</li>
      </ul>
      <p>These features are encoded into embedding vectors that enable fast similarity search across the catalog using approximate nearest neighbor algorithms.</p>

      <h2>System Architecture</h2>
      <p>The mobile application was built with a focus on responsive design and smooth user experience. The backend handles the computationally intensive recommendation and image processing tasks, while the frontend provides an intuitive interface for browsing recommendations, uploading images, and providing feedback.</p>

      <h2>Key Challenges</h2>
      <p>Several challenges emerged during development:</p>
      <ol>
        <li>Balancing recommendation accuracy with diversity — users want relevant suggestions but also need exposure to new styles they might not have considered.</li>
        <li>Handling the visual complexity of fashion items — unlike simple product categories, clothing has nuanced visual attributes that are difficult to capture in feature vectors.</li>
        <li>Managing the cold-start problem for new users with no interaction history.</li>
        <li>Optimizing inference speed for real-time image matching on mobile devices.</li>
      </ol>

      <h2>Results and Takeaways</h2>
      <p>The hybrid filtering approach significantly outperformed either technique in isolation, demonstrating the value of combining multiple recommendation strategies. User testing showed that the image-based search feature was particularly well-received, as it provided an intuitive way to find similar items without needing to describe them in words.</p>
      <p>This project deepened my understanding of recommendation systems, computer vision, and the challenges of building AI-powered products that feel natural and useful to end users.</p>

      <h2>Technologies Used</h2>
      <ul>
        <li>Python for the recommendation engine and image processing pipeline</li>
        <li>Deep learning models for visual feature extraction</li>
        <li>Collaborative and content-based filtering algorithms</li>
        <li>Mobile application development</li>
      </ul>
    </BlogPostLayout>
  );
}
