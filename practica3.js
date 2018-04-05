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
						/*
							El método Q.setup([id],[options={}]) es el responsable de vincular 
							la instancia del motor con un elemento de tipo canvas en la página 
							y configurar su tamaño. 
							Si no especificamos nada con .setup(), 
							se crea un canvas de 320 * 420 píxeles
						*/  
						.setup({width: 320, height: 480})
						// And turn on default input controls and touch input (for UI) 
						.controls().touch().enableSound();

	var SPRITE_ENEMY = 1

	//-----------------------Se definen las entidades------------------------------------------------

	// ## Player Sprite
	// The very basic player sprite, this is just a normal sprite
	// using the player sprite sheet with default controls added to it. 
	/*
		Creo la subclase Player con extend (Player hereda de Q.Sprite), 
		y entre las llaves {} van el constructor init y los otros metodos de la clase.
	*/

	Q.Sprite.extend("Mario",{

		// the init constructor is called on creation
		//Se puede redefinir un método definido en una superclase, 
		//y es posible invocar la versión redefinida con this._super(..).
		init: function(p) {

			console.log("Estamos creando una instancia de Mario");

	    	// You can call the parent's constructor with this._super(..)
			/*
				La constructora padre (de Sprite) es: init(p,defaults).
				Recibe un objeto con los atributos a asignar al sprite que se está creando 
				y los mezcla con las propiedades de otro objeto que contiene valores por defecto. 
				Los datos de un sprite se guardan en el atributo p del sprite. 
				Estos atributos son públicos para hacer más eficiente su modificación 
				y consulta (sin necesidad de usar getters y setters).
			*/ 
			this._super(p, {
								sheet: "cosasmario", // Setting a sprite sheet sets sprite width and height 
								sprite: "cosasmario",
								x: 55, // You can also set additional properties that can
								y: 528, // be overridden on object creation
								collisionMask: SPRITE_ENEMY
						   }
						); //_super

			this.add('2d, platformerControls, animation');
			// Write event handlers to respond hook into behaviors.

			//Q.input.on("left");

			/*this.step = function (dt){
				//console.log(this.p);
				//this.p["x"] = 20;
				//this.p["y"] = 20;
				//this.p["z"] = 20;
				//console.log(this.p["frame"]);

				console.log(Q.input);
				if(Q.input['right']){
					this.play("run_right");
				}

				if(this.p["y"] > 650){
					//this.p["x"] = 20;
					//this.p["y"] = 528;
					console.log("Tas caío lol");
					Q.stageScene("endGame",1, { label: "You Died" }); 
					this.destroy();
				}
			}*/
			//qué diferencia hay con el step aqui dentro que fuera?

		},//init 

		/*left: function() {
		    // Play the fire animation at a higher priority
		    if(this.p.direction > 0) {
		      this.play("fire_right",1);
		    } else {
		      this.play("fire_left",1);
		    }
		    console.log("ciao!");
		},*/

		step: function(dt) {
			//console.log(Q.input);
			//console.log(this.p.direction);

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
				if(this.p.direction == "right") {
					this.play("jump_right");
				}
				else if(this.p.direction == "left") {
					this.play("jump_left");
				}
			}

			if(this.p["y"] > 650){
				//this.p["x"] = 20;
				//this.p["y"] = 528;
				console.log("Tas caío lol");
				Q.stageScene("endGame",2, { label: "You Died", sound: "music_die.ogg" }); 
				this.destroy();
			}
		}//step

	});//extend Mario

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

					//this.entity.p.type = Q.SPRITE_NONE;
    				//this.entity.p.collisionMask = Q.SPRITE_NONE;
				} 
				//console.log("AQUI " + this.entity.p.horaInicioMuerte);
				//this.entity.destroy();
			    objetoQueGolpea.p.vy = -300;
			    //Q.stageScene("endGame",1, { label: "You Won!" });
			}
		},

		colisionOtroLado: function(objetoQueGolpea) {
			if(objetoQueGolpea.isA("Mario") && !this.entity.p.killed) { 
				Q.stageScene("endGame",2, { label: "You Died", sound: "music_die.ogg" }); 
				objetoQueGolpea.destroy();
			} 
		}

	});//defaultEnemy

	Q.Sprite.extend("Goomba",{

		init: function(p) {

			console.log("Estamos creando una instancia de Goomba");

			this._super(p, {
								sheet: "goomba", // Setting a sprite sheet sets sprite width and height 
								sprite: "goomba", //agrego sprite por la animacion, sino solo hace falta sheet
								x: 1478, // You can also set additional properties that can
								y: 494, // be overridden on object creation
								vx: 100,
								killed: false,
								horaInicioMuerte: 0,
								segundosHastaDesaparecer: 1,
								type: SPRITE_ENEMY
						   }
						); //_super

			this.add('2d, aiBounce, animation, defaultEnemy');

			
			this.on("bump.left,bump.right",function(collision) {

				/*if(collision.obj.isA("Mario")) { 
					Q.stageScene("endGame",2, { label: "You Died", sound: "music_die.ogg" }); 
					collision.obj.destroy();
				}*/
				this.defaultEnemy.colisionOtroLado(collision.obj);


			});//on bump left-right-bottom

			// If the enemy gets hit on the top, destroy it 
			// and give the user a "hop" 
			this.on("bump.top",function(collision) {

				//console.log(collision.obj);
				/*if(collision.obj.isA("Mario")) {
					this.destroy();
				    collision.obj.p.vy = -300;
				    //Q.stageScene("endGame",1, { label: "You Won!" });
				}*/
				//console.log(collision.isA("Mario"));

				this.defaultEnemy.colisionArriba(collision.obj);
				//this.p.killed = true;

			});//on bump top 
			

			this.step = function (dt){
				
				if(this.p.killed){
					this.play("muere");
					
					var horaActual = new Date().getTime() / 1000;
					/*var horaDeDesaparecer = (new Date().getTime() / 1000) + th;
					console.log("inicio muerte = " + this.p.horaInicioMuerte);
					console.log("hora actual = " + horaActual);
					console.log(this.p.horaInicioMuerte + this.p.segundosHastaDesaparecer);*/
					if(horaActual >= this.p.horaInicioMuerte + this.p.segundosHastaDesaparecer){
						//console.log("entra?");
						this.destroy();
					}
					
				}
				else{
					this.play("normal");
				}

			}

		}//init 

	});//extend Goomba


	Q.Sprite.extend("Bloopa",{

		init: function(p) {

			console.log("Estamos creando una instancia de Bloopa");

			this._super(p, {
								sheet: "bloopa", // Setting a sprite sheet sets sprite width and height 
								sprite: "bloopa",
								x: 200, // You can also set additional properties that can
								y: 527, // be overridden on object creation
								killed: false,
								horaInicioMuerte: 0,
								segundosHastaDesaparecer: 1,
								type: SPRITE_ENEMY
								//type: Q.SPRITE_ENEMY,
      							//collisionMask: Q.SPRITE_DEFAULT
								//vy: -60,
								//gravity: 0
						   }
						); //_super

			this.add('2d, animation, defaultEnemy');

			this.on("died",this,"muerto");

			this.on("bump.left,bump.right,bump.bottom",function(collision) {

				/*if(collision.obj.isA("Mario")) { 
					Q.stageScene("endGame",2, { label: "You Died", sound: "music_die.ogg" }); 
					collision.obj.destroy();
				}*/
				this.defaultEnemy.colisionOtroLado(collision.obj); 

			});//on bump left-right-bottom

			// If the enemy gets hit on the top, destroy it 
			// and give the user a "hop" 
			this.on("bump.top",function(collision) {

				/*if(collision.obj.isA("Mario")) {
					//this.play("muere");
				    //Q.stageScene("endGame",1, { label: "You Won!"});
				    this.destroy();
				    collision.obj.p.vy = -300;
				}*/

				this.defaultEnemy.colisionArriba(collision.obj);


			});//on bump top 

			this.step = function (dt){

				if(this.p.killed){
					this.play("muere");
					var horaActual = new Date().getTime() / 1000;
					
					//this.p.collisionMask = Q.SPRITE_NONE;
					//this.del('2d');
					//this.p.z=4;

					//console.log(this.p.z);
					//this.p.z = 4;
					//console.log(this.p.z);

					if(horaActual >= this.p.horaInicioMuerte + this.p.segundosHastaDesaparecer){
						//console.log("entra?");
						this.destroy();
					}
					//return; PREGUNTARLE si este return le mola, lo he visto en un ejemplo y así no comprueba nada mas del step porque no hace falta realmente
				}
				else{
					this.play("normal");
				}

				if(this.p["y"] < 528-50){//en realidad no hace falta este if, siempre entra en else
					this.p["gravity"] = 1;
					//this.p["y"] = 528;
					//console.log("Pabajo");
					//Q.stageScene("endGame",1, { label: "You Died" }); 
					//this.destroy();
				}
				else if(this.p["y"] == 528){
					this.p["gravity"] = 0.08;
					this.p["vy"] = -80;
					//console.log("Parriba");
					//Q.stageScene("endGame",1, { label: "You Died" }); 
					//this.destroy();
				}
			}

		},//init 
		/*muerto: function() {
			//console.log("hey");
		    //this.destroy();
			//collision.obj.p.vy = -300;
		},*/
	});//extend Bloopa

	Q.Sprite.extend("Princess",{

		init: function(p) {

			console.log("Estamos creando una instancia de Princess");

			this._super(p, {
								asset: "princess.png", // Setting a sprite sheet sets sprite width and height 
								x: 1956, // You can also set additional properties that can
								y: 46, // be overridden on object creation
								yaColisionada: false
						   }
						); //_super

			this.add('2d');
			this.on("bump.top,bump.left,bump.right,bump.bottom",function(collision) {
		
				if(collision.obj.isA("Mario") && !this.yaColisionada) {
					//console.log("hola mario");
					
					if(Q.state.get("monedasRecogidas") >= Q.state.get("monedasTotales")){
						this.yaColisionada = true;
						Q.stageScene("endGame",2, { label: "You Won!", sound: "music_level_complete.ogg" });
					}
					else{
						console.log("Coge todas las monedas primero");
					}
					//console.log("entra varias veces con la colision... asegurarse de que corte solo con una");
					
				}
			});//on

		}//init 

	});//extend Princess

	Q.Sprite.extend("Coin",{

		init: function(p) {

			console.log("Estamos creando una instancia de Coin");

			this._super(p, {
								sheet: "coin", // Setting a sprite sheet sets sprite width and height 
								sprite: "coin",
								x: 100, // You can also set additional properties that can
								y: 480, // be overridden on object creation
								gravity: 0,
								yaColisionada: false
						   }
						); //_super

			this.add('2d, animation, tween');
			this.on("bump.top,bump.left,bump.right,bump.bottom",function(collision) {
				if(collision.obj.isA("Mario") && !this.yaColisionada) {
					this.yaColisionada = true;
					console.log("Has cogido una moneda");
					this.animate({y: this.p.y-50, angle: 360 });
					Q.audio.play("coin.ogg");
					Q.state.inc("monedasRecogidas",1); // add 1 to monedasRecogidas
					//console.log("vigilar para que colisione solo 1 vez con la moneda");
				}
			});//on

		},//init 

		step: function(dt){
			//console.log("step de moneda");
			this.play("normal");
			if(this.p.y <= 430) this.destroy();
		}

	});//extend Coin

	Q.UI.Text.extend("Score",{ 

		init: function(p) {
			this._super({ label: "Monedas: " + Q.state.get("monedasRecogidas") + " de " + Q.state.get("monedasTotales"), 
							x: 0,
							y: 0
						}); 

			//Q.state.on("change.score",this,"score");
			Q.state.on("change",this,"score");
		},//init

		score: function(score) {
			//console.log("ha entrado en score " + score);
			//Pero entonces el score del parametro... como se usa?
			this.p.label = "Monedas: " + Q.state.get("monedasRecogidas") + " de " + Q.state.get("monedasTotales"); 
			if(Q.state.get("monedasRecogidas") >= Q.state.get("monedasTotales")){
				Q.audio.play("unlocked.mp3");
			}
		}//score

		/*step: function(dt){
			this.p.x = Q.width/2;
			this.p.y = Q.width/2;
		}*/
	});

	//-----------------------Se definen las escenas------------------------------------------------
	
	/*
		El nivel se genera a partir de los recursos gráficos de la carpeta sprites,
		de la información que se almacena en el fichero level.json
		y de las coordenadas en el fichero sprites.json:
	*/
	//Este es el código que se encarga de configurar las escenas:

	// ## Level1 scene
	// Create a new scene called level 1 
	Q.scene("level1",function(stage) {
		
		Q.audio.play( "music_main.ogg", { loop: true });
		Q.stageTMX("level.tmx",stage);

		// Create the player and add them to the stage
		var player = stage.insert(new Q.Mario());
		stage.add("viewport").follow(player);//, { x: true, y: false });
		stage.viewport.offsetX = -110;
		stage.viewport.offsetY = 160;

		var goomba = stage.insert(new Q.Goomba());
		var bloopa = stage.insert(new Q.Bloopa());
		var princess = stage.insert(new Q.Princess());
		var moneda = stage.insert(new Q.Coin());
		var moneda2 = stage.insert(new Q.Coin({x: 300, y:480}));
		
		// Expand the container to visibily fit it's contents 
		// (with a padding of 20 pixels)
		//container.fit(20);

	});//scene level1

	Q.scene("hud", function(stage){
		
		var container = stage.insert(new Q.UI.Container({
															x: Q.width/2, 
															y: Q.height/10//, 
															//fill: "rgba(0,0,0,0.5)"
														}));

		//var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: "Play Again" }));
		var label = container.insert(new Q.Score({x:10, y: -10}));//, label: "Monedas : " + Q.state.get("monedasRecogidas") }));

	});//scene hud

	/*Q.scene("level1",function(stage) {
	  Q.stageTMX("level1.tmx",stage);
	  stage.add("viewport").follow(Q("Player").first());
	});*/

	// To display a game over / game won popup box,
	// create a endGame scene that takes in a `label` option 
	// to control the displayed message. 
	Q.scene('endGame',function(stage) {

		Q.audio.stop("music_main.ogg");
		Q.audio.play(stage.options.sound);

		var container = stage.insert(new Q.UI.Container({
															x: Q.width/2, 
															y: Q.height/2, 
															fill: "rgba(0,0,0,0.5)"
														}));

		var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: "Play Again" }));
		var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, label: stage.options.label }));

		// When the button is clicked, clear all the stages 
		// and restart the game. 
		button.on("click",function() {
		  Q.clearStages();
		  Q.stageScene('startGame');
		});

		// Expand the container to visibily fit it's contents 
		// (with a padding of 20 pixels)
		container.fit(20);

	});//scene endgame

	Q.scene('startGame',function(stage) {

		/*
		recomendación del profe: hacer un 
		stage.on("destroy", function(){
			
			y aqui destruir los sprites que queden activos
			para que no hagan nada ni respondan a las teclas, se limpia así todo lo generado
		});
		*/

		Q.state.reset({ monedasRecogidas: 0, monedasTotales: 2, lives: 1});

		var container = stage.insert(new Q.UI.Container({
															x: Q.width/2, 
															y: Q.height/2, 
															fill: "rgba(0,0,0,0.5)"
														}));

		var button = container.insert(new Q.UI.Button({ x: 0, y: 0, h: Q.height, w: Q.width, asset: "mainTitle.png" }));
		//var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, label: stage.options.label }));

		// When the button is clicked, clear all the stages 
		// and restart the game. 
		button.on("click",function() {
		  //Q.clearStages();
		  Q.stageScene('level1');
		  Q.stageScene("hud",1);
		});


		/*Q.input.on("confirm",this,function() {
		    // Do something
		    if(pantallaComienzo) {
		    	Q.stageScene('level1');
		    	Q.stageScene("hud",1);
		    }
		    pantallaComienzo = false;
		}); el que funcionaba con la ñapa de primeras*/

		Q.input.on("confirm",stage,function() {
		    // Do something
		    Q.stageScene('level1');
		    Q.stageScene("hud",1);
		});
		
		//console.log(KEY_NAMES);

		/*if(Q.input['confirm']) {
			console.log("Holi"); //enter pulsado
		  // do something
		}
		console.log(Q.inputs);*/

		// Expand the container to visibily fit it's contents 
		// (with a padding of 20 pixels)
		//container.fit(Q.width);

	});//scene startgame


	//-----------------------Carga de recursos e inicio del juego------------------------------------------------
	
	/*Q.load("mario_small.png, mario_small.json", function() {
		Q.compileSheets("mario_small.png", "mario_small.json");
		//Q.stageScene("level1");
	});//load*/

	/*Q.loadTMX("level.tmx", function() {
		//Q.stageScene("level1");
		//Q.loadTMX("level.tmx");
		
   		Q.stageScene("level1", 2);
	});*/

	Q.loadTMX("level.tmx, mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json, princess.png, mainTitle.png, music_main.ogg, music_level_complete.ogg, music_die.ogg, coin.ogg, coin.png, coin.json, jump.mp3, unlocked.mp3", function() {
	  
	  Q.compileSheets("mario_small.png", "mario_small.json");
	  Q.compileSheets("goomba.png", "goomba.json");
	  Q.compileSheets("bloopa.png", "bloopa.json");
	  //Q.compileSheets("princess.png");
	  Q.compileSheets("coin.png", "coin.json");
	  //Q.stageScene("level1");

	  Q.animations("cosasmario", {
		  run_right: { frames: [1,2,3], rate: 1.5/15},
		  run_left: { frames: [15,16,17], rate: 1.5/15},
		  still_right: { frames: [0], rate: 1/15},
		  still_left: { frames: [14], rate: 1/15},
		  jump_right: { frames: [4], rate: 1/15},
		  jump_left: { frames: [18], rate: 1/15}
	  });

	  Q.animations("bloopa", {
		  normal: { frames: [0,1], rate: 8/15},
		  muere: { frames: [2], rate: 8/15}//, trigger: "died"}
	  });

	  Q.animations("goomba", {
		  normal: { frames: [0,1], rate: 8/15},
		  muere: { frames: [2], rate: 8/15}
	  });

	  Q.animations("coin", {
		  normal: { frames: [0,1,2], rate: 5/15}
	  });

	  Q.stageScene("startGame");
	  //Q.stageScene("hud",1);
	  /*"marioR":{"sx":0,"sy":0,"tileW":31,"tileH":32,"frames":3},
		"marioL":{"sx":448,"sy":0,"tileW":32,"tileH":32,"frames":3},
		"marioDie":{"sx":384,"sy":0,"tileW":32,"tileH":32,"frames":1},
		"marioJump":{"sx":128,"sy":0,"tileW":32,"tileH":32,"frames":1}
	   */

	});

	/*Q.loadTMX("level.tmx, goomba.png, goomba.json", function() {
	  Q.compileSheets("goomba.png", "goomba.json");
	  Q.stageScene("level1");
	});*/

}//funcion game