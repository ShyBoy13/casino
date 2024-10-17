'use strict'

const CARTAS = ['14-E', '2-E', '3-E', '4-E', '5-E', '6-E', '7-E', '8-E', '9-E', '10-E', '11-E', '12-E', '13-E', '14-C', '2-C', '3-C', '4-C', '5-C', '6-C', '7-C', '8-C', '9-C', '10-C', '11-C', '12-C', '13-C', '14-D', '2-D', '3-D', '4-D', '5-D', '6-D', '7-D', '8-D', '9-D', '10-D', '11-D', '12-D', '13-D', '14-T', '2-T', '3-T', '4-T', '5-T', '6-T', '7-T', '8-T', '9-T', '10-T', '11-T', '12-T', '13-T']

window.mesaDatos = {
  mesaElem: undefined,
  mesaObj: undefined,
  jugadorActual: undefined,
  ganadores: undefined, 

}
const appendAllChildren = (element, children) => {
  for ( let child of children ) {
    element.appendChild(child)
  }
}

class Jugador {
  extra
  constructor(asiento) {
    this.posicion = 0 
    this.asiento = asiento
    this.mano = []
    this.mejorMano = {}
    this.tipo = ''
    this.extra = true
  }
}

class MesaAbstracta {
  #baraja
  constructor(capacidad, baraja) {
    this.boton = 0
    this.asientos = new Array(capacidad).fill(undefined)
    this.cartasComunitarias
    this.#baraja = baraja

  }

  get baraja() {
    return this.#baraja
  }

  static separarCartas(cartas) {
    return cartas.map((carta) => [parseInt(carta.split('-')[0]), carta.split('-')[1]])
  }

  static unirCartas(cartas) {
    return cartas.map((carta) => carta.join('-'))
  }

  static checarPares(cartas) {
    let pares = []
    let mejorMano = []
    let valorMano = 1
    let manoCopia
          
    manoCopia = cartas.slice()

    let noPares = cartas.slice()

    for ( let e = 0; e < noPares.length-1; e++ ) {
      let firstIndex
      let lastIndex
      let acabar = false

      for ( let l = e+1; l < noPares.length && !acabar; l++) {
        //console.log(manoCopia[e][0], manoCopia[l][0])
        if ( noPares[e][0] === noPares[l][0] ) {
          lastIndex = l
          firstIndex = e
        } else {
          acabar = true 
        }
      }
      if ( firstIndex !== undefined && lastIndex !== undefined) {
        pares.push(noPares.slice(firstIndex, lastIndex+1))
        noPares = noPares.filter((c, i) => !(firstIndex <= i && i <= lastIndex))
        
        e--
      }
    }

    if ( pares.length === 1) {
      mejorMano = pares[0].concat(noPares.slice(0, 5 - pares[0].length))
      valorMano = Math.pow(2, pares[0].length-1)

    } else if ( pares.length === 2 ) {
      let hayPoker = pares.find((par) => par.length === 4)
      if ( hayPoker !== undefined ) {
        if ( noPares.length === 0 ) {
          mejorMano = hayPoker.concat(pares.filter((par) => par.length === 3)[0])
        } else {
          if ( noPares[0][0] > pares.filter((par) => par.length === 2)[0][0][0]) {
            mejorMano = hayPoker.concat(noPares)
          } else {
            mejorMano = hayPoker.concat([pares.filter((par) => par.length === 2)[0][0]])
          }
        }
        valorMano = 8
      } else if (pares[0].length === 3 && pares[1].length === 3) {
        mejorMano = pares[0].concat(pares[1].slice(0, 2))

        valorMano = 7
      } else if (pares[0].length === 3 || pares[1].length === 3) {
        if ( pares[0].length > pares[1].length) {
          mejorMano = pares[0].concat(pares[1])
        } else {
          mejorMano = pares[1].concat(pares[0])
        }
        valorMano = 7
      } else {
        valorMano = 3
        mejorMano = pares[0].concat(pares[1]).concat([noPares[0]])
      }
    } else if ( pares.length === 3 ) {
      let hayTercia = pares.find((par) => par.length === 3)
      if ( hayTercia !== undefined ) {
        //cambiar filter por find
        mejorMano = hayTercia.concat(pares.filter((par) => par.length === 2)[0])
        valorMano = 7
      } else {
        mejorMano = pares[0].concat(pares[1]).concat([pares[2][0]])
        valorMano = 3
      }
    } else {
      return {mano: [], valor: undefined, cartaAlta: undefined, kicker: undefined}
    }
    //console.log(pares, 'pares')
    //console.log(mejorMano, 'mejor mano de pares')
    return {mano: MesaAbstracta.unirCartas(mejorMano), valor: valorMano, cartaAlta: mejorMano[0][0], kicker:  undefined}
  }

