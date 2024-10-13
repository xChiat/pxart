class Escena {
    constructor(proyecto, nombre, pixeles, palette, paletas) {
        this._proyecto = proyecto;
        this._nombre = nombre;
        this._pixeles = pixeles;
        this._palette = palette;
        this._paletas = paletas;
    }

    get getProyecto() {
        return this._proyecto;
    }
    get getNombre() {
        return this._nombre;
    }

    get getPixeles() {
        return this._pixeles + ' x ' + this._pixeles + ' pixels';
    }

    get getPalette() {
        return this._palette;
    }
    get getPaletas() {
        return this._paletas;
    }

    setProyecto(proyecto) {
        this._proyecto = proyecto;
    }
    setNombre(nombre) {
        this._nombre = nombre;
    }

    setPixeles(pixeles) {
        this._pixeles = pixeles;
    }

    set setPalette(palette) {
        this._palette = palette;
    }
    setPaletas(paletas) {
        this._paletas = paletas;
    }
}

export default Escena;
