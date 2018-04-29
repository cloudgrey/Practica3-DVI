# Práctica 3 DVI

En este repositorio se encuentra la [práctica 3]() de la asignatura Desarrollo de Videojuegos mediante Tecnologías Web.

Esta práctica consiste en desarrollar de una versión del videojuego de Super Mario. El objetivo de éste es alcanzar el final del mapa para rescatar a la princesa en cada mundo.

Se puede probar como referencia durante el desarrollo una [demo del juego](http://supermarioemulator.com/mario.php). 

También se puede ver un [gameplay](https://www.youtube.com/watch?v=ia8bhFoqkVE) del juego original.

## Archivos y directorios

### [index.html]()

Aquí incluimos los archivos que contienen la lógica y datos del juego. 
`window.onload = game;` llama a la función game que se encuentra en el archivo [practica3.js]() y es la encargada de ejecutar como tal el juego.


### [practica3.js]()

En este archivo se definen todos los elementos encargados de hacer funcionar el juego.

- Se define el tamaño de la ventana de juego.
- Se definen los elementos del juego:
  - Mario
  - Enemigos
  - Bloques
  - Monedas
  - La princesa Peach
- Panel de información del usuario (HUD).
- Pantallas de inicio y fin del juego.

### [audio]()

En esta carpeta el motor Quintus buscará todos los audios que se reproducen en el juego.

El motor buscará los audios por orden de preferencia, en nuestro caso primero .ogg y luego .mp3 .
Los audios deben estar en formato .ogg para que el motor los encuentre y el navegador los reproduzca.

### [data]()

Contiene los ficheros .json que definen la posición, tamaño y frames del sprite en cada imagen.

También contiene los ficheros que se encargan de definir los diferentes niveles. Es en estos archivos donde se definen las posiciones de los enemigos, el suelo y todo lo que visualizamos en el mapa, excepto Mario.

### [images]()

En esta carpeta se encuentran las imágenes que se utilizan para los elementos de construcción de niveles, pintar los sprites, el fondo del juego y la pantalla inicial.

### [lib]()

En esta carpeta se encuentran todos los archivos que componen el motor Quintus, que es el que se ha utilizado para desarrollar el juego.

## Ampliaciones realizadas

En esta práctica, a parte de las mecánicas básicas, hemos realizado una serie de ampliaciones, basándonos siempre en el comportamiento original tanto de Mario como de sus enemigos.

- Bloques de monedas
- Bloques de setas
  - Seta verde: te da una vida más.
  - Seta roja: te hace grande, provocando así que, si te chocas con un enemigo, vuelvas a ser pequeño (sin restarte una vida).
- Koopa, que además al eliminarlo se convierte en un caparazón.
- Toda la información mostrada en el HUD y las variables necesarias para su funcionamiento.
- Diferentes niveles.
- Se muestran los puntos al matar a un enemigo.


## Nuestro juego

Para probar este juego es necesario descargarlo y ejecutarlo con un servidor, ya sea montado con Python o XAMPP.

### Mecánicas

Para controlar al jugador sólo serán necesarios los controles de arriba, abajo, izquierda y derecha.

Nota: para saltar más alto, basta con dejar pulsado el boton arriba (tras el primer salto) y Mario dará un salto más alto de lo habitual. Esto es necesario para avanzar en algunos niveles, pero... cuidado, hay algunas zonas trampa de las que no se puede salir ;) .


## Colaboradores

[César Godino Rodríguez](https://github.com/cloudgrey)

[Carmen López Gonzalo](https://github.com/calope03)
