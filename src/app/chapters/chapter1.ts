import { Chapter, CharacterAction, FailureOptions, SuccessOptions } from '../models/chapter';
import { Weapon, Armor, Monster, Warrior } from '../models/characters';
import { GenderOptions, RaceOptions, ClassOptions } from '../models/character-options';
import { ChapterTwo } from './chapter2';

export const ChapterOne: Chapter = {
    
    story: [ `You walk into the vibrant forest. Where did this massive hangover come from?`,
            ` `,
            `A rabid band of squirrels attacks, how do you choose to proceed?`,         

    ],

    options: [
        CharacterAction.attack,
        CharacterAction.sneak,
        CharacterAction.persuade
    ],

    enemyParty: [
        new Monster("Squirrel", 5, {attack: 2, sneak: 0, persuade: 0}, {attack: 4, sneak: 1, persuade: 20}, 1, 3, "../../assets/squirrel.png")
    ],
    
    sneakPersuadeFail: CharacterAction.attack,
    ifFail: FailureOptions.nextChapter,
    ifSucceed: [
        SuccessOptions.rewardExperience,
        SuccessOptions.rewardEquipment,
        SuccessOptions.addHeroToParty
    ],

    rewards: {
        experience: 500,
        equipment: [new Weapon("Stick", 1, 3)],
        newHero: new Warrior("Johnny", GenderOptions.male, RaceOptions.human, 1, 10, {attack:2, sneak:1, persuade:1, intelligence: 1}, new Weapon("Sword", 1, 4), new Armor("Clothes", 0))
    },

    nextChapter: ChapterTwo

}