  static checarEscalera(cartas) {
    // Si la primer carta es 14 copiarlo como 1 y agregarlo a las cartas
    let mano = cartas.slice()
    let escalera = []
    if (cartas[0][0] === 14) {
      //console.log(cartas.concat([[1, cartas[0][1]]]))
      mano = mano.concat([[1, cartas[0][1]]])
    }

    //console.log(mano)
    for ( let l = 0; l < mano.length-1; l++) {
      let encontrado = false
      for ( let f = l+1; f < mano.length && !encontrado; f++ ) {
        if ( mano[l][0]-1 === mano[f][0] ) {
          //console.log(mano[l][0], mano[f][0])
          if ( escalera.length === 0 )  escalera.push(l, f) 
          else escalera.push(f)
          encontrado = true
        } else if ( mano[l][0] === mano[f][0] ) {
          l++
        } else {
          encontrado = true
          if (escalera.length < 5) escalera = []
        }
      }
    }
    if (escalera.length > 4) escalera = escalera.slice(0, 5)
    else escalera = []

    escalera = mano.filter((m, i) => escalera.includes(i))
    //console.log(escalera, 'escalera')
    //
    if ( escalera.length > 0 ) return {mano: MesaAbstracta.unirCartas(escalera), valor: 5, cartaAlta: escalera[0][0], kicker:  escalera[1]}
    else return {mano: [], valor: undefined, cartaAlta: undefined, kicker: undefined}

  }

  static checarColor( cartasArr ) {
    let color
    let cartas = MesaAbstracta.unirCartas(cartasArr)
    color = cartas.filter(c => c.endsWith('E')) 
    if ( color.length < 4 ) {
      color = cartas.filter(c => c.endsWith('C'))
    }  
    if ( color.length < 4 ) {
      color = cartas.filter(c => c.endsWith('D'))
    } 
    if ( color.length < 4 ) {
      color = cartas.filter(c => c.endsWith('T'))
    }
    if ( color.length > 4 ) return {mano: color.slice(0, 5), valor: 6, cartaAlta: parseInt(color[0].split('-')[0]), kicker:  color[1]}
    return {mano: [], valor: undefined, cartaAlta: undefined, kicker: undefined}
  }

  static mezclarCartas (cartas) {
    let cartasArr = cartas.slice(0)
    let cartasMezcladas = [] 
    while ( 0 < cartasArr.length  ) {
      let numAleatorio = Math.ceil(Math.random() * cartasArr.length) - 1
      let cartaValor = cartasArr[numAleatorio]

      cartasMezcladas.push(cartaValor)
      cartasArr[numAleatorio] = cartasArr[cartasArr.length - 1]
      
      cartasArr.pop()
    }
    return cartasMezcladas
  }

  obtenerCartasMesa() {
    let jugadores = this.asientos.filter(asiento => asiento !== undefined)
    let cartasJugadores = jugadores.reduce((cartas, jugador) => cartas.concat([jugador.mano]), [])

    return [cartasJugadores, this.cartasComunitarias] 
  }

  limpiarCartas() {
    for ( let asiento=0; asiento < this.asientos.length; asiento++ ) {
      if ( this.asientos[asiento] !== undefined && this.asientos[asiento].extra === true ) {
        console.log('limpiando asiento')
        this.asientos[asiento] = undefined
      }
    }
    console.log(this.asientos)
  }

  agregarJugador (jugador) {
    if (jugador instanceof Jugador) {
      this.asientos[jugador.asiento] = jugador
    }
    return this.asientos[jugador.asiento]
  }

