import monster_attribute from '../constant/monster_attribute.js'
import attribute_level from '../constant/attribute_level.js'
import util from '../helper/helper.js'

class Melee {
    constructor(level, animation) {
        this.level = level;
        this.animation = animation

        this.str_base = monster_attribute.m.str_base;
        this.str_grow = monster_attribute.m.str_grow;
        this.vit_base = monster_attribute.m.vit_base;
        this.vit_grow = monster_attribute.m.vit_grow;
        this.moveSpeed = monster_attribute.m.moveSpeed;
        
        this.vit = this.vit_base + (this.vit_grow * this.level)
        this.str = this.str_base + (this.str_grow * this.level)

        this.max_hp = Math.floor(this.vit * attribute_level.hp.vit )
        this.damage = Math.floor(this.str * attribute_level.damage.str)
        this.curr_hp = this.max_hp

        this.state = null
        this.object = null
    }

    getState(){
        return this.state
    }

    getMaxHP() {
        return this.max_hp
    }

    getCurrentHP() {
        return this.curr_hp
    }

    getDamage() {
        return this.damage
    }

    receiveDamage(scene, damage){
        this.state = "hited"
        setTimeout(() => {
            // if the state still not mutable by other people, then set it back to null
            if(this.state === "hited"){
                this.state = null
            }
        }, 100);

        this.curr_hp -= damage
        if(this.curr_hp < 0){
            this.curr_hp = 0
            this.dead(scene)
        }
        else{
            // TODO: play hurt animation
        }
        return this.curr_hp
    }

    getObject(){
        return this.object
    }

    getMovement(){
        return this.moveSpeed
    }

    spawn(scene){
        this.object = scene.physics.add.sprite(scene.gameWidth - 10, 245, this.animation.running.sequence[0].key)
        util.rescale(this.object, 200)
        this.object.scaleX *= -1    // flip horizontally
        this.object.setOffset( -(this.object.displayWidth * 3),0)
        this.object.enabledBody = true;
        this.object.play('melee_running')
    }

    castDamage(){
        this.object.play('melee_run_slashing')
    }

    dead(scene){
        this.state = "dead"
        this.object.play('melee_dying')

        scene.add.tween({
			targets: [this.object],
			ease: 'Sine.easeInOut',
			duration: 1000,
			delay: 0,
			alpha: {
				getStart: () => 1,
				getEnd: () => 0
			},
			onComplete: () => {
				this.object.destroy()
			}
		});
    }
}

export default Melee