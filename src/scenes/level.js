import util from '../helper/helper.js'
import level from '../constant/level_attribute.js'
import fantasyButtonAsset from '../constant/fantasy_button.js'

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
		this.hud = {
			"hp" : null,
			"mp" : null
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

		this.load.image('frame', fantasyButtonAsset.frame)
		this.load.image('ring_bg_orange', fantasyButtonAsset.ring_background.orange)
		this.load.image('ring_bg_blue', fantasyButtonAsset.ring_background.blue)
		this.load.image('ring_bg_yellow', fantasyButtonAsset.ring_background.yellow)
		this.load.image('ring_bg_green', fantasyButtonAsset.ring_background.green)
		this.load.image('icon_sword', fantasyButtonAsset.icon.sword)
		this.load.image('icon_shield', fantasyButtonAsset.icon.shield)
		this.load.image('icon_potion', fantasyButtonAsset.icon.potion)
		this.load.image('icon_candles', fantasyButtonAsset.icon.candles)


		// draw hud
		this.load.image('HP_happy', './src/assets/ui/heart/RedHappyWhiteborder.png');
		this.load.image('HP_moody', './src/assets/ui/heart/RedMoodyWhiteborder.png');
		this.load.image('HP_sad', './src/assets/ui/heart/RedSadWhiteborder.png');
		this.load.image('MP_happy', './src/assets/ui/heart/TurquoiseHappyWhiteborder.png');
		this.load.image('MP_moody', './src/assets/ui/heart/TurquoiseMoodyWhiteborder.png');
		this.load.image('MP_sad', './src/assets/ui/heart/TurquoiseSadWhiteborder.png');

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
		this.animation.walking.object.play('walking')

		

		// DrawUI
		this.hud.hp = this.add.sprite(80, 460, 'HP_happy').setOrigin(0.5)
		this.hud.mp = this.add.sprite(80, 510, 'MP_happy').setOrigin(0.5)
		util.rescale(this.hud.mp, 40)
		util.rescale(this.hud.hp, 40)

		util.draw_fantasy_button(this, 270, 480, 'frame', 'ring_bg_yellow', 'icon_sword',() => { this.scene.start("Level")})
		util.draw_fantasy_button(this, 420, 480, 'frame', 'ring_bg_blue', 'icon_shield',() => { console.log("de123")})
		util.draw_fantasy_button(this, 570, 480, 'frame', 'ring_bg_green', 'icon_potion',() => { this.scene.start("Menu")})
		util.draw_fantasy_button(this, 720, 480, 'frame', 'ring_bg_orange', 'icon_candles',() => { this.scene.start("Menu")})
	}

	update() {
		this.move();
	}


	move() {
		this.sprite.home_background.tilePositionX += 0.5
		this.terrain.dark_ground_1.tilePositionX += 1
		this.terrain.dark_ground_2.tilePositionX += 1
		this.terrain.dark_ground_3.tilePositionX += 1
		this.terrain.dark_grass.tilePositionX += 1
	}
}