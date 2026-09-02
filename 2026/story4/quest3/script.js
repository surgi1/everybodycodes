const extractNumeric = line => line.match(/-?\d+/g)[0];

const parse = input => {
    let [w, h, ho, vo] = input.split('\n');
    return {
        w: Number(extractNumeric(w)),
        h: Number(extractNumeric(h)),
        horiz: extractNumeric(ho),
        vert: extractNumeric(vo),
    }
}

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const draw = map => {
    let el = document.getElementById('root');
    let s = map.map(row => row.map(v => v === 1 ? '#' : (v === 0 ? ' ' : v)).join('')).join('\n');
    //console.log(s);
    el.innerHTML = s;
}

// constructing standard grid, borders and cells have the same "size"
const constructMap = data => {
    let map = [];
    for (let y = 0; y <= data.h*2; y++) {
        map[y] = [];
        for (let x = 0; x <= data.w*2; x++) {
            map[y][x] = 0;
        }
    }

    for (let i = 0; i <= data.h; i++) {
        let v = data.horiz[i % data.horiz.length];
        for (let j = 0; j < data.w; j++) {
            if (v === '0') {
                // draw a stitch
                for (let x = 0; x < 3; x++) map[i*2][j*2 + x] = 1;
            }
            v = v === '1' ? '0' : '1';
        }
    }

    for (let j = 0; j <= data.w; j++) {
        let v = data.vert[j % data.vert.length];
        for (let i = 0; i < data.h; i++) {
            if (v === '0') {
                // draw a stitch
                for (let y = 0; y < 3; y++) map[i*2 + y][j*2] = 1;
            }
            v = v === '1' ? '0' : '1';
        }
    }

    return map;
}

const getSingles = map => {
    let singles = [];
    for (let y = 1; y < map.length-1; y++) for (let x = 1; x < map[y].length-1; x++) {
        if (map[y][x] === 1) continue;
        let borders = 0;
        DIRS.forEach(([dx, dy]) => {
            if (map[y+dy][x+dx] === 1) borders++;
        })
        if (borders === 4) singles.push([x, y]);
    }

    return singles
}

const run1 = (data) => getSingles(constructMap(data)).length;

const colorMap = (map, sx, sy, v) => {
    const onMap = (x, y) => map[y] !== undefined && map[y][x] !== undefined;

    let stack = [[sx, sy]];

    while (stack.length > 0) {
        let [x, y] = stack.pop();
        if (map[y][x] !== 0) continue;
        map[y][x] = v;
        DIRS.forEach(([dx, dy]) => {
            let nx = x+dx, ny = y+dy;
            if (onMap(nx, ny) && map[ny][nx] === 0) stack.push([nx, ny]);
        })
    }
}

const colorize = map => {
    // color it
    let lastSeenColor = 3;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) continue; // wall

            if (map[y][x] !== 0) {
                lastSeenColor = map[y][x];
                continue;
            }

            // we need to color the map, spread from x, y, use color that is not lastSeenColor
            colorMap(map, x, y, lastSeenColor === 2 ? 3 : 2);
            lastSeenColor = lastSeenColor === 2 ? 3 : 2;
        }
    }
}

const run2 = data => {
    let map = constructMap(data);

    colorize(map);

    draw(map);

    let groups = [0, 0, 0, 0];
    getSingles(map).forEach(([x, y]) => {
        groups[ map[y][x] ]++;
    })
    console.log(groups);
}

// simulate smaller map with sufficient multipliers, see input.js for more details
const run3 = data => {
    let origW = data.w;
    let origH = data.h;
    let horizLen = data.horiz.length;
    let vertLen = data.vert.length;

    let tiles = [2, 2]; // reduce map to x/y full tiles plus overflows; both need to be even for .. err some reason..

    let horizMult = Math.floor(origH / (tiles[1]*horizLen));
    let vertMult = Math.floor(origW / (tiles[0]*vertLen));

    data.w = tiles[0]*vertLen + (origW % (tiles[0]*vertLen));
    data.h = tiles[1]*horizLen + (origH % (tiles[1]*horizLen));

    let map = constructMap(data);

    colorize(map);

    draw(map);
    console.log(map);

    let groups = [0, 0, 0, 0, 0];
    getSingles(map).forEach(([x, y]) => {
        let mult = horizMult * vertMult;
        if (x > 2*tiles[0]*vertLen) mult /= vertMult;
        if (y > 2*tiles[1]*horizLen) mult /= horizMult;
        groups[ map[y][x] ] += mult;
    })
    console.log(groups);
}


console.log('p1', run1(parse(input1)));
console.log('p2', run2(parse(input2)));
console.log('p3', run3(parse(input3)));
