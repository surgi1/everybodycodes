const parse = input => input.split('\n').map(line => line.split(''))

const constructMap = data => {
    let map = [];
    for (let y = 0; y < data.length*2; y++) {
        map[y] = [];
        for (let x = 0; x < data[0].length; x++) map[y][x] = '.';
    }
    data.forEach((row, y) => row.forEach((v, x) => {
        let rowId = y*2 + ((x+y) % 2);
        let colId = x;
        map[rowId][colId] = v;
    }))
    return map    
}

const run = data => {
    let res = 0;
    let map = constructMap(data);

    map.forEach((row, y) => row.forEach((v, x) => {
        if (map[y+1] === undefined) return true;
        if (v !== 'T') return true;
        for (let i = -1; i <= 1; i++) {
            if (map[y+1][x+i] == 'T') res++
        }
    }))

    return res;
}

const nextMoves = (map, refx, refy) => {
    let moves = [];

    if (['T', 'E'].includes(map[refy][refx])) moves.push([refx, refy]); // jumping on a spot are we?

    for (j = -1; j <= 1; j += 2) {
        let y = refy+j;
        if (map[y] === undefined) continue;

        for (let i = -1; i <= 1; i++) {
            if (map[y][refx+i] === undefined) continue;
            if (['T', 'E'].includes(map[y][refx+i])) moves.push([refx+i, y]);
        }
    }

    return moves;
}

const distanceMap = (map, x, y) => {
    let stack = [[x, y, 0]];
    let dmap = [], rows = map.length, cols = map[0].length, cur;
    let res = Infinity;
    
    for (let y = 0; y < rows; y++) {
        dmap[y] = [];
        for (let x = 0; x < cols; x++) {
            dmap[y][x] = Infinity;
        } 
    }

    while (cur = stack.shift()) {
        let [x, y, d] = cur;

        if (dmap[y][x] <= d) continue;
        dmap[y][x] = d;

        if (map[y][x] == 'E') {
            if (d < res) res = d;
            continue;
        }

        nextMoves(map, x, y).forEach(([nx, ny]) => {
            if (dmap[ny][nx] > d+1) stack.push([nx, ny, d+1]);
        })
    }
    return res;
}


const run2 = data => {
    let map = constructMap(data), start = [];

    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == 'S') start = [x, y];
    }))

    return distanceMap(map, ...start);
}

const rotate120deg = map => {
    let map2 = map.map((row, y) => row.map((v, x) => '.'))

    map.forEach((row, y) => row.forEach((v, x) => {
        let tx = y;
        let ty = x - Math.floor(y/2);
        tx += Math.floor(ty/2);
        if (map[ty] === undefined || map[ty][tx] === undefined) return true;
        map2[ty][tx] = v;
    }));
    return map2.map(row => row.reverse());
}

const distanceMaps = (maps, x, y) => {
    let stack = [[x, y, 0]];
    let dmaps = [], rows = maps[0].length, cols = maps[0][0].length, cur;

    let res = Infinity;
    
    for (let i = 0; i < maps.length; i++) {
        dmaps[i] = [];
        for (let y = 0; y < rows; y++) {
            dmaps[i][y] = [];
            for (let x = 0; x < cols; x++) {
                dmaps[i][y][x] = Infinity;
            } 
        }
    }

    while (cur = stack.shift()) {
        let [x, y, d] = cur;

        if (dmaps[d % 3][y][x] <= d) continue;
        dmaps[d % 3][y][x] = d;

        if (maps[d % 3][y][x] == 'E') {
            if (d < res) res = d;
            continue;
        }

        nextMoves(maps[(d+1) % 3], x, y).forEach(([nx, ny]) => {
            stack.push([nx, ny, d+1]);
        })
    }
    return res;
}


const run3 = data => {
    let map = constructMap(data), start = [];
    let map2 = rotate120deg(map);
    let map3 = rotate120deg(map2);

    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == 'S') start = [x, y];
    }))

    return distanceMaps([map, map2, map3], ...start);
}

const run4 = data => {
    let map = constructMap(data);
    let map2 = rotate120deg(map);
    let map3 = rotate120deg(map2);
    let comp = [];

    for (let y = 0; y < map3.length; y++) {
        comp[y] = [];
        for (let x = 0; x < map3[0].length; x++) {
            comp[y][x] = ' ';
            if (map3[y][x] !== '.') comp[Math.floor(y / 2)][x] = map3[y][x];
        }
    }

    document.getElementById('root').innerHTML = comp.map(row => row.join('')).join('\n');
}

console.log('p1', run(parse(input1)));
console.log('p2', run2(parse(input2)));
console.log('p3', run3(parse(input3)));
run4(parse(input4));

