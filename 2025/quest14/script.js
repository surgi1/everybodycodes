const parse = input => input.split('\n').map(row => row.split('').map(v => v == '#' ? 1 : 0))

const DIRS = [[-1, -1], [-1, 1], [1, -1], [1, 1]]; // diagonals

const onMap = (map, x, y) => map[y] !== undefined && map[y][x] !== undefined ? map[y][x] : 0;
const val = map => map.flat().reduce((a, v) => a+v, 0);

const advance = map => map.map((row, y) => row.map((v, x) => {
    let activeDiagonals = DIRS.reduce((a, [dx, dy]) => a + onMap(map, x+dx, y+dy) , 0)
    if (v == 1) {
        return activeDiagonals % 2 == 1 ? 1 : 0
    } else {
        return activeDiagonals % 2 == 0 ? 1 : 0
    }
}))

const p1 = (map, rounds = 10) => {
    let res = 0;
    for (let i = 0; i < rounds; i++) {
        map = advance(map);
        res += val(map);
    }
    return res;
}

const getCenterFlat = map => {
    let res = '';
    for (let y = 13; y < 21; y++) for (let x = 13; x < 21; x++) res += ''+map[y][x];
    return res;
}

const p3 = (central, rounds = 1000000000) => {
    // init
    let map = [];
    for (let y = 0 ; y < 34; y++) {
        map[y] = [];
        for (let x = 0; x < 34; x++) map[y][x] = 0;
    }

    let pattern = central.flat().join('');
    let round = 0, matchedRounds = [], matchedRoundsValues = [];

    while (true) {
        map = advance(map);
        round++;
        let center = getCenterFlat(map);
        if (center === pattern) {
            let roundVal = val(map);
            if (matchedRoundsValues.indexOf(roundVal) > 0) break;
            matchedRounds.push(round);
            matchedRoundsValues.push(roundVal);
        }
    }

    let offset = matchedRounds[0];
    let res = matchedRoundsValues.shift();
    let cycleLen = matchedRounds[matchedRounds.length-1]-offset;
    let cycleVal = matchedRoundsValues.reduce((a, v) => a+v, 0);

    res += Math.floor((rounds-offset)/cycleLen)*cycleVal;

    let remaining = (rounds-offset) % cycleLen;

    let i = 1;
    while (remaining > matchedRounds[i] - matchedRounds[i-1]) {
        res += matchedRoundsValues[i-1];
        remaining -= (matchedRounds[i] - matchedRounds[i-1]);
        i++;
    }
    return res;
}

console.log('p1', p1(parse(input1)));
console.log('p2', p1(parse(input2), 2025));
console.log('p3', p3(parse(input3)));
