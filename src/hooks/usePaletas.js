import { useState, useEffect } from 'react';
import { fetchInitialPaletas } from '../api/paletasService';

function usePaletas(getAllEscenas) {
    const [paletas, setPaletas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialPaletas, setInitialPaletas] = useState([]);

    useEffect(() => {
        async function loadPaletas() {
            try {
                const storedPaletas = JSON.parse(localStorage.getItem('paletas'));
                if (storedPaletas) {
                    setPaletas(storedPaletas);
                } else {
                    const data = await fetchInitialPaletas();
                    setPaletas(data);
                    setInitialPaletas(data);
                    localStorage.setItem('paletas', JSON.stringify(data));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadPaletas();
    }, []);

    const addPaleta = (newPaleta) => {
        const updatedPaletas = [...paletas, newPaleta];
        setPaletas(updatedPaletas);
        localStorage.setItem('paletas', JSON.stringify(updatedPaletas));
    };

    const removePaleta = (paletaName) => {
        const allEscenas = getAllEscenas();
        const paletaExists = paletas.some(p => p.nombre === paletaName);
        
        if (!paletaExists) {
            alert(`La paleta con nombre "${paletaName}" no existe.`);
            return;
        }

        const isPaletaInUse = allEscenas.some(escena => escena.getPalette.nombre === paletaName);

        if (isPaletaInUse) {
            alert('No se pueden eliminar las paletas que han sido elegidas como paletas principales en alguna escena.');
            return;
        }

        const updatedPaletas = paletas.filter(p => p.nombre !== paletaName || initialPaletas.some(ip => ip.nombre === p.nombre));
        setPaletas(updatedPaletas);
        localStorage.setItem('paletas', JSON.stringify(updatedPaletas));
    };

    return { paletas, loading, error, addPaleta, removePaleta };
}

export default usePaletas;
