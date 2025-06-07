const parse = input => input.split('\n').map(line => line.match(/\d+/g).map(Number))

const part1 = input => {
    let snails = parse(input);
    const move = () => snails.forEach(([x, y], i) => {
        x++;
        y--;
        if (y == 0) { y = x-1; x = 1;}
        snails[i] = [x, y]
    })

    for (let i = 0; i < 100; i++) move();
    return snails.reduce((a, [x, y]) => a + x + 100*y, 0)
}

const part2 = input => {
    let snails = parse(input), t = 0;

    const move = () => snails.forEach(([x, y], i) => {
        x++;
        y--;
        if (y == 0) {
            y = x-1;
            x = 1;
        }
        snails[i] = [x, y];
    })

    while (snails.some(([x, y]) => x != 1)) {
        move();
        t++;
    }

    return t-1;
}


const gcd = (a, b) => b == 0 ? a : gcd(b, a % b);
const lcm = (a, b) => a / gcd(a, b) * b;
const lcmAll = arr => arr.reduce(lcm, 1);

const chinese = (starts, frequencies, multiplicator = 1, t = 1) => {
    for (let i = 0; i < starts.length; i++) {
        while ((t - starts[i]) % frequencies[i] != 0) t += multiplicator;
        multiplicator = lcm(frequencies[i], multiplicator);
    }
    return t;
}

const part3 = input => {
    let snails = parse(input);

    let periods = [], t = 0;

    snails.forEach((snail, i) => periods[i] = []);

    const move = () => snails.forEach(([x, y], i) => {
        x++;
        y--;
        if (y == 0) {
            y = x-1;
            x = 1;
            if (periods[i].length < 2) periods[i].push(t);
        }
        snails[i] = [x, y];
    })

    while (periods.some(v => v.length < 2)) {
        move();
        t++;
    }

    return chinese(periods.map(v => v[0]), periods.map(v => v[1] - v[0]))
}

console.log('p1', part1(input1));
console.log('p2', part2(input2));
console.log('p3', part3(input3));
