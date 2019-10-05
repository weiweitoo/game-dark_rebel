import util from '../helper/helper.js'
import fantasyButtonAsset from '../constant/fantasy_button.js'
import animationData from '../constant/animation.js'

export default class CutScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'CutScene1'
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
			},

			'woodmon': {
				"object": null,
				"sequence": [],
				"frameRate": 0
			}
		}
		this.ui = {
			"name_badge": null,
		}
		this.terrain_dark_ground_height = null
		this.terrain_dark_grass_height = null

		// activate bool to inspect if mission is complete
		this.missionCompletion = null

		// activate bool to inspect if mission is activated
		this.missionActivation = null
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
		util.loadAnimation(this, animationData, this.animation, 'idle')
		util.loadAnimation(this, animationData, this.animation, 'woodmon')
	}

	create() {
		this.drawEnvironment()
		this.drawPlayer()
		this.drawUI()
		this.drawNPC()

		util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
		"\"Hello there, good sir! How can I⁠— Wait... Do my eyes deceive me?\n" +
		" Are you... a Darkmon?\"", 
		"Continue", "Woodmon Villager", () => {
			util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
			"\"Ah... These are horrid news for you to receive but I am.\n" +
			"I am uncertain if you have heard of me, but I am Raiz, the\n" + 
			"current ruler of the Darkmon kind. I came here from the idea\n" + 
			"of bringing peace between our people. We mean no harm.\"\n",
			"Continue", "Raiz", () => {
				util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
				"\"I... do not like dallying with Darkmon kind. Our people have\n" +
				"only heard of rottenness from the likes of you. I am sorry, but\n" +
				"I wish for nothing to do with you, young lord.\"",
				"Continue", "Woodmon Villager", () => {
					util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
					"\"Hang on, good sir! Please, give us a chance to prove our innocence\n" +
					"and know that we mean no harm. Surely there has been a series of woes\n" +
					"which have been troubling you, yes? I'd like to help you with those,\n" +
					"if I may. Every man alike suffers from troubles they wish to end.\"",
					"Continue", "Raiz", () => {
						util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
						"\"Well... I suppose there is something that have been troubling my family\n" +
						"⁠— specifically, a continuous problem. A group of foul golems have been\n" +
						"doing nothing more than stealing our family heirlooms if one of us gets\n" +
						"too careless in placing them. We really do need them to stop.\"",
						"Continue", "Woodmon Villager", () => {
							util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
							"\"Golems, huh? We've had one too many encounters with them in the caves\n" +
							"we live in. We know how to handle them. They just need a tad bit of\n" +
							"discipline. I can lend you a hand in stopping them.\"",
							"Continue", "Raiz", () => {
								util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
								"\"You... you can? Well, if you really can then, all right, young lord.\n" +
								"Please help us. Those heirlooms are of great worth to us. If you manage\n" +
								"to get stop them, I will speak positive words of you and your people.\"",
								"Continue", "Woodmon Villager", () => {
									util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
									"\"I thank you deeply. We will not fail you.\"",
									"Continue", "Raiz", () => {
										util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
										"\"Fair tidings, young lord. And thank you for lending a hand.\"",
										"Continue", "Woodmon Villager", () => {
											this.sys.game.global_level += 1
											this.scene.start("Home")
										})
									})
								})
							})
						})
					})
				})
			})
		})
		
		this.missionActivation = true
		this.missionCompletion = false
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

	}

	drawNPC() {
		this.anims.create({
			key: 'woodmon',
			frames: this.animation.woodmon.sequence,
			frameRate: this.animation.woodmon.frameRate,
			repeat: -1
		});
		this.animation.woodmon.object = this.add.sprite(770, 245, this.animation.woodmon.sequence[0].key)
		util.rescale(this.animation.woodmon.object, 150)
		this.animation.woodmon.object.play('woodmon')
	}

}