  repartirCartas (cartasJugador, cartasComunitarias) {
    let cartasMezcladas = this.mezclarCartas(this.baraja)
    let asientos = this.asientosEstado().ocupados
    let inicioReparto = 0
    for ( let i = 0; i < asientos.length; i++) {
      this.asientos[asientos[i]].mano = cartasMecladas.slice(inicioReparto, inicioReparto+cartasJugador)
      inicioReparto += cartasJugador 
    }
    this.defComunitarias(cartasMezcladas, inicioReparto, inicioReparto+cartasComunitarias)
    console.log(cartasMezcladas, this.cartasComunitarias, this.asientos.find((p) => p != undefined).mano)
  }

  defCartasComunitarias(cartasRestantes, inicio = 0, final = 5 ) {
    this.cartasComunitarias = cartasRestantes.slice(inicio, final)
  }

  asientosEstado () {
    let asientosEstado = this.asientos.reduce((asientos, asientoValor, asientoNum) => {
      if ( asientoValor === undefined )  asientos.disponibles.push(parseInt(asientoNum))
      else  asientos.ocupados.push(parseInt(asientoNum))
      return asientos
    }, {
      disponibles: [],
      ocupados: []
    });
    return asientosEstado
  }
}

class MesaProbabilidadesHoldem extends MesaAbstracta {
  constructor(capacidad, baraja) {
    super(capacidad, baraja)
  }

  repartirCartas (numeroComunitarias = 5, ...cartas) {
    // espera que: ...cartas = (['carta'*2], ['comunitara'*5]) 
    if ( cartas.length === 2) {
      let cartasOcultas = cartas[0]
      let comunitarias = cartas[1]
      for ( let an=0; an<this.asientos.length; an++ ) {
        if ( this.asientos[an] == undefined ) {
          this.agregarJugador(new Jugador(an), cartasOculas[an])
        }
      }
      this.defCartasComunitarias(comunitarias, 0, numeroComunitarias)
    } else {
      let jugadores = this.asientos.filter(asiento => asiento !== undefined)
      console.log(this.asientos)
      console.log(jugadores)
      let cartasJugadores = jugadores.reduce((cartas, jugador) => cartas.concat(jugador.mano), [])
      console.log(jugadores)
      console.log(cartasJugadores)
      let cartasRestantes = this.baraja.filter(carta => !cartasJugadores.includes(carta))
      let cartasMezcladas = MesaAbstracta.mezclarCartas(cartasRestantes)
      let cartaARepartir = 0
      let siguienteCarta 

      for ( let an=0; an<this.asientos.length; an++ ) {
        if ( this.asientos[an] == undefined ) {
          siguienteCarta = cartaARepartir + 2
          this.agregarJugador(new Jugador(an), cartasMezcladas.slice(cartaARepartir, siguienteCarta))
          cartaARepartir = siguienteCarta
        }
      }
      this.defCartasComunitarias(cartasMezcladas, cartaARepartir, cartaARepartir+numeroComunitarias)
      //console.log(cartasMezcladas, this.cartasComunitarias, this.asientos.find((p) => p != undefined).mano)
    }
  }
  
  ponerMejoresManos () {
    let manoDeSiete
    for ( let jugador of this.asientos ) {
      manoDeSiete = jugador.mano.concat(this.cartasComunitarias)
      manoDeSiete = MesaAbstracta.separarCartas(manoDeSiete)
    // Ordena las cartas de mayor a menor valor
      for ( let largo = manoDeSiete.length; largo > 1; largo--) {
        for ( let o = 0; o < largo-1; o++) {
          if ( manoDeSiete[o][0] < manoDeSiete[o+1][0] ) {
            let guarda = manoDeSiete[o]
            manoDeSiete[o] = manoDeSiete[o+1]
            manoDeSiete[o+1] = guarda
          }
        }
      }
      jugador.mejorMano = this.obtenerMejoresCincoCartas(manoDeSiete)
    }
  }

  obtenerMejoresCincoCartas(sieteCartas) {
    let mejorMano = [MesaAbstracta.checarColor(sieteCartas), MesaAbstracta.checarEscalera(sieteCartas), MesaAbstracta.checarPares(sieteCartas)].find( m => m.mano.length > 4 )
    if ( mejorMano !== undefined ) return mejorMano
    return {mano: MesaAbstracta.unirCartas(sieteCartas.slice(0, 5)), valor: 1, cartaAlta: sieteCartas[0][0]}
  }

