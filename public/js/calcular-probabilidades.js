'use strict'

const CARTAS = ['14-E', '2-E', '3-E', '4-E', '5-E', '6-E', '7-E', '8-E', '9-E', '10-E', '11-E', '12-E', '13-E', '14-C', '2-C', '3-C', '4-C', '5-C', '6-C', '7-C', '8-C', '9-C', '10-C', '11-C', '12-C', '13-C', '14-D', '2-D', '3-D', '4-D', '5-D', '6-D', '7-D', '8-D', '9-D', '10-D', '11-D', '12-D', '13-D', '14-T', '2-T', '3-T', '4-T', '5-T', '6-T', '7-T', '8-T', '9-T', '10-T', '11-T', '12-T', '13-T']

class Jugador {
  constructor(nombre, asiento) {
    this.posicion = 0
    this.asiento = asiento 
    this.nombre = nombre
    this.mano = []
  }
}

class Mesa {
  constructor(asientos) {
    this.boton = 0
    this.asientos = new Array(asientos).fill(undefined)
    this.cartasComunitarias
  }

  agregarJugador (jugador) {
    if (jugador instanceof Jugador) {
      this.asientos[jugador.asiento] = jugador
      if (jugador.asiento === 0) {
        this.posicion = 0
      }
    }
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

  repartirCartas () {
    let cartasMezcladas = this.mezclarCartas(CARTAS)
    let asientos = this.asientosEstado().ocupados
    let cartaSiguiente = 0
    for ( let i = 0; i < asientos.length; i++) {
      this.asientos[asientos[i]].mano = [cartasMezcladas[cartaSiguiente], cartasMezcladas[cartaSiguiente+1]]
      cartaSiguiente += 2
    }
    this.cartasComunitarias = cartasMezcladas.slice(cartaSiguiente, cartaSiguiente+5)
    console.log(cartasMezcladas, this.cartasComunitarias, this.asientos.find((p) => p != undefined).mano)
  }

  mezclarCartas (cartas) {
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

  repartirProbabilidades (cartasAsientos, jugadoresVacios, reparticiones) {
    if (cartasAsientos.length + jugadoresVacios <= this.asientos.length) {
      let cartasMezcladas 
      let cartasJugadores = []
      for (let [cartas, asiento] of cartasAsientos) {
        cartasJugadores = cartasJugadores.concat(cartas)
        this.asientos[asiento].mano = cartas
      }

      cartasMezcladas = this.mezclarCartas(CARTAS.filter((carta) => !cartasJugadores.includes(carta) ))
      //console.log(jugadoresVacios)
       
      this.cartasComunitarias = cartasMezcladas.slice(jugadoresVacios*2, jugadoresVacios*2+5)
      //console.log(cartasMezcladas, this.cartasComunitarias, this.asientos.find((p) => p != undefined).mano)
    }
  }

  static separarCartas(cartas) {
    return cartas.map((carta) => [parseInt(carta.split('-')[0]), carta.split('-')[1]])
  }

  static unirCartas(cartas) {
    return cartas.map((carta) => carta.join('-'))
  }

  static checarPares(cartas) {
    let pares = []
    let mejorMano
    let manoCopia
    manoCopia = Mesa.separarCartas(['12-T', '9-D', '6-T', '6-E', '5-T', '4-C', '2-C']) //par
    manoCopia = Mesa.separarCartas(['12-D', '6-C', '6-T', '6-D', '6-E', '5-T', '1-T']) //poker
    manoCopia = Mesa.separarCartas(['12-D', '8-D', '6-T', '6-D', '6-E', '5-T', '1-T']) //tercia
    manoCopia = Mesa.separarCartas(['12-D', '12-E', '6-T', '6-D', '6-E', '5-T', '1-T']) //full house (par/tercia)
    manoCopia = Mesa.separarCartas(['12-D', '12-E', '6-T', '6-D', '6-E', '5-T', '5-C']) //full house (par/tercia/par)
    manoCopia = Mesa.separarCartas(['12-D', '12-E', '6-T', '6-D', '5-E', '5-T', '5-C']) //full house (par/par/tercia)
    manoCopia = Mesa.separarCartas(['12-D', '12-E', '12-T', '5-D', '5-E', '5-T', '1-C']) //full house (tercia/tercia/)
    manoCopia = Mesa.separarCartas(['12-D', '12-E', '12-T', '5-D', '5-E', '5-T', '5-C']) //poker (tercia/poker/)
    manoCopia = Mesa.separarCartas(['13-D', '12-E', '12-T', '5-D', '5-E', '5-T', '5-C']) //poker (par/poker/)
    manoCopia = cartas.slice()

    let noPares = cartas

    console.log(Mesa.unirCartas(cartas), 'mano')

    for ( let e = 0; e < noPares.length-1; e++ ) {
      let firstIndex
      let lastIndex
      let acabar = false

      for ( let l = e+1; l < noPares.length && !acabar; l++) {
        console.log(manoCopia[e][0], manoCopia[l][0])
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
      } else if (pares[0].length === 3 && pares[1].length === 3) {
        mejorMano = pares[0].concat(pares[1].slice(0, 2))

      } else if (pares[0].length === 3 || pares[1].length === 3) {
        if ( pares[0].length > pares[1].length) {
          mejorMano = pares[0].concat(pares[1])
        } else {
          mejorMano = pares[1].concat(pares[0])
        }
      } else {
        mejorMano = pares[0].concat(pares[1]).concat(noPares)
      }
    } else if ( pares.length === 3 ) {
      let hayTercia = pares.find((par) => par.length === 3)
      if ( hayTercia !== undefined ) {
        mejorMano = hayTercia.concat(pares.filter((par) => par.length === 2)[0])
      } else {
        mejorMano = pares.slice(0, 2).concat(pares[2][0])
      }
    }
    /*
    {
      '1': {
        '2': 'par',
        '3': 'tercia'
        '4': 'poker'
      }, 
      '2': {
        '2_2': 'doble par',
        '3_2': 'full'
      }
    */

    console.log(pares, 'pares')
    console.log(mejorMano, 'mejor mano de pares')
    return mejorMano
  }

  static checarEscalera(cartas) {
    // Si la primer carta es 14 copiarlo como 1 y agregarlo a las cartas
  }

  obtenerMejorMano(jugadorAsiento) {
    let mano 
    mano = Mesa.separarCartas(this.asientos[jugadorAsiento].mano.concat(this.cartasComunitarias))
    //console.log(mano)
    let escalera = []
    let i = 0
    for ( let largo = mano.length; largo > 1; largo--) {
      for ( let o = 0; o < largo-1; o++) {
        if ( mano[o][0] < mano[o+1][0] ) {
          let guarda = mano[o]
          mano[o] = mano[o+1]
          mano[o+1] = guarda
        }
      }
    }
    for ( let l = 0; l < mano.length-1; l++) {
      let encontrado = false
      for ( let f = l+1; f < mano.length && !encontrado; f++ ) {
        //console.log(mano[l][0]-1, mano[f][0])
        //console.log(l, f)
        if ( mano[l][0]-1 === mano[f][0] ) {
          //console.log(escalera.length)
          if ( escalera.length === 0 )  escalera.push(l, f) 
          else escalera.push(f)
          encontrado = true
        } else if ( mano[l][0] === mano[f][0] ) {
          l++
        } else {
          escalera = []
          encontrado = true
        }
      }
    }
    if (escalera.length > 4) escalera = escalera.slice(0, 5)
    else escalera = []
    
    Mesa.checarPares(mano)
    
    console.log(escalera, 'escalera')
    //console.log(manoCopia.slice(0, manoCopia.length - pares.length))
    return Mesa.unirCartas(mano)
  }

}

function main () {
  const mesa = new Mesa(9) 
  let nuevoJugador = new Jugador('Roman', 4)
  //console.log(mesa.posicionesEstado())
  mesa.agregarJugador(nuevoJugador)
  //console.log(mesa.posicionesEstado())
  //mesa.repartirCartas()
  mesa.repartirProbabilidades([ [['5-T', '6-T'], 4] ], 3, 100)
  mesa.obtenerMejorMano(4)
}


main()
