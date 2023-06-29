import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@styles/index.css'
import '@styles/themeSwitcher.css'
import {ThemeProvider} from "./hooks/theme.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider>
            <App/>
        </ThemeProvider>
    </React.StrictMode>,
)