  obtenerKicker(manosDiferentes) {
    return parseInt(manosDiferentes.reduce( (da, ds) => parseInt(da[0].split('-')[0]) >= parseInt(ds[0].split('-')[0]) ? da : ds)[0].split('-'))
  }

  obtenerMejorMano(manos) {
    let coincidencias = []
    let igualdad
    let ganador
    console.log(manos, 'manos finales')
    if ( manos.length === 1 ) return manos
    for ( let mp=1; mp < manos.length; mp++ ) {
      let coincidencia = []
      let esCoincidencia = true
      for ( let c=0; c<5 && esCoincidencia; c++ ) {
        if ( manos[0].mejorMano.mano[c].split('-')[0] == manos[mp].mejorMano.mano[c].split('-')[0] ) {
          coincidencia.push(manos[0].mejorMano.mano[c])
          esCoincidencia = true
        } else {
          esCoincidencia = false
        }
        
      }
      coincidencias.push(coincidencia)
    }
    console.log(coincidencias, 'coincidencias')

    if (coincidencias.length === 0) {
      return manos.find(j => j.mejorMano.mano.includes(this.obtenerKicker(manos.map(j => j.mejorMano.mano))) )
    }

    igualdad = coincidencias.reduce( ( coincidenciaMasCorta, coincidencia ) => {
      if (coincidenciaMasCorta.length < coincidencia.length) {
        return coincidenciaMasCorta 
      }
      return coincidencia
    })
    igualdad = MesaAbstracta.separarCartas(igualdad).map( c => String(c[0]) )
    console.log(igualdad, 'igualdad')

    let diferencias = manos.map( j => j.mejorMano.mano.filter(c => !igualdad.includes(c.split('-')[0])) )
    console.log(diferencias, 'diferencias')

    if ( diferencias.find( d => d.length === 0 ) ) {
      return manos  
    }


    let kickerMasAlto = this.obtenerKicker(diferencias)
    console.log(kickerMasAlto)

    let kickerManos = diferencias.reduce( (kicker, diferencia) => {
      console.log(diferencia)
      if ( kicker.length > 0 ) {
        diferencias.filter( d => 
          d.find( cd =>
            cd.startsWith(String(this.obtenerKicker(diferencias.map( d => d[d.length-1]))))
          )
        )
      }
      if (  parseInt(diferencia[0].split('-')[0]) === kickerMasAlto ) {
        
        return kicker.concat([diferencia[0]])
      }
      return kicker
    }, [])
    console.log(kickerManos)

    return manos.reduce( (manosSeparadas, jugador)  => {
      if ( jugador.mejorMano.mano.find( carta => kickerManos.includes(carta) ) !== undefined ) {
        return manosSeparadas.concat(jugador)
      }
      return manosSeparadas
    }, [])
  }

  obtenerGanador() {
    this.ponerMejoresManos()
    console.log(this.asientos)
    let mayorRangoPos = 0
    for ( let an=1; an < this.asientos.length; an++ ) {
      if ( this.asientos[mayorRangoPos].mejorMano.valor < this.asientos[an].mejorMano.valor ) {
        mayorRangoPos = an
      }
    }

    let mejoresManos = this.asientos.filter(asiento => asiento.mejorMano.valor === this.asientos[mayorRangoPos].mejorMano.valor)

    let cartaMasAlta = mejoresManos.reduce( (mayorCartaAlta, asiento) => {
      if ( mayorCartaAlta < asiento.mejorMano.cartaAlta ) {
        return asiento.mejorMano.cartaAlta
      }
      return mayorCartaAlta
    }, 0)
    
    let manosFinales = mejoresManos.filter((asiento) => asiento.mejorMano.mano[0].startsWith(String(cartaMasAlta)))
    
    let ganadores = this.obtenerMejorMano(manosFinales)
    console.log(ganadores)

    return ganadores.map( ganador => ganador.asiento )
  }

  agregarJugador(jugador, cartas, esExtra = true) {
    let nuevoJugador = super.agregarJugador(jugador)
    nuevoJugador.mano = cartas
    nuevoJugador.extra = esExtra 
  }
}

const crearCartasElems = (cartasJugador, vacias) => {
  let cartas = cartasJugador 
  if ( vacias !== true ) {
    cartas = MesaAbstracta.separarCartas(cartasJugador)
  }

  let letras = {
    14: 'A',
    13: 'K',
    12: 'Q',
    11: 'J',
  }

  let figuras = {
    E: '♠',
    T: '♣',
    C: '♥',
    D: '♦',
  }
  
  let cartasArr = cartas.map(carta => {
    let cartaElem = document.createElement('div')
    cartaElem.className = 'carta'

    let valor = document.createElement('span')
    let figura = document.createElement('span')

    if ( vacias !== true ) {
      if ( [14, 13, 12, 11].includes(carta[0]) ) {
        valor.textContent = letras[carta[0]]
      } else {
        valor.textContent = carta[0]
      }

      if ( ['C', 'D'].includes(carta[1]) ) {
        figura.style.color = '#ff0000'
        valor.style.color = '#ff0000'
      }
      figura.textContent = figuras[carta[1]]


    }

    cartaElem.appendChild(valor)
    cartaElem.appendChild(figura)

    return cartaElem
  })
  
  return cartasArr
}

const convertirCartaAString = (cartaElem) => {
  let cartaElemTexto = cartaElem.textContent
  let letras = {
    'A': '14',
    'K': '13',
    'Q': '12',
    'J': '11'
  }

  let figuras = {
    '♠': 'E',
    '♣': 'T',
    '♥': 'C',
    '♦': 'D'
  }

  let caracteresElem 
  let cartaString

  if ( cartaElemTexto.length > 2 ) {
    caracteresElem = [cartaElemTexto.slice(0, 2), cartaElemTexto[2]] 
    console.log(caracteresElem)
  } else {
    caracteresElem = cartaElemTexto.split('') 
  }

  if ( ['A', 'K', 'Q', 'J'].includes(caracteresElem[0]) ) {
    caracteresElem[0] = letras[caracteresElem[0]]
  } 
  cartaString = caracteresElem[0].concat('-', figuras[caracteresElem[1]]) 

  return cartaString
}

const crearJugadoresExtra = (cantidad) => {
  let jugadores = []
  for ( let n=0; n<cantidad; n++) {
    let jugador = document.createElement('article')
    jugador.className = 'jugador-extra' 
    jugador.setAttribute('posicion-jugador', n)
    
    let cartasJugador = document.createElement('div')
    cartasJugador.className = 'cartas-jugador'

    let seleccionarCartasBtn = document.createElement('button')
    seleccionarCartasBtn.className = 'seleccionar-cartas-btn'
    seleccionarCartasBtn.textContent = '+'

    cartasJugador.append(...crearCartasElems(new Array(2).fill(), true))
    jugador.appendChild(cartasJugador)
    jugador.appendChild(seleccionarCartasBtn)
    jugadores.push(jugador)
  }
  return jugadores 
}

const agregarJugador = (cartasJugador) => {
  let jugadorCartasElem = mesaDatos.jugadorActual.querySelector('.cartas-jugador')

  mesaDatos.jugadorActual.classList.remove('jugador-seleccionado')
  mesaDatos.jugadorActual.classList.remove('jugador-extra')
  mesaDatos.jugadorActual.classList.add('jugador')
  mesaDatos.jugadorActual.querySelector('.seleccionar-cartas-btn').style.display = 'none'
  
  jugadorCartasElem.replaceChildren(...crearCartasElems(cartasJugador))

  let cartas = Array.from(jugadorCartasElem.children).map(cartaElem => convertirCartaAString(cartaElem))
  let jugadorObj = new Jugador(parseInt(mesaDatos.jugadorActual.getAttribute('posicion-jugador')))

  mesaDatos.jugadorActual = undefined
  mesaDatos.mesaObj.agregarJugador(jugadorObj, cartas, false)
}

const seleccionarJugador = (seleccionarBtn, todasCartas) => {
  if ( mesaDatos.jugadorActual !== undefined ) {
    mesaDatos.jugadorActual.classList.remove('jugador-seleccionado')
  }
  mesaDatos.jugadorActual = seleccionarBtn.closest('.jugador-extra')
  mesaDatos.jugadorActual.classList.add('jugador-seleccionado')

  todasCartas.classList.add('mostrar-flex')
  console.log(mesaDatos.mesaObj.asientos, 'jugador seleccionado')
}

