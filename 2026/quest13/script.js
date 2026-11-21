const extractNumeric = line => line.match(/-?\d+/g);

const gcd = (a, b) => {
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a < 0n ? -a : a;
};

const lcm = (a, b) => a / gcd(a, b) * b;

const divEuclid = (a, b) => {
    let q = a / b;
    if (a % b < 0n) q--;
    return q;
};

const meetings = (from, to, lcm) => {
    const sign = to > from ? 1n : to < from ? -1n : 0n;

    return divEuclid(sign * to, lcm)
         - divEuclid(sign * from, lcm);
};

const run = clock => {
    const nums = extractNumeric(clock).map(BigInt);

    const segments = nums.slice(0, 3);
    const current = nums.slice(3, 6);
    const moves = nums.slice(6, 9);

    const directions = clock.trim().split(/\s+/)[3].split(':');

    const period = lcm(lcm(segments[0], segments[1]), segments[2]);

    const hands = directions.map((direction, i) => {
        const scale = period / segments[i];
        const speed = direction === 'CW' ? scale : -scale;

        return [current[i] * scale, speed, moves[i]];
    });

    hands.sort((a, b) => a[2] < b[2] ? -1 : a[2] > b[2] ? 1 : 0);

    let total = 0n;

    for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) {
        const [p1, v1, s1] = hands[i];
        const [p2, v2, s2] = hands[j];

        const first = p2 - p1;
        const second = first + (v2 - v1) * s1;
        const third = second + v2 * (s2 - s1);

        total += meetings(first, second, period)
               + meetings(second, third, period);
    }

    return total;
};

const run2 = input => input.split('\n\n').reduce((sum, clock) => sum + run(clock), 0n);

console.log('p1', run(input1).toString());
console.log('p2', run2(input2).toString());
console.log('p3', run2(input3).toString());