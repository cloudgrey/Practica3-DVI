var level=1;
var MAX_LEVEL = 4;
var PUNTUACION_GOOMBA = 100;
var PUNTUACION_KOOPA = 200;
var PUNTUACION_BLOOPA = 400;
var game = function() {
	//Función encargada de configurar una instancia del motor, cargar los recursos y lanzar el juego.

	//-----------------------Se inicializa el motor------------------------------------------------

	/* 
	   Set up an instance of the Quintus engine and include
	   the Sprites, Scenes, Input and 2D module. The 2D module
	   includes the `TileLayer` class as well as the `2d` component.

	   Creo una instancia del motor con el constructor Quintus().
	   La funcionalidad en Quintus se organiza en módulos que cargamos opcionalmente
	   al construir la instancia del motor junto al include(...)
	*/
	//{audioSupported: [ 'wav','mp3','ogg' ]}
	//{ audioSupported: ['mp3','ogg'] }
	var Q = window.Q = Quintus({audioSupported: [ 'mp3','ogg','wav' ]})
						.include("Sprites, Scenes, Input, Touch, UI, Anim, TMX, 2D, Audio") 
						.setup({ maximize: true }) 
						.controls().touch().enableSound();


	

/*-----------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------- MARIO ------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Mario",{

		// the init constructor is called on creation
		//Se puede redefinir un método definido en una superclase, 
		//y es posible invocar la versión redefinida con this._super(..).
		init: function(p) {

			console.log("Estamos creando una instancia de Mario");
 
			this._super(p, {
								sheet: "cosasmario", 
								sprite: "cosasmario",
								x: 55, 
								y: 528, 
								gravity: 0.5,
								puedeSaltar: true,
								inmune: false,
								temporizadorInmune: 0,
								grande: false,
								collisionMask: Q.SPRITE_DEFAULT
						   }
						); 

			this.add('2d, platformerControls, animation');

			/*
			Mario solo podrá saltar cuando este en el suelo, para así evitar que pueda saltar en el aire.
			*/
			this.on("bump.bottom",function(collision) {

				if(collision.obj.isA("TileLayer") || collision.obj.isA("LifeBlock")|| collision.obj.isA("BigBlock")|| collision.obj.isA("CoinBlock")) { 
					this.p.puedeSaltar = true;
				}

			});

		},//init 

		step: function(dt) {
			//console.log(Q.input);
			//console.log(this.p.direction);
			//console.log(this);

			if(Q.inputs['right']){
				this.play("run_right");
			}
			else if(this.p.direction == "right") {
				this.play("still_right");
			}
			
			if(Q.inputs['left']){
				this.play("run_left");
			}
			else if(this.p.direction == "left") {
				this.play("still_left");
			}

			if(Q.inputs['up']){
				//Q.inputs['up'] = false;
				//Q.audio.play("jump.mp3");
				if(this.p.puedeSaltar==true){
					this.p.puedeSaltar=false;
					this.p.vy = -400;
					if(this.p.direction == "right") {
						this.play("jump_right");
					}
					else if(this.p.direction == "left") {
						this.play("jump_left");
					}
				}
			}
			//Si Mario cae demasiado se considera que ha muerto
			if(this.p["y"] > 650){
				//this.p["x"] = 20;
				//this.p["y"] = 528;
				console.log("Tas caío lol");
				Q.stageScene("endGame",2, { label: "You Died", sound: "music_die.ogg" }); 
				this.destroy();
			}
			//La camara empieza a seguir a Mario cuando va por la mitad de la pantalla.
			if(this.p.x >= Q.width/2){
				this.stage.add("viewport").follow(this,{ x: true, y: false });
				this.stage.viewport.offsetX = 0;
				this.stage.viewport.offsetY = 60;
			}
			//Si Mario es inmune por que se ha chocado con un enemigo, empieza un contador y se le pone un poco transparente para que el usuario sepa que es inmune un tiempo.
			if (this.p.inmune) {
			  this.p.temporizadorInmune++;
	      this.p.opacity = 0.5;
	      if (this.p.temporizadorInmune >50) {
	        this.p.inmune = false;
	        this.p.opacity = 1;
	      }
		  }
		}//step

	});//extend Mario

