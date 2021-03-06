export enum RaceOptions {
    human = "Human",
    dwarf = "Dwarf",
    elf ="Elf",
    orc = "Orc",
    squirrel = "Squirrel"

}

export enum ClassOptions {
    warrior = "Warrior",
    mage = "Mage",
    rogue = "Rogue",
    priest = "Priest",
    critter = "Critter"

}

export enum GenderOptions {
    male = "Male",
    female = "Female"

}

export const CharacterOptions = {
    races: [
        RaceOptions.human,
        RaceOptions.dwarf,
        RaceOptions.elf,
        RaceOptions.orc,
        
        
    ],
    classes: [
        ClassOptions.mage,
        ClassOptions.priest,
        ClassOptions.rogue,
        ClassOptions.warrior
    ] ,
    genders: [
        GenderOptions.male,
        GenderOptions.female
    ]
}