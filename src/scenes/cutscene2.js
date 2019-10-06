import util from '../helper/helper.js'
import fantasyButtonAsset from '../constant/fantasy_button.js'
import animationData from '../constant/animation.js'

export default class CutScene2 extends Phaser.Scene {
	constructor() {
		super({
			key: 'CutScene2'
		})
		this.gameWidth = null;
		this.gameHeight = null;
		this.sprite = {
			"action_background": null,
			"home_background": null
		}
		this.terrain = {
			"yellow_grass": null,
			"yellow_ground_1": null,
			"yellow_ground_2": null,
			"yellow_ground_3": null,
		}
		this.animation = {
			'idle': {
				"object": null,
				"sequence": [],
				"frameRate": 0
			},

			'firemon': {
				"object": null,
				"sequence": [],
				"frameRate": 0
			}
		}
		this.ui = {
			"name_badge": null,
		}
		this.terrain_yellow_ground_height = null
		this.terrain_yellow_grass_height = null

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
		this.load.image('home_background', './src/assets/Textures/backgrounds/background07.png')
		this.load.image('terrain_yellow_grass', './src/assets/Textures/terrain/terrain_yellow_grass.png')
		this.load.image('terrain_yellow_ground', './src/assets/Textures/terrain/terrain_yellow_ground.png')

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
		util.loadAnimation(this, animationData, this.animation, 'firemon')
	}

	create() {
		this.drawEnvironment()
		this.drawPlayer()
		this.drawUI()
		this.drawNPC()

		this.bgm = util.playBGM(this, "musicfiren")

		util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
		"\"Ohoho, what a rare sight — truly a delight for artists like\n" +
        "myself! I could be mistaking you and you are a person\n" +
        "passionate about dressing up but are you a Darkmon?\"", 
		"Continue", "Firemon Artist", () => {
			util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
			"\"I am, yes. I am Raiz, the new ruler to the Darkmon people.\n" +
            "I must admit your eagerness to see a Darkmon is surprising.\n" +
            "Most others are... I hate to be disrespectful, but rather\n" +
            "hostile towards us. It is upsetting.\"",
			"Continue", "Raiz", () => {
				util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
				"\"I do not fear the dangers of your kind, dear Darkmon,\n" +
                "but I am certainly enthralled by your beauty! I have always\n" +
                "adored the special and unique. Painting art of a regular\n" +
                "sight, after all, certainly bores me. I long for something\n" +
                "new and bold, even more so after recently losing access\n" +
                "to my favourite spot.\"",
				"Continue", "Firemon Artist", () => {
					util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
					"\"Your compliments soothe me, great artist. But something\n" +
                    "you have said piqued my interest: you mentioned recently\n" +
                    "losing access to your favourite spot. Out of curiousity,\n" +
                    "may I know what happened?\"",
					"Continue", "Raiz", () => {
						util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
						"\"Ah... it is such great misfortune, dear sir. A giant\n" +
                        "beast invaded the lands and threatened death should I\n" +
                        "dare return. Naturally, fearing my own life, I am\n" +
                        "anxious to head back. But my poor creative mind, I do\n" +
                        "miss it ever so much!\"",
						"Continue", "Firemon Artist", () => {
							util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
							"\"I see... Well, I'd be more than happy to return that\n" +
                            "spot to you. I would like to change the cruel\n" +
                            "impression most have on the Darkmon. Furthermore, I\n" + 
                            "would like to see you create more art of your favourite\n" +
                            "place.\"",
							"Continue", "Raiz", () => {
								util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
								"\"You will? Why, I am ever so grateful for your offer!\n" +
                                "If you help me out, I am more than happy to tell the\n" + 
                                "other Firemon of the purity within the hearts of the\n" +
                                "Darkmon.\"",
								"Continue", "Firemon Artist", () => {
									util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
									"\"That would be great. I'll return to you once that\n" +
                                    "beast has been downed.\"",
									"Continue", "Raiz", () => {
										util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
										"\"Be careful, dear friend.\"",
										"Continue", "Firemon Artist", () => {
											// learn skill
											this.bgm.stop()
											this.sys.game.global_skill[1] = 1
											this.sys.game.global_skill[2] = 1
											this.scene.start("Level")
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
		this.terrain_yellow_ground_height = this.textures.get('terrain_yellow_ground').getSourceImage().height
		this.terrain_yellow_grass_height = this.textures.get('terrain_yellow_grass').getSourceImage().height
		this.terrain.yellow_ground_1 = this.add.tileSprite(0, 300, this.gameWidth, this.terrain_yellow_ground_height, 'terrain_yellow_ground').setOrigin(0)
		this.terrain.yellow_ground_2 = this.add.tileSprite(0, 360, this.gameWidth, this.terrain_yellow_ground_height, 'terrain_yellow_ground').setOrigin(0)
		this.terrain.yellow_ground_3 = this.add.tileSprite(0, 420, this.gameWidth, this.terrain_yellow_ground_height, 'terrain_yellow_ground').setOrigin(0)
		this.terrain.yellow_grass = this.add.tileSprite(0, 250, this.gameWidth, this.terrain_yellow_grass_height, 'terrain_yellow_grass').setOrigin(0)
	}

	drawUI() {
		this.sprite.action_background = this.add.sprite(0, this.gameHeight - 150, 'action_background').setOrigin(0)
		util.rescale(this.sprite.action_background, this.gameWidth)

	}

	drawNPC() {
		this.anims.create({
			key: 'firemon',
			frames: this.animation.firemon.sequence,
			frameRate: this.animation.firemon.frameRate,
			repeat: -1
		});
		this.animation.firemon.object = this.add.sprite(770, 245, this.animation.firemon.sequence[0].key)
		util.rescale(this.animation.firemon.object, 150)
		this.animation.firemon.object.play('firemon')
	}

}