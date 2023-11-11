function showHide(mostrar, idNodo) {
  const nodo = document.getElementById(idNodo);
  if (mostrar) {
    nodo.classList.remove("control-oculto");
  } else {
    nodo.classList.add("control-oculto");
  }
}

function cargarControles(cmbAusar, divArray, inicioArray, divMostrar) {
  const cmb = document.getElementById(cmbAusar);
  cmb.addEventListener("change", () => {
    const valor = cmb.value;
    switch (valor) {
      case "0":
        const combos = document.getElementsByClassName(divArray);
        for (let i = inicioArray; i < combos.length; i++) {
          showHide(false, combos[i].id);
        }
        break;
      default:
        showHide(true, divMostrar);
        break;
    }
  });
}

cargarControles("cmbproductos", "divopciones", 1, "bancos");
cargarControles("cmbbancos", "divopciones", 2, "metodospago");
cargarControles("cmbmetodospago", "divopciones", 3, "monto_pagar");

/* 
const cmbproductos = document.getElementById("cmbproductos");
cmbproductos.addEventListener("change", () => {
  const valor = cmbproductos.value;
  switch (valor) {
    case "0":
      const combos = document.getElementsByClassName("divopciones");
      for (let i = 1; i < combos.length; i++) {
        showHide(false, combos[i].id);
      }
      break;
    default:
      showHide(true, "bancos");
      break;
  }
});

const cmbbancos = document.getElementById("cmbbancos");
cmbbancos.addEventListener("change", () => {
  const valor = cmbbancos.value;
  switch (valor) {
    case "0":
      const combos = document.getElementsByClassName("divopciones");
      for (let i = 2; i < combos.length; i++) {
        showHide(false, combos[i].id);
      }
      break;
    default:
      showHide(true, "metodospago");
      break;
  }
});

const cmbmetodospago = document.getElementById("cmbmetodospago");
cmbmetodospago.addEventListener("change", () => {
  const valor = cmbmetodospago.value;
  switch (valor) {
    case "0":
      const combos = document.getElementsByClassName("divopciones");
      for (let i = 3; i < combos.length; i++) {
        showHide(false, combos[i].id);
      }
      break;
    default:
      showHide(true, "monto_pagar");
      break;
  }
});
 */
