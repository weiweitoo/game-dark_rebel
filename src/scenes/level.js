import util from '../helper/helper.js'
import level from '../constant/level_attribute.js'

export default class Level extends Phaser.Scene {

	constructor() {
		super({
			key: 'Level'
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
        this.dynamicAsset = {
            "background" : 'home_background'+this.LEVEL,
            "terrain_dark_grass" : 'terrain_dark_grass'+this.LEVEL,
            "terrain_dark_ground" : 'terrain_dark_ground'+this.LEVEL,
        }
		this.terrain_dark_ground_height = null
		this.terrain_dark_grass_height = null
	}

	preload() {
        this.LEVEL = this.sys.game.global_level
        this.dynamicAsset.background = 'home_background'+this.LEVEL
        this.dynamicAsset.terrain_dark_grass = 'terrain_dark_grass'+this.LEVEL
        this.dynamicAsset.terrain_dark_ground = 'terrain_dark_ground'+this.LEVEL

		this.gameWidth = this.sys.game.canvas.getAttribute("width");
		this.gameHeight = this.sys.game.canvas.getAttribute("height");
        this.load.image("action_background", './src/assets/ui/UIBoardLargeParchment.png');
        
        let level_asset = level[this.LEVEL.toString()]
		this.load.image(this.dynamicAsset.background, level_asset.background_asset);
		this.load.image(this.dynamicAsset.terrain_dark_grass, level_asset.terrain_asset);
		this.load.image(this.dynamicAsset.terrain_dark_ground, level_asset.terrain_ground);

		// import walking animation
		util.loadAnimation(this, this.animation, 'walking')
	}

	create() {
		// Draw background and ground
		this.sprite.home_background = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, this.dynamicAsset.background).setOrigin(0)
		this.terrain_dark_ground_height = this.textures.get(this.dynamicAsset.terrain_dark_ground).getSourceImage().height
		this.terrain_dark_grass_height = this.textures.get(this.dynamicAsset.terrain_dark_grass).getSourceImage().height
		this.terrain.dark_ground_1 = this.add.tileSprite(0, 300, this.gameWidth, this.terrain_dark_ground_height, this.dynamicAsset.terrain_dark_ground).setOrigin(0)
		this.terrain.dark_ground_2 = this.add.tileSprite(0, 360, this.gameWidth, this.terrain_dark_ground_height, this.dynamicAsset.terrain_dark_ground).setOrigin(0)
		this.terrain.dark_ground_3 = this.add.tileSprite(0, 420, this.gameWidth, this.terrain_dark_ground_height, this.dynamicAsset.terrain_dark_ground).setOrigin(0)
		this.terrain.dark_grass = this.add.tileSprite(0, 250, this.gameWidth, this.terrain_dark_grass_height, this.dynamicAsset.terrain_dark_grass).setOrigin(0)

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
		// this.move();
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