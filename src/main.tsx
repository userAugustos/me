import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { register } from "swiper/element/bundle";
import {ThemeProvider} from "./hooks/theme.tsx";
import '@styles/themeSwitcher.css'
import 'swiper/css';
import 'swiper/css/bundle'
import '@styles/index.css'

register();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider>
            <App/>
        </ThemeProvider>
    </React.StrictMode>,
)
