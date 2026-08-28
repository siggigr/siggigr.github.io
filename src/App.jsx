import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Professional from "./sections/Professional";
import Interests from "./sections/Interests";
import Family from "./sections/Family";
import Pets from "./sections/Pets";
import Apps from "./sections/Apps";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <main id="main" className="page">
        <Hero />
        <About />
        <Family />
        <Professional />
        <Interests />
        <Pets />
        <Apps />
      </main>
      <Footer />
    </>
  );
}
