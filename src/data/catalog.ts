import type { GameDraft } from '../types'

/**
 * Juego del catálogo precargado: una ficha de refresco rápido completa.
 * El usuario selecciona los que tiene y se guardan en su ludoteca.
 */
export interface CatalogGame extends GameDraft {
  id: string
  description: string
}

export const CATALOG: CatalogGame[] = [
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'catan',
    title: 'Los Colonos de Catán',
    description: 'El clásico de construcción y comercio: recursos, carreteras y el temido ladrón.',
    playersMin: 3,
    playersMax: 4,
    durationMin: 90,
    difficulty: 3,
    setup: [
      'Monta la isla con los hexágonos de terreno según el mapa del reglamento (o al azar) y rodea con agua y puertos.',
      'Coloca el disco numerado correspondiente en cada terreno que no sea desierto (siguiendo el patrón espiral).',
      'Coloca el ladrón sobre el desierto.',
      'Cada jugador toma sus piezas: 15 carreteras, 5 pueblos y 4 ciudades de su color.',
      'Fase de colocación inicial: por turnos, cada jugador coloca 1 pueblo + 1 carretera adyacente; después, en orden inverso, coloca el segundo pueblo + carretera y cobra los recursos de los terrenos adyacentes a ese segundo pueblo.',
      'Baraja las cartas de desarrollo (14 caballeros, 2 monopolios, 2 invenciones, 2 construcción de carreteras, 5 puntos de victoria) y ponlas boca abajo.',
      'Empieza el jugador más joven.',
    ],
    turn: [
      '1. Producir: tira 2 dados. Cada jugador con pueblo o ciudad junto a un terreno con ese número cobra: pueblo = 1 recurso, ciudad = 2. Si sale 7, no se produce: se activa el ladrón.',
      '2. Comerciar: negocia libremente con otros jugadores o usa el comercio marítimo (4:1 con 4 iguales, 3:1 en puerto genérico, 2:1 en puerto especializado).',
      '3. Construir (lo que quieras, pagando): carretera (1 ladrillo + 1 madera), pueblo (1 ladrillo + 1 madera + 1 oveja + 1 trigo), ciudad (2 trigo + 3 piedra, devolviendo el pueblo) o carta de desarrollo (1 oveja + 1 trigo + 1 piedra).',
      'Solo en tu turno puedes construir, comerciar o jugar 1 carta de desarrollo (caballero, monopolio, invención, construcción de carreteras).',
    ],
    endCondition: 'La partida termina inmediatamente cuando un jugador alcanza 10 puntos de victoria en su turno.',
    scoring: [
      'Pueblo = 1 PV. Ciudad = 2 PV.',
      'Cada carta de punto de victoria (desarrollo) = 1 PV (secreta hasta revelarla).',
      'Caballero más grande (jugando 3+ caballeros) = 2 PV con la carta especial.',
      'Camino más largo (5+ carreteras seguidas) = 2 PV con la carta especial.',
    ],
    forgotten: [
      { title: 'El 7 y el ladrón', text: 'Quien tira 7 hace descartar a quien tenga más de 7 cartas (la mitad, redondeando hacia abajo), mueve el ladrón a un terreno y roba 1 carta a un jugador con construcción adyacente. El terreno con el ladrón no produce.' },
      { title: 'Cartas de desarrollo', text: 'No puedes jugar una carta de desarrollo el mismo turno en que la compras, y solo 1 por turno. Las cartas de PV se revelan en tu turno y pueden darte la victoria.' },
      { title: 'Reglas de colocación', text: 'Los pueblos deben estar separados al menos por una carretera entre sí; tus carreteras deben conectar siempre con tus propias construcciones.' },
      { title: 'Las cartas especiales se pierden', text: 'Si otro jugador supera tu camino más largo o tu ejército más grande, pierdes los 2 PV al instante.' },
      { title: 'Puertos 2:1', text: 'Solo sirven con el recurso indicado y solo en tu fase de comercio.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'carcassonne',
    title: 'Carcassonne',
    description: 'Coloca losetas y despliega seguidores para dominar ciudades, carreteras y campos.',
    playersMin: 2,
    playersMax: 5,
    durationMin: 45,
    difficulty: 2,
    setup: [
      'Coloca la loseta de inicio (la ciudad partida en cruz) en el centro de la mesa.',
      'Baraja el resto de losetas en varios montones boca abajo.',
      'Cada jugador toma 8 seguidores de su color: 1 va a la casilla 0 del marcador y 7 quedan disponibles.',
      'Decide quién empieza (por ejemplo, el jugador más joven).',
    ],
    turn: [
      '1. Roba una loseta y colócala de forma que encaje con al menos un lado (campos, ciudades y carreteras deben continuar correctamente).',
      '2. Coloca (opcional) 1 seguidor de tu reserva en la carretera, ciudad, monasterio o campo de ESA loseta, si la feature está libre.',
      '3. Puntúa y retira seguidores de features completadas (ver puntuación). Los granjeros nunca se retiran.',
    ],
    endCondition: 'La partida termina al colocar la última loseta; después se resuelven las puntuaciones finales.',
    scoring: [
      'Ciudad completa: 2 PV por loseta y 2 PV por escudo/penón (al jugador con mayoría en la ciudad).',
      'Carretera completa: 1 PV por loseta.',
      'Monasterio completo (rodeado): 9 PV.',
      'Final de partida: ciudad incompleta 1 PV/loseta (+1/escudo), carretera incompleta 1 PV/loseta, monasterio 1 PV por loseta adyacente (incluida la suya) y campo: 3 PV por ciudad completa adyacente al campo.',
    ],
    forgotten: [
      { title: 'Feature ocupada', text: 'No puedes poner seguidor en una carretera, ciudad o campo que ya tenga alguno (tuyo o de otro). Debe estar libre.' },
      { title: 'Empates en features compartidas', text: 'Si dos seguidores acaban en la misma ciudad/carretera al conectarla, ambos puntúan al completarse (no hay mayoría: puntúa cada jugador con al menos 1 seguidor).' },
      { title: 'Solo en la loseta nueva', text: 'El seguidor debe ir en la loseta que acabas de colocar, y solo 1 por turno.' },
      { title: 'Loslita imposible', text: 'Si demuestras que tu loseta no encaja en ningún lugar, descártala y roba otra.' },
      { title: 'Los escudos', text: 'Cada escudo vale lo mismo que su loseta: 2 PV en ciudad completa, 1 PV al final.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'aventureros-europa',
    title: 'Aventureros al Tren: Europa',
    description: 'Conecta ciudades europeas reclamando rutas de tren antes que tus rivales.',
    playersMin: 2,
    playersMax: 5,
    durationMin: 60,
    difficulty: 2,
    setup: [
      'Cada jugador toma sus vagones (45) y coloca 1 en la casilla 0 del marcador de puntuación.',
      'Reparte 4 cartas de vagón a cada jugador.',
      'Reparte 3 billetes de destino a cada jugador: debe conservar al menos 2 (los descartados van al fondo del mazo).',
      'Reparte 1 billete de ruta larga a cada jugador.',
      'Prepara 5 cartas de vagón boca arriba junto al mazo.',
      'Cada jugador recibe sus 3 estaciones.',
    ],
    turn: [
      'Elige UNA acción: robar 2 cartas de vagón (las locomotoras visibles cuentan como 2; si tomas 1 locomotora visible, se acaba tu robo).',
      '…o reclamar una ruta de la mesa pagando cartas del color correcto (los túneles exigen girar 3 cartas del mazo: cada coincidencia de color añade 1 carta extra).',
      '…o construir una estación (máx. 1 por turno, coste creciente en cartas).',
      '…o robar nuevos billetes de destino (debes conservar al menos 1).',
    ],
    endCondition: 'Cuando a un jugador le quedan 2 vagones o menos tras construir, se anuncia «último turno»: todos hacen un turno más y se puntúa.',
    scoring: [
      'Rutas: según la tabla del tablero (de 1 a 21 PV: a mayor longitud, más puntos).',
      'Billetes de destino completados: suman; sin completar: restan (la ruta larga también).',
      'Estaciones no usadas: +4 PV cada una.',
      'Desempate: gana quien tenga la ruta continua más larga de la mesa.',
    ],
    forgotten: [
      { title: 'Túneles', text: 'Al reclamar un túnel, gira 3 cartas del mazo: por cada que coincida con el color pagado, añade 1 carta más. Si no puedes pagar, pierdes la acción (y las cartas ya jugadas).' },
      { title: 'Ferries (rutas grises)', text: 'Requieren locomotoras: el número impreso en la ruta.' },
      { title: 'Locomotora visible', text: 'Si coges una locomotora de las 5 visibles, cuenta como tus 2 cartas y no puedes coger otra. Tras reponer, si hay 3+ locomotoras visibles, se descartan las 5 y se reponen.' },
      { title: 'Estaciones', text: 'Una estación te permite usar una ruta ajena para conectar tus billetes (1 estación = 1 ruta). Coste: 1 carta la 1ª, 2 la 2ª, 3 la 3ª.' },
      { title: 'Una sola acción', text: 'No puedes mezclar: robar cartas O reclamar O estación O billetes.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'azul',
    title: 'Azul',
    description: 'Decora el muro del palacio con azulejos portugueses sin romperte la cabeza.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 45,
    difficulty: 2,
    setup: [
      'Cada jugador toma su tablero de jugador (muro por una cara, patrón por otra) y su línea de suelo.',
      'Coloca en la mesa tantas fábricas como jugadores + 2 (5 a 2 jugadores, 7 a 3, 9 a 4).',
      'Llena cada fábrica con 4 azulejos de la bolsa.',
      'Coloca la loseta de primer jugador en el centro de la mesa.',
      'Decide quién empieza.',
    ],
    turn: [
      '1. Toma TODOS los azulejos de un mismo color de una fábrica (el resto va al centro) o del centro (si eres el primero en coger del centro, también te llevas la loseta de primer jugador).',
      '2. Coloca los azulejos en una sola línea de patrón que acepte ese color y tenga espacio; los que no caben van a tu línea de suelo (penalizan).',
      '3. Puntúa la línea donde acabas de colocar: 1 PV por azulejo + enlaces con azulejos adyacentes en el muro (horizontales y verticales).',
    ],
    endCondition: 'La ronda acaba cuando no quedan azulejos en fábricas ni en el centro. La partida termina al final de la ronda en que algún jugador complete una fila horizontal de su muro.',
    scoring: [
      'Colocación: 1 PV por azulejo colocado + 1 PV por cada azulejo conectado en línea (horizontal o vertical) desde su posición en el muro.',
      'Suelo: penalizaciones por casilla ocupada: -1, -1, -2, -2, -2, -3, -3 (la loseta de 1er jugador ocupa la primera).',
      'Final: +2 PV por fila horizontal completa, +7 PV por columna completa y +2 PV por cada color con los 5 azulejos en el muro.',
    ],
    forgotten: [
      { title: 'Primera toma del centro', text: 'Quien primero coge azulejos del centro se lleva la loseta de primer jugador (va a su suelo: -1) y será el primero la próxima ronda.' },
      { title: 'Restricción de color', text: 'Una línea de patrón solo acepta azulejos de su color asignado (mirando el muro) y no puedes colocar en una línea llena. Lo que sobre siempre puede ir al suelo.' },
      { title: 'Fin de partida', text: 'El fin se comprueba al TERMINAR la ronda (nadie pierde turnos): se puntúa el suelo y se aplican bonus.' },
      { title: 'Empieza la siguiente ronda', text: 'El jugador con la loseta de primer jugador rellena las fábricas y juega primero.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'splendor',
    title: 'Splendor',
    description: 'Colección de gemas, tarjetas de desarrollo y nobles que visitan tu tienda.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 30,
    difficulty: 2,
    setup: [
      'Baraja las cartas por niveles (I, II, III) y revela 4 de cada nivel.',
      'Revela tantos nobles como jugadores + 1 (3 a dos jugadores, 4 a tres, 5 a cuatro).',
      'Prepara las fichas: 4 de cada gema a 2 jugadores, 5 a tres, 7 a cuatro; y 5 de oro ( comodines).',
      'Decide quién empieza; el juego va en el sentido de las agujas del reloj.',
    ],
    turn: [
      'Elige UNA acción: coger fichas: 3 de colores distintos o 2 del mismo color (solo si quedan 4+ de ese color).',
      '…o reservar 1 carta (de la mesa o la primera del mazo) y coger 1 ficha de oro si queda.',
      '…o comprar 1 carta de desarrollo pagando su coste con fichas (el oro es comodín).',
    ],
    endCondition: 'Cuando un jugador alcanza 15 PV, se termina la ronda actual y gana quien tenga más puntos (desempate: menos cartas compradas).',
    scoring: [
      'Cada carta comprada muestra sus PV (esquina superior izquierda).',
      'Los nobles dan 3 PV: se toman automáticamente al inicio de tu turno si tus cartas cubren sus requisitos.',
    ],
    forgotten: [
      { title: 'Límite de 10 fichas', text: 'Nunca puedes tener más de 10 fichas (oro incluido). Si te pasas al final de tu turno, devuelves el exceso.' },
      { title: 'El oro solo se gana reservando', text: 'Las 5 fichas de oro solo se obtienen al reservar una carta (1 por reserva).' },
      { title: 'Las cartas son gemas permanentes', text: 'Una carta comprada te da su bono de gema para siempre: reduce los costes futuros.' },
      { title: 'Un noble por turno', text: 'Como mucho tomas 1 noble por turno, al comienzo de tu turno, incluso si cumples varios.' },
      { title: 'Reservar', text: 'Puedes reservar la carta superior de cualquier mazo sin mirarla antes.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'small-world',
    title: 'Small World',
    description: 'Razas absurdas que conquistan un mundo demasiado pequeño para todas.',
    playersMin: 2,
    playersMax: 5,
    durationMin: 80,
    difficulty: 3,
    setup: [
      'Monta el tablero correspondiente al número de jugadores.',
      'Baraja razas y poderes especiales por separado y forma 6 combinaciones visibles en fila.',
      'El primer jugador elige una combinación gratis; saltar combinaciones cuesta 1 PV por cada una saltada (las monedas se dejan sobre las combinaciones saltadas, que luego se lleva quien las elija).',
      'Cada jugador toma todas las fichas de su raza y 5 PV de victoria iniciales.',
      'Coloca el marcador de turnos según el número de jugadores (la partida tiene un nº fijo de turnos: 8 a dos jugadores, 10 a 3-4, 11 a cinco).',
    ],
    turn: [
      '1. (Opcional) Declina tu raza activa: se queda quieta en el tablero siguiendo puntuando, boca abajo.',
      '2. Si no tienes raza activa, elige una combinación nueva (pagando saltos si aplica) y coloca sus fichas en regiones del borde.',
      '3. Conquista: paga en fichas cada región (normalmente 2 fichas + defensas extra, p. ej. montañas +1); si te quedas sin fichas, puedes hacer una única conquista final con el dado de refuerzos.',
      '4. Repliegue: retira fichas dejando 1 por región y prepara tu turno siguiente.',
      'Al final de tu turno, cobra 1 PV por cada región que controles (activa + declinada), más bonus de raza/poder.',
    ],
    endCondition: 'La partida acaba al terminar el último turno del marcador. Gana quien tenga más PV.',
    scoring: [
      '1 PV por región ocupada al final de cada uno de tus turnos (razas activas y declinadas).',
      'Bonus extra de raza o poder especial (lee bien tu combinación).',
      'Los PV que dejaste al saltar combinaciones se los queda quien las coja.',
    ],
    forgotten: [
      { title: 'Conquistar', text: 'Coste: 2 fichas +1 por montaña +1 por defensa de raza/poder. Las regiones vacías del borde valen 1 ficha menos para ENTRAR en el mapa.' },
      { title: 'Dado de refuerzos', text: 'Solo 1 conquista por turno puede usar el dado: tira y suma el valor para pagar la última región que no te alcance.' },
      { title: 'Declinar', text: 'La raza en declive no se mueve nunca más y solo puntúa 1 PV/región (salvo poderes que digan otra cosa). Al declinar pierdes tu poder especial (salvo razas que lo conservan).' },
      { title: 'Repliegue obligatorio', text: 'Tras conquistar, deja exactamente 1 ficha por región (o las que dicte tu poder) y agrupa el resto en mano para el próximo turno.' },
      { title: 'Combinaciones nuevas', text: 'Al salir una combinación de la fila, revela otra; las monedas acumuladas sobre ella se las lleva quien la elija.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'decrypto',
    title: 'Decrypto',
    description: 'Pistas cifradas, códigos de 3 dígitos y la eterna duda del equipo rival.',
    playersMin: 3,
    playersMax: 8,
    durationMin: 30,
    difficulty: 3,
    setup: [
      'Divide a los jugadores en 2 equipos (mínimo 2 por equipo).',
      'Cada equipo coge una tarjeta de 4 palabras clave numeradas (1-4) y la coloca de pie para que solo la vea su equipo.',
      'Prepara las tarjetas de código y las fichas blancas (interceptación) y negras (descomunicación) a la vista.',
      'Decide qué equipo empieza.',
    ],
    turn: [
      '1. Un jugador del equipo activo roba una tarjeta de código (3 dígitos del 1 al 4) que solo él ve.',
      '2. Ese jugador da una pista por dígito, EN ORDEN (la 1ª pista corresponde al 1er dígito, etc.). No puede usar la palabra clave ni derivados.',
      '3. El equipo rival intenta INTERCEPTAR: anota en secreto qué código creen que es. Si aciertan, ganan 1 ficha blanca.',
      '4. Tu propio equipo intenta adivinar su propio código: si fallan, ganan 1 ficha negra.',
    ],
    endCondition: 'Gana el primer equipo que consiga 2 fichas blancas (interceptaciones). Si un equipo acumula 2 fichas negras, pierde automáticamente (y gana el otro).',
    scoring: [
      'Ficha blanca: por interceptar correctamente el código rival (2 para ganar).',
      'Ficha negra: por fallar tu propio código (2 = derrota instantánea).',
    ],
    forgotten: [
      { title: 'Las pistas, en orden', text: 'La pista 1 siempre describe el dígito 1, la 2 el dígito 2 y la 3 el dígito 3. Decir el orden es parte del juego.' },
      { title: 'Pistas prohibidas', text: 'No puedes usar la palabra clave ni variantes/descripciones directas (tipo «número 3» o «se escribe con…»). El espíritu: pistas creativas pero jugables.' },
      { title: 'Tu equipo puede consultar la tarjeta', text: 'Los compañeros del equipo emisor pueden mirar sus 4 palabras mientras escuchan las pistas; el emisor no puede responder preguntas.' },
      { title: 'No repitas pistas', text: 'No vale reutilizar una pista dada antes para la misma palabra clave.' },
      { title: 'Victoria doble', text: 'Un equipo puede ganar por 2 blancas aunque el otro ya tenga 1 negra: las fichas negras no dan la victoria, solo la derrota.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'codenames',
    title: 'Codenames',
    description: 'Dos spymasters, 25 palabras y un solo código para encontrar a sus agentes.',
    playersMin: 4,
    playersMax: 8,
    durationMin: 15,
    difficulty: 2,
    setup: [
      'Coloca 25 cartas de palabra en la cuadrícula de 5×5.',
      'El spymaster de cada equipo mira una carta clave que muestra qué palabras son de cada equipo (9 el equipo que empieza, 8 el otro), neutrales (7) y el asesino (1).',
      'Los operativos NO pueden ver ninguna carta clave.',
      'Empieza el equipo con 9 palabras.',
    ],
    turn: [
      '1. El spymaster da una pista: UNA palabra + UN número (el nº de palabras del tablero relacionadas).',
      '2. Sus operativos debaten en voz alta y tocan 1 palabra: si es de su color, siguen (hasta nº + 1 intentos en total).',
      '3. Si tocan una palabra neutral o del rival, su turno termina (la palabra se cubre con su color correspondiente).',
    ],
    endCondition: 'Gana el primer equipo que encuentre todas sus palabras. Tocar al asesino = derrota inmediata.',
    scoring: [
      'No hay puntos: solo ganar encontrando a todos tus agentes antes.',
    ],
    forgotten: [
      { title: 'Pistas válidas', text: 'Una palabra + un número. Nada de frases, rimas explicadas, gestos ni miraditas. Palabras compuestas inventadas («azul-cielo») solo si tu grupo las acepta ANTES.' },
      { title: 'Intentos', text: 'Tenéis «número + 1» intentos; podéis parar antes. Cualquier fallo (neutral o rival) termina el turno.' },
      { title: 'El asesino', text: 'Tocar la palabra asesina pierde la partida al instante (los spymasters deben evitar acercar la pista).' },
      { title: 'Póker face', text: 'Los spymasters no pueden reaccionar a las decisiones de sus operativos: ni un gesto.' },
      { title: 'Turnos encadenados', text: 'Si el turno pasa al otro equipo por tocar su palabra, esa palabra les queda cubierta: ¡beneficio gratis para ellos!' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'dixit',
    title: 'Dixit',
    description: 'Pistas evocadoras y cartas de ensueño: ni demasiado obvias, ni imposibles.',
    playersMin: 3,
    playersMax: 6,
    durationMin: 30,
    difficulty: 1,
    setup: [
      'Reparte 6 cartas a cada jugador.',
      'Cada jugador coge su ficha de voto numerada y su set de fichas de voto.',
      'Elige quién será el primer narrador.',
    ],
    turn: [
      '1. El narrador dice en voz alta una pista: una palabra, una frase o incluso un sonido (sin mostrar su carta).',
      '2. Los demás eligen en secreto 1 carta de su mano que encaje con la pista y la entregan boca abajo al narrador.',
      '3. El narrador baraja todas las cartas (incluida la suya) y las coloca boca arriba numeradas en la fila.',
      '4. Todos (menos el narrador) votan en secreto cuál creen que es la del narrador (no puedes votar tu propia carta).',
      '5. Se revelan los votos y se puntúa.',
    ],
    endCondition: 'La partida termina cuando el mazo se agota (o alguien alcanza 30 PV si preferís esa variante). Gana quien tenga más PV.',
    scoring: [
      'Si ALGUNOS (pero no todos) acertaron: cada acertador +3 y el narrador +3.',
      'Si TODOS o NADIE acertaron: el narrador +0 y los demás +2 cada uno.',
      'Cada jugador gana +3 por cada voto recibido en su carta (que no sea la del narrador).',
    ],
    forgotten: [
      { title: 'El narrador no vota', text: 'Su trabajo ya está hecho: solo recoge las cartas, las baraja y las numera.' },
      { title: 'No votes tu carta', text: 'Está prohibido votar tu propia carta: intenta leer la mente del narrador, no la tuya.' },
      { title: 'El arte de la pista', text: 'La pista ideal acierta algunos y falla otros: demasiado obvia = todos aciertan (0 PV para ti); demasiado rara = nadie (0 PV).' },
      { title: 'Reposición', text: 'Tras cada ronda, todos roban hasta tener 6 cartas de nuevo. El narrador rota a la izquierda.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'siete-maravillas',
    title: '7 Wonders',
    description: 'Civilizaciones en 3 edades: cartas que pasan de mano en mano mientras tu ciudad crece.',
    playersMin: 3,
    playersMax: 7,
    durationMin: 30,
    difficulty: 3,
    setup: [
      'Reparte 1 tablero de maravilla aleatorio a cada jugador y 3 monedas de valor 1.',
      'Prepara los 3 mazos por edad (I, II y III), barajando los gremios dentro del mazo de edad III.',
      'Reparte 7 cartas de edad I a cada jugador.',
      'El jugador con la cara más «sabia» empieza (o el más joven).',
    ],
    turn: [
      '1. Elige 1 carta de tu mano y haz UNA cosa: construir el edificio (pagando su coste o usando cadena), construir una etapa de tu maravilla (pagando su coste, la carta se descarta boca abajo) o descartarla por 3 monedas.',
      '2. Todos revelan a la vez y resuelven sus acciones.',
      '3. Pasa el resto de tu mano al vecino (izquierda en edades I y III, derecha en edad II) y repite.',
      'Al final de cada edad: compara fuerza militar con tus 2 vecinos (fichas +1/+3/+5 por edad, -1 al perdedor).',
    ],
    endCondition: 'La partida acaba al final de la edad III (cuando se juega la última mano de 2 cartas; la última carta se descarta).',
    scoring: [
      'Conflictos militares: fichas +1, +3 y +5 según la edad (perdedor: -1).',
      'Monedas: cada 3 monedas = 1 PV.',
      'Etapas de maravilla, cartas azules (PV fijos), gremios (según condición) y amarillas (PV condicionales).',
      'Ciencia: cada conjunto de los 3 símbolos = 7 PV; cada par de símbolos iguales = n² (4, 9, 16…).',
    ],
    forgotten: [
      { title: 'Dirección del pase', text: 'Edades I y III: se pasa a la IZQUIERDA; edad II: a la DERECHA. Se juega el símbolo de la parte trasera de las cartas.' },
      { title: 'Comprar a vecinos', text: 'Si te falta un recurso, puedes comprarlo a un vecino por 2 monedas (el vecino NO pierde el recurso; tú solo puedes comprar a tus 2 vecinos directos).' },
      { title: 'Cadenas', text: 'Los edificios con nombre (color púrpura del icono) que ya tienes permiten construir el siguiente gratis (icono pequeño bajo el coste).' },
      { title: 'Última mano', text: 'En la última mano de 2 cartas, se juega 1 y se descarta la otra boca abajo (nadie la ve).' },
      { title: 'Militar solo con vecinos', text: 'La fuerza militar solo se compara con tus vecinos inmediatos, y cada edad se re-compara desde cero.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'love-letter',
    title: 'Love Letter',
    description: '16 cartas, un único favor de la princesa y muchísimas mentirillas.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 15,
    difficulty: 1,
    setup: [
      'Baraja las 16 cartas y quita 1 boca abajo (nadie la mira: un misterio más).',
      'Reparte 1 carta a cada jugador.',
      'Coloca los tokens de favor a un lado: ganará rondas quien se quede con la carta más alta al final.',
      'Empieza el jugador que haya ganado la última partida (o el más joven).',
    ],
    turn: [
      '1. Roba 1 carta (tendrás 2 en mano).',
      '2. Juega 1 de las 2 y aplica su efecto (a veces a un rival concreto).',
      'Se eliminan deducciones: con el Guardia, adivina cartas; con el Barón, compara en secreto; con el Príncipe, fuerza descartes…',
    ],
    endCondition: 'La ronda acaba cuando se acaba el mazo: gana quien tenga la carta MÁS ALTA en mano (desempate: mayor suma de descartes) o cuando todos menos uno quedan eliminados. La partida la gana quien gane suficientes rondas de favor.',
    scoring: [
      'Cada ronda ganada = 1 token de favor.',
      'Para ganar la partida: 7 tokens a 2 jugadores, 5 a 3, 4 a cuatro.',
    ],
    forgotten: [
      { title: 'La Condesa (7)', text: 'Si tienes el Rey (6) o el Príncipe (5) en mano, DEBES jugar la Condesa (puedes mentir… pero si te retan y mientes, pierdes). Mejor: jugarla siempre es seguro.' },
      { title: 'El Guardia (1)', text: 'Nombra un jugador y una carta que no sea Guardia. Si aciertas, ese jugador queda eliminado. Con 5 Guardias en el mazo, es la carta más jugada.' },
      { title: 'La Mucama (4)', text: 'Te protege de TODOS los efectos hasta tu próximo turno: nadie puede elegirla a ti (ni Guardia, ni Barón, ni Rey, ni Príncipe).' },
      { title: 'El Príncipe (5)', text: 'Fuerza a cualquier jugador (¡incluido tú!) a descartar su mano y robar nueva. Si se descarta la Princesa así, queda eliminado.' },
      { title: 'La Princesa (8)', text: 'Si la juegas o la descartas por cualquier motivo, quedas eliminado. Guárdala como último recurso.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'kingdomino',
    title: 'Kingdomino',
    description: 'Elige fichas de dominó para construir el reino más rentable junto al castillo.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 20,
    difficulty: 1,
    setup: [
      'Coloca el castillo de cada jugador en el centro de su cuadrícula de 5×5 (7×7 a 2 jugadores).',
      'Prepara el mazo: a 3 jugadores retira 12 fichas; a 2 jugadores juega con la mitad (24) y cuadrícula 7×7.',
      'Revela la primera fila de fichas: 3 a tres jugadores y 4 a dos o cuatro; ordénalas de menor a mayor número.',
      'Ordena las fichas reveladas por su número (menor a la izquierda) y coloca el rey del primer jugador junto a la ficha más baja.',
    ],
    turn: [
      '1. Por orden de colocación de reyes (la ficha con el número más bajo elige primero), cada jugador coge 1 ficha de la fila y coloca su rey en la siguiente fila revelada.',
      '2. Coloca la ficha en tu reino: adyacente a tu castillo o a una ficha previa, tocando al menos 1 lado del mismo terreno (el castillo es comodín).',
      '3. Repite hasta agotar las 12 rondas.',
    ],
    endCondition: 'La partida termina cuando se colocan todas las fichas (12 rondas).',
    scoring: [
      'Por cada región conectada del mismo terreno: nº de casillas × nº de coronas de esa región.',
      'Cada casilla vacía dentro de tu cuadrícula al final: -1 PV.',
    ],
    forgotten: [
      { title: 'Orden de selección', text: 'Los reyes marcan el orden: la ficha con el número más bajo de la fila anterior elige primero la nueva fila. ¡Planificar el orden es media partida!' },
      { title: 'Conexión obligatoria', text: 'La ficha debe tocar tu reino y al menos un lado debe coincidir en terreno (o tocar el castillo, que conecta con todo).' },
      { title: 'Ficha que no cabe', text: 'Si no puedes (o quieres) colocar la ficha legalmente, se descarta: no hay penalización, pero pierdes el turno.' },
      { title: 'Límite de cuadrícula', text: 'Todo debe caber en 5×5 (7×7 a 2 jugadores): fichas que sobresalgan no se pueden colocar.' },
      { title: 'Coronas multiplican', text: 'Las coronas se suman dentro de la región conectada y multiplican a TODAS sus casillas: una región de 6 praderas con 3 coronas = 18 PV.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'sushi-go',
    title: 'Sushi Go!',
    description: 'Coge piezas de sushi que pasan en cinta y arma el menú más sabroso.',
    playersMin: 2,
    playersMax: 5,
    durationMin: 15,
    difficulty: 1,
    setup: [
      'Reparte cartas: 10 a 2 jugadores, 9 a tres, 8 a cuatro y 7 a cinco.',
      'Las cartas sobrantes no se usan en la partida (solo en Sushi Go Party!).',
      'Coloca el marcador de las 3 rondas a la vista.',
    ],
    turn: [
      '1. Elige en secreto 1 carta de tu mano y ponla boca abajo delante de ti.',
      '2. Todos revelan a la vez.',
      '3. Pasa tu mano RESTANTE al jugador de la IZQUIERDA y repite.',
      'Se juegan 3 rondas; al final de cada una se puntúa y se recogen las cartas jugadas.',
    ],
    endCondition: 'La partida acaba tras puntuar la 3ª ronda (incluidos los puddings).',
    scoring: [
      'Tempura: 2 cartas = 5 PV. Sashimi: 3 cartas = 10 PV.',
      'Dumplings: 1/2/3/4/5 cartas = 1/3/6/10/15 PV.',
      'Maki: mayoría de iconos = 6 PV; 2ª mayoría = 3 PV (empates: todos los empatados puntúan).',
      'Nigiri: 1/2/3 PV según tipo; sobre wasabi se multiplica ×2. Puddings: mayoría al final +6 PV; minoría -6 PV (se cuentan entre las 3 rondas).',
    ],
    forgotten: [
      { title: 'Se pasa a la izquierda', text: 'La mano siempre viaja hacia tu IZQUIERDA (contra lo que muchos recuerdan).' },
      { title: 'Wasabi', text: 'Solo multiplica (×2) el nigiri que colocas JUSTO DESPUÉS de jugarlo. Un wasabi solo no vale nada.' },
      { title: 'Puddings', text: 'Se guardan entre rondas y se puntúan una sola vez al final: mayoría +6, última posición -6 (empates a la mayoría: todos +6).' },
      { title: 'Makis', text: 'Cuentan los ICONOS de maki impresos, no las cartas. Empate a mayoría: todos los empatados +6 y el siguiente +3.' },
      { title: 'Palillos', text: 'Si ya tienes palillos boca arriba, en tu turno puedes decir «¡Sushi Go!», jugar 2 cartas de tu mano y descartar los palillos.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'coup',
    title: 'Coup',
    description: 'Bluf, desafíos y cinco personajes con poderes… que quizá ni tengas.',
    playersMin: 2,
    playersMax: 6,
    durationMin: 15,
    difficulty: 2,
    setup: [
      'Baraja las 15 cartas de personaje (3 de cada uno).',
      'Reparte 2 cartas boca abajo a cada jugador: son tus 2 influencias (secretas).',
      'Da 2 monedas a cada jugador.',
      'Coloca el mazo de la corte en el centro como reserva de intercambio.',
    ],
    turn: [
      '1. Toma una acción: Ingreso (+1), Ayuda extranjera (+2, el Duque puede bloquearla), Impuestos (+3, como Duque), Robo (+2 a un rival, como Capitán), Intercambio (como Embajador), Asesinato (7 monedas, la Condesa puede bloquearlo) o Golpe de estado (7 monedas, imbloqueable).',
      '2. Los demás pueden BLOQUEAR (afirmando tener el personaje adecuado) o DESAFIAR tu acción o bloqueo.',
      '3. Resuelve desafíos: quien mienta revela y pierde 1 influencia; quien decía la verdad baraja su carta y roba otra igual, y el retador pierde 1 influencia.',
    ],
    endCondition: 'Gana el último jugador que conserve influencias.',
    scoring: [
      'No hay puntuación: solo la supervivencia. Pierdes al revelar tus 2 influencias.',
    ],
    forgotten: [
      { title: 'Desafíos', text: 'Puedes desafiar CUALQUIER afirmación (acción o bloqueo). Si te retan y mentías: revelas 1 influencia. Si decías verdad: el retador revela y tú barajas esa carta y robas otra igual (¡no conservas la misma física!).' },
      { title: 'Golpe obligatorio con 10+', text: 'Al empezar tu turno con 10 o más monedas, DEBES dar un golpe de estado (7 monedas, elimina 1 influencia sin posibilidad de bloqueo ni desafío).' },
      { title: 'Mentir es legal', text: 'Puedes decir cualquier personaje aunque no lo tengas. El riesgo es el desafío, y el bluf es el corazón del juego.' },
      { title: 'Elegir qué revelar', text: 'Al perder una influencia, TÚ eliges cuál revelar (queda boca arriba y fuera de juego).' },
      { title: 'Bloqueos', text: 'El Duque bloquea la ayuda extranjera; el Capitán y el Embajador bloquean el robo; la Condesa bloquea el asesinato. Solo el golpe de estado no se puede bloquear.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'wingspan',
    title: 'Wingspan',
    description: 'El engine builder de aves: comida, huevos y cadenas de poderes encantadores.',
    playersMin: 1,
    playersMax: 5,
    durationMin: 70,
    difficulty: 4,
    setup: [
      'Cada jugador toma su tablero de aves y 8 cubos de acción.',
      'Revela 3 aves en la bandeja y prepara el comedero con 5 dados.',
      'Cada jugador roba cartas de bonificación y conserva 1 (según la tabla de setup del reglamento).',
      'Coloca las cartas de objetivo de ronda y el marcador de turnos (el nº de rondas depende de los jugadores).',
      'Reparte las aves y comida iniciales según la tabla de setup del reglamento (varía con el orden de jugador).',
    ],
    turn: [
      'Elige UNA acción y coloca un cubo de izquierda a derecha en esa fila: jugar un ave (paga su coste y colócala en el hueco), activar el bosque (comida), la pradera (huevos) o el agua (robar aves).',
      'Cada fila usada activa, de izquierda a derecha, los poderes marrones de las aves a la IZQUIERDA del cubo recién colocado.',
      'Primera vez en una fila: gratis; usos posteriores en la misma fila cuestan los huevos impresos en la casilla.',
      'Al final de cada ronda: se puntúa el objetivo de ronda, se retiran los cubos y se rellena la bandeja.',
    ],
    endCondition: 'La partida dura 4 rondas; al final se puntúa todo.',
    scoring: [
      'PV impresos en cada ave jugada.',
      'Huevos: 1 PV cada uno (en cualquier fila).',
      'Comida almacenada bajo las cartas: 1 PV cada una; cartas bajo el ala (tucked): 1 PV cada una.',
      'Cartas de bonificación (1 por jugador al inicio) + objetivos de ronda ya puntuados.',
    ],
    forgotten: [
      { title: 'Cubos y coste de huevos', text: 'El primer uso de cada fila es gratis; el 2º cuesta 1 huevo (impreso en la casilla), el 3º 2… Los cubos se retiran solo al final de la ronda.' },
      { title: 'Poderes marrones', text: 'Se activan SOLO al usar esa fila y solo las aves situadas a la izquierda del cubo que acabas de colocar, de izquierda a derecha.' },
      { title: 'Poderes rosas (una vez)', text: 'Los poderes rosas se activan una sola vez cuando se cumple su condición (cuando otra ave se juega, al robar, etc.), no en cada turno.' },
      { title: 'Bandeja de aves', text: 'Siempre que la bandeja quede con menos de 3 aves, se rellena hasta 3 desde el mazo (nunca desde el descarte).' },
      { title: 'Comedero', text: 'Si no quedan dados en el comedero, se vuelven a tirar los 5 antes de que nadie coja comida.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'root',
    title: 'Root',
    description: 'Guerra asimétrica en el bosque: cada facción se juega de forma totalmente distinta.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 90,
    difficulty: 5,
    setup: [
      'Cada jugador elige (o recibe) una facción y toma SU tablero: los Gatos de Marquise, la Dinastía Eyrie, la Alianza del Bosque o el Vagabundo en la partida base.',
      'Sigue la preparación propia de cada facción (en su tablero): colocación inicial de piezas, cartas y marcadores de puntos de victoria.',
      'Prepara el mazo compartido y las cartas de crafting (objetos) a la vista.',
      'Coloca los puntos de victoria de cada facción en 0 y sus marcadores de estado según el reglamento.',
      'La preparación se resuelve en orden de facción (Gatos → Eyrie → Alianza → Vagabundo); después se juega en el sentido de las agujas del reloj.',
    ],
    turn: [
      'Cada facción tiene su propio turno, pero todas comparten la estructura: Amanecer (Birdsong), Día (Daylight), Atardecer (Evening) y Noche (Night).',
      'Los Gatos construyen y fabrican con madera; los Eyrie programan decrets (¡y si no pueden cumplir, se revuelven!); la Alianza conspira y propaga simpatía; el Vagabundo recorre el bosque ayudando.',
      'Batallas: atacante y defensor tiran 1 dado cada uno (los dados se leen en la fila de batalla del tablero); el que saque más elimina piezas rivales según el valor impreso y puntúa PV.',
    ],
    endCondition: 'Gana el primero que llegue a 30 PV (o quien cumpla una carta de dominación si se usan).',
    scoring: [
      'PV por batallas ganadas: según las piezas enemigas eliminadas (edificios y tokens valen su PV impreso; guerreros no puntúan).',
      'Cada facción puntúa además por su propio motor: gatos por edificios, eyrie por decrets, alianza por simpatía, vagabundo por objetos y favores.',
    ],
    forgotten: [
      { title: 'Cada facción es un juego distinto', text: 'Antes de empezar, que cada jugador lea su tablero: los 4 turnos son tan distintos que no hay «regla general» más allá de las 4 fases.' },
      { title: 'Las batallas', text: 'Ambos tiran un dado: el mayor valor gana, pero el daño se limita a lo impreso (máx. eliminar según el dado y la pieza). Empate: no ocurre nada.' },
      { title: 'Regla del golpe de mano (rule moves)', text: 'Los movimientos se hacen por claros conectados por caminos; no se puede cruzar claros con piezas enemigas salvo reglas de dominio.' },
      { title: 'Eyrie: el decreto', text: 'Los Eyrie AÑADEN cartas a su decree cada turno y deben cumplir todo lo programado. Si algo es imposible, se revuelven: pierden piezas y PV. Planifica siempre.' },
      { title: 'Qué puntúa en batalla', text: 'Los guerreros eliminados NO dan PV; los edificios y tokens sí (según su valor impreso). El objetivo real es destruir infraestructura.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'jaipur',
    title: 'Jaipur',
    description: 'Duelo de mercaderes: camellos, especias y el arte de vender grande.',
    playersMin: 2,
    playersMax: 2,
    durationMin: 30,
    difficulty: 2,
    setup: [
      'Coloca 5 cartas de mercado boca arriba en el centro.',
      'Reparte 5 cartas a cada jugador.',
      'Prepara los montones de fichas de cada mercancía en orden descendente de valor (las más valiosas arriba).',
      'Prepara las fichas de bonificación (3/4/5 cartas) y los 3 sellos de excelencia a un lado.',
    ],
    turn: [
      'Toma mercancías: coge 1 carta del mercado pagando con 1 de tu mano (o más cartas/camellos si llevas varias: por cada carta extra que cojas, pagas 1 camello).',
      '…o vende: descarta al menos 2 cartas iguales de un tipo y coge las fichas superiores de su montón, más fichas de bonificación si vendes 3+.',
      '…o intercambia camellos: cambia 2+ cartas de tu mano/rebaño con el mercado en intercambio equivalente o mejor.',
    ],
    endCondition: 'La ronda termina al agotarse las fichas de 3 tipos de mercancía (o el mazo). Gana la ronda el jugador con mayor valor total; en empate, quien tenga más camellos.',
    scoring: [
      'Fichas de mercancía robadas al vender (cuanto antes vendas, más valen: el montón se agota de arriba abajo).',
      'Fichas de bonificación por vender 3, 4 o 5 cartas de golpe.',
      'Los camellos no dan valor por sí mismos: son moneda de cambio y deciden el desempate de la ronda (gana quien tenga más).',
    ],
    forgotten: [
      { title: 'Los camellos no van en la mano', text: 'Van a tu «rebaño», no cuentan para el límite de 7 cartas y se usan como moneda de cambio.' },
      { title: 'Límite de 7 cartas', text: 'Si al coger carta te pasas de 7 en mano, debes descartar inmediatamente hasta volver al límite.' },
      { title: 'Coger más de 1 carta', text: 'Puedes coger varias cartas iguales del mercado, pero por cada una extra pagas 1 camello.' },
      { title: 'El partido', text: 'Jaipur se juega al mejor de 3 rondas: gana la ronda quien más valor tenga; quien gane 2 rondas se lleva el partido.' },
      { title: 'Vende pronto', text: 'Las fichas superiores de cada montón son las más valiosas: quien vende antes se lleva los valores altos (especialmente con las especias caras).' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'hanabi',
    title: 'Hanabi',
    description: 'Cooperativo de fuegos artificiales… con las cartas de los demás, nunca las tuyas.',
    playersMin: 2,
    playersMax: 5,
    durationMin: 25,
    difficulty: 3,
    setup: [
      'Reparte cartas: 5 a cada jugador con 2-3 jugadores, 4 con 4-5.',
      'CADA jugador sostiene sus cartas de forma que las vean los DEMÁS (¡nunca tú!).',
      'Coloca 8 fichas de reloj (información) y 3 fichas de mecha (errores).',
      'Prepara el descarte y la zona de fuegos artificiales (5 colores).',
    ],
    turn: [
      'Elige UNA acción: dar información (gasta 1 ficha de reloj): indica a un jugador TODAS las cartas de un color O de un número concreto que tenga en mano.',
      '…o descartar 1 carta (recuperas 1 ficha de reloj, hasta el máximo de 8).',
      '…o jugar 1 carta al fuego artificial: si encaja (siguiente número de ese color), se coloca; si no, pierdes 1 ficha de mecha y la carta va al descarte.',
    ],
    endCondition: 'La partida acaba si perdéis las 3 fichas de mecha, si completáis los 5 colores hasta el 5, o cuando se acaba el mazo (cada jugador hace un último turno). Se puntúa la altura de los fuegos.',
    scoring: [
      '1-25 PV: la carta más alta jugada de cada color (0 en colores sin empezar).',
      'Referencia: 25 = perfecto; 20-24 = excelente; <15 = se puede mejorar.',
    ],
    forgotten: [
      { title: 'No mires tus cartas', text: 'Tus cartas miran hacia los demás y así debe quedarse: si se te caen y las ves, la honestidad manda declararlo.' },
      { title: 'Información verdadera y completa', text: 'Si dices «rojas», debes señalar TODAS las cartas rojas de esa mano; si dices «doses», todas los doses. Nunca puedes mentir ni omitir.' },
      { title: 'Descartar recarga', text: 'El descarte es la única forma de recuperar fichas de reloj: es un recurso, no un fracaso.' },
      { title: '3 mechas = fin', text: 'El tercer fallo termina la partida inmediatamente con la puntuación actual.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'the-mind',
    title: 'The Mind',
    description: 'Jugar 100 cartas en orden ascendente… sin poder decir ni pío.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 15,
    difficulty: 2,
    setup: [
      'Baraja las 100 cartas numeradas.',
      'Nivel 1: reparte 1 carta a cada jugador; nivel 2: 2 cartas; y así hasta el nivel final (12 a dos jugadores, 10 a tres, 8 a cuatro).',
      'Tomad las vidas (dardos) y las estrellas ninja que marca el reglamento para el número de jugadores; en niveles concretos se añaden más (revisad la tabla).',
      'Nadie puede mostrar sus cartas ni ordenarlas en voz alta.',
    ],
    turn: [
      'No hay turnos: cuando alguien «lo siente», juega 1 carta boca arriba en el centro.',
      'Si la carta jugada es MÁS BAJA que alguna carta en mano de otro jugador: ¡fallo! Se pierde 1 vida y todas las cartas menores se retiran.',
      'Consenso unánime para usar una estrella ninja: todos muestran y descartan su carta más baja.',
      'Se supera el nivel si todos juegan todas sus cartas sin quedarse sin vidas.',
    ],
    endCondition: 'Ganáis al completar el último nivel. Perdéis si os quedáis sin vidas (y se vuelve a empezar desde el nivel 1).',
    scoring: [
      'Cooperativo: la «puntuación» es el nivel alcanzado.',
    ],
    forgotten: [
      { title: 'Silencio absoluto', text: 'Prohibido hablar, señalar, gesticular o «organizar» nada. Todo el juego es leer el tempo de los demás.' },
      { title: 'El fallo', text: 'Al fallar se retiran del juego las cartas menores que la jugada (los que las tenían las enseñan y las quitan).' },
      { title: 'Estrella ninja', text: 'Requiere acuerdo de TODOS: cada jugador descarta boca arriba su carta más baja. Cada estrella se usa una sola vez y luego se descarta.' },
      { title: 'Vidas nuevas', text: 'Al superar ciertos niveles la tabla otorga vidas o estrellas extra: revisadla entre niveles.' },
      { title: 'Concentración inicial', text: 'La regla oficial del «momento zen»: antes del nivel más alto, todos cierran la mano y «conectan». ¡Funciona!' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'toma-6',
    title: '¡Toma 6!',
    description: 'Coloca tu carta en la fila correcta… o cómete los toros que dejen los demás.',
    playersMin: 2,
    playersMax: 10,
    durationMin: 30,
    difficulty: 1,
    setup: [
      'Reparte 10 cartas numeradas a cada jugador.',
      'Coloca 4 cartas boca arriba en el centro: cada una abre una fila.',
      'Nadie muestra su mano.',
    ],
    turn: [
      '1. Todos eligen en secreto 1 carta y la revelan a la vez.',
      '2. Se colocan de la MÁS BAJA a la más alta: cada carta va a la fila donde sea mayor que la última carta y con la menor diferencia posible.',
      '3. Si tu carta sería la 6ª de una fila: ¡tomas las 5 anteriores como penalización! y tu carta abre la fila.',
      '4. Si tu carta es más baja que los 4 topes de fila: eliges TÚ qué fila te comes.',
    ],
    endCondition: 'La partida termina tras 10 rondas (cuando se acaban las manos). Gana quien tenga MENOS toros.',
    scoring: [
      'Cada carta comida vale sus toros: terminación en 5 = 2 toros; en 0 = 3; doble dígito (11, 22, 33…) = 5; el 55 = 7; el resto = 1.',
      'Se suman los toros de todas las cartas recogidas durante la partida.',
    ],
    forgotten: [
      { title: 'Orden de resolución', text: 'Las cartas reveladas se colocan SIEMPRE de la más baja a la más alta (este orden lo cambia todo).' },
      { title: 'La fila de la menor diferencia', text: 'Tu carta va a la fila cuyo final sea inmediatamente inferior más cercano; no eliges fila libremente (salvo en el caso de carta menor que todas).' },
      { title: 'Carta menor que los 4 topes', text: 'Eliges qué fila recoges (normalmente la que menos toros tenga) y tu carta se convierte en el nuevo inicio de esa fila.' },
      { title: 'La 6ª carta', text: 'Coges las 5 cartas de la fila como penalización; tu carta queda como primera de la fila nueva.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'dobble',
    title: 'Dobble',
    description: 'Encuentra el único símbolo común entre dos cartas… más rápido que nadie.',
    playersMin: 2,
    playersMax: 8,
    durationMin: 10,
    difficulty: 1,
    setup: [
      'Elige una variante (la más jugada: «La Torre»).',
      'Reparte 1 carta boca abajo a cada jugador.',
      'Coloca el resto del mazo boca abajo en el centro: esa es «la torre».',
    ],
    turn: [
      'Todos dan la vuelta a su carta a la vez.',
      'Sin turnos: nombra EN VOZ ALTA el símbolo común entre TU carta y la carta superior de la torre.',
      'Quien lo nombra primero (y es correcto) se lleva la carta de la torre y la apila boca arriba delante (su carta nueva pasa a ser la siguiente en juego).',
      'Se revela la siguiente carta de la torre y se repite.',
    ],
    endCondition: 'La partida acaba cuando la torre se agota. Gana quien haya recogido más cartas.',
    scoring: [
      'No hay puntos: gana quien más cartas de la torre haya conseguido.',
    ],
    forgotten: [
      { title: 'Solo hay UN símbolo en común', text: 'Entre cualquier par de cartas de Dobble existe exactamente 1 símbolo compartido (matemáticas mágicas). Si crees ver dos, uno es otro símbolo parecido.' },
      { title: 'Nombrar antes de coger', text: 'Hay que decir el nombre del símbolo ANTES de coger la carta; coger sin nombrar no vale.' },
      { title: 'Símbolos parecidos', text: 'El manzana y el árbol, la gota y la bombilla… el tamaño y la inclinación pueden engañar: fíjate bien antes de gritar.' },
      { title: 'Otras variantes', text: '«El Pozo», «La Papa caliente»… todas usan la misma regla de oro: encontrar el símbolo común entre dos cartas.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'exploding-kittens',
    title: 'Exploding Kittens',
    description: 'Rusas de pantera: roba cartas y reza para que no haya un gatito con dinamita.',
    playersMin: 2,
    playersMax: 5,
    durationMin: 15,
    difficulty: 1,
    setup: [
      'Quita del mazo todos los Exploding Kittens y todas las cartas de Desactivación.',
      'Reparte 1 Desactivación y 4 cartas al azar a cada jugador (5 en mano).',
      'Baraja el resto de Desactivaciones dentro del mazo.',
      'Mete en el mazo tantos Exploding Kittens como jugadores haya y baraja de nuevo.',
      'Decide quién empieza (por ejemplo, quien tenga un gato en casa).',
    ],
    turn: [
      '1. (Opcional) Juega cuantas cartas quieras de tu mano (de una en una): saltar turno, atacar, favors, ver el futuro, palillos, parejas de gatos…',
      '2. Para terminar tu turno: ROBA 1 carta del mazo.',
      'Si robas un Exploding Kitten: juega tu Desactivación (coloca el kitten DONDE quieras del mazo, mirando) o explotas y quedas eliminado.',
      'Atacado: haces 2 turnos seguidos (se acumulan los ataques).',
    ],
    endCondition: 'Gana el último jugador que siga vivo cuando todos los demás hayan explotado.',
    scoring: [
      'No hay puntuación: solo supervivencia.',
    ],
    forgotten: [
      { title: 'Jugar cartas es gratis', text: 'Puedes jugar TODAS las cartas que quieras antes de robar. ROBAR es lo que termina tu turno (salvo con Saltar o Atacar).' },
      { title: 'Nope', text: 'Casi cualquier acción se puede bloquear con un Nope, incluso un Nope a otro Nope (¡Yep!). No se puede nopear una Desactivación ni un kitten ya revelado.' },
      { title: 'El turno tras un Ataque', text: 'El jugador atacado hace 2 turnos (si le vuelven a atacar, se acumulan). Cada turno significa rober al final, salvo que use Saltar/Atacar.' },
      { title: 'Venganza de la Desactivación', text: 'Al desactivar, TÚ eliges en qué posición del mazo devolver el kitten: ponlo bajo el mazo… o justo encima del mazo, junto a tu «amigo».' },
      { title: 'Parejas de gatos', text: '2 gatos iguales: roba 1 carta al azar a un rival; 3 gatos iguales: nombra una carta y si la tiene, te la da. Los gatos solos no hacen nada.' },
    ],
  },
]

/** Ids de los juegos de ejemplo del Modo Invitado Local. */
export const DEMO_CATALOG_IDS = ['catan', 'small-world', 'decrypto'] as const

/** Convierte una ficha del catálogo en un borrador editable (copias, sin referencias compartidas). */
export function catalogToDraft(c: CatalogGame): GameDraft {
  return {
    title: c.title,
    playersMin: c.playersMin,
    playersMax: c.playersMax,
    durationMin: c.durationMin,
    difficulty: c.difficulty,
    setup: [...c.setup],
    turn: [...c.turn],
    endCondition: c.endCondition,
    scoring: [...c.scoring],
    forgotten: c.forgotten.map((f) => ({ ...f })),
  }
}

/** Busca un juego del catálogo por su id. */
export function findCatalogGame(id: string): CatalogGame | undefined {
  return CATALOG.find((c) => c.id === id)
}
