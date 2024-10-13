import React, { useState, useEffect } from 'react';
import useProyectos from '../hooks/useProyectos';
import usePaletas from '../hooks/usePaletas';
import { useNavigate } from 'react-router-dom';
import Proyecto from '../class/Proyecto';
import Escena from '../class/Escena';

function ProyectoComponent() {
    const { proyectos, addProyecto, removeProyecto } = useProyectos();
    const { paletas } = usePaletas();
    const [nombre, setNombre] = useState('');
    const [tamaño, setTamaño] = useState('');
    const [palette, setPalette] = useState('');
    const [nombreEliminar, setNombreEliminar] = useState('');
    const [nombreBuscar, setNombreBuscar] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchNotFound, setSearchNotFound] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showTamañoAlert, setShowTamañoAlert] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsFormValid(nombre !== '' && tamaño >= 2 && tamaño <= 30 && palette !== '');
        setShowTamañoAlert((tamaño < 2 || tamaño > 30) && tamaño !== '');
    }, [nombre, tamaño, palette]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const nombreExistente = proyectos.some(p => p.getNombre.toLowerCase() === nombre.toLowerCase());
        if (nombreExistente) {
            alert('Ya existe un proyecto con este nombre.');
            return;
        }

        const id = proyectos.length + 1;
        const fechaCreacion = new Date().toLocaleString();
        const selectedPalette = paletas.find(p => p.nombre === palette);
        const escenaInicial = new Escena(nombre, nombre, tamaño, selectedPalette, [selectedPalette]);
        const nuevoProyecto = new Proyecto(id, nombre, tamaño, fechaCreacion, escenaInicial, [escenaInicial]);

        addProyecto(nuevoProyecto);

        setNombre('');
        setTamaño('');
        setPalette('');
    };

    const handleDeleteSubmit = (event) => {
        event.preventDefault();
        removeProyecto(nombreEliminar);
        setNombreEliminar('');
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const result = proyectos.find(p => p.getNombre.toLowerCase() === nombreBuscar.toLowerCase());
        if (result) {
            setSearchResult(result);
            setSearchNotFound(false);
        } else {
            setSearchResult(null);
            setSearchNotFound(true);
        }
    };

    const handleProyectoClick = (nombreProyecto) => {
        const proyecto = proyectos.find(p => p.getNombre === nombreProyecto);
        if (proyecto) {
            localStorage.setItem('proyectoEnEdicion', JSON.stringify(proyecto));
            navigate('/proyecto');
        }
    };

    return (
        <div className='container'>
            <div className='header'>
                <img src={`${process.env.PUBLIC_URL}/blinkiesCafe-cf.gif`} className="img-fluid" alt="..."/>
            </div>
            <div className='container-sm'>
                <div className="contenedor">
                    <h4>Crear Proyecto</h4>
                    <form onSubmit={handleSubmit}>
                        <div className='input-group mb-3'>
                            <input
                                className="form-control"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Nombre del proyecto"
                            />
                            <input
                                className="form-control"
                                type="number"
                                value={tamaño}
                                onChange={(e) => setTamaño(Number(e.target.value))}
                                placeholder="Tamaño"
                            />
                        </div>
                        {showTamañoAlert && (
                            <div className="alert alert-danger" role="alert">
                                El tamaño del proyecto debe estar entre 2 y 30.
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
                        <button type="submit" className="btn btn-secondary mt-3" disabled={!isFormValid}>Crear Proyecto</button>
                    </form>
                    
                    <h4>Eliminar Proyecto</h4>
                    <form onSubmit={handleDeleteSubmit}>
                        <div className='form-floating mb-3'>
                            <input
                                className="form-control"
                                type="text"
                                value={nombreEliminar}
                                onChange={(e) => setNombreEliminar(e.target.value)}
                                placeholder="Nombre del proyecto a eliminar"
                            />
                            <label htmlFor="floatingInput">Nombre del proyecto a eliminar</label>
                        </div>
                        <button type="submit" className="btn btn-danger mt-3">Eliminar Proyecto</button>
                    </form>
                    
                    <h4>Buscar Proyecto</h4>
                    <form onSubmit={handleSearchSubmit}>
                        <div className='form-floating mb-3'>
                            <input
                                className="form-control"
                                type="text"
                                value={nombreBuscar}
                                onChange={(e) => setNombreBuscar(e.target.value)}
                                placeholder="Nombre del proyecto a buscar"
                            />
                            <label htmlFor="floatingInput">Nombre del proyecto a buscar</label>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">Buscar Proyecto</button>
                    </form>
                    
                    {searchResult ? (
                        <div className="mt-3 result">
                            <h5>Resultado de la búsqueda:</h5>
                            <span>
                                <strong>ID:</strong> {searchResult.getId} <br />
                                <strong>Nombre:</strong> {searchResult.getNombre} <br />
                                <strong>Tamaño:</strong> {searchResult.getTamaño} <br />
                                <strong>Fecha Creación:</strong> {searchResult.getFechaCreacion} <br />
                                <strong>Escena Principal:</strong> {searchResult.getEscena.getNombre} <br />
                                <strong>Resolución:</strong> {searchResult.getEscena.getPixeles} <br />
                                <strong>Paleta de Colores Principal:</strong> 
                                {searchResult.getEscena.getPaletas[0].colores.map((color, index) => (
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
                            </span>
                        </div>
                    ) : (
                        searchNotFound && <div className="mt-3"><h5>Proyecto Inexistente</h5></div>
                    )}
    
                    <h4>Proyectos</h4>
                    <table className="table mt-4">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Tamaño</th>
                                <th scope="col">Fecha Creación</th>
                                <th scope="col">Escena Principal</th>
                                <th scope="col">Paleta de Colores Principal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proyectos.map((proyecto) => (
                                <tr key={proyecto.getId}>
                                    <td>{proyecto.getId}</td>
                                    <td>
                                        <button
                                            className='btn btn-link'
                                            onClick={() => handleProyectoClick(proyecto.getNombre)}
                                        >
                                            {proyecto.getNombre}
                                        </button>
                                    </td>
                                    <td>{proyecto.getTamaño}</td>
                                    <td>{proyecto.getFechaCreacion}</td>
                                    <td>
                                        {proyecto.getEscena ? (
                                            <>
                                                Escena: {proyecto.getEscena.getNombre} <br />
                                                Resolución: {proyecto.getEscena.getPixeles}
                                            </>
                                        ) : (
                                            "Sin Escena"
                                        )}
                                    </td>
                                    <td>
                                        {proyecto.getEscena && proyecto.getEscena.getPaletas ? (
                                            proyecto.getEscena.getPaletas[0].colores.map((color, index) => (
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
                                            ))
                                        ) : (
                                            "Sin Paleta"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProyectoComponent;
