const tasasYComisiones = {
  pasarela_pago: {
    nombre: "Pasarela de Pago",
    bbva: {
      nombre: "BBVA",
      tarjetas_credito: { nombre: "Tarjetas de Crédito y Débito Locales", tasa: 0, comisionOP: 3.49, igvComision: 18 },
      tarjetas_foraneas: { nombre: "Tarjetas del Extranjero", tasa: 0, comisionOP: 3.99, igvComision: 18 },
      pagos_alternativos: { nombre: "Pagos con Efectivo", tasa: 0, comisionOP: 3.4, igvComision: 18 },
    },
    otros_bancos: {
      nombre: "Otros Bancos",
      tarjetas_credito: { nombre: "Tarjetas de Crédito y Débito Locales", tasa: 1, comisionOP: 3.79, igvComision: 18 },
      tarjetas_foraneas: { nombre: "Tarjetas del Extranjero", tasa: 1, comisionOP: 4.45, igvComision: 18 },
      pagos_alternativos: { nombre: "Pagos con Efectivo", tasa: 0, comisionOP: 3.79, igvComision: 18 },
    },
  },
  link_pago: {
    nombre: "Link de Pago",
    bbva: {
      nombre: "BBVA",
      tarjetas_credito: { nombre: "Tarjetas de Crédito y Débito Locales", tasa: 0, comisionOP: 3.49, igvComision: 18 },
      tarjetas_foraneas: { nombre: "Tarjetas del Extranjero", tasa: 0, comisionOP: 3.99, igvComision: 18 },
      pagos_alternativos: { nombre: "Pagos con Efectivo", tasa: 0, comisionOP: 3.4, igvComision: 18 },
    },
    otros_bancos: {
      nombre: "Otros Bancos",
      tarjetas_credito: { nombre: "Tarjetas de Crédito y Débito Locales", tasa: 1, comisionOP: 3.79, igvComision: 18 },
      tarjetas_foraneas: { tasa: 1, comisionOP: 4.45, igvComision: 18 },
      pagos_alternativos: { nombre: "Pagos con Efectivo", tasa: 0, comisionOP: 3.79, igvComision: 18 },
    },
  },
  smart_pos: {
    nombre: "Openpay Smart",
    bbva: {
      nombre: "BBVA",
      tarjetas_credito: { nombre: "Tarjetas de Crédito y Débito Locales", tasa: 0, comisionOP: 3.39, igvComision: 0 },
      tarjetas_foraneas: { nombre: "Tarjetas del Extranjero", tasa: 0, comisionOP: 3.99, igvComision: 0 },
    },
  },
  openpay_mini: {
    nombre: "Openpay Mini",
    bbva: {
      nombre: "BBVA",
      tarjetas_credito: { nombre: "Tarjetas de Crédito y Débito Locales", tasa: 0, comisionOP: 2.99, igvComision: 18 },
      tarjetas_foraneas: { nombre: "Tarjetas del Extranjero", tasa: 0, comisionOP: 2.99, igvComision: 18 },
    },
  },
};

window.tasasYComisiones = tasasYComisiones;
