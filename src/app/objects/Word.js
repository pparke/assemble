/**
 * @class Word
 * Represents one 16 bit chunk of memory.
 */
 class Word {
   constructor () {
     this.value = 0x0000;
   }

   zero () {
     this.value = 0x0000;
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
 }

export default Word;