/*-----------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------- ENEMIGOS ----------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------*/


	Q.component("defaultEnemy", {
		added: function() {
	    	// Para inicializar cuando se crea el componente
			//this.entity.p.algunaPropiedadDelObjetoQueTieneEsteComponente = 30; 
			
			//this.entity.on('bump.left,bump.right,bump.bottom', this, 'colisionOtroLado');
			//this.entity.on('bump.top', this, 'colisionArriba');
		},

		colisionArriba: function(objetoQueGolpea) {
			if(objetoQueGolpea.isA("Mario")) {
				//objetoGolpeado.destroy();
				//this.entity.destroy();
				
				
				if(!this.entity.p.killed){
					this.entity.p.killed = true;
					this.entity.p.horaInicioMuerte = new Date().getTime() / 1000;
					//this.entity.p.sensor = true;

					//this.entity.p.type = Q.SPRITE_NONE;
    				this.entity.p.collisionMask = Q.SPRITE_NONE;
    				this.entity.p.gravity = 0;
				} 

			  objetoQueGolpea.p.vy = -300;//Manda a Mario hacia arriba
			  
			  var puntos = 100;
			  if(this.entity.isA("Goomba")){
			  	puntos= PUNTUACION_GOOMBA + ".gif";
			  }
			  if(this.entity.isA("Bloopa")){
			  	puntos= PUNTUACION_BLOOPA + ".gif";
			  }
			    var xAntigua = this.entity.p.x;
			    var yAntigua = this.entity.p.y;
			    var punto = this.entity.stage.insert(new Q.Puntos({asset: puntos, x: xAntigua, y: yAntigua - 34 }));
			}
		},

		/*
		Si Mario es grande y es golpeado por un enemigo se hace pequeño de nuevo
		Si es pequeño entonces pierde una vida, cuando las vidas llegan a 0 muere
		*/
		colisionOtroLado: function(objetoQueGolpea) {
			//console.log(this.entity.p);
			if(!objetoQueGolpea.p.grande){
				if(objetoQueGolpea.isA("Mario") && !objetoQueGolpea.p.inmune) {
					console.log("una vida menos");
					objetoQueGolpea.p.inmune=true;
					objetoQueGolpea.p.temporizadorInmune = 0;
					Q.state.dec("lives",1);
					console.log(Q.state.get("lives"));
					if(Q.state.get("lives")==0){
						Q.stageScene("endGame",2, { label: "You Died", sound: "music_die.ogg" }); 
						objetoQueGolpea.destroy();
					}
				}
			}else{
				objetoQueGolpea.p.scale =1;
				objetoQueGolpea.p.grande=false;
				objetoQueGolpea.p.inmune=true;
				objetoQueGolpea.p.temporizadorInmune = 0;
			 
			}
		}

	});//defaultEnemy

	Q.Sprite.extend("Goomba",{

		init: function(p) {

			console.log("Estamos creando una instancia de Goomba");

			this._super(p, {
								sheet: "goomba", 
								sprite: "goomba", 
								x: 1478, 
								y: 494, 
								vx: 100,
								killed: false,
								horaInicioMuerte: 0,
								segundosHastaDesaparecer: 1,
								type: Q.SPRITE_ENEMY
						   }
						); 

			this.add('2d, aiBounce, animation, defaultEnemy');

			this.on("bump.left,bump.right",function(collision) {

				this.defaultEnemy.colisionOtroLado(collision.obj);

			});//on bump left-right-bottom

			this.on("bump.top",function(collision) {

				Q.state.inc("puntuacion",PUNTUACION_GOOMBA);
				this.defaultEnemy.colisionArriba(collision.obj);

			});//on bump top 

		},//init 
		step: function (dt){
				
			if(this.p.killed){
				this.play("muere");
				
				var horaActual = new Date().getTime() / 1000;

				if(horaActual >= this.p.horaInicioMuerte + this.p.segundosHastaDesaparecer){
					//console.log("entra?");
					this.destroy();
				}
				
			}
			else{
				this.play("normal");
			}

		}//step

	});//extend Goomba


	Q.Sprite.extend("Bloopa",{

		init: function(p) {

			console.log("Estamos creando una instancia de Bloopa");

			this._super(p, {
								sheet: "bloopa",
								sprite: "bloopa",
								killed: false,
								horaInicioMuerte: 0,
								coordenadaYoriginal: 0,
								segundosHastaDesaparecer: 1,
								type: Q.SPRITE_ENEMY
						   }
						); //_super
			this.p.coordenadaYoriginal = this.p.y;

			this.add('2d, animation, defaultEnemy');

			this.on("died",this,"muerto");

			this.on("bump.left,bump.right,bump.bottom",function(collision) {

				this.defaultEnemy.colisionOtroLado(collision.obj); 

			});//on bump left-right-bottom

			this.on("bump.top",function(collision) {

				Q.state.inc("puntuacion",PUNTUACION_BLOOPA);
				this.defaultEnemy.colisionArriba(collision.obj);

			});//on bump top 
		},//init 
		
		step: function (dt){

			//console.log(this.p);
			if(this.p.killed){
				this.play("muere");
				var horaActual = new Date().getTime() / 1000;

				if(horaActual >= this.p.horaInicioMuerte + this.p.segundosHastaDesaparecer){
					this.destroy();
				}
				//return; PREGUNTARLE si este return le mola, lo he visto en un ejemplo y así no comprueba nada mas del step porque no hace falta realmente
			}
			else{
				this.play("normal");
			}
			if(this.p.y == this.p.coordenadaYoriginal-16){
				this.p["gravity"] = 0.08;
				this.p["vy"] = -80;
				//console.log("Parriba");
			}
		}
	});//extend Bloopa

	Q.Sprite.extend("Koopa",{

		init: function(p) {

			console.log("Estamos creando una instancia de Koopa");

			this._super(p, {
								sheet: "koopaIzq", 
								sprite: "koopa",
								vx: 100, 
								killed: false,
								thrust: false,
								vecesGolpeado: 0,
								gravity: 1,
								scale: 1.3,
								velocidadEnloquecido: 150,
								esPeligroso: true,
								type: Q.SPRITE_ENEMY
						   }
						); //_super

			this.add('2d, aiBounce, animation, defaultEnemy');

			
			this.on("bump.left,bump.right",function(collision) {
				
				if(collision.obj.isA("Mario")) { 
					
					if(this.p.esPeligroso){
						
						this.defaultEnemy.colisionOtroLado(collision.obj);
						
					}

					if(this.p.killed && !this.p.thrust){
						this.p.vecesGolpeado=2;
						this.p.thrust = true;
						if(collision.obj.p.direction == "right") this.p.vx = this.p.velocidadEnloquecido; //si mario le empuja desde la izquierda (porque se mueve hacia el yendo a la derecha)
						else this.p.vx = -this.p.velocidadEnloquecido;

						this.p.horaInicioPeligroso = new Date().getTime();
					}
					
				}

			});//on bump left-right-bottom

			this.on("bump.top",function(collision) {

				if(collision.obj.isA("Mario")) {
					//this.destroy();
					//console.log("hola");
					this.p.vecesGolpeado++;
					collision.obj.p.vy = -300;

					if(this.p.vecesGolpeado == 1) {
						this.p.killed = true;
						this.p.esPeligroso = false;
						this.p.vx = 0;
						this.p.scale = 0.9;
						var puntos = PUNTUACION_KOOPA + ".gif";
				    var xAntigua = this.p.x;
				    var yAntigua = this.p.y;
				    var punto = this.stage.insert(new Q.Puntos({asset: puntos, x: xAntigua, y: yAntigua - 34 }));
						Q.state.inc("puntuacion",PUNTUACION_KOOPA);
					}
					else if(this.p.vecesGolpeado == 2) {
						this.p.thrust = true;
						this.p.esPeligroso = true;
						 
						//saber si mario le salta yendo hacia la derecha o izquierda para saber si darle velocidad positiva o negativa, respectivamente, al caparazon
						//console.log(collision.obj.p.direction);
						if(collision.obj.p.direction == "right") this.p.vx = this.p.velocidadEnloquecido; //si mario le salta desde la izquierda (porque se mueve hacia el yendo a la derecha)
						else this.p.vx = -this.p.velocidadEnloquecido;

						//this.p.vx = 30;
						//console.log(this.p);
					}
					else if(this.p.vecesGolpeado > 2) {
						this.p.vecesGolpeado = 1;
						this.p.thrust = false;
						this.p.esPeligroso = false;
						this.p.vx = 0;
					}
				  
				    //Q.stageScene("endGame",1, { label: "You Won!" });
				}
				//console.log(collision.isA("Mario"));

				//this.defaultEnemy.colisionArriba(collision.obj);
				//this.p.killed = true;

			});//on bump top 

		},//init 
		step: function (dt){
				//console.log(this.p.direction);
			if(this.p.killed){
				if(!this.p.thrust){
					if(this.p.vx > 0) this.play("shellIzq");
					else this.play("shellDer");
				}
				else {
					this.play("enloquecido"); 
					if(!this.p.esPeligroso){
						var horaActual = new Date().getTime();
						if(this.p.horaInicioPeligroso + 1000 <= horaActual) {
							this.p.esPeligroso = true;
						}
					}
				}
				//console.log(this.p.esPeligroso);
			}
			else{
				if(this.p.vx > 0) this.play("normalDer");
				else this.play("normalIzq");
			}
		}
	});//extend Koopa

