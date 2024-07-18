const fichas_valores = [100, 50, 30, 20, 10]
const fichas_porcentajes = [0.25, 0.25, 0.20, 0.20, 0.10]

const calcularFichas = (cantidad, porcentajes) => {
  let valorEnFichas = parseFloat(cantidad) * 100;
  let cantidadFichasArr = []
  let valoresFichasCentavosArr = []
  let totalDeCentavos = 0
  let totalDeFichas = 0
  try {
    if ( (valorEnFichas * 100) % 10 !== 0) throw new Error('El dinero debe de poder dividirse entre 10 centavos');
    porcentajes.forEach((porcentaje, itr) => {
      let valorEnCentavos = (porcentaje * valorEnFichas)
      let cantidadDeFicha = Math.round(valorEnCentavos / fichas_valores[itr])
     totalDeFichas += cantidadDeFicha
      totalDeCentavos += fichas_valores[itr] * cantidadDeFicha
      valoresFichasCentavosArr.push(fichas_valores[itr] * cantidadDeFicha)
      cantidadFichasArr.push(cantidadDeFicha)
    })
  } catch (e) {
    console.log(e.message)
  }
  return { 
    cantidadFichas: cantidadFichasArr,
    valoresFichasCentavos: valoresFichasCentavosArr,
    totalFichas: totalDeFichas,
    totalCentavos: totalDeCentavos,
    cantidadCentavosOriginal: valorEnFichas,
  } 
}

function main() {
  let inputPorcentajes = Array.from(document.querySelectorAll('input[id^="porcentaje"]'))
  inputPorcentajes.forEach((porcentajeElem, itr) => {
    porcentajeElem.value = fichas_porcentajes[itr]
  })
  let porcentajesEstado = inputPorcentajes.map(porcentajeElem => parseFloat(porcentajeElem.value))
  document.querySelector('#calculadora-elem').addEventListener('change', (e) => {
    let posicionInput = inputPorcentajes.indexOf(e.target)
    if (e.target.id.startsWith('porcentaje') && e.target.tagName === 'INPUT' && e.target.value !== '') {
      let siguientePorcentajeElem
      if (inputPorcentajes.length === posicionInput+1)  siguientePorcentajeElem = inputPorcentajes[0]
      else  siguientePorcentajeElem = e.target.parentElement.nextElementSibling.querySelector('input[id^="porcentaje"]')

      siguientePorcentajeElem.value = Math.round((parseFloat(siguientePorcentajeElem.value) + (porcentajesEstado[posicionInput] - parseFloat(e.target.value))) * 100) / 100
+      console.log(siguientePorcentajeElem)
+      porcentajesEstado[posicionInput] = e.target.value
+    } else if (e.target.value === '') {
+      e.target.value = porcentajesEstado[posicionInput]
    }
  })
  document.querySelector('#calculadora-elem').addEventListener('click', (e) => {
    let monto = e.currentTarget.querySelector('#cantidad-dinero').value
    if (e.target.id === 'calcular-btn' && monto !== '') {
      
      let calculosFichas = calcularFichas(monto, porcentajesEstado)

      fichas_valores.forEach((ficha, itr) => {
        let calculoFichasElem = e.currentTarget.querySelector(`#valor-${String(ficha)} .calculo-fichas`)
        calculoFichasElem.innerHTML = ''
        e.currentTarget.querySelector('#total-fichas').innerHTML = 'Total de fichas: '
        e.currentTarget.querySelector('#total-centavos').innerHTML = 'Centavos Totales: '
        e.currentTarget.querySelector('#error-calculo').innerHTML = 'Error de calculo: '
        e.currentTarget.querySelector('#total-porcentaje').innerHTML = 'Porcentaje total: '

        calculoFichasElem.innerHTML += `${calculosFichas.cantidadFichas[itr]} ― Valor en centavos: ${calculosFichas.valoresFichasCentavos[itr]} ¢` 
        e.currentTarget.querySelector('#total-porcentaje').innerHTML += Math.round(porcentajesEstado.reduce((porcentajeTotal, porcentajeActual) => porcentajeTotal + porcentajeActual) * 100)
        e.currentTarget.querySelector('#total-fichas').innerHTML += calculosFichas.totalFichas
        e.currentTarget.querySelector('#total-centavos').innerHTML += calculosFichas.totalCentavos
        e.currentTarget.querySelector('#error-calculo').innerHTML += `${calculosFichas.cantidadCentavosOriginal-calculosFichas.totalCentavos} | Dinero original: ${calculosFichas.cantidadCentavosOriginal}`

      })
    }
  })
}


main()
