import Escena from './Escena';

class Proyecto {
    constructor(id, nombre, tamaño, fechaCreacion, escena, escenas) {
        this._id = id;
        this._nombre = nombre;
        this._tamaño = tamaño;
        this._fechaCreacion = fechaCreacion;
        this._escena = escena;
        this._escenas = escenas.map(e => new Escena(e._proyecto, e._nombre, e._pixeles, e._palette, e._paletas));
    }

    get getId() {
        return this._id;
    }

    get getNombre() {
        return this._nombre;
    }

    get getTamaño() {
        return this._tamaño;
    }

    get getFechaCreacion() {
        return this._fechaCreacion;
    }

    get getEscena() {
        return this._escena;
    }
    get getEscenas() {
        return this._escenas;
    }

    setNombre(nombre) {
        this._nombre = nombre;
    }

    setTamaño(tamaño) {
        this._tamaño = tamaño;
    }

    setFechaCreacion(fechaCreacion) {
        this._fechaCreacion = fechaCreacion;
    }
}

export default Proyecto;
