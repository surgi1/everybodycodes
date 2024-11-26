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

let cache = {}

const getScore = s => {
    let k = s.join('');
    if (cache[k] !== undefined) return cache[k];
    let o = {};
    s.forEach(l => (o[l] === undefined ? o[l] = 1 : o[l]++));
    let vals = Object.values(o);
    let res = vals.reduce((a, v) => a + Math.max(0, v-2), 0);
    cache[k] = res;
    return res;
}

const p2 = (rots, wheels, totalReps = 202420242024) => {
    let uniques = lcmAll(wheels.map(w => w.length));
    let res = 0;

    for (let i = 1; i <= uniques; i++) {
        let pull = getPull(rots, wheels, i);
        let pullScore = getScore( pull.map(eyes).flat() );
        res += pullScore;
    }

    let masterReps = Math.floor(totalReps/uniques);
    res *= masterReps;

    for (let i = masterReps*uniques+1; i <= totalReps; i++) {
        let pull = getPull(rots, wheels, i);
        let pullScore = getScore( pull.map(eyes).flat() );
        res += pullScore;
    }
    return res;
}

// p3 is real slow, about 40s. Likely need to figure out a better caching
const p3 = (rots, wheels, reps = 10) => {
    let min = Infinity, max = -Infinity,
        seenMin = {}, seenMax = {};

    const recur = (pullsLeft, score, pos) => {
        let k = pos + '_' + pullsLeft;
        
        let goon = false;

        if (seenMin[k] === undefined || seenMin[k] > score) {seenMin[k] = score; goon = true;}
        if (seenMax[k] === undefined || seenMax[k] < score) {seenMax[k] = score; goon = true;}

        if (!goon) return;
        
        if (pullsLeft <= 0) {
            if (score < min) min = score;
            if (score > max) max = score;
            return;
        }

        let [pull1, pos1] = getPull3(rots, wheels, [...pos]);
        let [pull2, pos2] = getPull3(rots, wheels, [...pos], 1);
        let [pull3, pos3] = getPull3(rots, wheels, [...pos], -1);

        recur(pullsLeft-1, score + getScore(pull1.map(eyes).flat()), pos1);
        recur(pullsLeft-1, score + getScore(pull2.map(eyes).flat()), pos2);
        recur(pullsLeft-1, score + getScore(pull3.map(eyes).flat()), pos3);
    }

    recur(reps, 0, Array.from({length:rots.length}).fill(0));

    return max + ' ' + min;
}

console.log('p1', p1(rots1, init(input1)));
console.log('p2', p2(rots2, init(input2)));
console.log('p3', p3(rots3, init(input3), 256))
