import { Velocity } from "../components/velocity.js";
import { Entity } from "../entity.js";
import { GameManager } from "../gameManager.js";
import { Vector2 } from "../vector.js";

/** Movement speed given as a percentage of the total height per millisecond */
const PLAYER_PROJECTILE_SPEED = 0.0015;

export class Projectile extends Entity {
  constructor(posx, posy, velx, vely, isFriendly) {
    super();
    this.transform.position.x = posx;
    this.transform.position.y = posy;
    // TODO: If projectile speed of enemies is different, extract this to a parameter
    this.velocity = new Velocity(PLAYER_PROJECTILE_SPEED * GameManager.canvas.height, new Vector2(velx, vely));

    this.isFriendly = isFriendly;
    
    this.gameManager = GameManager.getInstance();
  }
  
  /** @type {Entity['update']} */
  update(elapsedTime) {
    super.update(elapsedTime);
    
    // Remove the projectile if it's off the screen
    if (
      this.transform.position.x < 0 ||
      this.transform.position.x > GameManager.canvas.width ||
      this.transform.position.y < 0 ||
      this.transform.position.y > GameManager.canvas.height
    ) {
      this.gameManager.entities.remove(this);
    }
  }

  /** @type {Entity['onCollision']} */
  onCollision(collisionType) {
    if (collisionType !== null) {
        this.gameManager.entities.remove(this);
    }
}
}