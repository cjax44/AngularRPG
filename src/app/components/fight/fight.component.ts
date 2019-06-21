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
    if(this.freezeAction) {
      return;
    }
    if(target.isIncapacitated) {
      this.displayMessage = `That target is already incapacitated`;
    }
// add sp atk
    // if(this.currentCharacter instanceof Monster && target instanceof Hero){
      
    // }

// reg
    if(this.selectedAction === FightOptions.attack) {
      this.freezeAction = true;
      this.attack(target);

    } 
    // else if (this.currentCharacter instanceof Hero) [

    // ] 
    else {
      this.displayMessage = `Please select an action option`;
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
      this.displayMessage = `All heroes have been defeated`;
      this.showGameOverButton = true;
      this.gameControllerService.isFighting = false;
      return;
    }
    this.nextTurn();
  }

  nextTurn() {
    // spc atk stuff
    // if(this.currentCharacter instanceof Monster) {

    // }
    // if(this.currentCharacter instanceof Monster && this.currentCharacter.hasTakenPoisonDamageThisTurn) {

    // }

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
