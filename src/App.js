import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProyectoComponent from './components/ProyectoComponent';
import EscenaComponent from './components/EscenaComponent';
import PaletaComponent from './components/PaletaComponent';
import ProyectoPage from './components/ProyectoPage'; // Nueva página para proyectos

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<div><ProyectoComponent /><EscenaComponent /><PaletaComponent/></div>} />
                <Route path="/proyecto" element={<ProyectoPage />} />
            </Routes>
        </Router>
    );
}

export default App;