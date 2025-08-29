const parseSections = s => s.split('\n\n');
const nums = s => s.match(/(\d|-)+/g).map(Number);

const parse = input => input.split('\n').map(row => {
    let [idLit, facesLit, seedLit] = row.split(' ');
    return {
        id: nums(idLit)[0],
        faces: nums(facesLit),
        seed: nums(seedLit)[0],
        pulse: nums(seedLit)[0],
        rolls: 0,
        lastResultFaceId: 0,
    }
})

const roll = die => {
    die.rolls++;
    let spin = (die.rolls) * die.pulse;
    die.lastResultFaceId = (die.lastResultFaceId + spin) % die.faces.length;
    die.pulse = (die.pulse + spin) % die.seed;
    die.pulse = die.pulse + 1 + (die.rolls) + die.seed;
    die.spin = spin;
    return die.faces[die.lastResultFaceId];
}

const run = dice => {
    let totalPts = 0, rolls = 0;
    while (totalPts < 10000) {
        dice.forEach(die => totalPts += roll(die))
        rolls++;
    }
    return rolls;
}

const run2 = input => {
    let [diceLit, trackLit] = parseSections(input);
    let dice = parse(diceLit), track = trackLit.split('').map(Number);
    let pos = Array.from({length: dice.length}).fill(0);
    let res = [];
    while (res.length < dice.length) {
        dice.forEach((die, id) => {
            if (pos[id] < track.length) {
                let rollRes = roll(die);
                if (track[pos[id]] == rollRes) {
                    pos[id]++;
                    if (pos[id] == track.length) res.push(die.id);
                }
            }
        })
    }
    return res.join(',');
}

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]];

const run3 = input => {
    let [diceLit, mapLit] = parseSections(input);
    let dice = parse(diceLit), map = mapLit.split('\n').map(row => row.split('').map(Number));
    let maxx = map[0].length-1, maxy = map.length-1;

    let reachedMap = [];
    for (let y = 0; y < map.length; y++) {
        reachedMap[y] = [];
        for (let x = 0; x < map[0].length; x++) reachedMap[y][x] = 0;
    }

    const onMap = (x, y) => x >= 0 && y >= 0 && x <= maxx && y <= maxy;

    // precompute a large enough nr of dice rolls
    let diceRolls = [];
    for (let i = 0; i < map.length * map[0].length; i++) {
        dice.forEach((die, id) => {
            let res = roll(die);
            if (diceRolls[id] == undefined) diceRolls[id] = [];
            diceRolls[id].push(res);
        })
    }

    let queue = [], cur, seen = {};

    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[0].length; x++) {
        diceRolls.forEach((r, i) => {
            if (r[0] == map[y][x]) queue.push({x: x, y: y, id: i, step: 0});
        })
    }

    while (cur = queue.pop()) {
        reachedMap[cur.y][cur.x] = 1;

        DIRS.forEach(([dx, dy]) => {
            let nx = cur.x+dx, ny = cur.y+dy;
            if (onMap(nx, ny) && map[ny][nx] == diceRolls[cur.id][cur.step+1]) {
                let k = [nx, ny, cur.id, cur.step].join(',');
                if (seen[k] === undefined) {
                    seen[k] = 1;
                    queue.push({
                        x: nx, y: ny, id: cur.id, step: cur.step+1
                    })
                }
            }
        })
    }

    document.getElementById('root').innerHTML = reachedMap.map(row => row.map(v => v == '1' ? '#' : ' ').join('')).join('\n');

    return reachedMap.flat().reduce((a, v) => a + v, 0);
}

console.log('p1', run(parse(input1)));
console.log('p2', run2(input2));
console.log('p3', run3(input3));
