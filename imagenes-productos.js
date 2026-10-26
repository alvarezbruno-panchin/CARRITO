const imagenesPorNombre = [
  { terminos: ["agua mineral", "agua"], archivo: "agua.jpg" },
  { terminos: ["alfajor oreo", "alfajor", "alfajoro"], archivo: "alfajoro.jpg" },
  { terminos: ["beldent", "chicle"], archivo: "beldent.jpg" },
  { terminos: ["bon o bon", "bonobon"], archivo: "bon o bon.jpg" },
  { terminos: ["chocolate milka", "chocolate"], archivo: "chocolate.jpg" },
  { terminos: ["cococola", "coca cola", "coca", "gaseosa cola"], archivo: "coca.jpg" },
  { terminos: ["galletitas oreo", "oreo"], archivo: "oreos.jpg" },
  { terminos: ["papas lays", "papa", "papas", "snack"], archivo: "papas.jpg" },
  { terminos: ["energizante speed", "speed", "energizante"], archivo: "speed.jpg" },
  { terminos: ["caramelo sugus", "sugus"], archivo: "sugus.jpg" }
];

const normalizarTexto = valor => String(valor || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

export const imagenDelProducto = producto => {
  const nombre = normalizarTexto(producto?.nombre);
  const coincidencia = imagenesPorNombre.find(({ terminos }) =>
    terminos.some(termino => nombre.includes(normalizarTexto(termino)))
  );
  return coincidencia ? `./imagenes/${encodeURIComponent(coincidencia.archivo)}` : "";
};

export const completarImagenProducto = producto => {
  const imagenLocal = imagenDelProducto(producto);
  if (imagenLocal) return { ...producto, imagen: imagenLocal };

  const imagenRemota = String(producto?.imagen || "").trim();
  const imagenValida = imagenRemota && !/^(tele\.jpg)$/i.test(imagenRemota)
    ? imagenRemota
    : "./imagenes/producto-generico.svg";

  return { ...producto, imagen: imagenValida };
};
