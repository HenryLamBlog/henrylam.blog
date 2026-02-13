import { useEffect, useRef } from 'react';
import BlogPostLayout from '../../components/BlogPostLayout';

export default function MazeGameBfs() {
  const burndownRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    const loadChart = async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      if (cancelled || !burndownRef.current) return;

      if (chartInstanceRef.current) {
        (chartInstanceRef.current as InstanceType<typeof Chart>).destroy();
      }

      const ctx = burndownRef.current.getContext('2d');
      if (!ctx) return;

      const burndownData = [
        200, 190, 180, 180, 160, 150, 140, 130, 130, 130, 130, 120, 120, 110, 110, 110, 110, 100, 100, 100,
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 95,
        90, 85, 85, 85, 85, 80, 70, 70, 65, 65, 60, 60, 60, 60, 50, 40, 30, 20, 10, 0,
      ];

      const totalDaysInSprint = 60;
      const idealHoursPerDay = burndownData[0] / totalDaysInSprint;

      const labels = Array.from({ length: totalDaysInSprint }, (_, i) => `Day ${i + 1}`);
      const idealData = Array.from({ length: totalDaysInSprint }, (_, index) =>
        Math.round(burndownData[0] - idealHoursPerDay * (index + 1))
      );

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Burndown',
              data: burndownData,
              fill: false,
              borderColor: '#FF9000',
              backgroundColor: '#FF9000',
              tension: 0,
            },
            {
              label: 'Ideal',
              borderColor: '#6C8893',
              backgroundColor: '#6C8893',
              tension: 0,
              borderDash: [5, 5],
              fill: false,
              data: idealData,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 80,
                color: 'black',
              },
            },
          },
          scales: {
            y: {
              min: 0,
              max: Math.round(burndownData[0] * 1.1),
            },
          },
        },
      });
    };

    loadChart();

    return () => {
      cancelled = true;
      if (chartInstanceRef.current) {
        (chartInstanceRef.current as { destroy: () => void }).destroy();
      }
    };
  }, []);

  return (
    <BlogPostLayout relatedSlugs={['robot-controlled-vehicle', 'assembling-iphone-from-parts', '3d-box-shooter-game']}>
      <h1>Maze Game implementing BFS algorithm</h1>
      <h2>Introduction to the Tom and Jerry Maze Game</h2>
      <p>"Tom and Jerry" is an iconic American cartoon film that chronicles the endless pursuit of a hapless cat, Tom, after a clever and spunky mouse named Jerry. Bringing the excitement of this classic chase to life, this fun project is inspired by the timeless rivalry between Jerry and Tom.</p>
      <p>Here's how the game works:</p>
      <ol>
        <li><strong>Objective:</strong> Your goal as Jerry is to reach the exit of the maze before Tom catches you.</li>
        <li><strong>Maze Structure:</strong> The maze is represented as a grid of interconnected pathways and barriers, reminiscent of the chaotic environment in the classic cartoon series.</li>
        <li><strong>Tom's Strategy:</strong> Tom uses the Breadth-First Search (BFS) algorithm to constantly calculate the shortest path to reach Jerry. You'll need to outsmart him by finding alternate routes and using clever tactics to stay one step ahead.</li>
        <li><strong>Your Controls:</strong> Use the arrow keys or WASD keys to move Jerry up, down, left, or right through the maze.</li>
        <li><strong>Gameplay:</strong> Navigate through the maze, avoiding dead ends and obstacles, to reach the exit marked by a green square. If Tom catches you before reaching the exit, you lose the game.</li>
        <li><strong>Victory:</strong> If you successfully reach the exit before Tom catches you, you'll be greeted with a congratulatory message, celebrating your victory over the wily cat.</li>
      </ol>
      <p>Are you ready to embark on this thrilling adventure and outwit Tom in a race against time? Let the maze games begin!</p>

      <h2>Key Features and Functionalities</h2>
      <h3>Main Menu</h3>
      <p>Upon launching the game, the main menu consists of name tags, a picture of Tom and Jerry, and buttons to access different functionalities.</p>
      <img src="/images/main_menu.png" alt="Main Menu" className="mx-auto rounded-lg shadow-md max-w-full" />
      <p className="text-sm text-center text-text-muted italic">Main Menu</p>
      <ul>
        <li><strong>Open Maze:</strong> Launches the maze editor.</li>
        <li><strong>Shortest Path:</strong> Highlights the shortest path in the maze.</li>
        <li><strong>Maze Game:</strong> Launches the maze game.</li>
      </ul>

      <h3>Maze Editor</h3>
      <img src="/images/maze_editor.png" alt="Maze Editor" className="mx-auto rounded-lg shadow-md max-w-full" />
      <p className="text-sm text-center text-text-muted italic">Maze Editor</p>
      <p>The maze editor allows users to customize the maze grid, set entry and exit points, and perform actions like generating a new maze, saving, and finding a path.</p>

      <h3>Shortest Path</h3>
      <img src="/images/short_path.png" alt="Shortest Path" className="mx-auto rounded-lg shadow-md max-w-full" />
      <p className="text-sm text-center text-text-muted italic">Shortest Path</p>
      <p>This feature highlights the shortest path in the maze and provides a visual representation of the solution.</p>

      <h3>Maze Game</h3>
      <img src="/images/maze_game.png" alt="Maze Game" className="mx-auto rounded-lg shadow-md max-w-full" />
      <p className="text-sm text-center text-text-muted italic">Maze Game</p>
      <p>In the maze game, players control Jerry and navigate through the maze using the arrow keys or WASD keys. The objective is to reach the exit while evading Tom's pursuit.</p>

      <h2>Play Maze Game</h2>
      <p>Enjoy the thrill of the escaping with Jerry from Tom in this fun maze game!</p>
      <p>You can find our code on GitHub: <a href="https://github.com/HenryLamBlog/Maze-Game">https://github.com/HenryLamBlog/Maze-Game</a></p>

      <h2>Summary of Project Meetings</h2>
      <h3>1st Project Scrum Meeting:</h3>
      <ul>
        <li>Date: September 28, 2023</li>
        <li>Duration: 1.5 hours</li>
        <li>Attending: Lee Tsz Kin, Chan Chun Yuen, Lam Hui Yin</li>
        <li>Actions:
          <ul>
            <li>Created Github accounts</li>
            <li>Connected to IntelliJ</li>
            <li>Assigned roles (Function A, B, C)</li>
            <li>Set goals for the upcoming week</li>
          </ul>
        </li>
        <li>Next Meeting: October 14, 2023</li>
      </ul>
      <h3>2nd Project Scrum Meeting:</h3>
      <ul>
        <li>Date: October 14, 2023</li>
        <li>Duration: 2 hours</li>
        <li>Attending: Lee Tsz Kin, Chan Chun Yuen, Lam Hui Yin</li>
        <li>Actions:
          <ul>
            <li>Completed data modeling and class diagrams</li>
            <li>Assigned tasks for next week</li>
            <li>Discussed implementation details and challenges</li>
          </ul>
        </li>
        <li>Next Meeting: October 22, 2023</li>
      </ul>
      <h3>3rd Project Scrum Meeting:</h3>
      <ul>
        <li>Date: October 22, 2023</li>
        <li>Duration: 2 hours</li>
        <li>Attending: Lee Tsz Kin, Chan Chun Yuen, Lam Hui Yin</li>
        <li>Actions:
          <ul>
            <li>Reviewed progress from the past week</li>
            <li>Discussed implementation details for each function</li>
            <li>Identified upcoming tasks and goals</li>
          </ul>
        </li>
        <li>Next Meeting: November 24, 2023</li>
      </ul>
      <h3>4th Project Scrum Meeting:</h3>
      <ul>
        <li>Date: November 24, 2023</li>
        <li>Duration: 2 hours</li>
        <li>Attending: Lee Tsz Kin, Chan Chun Yuen, Lam Hui Yin</li>
        <li>Actions:
          <ul>
            <li>Completed final implementation and bug fixes</li>
            <li>Prepared for the live demo and presentation</li>
            <li>Reviewed project progress and outcomes</li>
          </ul>
        </li>
        <li>No further meetings scheduled</li>
      </ul>

      <h2>Charts and Visualization</h2>
      <h3>Burndown Chart</h3>
      <div className="w-full">
        <canvas ref={burndownRef} id="burndownChart" />
      </div>

      <h2>Live Demo</h2>
      <p>Experience the Tom and Jerry Maze Game in action through our live demonstration:</p>
      <div className="relative w-full aspect-video">
        <iframe className="absolute inset-0 w-full h-full rounded-lg" src="https://www.youtube.com/embed/FYeezW40qag" frameBorder="0" allowFullScreen title="Maze Game Live Demo" />
      </div>
      <p></p>

      <h2>Conclusion</h2>
      <p>Embarking on this project has been an incredibly rewarding journey, blending nostalgia with the excitement of gaming. As we delved into the world of Tom and Jerry, we found ourselves immersed in the challenges and adventures of Jerry's escape from Tom's relentless pursuit.</p>
      <p>Throughout the development process, we not only built a fun and engaging game but also honed our skills as developers and collaborators. Planning the game involved meticulous detail, from designing the maze structures to implementing the Breadth-First Search algorithm for Tom's pursuit.</p>
      <p>Working as a group, we utilized tools like Gantt charts and Burndown charts to stay organized and meet our project milestones. Group meetings became opportunities to brainstorm ideas, troubleshoot challenges, and celebrate our progress. Additionally, leveraging GitHub as our version control system allowed us to collaborate seamlessly and learn valuable lessons in version control and collaboration.</p>
      <p>Overall, this project has been a testament to the power of teamwork, creativity, and a shared passion for gaming. It has not only provided us with practical coding experience but also allowed us to relive cherished memories from our favorite childhood cartoon. As we bid farewell to our Tom and Jerry Maze Game, we carry with us a sense of accomplishment and the knowledge gained from this enriching experience.</p>

      <h2>Group</h2>
      <ul>
        <li>Lee Tsz Kin</li>
        <li>Chan Chun Yuen</li>
        <li>Lam Hui Yin (Henry)</li>
      </ul>
    </BlogPostLayout>
  );
}
