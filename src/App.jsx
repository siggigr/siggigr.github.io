import Rail from "./components/Rail";
import ProfileCard from "./components/ProfileCard";
import Footer from "./components/Footer";
import Intro from "./sections/Intro";
import About from "./sections/About";
import Professional from "./sections/Professional";
import Interests from "./sections/Interests";
import Family from "./sections/Family";
import Pets from "./sections/Pets";
import Apps from "./sections/Apps";

/**
 * Dark profile layout: icon rail | sticky profile card | content panel.
 */
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="shell" id="top">
        <Rail />
        <ProfileCard />
        <div className="panel">
          <main id="main">
            <Intro />
            <About />
            <Family />
            <Professional />
            <Interests />
            <Pets />
            <Apps />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
