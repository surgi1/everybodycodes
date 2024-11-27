const init = (input) => {
    let lines = input.split("\n");
    let cnt = Math.ceil(lines[0].length/4);
    let wheels = Array.from({length:cnt}, () => []);
    lines.forEach(line => {
        let tmp = line.split('');
        wheels.forEach((w, i) => {
            let s = tmp.slice(i*4, i*4+3);
            if (s.join('').trim() != '') w.push(s);
        })
    })
    return wheels;
};

const gcd = (a, b) => b == 0 ? a : gcd(b, a % b);
const lcm = (a, b) => a / gcd(a, b) * b;
const lcmAll = arr => arr.reduce(lcm, 1);

const eyes = a => [a[0], a[2]];
const getPull = (rots, wheels, repeats) => rots.map((n, i) => wheels[i][(n*repeats) % wheels[i].length])
const p1 = (rots, wheels, repeats = 100) => getPull(rots, wheels, repeats).map(n => n.join('')).join(' ');

const getPull3 = (rots, wheels, pos, shift = 0) => {
    pos = pos.map((p, i) => (p + rots[i] + shift + wheels[i].length) % wheels[i].length);
    return [rots.map((n, i) => wheels[i][pos[i]]), pos];
}

const getScore = (s, o = {}) => {
    s.map(eyes).flat().forEach(l => (o[l] === undefined ? o[l] = 1 : o[l]++));
    return Object.values(o).reduce((a, v) => a + Math.max(0, v-2), 0);
}

const p2 = (rots, wheels, totalReps = 202420242024) => {
    let uniques = lcmAll(wheels.map(w => w.length)),
        masterReps = Math.floor(totalReps/uniques),
        res = 0;

    for (let i = 1; i <= uniques; i++) res += getScore(getPull(rots, wheels, i));

    res *= masterReps;

    for (let i = masterReps*uniques+1; i <= totalReps; i++) res += getScore(getPull(rots, wheels, i));

    return res;
}

const EXTREME_TYPES = [{
    val: Math.max,
    init: -Infinity
}, {
    val: Math.min,
    init: Infinity
}]

const p3 = (rots, wheels, reps = 10) => {
    let cache = EXTREME_TYPES.map(t => ({}));

    const recur = (turns, pos, type) => {
        let k = pos + '_' + turns;
        
        if (cache[type][k] !== undefined) return cache[type][k];
        cache[type][k] = EXTREME_TYPES[type].init;
        
        let paps = [-1, 0, 1].map(shift => getPull3(rots, wheels, [...pos], shift)); // pull results and positions for each shift
        let scores = paps.map(([pull, newPos]) => getScore(pull));

        if (turns > 1) scores = scores.map((v, i) => v + recur(turns-1, paps[i][1], type));

        let score = EXTREME_TYPES[type].val(...scores);
        cache[type][k] = score;

        return score;
    }

    return EXTREME_TYPES.map((t, tId) => recur(reps, Array(rots.length).fill(0), tId)).join(' ');
}

console.log('p1', p1(rots1, init(input1)));
console.log('p2', p2(rots2, init(input2)));
console.log('p3', p3(rots3, init(input3), 256))
