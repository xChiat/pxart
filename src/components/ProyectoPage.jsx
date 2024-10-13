import React, { useEffect, useState } from 'react';
import Header from './Header';

function ProyectoPage() {
    const [proyecto, setProyecto] = useState(null);
    const [paletas, setPaletas] = useState([]);
    const [colorSeleccionado, setColorSeleccionado] = useState('');
    const [paletaSeleccionada, setPaletaSeleccionada] = useState(null);
    const [escenaActual, setEscenaActual] = useState(null);

    useEffect(() => {
        try {
            const proyectoEnEdicion = localStorage.getItem('proyectoEnEdicion');
            const storedPaletas = localStorage.getItem('paletas');
            if (proyectoEnEdicion) {
                const parsedProyecto = JSON.parse(proyectoEnEdicion);
                setProyecto(parsedProyecto);
                setEscenaActual(parsedProyecto._escena); // Escena inicial por defecto
                setPaletaSeleccionada(parsedProyecto._escena._paletas[0]); // Paleta inicial por defecto
                setColorSeleccionado(parsedProyecto._escena._paletas[0].colores[0]);
            } else {
                console.error("No project found in localStorage");
            }
            if (storedPaletas) {
                const parsedPaletas = JSON.parse(storedPaletas);
                setPaletas(parsedPaletas);
            } else {
                console.error("No palettes found in localStorage");
            }
        } catch (error) {
            console.error("Failed to parse project or palettes from localStorage:", error);
        }
    }, []);

    if (!proyecto || !escenaActual) return <div>Loading...</div>;

    const dimensiones = escenaActual._pixeles;

    const handleColorClick = (color) => {
        setColorSeleccionado(color);
    };

    const handleCellClick = (e) => {
        e.target.style.backgroundColor = colorSeleccionado;
    };

    const handlePaletaClick = (paleta) => {
        setPaletaSeleccionada(paleta);
        setColorSeleccionado(paleta.colores[0]); // Cambiar al primer color de la paleta seleccionada
    };

    const handleEscenaClick = (escena) => {
        setEscenaActual(escena);
        setPaletaSeleccionada(escena._paletas[0]);
        setColorSeleccionado(escena._paletas[0].colores[0]);
    };

    const renderGrid = (dimensiones) => {
        let rows = [];
        for (let i = 0; i < dimensiones; i++) {
            let row = [];
            for (let j = 0; j < dimensiones; j++) {
                row.push(<div key={`${i}-${j}`} className="grid-cell" onClick={handleCellClick}></div>);
            }
            rows.push(<div key={i} className="grid-row">{row}</div>);
        }
        return rows;
    };

    return (
        <div className="container-xxl text-center">
            <div className='row'>
                <Header/>
            </div>
            <div className="row">
                <div className="col-2">
                    <div className='result' onClick={() => handleEscenaClick(proyecto._escena)} style={{ cursor: 'pointer' }}>
                        <h5>Escenas</h5>
                        <p>{proyecto._escena._nombre} - {proyecto._escena._pixeles} x {proyecto._escena._pixeles} pixels</p>
                    </div>
                    {proyecto._escenas.slice(1).map((escena, index) => (
                        <div key={index} className='result' onClick={() => handleEscenaClick(escena)} style={{ cursor: 'pointer' }}>
                            <p>{escena._nombre} - {escena._pixeles} x {escena._pixeles} pixels</p>
                        </div>
                    ))}
                </div>
                <div className="col-8">
                    <div className='cuadricula'>
                        <h5>{escenaActual._nombre}</h5>
                        <div className="grid-container">
                            {renderGrid(dimensiones)}
                        </div>
                        <div className='mt-3'>
                            <h5>Escoger color para pintar</h5>
                            {paletaSeleccionada && paletaSeleccionada.colores.map((color, index) => (
                                <span
                                    key={index}
                                    style={{
                                        backgroundColor: color,
                                        width: '20px',
                                        height: '20px',
                                        display: 'inline-block',
                                        marginRight: '5px',
                                        cursor: 'pointer',
                                        border: color === colorSeleccionado ? '2px solid black' : 'none'
                                    }}
                                    onClick={() => handleColorClick(color)}
                                ></span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className='result'>
                        <h5>Paleta Inicial</h5>
                        {proyecto._escena._paletas[0].colores.map((color, index) => (
                            <span
                                key={index}
                                style={{
                                    backgroundColor: color,
                                    width: '20px',
                                    height: '20px',
                                    display: 'inline-block',
                                    marginRight: '5px',
                                }}
                            ></span>
                        ))}
                    </div>
                    <div className='result'>
                        <h5 className="mt-3">Todas las Paletas</h5>
                        {paletas.map((paleta, paletaIndex) => (
                            <div key={paletaIndex} onClick={() => handlePaletaClick(paleta)} style={{ cursor: 'pointer' }}>
                                <hr />
                                <h6>{paleta.nombre}</h6>
                                {paleta.colores.map((color, colorIndex) => (
                                    <span
                                        key={colorIndex}
                                        style={{
                                            backgroundColor: color,
                                            width: '20px',
                                            height: '20px',
                                            display: 'inline-block',
                                            marginRight: '5px',
                                        }}
                                    ></span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProyectoPage;