/*
 * Game state
 * ============================================================================
 *
 * A sample Game state, displaying the Phaser logo.
 */
import Processor from '../objects/Processor';
import Assembler from '../objects/Assembler';
import Display from '../objects/Display';

export default class Game extends Phaser.State {

  create () {
    this.assembler = new Assembler();
    this.processor = new Processor(this.game);
    let style = { font: "16px Arial", fill: "#ff0000", align: "center" };
    this.registerDisplays = {};

    let regX = this.game.world.width - 30;
    let regY = 50;

    for (let reg of Object.keys(this.processor.registers)) {
      let register = this.processor.registers[reg];
      this.registerDisplays[reg] = {};
      this.registerDisplays[reg].label = this.game.add.text(regX - 60, regY, reg, style);
      this.registerDisplays[reg].value = this.game.add.text(regX, regY, register.toString(), style);
      this.registerDisplays[reg].label.anchor.set(0.5);
      this.registerDisplays[reg].value.anchor.set(0.5);
      regY += 16;
    }

    this.currentInstruction = {}
    this.currentInstruction.label = this.game.add.text(regX - 60, regY, 'CODE', style);
    this.currentInstruction.value = this.game.add.text(regX, regY, this.processor.currentInstruction, style);
    this.currentInstruction.label.anchor.set(0.5);
    this.currentInstruction.value.anchor.set(0.5);

    let program = this.game.cache.getText('program');
    console.log(program)
    let machineCode = this.assembler.load(program);
    console.log(machineCode)
    console.log(this.processor.symbolTable)
    this.processor.memory.setBlock(0, machineCode);
    this.processor.clock.start();
    this.setupDisplay();
  }

  setupDisplay () {
    this.display = new Display(this.game, null, 16, 16, 30, 26);
    this.display.setup(this.processor);
  }

  update () {
    for (let reg of Object.keys(this.processor.registers)) {
      let register = this.processor.registers[reg];
      this.registerDisplays[reg].value.text = register.toString();
    }
    this.currentInstruction.value.text = this.processor.currentInstruction;
  }

}
