/*
 * Processor Test
 * ===========================================================================
 *
 * Tests for the Processor class
 */
 let document = {};

 import Processor   from '../src/app/objects/Processor.js';
 import Phaser      from 'phaser';
 import chai        from 'chai';

 let assert         = chai.assert;
 let expect         = chai.expect;
 let should         = chai.should();

 describe('Tests for the Processor class', function() {

   describe('#toString()', function() {

     let instance;

     // fresh instance for each test
     beforeEach(() => {
       instance = new Processor();
     });

     // toString implementation
     it('should return the string representation', function() {
       instance.toString().should.be.a('string');
     });
   });
 });
