const init = (input) => input.split(',').map(s => [s[0], Number(s.substr(1))] )
const init2 = (input) => input.split("\n").map(s => init(s));
const addVect = (a, b) => a.map((v, c) => v+b[c]);
const k = v => v.join('_');

const MOVES = {
    U: [0, 1, 0], // y grows up
    D: [0, -1, 0], // y grows up
    R: [1, 0, 0],
    L: [-1, 0, 0],
    F: [0, 0, 1],
    B: [0, 0, -1],
}

const movesVects = Object.values(MOVES);

const SEG_TYPE = {
    BASIC: 0,
    TRUNK: 1,
    LEAF: 2,
    TRUNK_LEAF: 3,
}

const p1 = (arr) => {
    let maxY = 0, pos = [0, 0, 0];
    arr.forEach(([move, step]) => {
        for (let i = 0; i < step; i++) pos = addVect(pos, MOVES[move]);
        if (pos[1] > maxY) maxY = pos[1];
    })
    return maxY;
}

const segType = (pos, final, cmp = 0) => {
    let res = SEG_TYPE.BASIC;
    if (pos[0] == 0 && pos[2] == 0) res += SEG_TYPE.TRUNK;
    if (final) res += SEG_TYPE.LEAF;
    return Math.max(cmp, res);
}

const p2 = (data, raw = false) => {
    let segs = {};
    data.forEach(plant => {
        let pos = [0, 0, 0];
        plant.forEach(([move, step], n) => {
            for (let i = 0; i < step; i++) {
                pos = addVect(pos, MOVES[move]);
                segs[k(pos)] = {type: segType(pos, (n == plant.length-1) && (i == step-1), segs[k(pos)]?.type), pos: [...pos]};
            }
        })
    })
    return raw ? segs : Object.keys(segs).length;
}

// floodfill along the branches in 3d
const shortest = (from, segs, to) => {
    let filled = {},
        minDist = Infinity,
        stack = [{
            pos: [...from],
            dist: 0
        }]

    while (stack.length != 0) {
        let cur = stack.shift();

        // this shortcut work only as long as we don't have a "hole" in the trunk
        if (cur.pos[0] == to[0] && cur.pos[2] == to[2]) {
            cur.dist += Math.abs(cur.pos[1] - to[1]);
            cur.pos[1] = to[1];
        }

        if (cur.pos[0] == to[0] && cur.pos[2] == to[2] && cur.pos[1] == to[1]) {
            if (cur.dist < minDist) minDist = cur.dist;
            continue;
        }

        let ck = k(cur.pos);
        if (filled[ck] !== undefined && filled[ck] <= cur.dist) continue;
        filled[ck] = cur.dist;

        movesVects.forEach(m => {
            let npos = addVect(cur.pos, m);
            let nk = k(npos);
            if (segs[nk] === undefined) return true;
            if (filled[nk] !== undefined && filled[nk] <= cur.dist+1) return true;
            stack.push({
                pos: npos,
                dist: cur.dist+1
            })
        })
    }
    return minDist;
}

// rather slow, takes approx ~6s, could be sped up by flood filling from the trunk
const p3 = data => {
    let segs = p2(data, true);
    let leaves = Object.values(segs).filter(o => [SEG_TYPE.LEAF, SEG_TYPE.TRUNK_LEAF].includes(o.type)).map(o => o.pos);
    let trunks = Object.values(segs).filter(o => [SEG_TYPE.TRUNK, SEG_TYPE.TRUNK_LEAF].includes(o.type)).map(o => o.pos);

    return Math.min(...trunks.map(trunkPos => leaves.reduce((a, leafPos) => a + shortest(leafPos, segs, trunkPos), 0)))
}

console.log('p1', p1(init(input1)));
console.log('p2', p2(init2(input2)));
console.log('p3', p3(init2(input3)));
