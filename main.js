let Global_Producto = "";
let Global_Cliente = "";
let Global_Metodo_Pago = "";

function llenaCombo(objeto, combo, primeaOpcion) {
  const cmb = document.getElementById(combo);
  cmb.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "0";
  opt.textContent = primeaOpcion;
  cmb.appendChild(opt);
  const productosArray = Object.keys(objeto);
  for (let i = 0; i < productosArray.length; i++) {
    const opt = document.createElement("option");
    const cmbValue = productosArray[i];
    if (cmbValue.toLowerCase() == "nombre") {
    } else {
      opt.value = cmbValue;
      opt.textContent = objeto[`${productosArray[i]}`].nombre;
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
    // Los niveles son los del array
    if (level == 1) {
      Global_Producto = valor;
    } else if (level == 2) {
      Global_Cliente = valor;
    } else if (level == 3) {
      Global_Metodo_Pago = valor;
    }
    switch (valor) {
      case "0":
        const combos = document.getElementsByClassName(divArray);
        for (let i = inicioArray; i < combos.length; i++) {
          showHideControl(false, combos[i].id);
        }
        break;
      default:
        showHideControl(true, divMostrar);
        if (primeaOpcion.length > 0) {
          // Los niveles son los del array
          if (level == 1) {
            llenaCombo(tasasYComisiones[`${valor}`], cmbcargar, primeaOpcion);
          } else if (level == 2) {
            llenaCombo(tasasYComisiones[`${Global_Producto}`][`${valor}`], cmbcargar, primeaOpcion);
          } else if (level == 3) {
            llenaCombo(tasasYComisiones[`${Global_Producto}`][`${Global_Cliente}`][`${valor}`], cmbcargar, primeaOpcion);
          }
        }
        break;
    }
  });
}

function calcularMontoRecibir() {
  const montoIngresado = document.getElementById("txtmontopagar").value;
  const comisionOP = tasasYComisiones[`${Global_Producto}`][`${Global_Cliente}`][`${Global_Metodo_Pago}`].comisionOP;
  const igvComision = tasasYComisiones[`${Global_Producto}`][`${Global_Cliente}`][`${Global_Metodo_Pago}`].igvComision;
  const tasa = tasasYComisiones[`${Global_Producto}`][`${Global_Cliente}`][`${Global_Metodo_Pago}`].tasa;

  let comisionOpenPay = montoIngresado * (comisionOP / 100);
  let subComision = comisionOpenPay + tasa;
  let subCob = subComision * (igvComision / 100);
  let comisionTotal = subComision + subCob;
  let recibiras = montoIngresado - comisionTotal;
  return recibiras;
}

const lblresultado = document.getElementById("lblMontoRecibir");
const txtmontopagar = document.getElementById("txtmontopagar");
txtmontopagar.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    lblresultado.textContent = calcularMontoRecibir();
    event.preventDefault();
  }
});

llenaCombo(tasasYComisiones, "cmbproductos", "¿Qué producto necesitas?");
cargarControles(1, "cmbproductos", "divopciones", 1, "bancos", "cmbbancos", "¿Eres cliente?");
cargarControles(2, "cmbbancos", "divopciones", 2, "metodospago", "cmbmetodospago", "Método de pago");
cargarControles(3, "cmbmetodospago", "divopciones", 3, "monto_pagar", "", "");
