import util from '../helper/helper.js'
import fantasyButtonAsset from '../constant/fantasy_button.js'

export default class Preload extends Phaser.Scene {

	constructor() {
		super({
			key: 'Preload'
		})
	}

	preload() {
		this.gameWidth = this.sys.game.canvas.getAttribute("width")
        this.gameHeight = this.sys.game.canvas.getAttribute("height")
        
        // 
        // Menu.Js
        // 
		this.load.image('uibackground', './src/assets/ui/UIBoardLargeParchment.png')
		this.load.image('button', './src/assets/ui/TextBTN_Medium.png')
		this.load.image('button_pressed', './src/assets/ui/TextBTN_Medium_Pressed.png')

        // 
        // Home.Js
        // 
		this.load.image('action_background', './src/assets/ui/UIBoardLargeParchment.png')
		this.load.image('home_background', './src/assets/Textures/backgrounds/background02.png')
		this.load.image('terrain_dark_grass', './src/assets/Textures/terrain/terrain_dark_grass.png')
		this.load.image('terrain_dark_ground', './src/assets/Textures/terrain/terrain_dark_ground.png')

		this.load.image('hud', './src/assets/ui/hud.png')
		this.load.image('attr_background', './src/assets/ui/TextBTN_Medium.png')

		this.load.image('dialog_title', './src/assets/ui/Exclamation_Yellow.png')
		this.load.image('dialog_button', './src/assets/ui/TextBTN_Medium.png')
		this.load.image('dialog_frame', './src/assets/ui/UIBoardSmallSet.png')


		this.load.image('frame', fantasyButtonAsset.frame)
		this.load.image('ring_bg_orange', fantasyButtonAsset.ring_background.orange)
		this.load.image('ring_bg_blue', fantasyButtonAsset.ring_background.blue)
		this.load.image('ring_bg_yellow', fantasyButtonAsset.ring_background.yellow)
		this.load.image('icon_scroll', fantasyButtonAsset.icon.scroll)
		this.load.image('icon_book', fantasyButtonAsset.icon.book)
        this.load.image('icon_skull', fantasyButtonAsset.icon.skull)

        this.load.image('frame', fantasyButtonAsset.frame)
		this.load.image('ring_bg_orange', fantasyButtonAsset.ring_background.orange)
		this.load.image('ring_bg_blue', fantasyButtonAsset.ring_background.blue)
		this.load.image('ring_bg_yellow', fantasyButtonAsset.ring_background.yellow)
		this.load.image('ring_bg_green', fantasyButtonAsset.ring_background.green)
		this.load.image('icon_sword', fantasyButtonAsset.icon.sword)
		this.load.image('icon_shield', fantasyButtonAsset.icon.shield)
		this.load.image('icon_potion', fantasyButtonAsset.icon.potion)
		this.load.image('icon_candles', fantasyButtonAsset.icon.candles)

        
        //
        // Level.js 
        //
		this.load.image("action_background", './src/assets/ui/UIBoardLargeParchment.png');
        this.load.image('HP', './src/assets/ui/heart/RedPlainBlackborder.png')
		this.load.image('MP', './src/assets/ui/heart/BluePlainBlackborder.png')

		this.load.audio('attack', './src/assets/audio/effect/attack.wav');
		this.load.audio('fire', './src/assets/audio/effect/fire.wav');
		this.load.audio('water', './src/assets/audio/effect/water.wav');
        this.load.audio('air', './src/assets/audio/effect/air.wav');
        
        // bgm
        util.loadBGM(this, "music1")
        util.loadBGM(this, "music2")
        util.loadBGM(this, "music3")
	}

	create() {
        this.scene.start("Menu")
	}

	update() {

	}

}