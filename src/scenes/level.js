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
		// If want to load it to animation, must declare dummy variable in animation
		this.animations = ['walking', 'running', 'run_slashing', 'run_throwing']
		this.animation = {
			'walking': {
				"sequence": [],
				"frameRate": 0,
				"repeat" : -1
			},
			'running': {
				"sequence": [],
				"frameRate": 0,
				"repeat" : -1
			},
			'run_slashing': {
				"sequence": [],
				"frameRate": 0,
				"repeat" : 0
			},
			'run_throwing': {
				"sequence": [],
				"frameRate": 0,
				"repeat" : 0
			},
		}
		this.unit = {
			'player' : null
		}
		this.hud = {
			"hp" : null,
			"mp" : null,
			"level" : null
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

		this.load.image('HP', './src/assets/ui/heart/RedPlainBlackborder.png')
		this.load.image('MP', './src/assets/ui/heart/TurquoisePlainBlackborder.png')

		// Load animation
		this.load_animations()
	}

	create() {
		// Draw background and ground
		this.drawEnvironment()

		// DrawUI and HUD
		this.drawUI()

		// Load animation
		this.create_animations()

		// Add player avatar
		this.drawPlayer()

		// Add player animation handler
		this.playerAnimationHandler()
	}

	update() {
		this.move();
	}

	
	load_animations(){
		for (let i = 0; i < this.animations.length; i++) {
			const element = this.animations[i];
			util.loadAnimation(this, this.animation, element)
		}
	}

	create_animations(){
		for (let i = 0; i < this.animations.length; i++) {
			const element = this.animations[i];

			this.anims.create({
				key: element,
				frames: this.animation[element].sequence,
				frameRate: this.animation[element].frameRate,
				repeat: this.animation[element].repeat
			});
			console.log(this.animation[element].repeat)
		}
	}

	move() {
		this.sprite.home_background.tilePositionX += 0.5
		this.terrain.dark_ground_1.tilePositionX += 1
		this.terrain.dark_ground_2.tilePositionX += 1
		this.terrain.dark_ground_3.tilePositionX += 1
		this.terrain.dark_grass.tilePositionX += 1
	}

	drawEnvironment(){
		this.sprite.home_background = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, this.dynamicAsset.background).setOrigin(0)
		this.terrain_dark_ground_height = this.textures.get(this.dynamicAsset.terrain_dark_ground).getSourceImage().height
		this.terrain_dark_grass_height = this.textures.get(this.dynamicAsset.terrain_dark_grass).getSourceImage().height
		this.terrain.dark_ground_1 = this.add.tileSprite(0, 300, this.gameWidth, this.terrain_dark_ground_height, this.dynamicAsset.terrain_dark_ground).setOrigin(0)
		this.terrain.dark_ground_2 = this.add.tileSprite(0, 360, this.gameWidth, this.terrain_dark_ground_height, this.dynamicAsset.terrain_dark_ground).setOrigin(0)
		this.terrain.dark_ground_3 = this.add.tileSprite(0, 420, this.gameWidth, this.terrain_dark_ground_height, this.dynamicAsset.terrain_dark_ground).setOrigin(0)
		this.terrain.dark_grass = this.add.tileSprite(0, 250, this.gameWidth, this.terrain_dark_grass_height, this.dynamicAsset.terrain_dark_grass).setOrigin(0)
	}

	drawUI(){
		this.sprite.action_background = this.add.sprite(0, this.gameHeight - 150, 'action_background').setOrigin(0)
		util.rescale(this.sprite.action_background, this.gameWidth)
		this.hud.hp = this.add.sprite(70, 505, 'HP').setOrigin(0.5)
		this.hud.mp = this.add.sprite(115, 505, 'MP').setOrigin(0.5)
		util.rescale(this.hud.mp, 40)
		util.rescale(this.hud.hp, 40)
		this.hud.level = this.add.text(40, 440, "Mystery Forest", {
			fontFamily: 'bm-yeon-sung',
			fontSize: '22px'
		}).setOrigin(0)

		util.draw_fantasy_button(this, 270, 480, 'frame', 'ring_bg_yellow', 'icon_sword',() => { this.unit.player.play('run_slashing') })
		util.draw_fantasy_button(this, 420, 480, 'frame', 'ring_bg_blue', 'icon_shield',() => { this.unit.player.play('run_throwing') })
		util.draw_fantasy_button(this, 570, 480, 'frame', 'ring_bg_green', 'icon_potion',() => { this.scene.start("Menu")})
		util.draw_fantasy_button(this, 720, 480, 'frame', 'ring_bg_orange', 'icon_candles',() => { this.scene.start("Menu")})

	}

	drawPlayer(){		
		this.unit.player = this.add.sprite(120, 245, this.animation.running.sequence[0].key)
		util.rescale(this.unit.player, 200)
		this.unit.player.play('running')
	}


	playerAnimationHandler(){
		this.unit.player.on('animationcomplete', function (anim, frame) {
			this.emit('animationcomplete_' + anim.key, anim, frame);
			console.log('animationcomplete_' + anim.key)
		}, this.unit.player)

		this.unit.player.on('animationcomplete_run_slashing', () => { this.unit.player.play('running') });
		this.unit.player.on('animationcomplete_run_throwing', () => { this.unit.player.play('running') });
	}
}