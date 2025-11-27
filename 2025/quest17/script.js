const parse = input => {
    let volcano = [0,0], start = [0,0];
    let tmp = input.split('\n').map((row, y) => row.split('').map((v, x) => {
        if (v === '@') {
            volcano = [x, y];
            return 0;
        }
        if (v === 'S') {
            start = [x, y];
            return 0;
        }
        return Number(v);
    }));
    return [volcano, tmp, start];
}

let dist = (a, b) => Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2);

let sum = arr => arr.reduce((a, v) => a+v, 0);

const p1 = ([volcano, map], r = 10) => {
    let res = 0;
    map.forEach((row, y) => row.forEach((v, x) => {
        if (dist(volcano, [x, y]) <= r*r) res += v;
    }))
    return res;
}

const p2 = ([volcano, map], raw = false) => {
    let destructed = [];
    for (let r = 1; r < Math.ceil(map[0].length/2); r++) {
        let res = 0;
        map.forEach((row, y) => row.forEach((v, x) => {
            if (dist(volcano, [x, y]) <= r*r) {
                res += v;
                map[y][x] = 0;
            }
        }))
        destructed.push({step: r, v: res, map: map.map((row => row.slice(0)))});
    }
    if (raw) return destructed;
    destructed.sort((a, b) => b.v - a.v);
    return destructed[0].step * destructed[0].v;
}

const D = {
    RIGHT: 0,
    DOWN: 1,
    LEFT: 2,
    UP: 3
}

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const distanceMap = (map, x, y, maxDist = 100, startingDist = 0, endPoint = false) => {
    let stack = [[x, y, startingDist]];
    let dmap = [], rows = map.length, cols = map[0].length, cur;
    
    for (let y = 0; y < rows; y++) {
        dmap[y] = [];
        for (let x = 0; x < cols; x++) {
            dmap[y][x] = Infinity;
        } 
    }

    while (cur = stack.pop()) {
        let [x, y, d] = cur;

        if (d > maxDist) continue;

        dmap[y][x] = d;

        DIRS.forEach(([dx, dy], dk) => {
            let nx = x+dx, ny = y+dy;
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) return true;
            let isEP = (endPoint !== false && nx == endPoint[0] && ny == endPoint[1]);
            if (!isEP) {
                if (map[ny][nx] == 0) return true;
            }

            let nd = d + map[ny][nx];
            if (nd >= maxDist) return true;

            if (dmap[ny][nx] > nd) stack.push([nx, ny, nd]);
        })
    }
    return dmap;
}


// for each spread level's map, while omitting 0s
// distance map, need to pass from start to y=volcano.y and x < volcano.x, then from that point(s) to x = volcano.x and y > volcano.y, then from those points to y = volcano.y and x > volcano.x, then from those points back to start
// max time to spend is < (level+1)*30
const p3 = ([volcano, map, start]) => {
    let lavaSteps = p2([volcano, map], true);
    let cols = map[0].length, rows = map.length;

    const advanceDmap = (baseMap, tMax, x, y, dmap, scanDirId) => {
        let toProcess = [];

        while (x >= 0 && y >= 0 && x < cols && y < rows) {
            if (dmap[y][x] != Infinity) toProcess.push({x:x, y:y, t:dmap[y][x]});
            x += DIRS[scanDirId][0];
            y += DIRS[scanDirId][1];
        }
        if (toProcess.length == 0) return false;
        toProcess.sort((a, b) => a.t - b.t);

        return distanceMap(baseMap, toProcess[0].x, toProcess[0].y, tMax, toProcess[0].t, start);
    }

    for (let stepId = 0; stepId < lavaSteps.length; stepId++) {
        let lavaStep = lavaSteps[stepId];
        
        let tMax = (lavaStep.step+1)*30;
        let dmap = distanceMap(lavaStep.map, ...start, tMax/2);

        dmap = advanceDmap(lavaStep.map, 2*tMax/3, volcano[0]-1, volcano[1], dmap, D.LEFT);
        if (dmap === false) continue;

        dmap = advanceDmap(lavaStep.map, tMax, volcano[0], volcano[1]+1, dmap, D.DOWN);
        if (dmap === false) continue;

        dmap = advanceDmap(lavaStep.map, tMax, volcano[0]+1, volcano[1], dmap, D.RIGHT);
        if (dmap === false) continue;

        if (dmap[start[1]][start[0]] < Infinity) return lavaStep.step * dmap[start[1]][start[0]];
    }
}

console.log('p1', p1(parse(input1)));
console.log('p2', p2(parse(input2)));
console.log('p3', p3(parse(input3)));
