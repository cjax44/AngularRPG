import { Chapter, CharacterAction, FailureOptions, SuccessOptions } from '../models/chapter';
import { Weapon, Armor, Monster, Warrior } from '../models/characters';
import { GenderOptions, RaceOptions, ClassOptions } from '../models/character-options';
import { ChapterTwo } from './chapter2';
import { ChapterSeven } from './chapter7';

export const ChapterSix: Chapter = {
    
    story: [ `After killing the villager, a pillar of black smoke is expelled from the lifeless mouth and retreats to a nearby tree.`,
             `You feel a crackling energy surrounding the amulet that was worn by the possessed villager`,
             `Using the newfound courage and motivation, your party heads for the demon's lair to look for clues.`,
             `"Why was that thing in our forest?" asks Geoffrey.`,
             `"Squeak squeak squeeeeeak" replies Squeaky. Whatever it was doing, you know you need to head into the lair to find out.`,
             `A few smaller demons are guarding the base of the hellish tree.`         

    ],

    options: [
        CharacterAction.attack,
    ],

    enemyParty: [
        new Monster("Imp", 14, {attack: 4, sneak: 0, persuade: 0}, {attack: 5, sneak: 55, persuade: 55}, 2, 4, "../../assets/imp.png"),
        new Monster("Imp", 14, {attack: 4, sneak: 0, persuade: 0}, {attack: 5, sneak: 55, persuade: 55}, 2, 4, "../../assets/imp.png"),
        new Monster("Imp", 14, {attack: 4, sneak: 0, persuade: 0}, {attack: 5, sneak: 55, persuade: 55}, 2, 4, "../../assets/imp.png"),

    ],
    
    sneakPersuadeFail: CharacterAction.attack,
    ifFail: FailureOptions.nextChapter,
    ifSucceed: [
        SuccessOptions.rewardExperience,
        
    ],

    rewards: {
        experience: 2750,
        equipment: null,
        newHero: null,
    },

    nextChapter: ChapterSeven

}