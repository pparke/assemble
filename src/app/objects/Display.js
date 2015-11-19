/*
 * Display
 * @extends Phaser.Tilemap
 */

class Display extends Phaser.Tilemap {
  constructor (game, ... args) {
    super(game, ... args);

    this.processor  = null;
    this.memory     = null;
    this.pointers   = {};
    let blocks      = this.create('blocks', this.width, this.height, this.tileWidth, this.tileHeight);

    blocks.resizeWorld();
    this.addTilesetImage('blocks');
  }

  /**
   * Setup
   * Perform necessary setup of the display.
   */
  setup (processor) {
    this.processor = processor;
    this.memory = processor.memory;
    // call the setBlock method when the memory stores a new value
    this.memory.events.store.add(this.setBlock, this);
    // call the move pointer method when the processor begins a new step
    this.processor.events.step.add(this.movePointer, this);
    this.drawMemory();
    let ipPos = this.addressToGrid(this.processor.IP);
    this.pointers.IP = this.game.add.sprite(ipPos.x, ipPos.y, 'pointers', 'yellow');
    let spPos = this.addressToGrid(this.processor.SP);
    this.pointers.SP = this.game.add.sprite(spPos.x, spPos.y, 'pointers', 'cyan');
  }

  /**
   *  Set Memory
   *  Redraws the entire memory field setting each block.
   */
  drawMemory () {
    this.memory.data.forEach((block, i) => {
      let y = Math.floor(i / this.width);
      let x = i % this.width;
      this.putTile(block, x, y, 'blocks');
    });
  }

  /**
   * Set Block
   * Sets the tile on a particular block or section of blocks
   */
  setBlock (start, data) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    data.forEach((block, i) => {
      let offset = i + start;
      let y = Math.floor(offset / this.width);
      let x = offset % this.width;
      this.putTile(block, x, y, 'blocks');
    });
  }

  /**
   * Move Pointer
   * Moves the specified pointer to the given location in memory
   */
  movePointer (key, addr) {
    let pos = this.addressToGrid(addr);
    let pointer = this.pointers[key];
    if (pointer) {
      pointer.position.x = pos.x;
      pointer.position.y = pos.y;
    }
  }

  addressToGrid (addr) {
    let position = new Phaser.Point();
    position.y = Math.floor(addr / this.width) * 16;
    position.x = (addr % this.width) * 16;
    return position;
  }

}


export default Display;
