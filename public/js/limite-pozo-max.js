'use strict';

const obtenerValores = () => {
  let limitePozo = 0
  let iniciarMesa = true 
  document.querySelector('#valores-mesa-btns').addEventListener('click', (e) => {
    let ciegaChicaElem =document.querySelector('#ciega-chica')
    let ciegaGrandeElem = document.querySelector('#ciega-grande')
    let btnCalcularElem = document.querySelector('#btn-calcular')
    let ultimaApuestaElem = document.querySelector('#ultima-apuesta')

    let ciegaChicaContElem = document.querySelector('#ciega-chica-cont')
    let ciegaGrandeContElem = document.querySelector('#ciega-grande-cont')
    let ultimaApuestaContElem = document.querySelector('#ultima-apuesta-cont')

    let ciegaChica = parseInt(ciegaChicaElem.value)
    let ciegaGrande = parseInt(ciegaGrandeElem.value)
    let ultimaApuesta = parseInt(ultimaApuestaElem.value)
    let ultimaSubida = 0



    if (e.target.id === 'btn-calcular') {
      if ( ciegaChica && ciegaGrande && iniciarMesa) {

        limitePozo = ciegaChica + ciegaGrande * 3
        ultimaApuesta = ciegaGrande
        ciegaChicaContElem.style.display = 'none'
        ciegaGrandeContElem.style.display = 'none'

        ultimaApuestaContElem.style.display = 'flex'
        ultimaApuestaElem.step = ciegaGrande
        ultimaApuestaElem.min = ciegaGrande
        ultimaApuestaElem.max = limitePozo

        btnCalcularElem.value = 'Calcular Pozo'

        iniciarMesa = false
        document.querySelector('#limite-pozo').value = String(limitePozo)

      } else if ( limitePozo > 0 && !iniciarMesa) {
        limitePozo += ultimaApuesta * 3 
        ultimaApuestaElem.min = ultimaApuesta 
        ultimaApuestaElem.max = limitePozo
        document.querySelector('#ultima-apuesta').value = ''
        document.querySelector('#limite-pozo').value = String(limitePozo)
      }
      console.log(limitePozo, 'Limite Del Pozo')
      console.log(ciegaChica, ciegaGrande, ultimaApuesta)
    } else if (e.target.id === 'btn-reiniciar') {
      iniciarMesa = true 
      ciegaChicaContElem.style.display = 'flex'
      ciegaGrandeContElem.style.display = 'flex'

      ultimaApuestaContElem.style.display = 'none'
 
    }
  })
}


function main () {
  obtenerValores() 
}

main()
