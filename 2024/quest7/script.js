const init = input => input.split("\n").map(line => {
    let tmp = line.split(/:|,/)
    let id = tmp.shift()
    return {id: id, vals: tmp, powers: [], sum: 0}
})

const DIRS = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
]

const buildTrack = trackLit => {
    let map = trackLit.split('\n').map(line => line.split(''));
    let prev = [0,0], cur = [1,0], res = ''; // [x, y]

    while (map[cur[1]][cur[0]] != 'S') {
        res += map[cur[1]][cur[0]];
        DIRS.some(([dx, dy]) => {
            let x = cur[0]+dx, y = cur[1]+dy;
            if (x == prev[0] && y == prev[1]) return false;
            if (y < 0 || y > map.length-1 || x < 0 || x > map[0].length-1) return false;
            if ( !['+', '-', '=', 'S'].includes( map[y][x])) return false;
            prev = cur.slice();
            cur = [x, y];
            return true;
        })
    }
    return res + 'S';
}

const sign = {
    '+': 1,
    '-': -1,
    '=': 0,
    'S': 0
}

const run = (input, racetrack = ['='], loops = 0, segments) => {
    let arr = init(input);

    if (loops != 0) segments = racetrack.length * loops;

    for (let seg = 0; seg < segments; seg++) arr.forEach((p, i) => {
        let pow = 10;
        if (seg > 0) pow = p.powers[seg-1];
        let action = sign[racetrack[seg % racetrack.length]];
        if (action == 0) action = sign[p.vals[seg % p.vals.length]];
        arr[i].powers[seg] = Math.max(0, pow + action);
    })

    arr.forEach((p, i) => {
        p.sum = p.powers.reduce((a, v) => a+v, 0);
    })

    return arr.sort((a, b) => b.sum - a.sum).map(p => p.id).join('');
}

const run3 = (vals, racetrack = ['='], loops = 0, segments) => {
    let powers = [], trackLen = racetrack.length, valsLen = vals.length;

    if (loops != 0) segments = (trackLen * loops);

    for (let seg = 0; seg < segments; seg++) {
        let pow = 10;
        if (seg > 0) pow = powers[seg-1];
        let action = sign[racetrack[seg % trackLen]];
        if (action == 0) action = sign[vals[seg % valsLen]];
        powers[seg] = Math.max(0, pow + action);
    }

    return powers.reduce((a, v) => a+v, 0);
}

const planValid = plan => plan.filter(v => v == '+').length == 5 && plan.filter(v => v == '-').length == 3 && plan.filter(v => v == '=').length == 3;

const part3 = () => {
    const nmap = ['+', '-', '='];

    let laps = 11; // no need to test for 2024 (altho it finishes in 2 minutes or so), since track.length (340) % plan.length (11) = 10, so every lap the plan is shifted by 1. After 11 plans it will reset and repeat.

    let track = buildTrack(track3).split(''),
        res = 0, total = Math.pow(3, 11),
        toBeat = run3(input3.split(','), track, laps);

    for (let i = 0; i < total; i++) {
        let plan = i.toString(3).padStart(11, '0').split('').map(v => nmap[v]);
        if (planValid(plan)) {
            if (run3(plan, track, laps) > toBeat) res++;
        }
    }
    return res;
}

console.log('p1', run(input1, '=', 0, 10));
console.log('p2', run(input2, buildTrack(track2).split(''), 10));
console.log('p3', part3());
