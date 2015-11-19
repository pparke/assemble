/**
 * @class Register
 */
 import Memory from './Memory';

 class Register {
   constructor () {
     this._value = 0x0000;
     this.SIZE = 0xFFFF;
   }

   get value () {
     return this._value;
   }

   set value (v) {
     v = Memory.wrap(v, this.SIZE);
     this._value = v;
   }

   get high () {
     return this.value << 8;
   }

   set high (v) {
     this.value = (this.value | 0xFF00) & (v | 0x00FF);
   }

   get low () {
     return this.value & 0x00FF
   }

   set low (v) {
     this.value = (this.value | 0x00FF) & (v | 0xFF00);
   }

   /**
    * Flip Bit
    * Invert the bit at the given position.
    * @param {integer} b - the position of the bit to flip.
    */
   flipBit (b) {
     if (b < 0 || b > 15) {
       throw new Error('Bit out of range');
     }
     this.value ^= (0b1 << b);
   }

   getBit (b) {
     if (b < 0 || b > 15) {
       throw new Error('Bit out of range');
     }
     return ((this.value >> b) & 0b1) === 0b1;
   }

   setBit (b, v) {
     if (b < 0 || b > 15) {
       throw new Error('Bit out of range');
     }
     if (!!v) {
       this.value |= (0b1 << b)
     }
     else {
       this.value &= (0xffff ^ (0b1 << b));
     }
   }

   /**
    * To String
    * Convert the value of the register to its string representation.
    * @param {string} key - the base of the resulting string [hex|oct|int|bin]
    */
   toString (key='hex') {
     let fmts = {
       hex: 16,
       oct: 8,
       int: 10,
       bin: 2
     };

     return this.value.toString(fmts[key]);
   }
 }

export default Register;
