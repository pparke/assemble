
import InstructionSet from '../src/app/objects/InstructionSet';
import chai           from 'chai';

let assert = require('chai').assert;

describe('Tests for the InstructionSet class', function() {

  var instructionSet = new InstructionSet();
  var table = []

  it('should return an array containing all of the valid instructions.', function() {
    table = instructionSet.symbolTable;
    assert.typeOf(table, 'array');
    console.log(table);
  });

  it('should lookup some instructions and receive the correct indexes', function () {
    for (var i = 0; i < 10; i++) {
      // get a random index
      var index = Math.floor(Math.random()*table.length);
      var op = table[index][0];
      var arg1 = table[index][1];
      var arg2 = table[index][2];
      console.log(`Looking up ${op} ${arg1} ${arg2}`);
      var foundIndex = instructionSet.lookup(op, arg1, arg2);
      assert.equal(index, foundIndex);
    }
  });
});
