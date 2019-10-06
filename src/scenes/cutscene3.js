import util from '../helper/helper.js'
import fantasyButtonAsset from '../constant/fantasy_button.js'
import animationData from '../constant/animation.js'

export default class CutScene3 extends Phaser.Scene {
	constructor() {
		super({
			key: 'CutScene3'
		})
		this.gameWidth = null;
		this.gameHeight = null;
		this.sprite = {
			"action_background": null,
			"home_background": null
		}
		this.terrain = {
			"water_grass": null,
			"water_ground_1": null,
			"water_ground_2": null,
			"water_ground_3": null,
		}
		this.animation = {
			'idle': {
				"object": null,
				"sequence": [],
				"frameRate": 0
			},

			'watermon': {
				"object": null,
				"sequence": [],
				"frameRate": 0
			}
		}
		this.ui = {
			"name_badge": null,
		}
		this.terrain_water_ground_height = null
		this.terrain_water_grass_height = null

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
		this.load.image('home_background', './src/assets/Textures/backgrounds/background08.png')
		this.load.image('terrain_water_grass', './src/assets/Textures/terrain/terrain_water_grass.png')
		this.load.image('terrain_water_ground', './src/assets/Textures/terrain/terrain_water_ground.png')

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
		util.loadAnimation(this, animationData, this.animation, 'watermon')
	}

	create() {
		this.drawEnvironment()
		this.drawPlayer()
		this.drawUI()
		this.drawNPC()

		this.bgm = util.playBGM(this, "musicwatern")

		util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
		"\"Aaah, the demon of the creek is upon us and has eaten\n" +
		"most of our livestock! Flee before it catches you and\n" +
		"devours you whole!\"", 
		"Continue", "Watermon Farmer", () => {
			util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
			"\"Whoa, hang on there. You mentioned a demon around the\n" +
			"whereabouts of the creek. Please, tell me more and I\n" +
			"could lend a hand to stop it.\"",
			"Continue", "Raiz", () => {
				util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
				"\"Oh, it's absolutely terrible, sir! The wretched demon\n" +
				"has done nothing more than invade our lands and prey\n" +
				"upon our source of dairy. My family are now penniless\n" +
				"and craving for those extravagant cheese and butter we\n" +
				"used to eat every week. This foul beast must come to a\n" +
				"stop!\"",
				"Continue", "Watermon Farmer", () => {
					util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
					"\"That truly is a terrible stroke of luck... Has the\n" +
					"monarch order no command to put a stop to this creature?\n" +
					"At this rate, the beast might grow even more greedy and\n" +
					"begin chasing after the livestock of others in the\n" +
					"village.\"",
					"Continue", "Raiz", () => {
						util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
						"\"Oh, the men of the King has sent out search campaigns\n" +
						"to hunt the monstrousity but the beast is smart, albeit\n" +
						"cowardly. It hides whenever it sees the King's men, and\n" +
						"stays afar until they are dispersed. Afterwards... it\n" +
						"comes back.\"",
						"Continue", "Watermon Farmer", () => {
							util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
							"\"Hmmm... it looks like it does not flee at the sight of\n" +
							"people whom are not of the King's men. If so, I'd be\n" +
							"more than happy to lend a hand in putting a rest to this\n" +
							"calamity.\"",
							"Continue", "Raiz", () => {
								util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
								"\"Oh, you will? Thank you so much, dear friend! Please, we\n" +
								"truly do need your help— Oh. You are... a Darkmon?\"",
								"Continue", "Watermon Farmer", () => {
									util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
									"\"I am. But it does not change the fact that I wish to help.\"",
									"Continue", "Raiz", () => {
										util.conversationBox(this, "dialog_frame", "hud", "dialog_button", 
										"\"I... am not fond of Darkmon, I must uneasily admit. But\n" +
										"I am more spiteful towards that wretched beast. Please\n" +
										"help us, Darkmon. If you do, I will start to think brighter\n" +
										"of you and your people.\"",
										"Continue", "Watermon Farmer", () => {
											this.bgm.stop()
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
		this.terrain_water_ground_height = this.textures.get('terrain_water_ground').getSourceImage().height
		this.terrain_water_grass_height = this.textures.get('terrain_water_grass').getSourceImage().height
		this.terrain.water_ground_1 = this.add.tileSprite(0, 300, this.gameWidth, this.terrain_water_ground_height, 'terrain_water_ground').setOrigin(0)
		this.terrain.water_ground_2 = this.add.tileSprite(0, 360, this.gameWidth, this.terrain_water_ground_height, 'terrain_water_ground').setOrigin(0)
		this.terrain.water_ground_3 = this.add.tileSprite(0, 420, this.gameWidth, this.terrain_water_ground_height, 'terrain_water_ground').setOrigin(0)
		this.terrain.water_grass = this.add.tileSprite(0, 250, this.gameWidth, this.terrain_water_grass_height, 'terrain_water_grass').setOrigin(0)
	}

	drawUI() {
		this.sprite.action_background = this.add.sprite(0, this.gameHeight - 150, 'action_background').setOrigin(0)
		util.rescale(this.sprite.action_background, this.gameWidth)

	}

	drawNPC() {
		this.anims.create({
			key: 'watermon',
			frames: this.animation.watermon.sequence,
			frameRate: this.animation.watermon.frameRate,
			repeat: -1
		});
		this.animation.watermon.object = this.add.sprite(770, 245, this.animation.watermon.sequence[0].key)
		util.rescale(this.animation.watermon.object, 150)
		this.animation.watermon.object.play('watermon')
	}

}