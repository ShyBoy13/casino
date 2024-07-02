const administrarFondo = (montoDado, negativo = false) => {
  let monto = negativo ? -parseFloat(montoDado) : parseFloat(montoDado)
  let fondos = parseFloat(localStorage.getItem('fondos'))
  if (fondos) {
    localStorage.setItem('fondos', parseFloat(fondos + monto))
  } else {
    localStorage.setItem('fondos', parseFloat(0 + monto))
  }
  return parseFloat(localStorage.getItem('fondos'))
}

function main() {
  let fondoTexto = document.querySelector('#fondo-texto')
  fondoTexto.textContent = localStorage.getItem('fondos')
  document.querySelector('#administrar-fondo-elem').addEventListener('click', (e) => {
    console.log(e.currentTarget)
    const manejarMonto = (resta) => {
      fondoTexto.textContent = administrarFondo(e.currentTarget.querySelector('#monto-input').value, resta)
    }
    if (e.target.id === 'monto-sumar-btn'){
      manejarMonto()
    } else if (e.target.id === 'monto-restar-btn') {
      manejarMonto(true)
    }
  })
}

main()
