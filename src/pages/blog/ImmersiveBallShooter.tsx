import BlogPostLayout from '../../components/BlogPostLayout';

export default function ImmersiveBallShooter() {
  return (
    <BlogPostLayout relatedSlugs={['3d-box-shooter-game', 'robot-controlled-vehicle', 'wordle-solver']}>
      <h1>Immersive Ball Shooter</h1>
      <h2>Bringing 3D Gaming to Apple Vision Pro</h2>
      <p>With the introduction of Apple Vision Pro, a groundbreaking platform for augmented reality experiences, developers like myself have been eager to explore its potential. As someone deeply passionate about creating immersive gaming experiences, I was inspired to dive into the world of AR and bring my vision to life.</p>
      <h3>Gameplay and Code</h3>
      <p>Immersive Ball Shooter Gameplay:</p>
      <div className="relative w-full aspect-video">
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/KS_Q6PqjLKY?si=KmAHmqzoTfWYzChD"
          frameBorder="0"
          allowFullScreen
          title="Immersive Ball Shooter Gameplay"
        />
      </div>
      <p></p>
      <p>Code on GitHub: <a href="https://github.com/HenryLamBlog/Immersive-Ball-Shooter">https://github.com/HenryLamBlog/Immersive-Ball-Shooter</a></p>

      <h2>Embarking on a New Journey</h2>
      <p>My journey began with a simple yet ambitious idea: to develop an augmented reality game that seamlessly integrates with Apple Vision Pro. Drawing from my previous experience in game development, particularly with 3D box shooter games in Unity, I set out to reimagine this concept within the immersive world of AR.</p>
      <h2>The Vision Unfolds</h2>
      <p>Imagine stepping into a virtual world where reality blends seamlessly with the digital realm. With Immersive Ball Shooter, players are transported into a captivating AR environment where they can interact with dynamic elements while remaining fully aware of their surroundings.</p>
      <h2>Bringing Unity to RealityKit and SwiftUI</h2>
      <p>Transitioning from Unity to RealityKit and SwiftUI presented its own set of challenges and opportunities. While Unity offered robust tools for 3D game development, RealityKit provided a streamlined approach tailored specifically for AR experiences on Apple devices, complemented by SwiftUI for building intuitive user interfaces.</p>
      <p>The core gameplay of Immersive Ball Shooter revolves around shooting green balls within a designated time frame. Leveraging spatial gestures and intuitive controls, players engage in an adrenaline-fueled challenge to achieve the highest score possible.</p>
      <p>One of the key aspects of Immersive Ball Shooter is its scalability and adaptability. Players have the freedom to customize game settings, including ball count and time limits, to suit their preferences and skill levels. This flexibility ensures a dynamic and engaging experience for players of all backgrounds.</p>
      <ul>
        <li>Three time options: 15s, 30s, and 60s.</li>
        <li>Players can choose between shooting 10, 25, or 50 green balls.</li>
      </ul>
      <p>In Immersive Ball Shooter, players must shoot green balls without missing, as shooting the wrong color balls will cause them to grow twice in size, presenting an additional challenge and adding to the excitement of the gameplay.</p>

      <h2>Challenges and Triumphs</h2>
      <p>Developing Immersive Ball Shooter was a journey filled with learning, experimentation, and innovation. From refining spatial interactions to optimizing performance for AR environments, every step of the development process brought new insights and discoveries.</p>
      <p>Learning and understanding Swift, along with SwiftUI and RealityKit, presented its own set of challenges. Swift's syntax and functional programming concepts required adaptation, but with perseverance and dedication, mastery was achieved. SwiftUI's declarative approach to building user interfaces offered unparalleled flexibility but demanded a shift in mindset for developers accustomed to imperative paradigms.</p>

      <h2>Looking Ahead</h2>
      <p>As Immersive Ball Shooter makes its debut, I am excited to witness the impact it has on the AR gaming landscape. With Apple Vision Pro pushing the boundaries of augmented reality technology, the possibilities for immersive gaming experiences are limitless.</p>
      <p>I also plan to make updates and changes to the game such as:</p>
      <ul>
        <li>Adding more levels to Immersive Ball Shooter to enhance the gaming experience.</li>
        <li>Incorporating sound effects when shotting the balls to immerse players further into the gameplay.</li>
        <li>Introducing background music to elevate the atmosphere and mood of the game.</li>
        <li>Implementing harder difficulties, such as penalizing players for shooting the wrong ball by deducting time.</li>
      </ul>
      <h2>Conclusion</h2>
      <p>Immersive Ball Shooter represents the culmination of my passion for game development and my fascination with augmented reality. By harnessing the power of Apple Vision Pro, I hope to inspire others to explore the boundless potential of AR and redefine the way we interact with digital entertainment.</p>
    </BlogPostLayout>
  );
}
