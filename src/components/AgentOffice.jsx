import { useEffect, useRef, useState } from "react";
import { mount } from "../office/agentOffice";

/**
 * "The office" on the AI agent team page: an animated scene of the
 * agents, Siggi and Alan Isaac the cat, with a live list of what
 * everyone is doing. Just for fun, not connected to the real work.
 * The scene itself lives in office/agentOffice.js.
 */
export default function AgentOffice() {
  const stageRef = useRef(null);
  const legendRef = useRef(null);
  const officeRef = useRef(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    // Visitors who prefer less motion get a still frame and a Play button
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const office = mount(stageRef.current, { legend: legendRef.current, paused: reduce });
    if (reduce) office.simulate(20);
    officeRef.current = office;
    setRunning(office.running);
    // On phones the scene scrolls sideways; start in the middle
    const scroller = stageRef.current.parentElement;
    requestAnimationFrame(() => {
      scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;
    });
    return () => office.destroy();
  }, []);

  const toggle = () => {
    const office = officeRef.current;
    if (!office) return;
    if (office.running) office.pause();
    else office.play();
    setRunning(office.running);
  };

  return (
    <>
      <div className="office-stage">
        <div className="office-scroll">
          <div className="office-canvas" ref={stageRef} />
        </div>
        <button
          type="button"
          className="office-toggle"
          onClick={toggle}
        >
          {running ? "Pause" : "Play"}
        </button>
      </div>
      <p className="office-hint">Swipe sideways to see the whole office.</p>
      <ul className="office-legend" ref={legendRef} aria-label="What everyone is doing right now" />
    </>
  );
}
