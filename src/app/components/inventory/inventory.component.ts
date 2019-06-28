import { Component, OnInit } from '@angular/core';
import { GameControllerService } from '../../services/game-controller.service'
import { Hero, Weapon, Armor, CharacterSkills, ExperienceToLevel } from '../../models/characters'

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  inventoryIsOpen: boolean = false;

  _characterSkills: typeof CharacterSkills = CharacterSkills;
  heroParty: Hero[] = this.gameSvc.heroParty;
  mainCharacter: Hero = this.gameSvc.mainCharacter;
  availableHeroes: Hero[] = this.gameSvc.availableHeroes;
  inventory: (Weapon|Armor)[] = this.gameSvc.partyInventory;
  _experienceToLevel: typeof ExperienceToLevel = ExperienceToLevel;

  selectedHero: Hero = this.heroParty[0];
  showAvailableHeroesScreen: boolean = false;
  isFighting: boolean = this.gameSvc.isFighting;

  constructor(private gameSvc: GameControllerService) { }

  ngOnInit() {
  }

  openInventory() {
    this.inventoryIsOpen = true;
    this.heroParty = this.gameSvc.heroParty;
    this.availableHeroes = this.gameSvc.availableHeroes;
    this.inventory = this.gameSvc.partyInventory;
    this.selectedHero = this.heroParty[0];
    this.showAvailableHeroesScreen = false;
    this.isFighting = this.gameSvc.isFighting;
  }

  closeInventory() {
    this.inventoryIsOpen = false;
  }

  setSelectedHero(newHero: Hero) {
    this.showAvailableHeroesScreen = false;
    if (this.selectedHero !== newHero)
      this.selectedHero = newHero;
  }

  improveSkill(skill: CharacterSkills) {
    this.selectedHero.skills[skill]++;
    this.selectedHero.availableSkillPoints--;
  }

  equipItem(item: Weapon|Armor) {
    if (item instanceof Weapon) {
      this.inventory.push(this.selectedHero.equippedWeapon);
      this.selectedHero.equipNewWeapon(item);
    } else if (item instanceof Armor) {
      this.inventory.push(this.selectedHero.equippedArmor);
      this.selectedHero.equipNewArmor(item);
    }
    this.inventory.splice(this.inventory.indexOf(item), 1);
  }

  removeCharacterFromParty() {
    this.availableHeroes.push(this.selectedHero);
    this.heroParty.splice(this.heroParty.indexOf(this.selectedHero), 1);
    this.selectedHero = this.mainCharacter;
  }

  showAvailableHeroes() {
    this.selectedHero = undefined;
    this.showAvailableHeroesScreen = true;
  }

  addHeroToParty(hero: Hero) {
    this.heroParty.push(hero);
    this.heroParty.splice(this.availableHeroes.indexOf(hero), 1);
    this.setSelectedHero(hero);
  }
}
