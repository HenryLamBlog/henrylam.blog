import BlogPostLayout from '../../components/BlogPostLayout';

export default function BoxShooterGame() {
  return (
    <BlogPostLayout relatedSlugs={['roller-madness', 'distinguishing-people-with-masks', 'carbon-credit-tokenization']}>
      <h1>Creating 3D Box Shooter</h1>
      <h2>Introduction</h2>
      <p>Embarking on the journey of game development can be an exciting yet daunting task, especially when venturing into the realm of creating a first-person shooter game. In this blog post, I share my personal journey of building Box Shooter, a game developed by me using C# scripts in Unity.</p>

      <h2>Learning the basics</h2>
      <p>My journey into the world of programming and Unity commenced with humble beginnings. I embarked on this adventure with a thirst for knowledge and a curiosity to explore the realms of game development. Initially, I immersed myself in a plethora of tutorials and documentation, absorbing the foundational principles of C# scripting and Unity game development. Each tutorial and document I encountered served as a stepping stone, gradually shaping my understanding of the intricate mechanics that underpin immersive gaming experiences.</p>

      <div className="relative w-full aspect-video">
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/videoseries?si=9TEgo0EqkNYEuQpr&list=PLFt_AvWsXl0fnA91TcmkRyhhixX9CO3Lw"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <p></p>
      <p>This YouTube tutorial series really helped me understand the basics and fundamentals of C# in Unity. It provided clear explanations and practical examples that facilitated my learning process, allowing me to grasp essential concepts such as object-oriented programming, game physics, and user interface design. Through engaging tutorials and hands-on exercises, I gained confidence in my programming skills and developed a deeper appreciation for the creative possibilities offered by Unity game development.</p>

      <p>As I delved deeper into the intricacies of programming and Unity, I found myself drawn to the hands-on aspect of learning through experimentation. Armed with newfound knowledge, I eagerly dived into sample projects, eager to apply theoretical concepts to practical scenarios. Through trial and error, I honed my skills, gaining invaluable insights into the nuances of coding and game development. With each experiment, I encountered challenges that tested my problem-solving abilities and propelled me towards greater proficiency.</p>

      <p>Throughout this initial phase of learning, I embraced a growth mindset, viewing challenges as opportunities for growth rather than obstacles to overcome. With each obstacle conquered, I emerged more resilient and equipped with a deeper understanding of the dynamic interplay between code and game mechanics. As I reflect on this journey of discovery, I am filled with a sense of excitement and anticipation, eager to continue honing my skills and unraveling the endless possibilities that await in the vast landscape of game development.</p>

      <h2>Designing the game</h2>
      <p>Box Shooter is an exhilarating first-person shooter game designed to challenge players' reflexes, decision-making, and precision. The game is divided into two distinct levels, each presenting its own set of challenges and objectives.</p>

      <h3>Level 1</h3>
      <p>In Level 1, players are thrust into a dynamic environment with a countdown timer set at 15 seconds. The primary objective is to accumulate 50 points by shooting green boxes, each worth 5 points. However, players must navigate the level cautiously, as encountering orange boxes deducts 3 seconds from their remaining time.</p>
      <p>To aid players in their quest, white boxes occasionally appear, rewarding them with an additional 3 seconds. Level 1 serves as an introduction to the game mechanics and sets the stage for the escalating challenges of Level 2.</p>

      <h3>Level 2</h3>
      <p>Upon successfully reaching Level 2, players face a heightened level of difficulty as they strive to maximize their score within a limited timeframe. The gameplay dynamics remain consistent with Level 1, with players aiming to accrue as many points as possible by shooting green boxes.</p>
      <p>However, Level 2 introduces a higher level of challenge by decreasing the spawn rate of white boxes while increasing the appearance of yellow boxes. Yellow boxes present a unique challenge, requiring players to exercise caution, as they may hinder progress or impede scoring opportunities.</p>

      <h2>Challenges</h2>
      <ol>
        <li>
          <strong>Game Balancing:</strong> Achieving a delicate balance between difficulty and accessibility was paramount. Adjusting variables such as box spawn rates, point values, and time penalties ensured that the game provided a challenging yet rewarding experience for players of all skill levels.
        </li>
        <li>
          <strong>Level Progression:</strong> Designing a seamless transition from Level 1 to Level 2 required careful consideration of pacing and player engagement. Gradually increasing the level of challenge while maintaining continuity in gameplay mechanics ensured a smooth and immersive experience.
        </li>
        <li>
          <strong>Enemy Behavior:</strong> Implementing varied enemy behaviors, such as the erratic movement of yellow boxes, added depth and unpredictability to the gameplay. Balancing the frequency and intensity of enemy encounters kept players on their toes and heightened the sense of tension and excitement.
        </li>
        <li>
          <strong>User Feedback:</strong> Incorporating visual and auditory feedback mechanisms, such as score updates and sound effects, enhanced player immersion and engagement. Clear and intuitive feedback mechanisms allowed players to make informed decisions and react swiftly to changing circumstances.
        </li>
      </ol>

      <h2>Playing the Game</h2>
      <div className="text-center">
        <a href="https://simmer.io/@henrylamblog/~3e060bc9-96db-eee0-25cd-13388cceb169" target="_blank" rel="noopener noreferrer">
          <img src="/images/box.png" alt="Game Screenshot" className="mx-auto w-4/5 h-auto rounded-lg shadow-md" />
        </a>
        <br />
        <a href="https://simmer.io/@henrylamblog/~3e060bc9-96db-eee0-25cd-13388cceb169" target="_blank" rel="noopener noreferrer" className="text-xl font-bold">Play 3D Box Shooter</a>
      </div>

      <p></p>
      <h2>Reflecting on the Journey</h2>
      <p>As I reflect on the journey of creating 3D Box Shooter, I am reminded of the immense learning and growth that accompanied each stage of development. From grappling with complex scripting concepts to refining the game's visual and auditory elements, every challenge served as a stepping stone towards mastery in game development.</p>
    </BlogPostLayout>
  );
}
