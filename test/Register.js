/*
 * Register Test
 * ===========================================================================
 *
 * Tests for the Register class
 */

import Register     from '../src/app/objects/Register.js';
import Phaser       from 'phaser';
import chai         from 'chai';

let assert         = chai.assert;
let expect         = chai.expect;
let should         = chai.should();

describe('Tests for the Register class', function() {

 describe('#toString()', function() {

   let instance;

   // fresh instance for each test
   beforeEach(() => {
     instance = new Register();
   });

   // toString implementation
   it('should return the string representation', function() {
     instance.toString().should.be.a('string');
   });
 });
});
