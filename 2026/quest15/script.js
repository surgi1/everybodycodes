const parse = input => input.split('\n').map((line, y) => line.split(''))

const processMap = map => {
    let start, end, gates = [], ores = [], rows = map.length, cols = map[0].length;
    for (let x = 0; x < cols; x++) {
        let nonWalls = [];
        for (let y = 0; y < rows; y++) {
            if (map[y][x] !== '#') nonWalls.push([x, y]);
            if (map[y][x] === '@') ores.push([x, y]);
            if (map[y][x] === 'S') start = [x, y];
            if (map[y][x] === 'E') end = [x, y];
            if (map[y][x] !== '#') map[y][x] = '.';
        }
        if (nonWalls.length === 1) gates.push(nonWalls[0]);
    }

    return {
        map: map,
        rows: rows,
        cols: cols,
        gates: gates,
        ores: ores,
        start: start,
        end: end,
    }
}

const D = {
    RIGHT: 0,
    DOWN: 1,
    LEFT: 2,
    UP: 3
}

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

// get distances to endpoints being ores
const distanceMap = (map, start, startingDir = D.RIGHT, startingDist = 0, endPoints = false, maxDist = 10000) => {
    let stack = [[start[0], start[1], startingDist, startingDir]];
    let dmap = [], rows = map.length, cols = map[0].length, cur;
    
    for (let y = 0; y < rows; y++) {
        dmap[y] = [];
        for (let x = 0; x < cols; x++) {
            dmap[y][x] = [Infinity, Infinity, Infinity, Infinity]; // in 4 dirs
        } 
    }

    while (cur = stack.pop()) {
        let [x, y, dist, dir] = cur;

        if (dist > maxDist) continue;

        dmap[y][x][dir] = dist;

        if (dist > startingDist && endPoints.filter(p => p[0] === x && p[1] === y).length > 0) continue;

        DIRS.forEach(([dx, dy], ndir) => {
            if (ndir === (dir + 2) % 4) return true; // no u-turns
            let nx = x+dx, ny = y+dy;

            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) return true;
            if (map[ny][nx] === '#') return true;

            let ndist = dist + 1;
            if (ndist >= maxDist) return true;

            if (dmap[ny][nx][ndir] > ndist) stack.push([nx, ny, ndist, ndir]);
        })
    }
    return dmap;
}

const nextSteps = (map, start, startingDir, startingDist, gates, ores, picked = []) => {
    let res = [];

    let dmap = distanceMap(map, start, startingDir, startingDist, [...ores, ...gates]);
    //console.log(dmap);
    ores.forEach(([ox, oy], oi) => {
        DIRS.forEach(([dx, dy], dir) => {
            if (dmap[oy][ox][dir] !== Infinity) {
                //console.log('can pick ore at', ox, oy, 'from direction', dx, dy, 'distance from start', dmap[oy][ox][dir]);
                res.push({
                    dist: dmap[oy][ox][dir],
                    x: ox,
                    y: oy,
                    dir: dir,
                    picked: [...picked, [ox, oy]]
                })
            }
        })
    })

    if (res.length === 0) {
        // let's try gates that are != start
        gates.forEach(([gx, gy], gi) => {
            DIRS.forEach(([dx, dy], dir) => {
                if (dmap[gy][gx][dir] !== Infinity && !(gy === start[1] && gx === start[0])) {
                    //console.log('can go to gate', gx, gy, 'from direction', dx, dy, 'distance from start', dmap[gy][gx][dir]);
                    res.push({
                        dist: dmap[gy][gx][dir],
                        x: gx,
                        y: gy,
                        dir: dir,
                        picked: picked
                    })
                }
            })
        })
    }

    return res;
}

const excludePicked = (ores, picked) => ores.filter(([ox, oy]) => picked.filter(([px, py]) => px === ox && py === oy).length === 0)

