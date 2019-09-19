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
	draw_fantasy_button() {

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