import { Component, OnInit } from '@angular/core';
import { GameControllerService } from '../../services/game-controller.service';
import { Router } from '@angular/router';
import { Hero, Monster, BaseCharacter, FightOptions, Warrior, Mage, Rogue, Priest } from '../../models/characters';

enum Teams {
  heroes,
  enemies,
  none
}

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.css']
})
export class FightComponent implements OnInit {
 

  heroTurn: boolean = true;
  actionDelay: number = this.gameControllerService.actionDelay;
  turnsBetweenSpecial: number = 2;
  characterIndex: number = 0;
  freezeAction: boolean = false;

  heroParty: Hero[] = this.gameControllerService.heroParty;
  heroesIncapacitated: number = 0;
  enemyParty: Monster[] = this.gameControllerService.enemyParty;
  enemiesIncapacitated: number = 0;

  currentCharacter: BaseCharacter = this.heroParty[this.characterIndex];
  _fightOptions: typeof FightOptions = FightOptions;
  _teams: typeof Teams = Teams;
  selectedAction: FightOptions = FightOptions.none;
  availableTargets: Teams = Teams.none;
  selectedTargets: BaseCharacter[] = [];

  displayMessage: string = `${this.currentCharacter.name}'s turn.`;
  successMessages: string[] = [];
  showNextChapterButton: boolean = false;
  showGameOverButton: boolean = false;


  constructor(private gameControllerService: GameControllerService, private router: Router) { }

  ngOnInit() {
  }

  selectOption(selectedOption: FightOptions) {

    if (this.freezeAction && this.heroTurn) {
      return;
    }
    this.selectedAction = selectedOption;
    this.selectedTargets = [];

    if (this.selectedAction === FightOptions.attack) {
      this.availableTargets = Teams.enemies;
      this.displayMessage = "Select a target for your attack.";
    } else if (this.selectedAction === FightOptions.specialAttack 
              && this.currentCharacter instanceof Hero 
              && this.currentCharacter.level < 3) {
                  this.displayMessage = "Special attacks unlock once you're level 3";
    } else if (this.selectedAction === FightOptions.specialAttack 
              && this.currentCharacter instanceof Hero 
              && this.currentCharacter.level > 2) {
                if (this.currentCharacter.turnsUntilSpecialAvailableAgain) {
                  this.displayMessage = `Cannot use special yet. ${this.currentCharacter.turnsUntilSpecialAvailableAgain} turns remain until you can use it.`
                } else {
                  if (this.currentCharacter instanceof Warrior) {
                    this.availableTargets = Teams.enemies;
                    this.displayMessage = `Cleave two enemies at once with a higher chance to miss. Above hero level 6, your chance to hit is normal. Both attacks can land on the same enemy if there is only one enemy.`

                  }
                  if (this.currentCharacter instanceof Mage) {
                    this.availableTargets = Teams.heroes;
                    this.displayMessage = `Place a ward on one of your heroes. The ward will prevent damage and the enemy will be incapacitated for a turn. Above hero level 6, the ward will deal 8 damage.`
                  }
                  if (this.currentCharacter instanceof Rogue) {
                    this.availableTargets = Teams.enemies;
                    this.displayMessage = `Poison the enemy (stacking up to 2 times, multiplying the damage). Poison does up to 3 damage per stack. Above hero levle 6 the poison does up to 6 damage per stack.`

                  }
                  if (this.currentCharacter instanceof Priest) {
                    this.availableTargets = Teams.heroes;
                    this.displayMessage = `Emit a pulse of radiant light, healing a hero for up to 4 (+intelligence points) health points. Above hero level 6, radiate a second pulse of light.`
                  }
                }
    }

  }

