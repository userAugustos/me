import {Nav} from "@components/nav/nav";
import {Hero} from "@components/hero/hero.tsx";
import {Wave} from "@components/wave/wave.tsx";
import {ProjectTracker} from "@components/projectTracker/projectTracker.tsx";

function App() {
  return (
    <>
      <Nav/>
      <Hero/>
      <Wave/>
      <ProjectTracker/>
      <div className="blank"></div>
    </>
  );
}

export default App;
