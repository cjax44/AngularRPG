import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Hero, Weapon, Armor, Monster, Warrior, Mage, Rogue, Priest, checkRace, ExperienceToLevel } from '../models/characters';
import { Chapter, SuccessOptions } from '../models/chapter';
import { ChapterOne } from '../chapters/chapter1';
import { ClassOptions, RaceOptions, GenderOptions } from '../models/character-options';

@Injectable()
export class GameControllerService {

    mainCharacter: Hero;
    currentChapter: Chapter = ChapterOne;
    isFighting: boolean = false;

    actionDelay: number = 1500;

    heroParty: Hero[] = [];
    partyInventory: (Weapon | Armor)[] = [];
    availableHeroes: Hero[] = [];
    enemyParty: Monster[] = this.currentChapter.enemyParty;


    constructor(private router: Router) { }

    setMainCharacter(character) {

        switch(character.class) {
            case ClassOptions.warrior:
                this.mainCharacter = new Warrior(character.name, character.gender, character.race, 1, 10, {attack:0,sneak:0,persuade:0,intelligence:0}, new Weapon("Unarmed", 1, 2), new Armor("Clothes", 0))
                break;
            case ClassOptions.mage:
                this.mainCharacter = new Mage(character.name, character.gender, character.race, 1, 10, {attack:0,sneak:0,persuade:0,intelligence:0}, new Weapon("Unarmed", 1, 2), new Armor("Clothes", 0))
                break;
            case ClassOptions.rogue:
                this.mainCharacter = new Rogue(character.name, character.gender, character.race, 1, 10, {attack:0,sneak:0,persuade:0,intelligence:0}, new Weapon("Unarmed", 1, 2), new Armor("Clothes", 0))
                break;
            case ClassOptions.priest:
                this.mainCharacter = new Priest(character.name, character.gender, character.race, 1, 10, {attack:0,sneak:0,persuade:0,intelligence:0}, new Weapon("Unarmed", 1, 2), new Armor("Clothes", 0))
                break;
        }

        checkRace(this.mainCharacter);
        this.heroParty.push(this.mainCharacter);
        this.router.navigateByUrl('/story');
    }

    encounterSuccess(): string[] {

        let messages: string[] = [];
        this.currentChapter.ifSucceed.forEach(reward => {
            switch(reward) {
                case SuccessOptions.rewardExperience:
                    messages.push(`Each member of your party has gained ${this.currentChapter.rewards.experience} experience`);
                    this.heroParty.forEach(hero => {
                        hero.experience += this.currentChapter.rewards.experience;
                        if (hero.experience >= ExperienceToLevel[hero.level]) {
                            messages.push(`${hero.name} leveled up! They've earned 2 stat points. Upgrade on inventory screen.`)
                            hero.levelUp();
                        }
                    });
                    break;
                case SuccessOptions.rewardEquipment:
                    messages.push("You received the following equipment: ");
                    this.currentChapter.rewards.equipment.forEach(equipment => {
                        if (equipment instanceof Armor) {
                            messages.push(`${equipment.name} -- Defense Bonus: ${equipment.attackBarrierBonus}`);
                        } else {
                            messages.push(`${equipment.name} -- Damage Bonus: (${equipment.minDamage} - ${equipment.maxDamage})`);
                        }
                        this.partyInventory.push(equipment);
                    });
                    break;
                case SuccessOptions.addHeroToParty:
                    let newHero: Hero = this.currentChapter.rewards.newHero;
                    if (this.heroParty.length < 3) {
                        messages.push(`A new hero has joined your party! Welcome ${newHero.name}, the ${newHero.characterRole}. They are level ${newHero.level}.`);
                        this.heroParty.push(newHero);
                    } else {
                        messages.push(`A new hero is available in your inventory! Welcome ${newHero.name}, the ${newHero.characterRole}. They are level ${newHero.level}.`);
                        this.availableHeroes.push(newHero);
                    }
                    break;
            }
        })
        return messages;
    }

    nextChapter(): void {
        this.heroParty.forEach(hero => hero.rest());
        this.currentChapter = this.currentChapter.nextChapter;
        this.enemyParty = this.currentChapter.enemyParty;
    }

    gameOver(): void {
        this.mainCharacter = undefined;
        this.currentChapter = ChapterOne;
        this.heroParty = [];
        this.partyInventory = [];
        this.availableHeroes = [];
        this.enemyParty = this.currentChapter.enemyParty;

        this.router.navigateByUrl("/");
    }
}