/*-----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------- PRINCESA --------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------*/


	Q.Sprite.extend("Princess",{

		init: function(p) {

			console.log("Estamos creando una instancia de Princess");

			this._super(p, {
								asset: "princess.png",
								yaColisionada: false
						   }
						); //_super

			this.add('2d');
			this.on("bump.top,bump.left,bump.right,bump.bottom",function(collision) {
		
				if(collision.obj.isA("Mario") && !this.yaColisionada) {
					//console.log("hola mario");
					collision.obj.del('2d, platformerControls');
					this.yaColisionada = true;
					Q.stageScene("winGame",2, { label: "You Won!", sound: "music_level_complete.ogg" });
					//console.log("entra varias veces con la colision... asegurarse de que corte solo con una");
				}
			});//on

		}//init 

	});//extend Princess

/*-----------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------- MONEDA -----------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Coin",{

		init: function(p) {

			console.log("Estamos creando una instancia de Coin");

			this._super(p, {
								sheet: "coin", 
								sprite: "coin",
								gravity: 0,
								yaColisionada: false,
								sensor: true
						   }
						); //_super
			this.p.origenY = this.p.y;
			this.add('2d, animation, tween');
			this.on("bump.top,bump.left,bump.right,bump.bottom",function(collision) {
				if(collision.obj.isA("Mario") && !this.yaColisionada) {
					this.yaColisionada = true;
					console.log("Has cogido una moneda");
					this.animate({x: this.p.x, y: this.p.y-50});
					Q.audio.play("coin.ogg");
					Q.state.inc("monedasRecogidas",1); 
				}
			});//on

		},//init 

		step: function(dt){
			this.play("normal");
			if(this.p.y <= (this.p.origenY-50)){
				this.destroy();
			} 
		}

	});//extend Coin

/*-----------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------- SETA VIDA ----------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Life",{

		init: function(p) {

			console.log("Estamos creando una instancia de Coin");

			this._super(p, {
								asset: "life.png",
								gravity: 1,
								vx: 100,
								type: Q.SPRITE_ENEMY
						   }
						); //_super
			this.add('2d, aiBounce, animation');
			this.on("bump.top,bump.left,bump.right,bump.bottom",function(collision) {
				if(collision.obj.isA("Mario") && !this.yaColisionada) {
					Q.state.inc("lives",1); // add 1 to monedasRecogidas
					this.destroy();
				}
			});//on

		},//init 

		step: function(dt){
		}

	});

/*-----------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------- SETA GRANDE -------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------*/

	Q.Sprite.extend("Big",{

		init: function(p) {

			console.log("Estamos creando una instancia de big");

			this._super(p, {
								asset: "big.png",
								gravity: 1,
								vx: 100,
								type: Q.SPRITE_ENEMY
						   }
						); //_super
			this.add('2d, aiBounce, animation');
			this.on("bump.top,bump.left,bump.right,bump.bottom",function(collision) {
				if(collision.obj.isA("Mario") && !this.yaColisionada) {
					collision.obj.p.scale = 1.5;
					collision.obj.p.grande = true;
					this.destroy();
				}
			});//on

		},//init 

		step: function(dt){
		}

	});