const pickBetweenGates = (map, gates, ores, gate0, gate1) => {

    let toPick = ores.filter(([x, y]) => x > gate0[0] && x < gate1[0]).length;

    //console.log('picking', toPick);

    let stack = nextSteps(map, gate0, D.RIGHT, 0, gates, ores), cur, min = Infinity;

    while (cur = stack.pop()) {
        // figure out next steps from new starting pt and dir without picked ore
        if (cur.picked.length >= toPick && cur.x === gate1[0] && cur.y === gate1[1]) {
            if (cur.dist < min) {
                min = cur.dist;
                //console.log('new min dist for picking everything', min, cur);
            }
            continue;
        }

        stack.push(...nextSteps(map, [cur.x, cur.y], cur.dir, cur.dist, gates, excludePicked(ores, cur.picked), cur.picked))
    }

    return min;
}

// p1 here
const run = ({map, rows, cols, gates, ores, start, end}) => {
    // shortest distance picking all the ores between gates[0] and gates[1]
    let total = 0;
    for (let n = 1; n < gates.length; n++) {
        total += pickBetweenGates(map, gates, ores, gates[n-1], gates[n]);
    }

    return total;
}

//console.log('p1', run(processMap(parse(input1))));


const solve = (input, target) => {
    const grid = input.trimEnd().split(/\r?\n/);
    const R = grid.length, C = grid[0].length;

    let start, end;

    for (let x = 0; x < R; x++) {
        for (let y = 0; y < C; y++) {
            if (grid[x][y] === 'S') start = [x, y];
            if (grid[x][y] === 'E') end = [x, y];
        }
    }

    const bestResults = [];
    const queue = [[start[0], start[1], 0, 1, 0, 1]];
    const visited = new Set();
    let head = 0;

    while (head < queue.length) {
        let [x, y, dx, dy, e, time] = queue[head++];

        x += dx;
        y += dy;

        if (x < 0 || x >= R || y < 0 || y >= C) continue;
        if (grid[x][y] === '#') continue;

        const key = `${x},${y},${dx},${dy},${e}`;
        if (visited.has(key)) continue;
        visited.add(key);

        if (grid[x][y] === '@') e++;

        if (x === end[0] && y === end[1]) {
            bestResults.push([e, time]);
            if (bestResults.length > 3000) break;
        }

        queue.push([x, y, dx, dy, e, time + 1]);
        queue.push([x, y, dy, -dx, e, time + 1]);
        queue.push([x, y, -dy, dx, e, time + 1]);
    }

    const isPeriod = p => {
        const n = bestResults.length;
        if (n < 21 * p) return false;

        const costDiff = bestResults[n-1][0] - bestResults[n-1-p][0];
        const timeDiff = bestResults[n-1][1] - bestResults[n-1-p][1];

        for (let j = 0; j < 20 * p; j++) {
            if (bestResults[n-1-j][0] - bestResults[n-1-p-j][0] !== costDiff) return false;
            if (bestResults[n-1-j][1] - bestResults[n-1-p-j][1] !== timeDiff) return false;
        }

        return true;
    };

    let period = -1;

    for (let p = 1; p < 200; p++) {
        if (isPeriod(p)) {
            period = p;
            break;
        }
    }

    if (period === -1) throw new Error('Period not found');

    const n = bestResults.length;
    const costDiff = bestResults[n-1][0] - bestResults[n-1-period][0];
    const timeDiff = bestResults[n-1][1] - bestResults[n-1-period][1];

    console.log({ period, costDiff, timeDiff });

    const getTimeForCost = exactCost => {
        const [lastCost] = bestResults[n-1];

        let periods = Math.floor((exactCost - lastCost) / costDiff);

        while (exactCost - periods * costDiff > lastCost) {
            periods++;
        }

        const targetCost = exactCost - periods * costDiff;
        let cycleStart = n - 1;

        while (cycleStart >= 0 && bestResults[cycleStart][0] !== targetCost) {
            cycleStart--;
        }

        if (cycleStart < 0) throw new Error('Target cost not found');

        return bestResults[cycleStart][1] + timeDiff * periods;
    };

    return getTimeForCost(target);
};

console.log('p2', solve(input2, 2026));
console.log('p3', solve(input3, 202620262026));