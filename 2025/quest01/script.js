const parse = input => input.split('\n\n').map(row => row.split(','))
const mod = (n, m) => ((n % m) + m) % m;

const run = ([names, instructions], i = 0, bounded = true) => {
    instructions.forEach(ins => {
        let dir = ins[0], steps = Number(ins.match(/\d+/g)[0])
        i += (dir == 'L' ? -1 : 1)*steps;
        if (bounded) {
            if (i < 0) i = 0;
            if (i > names.length-1) i = names.length-1;
        }
    })
    return names[mod(i, names.length)];
}

const run3 = ([names, instructions]) => {
    instructions.forEach(ins => {
        let dir = ins[0], steps = Number(ins.match(/\d+/g)[0]);
        let i = mod((dir == 'L' ? -1 : 1)*steps, names.length);
        [names[0], names[i]] = [names[i], names[0]];
    })
    return names[0];
}

console.log('p1', run(parse(input1)));
console.log('p2', run(parse(input2), false));
console.log('p3', run3(parse(input3)));