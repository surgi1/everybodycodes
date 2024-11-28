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
            if ('#' == map[ny][nx]) return true;
            if (dmap[ny][nx] > dist+1) stack.push([nx, ny, dist+1]);
        })
    }
    return dmap;
}

const run = (map, p2 = false) => {
    let dmap = distanceMap(map, p2 ? [[0, 1], [map[0].length-1, map.length-2]] : [[0, 1]]);
    return Math.max(...map2d(map, (v, x, y) => v == 'P' ? dmap[y][x] : 0).flat());
}

// originally solved by g'old BF that finished in ~5s. Sped up by computing dmaps from palms and summing the distances at dot points
const run3 = (map, palms = []) => {
    map2d(map, (v, x, y) => (v == 'P') && palms.push([x, y]));

    let dmaps = palms.map(([x, y]) => distanceMap(map, [[x, y]]));

    return Math.min(...map2d(map, (v, x, y) => v == '.' ? dmaps.reduce((a, dm) => a + dm[y][x], 0) : Infinity).flat())
}

console.log('p1', run(init(input1)));
console.log('p2', run(init(input2), true));
console.log('p3', run3(init(input3)));
