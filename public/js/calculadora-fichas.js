const fichas_valores = [100, 50, 30, 20, 10]
const fichas_porcentajes = [0.240, 0.25, 0.25, 0.20, 0.110]

const calcularFichas = (cantidad) => {
  let valorEnFichas = parseFloat(cantidad) * 100;
  let cantidadFichasArr = []
  let valoresFichasCentavosArr = []
  let totalDeCentavos = 0
  let totalDeFichas = 0
  try {
    console.log((valorEnFichas * 100) % 10)
    if ( (valorEnFichas * 100) % 10 !== 0) throw new Error('El dinero debe de poder dividirse entre 10 centavos');
    fichas_porcentajes.forEach((porcentaje, itr) => {
      let valorEnCentavos = (porcentaje * valorEnFichas)
      let cantidadDeFicha = Math.floor(valorEnCentavos / fichas_valores[itr])
      totalDeFichas += cantidadDeFicha
      totalDeCentavos += fichas_valores[itr] * cantidadDeFicha
      valoresFichasCentavosArr.push(fichas_valores[itr] * cantidadDeFicha)
      cantidadFichasArr.push(cantidadDeFicha)
    })
  } catch (e) {
    console.log(e.messageDe)
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
  document.querySelector('#calculadora-elem').addEventListener('click', (e) => {
    let monto = e.currentTarget.querySelector('#cantidad-dinero').value
    if (e.target.id === 'calcular-btn' && monto !== '') {
      let calculosFichas = calcularFichas(monto)
      console.log(calculosFichas)
      fichas_valores.forEach((ficha, itr) => {
        console.log(e.currentTarget.querySelector(`#valor-${String(ficha)} > .calculo-fichas`))
        let calculoFichasElem = e.currentTarget.querySelector(`#valor-${String(ficha)} > .calculo-fichas`)
        calculoFichasElem.innerHTML = ''
        e.currentTarget.querySelector('#total-fichas').innerHTML = 'Total de fichas: '
        e.currentTarget.querySelector('#total-centavos').innerHTML = 'Centavos Totales: '
        e.currentTarget.querySelector('#error-calculo').innerHTML = 'Error de calculo: '

        calculoFichasElem.innerHTML += `${calculosFichas.cantidadFichas[itr]} ― Valor en centavos: ${calculosFichas.valoresFichasCentavos[itr]} ¢` 
        e.currentTarget.querySelector('#total-fichas').innerHTML += calculosFichas.totalFichas
        e.currentTarget.querySelector('#total-centavos').innerHTML += calculosFichas.totalCentavos
        e.currentTarget.querySelector('#error-calculo').innerHTML += `${calculosFichas.cantidadCentavosOriginal-calculosFichas.totalCentavos} | Dinero original: ${calculosFichas.cantidadCentavosOriginal}`

      })
    }
  })
}


main()
