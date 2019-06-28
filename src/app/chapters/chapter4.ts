import { Chapter, CharacterAction, FailureOptions, SuccessOptions } from '../models/chapter';
import { Weapon, Armor, Monster, Warrior } from '../models/characters';
import { GenderOptions, RaceOptions, ClassOptions } from '../models/character-options';
import { ChapterTwo } from './chapter2';
import { ChapterFive } from './chapter5';

export const ChapterFour: Chapter = {
    
    story: [ `With Guard Geoffrey and your pet squirrel on your team you feel unstoppable.`,
             `Using the steeds found back at the guard encampment you can now travel much farther and faster.`,
             `"WHAT THE HELL IS THAT?" says Geoffrey.`,
             `Before you have a chance to answer you're dismounted from your horse with a violent thump`,         

    ],

    options: [
        CharacterAction.attack,
    ],

    enemyParty: [
        new Monster("Troll Ogre", 22, {attack: 8, sneak: 0, persuade: 0}, {attack: 6, sneak: 55, persuade: 55}, 7, 9, "../../assets/ogre.png"),
       
    ],
    
    sneakPersuadeFail: CharacterAction.attack,
    ifFail: FailureOptions.nextChapter,
    ifSucceed: [
        SuccessOptions.rewardExperience,
        SuccessOptions.rewardEquipment,
        // SuccessOptions.addHeroToParty
    ],

    rewards: {
        experience: 750,
        equipment: [new Armor("Troll Belt", 8)],
        newHero: null,
    },

    nextChapter: ChapterFive

}