export async function fetchInitialPaletas() {
    const response = await fetch('http://localhost/p1c1/Paletas.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.map(paleta => ({
        ...paleta,
        colores: paleta.colores || []
    }));
}