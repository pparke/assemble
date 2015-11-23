import Assembler from '../src/app/objects/Assembler';
var chai      = require('chai');
var assert    = chai.assert;
var expect    = chai.expect
var should    = chai.should();

describe('Tests for the Assembler class', function() {

  var assembler = new Assembler();
  var program =  `MY_VAR DW 'hello!'
                  OTHER DW 1,2,3,4,5
                  start:
                  mov a, 2			; Move immediate value 2 into a low
                  mov b, 1			; move immediate value 1 into b low
                  mov c, 10	  ; move immediate value 10 into c low
                  mov d, b		; move value in bx to dx
                  mul d		; multiply dx by al
                  inc b				; Increment bx (multiplier)
                  dec c				; Decrement cx (counter)
                  jz start			; go back to start if we've done this 10 times
                  jmp 0x000c		; Jump to location 12 (mul dx, al)`;

  var lines;

  it('should return an array containing the preprocessed lines of the program.', function() {
    lines = assembler.preprocess(program);
    assert.typeOf(lines, 'array');
    console.log(lines);
  });

  it('should extract definitions from the program and store them in segments.data', function () {
    lines = assembler.extractDefinitions(lines);
    assembler.content.length.should.not.equal(0);
  });

  it('should assemble the program into machine code', function () {
    var output = assembler.assemble(lines);
    output.length.should.not.equal(0);
    console.log('Symbol Table:', assembler.symbols);
    console.log('Content:', assembler.content);
  })

});
