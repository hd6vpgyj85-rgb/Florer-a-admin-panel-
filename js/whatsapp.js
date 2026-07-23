/**
 * Helpers para generar mensajes y enlaces de WhatsApp (wa.me).
 */
window.WhatsApp = (function () {
  function numero() {
    const n = (window.APP_CONFIG && window.APP_CONFIG.WHATSAPP_NUMBER) || "";
    return n.replace(/[^0-9]/g, "");
  }

  function formatearPrecio(precio) {
    const valor = Number(precio) || 0;
    return valor.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  }

  function construirEnlace(mensaje) {
    const tel = numero();
    const texto = encodeURIComponent(mensaje);
    return `https://wa.me/${tel}?text=${texto}`;
  }

  function abrir(mensaje) {
    const url = construirEnlace(mensaje);
    window.open(url, "_blank", "noopener");
  }

  function mensajeCotizacion({ nombre, telefono, descripcion }) {
    return (
      `Hola, me gustaría cotizar un ramo.\n\n` +
      `Nombre: ${nombre}\n` +
      `Teléfono: ${telefono}\n` +
      `Descripción: ${descripcion}`
    );
  }

  const ENTREGA_LABELS = {
    envio: "Envío a domicilio",
    recoger: "Recoger en tienda",
    punto_medio: "Punto medio",
  };

  function mensajeCheckout({ productoNombre, precio, nombreCliente, telefono, tipoEntrega, direccion }) {
    const entregaLabel = ENTREGA_LABELS[tipoEntrega] || tipoEntrega;
    let mensaje =
      `Hola, quiero confirmar mi pedido.\n\n` +
      `Producto: ${productoNombre}\n` +
      `Precio: ${formatearPrecio(precio)}\n` +
      `Nombre: ${nombreCliente}\n` +
      `Teléfono: ${telefono}\n` +
      `Tipo de entrega: ${entregaLabel}\n`;

    if (tipoEntrega === "envio") {
      mensaje += `Dirección: ${direccion}\n`;
    } else if (tipoEntrega === "punto_medio") {
      mensaje += `Punto de encuentro: ${direccion}\n`;
    }

    return mensaje;
  }

  return { construirEnlace, abrir, mensajeCotizacion, mensajeCheckout, formatearPrecio };
})();
