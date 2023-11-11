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