  tryAttack(target: BaseCharacter) {
    if(this.freezeAction && this.heroTurn) {
      return;
    }
    if(target.isIncapacitated) {
      this.displayMessage = `That target is already incapacitated`;
    }
// sp atk
    if(this.currentCharacter instanceof Monster && target instanceof Hero){
      if(target.hasTrapDefense) {
        this.currentCharacter.isTrapped = true;

        if(target.hasDamagingTrap) {
          let damage = Math.floor(Math.random() * 8) + 1;
          this.currentCharacter.currentHealth -= damage;
          this.displayMessage = `${target.name} was protected by a mage ward. ${this.currentCharacter.name} was shocked by the ward and took ${damage} damage.`
          if(this.currentCharacter.currentHealth <= 0) {
            this.currentCharacter.isIncapacitated = true;
            this.enemiesIncapacitated++;
          }
        } else {
          this.displayMessage = `${target.name} was protected by a ward. ${this.currentCharacter.name} is stunned.`
        }

        target.hasTrapDefense = false;
        target.hasDamagingTrap = false;
        setTimeout(() => {
          this.checkIfWin();
        }, this.actionDelay);
        return;
      }
      
    }

    if(this.selectedAction === FightOptions.attack) {
      this.freezeAction = true;
      this.attack(target);
      
    } else if (this.currentCharacter instanceof Hero 
              && this.currentCharacter.level >2 
              && this.selectedAction === FightOptions.specialAttack) {
        const upgraded: boolean = this.currentCharacter.level > 5;

        if (this.currentCharacter instanceof Warrior) {
          this.warriorSpecialAttack(target, upgraded);
        }
        if (this.currentCharacter instanceof Mage) {
          this.mageSpecialAttack(target, upgraded);
        }
        if (this.currentCharacter instanceof Rogue) {
          this.rogueSpecialAttack(target, upgraded);
        }
        if (this.currentCharacter instanceof Priest) {
          this.priestSpecialAttack(target, upgraded);
        }

      } else {
        this.displayMessage = `Please select an action option.`;
      }

// reg
    // if(this.selectedAction === FightOptions.attack) {
    //   this.freezeAction = true;
    //   this.attack(target);

    // } 
    // else if (this.currentCharacter instanceof Hero) [

    // ] 
    // else {
    //   this.displayMessage = `Please select an action option`;
    // }
  }

  warriorSpecialAttack(target: BaseCharacter, upgraded: boolean) {
    if(!(target instanceof Monster)) {
      this.displayMessage = `Only enemies can be targeted by a warrior's special attack`;
      return;
    }

    this.selectedTargets.push(target);

    if(this.selectedTargets.length < 2) {
      this.displayMessage = `Select a second target for your warrior's cleave attack!`
    } else if (this.currentCharacter instanceof Hero) {
      this.freezeAction = true;
      this.currentCharacter.turnsUntilSpecialAvailableAgain = this.turnsBetweenSpecial;
      let doubleAttackPenalty = upgraded ? 0 : 3;
      let firstTarget: BaseCharacter = this.selectedTargets[0];
      let secondTarget: BaseCharacter = this.selectedTargets[1];

      if(this.currentCharacter.attack() - doubleAttackPenalty >= firstTarget.barriers.attack) {
        let damage = this.currentCharacter.dealDamage();
        firstTarget.currentHealth -= damage;
        this.displayMessage = `${this.currentCharacter.name} hit ${firstTarget.name} dealing ${damage} damage.`;
        if (firstTarget.currentHealth <= 0) {
          firstTarget.isIncapacitated = true;
          this.enemiesIncapacitated++;
        }
      } else {
        this.displayMessage = `${this.currentCharacter.name} missed.`
      }

      setTimeout(() => {
        if(this.currentCharacter.attack() - doubleAttackPenalty >= secondTarget.barriers.attack) {
        let damage = this.currentCharacter.dealDamage();
        secondTarget.currentHealth -= damage;
        this.displayMessage = `${this.currentCharacter.name} hit ${secondTarget.name} dealing ${damage} damage.`;
        if (secondTarget.currentHealth <= 0) {
          secondTarget.isIncapacitated = true;
          this.enemiesIncapacitated++;
        }
      } else {
        this.displayMessage = `${this.currentCharacter.name} missed.`
      }

      setTimeout(() => {
        this.selectedTargets = [];
        this.checkIfWin();
      }, this.actionDelay);
    }, this.actionDelay);
    } 
  }

