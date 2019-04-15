class DecimalFormat {

  constructor(pattern) {
    if(/\.*/.exec(pattern).length > 1){
      throw new Error('DecimalFormat Exception. Pattern should contain at most 1 decimal.');
    }
    this.pattern = pattern;
  }

  /**
   * @description Format an input according to the pattern provided. 
   * Special pattern characters:
   * Symbol                   Meaning
   * ------                   ----------------
   * 0                        Minimum integer. Zeroes will display in the place of missing integers from input.
   * #                        Optional integer. Leading whole and trailing fractional zeroes are omitted.
   * .                        Decimal point.
   *
   * Other characters will pass through as literals.
   *
   * @param {Number} input The number to format
   * @return {String} The formatted string
   */
  format(input) {
    if(/\.*/.exec(input).length > 1){
      throw new Error('DecimalFormat Exception. Value should contain at most 1 decimal.');
    }
    let prefix = '';
    let suffix = '';
    let formatted = '';

    let _formatWholePart = (input, pattern) => {
      let formatted = '';
      if(typeof pattern !== 'undefined' && pattern.length > 0) {
        let inputLength = input ? ('' + input).length : 0;
        let requiredIndex = 0;
        let zeroIndex = pattern.indexOf('0');
        if(zeroIndex > -1) {
          requiredIndex = pattern.length - zeroIndex; 
        }

        // console.log('whole pattern:', pattern);
        // console.log('whole input:', input);
        // console.log('whole input length:', inputLength);
        // console.log('required index:', requiredIndex);
        // console.log('===========================');
        // console.log('');

        if(inputLength < requiredIndex) {
          formatted = '0'.repeat(requiredIndex - inputLength) + (input || '');
        } else {
          formatted = (input || '');
        }
      }
      return formatted;
    }

    let _formatFractionalPart = (input, pattern) => {
      if(typeof input === 'undefined' || input === null) {
        input = '';
      }
      //remove trailing zeros from fractional input      
      input = new Number('0.' + input).toString().substring(2); 
      let formatted = '';
      if(typeof pattern !== 'undefined' && pattern.length > 0) {
        let requiredIndex = pattern.lastIndexOf('0') + 1;
        let optionalIndex = Math.max(pattern.lastIndexOf('#') + 1, requiredIndex);
        let inputLength = input ? ('' + input).length : 0;

        // console.log('pattern:', pattern);
        // console.log('input:', input);
        // console.log('input length:', inputLength);
        // console.log('fractional input:', input);
        // console.log('fractional input length:', inputLength);
        // console.log('required index:', requiredIndex);
        // console.log('optional index:', optionalIndex);
        
        if(inputLength > 0) {
          if(inputLength > optionalIndex) {
            let optionalInput = input.substring(0, optionalIndex) + '.' + input[optionalIndex];
            let roundedOptionalInput = Math.round(optionalInput);
            let leadingZeroes = optionalIndex - ('' + roundedOptionalInput).length;
            if(leadingZeroes > 0) {
              formatted = '0'.repeat(leadingZeroes) + roundedOptionalInput;
            } else {
              formatted = roundedOptionalInput;
            }
            //'0'.repeat(leadingZeroes) + Math.round(input / Math.pow(10, inputLength - optionalIndex))
          } else if (inputLength >= requiredIndex) {
            formatted = '' + input;
          } else {
            formatted = '' + input + '0'.repeat(requiredIndex - inputLength);
          }
        } else {
          formatted = '0'.repeat(requiredIndex);
        }
      } 
      return formatted;       
    }

    let _addCommas = (input, interval) => {
      var inputs = ('' + input).split('.');
      if (inputs[0].length > interval) {
          let regex = new RegExp('(\\d)(?=(\\d{' + interval + '})+$)','g');
          inputs[0] = inputs[0].replace(regex, '$1,');
      }
      return inputs.join('.');
    }

    //formatted result for whole part, fractional part
    formatted = ['',''];

    input = ('' + input).trim();
    let pSign = /^-/; 
    let match = pSign.exec(input);
    let sign = '';
    if(match) {
      sign = '-';
      input = input.substring(1); 
    }
    input = input.replace(/[^0-9.]/g, '');

    let decimalIndex = this.pattern.indexOf('.'); 
    let endingIndex = decimalIndex === -1 ? this.pattern.length : decimalIndex;  
    let commaIndex = this.pattern.lastIndexOf(',', endingIndex);   
    
    let commaInterval = 0;
    if(commaIndex > -1) {
      commaInterval = endingIndex - commaIndex - 1;
    }
    if(decimalIndex > -1) {
      //whole number + fractional
      let patterns = this.pattern.split('.');

      let p = /[0#\.]/;
      match = p.exec(patterns[0]);
      if(match.index > 0) {
        prefix = patterns[0].substring(0, match.index);
        patterns[0] = patterns[0].substring(match.index);
      }

      let pLast = /(?!.*[0#\.])/;
      match = pLast.exec(patterns[1]);
      if(match) {
        suffix = patterns[1].substring(match.index);
        patterns[1] = patterns[1].substring(0, match.index);
      }

      let inputs = input.split('.');
      formatted[0] = _formatWholePart(inputs[0], patterns[0]);
      formatted[1] = _formatFractionalPart(inputs[1], patterns[1]);
      if(typeof formatted[1] !== 'undefined' && ('' + formatted[1]).length > 0) {
        formatted = formatted.join('.');
      } else {
        formatted = formatted[0];
      }
    } else {
      //whole number only
      let pattern = this.pattern;
      let p = /[0#\.]/;
      let match = p.exec(pattern);
      if(match[0] > 0) {
        prefix = pattern.substring(0, match.index);
        pattern = pattern.substring(match.index);
      }

      let pLast = /(?!.*[0#\.])/;
      match = pLast.exec(pattern);
      if(match) {
        suffix = pattern.substring(match.index);
        pattern = pattern.substring(0, match.index);
      }
      formatted = _formatWholePart(Math.round(input), pattern);
    }

    //remove trailing zeros
    if(commaInterval > 0) {
      formatted = _addCommas(formatted, commaInterval);
    }
    return sign + prefix + formatted + suffix;
  }

}

module.exports = DecimalFormat;