/**
 * Assembler
 * Translates the assembler language instructions into machine code.
 */
import InstructionSet from './InstructionSet';

class Assembler {
  constructor () {
    this.instructionSet = new InstructionSet();

    this.segments = {
      text: {
        memory: [],
        labels: {}
      },
      data: {
        memory: [],
        labels: {}
      },
      bss: {
        memory: [],
        labels: {}
      },
    }

    this.symbols = {};
    this.labels = {};
    this.content = [];

    this.registers = ['a', 'b', 'c', 'd', 'cs', 'ds', 'es', 'fs', 'gs', 'ss', 'di', 'si', 'bp', 'sp', 'ip', 'flags'];
  }

  load (file) {
    let program = this.preprocess(file);
    program = this.extractDefinitions(program);
    program = this.assemble(program);
    return program;
  }

 /**
    Preprocess
    Removes comments, commas, blank lines, and splits the text input
    into an array with one line per element.  Also converts strings into
    char code sequences.
    @param {string} file - the file to process
    @return {array} an array containing each line as an element
  */
  preprocess (file) {
    // split on linebreak
    let lines = file.toLowerCase().split('\n');
    // remove comments and commas
    return lines.map((line) => {
      // match anything after a semicolon and remove
      line = line.replace(/;.+$/, '');

      // match anything between apostrophes as a string
      line = line.replace(/\'.+\'/, (str) => {
        // split into an array containing all individual characters
        return str.split('')
        .map((char) => {
          // convert to the char code value
          return char.charCodeAt(0);
        })
        // return a string of the values separated by spaces
        .join(' ');
      });

      // replace all commas with spaces and trim trailing whitespace
      line = line.replace(/,/g, ' ').trim();

      return line;
    })
    // eliminate any empty lines
    .filter((line) => {
      return line.length > 0;
    });
  }

  /**
   * Extract Defintions
   * Searches for definitions and adds them to the data segment,
   * returns the lines that are not definitions
   * TODO: add support for times, equ,
   * @param {array} lines - an array of lines to inspect
   * @returns {array} lines not containing defintitions
   */
  extractDefinitions (lines) {
    return lines.filter((line) => {
      // split into tokens by whitespace
      let lineArr = line.split(/\s+/);
      // if the line contains a definition
      if (lineArr.indexOf('dw') > -1) {
        // set the label to point at the beginning of the data that will be added
        this.symbols[lineArr[0]] = this.content.length;
        // add the data to the end of the content
        let data = lineArr.slice(lineArr.indexOf('dw') + 1).map((elem) => {
          return parseInt(elem);
        });
        this.content = this.content.concat(data);
        // remove the line so it is not processed by subsequent steps
        return false;
      }
      else {
        return true;
      }
    });
  }

  /**
   * Assemble
   * @param {array} lines - the array of lines to process
   * @param {array} the output array of encoded instructions
   */
  assemble (lines) {
    let output = lines.reduce((sequence, line, i) => {
      // split into tokens by whitespace
      let lineArr = line.split(/\s+/);
      // check if there is a label
      if (lineArr[0].indexOf(':') > -1) {
        let label = lineArr[0].replace(':', '');
        this.labels[label] = this.content.length;
        lineArr = lineArr.slice(1);
      }
      //let [op, arg1, arg2] = lineArr;
      let op = lineArr[0], arg1 = lineArr[1], arg2 = lineArr[2];
      let arg1T, arg2T, arg1D, arg2D;

      if (op !== undefined) {
        // get the types of the first and second arguments
        if (arg1 !== undefined) {
          // check if it is a register
          if (this.registers.indexOf(arg1) > -1) {
            arg1T = 'reg';
            arg1D = this.registers.indexOf(arg1);
          }
          // matches any symbol contained in brackets indicating indirect addresses
          else if (arg1.match(/\[\w+\]/)) {
            arg1T = 'dmem';
            let label = arg1.match(/\[(\w+)\]/)[1];
            // make sure the label exists
            if (this.symbols[label] !== undefined) {
              arg1D = this.symbols[label];
            }
            else {
              throw new Error(`Unrecognized symbol ${label} at line ${i}`);
            }
          }
          // immediate values are not allowed as the first argument
          else if (arg1.match(/[0-9]+/)) {
            arg1T = 'imm';
            arg1D = parseInt(arg1);
          }
          // check if it is a defined value
          else if (this.symbols[arg1] !== undefined) {
            arg1T = 'mem';
            arg1D = this.symbols[arg1];
          }
          // check if it is a labeled position
          else if (this.labels[arg1] !== undefined) {
            arg1T = 'imm';
            arg1D = this.labels[arg1];
          }
          else {
            throw new Error(`Unrecognized symbol ${arg1} at line ${i}`);
          }
        }

        if (arg2 !== undefined) {
          // check if it is a register
          if (this.registers.indexOf(arg2) > -1) {
            arg2T = 'reg';
            arg2D = this.registers.indexOf(arg2);
          }
          // matches any symbol contained in brackets indicating indirect addresses
          else if (arg2.match(/\[\w+\]/)) {
            arg2T = 'dmem';
            let label = arg2.match(/\[(\w+)\]/)[1];
            // make sure the label exists
            if (this.symbols[label] !== undefined) {
              arg2D = this.symbols[label];
            }
            else {
              throw new Error(`Unrecognized symbol ${label} at line ${i}`);
            }
          }
          // immediate value
          else if (arg2.match(/[0-9]+/)) {
            arg2T = 'imm';
            arg2D = parseInt(arg2);
          }
          // check if it is a defined value
          else if (this.symbols[arg2] !== undefined) {
            arg2T = 'mem';
            arg2D = this.symbols[arg2];
          }
          // check if it is a labeled position
          else if (this.labels[arg2] !== undefined) {
            arg2T = 'imm';
            arg2D = this.labels[arg2];
          }
          else {
            throw new Error(`Unrecognized symbol ${arg2} at line ${i}`);
          }
        }

        // lookup the opcode based on its signature
        let opcode = this.instructionSet.lookup(op, arg1T, arg2T);
        sequence.push(opcode);
        this.content.push(opcode);
        if (arg1D !== undefined) {
          sequence.push(arg1D);
          this.content.push(arg1D);
        }
        if (arg2D !== undefined) {
          sequence.push(arg2D);
          this.content.push(arg2D);
        }

        return sequence;
      }
      // empty line
      else {
        return sequence;
      }
    }, []);

    return output;
  }
}

export default Assembler;
