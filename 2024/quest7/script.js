const init = input => input.split("\n").map(line => {
    let tmp = line.split(/:|,/);
    let id = tmp.shift();
    return {id: id, vals: tmp, powers: [], sum: 0}
})

const DIRS = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
]

const SIGN = {
    '+': 1,
    '-': -1,
    '=': 0,
    'S': 0
}

const buildTrack = trackLit => {
    let map = trackLit.split('\n').map(line => line.split(''));
    let [prevX, prevY] = [0, 0], [curX, curY] = [1, 0], res = '';

    while (map[curY][curX] != 'S') {
        res += map[curY][curX];
        DIRS.some(([dx, dy]) => {
            let [x, y] = [curX+dx, curY+dy];
            if (x == prevX && y == prevY) return false;
            if (y < 0 || y > map.length-1 || x < 0 || x > map[0].length-1) return false;
            if (map[y][x] == ' ' || map[y][x] == undefined) return false;
            [prevX, prevY] = [curX, curY];
            [curX, curY] = [x, y];
            return true;
        })
    }
    return (res + 'S').split('');
}

const race = (powers, vals, segments, racetrack) => {
    for (let seg = 0; seg < segments; seg++) {
        let pow = 10;
        if (seg > 0) pow = powers[seg-1];
        let action = SIGN[racetrack[seg % racetrack.length]];
        if (action == 0) action = SIGN[vals[seg % vals.length]];
        powers[seg] = Math.max(0, pow + action);
    }
    return powers.reduce((a, v) => a+v, 0);
}

const run = (input, racetrack = ['='], loops = 0, segments) => {
    let arr = init(input);

    if (loops != 0) segments = racetrack.length * loops;

    arr.forEach((p, i) => p.sum = race(p.powers, p.vals, segments, racetrack));

    return arr.sort((a, b) => b.sum - a.sum).map(p => p.id).join('');
}

const run3 = (vals, racetrack, loops) => race([], vals, racetrack.length * loops, racetrack);

const planValid = plan => plan.filter(v => v == '+').length == 5 && plan.filter(v => v == '-').length == 3 && plan.filter(v => v == '=').length == 3;

const part3 = () => {
    const NUM2SIGN = ['+', '-', '='];

    let laps = 11; // no need to test for 2024 (altho it finishes in 2 minutes or so), since track.length (340) % plan.length (11) = 10, every lap the plan is shifted by 1. After 11 laps it will reset and repeat.

    let track = buildTrack(track3),
        toBeat = run3(input3.split(','), track, laps),
        res = 0;

    for (let i = 0; i < Math.pow(3, 11); i++) {
        let plan = i.toString(3).padStart(11, '0').split('').map(v => NUM2SIGN[v]);
        if (planValid(plan) && run3(plan, track, laps) > toBeat) res++;
    }
    return res;
}

console.log('p1', run(input1, '=', 0, 10));
console.log('p2', run(input2, buildTrack(track2), 10));
console.log('p3', part3());
