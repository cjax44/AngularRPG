import { Chapter, CharacterAction, FailureOptions, SuccessOptions } from '../models/chapter';
import { Weapon, Armor, Monster, Warrior } from '../models/characters';
import { GenderOptions, RaceOptions, ClassOptions } from '../models/character-options';

export const ChapterTwo: Chapter = {
    
    story: [ `You stumble upon a sleeping wolf...`,
            ` `,
            `It looks way too strong to fight right now. Maybe try sneaking?`,         

    ],

    options: [
        CharacterAction.attack,
        CharacterAction.sneak,
        CharacterAction.persuade
    ],

    enemyParty: [
        new Monster("Sleeping Wolf", 5, {attack: 2, sneak: 0, persuade: 0}, {attack: 5, sneak: 0, persuade: 20}, 1, 3, "../../assets/sleepingwolf.png")
    ],
    
    sneakPersuadeFail: CharacterAction.attack,
    ifFail: FailureOptions.nextChapter,
    ifSucceed: [
        SuccessOptions.rewardExperience,
        SuccessOptions.rewardEquipment,
        // SuccessOptions.addHeroToParty
    ],

    rewards: {
        experience: 250,
        equipment: [new Armor("Helmet", 2)],
        newHero: null,
    },

    nextChapter: null

}