import { useState, useEffect } from 'react';
import Proyecto from '../class/Proyecto';
import Escena from '../class/Escena';

function useProyectos() {
    const [proyectos, setProyectos] = useState([]);

    const proyectoEnEdicion = (nombreProyecto) =>{
        return proyectos.find(p => p.getNombre === nombreProyecto);
    };

    useEffect(() => {
        const storedProyectos = JSON.parse(localStorage.getItem('proyectos')) || [];

        const deserializedProyectos = storedProyectos.map(p => new Proyecto(
            p._id, p._nombre, p._tamaño, p._fechaCreacion, new Escena(
                p._escena._proyecto, p._escena._nombre, p._escena._pixeles,
                p._escena._palette, p._escena._paletas
            ), p._escenas.map(e => new Escena(e._proyecto, e._nombre, e._pixeles, e._palette, e._paletas))
        ));

        setProyectos(deserializedProyectos);
    }, []);

    const addProyecto = (proyecto) => {
        const updatedProyectos = [...proyectos, proyecto];
        setProyectos(updatedProyectos);
        localStorage.setItem('proyectos', JSON.stringify(updatedProyectos));
    };

    const addEscena = (nombreProyecto, nuevaEscena) => {
        const updatedProyectos = proyectos.map(proyecto => {
            if (proyecto.getNombre === nombreProyecto) {
                proyecto._escenas.push(nuevaEscena);
            }
            return proyecto;
        });
        setProyectos(updatedProyectos);
        localStorage.setItem('proyectos', JSON.stringify(updatedProyectos));
    };

    const removeProyecto = (nombreProyecto) => {
        const proyectoToRemove = proyectos.find(p => p.getNombre === nombreProyecto);
        if (!proyectoToRemove) {
            alert('Proyecto no encontrado');
            return;
        }

        const confirmation = window.prompt(`Escriba el nombre del proyecto "${nombreProyecto}" para confirmar la eliminación:`);
        if (confirmation !== nombreProyecto) {
            alert('El nombre del proyecto no coincide o la acción fue cancelada.');
            return;
        }

        const updatedProyectos = proyectos.filter(p => p.getNombre !== nombreProyecto);

        setProyectos(updatedProyectos);
        localStorage.setItem('proyectos', JSON.stringify(updatedProyectos));

        alert('Proyecto eliminado con éxito.');
    };

    const removeEscena = (nombreProyecto, nombreEscena) => {
        const updatedProyectos = proyectos.map(proyecto => {
            if (proyecto.getNombre === nombreProyecto) {
                proyecto._escenas = proyecto._escenas.filter(escena => escena.getNombre !== nombreEscena);
            }
            return proyecto;
        });
        setProyectos(updatedProyectos);
        localStorage.setItem('proyectos', JSON.stringify(updatedProyectos));
    };
    
    const getAllEscenas = () => {
        return proyectos.flatMap(proyecto => proyecto.getEscenas);
    };

    return { proyectos, proyectoEnEdicion, addProyecto, addEscena, removeProyecto, removeEscena, getAllEscenas };
}

export default useProyectos;
