import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style/index.css'
import {ThemeProvider} from "./hooks/theme.tsx";
import { Home } from "@pages/home"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider>
            <Home />
        </ThemeProvider>
    </React.StrictMode>,
)
