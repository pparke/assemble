/**
 * @class Memory
 */

class Memory {
  constructor(size) {
    this.SIZE = size || 1024;
    this.WORD_SIZE = 65536;
    this.ZERO = 0x0000;
    this.data = new Array(this.size);

    this.events = {
      store:    new Phaser.Signal(),
      retrieve: new Phaser.Signal()
    };

    this.zeroMemory();
  }

  /**
   * Zero Memory
   * Sets every element of the memory array to zero.
   */
  zeroMemory () {
    for (let i = 0; i < this.SIZE; i++) {
      this.data[i] = this.ZERO;
    }
  }

  /**
   * Get High
   * Get the high byte of the memory location.
   */
  getHigh (addr) {
    // make sure that the address is within bounds
    addr = Memory.wrap(addr, this.SIZE);
    return this.data[addr] << 8;
  }

  /**
   * Set High
   * Set the high byte of the memory location.
   */
  setHigh (addr, v) {
    // make sure that the address is within bounds
    addr = Memory.wrap(addr, this.SIZE);
    this.data[addr] = (this.data[addr] | 0xFF00) & (v | 0x00FF);
  }

  /**
   * Get Low
   * Get the low byte of the memory location.
   */
  getLow (addr) {
    // make sure that the address is within bounds
    addr = Memory.wrap(addr, this.SIZE);
    return this.data[addr] & 0x00FF;
  }

  /**
   * Set Low
   * Set the low byte of the memory location.
   */
  setLow (addr, v) {
    // make sure that the address is within bounds
    addr = Memory.wrap(addr, this.SIZE);
    this.data[addr] = (this.data[addr] | 0x00FF) & (v | 0xFF00);
  }

  /**
   * Get Word
   * Get the full word at the memory location.
   */
  getWord (addr) {
    // make sure that the address is within bounds
    addr = Memory.wrap(addr, this.SIZE);
    // publish a retrieve event
    this.events.retrieve.dispatch(addr, this.data[addr], 16 );
    return this.data[addr];
  }

  /**
   * Set Word
   * Set the full word at the memory location.
   */
  setWord (addr, value) {
    // make sure that the address is within bounds
    addr = Memory.wrap(addr, this.SIZE);
    value = Memory.wrap(value, this.WORD_SIZE);
    // publish a store event
    this.events.store.dispatch(addr, value, 16);
    this.data[addr] = value;
  }

  /**
   * Set Block
   * Write a block of data to memory beginning at a given address.
   * @param {number} start - the address to start writing at
   * @param {array} data - the data to write
   */
  setBlock (start, data) {
    let addr = Memory.wrap(start, this.SIZE);
    data.forEach((elem) => {
      this.data[addr] = Memory.wrap(elem, this.WORD_SIZE);
      addr += 1;
      if (addr >= this.SIZE) {
        addr = Memory.wrap(addr, this.SIZE);
      }
    });
  }

  /**
   * Wrap
   * Wraps an input integer based on a target size.
   */
  static wrap (input, target) {
    if (input >= target) {
      input -= target;
      return Memory.wrap(input, target);
    }
    else if (input < 0) {
      input += target;
      return Memory.wrap(input, target);
    }
    else {
      return input;
    }
  }
}

export default Memory;