  mageSpecialAttack(target: BaseCharacter, upgraded: boolean) {
    if (!(target instanceof Hero)) {
      this.displayMessage = `Only a hero can be targeted with a magic ward.`
      return;
    }

    if (target.hasTrapDefense) {
      this.displayMessage = `Target already has a ward in place`
      return;
    }
    this.freezeAction = true;
    if (this.currentCharacter instanceof Hero) {
      this.currentCharacter.turnsUntilSpecialAvailableAgain = this.turnsBetweenSpecial;

    }

    this.displayMessage = `${this.currentCharacter.name} has placed a magic ward to protect ${target.name}`;
    target.hasTrapDefense = true;
    target.hasDamagingTrap = upgraded;
    setTimeout(() => {
      this.nextTurn();
    }, this.actionDelay);
    
  }

  rogueSpecialAttack(target: BaseCharacter, upgraded: boolean) {
    if(!(target instanceof Monster)) {
      this.displayMessage = `You can only poison an enemy`;
      return;
    }

    this.freezeAction = true;

    if(this.currentCharacter instanceof Hero) {
      this.currentCharacter.turnsUntilSpecialAvailableAgain = this.turnsBetweenSpecial;
    }

    target.isStrongPoison = upgraded;
    target.poisonStacks++;
    this.displayMessage = `${target.name} was poisoned. (${target.poisonStacks}) stacks`;
    setTimeout(() => {
      this.nextTurn();
    }, this.actionDelay);
  }

  priestSpecialAttack(target: BaseCharacter, upgraded: boolean) {
    if(!(target instanceof Hero)) {
      this.displayMessage = `You must target an ally to heal`;
      return;
    }

    if(upgraded) {
      this.selectedTargets.push(target);

      if(this.selectedTargets.length <2) {
        this.displayMessage = `Select a second target to heal`;
        return;
      }
      this.freezeAction = true;
      if (this.currentCharacter instanceof Hero) {
        this.currentCharacter.turnsUntilSpecialAvailableAgain = this.turnsBetweenSpecial;

        let heal1 = Math.floor(Math.random() * 4) + 1 + this.currentCharacter.skills.intelligence;
        let heal2 = Math.floor(Math.random() * 4) + 1 + this.currentCharacter.skills.intelligence;
        let target1 = this.selectedTargets[0];
        let target2 = this.selectedTargets[1];

        target1.currentHealth = target1.currentHealth + heal1 > target1.maxHealth ? target1.maxHealth : target1.currentHealth + heal1;
        this.displayMessage = `${target1.name} has been healed for ${heal1} health`;

        setTimeout(() => {
          target2.currentHealth = target2.currentHealth + heal2 > target2.maxHealth ? target2.maxHealth : target2.currentHealth + heal2;
          this.displayMessage = `${target2.name} has been healed for ${heal2} health`;
          this.selectedTargets = [];
          setTimeout(() => {
            this.nextTurn();
          }, this.actionDelay);
        }, this.actionDelay);
      }
    } else {
      this.freezeAction = true;
      if (this.currentCharacter instanceof Hero) {
        this.currentCharacter.turnsUntilSpecialAvailableAgain = this.turnsBetweenSpecial;
      }
      let healing = Math.floor(Math.random() * 4) + 1 + this.currentCharacter.skills.intelligence;
      target.currentHealth = target.currentHealth + healing > target.maxHealth ? target.maxHealth : target.currentHealth + healing;
      this.displayMessage = `${target.name} was healed for ${healing} health`;
      setTimeout(() => {
        this.nextTurn();
      }, this.actionDelay);
    }
  }



  attack(target: BaseCharacter) {
    this.availableTargets = Teams.none;
    if(this.currentCharacter.attack() >= target.barriers.attack) {
      let damage = this.currentCharacter.dealDamage();
      target.currentHealth -= damage;
      this.displayMessage = `${this.currentCharacter.name} hit ${target.name} for ${damage} damage.`;
      setTimeout(() => {
        if(target.currentHealth <= 0) {
          target.isIncapacitated = true;
          this.heroTurn ? this.enemiesIncapacitated++ : this.heroesIncapacitated++;
          this.checkIfWin();
        } else {
          this.nextTurn();
        }
      }, this.actionDelay);
    } else {
      this.displayMessage = `${this.currentCharacter.name} missed.`;
      setTimeout(() => {
        this.nextTurn();
      }, this.actionDelay);
    }
  }