const crearMesa = (capacidad) => {
  if ( typeof capacidad !== 'number' ) return false
  const mesa = mesaDatos.mesaObj
  const todasCartasElem = document.querySelector('#todas-cartas')
  const cartasComunitariasElem = document.createElement('article')
  cartasComunitariasElem.id = 'cartas-comunitarias'

  let cartasJugador = []
 
  mesaDatos.mesaElem.replaceChildren(...crearJugadoresExtra(capacidad), cartasComunitariasElem)

  mesaDatos.mesaElem.addEventListener('click', (e) => {
   if ( e.target.className === 'seleccionar-cartas-btn' ) {
      seleccionarJugador(e.target, todasCartasElem)
    } 
  })

  todasCartasElem.addEventListener('click', (e) => {
    let carta = e.target.closest('.carta')
    if ( carta !== null && mesaDatos.jugadorActual !== undefined && !carta.hasAttribute('disabled')) {
      if ( !cartasJugador.includes(convertirCartaAString(carta)) ) {
        cartasJugador.push(convertirCartaAString(carta))
        carta.setAttribute('disabled', 'disabled')
        if (cartasJugador.length === 2) {
          agregarJugador(cartasJugador)
          cartasJugador = []
        }
      } 
    } 
  })

  todasCartasElem.replaceChildren()
  crearCartasElems(CARTAS).forEach(cartaElem => todasCartasElem.appendChild(cartaElem))
}

const obtenerGanador = () => {
  console.log(mesaDatos.mesaObj.obtenerGanador())
  for ( let ganador of mesaDatos.mesaObj.obtenerGanador() ) {
    console.log(ganador)
    if ( mesaDatos.ganadores !== undefined ) mesaDatos.ganadores.forEach(ganador => document.querySelector(`article[class^="jugador"][posicion-jugador="${ganador}"`).classList.remove('ganador'))
    console.log(document.querySelector(`article[class^="jugador"][posicion-jugador="${ganador}"`))
    document.querySelector(`article[class^="jugador"][posicion-jugador="${ganador}"`).classList.add('ganador')
  }
  mesaDatos.ganadores = mesaDatos.mesaObj.obtenerGanador()
}

const limpiarCartasExtra = () => {
  mesaDatos.mesaObj.limpiarCartas()
  for ( let cartasJugador of mesaDatos.mesaElem.querySelectorAll('.cartas-jugador') ) {
    let jugadorExtra = cartasJugador.closest('.jugador-extra')
    if ( jugadorExtra !== null ) {
      jugadorExtra.classList.remove('ganador')
      cartasJugador.replaceChildren(...crearCartasElems(new Array(2).fill(), true))
    }
  }

  mesaDatos.mesaElem.querySelector('#cartas-comunitarias').replaceChildren()
}

const repartirCartas = (repeticiones = 1, etapaMesa) => {
  //mesa.repartirCartas([['6-C','5-E'], ['11-T','11-D'], ['14-E','13-E'], ['6-D','2-D'], ['2-E','2-T'], ['10-T','13-D'], ['8-D','8-E'], ['5-T','4-E'], ['9-C','2-C']], ['13-D', '3-T', '4-T', '6-E', '7-T'])
  //mesaDatos.mesaObj.repartirCartas([['9-C', '11-T'], ['8-D', '5-T'], ['5-D', '14-C'], ['14-D', '3-T'], ['4-E', '9-T'], ['13-T', '12-T'], ['6-C', '11-D'], ['10-D', '7-D'], ['6-T', '13-D']], ['6-E', '12-E', '9-D', '4-T', '10-E'])
  //mesaDatos.mesaObj.repartirCartas([['13-D', '8-T'], ['12-T', '9-E'], ['10-C', '7-C'], ['10-T', '6-T'],['13-C', '3-D'], ['9-C', '7-E'], ['12-C', '2-E'], ['11-C', '6-D'], ['11-E', '3-C']], ['6-E', '13-T', '5-C', '7-D', '2-C'])
  let ganadasJugadores = {}
  for ( let r=1; r <= repeticiones; r++ ) {
    let posicionJugadores = []
    console.log(mesaDatos.mesaElem.querySelectorAll(`.jugador`))
    for ( let jugador of mesaDatos.mesaElem.querySelectorAll(`.jugador`) ) {
      posicionJugadores.push(parseInt(jugador.getAttribute('posicion-jugador')))
    } 
    console.log(posicionJugadores)
    limpiarCartasExtra()

    mesaDatos.mesaObj.repartirCartas(etapaMesa)
    if ( r === 1 ) console.log(mesaDatos.mesaObj.obtenerCartasMesa(), 'cartas de la mesa')
    if ( r === repeticiones ) {
      document.querySelector('#cartas-comunitarias').replaceChildren(...crearCartasElems(mesaDatos.mesaObj.cartasComunitarias))
      mesaDatos.mesaObj.asientos.forEach( a => {
        let jugadorExtra = document.querySelector(`.jugador-extra[posicion-jugador="${a.asiento}"] > .cartas-jugador`)
        if ( jugadorExtra !== null ) {
          jugadorExtra.replaceChildren(...crearCartasElems(a.mano))
        }
      })
    }
    obtenerGanador()

    for ( let ganador of mesaDatos.ganadores ) {
      if (posicionJugadores.includes(ganador)) {
        if ( ganadasJugadores[ganador] === undefined ) {
          ganadasJugadores[ganador] = 1
        } else {
          ganadasJugadores[posicionJugadores] += 1
        }
      }
    }
    console.log(ganadasJugadores)
    console.log(Object.values(ganadasJugadores).map( ganadas => 100/(repeticiones / ganadas) ))

  }
}


