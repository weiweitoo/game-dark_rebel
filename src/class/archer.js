import monster_attribute from '../constant/monster_attribute.js'
import attribute_level from '../constant/attribute_level.js'
import util from '../helper/helper.js'

class Archer {
    constructor(level, animation) {
        this.level = level;
        this.animation = animation

        this.str_base = monster_attribute.a.str_base;
        this.str_grow = monster_attribute.a.str_grow;
        this.vit_base = monster_attribute.a.vit_base;
        this.vit_grow = monster_attribute.a.vit_grow;
        this.moveSpeed = monster_attribute.a.moveSpeed;
        
        this.vit = this.vit_base + (this.vit_grow * this.level)
        this.str = this.str_base + (this.str_grow * this.level)

        this.max_hp = this.vit * attribute_level.hp.vit
        this.damage = this.str * attribute_level.damage.str
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
        return this.hp
    }

    getDamage() {
        return this.damage
    }

    receiveDamage(damage){
        this.state = "hited"
        setTimeout(() => {
            this.state = null
        }, 100);

        this.curr_hp -= damage
        if(this.curr_hp < 0){
            this.curr_hp = 0
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
        this.object.enabledBody = true;
        this.object.setOffset( -(this.object.displayWidth * 3),0)
        this.object.play('archer_running')
    }
}

export default Archer