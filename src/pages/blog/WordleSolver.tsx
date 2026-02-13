import { useEffect, useRef } from 'react';
import BlogPostLayout from '../../components/BlogPostLayout';

export default function WordleSolver() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    const loadChart = async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      if (cancelled || !chartRef.current) return;

      // Destroy previous instance if it exists
      if (chartInstanceRef.current) {
        (chartInstanceRef.current as InstanceType<typeof Chart>).destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['1', '2', '3', '4', '5', '6', 'X'],
          datasets: [
            {
              label: 'Human',
              data: [0.02, 5.67, 22.66, 33.10, 23.91, 11.72, 2.92],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'ADIEU',
              data: [0, 3.46, 30.02, 42.25, 17.88, 4.84, 1.56],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'SALET',
              data: [0, 6.39, 36.67, 38.66, 13.61, 3.59, 1.08],
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
            {
              label: 'RAISE/CLOUT/NYMPH',
              data: [0.043, 0.043, 0.043, 78.19, 18.49, 2.76, 0.431],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 20,
              },
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
    <BlogPostLayout relatedSlugs={['immersive-ball-shooter', 'maze-game-implementing-bfs-algorithm', 'assembling-iphone-from-parts']}>
      <h1>Unraveling the Mechanics of Wordle: A Comprehensive Analysis of Greedy Search Algorithms</h1>

      <p>Brain teaser games have always captivated the minds of players, and <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer">Wordle</a> is no exception. Developed by Josh Wardle and Palak Shah, Wordle quickly gained popularity due to its simplicity, community-driven nature, and addictive gameplay. In this blog post, we explore the rise of Wordle, its gameplay mechanics, and how we employed artificial intelligence agents and algorithms to beat Wordle.</p>

      <h2>The Rise of Wordle</h2>
      <p>Wordle, the beloved online word game sensation, traces its origins to the classic pen-and-paper game known as <a href="http://jotto.augiehill.com/single-directions.jsp" target="_blank" rel="noopener noreferrer">Jotto</a>. In Jotto, players engage in a battle of wits, with one player tasked with concealing a secret word while the other attempts to decipher it. Similar to Wordle's dynamic, each incorrect guess in Jotto prompts the word's keeper to mark a large sheet with red, while every correct guess earns a green mark. This playful exchange of guesses and deductions has captivated players for generations, laying the groundwork for the digital phenomenon that Wordle has become today.</p>

      <div className="relative w-full aspect-video">
        <iframe className="absolute inset-0 w-full h-full rounded-lg" src="https://www.youtube.com/embed/38gklfz0SQo?si=mxF_-00HwC1lJ7db" frameBorder="0" allowFullScreen title="Wordle Video" />
      </div>
      <p></p>
      <p>Another inspiration for the game is the television show, <a href="https://en.wikipedia.org/wiki/Lingo_(American_game_show)" target="_blank" rel="noopener noreferrer">Lingo</a>, which started in 1987. On the show, two teams of two individuals each went head to head to fill an entire sheet with five letter words using partial clues and letters. Similar to Wordle, if the team failed to guess the word in 5 tries, they lost.</p>

      <h2>Understanding Wordle</h2>
      <img src="/images/wordle.jpg" alt="Wordle" className="mx-auto rounded-lg shadow-md max-w-full" />
      <p>Players aim to guess a five-letter word in six tries or fewer. Each guess provides feedback in the form of color-coded categories: gray letters (not present in the final word), yellow letters (present but in different positions), and green letters (correctly positioned).</p>

      <h2>Wordle for AI</h2>
      <p>In Wordle, each five-letter word represents a potential state, and the goal for an artificial intelligence agent is to find the hidden state, which is the target word. While humans can choose their starting word, the agent is provided with a specified starting word. Although there are 12,966 possible states, only 2,315 are allowed to be goal states, known as the answer list. While restricting the agent to only visit goal states simplifies the task, exploring non-goal states can provide valuable information about letter positions. This setup allows for the problem to be solved using a local search algorithm, even when the goal state is unknown.</p>

      <h2>Understanding Heuristic Functions</h2>
      <p>When humans play Wordle, they use the feedback from previous guesses—green for correct letters in the right position, yellow for correct letters in the wrong position, and gray for incorrect letters—to narrow down the potential words. Similarly, AI agents employ heuristic functions, assigning weights to potential guesses based on prior information. These functions guide the AI in selecting the most promising words, aiming to minimize the number of guesses required to uncover the hidden word.</p>

      <h2>The General Algorithm</h2>
      <p>Try Wordle Solver yourself on Github: <a href="https://github.com/HenryLamBlog/Wordle-Solver" target="_blank" rel="noopener noreferrer">https://github.com/HenryLamBlog/Wordle-Solver</a></p>

      <p>The AI solver operates with a clear objective: given a starting word and a specified heuristic, find the sequence of guesses leading to the hidden word. The algorithm maintains three key lists:</p>

      <ul>
        <li><strong>Green: </strong>Records correct letters in the correct positions.</li>
        <li><strong>Yellow:</strong> Tracks correct letters in incorrect positions.</li>
        <li><strong>Gray:</strong> Marks incorrect letters.</li>
      </ul>

      <p>Additionally, a list stores each guessed word to track the progress towards the solution.</p>

      <h2>The Solving Process</h2>
      <p><strong>Initialization:</strong> The solver starts with the seed word and updates the lists accordingly for the first hidden word.</p>
      <p><strong>Guess Selection:</strong> The AI generates a list of potential guess words ordered by their heuristic value.</p>
      <p><strong>Guess Evaluation:</strong></p>
      <ul>
        <li>Words containing letters from the gray list are skipped.</li>
        <li>Words conflicting with the yellow list are skipped.</li>
        <li>Words lacking green letters in specified positions are skipped.</li>
        <li>The word with the highest heuristic value meeting criteria is chosen.</li>
      </ul>
      <p><strong>Update Lists:</strong> Upon selecting a guess, the lists are updated, and the process repeats until the hidden word is found.</p>

      <h2>Achieving Success</h2>
      <p>After each guess, the program checks if the hidden word is among the guesses. If found, the program prints the sequence of guesses leading to the solution. The process continues for all hidden words, providing a comprehensive solution list.</p>

      <h2>Experimental Setup</h2>
      <ul>
        <li><strong>Solver Development:</strong> Adapted from a base program by GitHub user aAa1928, our Greedy Best-First Search solver employs a heuristic-based approach, only expanding nodes with green and yellow letters.</li>
        <li><strong>Comparison Bots:</strong> We compare our Greedy Best-First Search solver against Doddle, Jon Paris's Wordle bot, and The New York Times's Wordle bot, each using different algorithms.</li>
        <li><strong>Human Comparison:</strong> Leveraging data from six million Wordle games and analysis on start word trends, we compare the Greedy Best-First Search solver's performance against human players.</li>
        <li><strong>State Space Reduction:</strong> We examine the impact of searching all allowed words versus only answer words on the Greedy Best-First Search solver's efficiency.</li>
      </ul>

      <h2>Experiment Design</h2>
      <ol>
        <li><strong>Solver Comparison:</strong> Each solver is provided the same answer list and allowed to guess from all valid words. Tests include using optimal start words "SALET," "RAISE," "CLOUT," and "NYMPH."</li>
        <li><strong>Comparison Against Human Players:</strong> The Greedy Best-First Search solver's performance is compared to human success rates and trends in start word choices.</li>
        <li><strong>State Space Reduction Analysis:</strong> We evaluate the solver's performance when limited to answer words versus all allowed words.</li>
      </ol>

      <h2>Results</h2>

      <h3>Average Number of Guesses</h3>
      <table>
        <tbody>
          <tr><th>Solver</th><th>Average Guesses</th><th>% Correct</th></tr>
          <tr><td>Doddle Entropy</td><td>3.430</td><td>100</td></tr>
          <tr><td>Doddle Minimax</td><td>3.481</td><td>100</td></tr>
          <tr><td>Jon Paris, Easy</td><td>3.426</td><td>100</td></tr>
          <tr><td>Jon Paris, Hard</td><td>3.506</td><td>99.91</td></tr>
          <tr><td>Greedy, answers</td><td>3.747</td><td>98.92</td></tr>
          <tr><td>Greedy, all words</td><td>4.518</td><td>93.05</td></tr>
          <tr><td>Greedy, answers 3 seed words</td><td>4.251</td><td>99.56</td></tr>
          <tr><td>Greedy, all words 3 seed words</td><td>4.583</td><td>97.41</td></tr>
        </tbody>
      </table>

      <p>The comparison of average guesses among different Wordle solvers sheds light on the efficacy of various strategies and algorithms in tackling the game's challenges. Doddle's algorithms and Jon Paris's easy mode solver demonstrate exceptional performance, consistently solving Wordles in five guesses or fewer. Conversely, the greedy best-first search algorithm, particularly when considering all allowed words as potential states, displays inferior performance, often requiring four or more guesses on average. Interestingly, employing three seed words instead of one, such as "RAISE," "CLOUT," and "NYMPH," introduces a slight impact on performance, with a marginally higher average number of guesses but potentially better success rates within six guesses. This variation underscores the importance of strategy selection and algorithmic approach in optimizing Wordle-solving techniques.</p>

      <table>
        <tbody>
          <tr><th>Guess</th><th>Greedy, all</th><th>Greedy, answers</th><th>NYTimes Bot</th></tr>
          <tr><td>1</td><td>SALET</td><td>SALET</td><td>CRANE</td></tr>
          <tr><td>2</td><td>REALO</td><td>LEARN</td><td>PETAL</td></tr>
          <tr><td>3</td><td>ALINE</td><td>IDEAL</td><td>BLEAK</td></tr>
          <tr><td>4</td><td>ULEMA</td><td>GLEAM</td><td>GLEAM</td></tr>
          <tr><td>5</td><td>GLEAM</td><td></td><td></td></tr>
        </tbody>
      </table>

      <p>Comparing the greedy algorithm to The New York Times's Wordle bot reveals comparable performance, with both typically solving Wordles in about four guesses. This parity suggests the effectiveness of the greedy approach employed by both solvers in efficiently navigating the Wordle space. Additionally, the comparison highlights the strategic choices made by human players, such as starting with words like "ADIEU" or "SALET," and their impact on solving efficiency. While the common strategy among human players and solvers is to minimize the number of guesses until a solution is reached, the analysis suggests that certain starting words may lead to suboptimal outcomes. Overall, these findings provide valuable insights into the dynamics of Wordle-solving strategies and the interplay between algorithmic efficiency and human intuition in tackling the game's challenges.</p>

      <h3>Computation Speed</h3>
      <p>The computation speed was not initially considered a metric for comparing Wordle agents but was added since most solvers had this functionality built-in. Doddle's minimax algorithm was the fastest, taking 19 seconds, likely due to its decision tree-based approach. Doddle's entropy algorithm took 44 seconds, using Shannon entropy to make branches. Jon Paris's easy solver took three minutes and six seconds, while the hard mode solver took six minutes and fourteen seconds, using the A* algorithm on a graph with edges based on entropy.</p>
      <p>In contrast, the greedy function developed here performed relatively poorly. When restricted to goal states, it took over three minutes for "SALET" and "RAISE," "CLOUT," and "NYMPH." Running on all allowed words increased the time to over an hour. This inefficiency stemmed from generating a new search list for each of the 2,315 words. Optimizing the greedy function by structuring it like Doddle and Jon Paris's solvers, with decision trees for each option, could dramatically reduce runtime.</p>

      <h3>Comparison against a Human Player</h3>
      <canvas ref={chartRef} id="myChart" />
      <p className="text-sm text-center text-text-muted italic">Percent Success Rates of a Human Player Compared to a Greedy Solver using "ADIEU", "SALET", or "RAISE", "CLOUT" and "NYMPH" as seed word(s). 'X' represents failure.</p>
      <p>Comparing the greedy algorithm's performance in Wordle to human players reveals insights into strategy effectiveness and player behavior. While human players often choose suboptimal starting words like "ADIEU," the algorithm demonstrates adaptability to such choices, albeit with slightly reduced efficiency. This highlights players' tendencies towards casual play and suboptimal choices. However, prioritizing optimal starting words significantly improves success rates, solving nearly eighty percent of Wordles by the fourth guess with minimal failure.</p>

      <h2>Analysis</h2>
      <p>The analysis of the experiment results reveals several key findings regarding the performance of the greedy best-first search algorithm compared to other Wordle solvers and human players.</p>
      <p>Firstly, in terms of average number of guesses, the greedy best-first solver performed relatively poorly compared to other algorithms, especially when using all allowed words as the problem states. This suggests that limiting the problem states to just the goal states can prevent the algorithm from getting trapped into taking suboptimal next states.</p>
      <p>Computation speed was another important factor, with Doddle's algorithms being the fastest due to their efficient approach of generating the entire game tree. The greedy best-first search algorithm, on the other hand, had longer computation times, especially when using all allowed words as problem states.</p>
      <p>Comparing the algorithm's performance against human players revealed that while it performed better than some common human strategies like starting with "ADIEU," it still fell short of optimal performance. However, the algorithm's ability to consistently find solutions within a relatively low number of guesses suggests its potential for aiding human players in solving Wordle puzzles.</p>
      <p>Overall, while the greedy best-first search algorithm shows promise as a Wordle solver, there are areas for improvement, such as optimizing computation speed and refining the heuristic function used to select next states. Additionally, exploring alternative approaches, such as using decision trees or entropy-based heuristics, could further enhance the algorithm's performance.</p>

      <h2>Conclusion:</h2>
      <p>The findings suggest that the optimized Wordle bots investigated outperform general human performance, as they are less prone to missteps and have access to more comprehensive information about the state space. While it's possible that there are individuals capable of achieving better results than any of the bots analyzed here, the aggregate data indicates that, on average, these bots excel at solving Wordle compared to humans.</p>
      <p>Moving forward, there are several directions for future research. Experimenting with different algorithms, particularly ones that allow for playing in easy mode and are not restricted on guesses, could be fruitful. An entropy-based approach, similar to what is commonly used in other Wordle bots, could be explored further. Additionally, investigating Wordle agents for non-five letter words, such as four-letter or six-letter words, could provide interesting insights. Extending the algorithm developed here to handle these variations would likely be straightforward, with the main requirement being generating appropriate guess lists and answer lists.</p>
      <p>Overall, as algorithms continue to improve beyond the capabilities of human thinking, it will be intriguing to see what further optimizations and advancements are made in the realm of Wordle bots.</p>
      <p>You can read our written report <a href="https://drive.google.com/file/d/18VxgSmZc0HdcNSMGIbbIPCLgCo4KV-l0/view?usp=drive_link" target="_blank" rel="noopener noreferrer">here</a>.</p>
    </BlogPostLayout>
  );
}
