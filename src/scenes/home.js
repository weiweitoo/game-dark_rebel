import util from '../helper/helper.js'
import fantasyButtonAsset from '../constant/fantasy_button.js'

export default class Home extends Phaser.Scene {

	constructor() {
		super({
			key: 'Home'
		})
		this.gameWidth = null;
		this.gameHeight = null;
		this.sprite = {
			"action_background": null,
			"home_background": null
		}
		this.terrain = {
			"dark_grass": null,
			"dark_ground_1": null,
			"dark_ground_2": null,
			"dark_ground_3": null,
		}
		this.animation = {
			'idle': {
				"object": null,
				"sequence": [],
				"frameRate": 0
			}
		}
		this.ui = {
			"name_badge": null,
			"name": null,
			"str": null,
			"agi": null,
			"int": null,
			"vit": null
		}
		this.attribute = {
			"str": null,
			"agi": null,
			"int": null,
			"vit": null
		}
		this.terrain_dark_ground_height = null
		this.terrain_dark_grass_height = null
	}

	preload() {
		// import nessassary file
		this.gameWidth = this.sys.game.canvas.getAttribute("width")
		this.gameHeight = this.sys.game.canvas.getAttribute("height")
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

		// import idle animation
		util.loadAnimation(this, this.animation, 'idle')
	}

	create() {
		this.drawEnvironment()
		this.drawPlayer()
		this.drawUI()

		this.loadAttribute()
	}

	update() {
		this.move();
	}

	move() {
		this.sprite.home_background.tilePositionX += 0.12
	}

	loadAttribute() {
		this.attribute.str = this.sys.game.global_str
		this.attribute.agi = this.sys.game.global_agi
		this.attribute.int = this.sys.game.global_int
		this.attribute.vit = this.sys.game.global_vit
	}

	drawPlayer() {
		this.anims.create({
			key: 'idle',
			frames: this.animation.idle.sequence,
			frameRate: this.animation.idle.frameRate,
			repeat: -1
		});
		this.animation.idle.object = this.add.sprite(120, 245, this.animation.idle.sequence[0].key)
		util.rescale(this.animation.idle.object, 200)
		this.animation.idle.object.play('idle')
	}

	drawEnvironment() {
		this.sprite.home_background = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, 'home_background').setOrigin(0)
		this.terrain_dark_ground_height = this.textures.get('terrain_dark_ground').getSourceImage().height
		this.terrain_dark_grass_height = this.textures.get('terrain_dark_grass').getSourceImage().height
		this.terrain.dark_ground_1 = this.add.tileSprite(0, 300, this.gameWidth, this.terrain_dark_ground_height, 'terrain_dark_ground').setOrigin(0)
		this.terrain.dark_ground_2 = this.add.tileSprite(0, 360, this.gameWidth, this.terrain_dark_ground_height, 'terrain_dark_ground').setOrigin(0)
		this.terrain.dark_ground_3 = this.add.tileSprite(0, 420, this.gameWidth, this.terrain_dark_ground_height, 'terrain_dark_ground').setOrigin(0)
		this.terrain.dark_grass = this.add.tileSprite(0, 250, this.gameWidth, this.terrain_dark_grass_height, 'terrain_dark_grass').setOrigin(0)
	}

	drawUI() {
		this.sprite.action_background = this.add.sprite(0, this.gameHeight - 150, 'action_background').setOrigin(0)
		util.rescale(this.sprite.action_background, this.gameWidth)
		util.draw_fantasy_button(this, 380, 480, 'frame', 'ring_bg_orange', 'icon_scroll', () => {
			this.scene.start("Level")
		})
		util.draw_fantasy_button(this, 530, 480, 'frame', 'ring_bg_blue', 'icon_book', () => {
			util.messageBox(this, "dialog_frame", "hud", "dialog_button", "Happy new year", "Got it!", "Message", () => {
				console.log("Hello brow")
			})
		})
		util.draw_fantasy_button(this, 680, 480, 'frame', 'ring_bg_yellow', 'icon_skull', () => {
			util.attributeBox(this, "dialog_frame", "hud", "dialog_button", this.attribute, (newAttribute) => {
				console.log(newAttribute)
			})
		})

		this.ui.name = util.drawButton(this, 120, 450, this.sys.game.global_name, "hud", null, () => {
			// callback
		}, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '20px',
			fill: '#FFFFFF',
			align: 'center'
		}, 125)


		this.ui.str = this.add.text(65, 480, "STR: " + this.sys.game.global_str, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '18px',
			// stroke: '#000000',
			// strokeThickness: '2',
			fill: '#DDDDD'
		}).setOrigin(0)

		this.ui.int = this.add.text(65, 500, "INT: " + this.sys.game.global_int, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '18px',
			// stroke: '#000000',
			// strokeThickness: '2',
			fill: '#DDDDD'
		}).setOrigin(0)

		this.ui.agi = this.add.text(130, 480, "AGI: " + this.sys.game.global_agi, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '18px',
			// stroke: '#1111CC',
			// strokeThickness: '2',
			fill: '#DDDDD'
		}).setOrigin(0)


		this.ui.vit = this.add.text(130, 500, "VIT: " + this.sys.game.global_vit, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '18px',
			// stroke: '#11CC11',
			// strokeThickness: '2',
			fill: '#DDDDD'
		}).setOrigin(0)
	}
}