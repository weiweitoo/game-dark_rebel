import util from '../helper/helper.js'

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
			'walking': {
				"object": null,
				"sequence": [],
				"frameRate": 0
			}
		}
		this.terrain_dark_ground_height = null
		this.terrain_dark_grass_height = null
	}

	preload() {
		// import nessassary file
		this.gameWidth = this.sys.game.canvas.getAttribute("width");
		this.gameHeight = this.sys.game.canvas.getAttribute("height");
		this.load.image('action_background', './src/assets/ui/UIBoardLargeParchment.png');
		this.load.image('home_background', './src/assets/Textures/backgrounds/background02.png');
		this.load.image('terrain_dark_grass', './src/assets/Textures/terrain/terrain_dark_grass.png');
		this.load.image('terrain_dark_ground', './src/assets/Textures/terrain/terrain_dark_ground.png');

		// import walking animation
		util.loadAnimation(this, this.animation, 'walking')
	}

	create() {
		// Draw background and ground
		this.sprite.home_background = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, 'home_background').setOrigin(0)
		this.terrain_dark_ground_height = this.textures.get('terrain_dark_ground').getSourceImage().height
		this.terrain_dark_grass_height = this.textures.get('terrain_dark_grass').getSourceImage().height
		this.terrain.dark_ground_1 = this.add.tileSprite(0, 300, this.gameWidth, this.terrain_dark_ground_height, 'terrain_dark_ground').setOrigin(0)
		this.terrain.dark_ground_2 = this.add.tileSprite(0, 360, this.gameWidth, this.terrain_dark_ground_height, 'terrain_dark_ground').setOrigin(0)
		this.terrain.dark_ground_3 = this.add.tileSprite(0, 420, this.gameWidth, this.terrain_dark_ground_height, 'terrain_dark_ground').setOrigin(0)
		this.terrain.dark_grass = this.add.tileSprite(0, 250, this.gameWidth, this.terrain_dark_grass_height, 'terrain_dark_grass').setOrigin(0)

		// Add avatar and add animation
		this.sprite.action_background = this.add.sprite(0, this.gameHeight - 150, 'action_background').setOrigin(0)
		util.rescale(this.sprite.action_background, this.gameWidth)

		this.anims.create({
			key: 'walking',
			frames: this.animation.walking.sequence,
			frameRate: this.animation.walking.frameRate,
			repeat: -1
		});
		this.animation.walking.object = this.add.sprite(120, 245, this.animation.walking.sequence[0].key)
		util.rescale(this.animation.walking.object, 200)

	}

	update() {

	}


	move() {
		this.sprite.home_background.tilePositionX += 0.5
		this.terrain.dark_ground_1.tilePositionX += 1
		this.terrain.dark_ground_2.tilePositionX += 1
		this.terrain.dark_ground_3.tilePositionX += 1
		this.terrain.dark_grass.tilePositionX += 1
		this.animation.walking.object.play('walking')
	}
}