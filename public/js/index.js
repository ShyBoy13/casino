const crearElemCliente =  (nombre, cuenta) => {
  let cantidadOperacionEstado = false;

  const elemCliente = document.createElement('article') 
  elemCliente.className = 'cliente'

  const elemNombreCliente = document.createElement('div')
  elemNombreCliente.className = 'nombre-cliente'
  elemNombreCliente.textContent = nombre

  const elemCuentaCliente = document.createElement('div')
  elemCuentaCliente.className = 'cuenta-cliente'

  const cuentaCantidad = document.createElement('span')
  cuentaCantidad.className = 'cantidad-cuenta'
  cuentaCantidad.textContent = cuenta.toFixed(3).toString()

  const elemSumarCuenta = document.createElement('span')
  elemSumarCuenta.className = 'sumar-cuenta'
  elemSumarCuenta.textContent = '+'

  const elemRestarCuenta = document.createElement('span')
  elemRestarCuenta.className = 'restar-cuenta'
  elemRestarCuenta.textContent = '-'

  const elemCantidadOperacion = document.createElement('input')
  elemCantidadOperacion.type = 'number'
  elemCantidadOperacion.placeholder = 'Cantidad =< 20'
  elemCantidadOperacion.max = 2000
  elemCantidadOperacion.className = 'cantidad-operacion'

  const elemReiniciarCuenta = document.createElement('span')
  elemReiniciarCuenta.className = 'reiniciar-cuenta'
  elemReiniciarCuenta.textContent = '0'

  elemCuentaCliente.addEventListener('click', (e) => {
    if (e.target.classList.contains('sumar-cuenta')) {
      let cantidad = parseFloat(elemCantidadOperacion.value)
      let cantidadValida = !isNaN(cantidad) && (cantidad <= 20)
      if (cantidadOperacionEstado ) {
        if (cantidadValida) {
          console.log(cantidad)
          cuentaCantidad.textContent = (parseFloat(cuentaCantidad.textContent) + parseFloat(elemCantidadOperacion.value)).toFixed(3)
          elemCantidadOperacion.value = ''
        }
        elemCantidadOperacion.remove()
        elemRestarCuenta.style.display = 'flex'
        cantidadOperacionEstado = false 
      } else {
        e.target.before(elemCantidadOperacion)
        elemRestarCuenta.style.display = 'none'
        cantidadOperacionEstado = true
      }
    } else if (e.target.classList.contains('restar-cuenta')) {
      let cantidad = parseFloat(elemCantidadOperacion.value)
      let cantidadValida = !isNaN(cantidad)
      if (cantidadOperacionEstado ) {
        if (cantidadValida) {
          console.log(cantidad)
          cuentaCantidad.textContent = (parseFloat(cuentaCantidad.textContent) + parseInt(elemCantidadOperacion.value) / 1000).toFixed(3)
          elemCantidadOperacion.value = ''
        }
        elemCantidadOperacion.remove()
        elemSumarCuenta.style.display = 'flex'
        cantidadOperacionEstado = false 
      } else {
        e.target.before(elemCantidadOperacion)
        elemSumarCuenta.style.display = 'none'
        cantidadOperacionEstado = true
      }
    } else if (e.target.classList.contains('reiniciar-cuenta')) {
      if (window.confirm('Desea Reiniciar la cuenta?')) {
        cuentaCantidad.textContent = (0).toFixed(3)
        fetch('localhost:8080/clientes', {
          method: 'POST',
          body: JSON.stringify({nombre: elemNombreCliente.textContent, cuenta: cuentaCantidad.textContent})
        })
      }

    }
  })

  elemCuentaCliente.appendChild(cuentaCantidad)
  elemCuentaCliente.appendChild(elemSumarCuenta)
  elemCuentaCliente.appendChild(elemRestarCuenta)
  elemCuentaCliente.appendChild(elemReiniciarCuenta)

  elemCliente.appendChild(elemNombreCliente) 
  elemCliente.appendChild(elemCuentaCliente)

  return elemCliente
} 


function main () {
  document.querySelector('#clientes').appendChild(crearElemCliente('Roman R. Rios', 10))
  document.querySelector('#agregar-cliente').addEventListener('click', (e) => {
    console.log(e.currentTarget)
    if (e.target.id == 'agregar-cliente-btn') {
      let clienteNombre = document.querySelector('#cliente-nuevo-nombre').value
      console.log(clienteNombre)
      if (clienteNombre !== '') {
        document.querySelector('#clientes').appendChild(crearElemCliente(clienteNombre, 0.0))
      }
    }
    
  })
}

main()

