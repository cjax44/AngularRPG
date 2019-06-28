import { Chapter, CharacterAction, FailureOptions, SuccessOptions } from '../models/chapter';
import { Weapon, Armor, Monster, Warrior } from '../models/characters';
import { GenderOptions, RaceOptions, ClassOptions } from '../models/character-options';
import { ChapterTwo } from './chapter2';
import { ChapterSix } from './chapter6';

export const ChapterFive: Chapter = {
    
    story: [ `Everyone enjoys a much needed rest.`,
             ``,
             `Villagers approach and thank you for defeating the troll ogre. One of the villagers has some strange looking eyes.`,
             `They almost seem to glow yellow...`,
             `You've heard about something like this but don't remember where. Is it jaundice?`,
             `Guard Geoffrey becomes ill and violently spews vomit through the opening of his helm...`,
             `"D-d-d... Dem... DEMON" he is barely able to sputter out`,
             `Out of desperation Squeaky the Warrior attacks the villager.`,
             `"ENOUGH HIDING" yells the villager, "I grow tired of these games".`,
             `The demon attacks Squeaky.`         

    ],

    options: [
        CharacterAction.attack,
    ],

    enemyParty: [
        new Monster("Possessed Villager", 22, {attack: 8, sneak: 0, persuade: 0}, {attack: 6, sneak: 55, persuade: 55}, 7, 9, "../../assets/possessedvillager.png"),
       
    ],
    
    sneakPersuadeFail: CharacterAction.attack,
    ifFail: FailureOptions.nextChapter,
    ifSucceed: [
        SuccessOptions.rewardExperience,
        SuccessOptions.rewardEquipment,
    ],

    rewards: {
        experience: 1250,
        equipment: [new Weapon("Demon Amulet", 3, 5)],
        newHero: null,
    },

    nextChapter: ChapterSix

}