const iniciarMesa = () => {
  let mesaOpcionesElem = document.querySelector('#mesa-opciones')
  mesaDatos.mesaElem = document.querySelector('#mesa')

  mesaOpcionesElem.addEventListener('click', (e) => {
    const mesaCapacidadElem = e.currentTarget.querySelector('#mesa-capacidad')
    if ( e.target.id === 'crear-mesa-btn' && mesaCapacidadElem.value !== '') {
      let capacidad = parseInt(mesaOpcionesElem.querySelector('#mesa-capacidad').value)
      mesaDatos.mesaObj = new MesaProbabilidadesHoldem(capacidad, CARTAS)
      mesaDatos.ganadores = []
      crearMesa(capacidad)
      document.querySelector('#todas-cartas').classList.add('mostrar-flex')

    } else if (e.target.classList.contains('control-capacidad-btn')) {
      let capacidadActual = parseInt(mesaCapacidadElem.value)

      if ( e.target.id.startsWith('sumar') && capacidadActual < 9) {
        mesaCapacidadElem.value = (parseInt(mesaCapacidadElem.value)+1).toString()
      } else if ( e.target.id.startsWith('restar') && capacidadActual > 2) {
        mesaCapacidadElem.value = (parseInt(mesaCapacidadElem.value)-1).toString()
      }

    } else if ( e.target.id === 'repartir-cartas-btn' ) {
      document.querySelector('#todas-cartas').classList.remove('mostrar-flex')
      repartirCartas(100, parseInt(mesaOpcionesElem.querySelector('#etapa-mesa').value))

    } else if ( e.target.id === 'limpiar-cartas-extra-btn' ) {
      limpiarCartasExtra()
    }
  })
}

function main () {
  iniciarMesa()  
}


main()

/*
  ['12-T', '9-D', '6-T', '6-E', '5-T', '4-C', '2-C'] //par
  ['12-D', '6-C', '6-T', '6-D', '6-E', '5-T', '1-T'] //poker
  ['12-D', '8-D', '6-T', '6-D', '6-E', '5-T', '1-T'] //tercia
  ['12-D', '12-E', '6-T', '6-D', '6-E', '5-T', '1-T'] //full house (par/tercia)
  ['12-D', '12-E', '6-T', '6-D', '6-E', '5-T', '5-C'] //full house (par/tercia/par)
  ['12-D', '12-E', '6-T', '6-D', '5-E', '5-T', '5-C'] //full house (par/par/tercia)
  ['12-D', '12-E', '12-T', '5-D', '5-E', '5-T', '1-C'] //full house (tercia/tercia/)
  ['12-D', '12-E', '12-T', '5-D', '5-E', '5-T', '5-C'] //poker (tercia/poker/)
  ['14-D', '13-E', '12-T', '11-D', '10-E', '5-T', '5-C'] //poker (par/poker/)
  ['8-E', '8-T', '7-C', '6-T', '6-C', '5-T', '5-E'] // 3 pares
*/
