class Paleta {
    constructor(nombre, colores) {
        this._nombre = nombre;
        this._colores = colores;
    }

    get getNombre() {
        return this._nombre;
    }

    get getColores() {
        return this._colores;
    }

    setNombre(nombre) {
        this._nombre = nombre;
    }

    setColores(colores) {
        this._colores = colores;
    }
}
export default Paleta;