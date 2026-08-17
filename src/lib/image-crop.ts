// Utilidad de recorte de imagen a partir del área en píxeles que devuelve
// react-easy-crop (`onCropComplete`) — dibuja solo esa región en un canvas
// cuadrado y lo exporta como Blob. Vive fuera del componente porque no
// depende de React y así queda reutilizable si otra parte del proyecto
// necesita recorte de imagen a futuro (hoy solo la usa el favicon del
// panel admin, ver FormularioFavicon.tsx / RecortadorFavicon.tsx).

export interface AreaPixeles {
  x: number;
  y: number;
  width: number;
  height: number;
}

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    img.src = src;
  });
}

// Favicon no necesita más resolución que esto — cap explícito para no
// terminar subiendo un PNG de varios MB solo porque el original era una
// foto de alta resolución.
const LADO_MAXIMO = 512;

// Siempre exporta PNG, sin importar el formato original (incluye SVG:
// rasterizarlo acá es aceptable porque un favicon de pestaña se ve a 16-32px
// de todas formas, y mantiene consistente el resto del flujo de subida —
// una sola extensión que manejar en vez de preservar cada formato posible).
export async function recortarImagenAFavicon(imageSrc: string, area: AreaPixeles): Promise<Blob> {
  const imagen = await cargarImagen(imageSrc);
  const lado = Math.min(area.width, area.height, LADO_MAXIMO);

  const canvas = document.createElement("canvas");
  canvas.width = lado;
  canvas.height = lado;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo preparar el recorte.");

  ctx.drawImage(imagen, area.x, area.y, area.width, area.height, 0, 0, lado, lado);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("No se pudo generar la imagen recortada."))), "image/png", 0.92);
  });
}
