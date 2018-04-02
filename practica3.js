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
	var Q = window.Q = Quintus()
						.include("Sprites, Scenes, Input, Touch, UI, Anim, TMX, 2D")
						/*
							El método Q.setup([id],[options={}]) es el responsable de vincular 
							la instancia del motor con un elemento de tipo canvas en la página 
							y configurar su tamaño. 
							Si no especificamos nada con .setup(), 
							se crea un canvas de 320 * 420 píxeles
						*/  
						.setup({width: 320, height: 480})
						// And turn on default input controls and touch input (for UI) 
						.controls().touch()

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
								sheet: "marioR", // Setting a sprite sheet sets sprite width and height 
								x: 20, // You can also set additional properties that can
								y: 528 // be overridden on object creation
						   }
						); //_super

			this.add('2d, platformerControls');
			// Write event handlers to respond hook into behaviors.

			this.step = function (dt){
				//console.log(this.p);
				//this.p["x"] = 20;
				//this.p["y"] = 20;
				//this.p["z"] = 20;
				//console.log(this.p["frame"]);

				if(this.p["y"] > 650){
					//this.p["x"] = 20;
					//this.p["y"] = 528;
					console.log("Tas caío lol");
					Q.stageScene("endGame",1, { label: "You Died" }); 
					this.destroy();
				}
			}

		}//init 

	});//extend Mario

	Q.Sprite.extend("Goomba",{

		// the init constructor is called on creation
		//Se puede redefinir un método definido en una superclase, 
		//y es posible invocar la versión redefinida con this._super(..).
		init: function(p) {

			console.log("Estamos creando una instancia de Goomba");

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
								sheet: "goomba", // Setting a sprite sheet sets sprite width and height 
								x: 1478, // You can also set additional properties that can
								y: 494, // be overridden on object creation
								vx: 100
						   }
						); //_super

			this.add('2d, aiBounce');//, platformerControls');
			// Write event handlers to respond hook into behaviors.

			this.on("bump.left,bump.right",function(collision) {

				if(collision.obj.isA("Mario")) { 
					Q.stageScene("endGame",1, { label: "You Died" }); 
					collision.obj.destroy();
				} 

			});//on bump left-right-bottom

			// If the enemy gets hit on the top, destroy it 
			// and give the user a "hop" 
			this.on("bump.top",function(collision) {

				if(collision.obj.isA("Mario")) {
					this.destroy();
				    collision.obj.p.vy = -300;
				    //Q.stageScene("endGame",1, { label: "You Won!" });
				}

			});//on bump top 

			this.step = function (dt){
				//console.log(this.p);
				//this.p["x"] = 20;
				//this.p["y"] = 20;
				//this.p["z"] = 20;
				//console.log(this.p["frame"]);

				if(this.p["y"] > 650){
					this.p["x"] = 60;
					this.p["y"] = 528;
					console.log("Sa caío lol");
					//Q.stageScene("endGame",1, { label: "You Died" }); 
					//this.destroy();
				}
			}

		}//init 

	});//extend Goomba

	Q.Sprite.extend("Bloopa",{

		// the init constructor is called on creation
		//Se puede redefinir un método definido en una superclase, 
		//y es posible invocar la versión redefinida con this._super(..).
		init: function(p) {

			console.log("Estamos creando una instancia de Bloopa");

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
								sheet: "bloopa", // Setting a sprite sheet sets sprite width and height 
								x: 200, // You can also set additional properties that can
								y: 527 // be overridden on object creation
								//vy: -60,
								//gravity: 0
						   }
						); //_super

			this.add('2d');//, aiBounce');//, platformerControls');
			// Write event handlers to respond hook into behaviors.

			this.on("bump.left,bump.right,bump.bottom",function(collision) {

				if(collision.obj.isA("Mario")) { 
					Q.stageScene("endGame",1, { label: "You Died" }); 
					collision.obj.destroy();
				} 

			});//on bump left-right-bottom

			// If the enemy gets hit on the top, destroy it 
			// and give the user a "hop" 
			this.on("bump.top",function(collision) {

				if(collision.obj.isA("Mario")) {
					this.destroy();
				    collision.obj.p.vy = -300;
				    //Q.stageScene("endGame",1, { label: "You Won!" });
				}

			});//on bump top 

			this.step = function (dt){
				//console.log(this.p);
				//this.p["x"] = 20;
				//this.p["y"] = 20;
				//this.p["z"] = 20;
				//console.log(this.p["frame"]);

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

		}//init 

	});//extend Bloopa

	Q.Sprite.extend("Princess",{

		// the init constructor is called on creation
		//Se puede redefinir un método definido en una superclase, 
		//y es posible invocar la versión redefinida con this._super(..).
		init: function(p) {

			console.log("Estamos creando una instancia de Princess");

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
								asset: "princess.png", // Setting a sprite sheet sets sprite width and height 
								x: 1956, // You can also set additional properties that can
								y: 46 // be overridden on object creation
						   }
						); //_super

			this.add('2d');
			// Write event handlers to respond hook into behaviors.

			this.on("bump.top,bump.left,bump.right,bump.bottom",function(collision) {

				if(collision.obj.isA("Mario")) {
				    Q.stageScene("endGame",1, { label: "You Won!" });
				}

			});

		}//init 

	});//extend Princess

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
		
		Q.stageTMX("level.tmx",stage);
		/*Q.load("mario_small.png, mario_small.json", function() {
			Q.compileSheets("mario_small.png", "mario_small.json");
		});//load*/


		// Create the player and add them to the stage
		var player = stage.insert(new Q.Mario());
		stage.add("viewport").follow(player);//, { x: true, y: false });
		stage.viewport.offsetX = -140;
		stage.viewport.offsetY = 160;
		//stage.centerOn(150, 380);

		var goomba = stage.insert(new Q.Goomba());
		var goomba = stage.insert(new Q.Bloopa());
		var goomba = stage.insert(new Q.Princess());
		//stage.add("viewport").follow(goomba);

		// Add in a tile layer, and make it the collision layer
		/*stage.collisionLayer(new Q.TileLayer({
                             					dataAsset: 'level.tmx',//'level.json',
                             					sheet:     'tiles' 
                             				}));*/

		
		//stage.follow(player);

	});//scene level1

	/*Q.scene("level1",function(stage) {
	  Q.stageTMX("level1.tmx",stage);
	  stage.add("viewport").follow(Q("Player").first());
	});*/

	// To display a game over / game won popup box,
	// create a endGame scene that takes in a `label` option 
	// to control the displayed message. 
	Q.scene('endGame',function(stage) {

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
		  Q.stageScene('level1');
		});

		// Expand the container to visibily fit it's contents 
		// (with a padding of 20 pixels)
		container.fit(20);

	});//scene endgame


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

	Q.loadTMX("level.tmx, mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json, princess.png", function() {
	  Q.compileSheets("mario_small.png", "mario_small.json");
	  Q.compileSheets("goomba.png", "goomba.json");
	  Q.compileSheets("bloopa.png", "bloopa.json");
	  Q.compileSheets("princess.png");
	  Q.stageScene("level1");
	});

	/*Q.loadTMX("level.tmx, goomba.png, goomba.json", function() {
	  Q.compileSheets("goomba.png", "goomba.json");
	  Q.stageScene("level1");
	});*/

}//funcion game