  checkIfWin() {
    this.selectedAction = FightOptions.none;
    if(this.enemiesIncapacitated === this.enemyParty.length) {
      this.displayMessage = `All enemies are defeated.`
      this.successMessages = this.gameControllerService.encounterSuccess();
      this.showNextChapterButton = true;
      this.gameControllerService.isFighting = false;
      return; 
    }
    if (this.heroesIncapacitated === this.heroParty.length) {
      this.displayMessage = `All heroes have been defeated.`;
      this.showGameOverButton = true;
      this.gameControllerService.isFighting = false;
      return;
    }
    this.nextTurn();
  }

  nextTurn() {
    //sp atk
    if(this.currentCharacter instanceof Monster
        && this.currentCharacter.poisonStacks
        && !this.currentCharacter.hasTakenPoisonDamageThisTurn) {

          this.currentCharacter.hasTakenPoisonDamageThisTurn = true;
          let maxDamage = this.currentCharacter.isStrongPoison ? 6 : 3;
          let poisonDamage = (Math.floor(Math.random() * maxDamage) + 1) * this.currentCharacter.poisonStacks;
          this.currentCharacter.currentHealth -= poisonDamage;
          this.displayMessage = `${this.currentCharacter.name} took ${poisonDamage} poison damage.`
          if (this.currentCharacter.currentHealth <= 0) {
            this.currentCharacter.isIncapacitated = true;
            this.enemiesIncapacitated++;
          }
          setTimeout(() => {
            this.checkIfWin();
          }, this.actionDelay);
          return;
    }
    if(this.currentCharacter instanceof Monster && this.currentCharacter.hasTakenPoisonDamageThisTurn) {
      this.currentCharacter.hasTakenPoisonDamageThisTurn = false;
    }

    this.availableTargets = Teams.none;
    this.selectedAction = FightOptions.none;
    this.characterIndex++;
    let nextCharacter;

    if(this.heroTurn) {
      nextCharacter = this.heroParty[this.characterIndex];
    } else {
      nextCharacter = this.enemyParty[this.characterIndex];
    }

    if(nextCharacter) {
      if(!nextCharacter.isIncapacitated) {
        this.currentCharacter = nextCharacter;
        this.displayMessage = `It is ${this.currentCharacter.name}'s turn.`
        if (this.currentCharacter instanceof Hero) {
          this.freezeAction = false;
            if (this.currentCharacter.turnsUntilSpecialAvailableAgain) {
              this.currentCharacter.turnsUntilSpecialAvailableAgain--;
            }
        } else {
          setTimeout(() => {
            this.takeEnemyTurn();
          }, this.actionDelay);
        }

      } else {
        this.nextTurn();
      }
    } else {
      this.heroTurn = !this.heroTurn;
      this.characterIndex = -1;
      this.nextTurn();
    }


  }

  takeEnemyTurn() {
    if(this.currentCharacter instanceof Monster && this.currentCharacter.isTrapped){
      this.currentCharacter.isTrapped = false;
      this.displayMessage = `${this.currentCharacter.name} recovers from the magic ward.`
      setTimeout(() => {
          this.nextTurn();
      }, this.actionDelay);
    } else {
      let target: Hero;
      this.selectedAction = FightOptions.attack;

      while(!target) {
        let randomTargetIndex = Math.floor(Math.random() * this.heroParty.length);
        let potentialTarget = this.heroParty[randomTargetIndex];
        if(!potentialTarget.isIncapacitated) {
          target = potentialTarget;
        }
      }
      this.displayMessage = `${this.currentCharacter.name} attacks ${target.name}.`

      setTimeout(() => {
        this.tryAttack(target);
      }, this.actionDelay);
    }
  }

  nextChapter() {
    this.gameControllerService.nextChapter();
    this.router.navigateByUrl("/story");
  }

  gameOver() {
    this.gameControllerService.gameOver();

  }

}
