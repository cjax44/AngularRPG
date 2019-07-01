import { Chapter, CharacterAction, FailureOptions, SuccessOptions } from '../models/chapter';
import { Weapon, Armor, Monster, Warrior } from '../models/characters';
import { GenderOptions, RaceOptions, ClassOptions } from '../models/character-options';

export const ChapterSeven: Chapter = {
    
    story: [ `The demon has been cornered!`,
             `Send it back to the hell it came from.`         

    ],

    options: [
        CharacterAction.attack,
    ],

    enemyParty: [
        new Monster("Demon", 30, {attack: 5, sneak: 0, persuade: 0}, {attack: 2, sneak: 55, persuade: 55}, 6, 12, "../../assets/demon.png"),
        
    ],
    
    sneakPersuadeFail: CharacterAction.attack,
    ifFail: FailureOptions.nextChapter,
    ifSucceed: [
        SuccessOptions.rewardExperience,
        
    ],

    rewards: {
        experience: 3750,
        equipment: null,
        newHero: null,
    },

    nextChapter: null

}