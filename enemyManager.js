import { Enemy } from './entities/enemy.js';
import { GameManager } from './gameManager.js';
import { lerp } from './mathFuncs.js';
import { Vector2 } from './vector.js';

const enemyLayout = [
  '...xxxx...',
  '.xxxxxxxx.',
  '.xxxxxxxx.',
  'xxxxxxxxxx',
  'xxxxxxxxxx'
]; // Describes the enemy formation layout where 'x' represents an enemy and '.' represents an empty space

const enemyType = [
  // TODO: Fill this in later
] // Describes the enemy type for each row of the formation

const FORMATION_MOVEMENT_TIME = 3000; // How long it takes for the formation to move between two positions
const ENEMY_SPRITE_SIZE = 64; // TODO: Get this from whatever constant defines the sprite size
const FORMATION_HORIZONTAL_MOVEMENT = ENEMY_SPRITE_SIZE * 4;

export class EnemyManager {
  constructor() {
    /** @type {Array<number>} */
    this.enemies = [];
    /** @type {Map<number, Vector2>} */
    this.baseFormationPositions = new Map();
    /** @type {Map<number, Vector2>} */
    this.destFormationPositions = new Map();
    /**_@type {Map<number, Vector2>} */
    this.spreadFormationPositions = new Map();
  }
  
  initialize() {
    this.enemies.length = 0;
    this.baseFormationPositions.clear();
    this.destFormationPositions.clear();
    this.elapsedMovementTime = 0;
    this.formationMovementTime = FORMATION_MOVEMENT_TIME; // How long it takes for the formation to move between two positions
    this.cyclesUntilFormationSwitch = Infinity;

    this.spawnEnemies();
    setTimeout(() => this.startTransitionToCenterFormation(), 1000);
  }
  
  spawnEnemies() {
    const positions = [];
    for (let y = 0; y < enemyLayout.length; y++) {
      for (let x = 0; x < enemyLayout[y].length; x++) {
        if (enemyLayout[y][x] === 'x') {
          const spriteX = x * ENEMY_SPRITE_SIZE;
          const spriteY = y * ENEMY_SPRITE_SIZE + ENEMY_SPRITE_SIZE;
          positions.push(new Vector2(spriteX, spriteY));
        }
      }
    }
    
    const deregisterEnemy = (entityId) => {
      const index = this.enemies.indexOf(entityId);
      if (index !== -1) {
        this.enemies.splice(index, 1);
        this.baseFormationPositions.delete(entityId);
        this.destFormationPositions.delete(entityId);
        this.spreadFormationPositions.delete(entityId);
      }
    };
    
    const gameManager = GameManager.getInstance();
    for (let i = 0; i < positions.length; i++) {
      const enemy = new Enemy(positions[i]);
      this.enemies.push(enemy.id);
      this.baseFormationPositions.set(enemy.id, positions[i]);
      this.destFormationPositions.set(enemy.id, positions[i].add(new Vector2(FORMATION_HORIZONTAL_MOVEMENT, 0)));
      enemy.once('destroyed', deregisterEnemy);
      gameManager.entities.add(enemy);
    }
  }
  
  /** 
   * When called, this will set the new destination formation positions to be the spread
   * formation and the current formation at the time of the call will be set to the base formation
   * position.
   */
  switchToSpreadFormation() {
    const gameManager = GameManager.getInstance();
    for (let i = 0; i < this.enemies.length; i++) {
      /** @type {Enemy} */
      const enemy = gameManager.entities.get(this.enemies[i]);
      const newBasePosition = enemy.formationPosition;
      this.baseFormationPositions.set(enemy.id, newBasePosition);
    }
    
    this.destFormationPositions = this.spreadFormationPositions;
  }
  
  startTransitionToCenterFormation() {
    const movementCyclePercentage = this.elapsedMovementTime / this.formationMovementTime;
    this.formationMovementTime /= 2;
    const gameManager = GameManager.getInstance();
    
    /** @type {Map<number, Vector2>} */
    const centerPositions = new Map();
    for (let i = 0; i < this.enemies.length; i++) {
      /** @type {Enemy} */
      const enemy = gameManager.entities.get(this.enemies[i]);
      const centerPosition = lerp(this.baseFormationPositions.get(enemy.id), this.destFormationPositions.get(enemy.id), 0.5);
      if (movementCyclePercentage === 0.5) {
        // Snap to center position since we are there (give or take a little floating point error)
        enemy.formationPosition = centerPosition;
      } else {
        centerPositions.set(enemy.id, centerPosition);
      }
    }

    if (movementCyclePercentage > 0.5) {
      this.elapsedMovementTime -= this.formationMovementTime;
      this.baseFormationPositions = centerPositions;
      this.cyclesUntilFormationSwitch = 1;
    } else if (movementCyclePercentage < 0.5) {
      this.destFormationPositions = centerPositions;
      this.cyclesUntilFormationSwitch = 0;
    } else {
      // Activate next formation layout since we don't need
      // to wait for the enemies to move into the proper position.
      // They are alraedy there due to snapping done above.
      this.switchToSpreadFormation();  
    }
  }

  /** @type {number} */
  update(elapsedTime) {
    const gameManager = GameManager.getInstance();
    
    // Reverse the direction of the formation every FORMATION_MOVEMENT_TIME
    this.elapsedMovementTime += elapsedTime;
    if (this.elapsedMovementTime >= this.formationMovementTime) {
      if (this.cyclesUntilFormationSwitch === 0) {
        this.switchToSpreadFormation();
        this.cyclesUntilFormationSwitch = Infinity;
      } else {
        this.elapsedMovementTime -= this.formationMovementTime;
        const temp = this.baseFormationPositions;
        this.baseFormationPositions = this.destFormationPositions;
        this.destFormationPositions = temp;
        this.cyclesUntilFormationSwitch--;
      }
    }

    for (let i = 0; i < this.enemies.length; i++) {
      /** @type {Enemy} */
      const enemy = gameManager.entities.get(this.enemies[i]);
      if (!enemy) {
        continue;
      }
      
      const basePosition = this.baseFormationPositions.get(enemy.id);
      const destPosition = this.destFormationPositions.get(enemy.id);
      enemy.formationPosition = lerp(basePosition, destPosition, this.elapsedMovementTime / this.formationMovementTime);
    }
  }
}