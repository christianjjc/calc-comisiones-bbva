let Global_Producto = "";
let Global_Cliente = "";
let Global_Metodo_Pago = "";

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
      tarjetas_foraneas: { nombre: "Tarjetas del Extranjero", tasa: 1, comisionOP: 4.45, igvComision: 18 },
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

function convierteADosDecimales(valor) {
  let numeroRedondeado = Math.round(valor * 100) / 100;
  let numeroFormateado = numeroRedondeado.toFixed(2);
  return numeroFormateado;
}

function soloNumerosYPuntos(controlTexto) {
  const miInput = document.getElementById(controlTexto);
  miInput.addEventListener("input", function (e) {
    const inputValue = e.target.value;
    const valorFormateado = inputValue.replace(/[^0-9.]/g, "");
    e.target.value = valorFormateado;
  });
}

const validaDatoNumerico = (numero) => {
  let valoresAceptados = /^[0-9.]+$/;
  if (numero.toString().match(valoresAceptados)) {
    return true;
  } else {
    return false;
  }
};

function limparControles(level, claseControl) {
  const controles = document.getElementsByClassName(claseControl);
  for (let i = level; i < controles.length; i++) {
    const control = controles[i];
    switch (control.tagName) {
      case "SELECT":
        control.innerHTML = "";
        break;
      case "INPUT":
        if (control.type === "text" || control.type === "number") {
          control.value = "";
          control.textContent = "";
          control.text = "";
        }
        break;
      case "LABEL":
        control.textContent = "S/0";
        break;
    }
  }
}

function llenaCombo(objeto, combo, primeaOpcion) {
  const cmb = document.getElementById(combo);
  cmb.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = primeaOpcion;
  cmb.appendChild(opt);
  const productosArray = Object.keys(objeto);
  for (let i = 0; i < productosArray.length; i++) {
    const opt = document.createElement("option");
    const cmbValue = productosArray[i];
    if (cmbValue.toLowerCase() == "nombre") {
    } else {
      opt.value = cmbValue;
      opt.textContent = objeto[productosArray[i]].nombre;
      cmb.appendChild(opt);
    }
  }
}

function showHideControl(mostrar, idNodo) {
  const nodo = document.getElementById(idNodo);
  if (mostrar) {
    nodo.classList.remove("control-oculto");
  } else {
    nodo.classList.add("control-oculto");
  }
}

function cargarControles(level, cmbAusar, divArray, inicioArray, divMostrar, cmbcargar, primeaOpcion) {
  const cmb = document.getElementById(cmbAusar);
  cmb.addEventListener("change", () => {
    const valor = cmb.value;
    // Los niveles son los de anidacion del objeto array 'tasasYComisiones'
    if (level == 1) {
      Global_Producto = valor;
      Global_Cliente = "";
      Global_Metodo_Pago = "";
    } else if (level == 2) {
      Global_Cliente = valor;
      Global_Metodo_Pago = "";
    } else if (level == 3) {
      Global_Metodo_Pago = valor;
    }
    limparControles(level, "controlopciones");
    switch (valor) {
      case "":
        const combos = document.getElementsByClassName(divArray);
        for (let i = inicioArray; i < combos.length; i++) {
          showHideControl(false, combos[i].id);
        }
        break;
      default:
        showHideControl(true, divMostrar);
        if (primeaOpcion.length > 0) {
          // Los niveles son los de anidacion del objeto array 'tasasYComisiones'
          if (level == 1) {
            llenaCombo(tasasYComisiones[valor], cmbcargar, primeaOpcion);
          } else if (level == 2) {
            llenaCombo(tasasYComisiones[Global_Producto][valor], cmbcargar, primeaOpcion);
          } else if (level == 3) {
            llenaCombo(tasasYComisiones[Global_Producto][Global_Cliente][valor], cmbcargar, primeaOpcion);
          }
        }
        break;
    }
  });
}

function calcularMontoRecibir() {
  const montoIngresado = document.getElementById("txtmontopagar").value;
  const comisionOP = tasasYComisiones[Global_Producto][Global_Cliente][Global_Metodo_Pago].comisionOP;
  const igvComision = tasasYComisiones[Global_Producto][Global_Cliente][Global_Metodo_Pago].igvComision;
  const tasa = tasasYComisiones[Global_Producto][Global_Cliente][Global_Metodo_Pago].tasa;
  let comisionOpenPay = montoIngresado * (comisionOP / 100);
  let subComision = comisionOpenPay + tasa;
  let subCob = subComision * (igvComision / 100);
  let comisionTotal = subComision + subCob;
  let recibiras = montoIngresado - comisionTotal;
  return recibiras;
}

const lblMontoRecibir = document.getElementById("lblMontoRecibir");
const txtmontopagar = document.getElementById("txtmontopagar");
txtmontopagar.addEventListener("input", (e) => {
  const inputValue = e.target.value;
  if (inputValue.trim() === "") {
    lblMontoRecibir.textContent = "S/ 0.00";
  } else {
    if (validaDatoNumerico(inputValue)) {
      const valorFormateado = inputValue.replace(/[^0-9.]/g, "");
      e.target.value = valorFormateado;
      let montoArecibir = calcularMontoRecibir();
      montoArecibir = !isNaN(montoArecibir) ? convierteADosDecimales(montoArecibir) : "0.00";
      lblMontoRecibir.textContent = "S/ " + montoArecibir;
    }
  }
  e.preventDefault();
});

llenaCombo(tasasYComisiones, "cmbproductos", "¿Qué producto necesitas?");
cargarControles(1, "cmbproductos", "divopciones", 1, "bancos", "cmbbancos", "¿Eres cliente?");
cargarControles(2, "cmbbancos", "divopciones", 2, "metodospago", "cmbmetodospago", "Método de pago");
cargarControles(3, "cmbmetodospago", "divopciones", 3, "monto_pagar", "", "");
soloNumerosYPuntos("txtmontopagar");
