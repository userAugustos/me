import './wave.css'
import { Gradient } from '../../hooks/gradient.js'
import {useEffect} from "react";

export function Wave() {

  const gradient = new Gradient();
  const dataTheme = document.documentElement.getAttribute('data-theme');

  useEffect(() => {
    // @ts-ignore
    gradient.initGradient('#gradient-canvas')
    console.debug(dataTheme)
  }, [dataTheme])

  return (
    <div className="waves">
      <canvas id="gradient-canvas" data-transition-in={true}/>
    </div>
  )
}
