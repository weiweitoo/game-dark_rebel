import util from '../helper/helper.js'
import level from '../constant/level_attribute.js'
import fantasyButtonAsset from '../constant/fantasy_button.js'
import animationData from '../constant/animation.js'
import effectData from '../constant/skill_effect.js'
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
		this.gameState = "playing";
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
		this.skills = ['fire', 'water', 'air']
		this.skill = {
			'fire': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
			'water': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
			'air': {
				"sequence": [],
				"frameRate": 0,
				"repeat": 0
			},
		}
		this.skillCoolDown = {
			"fire" : 0,
			"water": 0,
			"air": 0
		}
		this.audio = {
			'fire': null,
			'water': null,
			'air': null,
			'background': null
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
		this.buff = {
			"defense_animation" : null,
			"defense": false
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
		this.curr_wave = 0;	//start from -1

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
		this.load.image('MP', './src/assets/ui/heart/BluePlainBlackborder.png')

		this.load.audio('attack', './src/assets/audio/effect/attack.wav');
		this.load.audio('fire', './src/assets/audio/effect/fire.wav');
		this.load.audio('water', './src/assets/audio/effect/water.wav');
		this.load.audio('air', './src/assets/audio/effect/air.wav');

		// Load animation
		this.load_animations()
	}

	create() {
		// init attribute
		this.initPlayerAttribute()

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

		// create Audio
		this.initAudio()

		this.unit.player.setDepth(9)

		this.spawn_level_or_winner()
	}

	update() {
		if (this.gameState === "playing") {
			this.move()
			this.checkWin()
		}
		else if (this.gameState === "win") {

		}


	}

	initAudio() {
		this.audio.attack = this.sound.add('attack');
		this.audio.fire = this.sound.add('fire');
		this.audio.water = this.sound.add('water');
		this.audio.air = this.sound.add('air');
		// this.audio.background = this.sound.add('background');
	}

	spawn_level_or_winner() {
		setInterval(() => {
			// all monster is clear
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
			else if (this.unit.monsters.length <= 0 && this.curr_wave >= this.max_wave){
				this.clearAllFunction()
				this.gameState = "win"
				let currAttribute = {
					"str": this.sys.game.global_str,
					"agi": this.sys.game.global_agi,
					"int": this.sys.game.global_int,
					"vit": this.sys.game.global_vit
				}
				this.unit.player.setDepth(-1)
				util.messageBox(this, "dialog_frame", "hud", "dialog_button", "You found 1 Magic Seed which can \nincrease your attribute point by 1 \nEat it now?", "Okay", "Congratulation", () => {
					util.attributeBox(this, "dialog_frame", "hud", "dialog_button", currAttribute, 1, (newAttribute) => {
						this.sys.game.global_str = newAttribute.str 
						this.sys.game.global_agi = newAttribute.agi
						this.sys.game.global_int = newAttribute.int
						this.sys.game.global_vit = newAttribute.vit
						this.sys.game.global_level += 1
						this.scene.start('Home')
					})
				})
			}
		}, 4000)
	}

	load_skil_animation() {
		for (let i = 0; i < this.skills.length; i++) {
			const element = this.skills[i];
			util.loadAnimation(this, effectData, this.skill, element)
		}
	}

	load_animations() {
		// load player and enemy animation
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

		// load skill animation
		this.load_skil_animation();
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

		this.create_skill_animations();
	}

	create_skill_animations() {
		for (let i = 0; i < this.skills.length; i++) {
			const element = this.skills[i];
			this.anims.create({
				key: "effect_" + element,
				frames: this.skill[element].sequence,
				frameRate: this.skill[element].frameRate,
				repeat: this.skill[element].repeat
			});
		}

	}

	spawn_effect(x, y, type, range) {
		let effect = this.add.sprite(x, y, this.skill[type].sequence[0].key)
		if (type === "fire") {
			util.rescale(effect, range - x)
		}
		else if (type === "water") {
			util.rescale(effect, 200)
		}
		else if (type === "air") {
			util.rescale(effect, 200)
			this.buff.defense_animation = effect
		}

		effect.play('effect_' + type)

		effect.on('animationcomplete', function (anim, frame) {
			effect.destroy()
		})

		effect.setDepth(10)
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

		this.drawHud();

		this.hud.level = this.add.text(40, 440, this.level_asset.name, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '22px'
		}).setOrigin(0)

		// util.draw_fantasy_button(this, 270, 480, 'frame', 'ring_bg_yellow', 'icon_sword', () => { this.castSkill(1) })
		this.hud.fire = util.draw_fantasy_button(this, 420, 480, 'frame', 'ring_bg_orange', 'icon_candles', () => { this.castSkill(2) })
		this.hud.water = util.draw_fantasy_button(this, 570, 480, 'frame', 'ring_bg_green', 'icon_potion', () => { this.castSkill(3) })
		this.hud.air = util.draw_fantasy_button(this, 720, 480, 'frame', 'ring_bg_blue', 'icon_shield', () => { this.castSkill(4) })

	}

	drawPlayer() {
		this.unit.player = this.physics.add.sprite(0, 245, this.animation.running.sequence[0].key)
		util.rescale(this.unit.player, 200)
		this.unit.player.enabledBody = true
		this.unit.player.setOffset(-320, 0)
		this.unit.player.setBounce(1);
		this.unit.player.play('running')
	}

	drawHud() {
		if (this.hud.hpText) {
			this.hud.hpText.destroy()
		} if (this.hud.hpText) {
			this.hud.mpText.destroy()
		}


		this.hud.hpText = this.add.text(70, 503, this.getPlayerHP(), {
			fontFamily: 'bm-yeon-sung',
			fontSize: '16px',
			fill: '#FFFFFF'
		}).setOrigin(0.5)
		this.hud.mpText = this.add.text(115, 503, this.getPlayerMP(), {
			fontFamily: 'bm-yeon-sung',
			fontSize: '16px',
			fill: '#FFFFFF'
		}).setOrigin(0.5)
	}

	spawnMonster(type) {
		let newMonster
		if (type === 'm') {
			newMonster = new Melee(1, this.meleeAnimation)
		}
		else if (type === 'a') {
			newMonster = new Archer(1, this.archerAnimation)
		}
		else if (type === 'g') {
			newMonster = new Golem(1, this.golemAnimation)
		}
		newMonster.spawn(this)
		this.physics.add.collider(this.unit.player, newMonster.getObject(), this.collideEvent, null, { scene: this, enemyObject: newMonster })
		this.unit.monsters.push(newMonster)
	}

	collideEvent(player, enemy) {
		if (this.enemyObject.getState() != null) {
			return
		}

		let enemyDamage = this.scene.buff.defense ? Math.floor(this.enemyObject.getDamage() * 0.6) : this.enemyObject.getDamage();
		let playerDamage = this.scene.sys.game.damage

		if (this.scene.receiveDamage(enemyDamage) <= 0) {
			// player dead
			this.scene.gameState = "end"
			this.scene.unit.player.setDepth(-1)

			this.scene.clearAllFunction();
			this.scene.unit.player.play('dying')
			// wait awhile
			util.messageBox(this.scene, "dialog_frame", "hud", "dialog_button", "Keep it up... Try again!", "Alright", "Failed", () => {
				this.scene.scene.start('home')
			})
		}

		if (this.enemyObject.receiveDamage(this.scene, playerDamage) <= 0) {
			//enemy dead
			this.scene.clearMonsterArray();
		}

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

		this.scene.drawHud();
	}

	playerAnimationHandler() {
		this.unit.player.on('animationcomplete', function (anim, frame) {
			this.emit('animationcomplete_' + anim.key, anim, frame);
			// console.log('animationcomplete_' + anim.key)
		}, this.unit.player)

		this.unit.player.on('animationcomplete_run_slashing', () => { this.unit.player.play('running') });
		this.unit.player.on('animationcomplete_run_throwing', () => { this.unit.player.play('running') });
	}

	drawDamage(object, damage) {
		let damageText = this.add.text(object.x, object.y - 100, (damage > 0) ? damage : -damage, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '16px',
			// stroke: '#000000',
			// strokeThickness: '2',
			fill: (damage > 0) ? '#EE0000' : '#00EE00'
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
	drawMP(object, mp, color) {
		let mpText = this.add.text(object.x, object.y - 100, mp, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '16px',
			// stroke: '#000000',
			// strokeThickness: '2',
			fill: color
		})

		this.add.tween({
			targets: [mpText],
			ease: 'Sine.easeInOut',
			duration: 1000,
			delay: 0,
			y: {
				getStart: () => mpText.y,
				getEnd: () => mpText.y - 5
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

	checkWin() {
		if (this.curr_wave >= this.max_wave) {
			
		}
	}


	// Should move into a player class, but is fine
	initPlayerAttribute() {
		this.sys.game.max_hp = Math.floor(this.sys.game.global_vit * attribute_level.hp.vit)
		this.sys.game.damage = Math.floor(this.sys.game.global_str * attribute_level.damage.str)
		this.sys.game.max_mp = Math.floor(this.sys.game.global_vit * attribute_level.energy.vit)
		this.sys.game.critical = Math.floor(this.sys.game.global_agi * attribute_level.critical.agi)
		this.sys.game.skill_damage = Math.floor(this.sys.game.global_int * attribute_level.skill_damage.int)

		this.sys.game.curr_hp = this.sys.game.max_hp
		this.sys.game.curr_mp = this.sys.game.max_mp
	}

	getPlayerHP() {
		return this.sys.game.curr_hp
	}

	getPlayerMP() {
		return this.sys.game.curr_mp
	}

	// Should move into a player class, but is fine
	receiveDamage(damage) {
		this.sys.game.curr_hp = Math.floor(this.sys.game.curr_hp - damage)
		return this.sys.game.curr_hp
	}

	// Should move into a player class, but is fine
	deductMP(mp) {
		this.sys.game.curr_mp -= mp
	}

	clearAllFunction() {
		// Set a fake timeout to get the highest timeout id
		var highestTimeoutId = setTimeout(";");
		for (var i = 0; i < highestTimeoutId; i++) {
			clearTimeout(i);
		}

		var interval_id = window.setInterval("", 9999); // Get a reference to the last
		// interval +1
		for (var i = 1; i < interval_id; i++)
			window.clearInterval(i);
	}

	clearMonsterArray(){
		this.unit.monsters = this.unit.monsters.filter(monster => {
			return monster.getCurrentHP() > 0
		})
	}
	// player skill
	castSkill(type) {
		if (this.gameState !== 'playing' && this.sys.game.curr_mp < 5) { return; }

		let playerDamage = this.sys.game.damage * this.sys.game.skill_damage

		// if (type === 1) {
		// 	this.unit.player.play('run_slashing');
		// 	this.audio.attack.play()
		// }
		if (type === 2) {
			this.drawMP(this.unit.player, 'Pyromancy', "#FF0000")
			this.spawn_effect(this.unit.player.x + 200, this.unit.player.y, "fire", this.gameWidth);
			this.unit.monsters.map((monster) => {
				monster.receiveDamage(this, playerDamage)
				this.drawDamage(monster.getObject(), playerDamage)
				this.clearMonsterArray()
			})
			this.audio.fire.play()
		}
		else if (type === 3) {
			this.drawMP(this.unit.player, "+" + (playerDamage) + ' Heal', "#00FF00")
			this.spawn_effect(this.unit.player.x, this.unit.player.y, "water");
			this.receiveDamage(-1 * (playerDamage))
			// this.drawDamage(this.unit.player, -1 * playerDamage)
			this.audio.water.play()
		}
		else if (type === 4) {
			this.drawMP(this.unit.player, 'Barrier', "#FFFFFF")
			this.spawn_effect(this.unit.player.x, this.unit.player.y, "air");
			this.buff.defense = true
			setTimeout(() => {
				this.buff.defense = false
				this.buff.defense_animation.destroy()			
			}, 3000)
			this.audio.air.play()
		}
		this.unit.player.play('run_throwing');
		this.deductMP(5)
		this.drawHud();
	}

}
