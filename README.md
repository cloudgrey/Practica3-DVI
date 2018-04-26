# Práctica 3 DVI

En este repositorio se encuentra la [práctica 3]() de la asignatura Desarrollo de Videojuegos mediante Tecnologías Web.

Esta práctica consiste en el desarrollo de una version del videojuego de Mario. El objetivo de éste es alcanzar el final del mapa para rescatar a la princesa, en cada mundo.

Se puede probar como referencia en el desarrollo una [demo del juego](http://supermarioemulator.com/mario.php). 

También se puede ver un [gameplay](https://www.youtube.com/watch?v=ia8bhFoqkVE) del juego original.

## Archivos y directorios

### [index.html]()

Aquí incluimos los archivos que contienen la lógica y datos del juego. 
`window.onload = game;` llama a la funcion game que se encuentra en el archivo [practica3.js]() y es la encargada de hacer funcionar el juego.


### [practica3.js]()

En este archivo se definen todos los elementos encargados de hacer funcionar el juego.

- Se define el tamaño de la ventana de juego.
- Se definen los elementos del juego:
  - Mario
  - Enemigos
  - Bloques
  - Monedas
  - La princesa
- Panel de informacion del usuario (HUD).
- Pantallas de inicio y fin del juego.

### [audio]()

En esta carpeta el motor quintus buscará todos los audios que se reproducen en el juego.

EL MOTOR BUSCARA LOS AUDIOS POR ORDEN DE PREFERENCIA, EN ESTE CASO .MP3-.OGG-.WAV

LOS AUDIOS DEBEN ESTAR EN FORMATO .OGG PARA QUE EL MOTOR LOS ENCUENTRE Y EL NAVEGADOR LOS REPRODUZCA.

### [data]()

Contiene los ficheros .json que definen la posicion, tamaño y frames del sprite en cada imagen.

Tambien contiene los ficheros que se encargan de definir los diferentes niveles. Es en estos archivos donde se definen las posiciones de los enemigos, el suelo y todo lo que visualizamos en el mapa, excepto Mario.

### [images]()

En esta carpeta se encuentran las imagenes que se utilizan para los elementos de construccion de nivel, pintar los sprites, el fondo del juego y la pantalla inicial.

### [lib]()

En esta carpeta se encuentran todos los archivos que componen el motor quintus, que es el que se ha utilizado para desarrollar el juego.

## Ampliaciones realizadas

En esta practica, a parte de las mecanicas basicas, hemos realizado una serie de ampliaciones, basandonos siempre en el comportamiento original tanto de Mario como de sus enemigos.

- Bloques de monedas
- Bloques de setas
  - Seta verde: te da una vida mas.
  - Seta roja: te hace grande, provocando asi que si te chocas con un enemigo vuelvvas a ser pequeño.
- Koopa, que ademas al eliminarlo se convierte en la concha.
- Toda la informacion mostrada en el HUD y las variables necesarias para su funcionamiento.
- Diferentes niveles.
- Se muestran los puntos al matar a un enemigo.


## Nuestro juego

Para probar este juego es necesario descargarlo y ejecutarlo con un servidor, ya sea python o XAMPP.


## Colaboradores

[César Godino Rodríguez](https://github.com/cloudgrey)

[Carmen López Gonzalo](https://github.com/calope03)
