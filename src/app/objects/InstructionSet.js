/**
 * Instruction Set
 */

class InstructionSet {
  constructor () {
    this.instructions = {
     add: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ],
     sub: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ],
     mul: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     div: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     push: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     pushf: [],
     pusha: [],
     pop: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     popf: [],
     popa: [],
     and: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ],
     or: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ],
     xor: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ],
     inc: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
     ],
     dec: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
     ],
     jmp: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     ja: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     jb: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     je: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     jne: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     jz: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     jnz: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
       [ 'imm' ],
     ],
     nop: [],
     cmp: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ],
     shl: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ],
     shr: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ],
     rol: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ],
     ror: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ],
     not: [
       [ 'reg' ],
       [ 'mem' ],
       [ 'dmem' ],
     ],
     mov: [
       [ 'reg', 'reg' ],
       [ 'reg', 'mem' ],
       [ 'reg', 'dmem' ],
       [ 'reg', 'imm' ],
       [ 'mem', 'reg' ],
       [ 'mem', 'mem' ],
       [ 'mem', 'dmem' ],
       [ 'mem', 'imm' ],
       [ 'dmem', 'reg' ],
       [ 'dmem', 'mem' ],
       [ 'dmem', 'dmem' ],
       [ 'dmem', 'imm' ],
     ]
    };
  }

  /**
   * Symbol Table
   * Returns the table of all operations as an array
   * @return {array} an array containing all of the operations
   */
  get symbolTable () {
    return Object.keys(this.instructions).reduce((table, key) => {
      let subset = this.instructions[key];
      subset.forEach((elem) => {
        let binding = [];
        binding = binding.concat(key, elem);
        table.push(binding)
      });
      return table;
    }, []);
  }

  /**
   * Lookup
   * Looks up the index of the operation in the table.
   * @param {string} key - the name of the operation
   * @param {string} arg1 - the type of the first argument
   * @param {string} arg2 - the type of the second argument
   * @return {number} the index of the operation
   */
  lookup (key, arg1, arg2) {
    let table = this.symbolTable;
    let i = table.findIndex((entry) => {
      return (entry[0] === key && entry[1] === arg1 && entry[2] === arg2);
    });

    if (i === -1) {
      throw new Error(`Instruction not found: ${key} ${arg1} ${arg2}`);
    }
    else {
      return i;
    }
  }
}

export default InstructionSet;
