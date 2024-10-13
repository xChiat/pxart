import React, { useState, useEffect } from 'react';
import useProyectos from '../hooks/useProyectos';
import usePaletas from '../hooks/usePaletas';

import Escena from '../class/Escena';

function EscenaComponent() {
    const { proyectos, addEscena, removeEscena } = useProyectos();
    const { paletas } = usePaletas();
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [nombreEscena, setNombreEscena] = useState('');
    const [tamaño, setTamaño] = useState('');
    const [palette, setPalette] = useState('');
    const [nombreEscenaEliminar, setNombreEscenaEliminar] = useState('');
    const [nombreProyectoEliminar, setNombreProyectoEliminar] = useState('');
    const [nombreProyectoBuscar, setNombreProyectoBuscar] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [showProyectoAlert, setShowProyectoAlert] = useState(false);
    const [showNombreAlert, setShowNombreAlert] = useState(false);
    const [showTamañoAlert, setShowTamañoAlert] = useState(false);
    const [showEliminarAlert, setShowEliminarAlert] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [searchNotFound, setSearchNotFound] = useState(false);

    useEffect(() => {
        const isProyectoValid = proyectos.some(p => p.getNombre.toLowerCase() === nombreProyecto.toLowerCase());
        const isNombreValid = nombreEscena !== '' && nombreEscena.toLowerCase() !== nombreProyecto.toLowerCase();
        const isTamañoValid = tamaño >= 2 && tamaño <= 30;
        const isPaletteValid = palette !== '';

        setIsFormValid(isProyectoValid && isNombreValid && isTamañoValid && isPaletteValid);

        setShowProyectoAlert(!isProyectoValid && nombreProyecto !== '');
        setShowNombreAlert(nombreEscena.toLowerCase() === nombreProyecto.toLowerCase() && nombreEscena !== '');
        setShowTamañoAlert((tamaño < 2 || tamaño > 30) && tamaño !== '');
    }, [nombreProyecto, nombreEscena, tamaño, palette, proyectos]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const proyecto = proyectos.find(p => p.getNombre.toLowerCase() === nombreProyecto.toLowerCase());
        if (!proyecto) {
            setShowProyectoAlert(true);
            return;
        }

        if (nombreEscena.toLowerCase() === nombreProyecto.toLowerCase()) {
            setShowNombreAlert(true);
            return;
        }

        if (tamaño < 2 || tamaño > 30) {
            setShowTamañoAlert(true);
            return;
        }

        const selectedPalette = paletas.find(p => p.nombre === palette);
        const nuevaEscena = new Escena(proyecto.getNombre, nombreEscena, tamaño, selectedPalette, [selectedPalette]);

        addEscena(proyecto.getNombre, nuevaEscena);

        setNombreProyecto('');
        setNombreEscena('');
        setTamaño('');
        setPalette('');
    };

    const handleDeleteSubmit = (event) => {
        event.preventDefault();

        const proyecto = proyectos.find(p => p.getNombre.toLowerCase() === nombreProyectoEliminar.toLowerCase());
        if (!proyecto) {
            setShowProyectoAlert(true);
            return;
        }

        if (nombreEscenaEliminar.toLowerCase() === nombreProyectoEliminar.toLowerCase()) {
            setShowEliminarAlert(true);
            return;
        }

        removeEscena(nombreProyectoEliminar, nombreEscenaEliminar);

        setNombreProyectoEliminar('');
        setNombreEscenaEliminar('');
        alert('Eliminación de escena exitosa.');
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const proyecto = proyectos.find(p => p.getNombre.toLowerCase() === nombreProyectoBuscar.toLowerCase());
        if (proyecto) {
            setSearchResult(proyecto.getEscenas);
            setSearchNotFound(false);
        } else {
            setSearchResult(null);
            setSearchNotFound(true);
        }
    };

    return (
        <div className='container'>
            <div className='container-sm'>
                <div className="contenedor">
                    <h4>Agregar Escena</h4>
                    <form onSubmit={handleSubmit}>
                        <div className='input-group mb-3'>
                            <input
                                className="form-control"
                                type="text"
                                value={nombreProyecto}
                                onChange={(e) => setNombreProyecto(e.target.value)}
                                placeholder="Nombre del proyecto"
                            />
                            <input
                                className="form-control"
                                type="text"
                                value={nombreEscena}
                                onChange={(e) => setNombreEscena(e.target.value)}
                                placeholder="Nombre de la escena"
                            />
                            <input
                                className="form-control"
                                type="number"
                                value={tamaño}
                                onChange={(e) => setTamaño(Number(e.target.value))}
                                placeholder="Tamaño"
                            />
                        </div>
                        {showProyectoAlert && (
                            <div className="alert alert-danger" role="alert">
                                El nombre del proyecto no existe.
                            </div>
                        )}
                        {showNombreAlert && (
                            <div className="alert alert-danger" role="alert">
                                El nombre de la escena no puede ser igual al nombre del proyecto.
                            </div>
                        )}
                        {showTamañoAlert && (
                            <div className="alert alert-danger" role="alert">
                                El tamaño de la escena debe estar entre 2 y 30.
                            </div>
                        )}
                        <div className='form-floating mb-3'>
                            <select
                                className="form-select"
                                value={palette}
                                onChange={(e) => setPalette(e.target.value)}
                            >
                                <option value="" disabled>Seleccione una paleta</option>
                                {paletas.map((paleta, index) => (
                                    <option key={index} value={paleta.nombre}>
                                        {paleta.nombre}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="palette">Paleta inicial</label>
                        </div>
                        {palette && (
                            <div className='mt-3'>
                                <h5>Colores de la paleta seleccionada:</h5>
                                <div>
                                    {paletas.find(p => p.nombre === palette).colores.map((color, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                backgroundColor: color,
                                                width: '15px',
                                                height: '15px',
                                                display: 'inline-block',
                                                marginLeft: '5px',
                                            }}
                                        ></span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button type="submit" className="btn btn-secondary mt-3" disabled={!isFormValid}>Agregar Escena</button>
                    </form>

                    <h4>Eliminar Escena</h4>
                    <form onSubmit={handleDeleteSubmit}>
                        <div className='input-group mb-3'>
                            <input
                                className="form-control"
                                type="text"
                                value={nombreProyectoEliminar}
                                onChange={(e) => setNombreProyectoEliminar(e.target.value)}
                                placeholder="Nombre del proyecto"
                            />
                            <input
                                className="form-control"
                                type="text"
                                value={nombreEscenaEliminar}
                                onChange={(e) => setNombreEscenaEliminar(e.target.value)}
                                placeholder="Nombre de la escena"
                            />
                        </div>
                        {showEliminarAlert && (
                            <div className="alert alert-danger" role="alert">
                                No se puede eliminar la escena principal del proyecto.
                            </div>
                        )}
                        <button type="submit" className="btn btn-danger mt-3">Eliminar Escena</button>
                    </form>

                    <h4>Buscar Escenas por Proyecto</h4>
                    <form onSubmit={handleSearchSubmit}>
                        <div className='form-floating mb-3'>
                            <input
                                className="form-control"
                                type="text"
                                value={nombreProyectoBuscar}
                                onChange={(e) => setNombreProyectoBuscar(e.target.value)}
                                placeholder="Nombre del proyecto a buscar"
                            />
                            <label htmlFor="floatingInput">Nombre del proyecto a buscar</label>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">Buscar</button>
                    </form>

                    {searchResult ? (
                        <div className="mt-3 result">
                            <h5>Resultado de la búsqueda:</h5>
                            {searchResult.map((escena, index) => (
                                <div key={index}>
                                    <span>
                                        <strong>Nombre:</strong> {escena.getNombre} <br />
                                        <strong>Dimensiones:</strong> {escena.getPixeles} <br />
                                        <strong>Paleta inicial:</strong> {escena.getPalette ? escena.getPalette.nombre : "Sin Paleta"} <br />
                                        <strong>Colores de la paleta:</strong>
                                        {escena.getPalette && escena.getPalette.colores ? (
                                            escena.getPalette.colores.map((color, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        backgroundColor: color,
                                                        width: '15px',
                                                        height: '15px',
                                                        display: 'inline-block',
                                                        marginLeft: '5px',
                                                    }}
                                                ></span>
                                            ))
                                        ) : (
                                            "Sin Paleta"
                                        )}
                                    </span>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    ) : (
                        searchNotFound && <div className="mt-3"><h5>No existe ningún proyecto con ese nombre</h5></div>
                    )}

                    <h4>Escenas</h4>
                    <table className="table mt-4">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">Proyecto</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Dimensiones</th>
                                <th scope="col">Paleta inicial</th>
                                <th scope="col">Colores de la paleta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proyectos.map((proyecto) => (
                                proyecto.getEscenas.map((escena, index) => (
                                    <tr key={index}>
                                        <td>{escena.getProyecto}</td>
                                        <td>{escena.getNombre}</td>
                                        <td>{escena.getPixeles}</td>
                                        <td>{escena.getPalette ? escena.getPalette.nombre : "Sin Paleta"}</td>
                                        <td>
                                            {escena.getPalette && escena.getPalette.colores ? (
                                                escena.getPalette.colores.map((color, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            backgroundColor: color,
                                                            width: '15px',
                                                            height: '15px',
                                                            display: 'inline-block',
                                                            marginLeft: '5px',
                                                        }}
                                                    ></span>
                                                ))
                                            ) : (
                                                "Sin Paleta"
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EscenaComponent;