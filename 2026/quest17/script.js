const init = input => input.split("\n").map(row => row.split(''));
const map2d = (map, cb) => map.map((row, y) => row.map((v, x) => cb(v, x, y)));

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const distanceMap = (map, startingPoints) => {
    let stack = startingPoints.map(([x, y]) => [x, y, 0]),
        dmap = map2d(map, () => Infinity),
        rows = map.length, cols = map[0].length, cur;

    while (cur = stack.pop()) {
        let [x, y, dist] = cur;

        dmap[y][x] = dist;

        DIRS.forEach(([dx, dy]) => {
            let nx = x+dx, ny = y+dy;
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) return true;
            if ('.' == map[ny][nx]) return true;
            if (dmap[ny][nx] > dist+1) stack.push([nx, ny, dist+1]);
        })
    }
    return dmap;
}

const run = (map) => {
    let dmap = distanceMap(map, [[0, 0]]);
    return dmap[map.length-1][map[0].length-1];
}

const offMap = (map, x, y) => map[y] === undefined || map[y][x] === undefined;
const mapVal = (map, x, y) => offMap(map, x, y) ? '.' : map[y][x];

const run2 = (map) => {
    let res = 0;
    map.forEach((row, y) => row.forEach((v, x) => {
        res += v === '#' ? DIRS.filter(([dx, dy], di) => (mapVal(map, x+dx, y+dy) === '.')).length : 0
    }))
    return res;
}

const rotLeft = (x, y) => [y, -x];

const run3 = (map) => {
    let dist = 0;

    let x = 0, y = 0; // 0,0 means top left corner of the first map item
    let path = [];

    while (x !== map[0].length || y !== map.length) {
        let next = [];
    
        if (dist > 0 && mapVal(map, x, y-1) !== mapVal(map, x, y)) next.push([1, 0]); // right

        if (mapVal(map, x-1, y-1) !== mapVal(map, x-1, y)) next.push([-1, 0]); // left

        if (mapVal(map, x-1, y) !== mapVal(map, x, y)) next.push([0, 1]); // down

        if (mapVal(map, x-1, y-1) !== mapVal(map, x, y-1)) next.push([0, -1]); // up

        if (path.length > 0) next = next.filter(([dx, dy]) => !(x+dx === path[path.length-1][0] && y+dy === path[path.length-1][1]));

        if (next.length > 1) {
            let lastDiff = [x - path[path.length-1][0], y - path[path.length-1][1]];
            next = [rotLeft(...lastDiff)];
        }

        path.push([x, y]);

        dist += 1;
        
        x += next[0][0];
        y += next[0][1];
    }

    return Math.min(dist, run2(map) - dist);
}

console.log('p1', run(init(input1)));
console.log('p2', run2(init(input2)));
console.log('p3', run3(init(input3)));