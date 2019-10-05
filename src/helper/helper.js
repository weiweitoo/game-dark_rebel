export default {
	pad(num, size) {
		var s = num + "";
		while (s.length < size) s = "0" + s;
		return s;
	},
	capitalizeFLetter(str) {
		return str[0].toUpperCase() + str.slice(1);
	},
	drawButton(scene, x, y, text, sprite, sprite_pressed, press_handler, textAttribute, button_width) {
		let temp_button = scene.add.sprite(x, y, sprite)
		temp_button.displayWidth = button_width
		temp_button.scaleY = temp_button.scaleX
		let temp_text
		if (sprite_pressed != null) {
			temp_text = scene.add.text(x, y - 5, text, textAttribute)
		} else {
			temp_text = scene.add.text(x, y, text, textAttribute)
		}

		temp_button.setOrigin(0.5)
		temp_text.setOrigin(0.5)
		temp_button.setInteractive();
		if (sprite_pressed != null) {
			temp_button.on('pointerdown', function () {
				temp_button.setTexture(sprite_pressed)
				temp_text.y += 8
			})
		}
		temp_button.on('pointerup', function () {
			if (sprite_pressed != null) {
				temp_button.setTexture(sprite)
				temp_text.y -= 8
			}
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
	loadAnimation(scene, animationData, animationArray, animationString) {
		for (let index = 0; index < animationData[animationString].count; index++) {
			let num = this.pad(index, 3)
			scene.load.image(animationData[animationString].prefix + num, "./src/assets/" + animationData[animationString].folder + "/" + animationData[animationString].prefix + num + ".png")
			animationArray[animationString].sequence.push({
				"key": animationData[animationString].prefix + num
			})
		}
		animationArray[animationString].frameRate = animationData[animationString].count
		animationArray[animationString].repeat = animationData[animationString].repeat
	},
	rescale(sprite, width) {
		sprite.displayWidth = width
		sprite.scaleY = sprite.scaleX;
		return null
	},
	messageBox(scene, frame, title, button, dialogText, buttonText, titleText, press_handler) {
		this.dialogBoxHelper(scene, frame, title, button, dialogText, buttonText, titleText, press_handler)
	},
	alertBox(scene, frame, title, button, dialogText, buttonText, press_handler) {
		this.dialogBoxHelper(scene, frame, title, button, dialogText, buttonText, null, press_handler)
	},
	dialogBoxHelper(scene, frame, title, button, dialogText, buttonText, titleText, press_handler) {
		// Do not call this function, call messageBox or alertBox
		let widthCenter = scene.sys.game.canvas.getAttribute("width") / 2
		let heightCenter = scene.sys.game.canvas.getAttribute("height") / 2

		let temp_frame = scene.add.sprite(widthCenter, heightCenter, frame).setOrigin(0.5)
		this.rescale(temp_frame, 550)
		let frameHeight = temp_frame.displayHeight

		let temp_title = scene.add.sprite(widthCenter, heightCenter - (frameHeight / 2.3), title).setOrigin(0.5)
		let temp_titleText
		if (titleText !== null) {
			this.rescale(temp_title, 160)
			temp_titleText = scene.add.text(widthCenter, heightCenter - (frameHeight / 2.3), titleText, {
				fontFamily: 'bm-yeon-sung',
				fontSize: '22px'
			}).setOrigin(0.5)
		} else {
			this.rescale(temp_title, 60)
		}

		let temp_button = scene.add.sprite(widthCenter, heightCenter + (frameHeight / 2.3), button).setOrigin(0.5)
		this.rescale(temp_button, 110)

		temp_button.setInteractive()
		temp_button.on('pointerup', function () {
			press_handler()
			temp_frame.destroy()
			temp_title.destroy()
			temp_button.destroy()
			temp_dialog_text.destroy()
			temp_button_text.destroy()
			if (titleText !== null) {
				temp_titleText.destroy()
			}
		})

		let temp_dialog_text = scene.add.text(widthCenter, heightCenter, dialogText, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '24px'
		}).setOrigin(0.5)

		let temp_button_text = scene.add.text(widthCenter, heightCenter + (frameHeight / 2.3) - 5, buttonText, {
			fontFamily: 'bm-yeon-sung',
			fontSize: '20px'
		}).setOrigin(0.5)

		return {
			"frame": temp_frame,
			"title": temp_title,
			"button": temp_button,
			"dialogText": temp_dialog_text,
			"buttonText": temp_button_text
		}

		// TODO add a tween out and in animation
	},
	attributeBox(scene, frame, title, button, attributeArray, seed, press_handler) {
		let widthCenter = scene.sys.game.canvas.getAttribute("width") / 2
		let heightCenter = scene.sys.game.canvas.getAttribute("height") / 2

		let temp_frame = scene.add.sprite(widthCenter, heightCenter, frame).setOrigin(0.5)
		this.rescale(temp_frame, 700)
		let frameHeight = temp_frame.displayHeight

		let temp_title = scene.add.sprite(widthCenter, heightCenter - (frameHeight / 2.3), title).setOrigin(0.5)
		this.rescale(temp_title, 160)

		let temp_button = scene.add.sprite(widthCenter, heightCenter + (frameHeight / 2.3), button).setOrigin(0.5)
		this.rescale(temp_button, 110)

		let temp_titleText = scene.add.text(widthCenter, heightCenter - (frameHeight / 2.3), "Attribute", {
			fontFamily: 'bm-yeon-sung',
			fontSize: '22px'
		}).setOrigin(0.5)

		let temp_buttonText = scene.add.text(widthCenter, heightCenter + (frameHeight / 2.3) - 5, "Confirm", {
			fontFamily: 'bm-yeon-sung',
			fontSize: '20px'
		}).setOrigin(0.5)

		let temp_subtitleText = null

		let choiceButtonGroup = []
		const updateDialogChoice = () => {
			// Update remaining seed
			if (temp_subtitleText) {
				temp_subtitleText.destroy()
			}
			temp_subtitleText = scene.add.text(widthCenter, heightCenter - 60, "Reaming Seed: " + seed, {
				fontFamily: 'bm-yeon-sung',
				fontSize: '20px'
			}).setOrigin(0.5)

			// Clear previous created object(button and text)
			choiceButtonGroup.map((button) => {
				button.destroy()
			})
			// Draw new object(button and text)
			Object.entries(attributeArray).map((attribute, index) => {
				let temp_attr_button = scene.add.sprite(widthCenter + ((index % 2 == 0) ? -80 : 80), heightCenter + 20 + ((index < 2) ? -30 : 30), button).setOrigin(0.5)
				choiceButtonGroup.push(temp_attr_button)
				this.rescale(temp_attr_button, 110)
				let temp_attr_text = scene.add.text(widthCenter + ((index % 2 == 0) ? -80 : 80), heightCenter + 20 - 5 + ((index < 2) ? -30 : 30), this.capitalizeFLetter(attribute[0] + " = " + attribute[1]), {
					fontFamily: 'bm-yeon-sung',
					fontSize: '20px'
				}).setOrigin(0.5)

				choiceButtonGroup.push(temp_attr_text)
				temp_attr_button.setInteractive()
				temp_attr_button.on('pointerup', () => {
					if (seed > 0) {
						attributeArray[attribute[0]] += 1
						seed -= 1
						updateDialogChoice()
					}
				})
			})
		}

		// Call once, it will be continue to call when the buttonevent inside is trigger
		updateDialogChoice()



		temp_button.setInteractive()
		temp_button.on('pointerup', function () {
			press_handler(attributeArray)
			temp_frame.destroy()
			temp_title.destroy()
			temp_button.destroy()
			temp_titleText.destroy()
			temp_buttonText.destroy()
			temp_subtitleText.destroy()
			// Clear previous created object(button and text)
			choiceButtonGroup.map((button) => {
				button.destroy()
			})
		})

		// TODO add a tween out and in animation
	},
	skillBox(scene, frame, title, button, skillArray, press_handler) {
		let widthCenter = scene.sys.game.canvas.getAttribute("width") / 2
		let heightCenter = scene.sys.game.canvas.getAttribute("height") / 2

		let temp_frame = scene.add.sprite(widthCenter, heightCenter, frame).setOrigin(0.5)
		this.rescale(temp_frame, 500)
		let frameHeight = temp_frame.displayHeight

		let temp_title = scene.add.sprite(widthCenter, heightCenter - (frameHeight / 2.3), title).setOrigin(0.5)
		this.rescale(temp_title, 160)

		let temp_button = scene.add.sprite(widthCenter, heightCenter + (frameHeight / 2.3), button).setOrigin(0.5)
		this.rescale(temp_button, 110)

		let temp_titleText = scene.add.text(widthCenter, heightCenter - (frameHeight / 2.3), "Skill", {
			fontFamily: 'bm-yeon-sung',
			fontSize: '22px'
		}).setOrigin(0.5)

		let temp_buttonText = scene.add.text(widthCenter, heightCenter + (frameHeight / 2.3) - 5, "Confirm", {
			fontFamily: 'bm-yeon-sung',
			fontSize: '20px'
		}).setOrigin(0.5)

		let choiceButtonGroup = []
		const updateDialogChoice = () => {
			// Clear previous created object(button and text)
			choiceButtonGroup.map((button) => {
				button.destroy()
			})
			// Draw new object(button and text)
			// Object.entries(attributeArray).map((attribute, index) => {
			// 	let temp_attr_button = scene.add.sprite(widthCenter + ((index % 2 == 0) ? -80 : 80), heightCenter + ((index < 2) ? -30 : 30), button).setOrigin(0.5)
			// 	choiceButtonGroup.push(temp_attr_button)
			// 	this.rescale(temp_attr_button, 110)
			// 	let temp_attr_text = scene.add.text(widthCenter + ((index % 2 == 0) ? -80 : 80), heightCenter - 5 + ((index < 2) ? -30 : 30), this.capitalizeFLetter(attribute[0] + " = " + attribute[1]), {
			// 		fontFamily: 'bm-yeon-sung',
			// 		fontSize: '20px'
			// 	}).setOrigin(0.5)

			// 	choiceButtonGroup.push(temp_attr_text)
			// 	temp_attr_button.setInteractive()
			// 	temp_attr_button.on('pointerup', () => {
			// 		attributeArray[attribute[0]] += 1
			// 		console.log(attributeArray)
			// 		updateDialogChoice()
			// 	})
			// })
		}

		// Call once, it will be continue to call when the buttonevent inside is trigger
		// updateDialogChoice()



		// temp_button.setInteractive()
		// temp_button.on('pointerup', function () {
		// 	press_handler(attributeArray)
		// 	temp_frame.destroy()
		// 	temp_title.destroy()
		// 	temp_button.destroy()
		// 	temp_titleText.destroy()
		// 	temp_buttonText.destroy()
		// 	// Clear previous created object(button and text)
		// 	choiceButtonGroup.map((button) => { 
		// 		button.destroy()
		// 	})
		// })

		// TODO add a tween out and in animation
	}
}