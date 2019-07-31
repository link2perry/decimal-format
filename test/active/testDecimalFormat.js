let assert = require('chai').assert;
let expect = require('chai').expect;
let DecimalFormat = require('../../DecimalFormat.js');

describe.only('Test DecimalFormat', function() {

  it('Formats #.## on money number correctly', function(){
    let df = new DecimalFormat('$#.##');
    let f = df.format(1234.125);
    expect(f).to.equal('$1234.13');
  });

  it('Formats negative money number correctly', function(){
    let df = new DecimalFormat('$#.##');
    let f = df.format(-1234.125);
    expect(f).to.equal('-$1234.13');
  });

  it('Formats patterns with prefixes and suffixes correctly', function(){
    let df = new DecimalFormat('$#.##!');
    let f = df.format(1234.125);
    expect(f).to.equal('$1234.13!');
  });

  it('Formats #.## on money with space number correctly', function(){
    let df = new DecimalFormat('$ #.##');
    let f = df.format(1234.125);
    expect(f).to.equal('$ 1234.13');
  });

  it('Formats #.## correctly when the value is less precise', function(){
    let df = new DecimalFormat('#.##');
    let f = df.format('1234.5');
    expect(f).to.equal('1234.5');
  });

  it('Formats #.00 correctly', function(){
    let df = new DecimalFormat('#.00');
    let f = df.format('1234.5');
    expect(f).to.equal('1234.50');
  });

  it('Formats #.00 correctly when the value has no decimal', function(){
    let df = new DecimalFormat('#.00');
    let f = df.format('1234');
    expect(f).to.equal('1234.00');
  });

  it('Formats #.### on negative number correctly', function(){
    let df = new DecimalFormat('#.###');
    let f = df.format(-1234.1235);
    expect(f).to.equal('-1234.124');
  });

  it('Formats #.### on negative number correctly (2)', function(){
    let df = new DecimalFormat('#,###.###');
    let f = df.format(-123.1235);
    expect(f).to.equal('-123.124');
  });

  it('Formats #.### on positive number correctly', function(){
    let df = new DecimalFormat('#.###');
    let f = df.format(+1234.1235);
    expect(f).to.equal('1234.124');
  });

  it('Formats #.### correctly', function(){
    let df = new DecimalFormat('#.###');
    let f = df.format(1234.1235);
    expect(f).to.equal('1234.124');
  });

  it('Formats 0.## correctly', function(){
    let df = new DecimalFormat('0.##');
    let f = df.format(1234.1235);
    expect(f).to.equal('1234.12');
  })

  it('Formats 0.## without leading numeral correctly', function(){
    let df = new DecimalFormat('0.##');
    let f = df.format(.1235);
    expect(f).to.equal('0.12');
  })

  it('Formats 0.### without leading numeral correctly', function(){
    let df = new DecimalFormat('0.###');
    let f = df.format(.1235);
    expect(f).to.equal('0.124');
  })

  it('Formats 000.### without leading numeral correctly', function(){
    let df = new DecimalFormat('000.###');
    let f = df.format(.1235);    
    expect(f).to.equal('000.124');
  })

  it('Formats 000.### without leading numeral correctly', function(){
    let df = new DecimalFormat('000.###');
    let f = df.format(.1235);    
    expect(f).to.equal('000.124');
  })

  it('Formats 0.00# without leading numeral correctly', function(){
    let df = new DecimalFormat('0.00#');
    let f = df.format(.1);   
    expect(f).to.equal('0.10');
  })

  it('Formats 0 correctly', function(){
    let df = new DecimalFormat('#');
    let f = df.format(.99999);   
    expect(f).to.equal('1');
  })

  it('Formats whole where required is greater than whole input', function(){
    let df = new DecimalFormat('000');
    let f = df.format(.99999);   
    expect(f).to.equal('001');
  })

  it('Formats embedded numbers correctly', function(){
    let df = new DecimalFormat('$000.00R');
    let f = df.format('213');   
    expect(f).to.equal('$213.00R');
  })

  it('Formats with commas', function(){
    let df = new DecimalFormat('##,###.00');
    let f = df.format('12345678');   
    expect(f).to.equal('12,345,678.00');
  })

  it('Formats with multiple commas in pattern', function(){
    let df = new DecimalFormat('##,###,###.00');
    let f = df.format('12345678');   
    expect(f).to.equal('12,345,678.00');
  })

  it('Formats with commas with shorter interval', function(){
    let df = new DecimalFormat('#,#.00');
    let f = df.format('12345678');   
    expect(f).to.equal('1,2,3,4,5,6,7,8.00');
  })

  it('Formats with commas with no decimal part', function(){
    let df = new DecimalFormat('#,###');
    let f = df.format('10450.75');
    expect(f).to.equal('10,451');
  })

  it('Formats with no optional fractional digits correctly', function(){
    let df = new DecimalFormat('#.##');
    let f = df.format('123');   
    expect(f).to.equal('123');
  })

  it('Formats correctly with leading fractional zeroes', function(){
    let df = new DecimalFormat('#.######');
    let f = df.format('123.00991');   
    expect(f).to.equal('123.00991');
  })

  it('Formats correctly with leading fractional zeroes on forced digits', function(){
    let df = new DecimalFormat('#.0000');
    let f = df.format(644.0003467);   
    expect(f).to.equal('644.0003');
  })

  it('Formats correctly with leading fractional zeroes on forced digits with extra formatting', function(){
    let df = new DecimalFormat('#,###.00');
    let f = df.format(3864.01001);   
    expect(f).to.equal('3,864.01');
  })

  it('Formats correctly with leading fractional zeroes on forced digits with extra formatting and rounding after forced digits', function() {
    let df = new DecimalFormat('#,###.00');
    let f = df.format(11881.005905867181);   
    expect(f).to.equal('11,881.01');
  });

  it('Formats correctly with trailing fractional zeroes', function(){
    let df = new DecimalFormat('#.######');
    let f = df.format('123.300');   
    expect(f).to.equal('123.3');
  })

  it('TIS-1794', function(){
    let df = new DecimalFormat('#.#');
    let f = df.format('93.99');   
    expect(f).to.equal('94.0');
  })
});