import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import PageLoader from './components/PageLoader';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import PageTransition from './components/PageTransition';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import {
  WordleSolver,
  ImmersiveBallShooter,
  ColorizationOfGrayscaleImages,
  MazeGameBfs,
  AssemblingIphone,
  DistinguishingMasks,
  RobotControlledVehicle,
  BoxShooterGame,
  RollerMadness,
  CarbonCreditTokenization,
  FashionAssistant,
  SearchEngine,
} from './pages/blog';

/**
 * Exported route configuration so property tests (task 7.2) can verify
 * that every known slug maps to a valid component.
 */
export const blogRoutes: { slug: string; component: React.ComponentType }[] = [
  { slug: 'wordle-solver', component: WordleSolver },
  { slug: 'immersive-ball-shooter', component: ImmersiveBallShooter },
  { slug: 'colorization-of-grayscale-images', component: ColorizationOfGrayscaleImages },
  { slug: 'maze-game-implementing-bfs-algorithm', component: MazeGameBfs },
  { slug: 'assembling-iphone-from-parts', component: AssemblingIphone },
  { slug: 'distinguishing-people-with-masks', component: DistinguishingMasks },
  { slug: 'robot-controlled-vehicle', component: RobotControlledVehicle },
  { slug: '3d-box-shooter-game', component: BoxShooterGame },
  { slug: 'roller-madness', component: RollerMadness },
  { slug: 'carbon-credit-tokenization', component: CarbonCreditTokenization },
  { slug: 'fashion-assistant', component: FashionAssistant },
  { slug: 'search-engine', component: SearchEngine },
];

function App() {
  const location = useLocation();

  return (
    <>
      <PageLoader />
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
          {blogRoutes.map(({ slug, component: Component }) => (
            <Route key={slug} path={`/${slug}`} element={<PageTransition><ErrorBoundary><Component /></ErrorBoundary></PageTransition>} />
          ))}
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}

export default App;
