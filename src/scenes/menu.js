import util from '../helper/helper.js'

export default class Menu extends Phaser.Scene {

	constructor() {
		super({ key: 'Menu' })
		this.gameWidth = null;
		this.gameHeight= null;
		this.sprite = {
			"background" : null
		}
		this.text = {
			"title" : null
		}
		this.button = {
			"start" : null,
			"reembark" : null,
			"quit" : null
		}
		this.animation = {
			'idle' : {
				"object" : null,
				"sequence" : [],
				"frameRate" : 0
			}
		}
	}

	preload() {
		this.gameWidth = this.sys.game.canvas.getAttribute("width");
		this.gameHeight = this.sys.game.canvas.getAttribute("height");
		this.load.image('uibackground', './src/assets/ui/UIBoardLargeParchment.png');
		this.load.image('button', './src/assets/ui/TextBTN_Medium.png');
		this.load.image('button_pressed', './src/assets/ui/TextBTN_Medium_Pressed.png');

		// import idle animation
		util.loadAnimation(this, this.animation, 'idle')
		this.initGameData()
	}

	create() {
	
		this.sprite.background = this.add.sprite(0, 0, 'uibackground')
		this.sprite.background.setOrigin(0)
		util.rescale(this.sprite.background, this.gameWidth)

		this.text.title = this.add.text(this.gameWidth - 345, 150, 'Dark Rebel', { fontFamily: 'bm-yeon-sung', fontSize: '50px' })
		this.button.start = util.drawButton(this, this.gameWidth - 200, 280, "Start" ,"button","button_pressed", () => { this.scene.start("Home")})
		this.button.reembark = util.drawButton(this, this.gameWidth - 200, 360, "Reembark" ,"button","button_pressed",() => { console.log("refresh saved memory")})
		// this.button.quit = util.drawButton(this.gameWidth - 200, 440, "Quit" ,"button","button_pressed", () => { this.scene.start("Menu")})

		this.anims.create({
			key: 'idle',
			frames: this.animation.idle.sequence,
			frameRate: this.animation.idle.frameRate,
			repeat: -1
		});
		this.animation.idle.object = this.add.sprite(210, 300, this.animation.idle[0]).play('idle')
		util.rescale(this.animation.idle.object, 500)
	}

	update() {

	}


	initGameData(){
		this.sys.game.global_level=2
		this.sys.game.global_hp=100
		this.sys.game.global_mp=50
		// more player attribute, write player attribute in a OOP class
	}

}