/*-----------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------- PUNTOS ------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------*/
	Q.Sprite.extend("Puntos",{

		init: function(p) {

			console.log("Estamos creando una instancia de puntos");

			this._super(p, {
								asset: "100.gif",
								gravity: 0,
								vy: -100,
								type: Q.SPRITE_NONE,
								collisionMask: Q.SPRITE_NONE
						   }
						); //_super
			this.add('2d, animation');
			this.p.yOriginal=this.p.y;

		},//init 

		step: function(dt){
			if(this.p.y <= this.p.yOriginal-100){
				this.destroy();
			}
		}

	});

/*-----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------- BLOQUES ---------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------*/

  Q.Sprite.extend("CoinBlock",{

    init: function(p) {
    	console.log("Estamos creando una instancia de Coiagssgsdgn");

     
      this._super(p, {
      					sprite: "block", 
      					gravity: 0, 
      					sheet: "block", 
      					golpeado: false, 
      					moviendo: false
      				});

      this.add('2d, animation, tween');

     this.on("bump.bottom",function(collision) {
        if(collision.obj.isA("Mario")) {

          if(!this.p.moviendo && !this.p.golpeado){
            this.p.moviendo = true;
            Q.state.inc("monedasRecogidas",1);
            
            var xAntigua = this.p.x;
            var yAntigua = this.p.y;

            this.animate({ x: xAntigua, y: yAntigua - 10, angle: 0 }, 0.1, Q.Easing.Quadratic.Linear, {callback: function(){

              var coin = this.stage.insert(new Q.Coin({ x: xAntigua, y: yAntigua - 34 }));
              coin.animate({ x: this.p.x, y: this.p.y - 100, angle: 0 }, 0.5, Q.Easing.Quadratic.Linear, {callback: function(){ this.destroy();}});
              this.play("change");
              this.p.golpeado = true;

              this.animate({ x: xAntigua, y: yAntigua, angle: 0 }, 0.1, Q.Easing.Quadratic.Linear, {callback: function(){moving = false}});
            }});
          }
        }
      });

    },

    step: function(p){}
  });


  Q.Sprite.extend("BigBlock",{

    init: function(p) {
    	console.log("Estamos creando una instancia de lifeblock");

     
      this._super(p, {
      					sprite: "block", 
      					gravity: 0, 
      					sheet: "block", 
      					golpeado: false, 
      					moviendo: false
      				});

      this.add('2d, animation, tween');

     this.on("bump.bottom",function(collision) {
        if(collision.obj.isA("Mario")) {

          if(!this.p.moviendo && !this.p.golpeado){
            this.p.moviendo = true;
            Q.state.inc("monedasRecogidas",1);
            
            var xAntigua = this.p.x;
            var yAntigua = this.p.y;

            this.animate({ x: xAntigua, y: yAntigua - 10, angle: 0 }, 0.1, Q.Easing.Quadratic.Linear, {callback: function(){

              this.stage.insert(new Q.Big({ x: xAntigua, y: yAntigua - 12 }));
              
              this.play("change");
              this.p.golpeado = true;

              this.animate({ x: xAntigua, y: yAntigua, angle: 0 }, 0.1, Q.Easing.Quadratic.Linear, {callback: function(){moving = false}});
            }});
          }
        }
      });

    },
    step: function(p){}
  });


  Q.Sprite.extend("LifeBlock",{

    init: function(p) {
    	console.log("Estamos creando una instancia de lifeblock");

     
      this._super(p, {
      					sprite: "block", 
      					gravity: 0, 
      					sheet: "block", 
      					golpeado: false, 
      					moviendo: false
      				});

      this.add('2d, animation, tween');

     this.on("bump.bottom",function(collision) {
        if(collision.obj.isA("Mario")) {

          if(!this.p.moviendo && !this.p.golpeado){
            this.p.moviendo = true;
            Q.state.inc("monedasRecogidas",1);
            
            var xAntigua = this.p.x;
            var yAntigua = this.p.y;

            this.animate({ x: xAntigua, y: yAntigua - 10, angle: 0 }, 0.1, Q.Easing.Quadratic.Linear, {callback: function(){

              this.stage.insert(new Q.Life({ x: xAntigua, y: yAntigua - 12 }));
              
              this.play("change");
              this.p.golpeado = true;

              this.animate({ x: xAntigua, y: yAntigua, angle: 0 }, 0.1, Q.Easing.Quadratic.Linear, {callback: function(){moving = false}});
            }});
          }
        }
      });
    },

    step: function(p){}
  });

