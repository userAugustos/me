import './wave.css'
import { Gradient } from '../../hooks/gradient.js'
import {useEffect, useRef} from "react";
import {useThemeContext} from "../../hooks/theme.tsx";

export function Wave() {
  const canvas = useRef<HTMLCanvasElement>(null);

  const {theme} = useThemeContext();

  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient()
  }, [ theme])

  return (
    <div className="waves">
      <canvas id="gradient-canvas" data-transition-in={true} ref={canvas}/>
    </div>
  )
}
