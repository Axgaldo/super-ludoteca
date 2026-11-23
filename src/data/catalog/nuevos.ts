import type { CatalogEntry } from './types'

/**
 * Ampliación del catálogo (v1.1.0) con los juegos pedidos por [@axgaldo](https://github.com/axgaldo).
 * Las etiquetas/categorías se asignan en ../catalog/index.ts.
 */
export const NUEVOS: CatalogEntry[] = [
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'castillos-toscana',
    title: 'Los Castillos de Toscana',
    description: 'Construye tu ducado toscano con cartas de acción, losetas y bonificaciones de región.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 75,
    difficulty: 3,
    setup: [
      'Cada jugador toma un tablero de ducado y sus marcadores.',
      'Baraja las losetas de edificio y colócalas por niveles en el tablero central.',
      'Forma el mazo de cartas de acción y reparte la mano inicial.',
      'Elige el jugador inicial (el último que visitó la Toscana, si no hay duda).',
    ],
    turn: [
      '1. Juega 1 o más cartas de acción de tu mano para colocar losetas, activar edificios o conseguir recursos.',
      '2. Resuelve los efectos encadenados y las bonificaciones de las regiones que completes.',
      '3. Roba hasta tu límite de mano y pasa el turno.',
    ],
    endCondition: 'La partida termina tras la ronda final; se puntúan ducados, regiones completadas y bonificaciones.',
    scoring: [
      'Puntos por losetas colocadas y regiones completadas en tu ducado.',
      'Bonificaciones de edificios, recursos sobrantes y objetivos de fin de partida.',
      'Algunas cartas dan puntos finales: léelas antes de descartarlas.',
    ],
    forgotten: [
      { title: 'Regiones completas', text: 'Al completar una región se disparan bonificaciones inmediatas: no olvides puntuarlas.' },
      { title: 'Combos de cartas', text: 'Las cartas se encadenan dentro del mismo turno: planifica la mano completa antes de jugar.' },
      { title: 'Revisa tu edición', text: 'El detalle de los edificios y las bonificaciones varía según la edición: consulta las cartas.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'castillos-borgona',
    title: 'Los Castillos de Borgoña',
    description: 'Dados, losetas hexagonales y un ducado que crece ronda a ronda (última edición).',
    playersMin: 2,
    playersMax: 4,
    durationMin: 90,
    difficulty: 3,
    setup: [
      'Cada jugador toma su tablero de ducado (lado A o B) y sus marcadores de puntos y plata.',
      'Prepara los depósitos centrales: coloca las losetas por tipos en sus montones (castillos, edificios, animales, conocimiento, barcos y minas).',
      'Cada jugador recibe sus dados y sus trabajadores iniciales.',
      'Revela las losetas iniciales de los depósitos y deja la bolsa a mano.',
    ],
    turn: [
      '1. Tira tus 2 dados.',
      '2. Usa cada dado como acción: coger una loseta del depósito de ese número, colocar una loseta en una casilla del mismo número de tu tablero, vender mercancías o coger 2 trabajadores.',
      '3. Los trabajadores permiten cambiar el valor de un dado (±1).',
      '4. Al completar una región de tu ducado, puntúas según su tamaño y disparas bonificaciones.',
    ],
    endCondition: 'La partida dura 5 rondas (eras); al final de la quinta se puntúa todo.',
    scoring: [
      'Regiones completadas: puntos según el tamaño de la región y sus bonificaciones.',
      'Animales: puntos por los animales distintos de la región. Barcos y minería: ingresos y puntos.',
      'Losetas de conocimiento y de bonificación: PV al completar las regiones correspondientes. La plata sobrante también puntúa.',
    ],
    forgotten: [
      { title: 'Casilla del número correcto', text: 'No puedes colocar una loseta sin una casilla libre del número correcto (el castillo permite colocarla encima y repetir acción).' },
      { title: 'Trabajadores', text: 'Cada trabajador gastado se descarta: consigue más con la acción de trabajadores (2 por dado).' },
      { title: 'Vender mercancías', text: 'Vender usa cualquier dado y da plata/puntos según el tipo y la cantidad de mercancía.' },
      { title: 'Lado del tablero', text: 'Jugad todos con el mismo lado (A o B) y con el mapa de depósitos correspondiente: no se mezclan.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'ankh',
    title: 'Ankh: Dioses de Egipto',
    description: 'Dioses egipcios, seguidores y monumentos: controla Egipto y gana el favor divino.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 120,
    difficulty: 4,
    setup: [
      'Cada jugador elige un dios y toma sus figuras (dios, guardianes y seguidores).',
      'Monta el tablero según el número de jugadores y coloca obeliscos, regiones y losetas de escenario.',
      'Prepara el mazo de batalla y los marcadores de favor.',
      'Elige el jugador inicial.',
    ],
    turn: [
      '1. Realiza tus acciones: invoca seguidores, mueve a tu dios y guardianes, construye monumentos o resuelve batallas.',
      '2. Las batallas se resuelven con cartas: gana quien tenga más fuerza en la región.',
      '3. Gana presencia en las regiones y seguidores para puntuar al final de cada era.',
    ],
    endCondition: 'La partida termina al final de la era final; se puntúa el control de regiones, los seguidores y los monumentos.',
    scoring: [
      'Puntos por seguidores y control de regiones al final de cada era.',
      'Monumentos construidos y objetivos del escenario.',
      'La regla de fusión de dioses (si se activa) puede compartir la victoria: revisadla en el reglamento.',
    ],
    forgotten: [
      { title: 'Batallas con cartas', text: 'Las batallas usan el mazo, no dados: revela tu fuerza solo cuando toque.' },
      { title: 'Obeliscos y monumentos', text: 'Modifican el control de las regiones y cómo se puntúa cada era.' },
      { title: 'Fusión de dioses', text: 'Es una regla especial de final de partida: leedla antes de empezar.' },
      { title: 'Habilidad del dios', text: 'Cada dios tiene una habilidad única: no la olvides al planificar tu era.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'rattus',
    title: 'Rattus',
    description: 'La peste negra en Europa: coloca a tu gente antes de que las ratas lo hagan por ti.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 45,
    difficulty: 2,
    setup: [
      'Monta el tablero de Europa y prepara los marcadores de las regiones.',
      'Cada jugador elige un personaje inicial y recibe sus cubos.',
      'Coloca los tokens de rata iniciales según el número de jugadores.',
      'Decide quién empieza.',
    ],
    turn: [
      '1. Elige una acción de personaje disponible (curandero, caballero, mercader, bruja…): coloca cubos, elimina o mueve ratas.',
      '2. Si la peste estalla en una región, se eliminan cubos de esa región.',
      '3. La peste se propaga al final del turno según el reglamento.',
    ],
    endCondition: 'La partida termina al colocarse el último token de rata; gana quien tenga más cubos en el tablero.',
    scoring: [
      'Cubos en el tablero al final: cada cubo vale 1 punto.',
      'Desempate: la presencia del personaje en las regiones.',
    ],
    forgotten: [
      { title: 'Colocar gente no siempre es bueno', text: 'La peste solo estalla cuando hay suficientes ratas: a veces conviene esperar.' },
      { title: 'Cambio de personajes', text: 'Los personajes cambian cada ronda: planifica según el que te toque.' },
      { title: 'Cubos perdidos', text: 'Los cubos eliminados por la peste no vuelven: cuida dónde te expandes.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'cascadia',
    title: 'Cascadia',
    description: 'Crea hábitats y coloca fauna del Pacífico noroeste: puzle y bonificaciones.',
    playersMin: 1,
    playersMax: 4,
    durationMin: 40,
    difficulty: 2,
    setup: [
      'Baraja las losetas de hábitat y los tokens de fauna por separado.',
      'Revela 4 parejas (loseta + token) en el mercado.',
      'Prepara las cartas de bonificación de fauna y las fichas de naturaleza.',
      'Cada jugador empieza con su mapa vacío y su reserva de fichas de naturaleza.',
    ],
    turn: [
      '1. Elige una pareja del mercado (loseta + token).',
      '2. Coloca la loseta en tu mapa: debe tocar al menos otra loseta.',
      '3. Coloca el token de fauna en una loseta compatible (o guárdalo si no cabe).',
      '4. Repón el mercado y puedes gastar fichas de naturaleza para cambiar un token.',
    ],
    endCondition: 'La partida termina cuando se agota el mercado (20 turnos por jugador). Se puntúa todo.',
    scoring: [
      'Cada hábitat conectado: tamaño del corredor × número de animales de ese hábitat en él.',
      'Bonificaciones de fauna (mayorías y parejas según la carta de objetivo).',
      'Cada ficha de naturaleza sobrante vale 1 punto.',
    ],
    forgotten: [
      { title: 'Hábitat compatible', text: 'Los animales deben colocarse en su hábitat, o en ríos/bosques si el token lo permite.' },
      { title: 'Sin diagonales', text: 'Los corredores solo conectan por lados, nunca en diagonal.' },
      { title: 'Repón siempre', text: 'El mercado se repone al final de tu turno, aunque no hayas colocado el token.' },
      { title: 'Fichas de naturaleza', text: 'Sirven para recolocar tokens: no las malgastes al principio.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'zombicide',
    title: 'Zombicide (2ª edición)',
    description: 'Supervivientes contra hordas: cooperativo de acción con misiones y ruido que atrae zombis.',
    playersMin: 1,
    playersMax: 6,
    durationMin: 90,
    difficulty: 3,
    setup: [
      'Elegid misión y montad el tablero con sus losetas, zonas de aparición y objetivos.',
      'Cada jugador elige un superviviente, su tablero y su arma inicial.',
      'Prepara los mazos de zombis, equipo y eventos; coloca puertas y marcadores.',
      'Colocad los supervivientes en la zona de inicio.',
    ],
    turn: [
      '1. Los supervivientes se activan por orden: cada uno tiene 3 acciones (mover, atacar, abrir puertas, buscar…).',
      '2. El ruido atrae zombis a esa zona al final del turno.',
      '3. Fase de zombis: aparecen, se mueven hacia el ruido/supervivientes y atacan.',
      '4. Comprobad objetivos y subid de nivel (más equipo y habilidades).',
    ],
    endCondition: 'La misión termina al cumplir sus objetivos (o si todos los supervivientes caen).',
    scoring: [
      'No hay puntuación: ganáis o perdéis la misión en equipo.',
    ],
    forgotten: [
      { title: 'Los zombis atacan en su fase', text: 'No atacan al moverse los supervivientes, sino en la fase de zombis.' },
      { title: 'Peligro de las abominaciones', text: 'No se dejan engañar por el ruido normal: son el mayor peligro de la partida.' },
      { title: 'Intercambio de objetos', text: 'Puedes intercambiar objetos con compañeros que estén en tu misma zona.' },
      { title: 'Subir de nivel', text: 'Al ganar experiencia desbloqueas habilidades: revisa tu tablero al subir.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'marvel-zombies',
    title: 'Marvel Zombies (Zombicide)',
    description: 'Zombicide marvelita: héroes resistiendo la horda o zombis devorando el mundo.',
    playersMin: 1,
    playersMax: 6,
    durationMin: 120,
    difficulty: 4,
    setup: [
      'Elegid modo: **Héroes (Hero Resistance)** por defecto, o **Zombis**.',
      'En modo Héroes jugad con 4 héroes; usad 6 solo con la variante ampliada de Hero Resistance.',
      'Montad la misión, el tablero y las zonas de aparición según el escenario.',
      'Preparad los mazos de equipo, poderes y zombis; cada jugador toma su tablero.',
      'Colocad héroes en la zona inicial (modo Héroes) o zombis jugadores en sus zonas (modo Zombis).',
    ],
    turn: [
      'Modo Héroes: cada jugador activa a su héroe (mover, atacar, usar poderes) y después actúan los zombis.',
      'Modo Zombis: cada jugador controla un zombi, devora héroes y gana poderes al subir de nivel.',
      'En ambos modos: gestionad apariciones, ruido y los objetivos de la misión.',
    ],
    endCondition: 'La partida termina al completar (o fallar) los objetivos de la misión según el modo.',
    scoring: [
      'Modo Héroes: cooperativo, ganáis o perdéis juntos.',
      'Modo Zombis: competís por devorar más héroes y ganar poder.',
    ],
    forgotten: [
      { title: 'Elige el modo ANTES de montar', text: 'El modo (héroes o zombis) y el número de héroes (4 o 6) se deciden antes de preparar la misión.' },
      { title: 'Hero Resistance', text: 'Es la versión por defecto: los zombis los controla el juego con sus cartas de activación.' },
      { title: 'Héroes caídos', text: 'Un héroe zombificado deja de ser aliado: cuidado con los personajes que caen.' },
      { title: 'Mazos distintos', text: 'Héroes y zombis usan tableros y poderes diferentes: no mezcléis los mazos.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'fallout',
    title: 'Fallout: El Juego de Tablero',
    description: 'Aventura postnuclear: explora la Commonwealth, sube de nivel y cumple tu agenda secreta.',
    playersMin: 1,
    playersMax: 4,
    durationMin: 150,
    difficulty: 3,
    setup: [
      'Elegid escenario y preparad sus cartas de misión y agenda.',
      'Montad el mapa con las losetas iniciales y los mazos de encuentro.',
      'Cada jugador toma su tablero S.P.E.C.I.A.L., su figura y su equipo inicial.',
      'Robad vuestra agenda secreta (no la enseñéis).',
    ],
    turn: [
      '1. Realiza 2 acciones: mover, explorar, luchar, descansar o comerciar.',
      '2. Resuelve encuentros y gana experiencia (sube de nivel y mejora S.P.E.C.I.A.L.).',
      '3. Avanza tu misión y tu agenda en secreto; la radiación y los caps importan.',
    ],
    endCondition: 'Cada escenario define cuándo termina y cómo se puntúa (normalmente al completar la misión final).',
    scoring: [
      'Puntos por la misión del escenario, tu agenda secreta y las mejoras de tu personaje.',
      'Los caps, el equipo y las conquistas pueden sumar según el escenario.',
    ],
    forgotten: [
      { title: 'Agenda secreta', text: 'No la enseñes ni la leas en voz alta: es tu objetivo oculto.' },
      { title: 'Radiación', text: 'La radiación afecta a tu salud: gestiónala como un recurso más.' },
      { title: 'El final depende del escenario', text: 'Lee las condiciones de final antes de empezar: cada escenario cambia la partida.' },
      { title: 'Niveles y equipo', text: 'Subir de nivel mejora tu S.P.E.C.I.A.L. y desbloquea opciones: no acumules experiencia sin gastarla.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'gloomhaven-garras',
    title: 'Gloomhaven: Garras de León',
    description: 'Campaña cooperativa táctica con las primeras misiones guiadas: ideal para aprender Gloomhaven.',
    playersMin: 1,
    playersMax: 4,
    durationMin: 90,
    difficulty: 4,
    setup: [
      'Cada jugador elige uno de los 4 personajes y prepara su mazo de habilidad.',
      'Abrid el libro de escenarios en el escenario 1: los primeros son un tutorial guiado.',
      'Preparad el mazo de monstruos, el tablero de elementos y los marcadores de iniciativa.',
      'Colocad monstruos y héroes según el escenario.',
    ],
    turn: [
      '1. Cada jugador elige 2 cartas de habilidad y declara la iniciativa de la más baja.',
      '2. En orden de iniciativa, cada figura ejecuta la parte superior de UNA carta y la inferior de OTRA.',
      '3. Los monstruos usan su carta de estadísticas y su iniciativa.',
      '4. Descansa (corta o larga) para recuperar cartas; gana experiencia al usar habilidades y al completar el escenario.',
    ],
    endCondition: 'La misión termina al cumplir su objetivo (normalmente eliminar enemigos o sobrevivir); la campaña sigue con el siguiente escenario.',
    scoring: [
      'No hay puntos: se gana la misión en equipo y se progresa en la campaña (experiencia, oro y mejoras).',
    ],
    forgotten: [
      { title: 'Una superior y otra inferior', text: 'Debes jugar la parte superior de UNA carta y la inferior de OTRA (nunca dos superiores).' },
      { title: 'Iniciativa', text: 'La iniciativa del turno es la de la carta más baja que juegas.' },
      { title: 'Elementos', text: 'Los elementos (fuego, hielo…) se cargan y consumen: fíjate en el tablero de elementos.' },
      { title: 'Tutoriales', text: 'Los primeros escenarios son tutoriales: sigue el libro sin leer todo el reglamento.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'dilema-del-rey',
    title: 'El Dilema del Rey',
    description: 'Legacy narrativo: vuestra casa decide el destino del reino… y el suyo propio.',
    playersMin: 3,
    playersMax: 5,
    durationMin: 75,
    difficulty: 3,
    setup: [
      'Cada jugador elige una casa y coge su pantalla, su influencia y sus cartas de casa.',
      'Abrid el sobre de la primera partida y seguid sus instrucciones (legacy).',
      'Preparad el mazo de dilemas, la balanza del poder y los marcadores de prestigio.',
      'Un jugador hace de «voz del rey» (narrador) en cada dilema.',
    ],
    turn: [
      '1. Se lee un dilema y se debate: cada opción tiene consecuencias.',
      '2. Votad en secreto con vuestra influencia; el resultado mueve la balanza del poder del reino.',
      '3. Resolved consecuencias (a veces abriendo sobres) y actualizad prestigio y poder de las casas.',
    ],
    endCondition: 'La campaña termina tras la última sesión (los sobres marcan el final); gana la casa con más prestigio.',
    scoring: [
      'Prestigio de cada casa al final de la campaña (y objetivos ocultos).',
      'La balanza del poder del reino también decide el destino de todos: puede acabar mal para el reino.',
    ],
    forgotten: [
      { title: 'Es un legacy', text: 'Las decisiones y los sobres son permanentes: no hay vuelta atrás.' },
      { title: 'La voz del rey', text: 'El narrador no vota: aplica las consecuencias y lleva la historia.' },
      { title: 'La balanza del poder', text: 'Importa aunque no puntúe directamente: puede cambiar el final de la campaña.' },
      { title: 'Registro', text: 'Llevad un registro de lo ocurrido: la campaña se juega en varias sesiones.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'catan-5-6',
    title: 'Catán: 5-6 Jugadores (Expansión)',
    description: 'La expansión de 5-6 jugadores: tablero ampliado y fase de construcción especial.',
    playersMin: 5,
    playersMax: 6,
    durationMin: 120,
    difficulty: 3,
    setup: [
      'Monta el tablero de la expansión (más grande) con los puertos y discos numerados extra.',
      'Cada jugador elige uno de los colores adicionales y toma sus piezas: 15 carreteras, 5 pueblos y 4 ciudades.',
      'Incluye las cartas de desarrollo extra y la baraja ampliada.',
      'Colocación inicial como en Catán: dos pueblos + carreteras por jugador, en orden directo e inverso.',
    ],
    turn: [
      '1. Producir y comerciar igual que en Catán base.',
      '2. Construir en tu turno (carreteras, pueblos, ciudades, cartas).',
      '3. Fase de construcción especial (regla nueva): después de cada turno, todos los jugadores pueden construir antes de que empiece el siguiente.',
    ],
    endCondition: 'Como en Catán: gana quien llegue a 10 puntos de victoria en su turno.',
    scoring: [
      'Igual que Catán base: pueblos 1 PV, ciudades 2 PV, cartas de PV, ejército más grande y camino más largo.',
    ],
    forgotten: [
      { title: 'Fase de construcción especial', text: 'Se hace tras CADA turno y todos pueden construir, no solo el jugador activo. Es el gran cambio de la expansión.' },
      { title: 'Límite de 7 cartas', text: 'El límite de mano sigue siendo 7: al salir un 7 se descarta la mitad (redondeando hacia abajo).' },
      { title: 'Orden inicial', text: 'Con 5-6 jugadores, el jugador inicial y el orden de colocación se definen según el reglamento de la expansión.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'little-secret',
    title: 'Little Secret',
    description: 'Party de secretos y faroles: cumple tu objetivo sin que te pillen. Ficha base editable.',
    playersMin: 3,
    playersMax: 8,
    durationMin: 20,
    difficulty: 1,
    setup: [
      'Reparte una carta de objetivo o misión secreta a cada jugador (que solo vea la suya).',
      'Baraja el mazo de cartas de acción y reparte una mano inicial.',
      'Deja las fichas de puntos a la vista y decide quién empieza.',
    ],
    turn: [
      '1. En tu turno juega una carta de acción o haz una acusación/pista según tu objetivo.',
      '2. Los demás pueden responder o dudar de ti: resuelve el efecto y las consecuencias.',
      '3. Quien complete su secreto, puntúa.',
    ],
    endCondition: 'La partida acaba al cumplirse el número de rondas o al agotarse el mazo; gana quien tenga más puntos.',
    scoring: [
      'Puntos por objetivos secretos cumplidos y por acusaciones acertadas.',
      'Cada misión cumplida suma; los fallos pueden restar.',
    ],
    forgotten: [
      { title: 'Tu secreto no se enseña', text: 'La gracia es farolear: nunca reveles tu objetivo.' },
      { title: 'Revisa tu edición', text: 'Las cartas y los objetivos concretos varían según la edición: ajusta esta ficha si hace falta.' },
      { title: 'Acusar también es jugar', text: 'Acusar sin pruebas forma parte del juego: el riesgo es la puntuación.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'cubitos',
    title: 'Cubitos',
    description: 'Carrera de cubitos: construye tu bolsa de dados y arriésgate a avanzar más.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 45,
    difficulty: 2,
    setup: [
      'Cada jugador elige un corredor y prepara su bolsa inicial de dados y su tablero.',
      'Monta la pista de carrera y coloca los marcadores en la salida.',
      'Revela las cartas/mejoras de dados disponibles (mercado).',
    ],
    turn: [
      '1. Saca dados de tu bolsa y tíralos; asigna cada resultado a mover, ganar monedas o activar habilidades.',
      '2. Puedes seguir tirando (push your luck): si haces «pifia», pierdes los resultados de esa tirada.',
      '3. Con monedas compras dados nuevos para tu bolsa y terminas tu turno.',
    ],
    endCondition: 'La partida termina en cuanto un corredor cruza la línea de meta.',
    scoring: [
      'Gana quien cruce primero la meta; el resto se ordena por posición (consulta tu edición).',
    ],
    forgotten: [
      { title: 'Pifia', text: 'Si haces «bust» pierdes los resultados de la tirada, no los dados de la bolsa.' },
      { title: 'Los dados van a la bolsa', text: 'Los dados comprados entran en la bolsa, no en la mano: se roban al azar.' },
      { title: 'Lee tus dados', text: 'Cada dado tiene habilidades distintas: revisa qué hace antes de tirarlo.' },
      { title: 'Cuándo parar', text: 'Arriesgarse da más avance, pero puede dejarte sin turno: mide el riesgo.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'furnace',
    title: 'Furnace',
    description: 'Motor económico en 10 rondas: puja por fábricas y encadena producción.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 45,
    difficulty: 3,
    setup: [
      'Cada jugador toma su tablero de producción y sus fichas de recursos.',
      'Baraja el mazo de cartas de fábrica y revela las primeras.',
      'Prepara las monedas y los mejoradores; decide quién empieza.',
    ],
    turn: [
      '1. Puja con tu carta de puja secreta por una de las fábricas visibles.',
      '2. Produce: activa tus fábricas en orden y convierte recursos en monedas/puntos.',
      '3. Compra mejoras o nuevas fábricas para el siguiente turno.',
    ],
    endCondition: 'La partida dura 10 rondas; al final se puntúa.',
    scoring: [
      'Monedas acumuladas y valor de tus fábricas y mejoras.',
      'Los objetivos del reglamento pueden dar puntos extra.',
    ],
    forgotten: [
      { title: 'Una puja por ronda', text: 'Solo se puja una vez por ronda: elige bien tu carta de puja.' },
      { title: 'Producción en cadena', text: 'El orden de activación de las fábricas importa: planifícalo.' },
      { title: 'Recursos', text: 'Las fábricas sin recursos no producen: revisa tus fichas antes de activar.' },
      { title: 'Revisa tu edición', text: 'El reparto exacto de las 10 rondas puede variar según la edición.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'terraforming-mars',
    title: 'Terraforming Mars',
    description: 'Corporaciones terraformando Marte: cartas, producción y proyectos a largo plazo.',
    playersMin: 1,
    playersMax: 5,
    durationMin: 120,
    difficulty: 4,
    setup: [
      'Cada jugador elige una corporación y recibe cartas de proyecto iniciales (conserva las que puedas pagar según el reglamento).',
      'Coloca el tablero de Marte con los océanos y las escalas de oxígeno y temperatura.',
      'Cada jugador empieza con su producción inicial según la corporación.',
      'Decide el orden de juego con los marcadores de turno.',
    ],
    turn: [
      '1. Elige 1 o 2 acciones: jugar proyectos, usar acciones de cartas, hitos o logros.',
      '2. Paga con megacréditos y ajusta tu producción de recursos.',
      '3. Al final de la ronda, la producción genera recursos y se avanza el marcador de generación.',
      'Opcional — Preludio: añade una fase inicial con preludios y proyectos que aceleran el arranque.',
    ],
    endCondition: 'La partida termina cuando se cumplen las 3 condiciones globales: oxígeno al 14 %, temperatura +8 °C y 9 océanos.',
    scoring: [
      'PV de tus cartas + tu TR (rating) + ciudades/bosques en el tablero.',
      'Hitos y logros conseguidos + recursos sobrantes según el reglamento.',
    ],
    forgotten: [
      { title: 'Tres condiciones globales', text: 'La partida solo acaba al cumplirse las tres: vigila el oxígeno, la temperatura y los océanos.' },
      { title: 'Hitos y logros', text: 'Se pagan con megacréditos y por orden de llegada: no regales los primeros.' },
      { title: 'Producción y TR', text: 'Al subir el TR se ajusta la producción de megacréditos: no lo olvides.' },
      { title: 'Con Preludio', text: 'La fase de preludios va ANTES de la primera generación: reparte los preludios y resuelve sus efectos.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'one-round',
    title: 'One Round',
    description: 'Party ultrarrápido de una sola ronda por partida. Ficha base editable.',
    playersMin: 2,
    playersMax: 8,
    durationMin: 10,
    difficulty: 1,
    setup: [
      'Reparte las cartas o el material según el modo de tu edición.',
      'Deja el mazo y las fichas de puntuación a mano.',
      'Elige quién empieza.',
    ],
    turn: [
      '1. Se juega una ronda con las reglas de la carta/modo elegido.',
      '2. Resolved el resultado y repartid los puntos al instante.',
      '3. Cambiad de ronda o de modo si queréis alargar la partida.',
    ],
    endCondition: 'La partida puede ser una sola ronda (como su nombre indica) o al mejor de varias.',
    scoring: [
      'Gana quien consiga el objetivo de la ronda (consulta las cartas de tu edición).',
    ],
    forgotten: [
      { title: 'Una ronda y ya', text: 'Es un juego de una ronda: no busques estrategia a largo plazo.' },
      { title: 'Revisa tu edición', text: 'Los modos y cartas pueden variar según la edición.' },
      { title: 'Mantén el ritmo', text: 'La gracia es la velocidad: no lo conviertas en un debate.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'feed-the-kraken',
    title: 'Feed the Kraken',
    description: 'Roles ocultos a bordo: marineros, cultistas y piratas compiten por el rumbo del barco.',
    playersMin: 5,
    playersMax: 11,
    durationMin: 60,
    difficulty: 3,
    setup: [
      'Monta el tablero del barco con la ruta, los puestos y el indicador de rumbo.',
      'Reparte roles secretos: mayoría de marineros, cultistas y piratas.',
      'Cada jugador recibe su carta de personaje y sus fichas de voto.',
      'Elegid capitán y lugarteniente iniciales según el reglamento.',
    ],
    turn: [
      '1. El capitán propone el rumbo o la acción y se debate.',
      '2. Votación y poderes: usad vuestras cartas para cambiar el rumbo o amotinaros.',
      '3. Avanzad el barco y resolved los encuentros de la ruta.',
    ],
    endCondition: 'Gana el bando que logre su objetivo: los marineros llegan a puerto, los cultistas invocan al Kraken y los piratas se hacen con el barco.',
    scoring: [
      'No hay puntos: victoria por bando secreto al final de la travesía.',
    ],
    forgotten: [
      { title: 'Roles ocultos', text: 'Nadie revela su rol hasta el final: desconfía de todo el mundo.' },
      { title: 'El rumbo importa', text: 'Un giro equivocado puede llevar el barco a la perdición.' },
      { title: 'Poderes de personaje', text: 'Se gastan una sola vez: guárdalos para el momento clave.' },
      { title: 'App de seguimiento', text: 'Si la tenéis, la app oficial del barco agiliza la navegación.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'chao-pescao',
    title: 'Chao Pescao',
    description: 'Party de retos absurdos y respuestas rápidas. Ficha base editable.',
    playersMin: 3,
    playersMax: 10,
    durationMin: 20,
    difficulty: 1,
    setup: [
      'Baraja el mazo y reparte las cartas iniciales según tu edición.',
      'Deja las fichas de puntos a la vista.',
      'Decide quién empieza.',
    ],
    turn: [
      '1. En tu turno lee/revela una carta y responde o haz el reto.',
      '2. Los demás votan o compiten por la respuesta correcta.',
      '3. Reparte puntos y pasa el turno.',
    ],
    endCondition: 'La partida termina cuando se acaba el mazo o al llegar a los puntos objetivo.',
    scoring: [
      'Puntos por respuestas acertadas y retos superados; gana quien más puntos tenga.',
    ],
    forgotten: [
      { title: 'Velocidad y humor', text: 'Importan más que la estrategia: el objetivo es reírse.' },
      { title: 'Revisa tu edición', text: 'Los retos concretos varían según la edición.' },
      { title: 'Desempate', text: 'Si hay empate, resolvedlo con una ronda rápida.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'wonders-duel-7',
    title: '7 Wonders Duel',
    description: 'Duelo de civilizaciones para dos: elige cartas de la pirámide y construye tu supremacía.',
    playersMin: 2,
    playersMax: 2,
    durationMin: 30,
    difficulty: 2,
    setup: [
      'Cada jugador elige 4 maravillas de las disponibles y las coloca en su tablero.',
      'Prepara las 3 eras de cartas, el marcador militar y el de ciencia.',
      'Decide quién empieza: os alternaréis.',
    ],
    turn: [
      '1. Elige una carta accesible de la pirámide (que no esté tapada).',
      '2. Construye el edificio (pagando con monedas o cadenas), construye una maravilla o descarta por monedas.',
      '3. Avanza el marcador militar o científico si la carta lo indica.',
      '4. Si te falta un recurso, cómpralo al banco: 2 monedas + 1 por cada recurso de ese tipo que tenga el rival.',
    ],
    endCondition: 'La partida termina al final de la era III… salvo victoria instantánea militar o científica.',
    scoring: [
      'Puntos por cartas (azules, amarillas, gremios, maravillas y monedas) al final.',
      'Victoria instantánea: llegar al final de la pista militar o reunir 6 símbolos científicos distintos.',
    ],
    forgotten: [
      { title: 'Victoria instantánea', text: 'La militar y la científica acaban la partida al momento: vigila al rival.' },
      { title: 'Comprar recursos', text: 'Pagas 2 monedas + 1 por cada recurso de ese tipo que produzca el rival.' },
      { title: 'Maravillas', text: 'También pueden darte la victoria militar o científica: no las infravalores.' },
      { title: 'Descartar', text: 'Descartar una carta te da monedas: úsalo cuando no te convenga nada.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'quest',
    title: 'Quest',
    description: 'Deducción social artúrica: caballeros leales y traidores en la corte. Ficha base editable.',
    playersMin: 4,
    playersMax: 10,
    durationMin: 30,
    difficulty: 2,
    setup: [
      'Reparte los roles secretos (leales y traidores) según el número de jugadores.',
      'Prepara el mazo de misiones y los marcadores de éxito/fracaso.',
      'Elegid al primer líder.',
    ],
    turn: [
      '1. El líder propone un equipo para la misión.',
      '2. Todos votan la propuesta; si pasa, el equipo elige en secreto las cartas de éxito/fracaso.',
      '3. Resolved la misión y pasad el liderazgo.',
    ],
    endCondition: 'Gana el bando que complete (o sabotee) el número de misiones indicado.',
    scoring: [
      'Sin puntos: victoria por bando secreto.',
    ],
    forgotten: [
      { title: 'Sabotear sin ser visto', text: 'Los traidores deben hacer fracasar misiones sin que los descubran.' },
      { title: 'Las votaciones informan', text: 'Observa quién vota qué: la información vale más que un turno.' },
      { title: 'Revisa tu edición', text: 'El número de misiones y roles puede variar según la edición.' },
      { title: 'El liderazgo rota', text: 'Todos pasaréis por el punto de mira: aprovecha tu turno como líder.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'heroquest',
    title: 'HeroQuest',
    description: 'Mazmorreo clásico: el máster coloca el mapa y los héroes lo exploran. Compatible con su app oficial.',
    playersMin: 2,
    playersMax: 5,
    durationMin: 90,
    difficulty: 1,
    setup: [
      'Elegid la misión del libro de aventuras y montad el tablero según el mapa.',
      'Cada jugador elige un héroe con su ficha y equipo inicial.',
      'El máster (o la app oficial) prepara monstruos, trampas y tesoros.',
    ],
    turn: [
      '1. Los héroes se mueven y actúan (atacar, buscar, abrir puertas).',
      '2. El máster mueve y ataca con los monstruos.',
      '3. Resolved trampas, tesoros y eventos según la misión.',
    ],
    endCondition: 'La misión termina al cumplir su objetivo (normalmente escapar o derrotar al jefe).',
    scoring: [
      'No hay puntuación: el grupo gana o pierde la misión y conserva el botín entre aventuras.',
    ],
    forgotten: [
      { title: 'Usa la app oficial', text: 'Si no quieres que nadie haga de máster, la app oficial automatiza la misión.' },
      { title: 'No destapéis todo', text: 'El máster o la app revela el mapa por zonas: mantened la sorpresa.' },
      { title: 'Botín entre misiones', text: 'El equipo y el oro se conservan entre misiones de una campaña.' },
      { title: 'Héroes distintos', text: 'Cada personaje tiene estadísticas y habilidades propias: lee su carta.' },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 'brass-lancashire',
    title: 'Brass: Lancashire',
    description: 'La revolución industrial británica: canales, ferrocarriles, algodón y préstamos.',
    playersMin: 2,
    playersMax: 4,
    durationMin: 150,
    difficulty: 4,
    setup: [
      'Monta el tablero de Lancashire y reparte las cartas de ciudad/industria iniciales.',
      'Cada jugador recibe su dinero inicial y sus fichas de ingresos.',
      'Coloca los mercados de algodón y los marcadores de época (canal y ferrocarril).',
      'Decide el jugador inicial.',
    ],
    turn: [
      '1. Juega una carta y realiza una acción: construir industria, construir red de transporte, desarrollar, vender algodón o pedir un préstamo.',
      '2. Paga carbón/hierro y consume recursos del tablero.',
      '3. Al final de cada época (canal y ferrocarril) se puntúa.',
    ],
    endCondition: 'La partida tiene dos épocas (canal y ferrocarril); al final de la segunda se puntúa todo.',
    scoring: [
      'Puntos por industrias construidas y vendidas, conexiones de red e ingresos.',
      'Los préstamos y las losetas sin usar restan: gestiona bien el dinero.',
    ],
    forgotten: [
      { title: 'Red conectada', text: 'Las nuevas industrias deben estar conectadas a tu red para construir.' },
      { title: 'Cambio de época', text: 'En la época de ferrocarril los canales ya no puntúan igual: planifica el cambio.' },
      { title: 'Préstamos', text: 'Bajan tus ingresos cada ronda: pide solo los imprescindibles.' },
      { title: 'Vender algodón', text: 'Necesitas un puerto conectado a tu red y un mercado libre para vender.' },
    ],
  },
]
