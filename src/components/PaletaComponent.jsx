import React, { useState, useEffect } from 'react';
import useProyectos from '../hooks/useProyectos';
import usePaletas from '../hooks/usePaletas';

function PaletaComponent() {
    const { proyectos, getAllEscenas } = useProyectos();
    const { paletas, loading, error, addPaleta, removePaleta } = usePaletas(getAllEscenas);
    const [newPaleta, setNewPaleta] = useState({ nombre: '', colores: ['', '', '', '', ''] });
    const [isFormValid, setIsFormValid] = useState(false);
    const [paletaToDelete, setPaletaToDelete] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchNotFound, setSearchNotFound] = useState(false);

    useEffect(() => {
        validateForm();
    }, [newPaleta]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isFormValid) {
            addPaleta(newPaleta);
            setNewPaleta({ nombre: '', colores: ['', '', '', '', ''] }); // Reset form after submission
        }
    };

    const handleDeleteSubmit = (event) => {
        event.preventDefault();
        if (paletaToDelete) {
            removePaleta(paletaToDelete);
            setPaletaToDelete(''); // Reset form after deletion
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const result = paletas.find(p => p.nombre.toLowerCase() === searchTerm.toLowerCase());
        if (result) {
            setSearchResult(result);
            setSearchNotFound(false);
        } else {
            setSearchResult(null);
            setSearchNotFound(true);
        }
    };

    const handleColorChange = (index, value) => {
        const updatedColors = [...newPaleta.colores];
        updatedColors[index] = value;
        setNewPaleta({ ...newPaleta, colores: updatedColors });
    };

    const validateForm = () => {
        const hexColorRegex = /^#([0-9A-F]{6}|[0-9A-F]{8})$/i; // Ajustado para aceptar colores RGBA en hexadecimal
        const areAllColorsValid = newPaleta.colores.every(color => hexColorRegex.test(color));
        const isNameValid = newPaleta.nombre.trim() !== '';
        setIsFormValid(areAllColorsValid && isNameValid);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='container'>
            <div className='container-sm'>
                <div className="contenedor">
                    <h4>Agregar Paletas</h4>
                    <form onSubmit={handleSubmit}>
                        <div className='form-floating mb-3'>
                            <input
                                className="form-control"
                                type="text"
                                value={newPaleta.nombre}
                                onChange={(e) => setNewPaleta({ ...newPaleta, nombre: e.target.value })}
                                placeholder="Nombre de la paleta"
                            />
                            <label htmlFor="floatingInput">Nombre de la paleta</label>
                        </div>
                        <div className="input-group">
                            <span className="input-group-text">Agregar Colores</span>
                            {newPaleta.colores.map((color, index) => (
                                <input
                                    key={index}
                                    className="form-control"
                                    type="text"
                                    value={color}
                                    onChange={(e) => handleColorChange(index, e.target.value)}
                                    placeholder={`Color ${index + 1}`}
                                />
                            ))}
                        </div>
                        <button type="submit" className="btn btn-secondary mt-3" disabled={!isFormValid}>Add Paleta</button>
                    </form>
                        
                    <h4>Eliminar Paleta</h4>
                    <form onSubmit={handleDeleteSubmit}>
                        <div className='form-floating mb-3'>
                            <input
                                className="form-control"
                                type="text"
                                value={paletaToDelete}
                                onChange={(e) => setPaletaToDelete(e.target.value)}
                                placeholder="Nombre de la paleta a eliminar"
                            />
                            <label htmlFor="floatingInput">Nombre de la paleta a eliminar</label>
                        </div>
                        <button type="submit" className="btn btn-danger mt-3">Eliminar Paleta</button>
                    </form> 
                        
                    <h4>Buscar Paleta</h4>
                    <form onSubmit={handleSearchSubmit}>
                        <div className='form-floating mb-3'>
                            <input
                                className="form-control"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Nombre de la paleta a buscar"
                            />
                            <label htmlFor="floatingInput">Nombre de la paleta a buscar</label>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">Buscar Paleta</button>
                    </form>
                    
                    {searchResult ? (
                        <div className="mt-3 result">
                            <h5>Resultado de la búsqueda:</h5>
                            <span>
                                <strong>Nombre: </strong> {searchResult.nombre}
                                <br />
                                <strong>Colores: </strong>
                                {searchResult.colores.map((color, index) => (
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
                        searchNotFound && <div className="mt-3"><h5>Paleta Inexistente</h5></div>
                    )}

                    <table className="table mt-4">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Colores de la paleta</th>
                            </tr>
                        </thead>
                        <tbody id="p-table-body">
                            {paletas.map((p, paletaIndex) => (
                                <tr key={`${p.nombre}-${paletaIndex}`}>
                                    <td>{p.nombre}</td>
                                    <td>
                                        {(p.colores || []).map((color, colorIndex) => (
                                            <span
                                                key={`${p.nombre}-${colorIndex}`}
                                                style={{
                                                    backgroundColor: color,
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'inline-block',
                                                    marginRight: '5px',
                                                }}
                                            ></span>
                                        ))}
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

export default PaletaComponent;