/*-----------------------------------------------------------------------------------------------------------*/
/*------------------------------------------ ELEMENTOS DEL HUD ----------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------*/

Q.UI.Text.extend("Monedas",{ 

	init: function(p) {
		this._super(p, {align: "left", label: "x" + Q.state.get("monedasRecogidas"),  }); 
		Q.state.on("change.monedasRecogidas",this,"update_monedas");
	},//init

	update_monedas: function(monedasRecogidas) {
		this.p.label = "x" + monedasRecogidas;
	}
});


Q.UI.Text.extend("Vidas",{ 

	init: function(p) {
		this._super(p, {align: "left", label: "x" + Q.state.get("lives") }); 
		Q.state.on("change.lives",this,"update_vidas");
	},//init

	update_vidas: function(lives) {
		this.p.label = "x" + lives;
	}
});


Q.UI.Text.extend("Score",{ 

	init: function(p) {
		this._super(p, {align: "left", label: "x" + Q.state.get("puntuacion") }); 
		Q.state.on("change.puntuacion",this,"update_puntos");
	},//init

	update_puntos: function(puntuacion) {
		this.p.label = "x" + puntuacion;
	}
});

/*-----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------- ESCENAS ---------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------*/

	Q.scene("level",function(stage) {
		var nivel = "nivel"+level+".tmx";
		Q.audio.play( "music_main.ogg", { loop: true });
		Q.stageTMX(nivel,stage);

		// Create the player and add them to the stage
		var player = stage.insert(new Q.Mario());
	
	});//scene level1

	Q.scene("hud", function(stage){
		var containermonedas = stage.insert(new Q.UI.Container({x: Q.width/4, y: 30}));

		var imgmoneda = containermonedas.insert(new Q.UI.Button({
			asset: 'coin.gif',
      		x: 0,
      		y:0
    	}, function() {}));
   	var label = containermonedas.insert(new Q.Monedas({x:imgmoneda.p.w, y: -10}));
   	label.fontString = "800 24px 'Press Start'";
		containermonedas.fit(10);

		var containervidas = stage.insert(new Q.UI.Container({ x: (Q.width/4)*2, y: 30}));
		
		var imgvida = containervidas.insert(new Q.UI.Button({
			asset: 'vida.png',
      		x: -16,
      		w:32,
      		h:32,
      		scale: 0.05,
      		y:-16
    	}, function() {}));
 		var label = containervidas.insert(new Q.Vidas({x:imgvida.p.w, y: -10}));
 		label.fontString = "800 24px 'Press Start'";
 		containervidas.fit(10);

   	var containerscore = stage.insert(new Q.UI.Container({x: (Q.width/4)*3, y: 30}));
		
		var imgscore = containerscore.insert(new Q.UI.Button({
			asset: 'score.png',
      		x: 0,
      		y: 0
    	}, function() {}));
 		var label = containerscore.insert(new Q.Score({x:imgscore.p.w, y: -10}));
 		label.fontString = "800 24px 'Press Start'";
 		containerscore.fit(10);

   	var containerworld = stage.insert(new Q.UI.Container({x: (Q.width/2), y: 60}));
   	var label = containerworld.insert(new Q.UI.Text({label: "World\n"+level+" - "+MAX_LEVEL }));
   	label.fontString = "800 24px 'Press Start'";
   	containerscore.fit(10);
	});//scene hud


	Q.scene('endGame',function(stage) {

		Q.audio.stop("music_main.ogg");
		Q.audio.play(stage.options.sound);

		var container = stage.insert(new Q.UI.Container({x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"}));

		var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: "Play Again" }));
		var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, label: stage.options.label }));

		button.on("click",function() {
		  Q.clearStages();
		  Q.stageScene('startGame');
		});

		container.fit(20);

	});//scene endgame

	Q.scene('winGame',function(stage) {

		Q.audio.stop("music_main.ogg");
		Q.audio.play(stage.options.sound);

		var container = stage.insert(new Q.UI.Container({x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"}));
		if(level==MAX_LEVEL){
			var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: "Play Again" }));
			var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, label: stage.options.label }));

			button.on("click",function() {
			  Q.state.reset({ monedasRecogidas: 0, lives: 3, puntuacion: 0});
			  Q.clearStages();
			  level=1;
			  Q.stageScene('level');
			  Q.stageScene("hud",1);
			});
		}else{
			var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: "Next Level" }));
			var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, label: stage.options.label }));

			button.on("click",function() {
			  Q.clearStages();
			  level++;
			  Q.stageScene('level');
			  Q.stageScene("hud",1);
			});
		}
		
		container.fit(20);

	});

	Q.scene('startGame',function(stage) {
		
		Q.state.reset({ monedasRecogidas: 0, lives: 3, puntuacion: 0});

		var container = stage.insert(new Q.UI.Container({
															x: Q.width/2, 
															y: Q.height/2, 
															fill: "rgba(0,0,0,0.5)"
														}));

		var button = container.insert(new Q.UI.Button({ x:Q.width/2 , y: Q.height/2, h: Q.height, w: Q.width, asset: "mainTitle.png" })); 
		button.on("click",function() {
		  Q.stageScene('level');
		  Q.stageScene("hud",1);
		});

		Q.input.on("confirm",stage,function() {
		    Q.stageScene('level');
		    Q.stageScene("hud",1);
		});
		

	});//scene startgame


	

	Q.loadTMX("nivel1.tmx, nivel2.tmx, nivel3.tmx,nivel4.tmx, mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json, block1.png, block.json, koopa.png, koopa.json, princess.png, mainTitle.png,100.gif,200.gif,400.gif, music_main.ogg, music_level_complete.ogg, music_die.ogg, coin.ogg, coin.png, coin.json, life.png, jump.mp3, unlocked.mp3, coin.gif, vida.png, score.png, big.png", function() {
	  
	  Q.compileSheets("mario_small.png", "mario_small.json");
	  Q.compileSheets("goomba.png", "goomba.json");
	  Q.compileSheets("bloopa.png", "bloopa.json");
	  Q.compileSheets("coin.png", "coin.json");
	  Q.compileSheets("koopa.png", "koopa.json");
	  Q.compileSheets("block1.png", "block.json");

	  Q.animations("cosasmario", {
		  run_right: { frames: [1,2,3], rate: 2/15},
		  run_left: { frames: [15,16,17], rate: 2/15},
		  still_right: { frames: [0], rate: 1/15},
		  still_left: { frames: [14], rate: 1/15},
		  jump_right: { frames: [4], rate: 2/15},
		  jump_left: { frames: [18], rate: 2/15}
	  });

	  Q.animations("bloopa", {
		  normal: { frames: [0,1], rate: 8/15},
		  muere: { frames: [2], rate: 8/15}//, trigger: "died"}
	  });

	  Q.animations("goomba", {
		  normal: { frames: [0,1], rate: 8/15},
		  muere: { frames: [2], rate: 8/15}
	  });

	  Q.animations("koopa", {
		  normalIzq: { frames: [3,2,1,0], rate: 3/15},
		  normalDer: { frames: [7,6,5,4], rate: 3/15},
		  shellIzq: { frames: [8], rate: 8/15},
		  shellDer: { frames: [9], rate: 8/15},
		  enloquecido: { frames: [8, 9], rate: 3/15}
	  });

	  Q.animations("coin", {
		  normal: { frames: [0,1,2], rate: 5/15}
	  });


	  Q.animations("block", {
	  	normal: {frames: [0], rate: 5/10},
	    change: {frames: [1], rate: 5/10}
	  });

	  Q.stageScene("startGame");

	});

}//funcion game