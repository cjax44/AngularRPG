import { Chapter, CharacterAction, FailureOptions, SuccessOptions } from '../models/chapter';
import { Weapon, Armor, Monster, Warrior } from '../models/characters';
import { GenderOptions, RaceOptions, ClassOptions } from '../models/character-options';
import { ChapterTwo } from './chapter2';
import { ChapterFour } from './chapter4';

export const ChapterThree: Chapter = {
    
    story: [ `After making it by the wolf you come upon a small camp.`,
             `No sneaking by this one though, they're already aware of your presence. They seem nice, maybe a conversation can be had.`,
             `Three of the armed guards approach you, how do you proceed?`,         

    ],

    options: [
        CharacterAction.attack,
        CharacterAction.persuade
    ],

    enemyParty: [
        new Monster("Guard Thomas", 12, {attack: 5, sneak: 0, persuade: 0}, {attack: 5, sneak: 11, persuade: 1}, 5, 8, "../../assets/guardthomas.png"),
        new Monster("Guard Geoffrey", 11, {attack: 5, sneak: 0, persuade: 0}, {attack: 5, sneak: 11, persuade: 1}, 5, 8, "../../assets/guardgeoffrey.png")
    ],
    
    sneakPersuadeFail: CharacterAction.attack,
    ifFail: FailureOptions.nextChapter,
    ifSucceed: [
        SuccessOptions.rewardExperience,
        SuccessOptions.rewardEquipment,
        SuccessOptions.addHeroToParty
    ],

    rewards: {
        experience: 250,
        equipment: [new Weapon("Thomas's Axe", 3, 5)],
        newHero: new Warrior("Guard Geoffrey", GenderOptions.male, RaceOptions.human, 2, 11, {attack:3, sneak:1, persuade:2, intelligence: 0}, new Weapon("Unarmed", 1, 2), new Armor("Guard Armor", 3))
    },

    nextChapter: ChapterFour

}