import animationData from '../constant/animation.js'

export default {
	pad(num, size) {
		var s = num + "";
		while (s.length < size) s = "0" + s;
		return s;
	},
	drawButton(scene, x, y, text, sprite, sprite_pressed, press_handler) {
		let temp_button = scene.add.sprite(x, y, sprite)
		temp_button.displayWidth = 150
		temp_button.scaleY = temp_button.scaleX
		let temp_text = scene.add.text(x, y - 5, text, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '28px'
		})
		temp_button.setOrigin(0.5)
		temp_text.setOrigin(0.5)
		temp_button.setInteractive();
		temp_button.on('pointerdown', function () {
			temp_button.setTexture(sprite_pressed)
			temp_text.y += 8
		})
		temp_button.on('pointerup', function () {
			temp_button.setTexture(sprite)
			temp_text.y -= 8
			press_handler()
		})

		return {
			"button": temp_button,
			"text": temp_text
		}
	},
	draw_fantasy_button(scene, x, y, frame, background, icon, press_handler) {
		let background_object = scene.add.sprite(x, y, background).setOrigin(0.5)
		background_object.displayWidth = 100
		background_object.scaleY = background_object.scaleX

		let frame_object = scene.add.sprite(x, y, frame).setOrigin(0.5)
		frame_object.displayWidth = 100
		frame_object.scaleY = frame_object.scaleX

		let icon_object = scene.add.sprite(x, y, icon).setOrigin(0.5)
		icon_object.displayWidth = 100
		icon_object.scaleY = icon_object.scaleX

		icon_object.setInteractive();
		icon_object.on('pointerup', function () {
			press_handler()
		})

		return {
			"background": background_object,
			"frame": frame_object,
			"icon": background_object
		}
	},
	loadAnimation(scene, animationArray, animationString) {
		for (let index = 0; index < animationData[animationString].count; index++) {
			let num = this.pad(index, 3)
			scene.load.image(animationData[animationString].prefix + num, "./src/assets/" + animationData[animationString].folder + "/" + animationData[animationString].prefix + num + ".png")
			animationArray[animationString].sequence.push({
				"key": animationData[animationString].prefix + num
			})
		}
		animationArray[animationString].frameRate = animationData[animationString].count
	},
	rescale(sprite, width) {
		sprite.displayWidth = width
		sprite.scaleY = sprite.scaleX;
		return null
	}
}