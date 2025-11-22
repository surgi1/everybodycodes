const parse = input => input.split(',').map(ins => {
    let tmp = ins.split('');
    let turn = tmp.shift();
    return [turn, Number(tmp.join(''))];
})

let canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

let DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]

const onMap = (map, x, y) => map[y] !== undefined && map[y][x] !== undefined ? map[y][x] : 0;

const rotate = (dir, turn) => {
    if (turn === 'L') return [ dir[1] , -dir[0] ]
    return [ -dir[1], dir[0] ];
}

const addv = (a, b) => a.map((v, i) => v+b[i]);
const mulv = (a, n) => a.map(v => v*n);
const cmpv = (a, b) => a.every((v, i) => v == b[i]);

const draw = (walls, start, end) => {
    const xformv = v => mulv(addv(v, offset), zoom);

    ctx.clearRect(0, 0, 1000, 1000);
    ctx.fillStyle = '#000';

    let min = [0, 0], max = [0, 0];

    walls.forEach(w => w.forEach(([x, y]) => {
        if (x < min[0]) min[0] = x;
        if (y < min[1]) min[1] = y;
        if (x > max[0]) max[0] = x;
        if (y > max[1]) max[1] = y;
    }))

    let spread = Math.max(...[0,1].map((_, c) => Math.abs(max[c] - min[c])));

    let zoom = 1000/spread;
    let offset = mulv(min, -1);

    walls.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(...xformv(w[0]));
        ctx.lineTo(...xformv(w[1]));
        ctx.stroke();
    })

    let colors = ['#f00', '#0f0'];
    [start, end].forEach((v, i) => {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(...xformv(v), 3, 0, 2 * Math.PI);
        ctx.fill();
    })
}

const insideWall = (wall, pos) => {
    if (wall[0][0] == wall[1][0]) {
        // vertical wall
        // has to match x and y needs to be within range
        if (wall[0][0] == pos[0]) {
            let from = Math.min(wall[0][1], wall[1][1]),
                to = Math.max(wall[0][1], wall[1][1]);
            if (pos[1] >= from && pos[1] <= to) return true;
        }
    } else {
        // horizontal wall
        // has to match y and x needs to be within range
        if (wall[0][1] == pos[1]) {
            let from = Math.min(wall[0][0], wall[1][0]),
                to = Math.max(wall[0][0], wall[1][0]);
            if (pos[0] >= from && pos[0] <= to) return true;
        }
    }
    return false;
}

// adaptive floodfill
// you always occupy top left corner of the cell
const adaptiveDistanceMap = (map, agridXs, agridYs, froms, wall = '#', path = ' ') => {
    const offMap = (x, y) => x <= 0 || y <= 0 || x >= cols || y >= rows;

    let cols = map[0].length, rows = map.length, cur;
    let filled = map.map(row => row.slice().fill(Infinity)),
        stack = froms.map(from => ({
            pos: [...from],
            dist: 0
        }));

    while (cur = stack.shift()) {
        let [cx, cy] = cur.pos;

        if (filled[cy][cx] <= cur.dist) continue;
        filled[cy][cx] = cur.dist;

        DIRS.forEach(([dx, dy]) => {
            let [x, y] = [cx+dx, cy+dy];
            if (offMap(x, y)) return true;
            if (map[y][x] === wall) return true;

            let cellSize = [Math.abs(agridXs[x] - agridXs[cx]), Math.abs(agridYs[y] - agridYs[cy])];// you always occupy top left corner of the cell, so if you move right or down you move by current cell dimension, if you move left or up you move by neighbouring cell dimension

            stack.push({
                pos: [x, y],
                dist: cur.dist + cellSize[ dx != 0 ? 0 : 1 ]
            })
        })
    }
    return filled;
}

const p2 = instructions => {
    // construct the map
    let walls = []; // vec2 from, to
    let start = [0, 0], pos = [0, 0];

    let dir = [0, -1]; // facing up
    instructions.forEach(([turn, len], i) => {
        dir = rotate(dir, turn);
        let segStart = i == 0 ? addv(pos, dir) : pos.slice(),
            segEnd = addv(pos, mulv(dir, len - (i == instructions.length-1 ? 1 : 0) )); // to cope with the remaining caret, the end point
        walls.push([segStart, segEnd]);
        pos = addv(pos,  mulv(dir, len))
    })
    let end = pos.slice(0);
    draw(walls, start, end);

    let agridXs = [], agridYs = [];
    walls.forEach(w => w.forEach(([x, y]) => {
        if (!agridXs.includes(x)) agridXs.push(x);
        if (!agridYs.includes(y)) agridYs.push(y);
        if (!agridXs.includes(x+1)) agridXs.push(x+1); // since the task defines just the walls, we are interested also in neighbouring spaces, so both x, y +-1 realspace coords
        if (!agridYs.includes(y+1)) agridYs.push(y+1);
        if (!agridXs.includes(x-1)) agridXs.push(x-1);
        if (!agridYs.includes(y-1)) agridYs.push(y-1);
    }))
    agridXs.sort((a, b) => a-b);
    agridYs.sort((a, b) => a-b);

    let agrid = [];
    let cols = agridXs.length, rows = agridYs.length;

    let startLoc, endLoc;

    for (let y = 0; y < rows; y++) {
        agrid[y] = [];
        for (let x = 0; x < cols; x++) {
            let realPos = [agridXs[x], agridYs[y]];
            if (cmpv(start, realPos)) startLoc = [x, y];
            if (cmpv(end, realPos)) endLoc = [x, y];
            if (walls.some(w => insideWall(w, realPos))) agrid[y][x] = '#'; else agrid[y][x] = ' ';
        }
    }

    let dmap = adaptiveDistanceMap(agrid, agridXs, agridYs, [startLoc]);
    return dmap[endLoc[1]][endLoc[0]];
}


console.log('p1', p2(parse(input1)));
console.log('p2', p2(parse(input2)));
console.log('p3', p2(parse(input3)));
