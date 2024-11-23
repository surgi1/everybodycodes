const init = (input) => input.split("\n").map(line => line.split(''));
const addVect = (a, b) => a.map((v, c) => v+b[c]);
const k = v => v.join('_');

const MOVES = {
    U: [0, 1], // y grows up
    D: [0, -1], // y grows up
    R: [1, 0],
    L: [-1, 0],
}

const movesVects = Object.values(MOVES);

let dmaps = {};

const distanceMap = (map, from) => {
    let key = k(from);
    if (dmaps[key] !== undefined) return dmaps[key];
    let stack = [{
            p: [...from],
            dist: 0
        }]

    let filled = map.map(row => row.map(v => Infinity))

    while (stack.length != 0) {
        let cur = stack.shift();
        if (filled[cur.p[1]][cur.p[0]] <= cur.dist) continue;
        filled[cur.p[1]][cur.p[0]] = cur.dist;

        movesVects.forEach(m => {
            let np = addVect(cur.p, m);
            if (np[0] < 0 || np[0] > map[0].length-1 || np[1] < 0 || np[1] > map.length-1) return true;
            if (['~', '#'].includes(map[np[1]][np[0]])) return true;
            if (filled[np[1]][np[0]] <= cur.dist+1) return true;
            stack.push({
                p: np,
                dist: cur.dist+1
            })
        })
    }
    dmaps[key] = filled;
    return filled;
}

const p1 = (map) => {
    let res = '';
    let start = [0, 0]; // x, y
    let fruits = [], fruitTypes = {};
    map.forEach((row, y) => row.forEach((v, x) => {
        if (y == 0 && v == '.') start[0] = x;
        if (['~', '#', '.'].includes(v)) return true;
        fruits.push({type : v, p: [x, y]});
        fruitTypes[v] = 1;
    }))

    //console.log(map, start, fruits, fruitTypes);
    let dmap = distanceMap(map, start);

    return 2*Math.min(...fruits.map(o => dmap[o.p[1]][o.p[0]]))
}

const permutator = (inputArr) => {
    let result = [];
    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(inputArr)
    return result;
}

const p2 = (map, start, end) => {
    dmaps = {};

    let fruits = [], fruitTypes = {};

    map.forEach((row, y) => row.forEach((v, x) => {
        if (y == 0 && v == '.' && start == undefined) start = [x, y];
        if (['~', '#', '.'].includes(v)) return true;
        fruits.push({type : v, p: [x, y]});
        if (fruitTypes[v] == undefined) fruitTypes[v] = 0;
        fruitTypes[v]++;
    }))

    if (end == undefined) end = [...start];

    //console.log(fruitTypes);

    let min = Infinity;
    let dmap0 = distanceMap(map, start);

    const recur = (seq, lastDist, lastDmap) => {
        fruits.filter(o => o.type == seq[0]).forEach(fruit => {
            let dist = lastDist + lastDmap[fruit.p[1]][fruit.p[0]];
            let dmap = distanceMap(map, fruit.p);

            if (seq.length > 1) {
                recur(seq.slice(1), dist, dmap)
            } else {
                dist += dmap[end[1]][end[0]];
                if (dist < min) min = dist;
            }
        })
    }

    permutator(Object.keys(fruitTypes)).forEach(sequence => recur(sequence, 0, dmap0))

    return min;
}

// this is not a generic P3 solution; it works for my input, which has juscntion points from middle section to left and right at the very bottom, and has herbs close enough
// still, I had to alter the input slightly by renaming one of the herbs in the lowest line middle section (K->L) so they are unique (and had to be visited)
const p3 = (map) => {
    let maps = [];
    for (let i = 0; i < 3; i++) {
        maps[i] = map.map(row => row.slice(85*i, 85*(i+1)))
    }

    //maps.forEach(m => m.forEach(l => console.log(l.join(''))) );

    let map0Dist = p2(maps[0], [maps[0][0].length-1, maps[0].length-2]) + 1; // +1 for moving between maps
    let map2Dist = p2(maps[2], [0, maps[2].length-2]) + 1; // +1 for moving between maps

    let dist = p2(maps[1]) + 2 + 4; // +2 from moving between maps, +4 from moving from the herbs 1 square away from the corner

    return map0Dist + map2Dist + dist;
}


console.log('p1', p1(init(input1)));
console.log('p2', p2(init(input2)));
console.log('p3', p3(init(input3)));
