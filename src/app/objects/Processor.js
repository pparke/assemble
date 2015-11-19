/**
 * @class Processor
 * Interprets the instructions contained in the program.
 */
 import Register from './Register';
 import InstructionSet from './InstructionSet';
 import Memory from './Memory';

 class Processor {
   constructor (game, ... args) {
     this.game                = game;
     this.MEMORY_SIZE         = 1024;
     this.memory              = new Memory(this.MEMORY_SIZE);
     this.clockSpeed          = 1000;
     this.clock               = this.game.time.create(false);
     this.currentInstruction  = '';
     this.CPZSO               = [ 0, 2, 6, 7, 11 ];
     this.T                   = 8;
     this.IP                  = 0;
     this.SP                  = this.MEMORY_SIZE - 1;
     this.savedState          = [];

     this.events = {
       step: new Phaser.Signal()
     };

     this.registers           = {
        'A': new Register(),             // Accumulator, io, arithmetic, interrupt
		    'B': new Register(),             // Base, base pointer for memory access
		    'C': new Register(),             // Counter, loop counter, shifts
		    'D': new Register(),             // Data, io, arithmetic, interrupt
        // Segment registers
        'CS': new Register(),            // Code, segment in which the program runs
        'DS': new Register(),            // Data, data segment that the program accesses
        'ES': new Register(),            // Far pointer addressing
        'FS': new Register(),            // "
        'GS': new Register(),            // "
        'SS': new Register(),            // Stack, stack segment the program uses
        // Index registers
        'DI': new Register(),            // Destination, string, memory array copying, far pointer addressing
        'SI': new Register(),            // Source, string, memory array copying
        'BP': new Register(),            // Stack Base Pointer, holds the base address of the stack
        'SP': new Register(),            // Stack Pointer, holds the top address of the stack
        'IP': new Register(),            // Index Pointer, holds the offset of the next instruction, read only
        'FLAGS': new Register()
     };

     this.instructionSet = new InstructionSet();

     this.symbolTable = this.instructionSet.symbolTable;

     this.opMap = {
       'add':     this.add,
       'sub':     this.sub,
       'mul':     this.mul,
       'div':     this.div,
       'push':    this.push,
       'pushf':   this.pushf,
       'pusha':   this.pusha,
       'pop':     this.pop,
       'popf':    this.popf,
       'popa':    this.popa,
       'and':     this.and,
       'or':      this.or,
       'xor':     this.xor,
       'inc':     this.inc,
       'dec':     this.dec,
       'jmp':     this.jmp,
       'ja':      this.ja,
       'jz':      this.jz,
       'jb':      this.jb,
       'nop':     this.nop,
       'cmp':     this.cmp,
       'shl':     this.shl,
       'shr':     this.shr,
       'rol':     this.rol,
       'ror':     this.ror,
       'not':     this.not,
       'mov':     this.mov
     }

     // setup the clock, will not start until clock.start() is called
     this.clock.loop(this.clockSpeed, this.step, this);
   }

   /**
    * Step
    */
   step () {
     // get the current address pointed to by the instruction pointer
     this.IP = this.registers['IP'].value;
     // execute the instruction in memory at that location
     this.execute(this.memory.getWord(this.IP));
     this.updateIP();
   }

   /**
    * Execute
    * Maps the instruction to its meaning and retrieves the necessary
    * data from the indicated locations.  Runs the operation on the data
    * and store the result if applicable.
    * @param {number} instruction - the instruction to interpret
    */
   execute (instruction) {
     let [op, loc1, loc2] = this.symbolTable[instruction];
     // translate op into function
     op = this.opMap[op];
     op.call(this, loc1, loc2);
   }

   updateIP () {
     // publish the step event
     this.events.step.dispatch('IP', this.IP);
     // set the IP to its new value
     this.registers['IP'].value = this.IP;
   }

   updateSP () {
     // publish the step event
     this.events.step.dispatch('SP', this.SP);
     // set the SP to its new value
     this.registers['SP'].value = this.SP;
   }

   /**
    * Store
    * Store a value in the given location.
    * @param {string} location - reg, mem, or dmem
    * @param {number} address - the address in the location
    * @param {number} value - the value to store
    */
   store (location, address, value) {
     if (location === undefined || address === undefined || value === undefined) {
       return;
     }
     switch (location) {
       // get the register and set its value
       case 'reg':
       let reg = this.registers[this.parseAddress(address)];
       reg.value = value;
       break;

       // set the value at the given memory address
       case 'mem':
       this.memory.setWord(address, value);
       break;

       // get the memory address from memory and then set the value at it
       case 'dmem':
       let dAddr = this.memory.getWord(address);
       this.memory.setWord(dAddr, value);
       break;
     }
   }

   /**
    * Retrieve
    * Retrieve the value at the given location.
    * @param {string} location - reg, mem, dmem, or imm
    * @param {number} address - the address in the location
    */
   retrieve (location, address) {
     if (location === undefined || address === undefined) {
       return;
     }
     switch (location) {
       // get the value from a register
       case 'reg':
       let reg = this.registers[this.parseAddress(address)];
       return reg.value;

       // get the value from memory
       case 'mem':
       return this.memory.getWord(address);

       // get the address from memory and then get the value at that address
       case 'dmem':
       let dAddr = this.memory.getWord(address);
       return this.memory.getWord(dAddr);

       // return the immediate value
       case 'imm':
       return address;
     }
   }

   /**
    * Flag Register Getters and Setters
    */
   get carry () {
     return this.registers('FLAGS').getBit(0);
   }

   set carry (value) {
     this.registers('FLAGS').setBit(0, value);
   }

   get parity () {
     return this.registers('FLAGS').getBit(2);
   }

   set parity (value) {
     this.registers['FLAGS'].setBit(2, value);
   }

   get adjust () {
     return this.registers['FLAGS'].getBit(4);
   }

   set adjust (value) {
     this.registers['FLAGS'].setBit(4, value);
   }

   get zero () {
     return this.registers['FLAGS'].getBit(6);
   }

   set zero (value) {
     this.registers['FLAGS'].setBit(6, value);
   }

   get sign () {
     return this.registers['FLAGS'].getBit(7);
   }

   set sign (value) {
     this.registers['FLAGS'].setBit(7, value);
   }

   get trap () {
     return this.registers['FLAGS'].getBit(8);
   }

   set trap (value) {
     this.registers['FLAGS'].setBit(8, value);
   }

   /**
    * Set Flags
    * Sets the flags register based on the result of an operation.
    */
   setFlags (result) {

   }

   parseAddress (addr) {
     return Object.keys(this.registers)[addr];
   }

   nop () {
     this.currentInstruction = 'NOP';
     this.IP += 1;
   }

   add (loc1, loc2) {
     this.currentInstruction = 'ADD';
     let dest = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     let src = this.retrieve(loc2, this.memory.getWord(this.IP+2));
     let result = dest + src;
     // set zero flag
     this.zero = (result === 0);
     // set the sign flag
     this.sign = (result < 0);
     // set the parity flag
     this.parity = (result.toString(2).replace(/0/g, '').length % 2 === 0);
     this.store(loc1, this.memory.getWord(this.IP+1), result);
     this.IP += 3;
   }

   sub (loc1, loc2) {
     this.currentInstruction = 'SUB';
     let dest = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     let src = this.retrieve(loc2, this.memory.getWord(this.IP+2));
     let result = dest - src;
     // set zero flag
     this.zero = (result === 0);
     // set the sign flag
     this.sign = (result < 0);
     // set the parity flag
     this.parity = (result.toString(2).replace(/0/g, '').length % 2 === 0);
     this.store(loc1, this.memory.getWord(this.IP+1), result);
     this.IP += 3;
   }

   mul (loc1) {
     this.currentInstruction = 'MUL';
     let dest = this.registers['A'];
     let src = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     let result = dest.value * src;
     console.log(result)
     // result is store in register A
     dest.value = result;
     this.IP += 2;
   }

   div (loc1) {
     this.currentInstruction = 'DIV';
     let dest = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     let src = this.registers['A'];
     let quotient = Math.floor(dest / src.value);
     let remainder = dest % src.value;
     src.high = remainder;
     src.low = quotient;
     this.IP += 2;
   }

   push (loc1) {
     this.currentInstruction = 'PUSH';
     let value = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     // store the value on the stack
     this.SP -= 1;
     this.updateSP();
     // push the value onto the stack
     this.store('mem', this.SP, value);
     this.IP += 2;
   }

   pop (loc1) {
     this.currentInstruction = 'POP';
     // get the value from the stack
     let value = this.retrieve('mem', this.SP);
     this.SP += 1;
     // set the SP to its new value
     this.registers['SP'].value = this.SP;
     // store it at the given location in memory
     this.store(loc1, this.memory.getWord(this.IP+1), value);
     this.IP += 2;
   }

   and (loc1, loc2) {
     this.currentInstruction = 'AND';
     let dest = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     let src = this.retrieve(loc2, this.memory.getWord(this.IP+2));
     let result = dest & src;
     // set zero flag
     this.zero = (result === 0);
     // set the sign flag
     this.sign = (result < 0);
     // set the parity flag
     this.parity = (result.toString(2).replace(/0/g, '').length % 2 === 0);
     this.store(loc1, this.memory.getWord(this.IP+1), result);
     this.IP += 3;
   }

   or (loc1, loc2) {
     this.currentInstruction = 'OR';
     let dest = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     let src = this.retrieve(loc2, this.memory.getWord(this.IP+2));
     let result = dest | src;
     // set zero flag
     this.zero = (result === 0);
     // set the sign flag
     this.sign = (result < 0);
     // set the parity flag
     this.parity = (result.toString(2).replace(/0/g, '').length % 2 === 0);
     this.store(loc1, this.memory.getWord(this.IP+1), result);
     this.IP += 3;
   }

   xor (loc1, loc2) {
     this.currentInstruction = 'XOR';
     let dest = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     let src = this.retrieve(loc2, this.memory.getWord(this.IP+2));
     let result = dest ^ src;
     // set zero flag
     this.zero = (result === 0);
     // set the sign flag
     this.sign = (result < 0);
     // set the parity flag
     this.parity = (result.toString(2).replace(/0/g, '').length % 2 === 0);
     this.store(loc1, this.memory.getWord(this.IP+1), result);
     this.IP += 3;
   }

   not (loc1) {
     this.currentInstruction = 'NOT';
     let dest = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     let result = ~dest;
     // set zero flag
     this.zero = (result === 0);
     // set the sign flag
     this.sign = (result < 0);
     // set the parity flag
     this.parity = (result.toString(2).replace(/0/g, '').length % 2 === 0);
     this.store(loc1, this.memory.getWord(this.IP+1), result);
     this.IP += 2;
   }

   inc (loc1) {
     this.currentInstruction = 'INC';
     let value = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     value += 1;
     // set zero flag
     this.zero = (value === 0);
     // set the sign flag
     this.sign = (value < 0);
     // set the parity flag
     this.parity = (value.toString(2).replace(/0/g, '').length % 2 === 0);
     this.store(loc1, this.memory.getWord(this.IP+1), value);
     this.IP += 2;
   }

   dec (loc1) {
     this.currentInstruction = 'DEC';
     let value = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     value -= 1;
     // set zero flag
     this.zero = (value === 0);
     // set the sign flag
     this.sign = (value < 0);
     // set the parity flag
     this.parity = (value.toString(2).replace(/0/g, '').length % 2 === 0);
     this.store(loc1, this.memory.getWord(this.IP+1), value);
     this.IP += 2;
   }

   jmp (loc1) {
     this.currentInstruction = 'JMP';
     let addr = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     addr = Memory.wrap(addr, this.memory.SIZE);
     this.IP = addr;
   }

   ja (loc1) {

   }

   je (loc1) {
     this.jz(loc1);
     this.currentInstruction = 'JE';
   }

   jne (loc1) {
     this.jnz(loc1);
     this.currentInstruction = 'JNE';
   }

   jz (loc1) {
     this.currentInstruction = 'JZ';
     // if zero flag is set, jump to address
     if (this.zero) {
       let addr = this.retrieve(loc1, this.memory.getWord(this.IP+1));
       addr = Memory.wrap(addr, this.memory.SIZE);
       this.IP = addr;
     }
     else {
       this.IP += 2;
     }
   }

   jnz (loc1) {
     this.currentInstruction = 'JNZ';
     // jump only if the zero flag is not set
     if (this.zero) {
       this.IP += 2;
     }
     else {
       let addr = this.retrieve(loc1, this.memory.getWord(this.IP+1));
       addr = Memory.wrap(addr, this.memory.SIZE);
       this.IP = addr;
     }
   }

   jb (loc1) {

   }

   cmp (loc1, loc2) {
     this.currentInstruction = 'CMP';
     let value1 = this.retrieve(loc1, this.memory.getWord(this.IP+1));
     let value2 = this.retrieve(loc2, this.memory.getWord(this.IP+2));
     let result = value1 - value2;
     // set zero flag
     this.zero = (result === 0);
     // set the sign flag
     this.sign = (result < 0);
     // set the parity flag
     this.parity = (result.toString(2).replace(/0/g, '').length % 2 === 0);
     this.IP += 3;
   }

   shl (loc1) {

   }

   shr (loc1) {

   }

   rol (loc1) {

   }

   ror (loc1) {

   }

   not (loc1) {

   }

   mov (loc1, loc2) {
     this.currentInstruction = 'MOV';
     let src = this.retrieve(loc2, this.memory.getWord(this.IP+2));
     this.store(loc1, this.memory.getWord(this.IP+1), src);
     this.IP += 3;
   }
 }

 export default Processor;
