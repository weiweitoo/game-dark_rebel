import util from '../helper/helper.js'
import level from '../constant/level_attribute.js'
import fantasyButtonAsset from '../constant/fantasy_button.js'
import animationData from '../constant/animation.js'
import meleeAnimationData from '../constant/melee_animation.js'
import archerAnimationData from '../constant/archer_animation.js'
import golemAnimationData from '../constant/golem_animation.js'
import attribute_level from '../constant/attribute_level.js'

import Melee from "../class/melee.js"
import Archer from "../class/archer.js"
import Golem from "../class/golem.js"

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
		this.animations = ['running', 'run_slashing', 'run_throwing', 'dying']
		this.animation = {
			'running': {
				"sequence": [],
				"frameRate": 0,
				"repeat": -1
			},
			'run_slashing': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
			'run_throwing': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
			'dying': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
		}
		this.meleeAnimation = {
			'running': {
				"sequence": [],
				"frameRate": 0,
				"repeat": -1
			},
			'run_slashing': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
			'run_throwing': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
			'dying': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
		}
		this.archerAnimation = {
			'walking': {
				"sequence": [],
				"frameRate": 0,
				"repeat": -1
			},
			'running': {
				"sequence": [],
				"frameRate": 0,
				"repeat": -1
			},
			'run_slashing': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
			'run_throwing': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
			'dying': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
		}
		this.golemAnimation = {
			'running': {
				"sequence": [],
				"frameRate": 0,
				"repeat": -1
			},
			'run_slashing': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
			'run_throwing': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
			'dying': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
		}
		this.unit = {
			'player': null,
			'monsters': []
		}
		this.hud = {
			"hp": null,
			"mp": null,
			"level": null
		}
		this.dynamicAsset = {
			"background": 'home_background' + this.LEVEL,
			"terrain_dark_grass": 'terrain_dark_grass' + this.LEVEL,
			"terrain_dark_ground": 'terrain_dark_ground' + this.LEVEL,
		}
		this.terrain_dark_ground_height = null
		this.terrain_dark_grass_height = null
	}

	preload() {
		this.LEVEL = this.sys.game.global_level

		this.dynamicAsset.background = 'home_background' + this.LEVEL
		this.dynamicAsset.terrain_dark_grass = 'terrain_dark_grass' + this.LEVEL
		this.dynamicAsset.terrain_dark_ground = 'terrain_dark_ground' + this.LEVEL

		this.gameWidth = this.sys.game.canvas.getAttribute("width");
		this.gameHeight = this.sys.game.canvas.getAttribute("height");
		this.load.image("action_background", './src/assets/ui/UIBoardLargeParchment.png');

		this.level_asset = level[this.LEVEL.toString()]
		this.load.image(this.dynamicAsset.background, this.level_asset.background_asset);
		this.load.image(this.dynamicAsset.terrain_dark_grass, this.level_asset.terrain_asset);
		this.load.image(this.dynamicAsset.terrain_dark_ground, this.level_asset.terrain_ground);
		this.monsters_wave = this.level_asset.monster;
		this.max_wave = this.monsters_wave.length
		this.curr_wave = 0;

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

		this.unit.player.setDepth(9)

		this.spawn_level()
		this.initPlayerAttribute()
	}

	update() {
		this.move()
	}

	spawn_level() {
		setInterval(() => {
			// all monster is clear
			console.log(this.unit.monsters)
			if (this.unit.monsters.length <= 0 && this.curr_wave < this.max_wave) {
				let time = 0
				this.monsters_wave[this.curr_wave].map((monsterType) => {
					// spawn it after some random interval
					setTimeout(() => {
						this.spawnMonster(monsterType)
					}, time * 1000);
					time = Math.random() * 2.5 + 1.0
				})
				this.curr_wave += 1;
			}
		}, 4000)
	}

	load_animations() {
		for (let i = 0; i < this.animations.length; i++) {
			const element = this.animations[i];
			util.loadAnimation(this, animationData, this.animation, element)
		}

		for (let i = 0; i < this.animations.length; i++) {
			const element = this.animations[i];
			util.loadAnimation(this, meleeAnimationData, this.meleeAnimation, element)
		}

		for (let i = 0; i < this.animations.length; i++) {
			const element = this.animations[i];
			util.loadAnimation(this, archerAnimationData, this.archerAnimation, element)
		}

		for (let i = 0; i < this.animations.length; i++) {
			const element = this.animations[i];
			util.loadAnimation(this, golemAnimationData, this.golemAnimation, element)
		}
	}

	create_animations() {
		for (let i = 0; i < this.animations.length; i++) {
			const element = this.animations[i];
			this.anims.create({
				key: element,
				frames: this.animation[element].sequence,
				frameRate: this.animation[element].frameRate,
				repeat: this.animation[element].repeat
			});
		}

		for (let i = 0; i < this.animations.length; i++) {
			const element = this.animations[i];
			this.anims.create({
				key: "melee_" + element,
				frames: this.meleeAnimation[element].sequence,
				frameRate: this.meleeAnimation[element].frameRate,
				repeat: this.meleeAnimation[element].repeat
			});
		}

		for (let i = 0; i < this.animations.length; i++) {
			const element = this.animations[i];
			this.anims.create({
				key: "archer_" + element,
				frames: this.archerAnimation[element].sequence,
				frameRate: this.archerAnimation[element].frameRate,
				repeat: this.archerAnimation[element].repeat
			});
		}

		for (let i = 0; i < this.animations.length; i++) {
			const element = this.animations[i];
			this.anims.create({
				key: "golem_" + element,
				frames: this.golemAnimation[element].sequence,
				frameRate: this.golemAnimation[element].frameRate,
				repeat: this.golemAnimation[element].repeat
			});
		}
	}

	move() {
		this.sprite.home_background.tilePositionX += 0.5
		this.terrain.dark_ground_1.tilePositionX += 1
		this.terrain.dark_ground_2.tilePositionX += 1
		this.terrain.dark_ground_3.tilePositionX += 1
		this.terrain.dark_grass.tilePositionX += 1

		if (this.unit.player.x < 280) {
			this.unit.player.x += 2
		}

		// move monster
		this.unit.monsters.map((monster) => {
			monster.object.x -= monster.getMovement();
		})
	}

	drawEnvironment() {
		this.sprite.home_background = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, this.dynamicAsset.background).setOrigin(0)
		this.terrain_dark_ground_height = this.textures.get(this.dynamicAsset.terrain_dark_ground).getSourceImage().height
		this.terrain_dark_grass_height = this.textures.get(this.dynamicAsset.terrain_dark_grass).getSourceImage().height
		this.terrain.dark_ground_1 = this.add.tileSprite(0, 300, this.gameWidth, this.terrain_dark_ground_height, this.dynamicAsset.terrain_dark_ground).setOrigin(0)
		this.terrain.dark_ground_2 = this.add.tileSprite(0, 360, this.gameWidth, this.terrain_dark_ground_height, this.dynamicAsset.terrain_dark_ground).setOrigin(0)
		this.terrain.dark_ground_3 = this.add.tileSprite(0, 420, this.gameWidth, this.terrain_dark_ground_height, this.dynamicAsset.terrain_dark_ground).setOrigin(0)
		this.terrain.dark_grass = this.add.tileSprite(0, 250, this.gameWidth, this.terrain_dark_grass_height, this.dynamicAsset.terrain_dark_grass).setOrigin(0)
	}

	drawUI() {
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

		util.draw_fantasy_button(this, 270, 480, 'frame', 'ring_bg_yellow', 'icon_sword', () => { this.unit.player.play('run_slashing') })
		util.draw_fantasy_button(this, 420, 480, 'frame', 'ring_bg_blue', 'icon_shield', () => { this.unit.player.play('run_throwing') })
		util.draw_fantasy_button(this, 570, 480, 'frame', 'ring_bg_green', 'icon_potion', () => { this.unit.player.play('run_throwing') })
		util.draw_fantasy_button(this, 720, 480, 'frame', 'ring_bg_orange', 'icon_candles', () => { this.unit.player.play('run_throwing') })

	}

	drawPlayer() {
		this.unit.player = this.physics.add.sprite(0, 245, this.animation.running.sequence[0].key)
		util.rescale(this.unit.player, 200)
		this.unit.player.enabledBody = true;
		// this.unit.player.setSize(1000,1000)
		this.unit.player.setOffset(-320, 0)
		this.unit.player.setBounce(1);
		this.unit.player.play('running')
	}

	spawnMonster(type) {
		let newMonster
		if (type === 'm') {
			newMonster = new Melee(1, this.meleeAnimation)
		}
		else if (type === 'a') {
			newMonster = new Archer(1, this.meleeAnimation)
		}
		else if (type === 'g') {
			newMonster = new Golem(1, this.meleeAnimation)
		}
		newMonster.spawn(this)
		this.physics.add.collider(this.unit.player, newMonster.getObject(), this.collideEvent, null, { scene: this, enemyObject: newMonster })
		this.unit.monsters.push(newMonster)
	}

	collideEvent(player, enemy) {
		if (this.enemyObject.getState() != null) {
			return
		}

		let enemyDamage = this.enemyObject.getDamage()
		let playerDamage = this.scene.sys.game.damage

		if(this.scene.receiveDamage(enemyDamage) <= 0){
			// player dead
		}
		
		if(this.enemyObject.receiveDamage(this.scene, playerDamage) <= 0){
			//enemy dead
			this.scene.unit.monsters = this.scene.unit.monsters.filter(monster => {
				console.log( monster.getCurrentHP())
				return monster.getCurrentHP() > 0
			})
			console.log(this.scene.unit.monsters)
		}

		
		// console.log(this.scene.sys.game.curr_hp)
		// console.log(this.enemyObject.getCurrentHP())

		this.scene.tweens.add({
			targets: player,
			x: player.x - 60,
			duration: 200,
			ease: 'Ease-Out',
			// easeParams: [ 3.5 ]
		});

		this.scene.drawDamage(player, enemyDamage)

		this.scene.tweens.add({
			targets: enemy,
			x: enemy.x + 120,
			duration: 200,
			ease: 'Ease-Out',
			// easeParams: [ 3.5 ]
		});

		this.scene.drawDamage(enemy, playerDamage)
		console.log("enemy damage")

	}

	playerAnimationHandler() {
		this.unit.player.on('animationcomplete', function (anim, frame) {
			this.emit('animationcomplete_' + anim.key, anim, frame);
			console.log('animationcomplete_' + anim.key)
		}, this.unit.player)

		this.unit.player.on('animationcomplete_run_slashing', () => { this.unit.player.play('running') });
		this.unit.player.on('animationcomplete_run_throwing', () => { this.unit.player.play('running') });
	}

	drawDamage(object, damage) {
		let damageText = this.add.text(object.x, object.y - 100, damage, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '14px',
			// stroke: '#000000',
			// strokeThickness: '2',
			fill: '#EE0000'
		})

		this.add.tween({
			targets: [damageText],
			ease: 'Sine.easeInOut',
			duration: 1000,
			delay: 0,
			y: {
				getStart: () => damageText.y,
				getEnd: () => damageText.y - 5
			},
			alpha: {
				getStart: () => 1,
				getEnd: () => 0
			},
			onComplete: () => {
				// Handle completion
			}
		});
	}


	// Should move into a player class, but is fine
	initPlayerAttribute() {
		this.sys.game.max_hp = this.sys.game.global_vit * attribute_level.hp.vit
		this.sys.game.damage = this.sys.game.global_str * attribute_level.damage.str
		this.sys.game.max_energy = this.sys.game.global_vit * attribute_level.energy.vit
		this.sys.game.critical = this.sys.game.global_agi * attribute_level.critical.agi
		this.sys.game.skill_damage = this.sys.game.global_int * attribute_level.skill_damage.int

		this.sys.game.curr_hp = this.sys.game.max_hp
		this.sys.game.curr_mp = this.sys.game.max_mp
	}

	// Should move into a player class, but is fine
	receiveDamage(damage) {
		this.sys.game.curr_hp -= damage
		return this.sys.game.curr_hp
	}

	// Should move into a player class, but is fine
	deductMP(mp) {
		this.sys.game.curr_mp -= mp
	}

}