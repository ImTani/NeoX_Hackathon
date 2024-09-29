// src/App.js
import React from 'react';
import LandingPage from './components/LandingPage';
import { Toaster } from "@/components/ui/toaster"

function App() {
    return (
        <div className="App">
            <LandingPage />
            <Toaster />
        </div>
    );
}

export default App;