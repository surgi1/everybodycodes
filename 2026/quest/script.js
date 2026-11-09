const extractNumeric = line => line.match(/-?\d+/g);

Object.defineProperty(Array.prototype, 'sum', {
    value: function() {
        return this.reduce((a, v) => a + v, 0);
    }
});

const parse = input => input.split('\n').map(line => extractNumeric(line).map(Number))

const run = (data) => {
    console.log(data)
}

console.log('p1', run(parse(inputt1)));
