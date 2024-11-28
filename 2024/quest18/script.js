const init = (input) => input.split("\n").map((line, y) => line.split('').map((v, x) => v));

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const distanceMap = (map, froms) => {
    let stack = froms.map(from => [...from, 0]);

    let dmap = map.map(row => row.map(v => Infinity)),
        rows = map.length, cols = map[0].length, cur;

    while (cur = stack.pop()) {
        let [x, y, dist] = cur;

        if (dmap[y][x] <= dist) continue;
        dmap[y][x] = dist;

        DIRS.forEach(([dx, dy]) => {
            let nx = x+dx, ny = y+dy;
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) return true;
            if ('#' == map[ny][nx]) return true;
            if (dmap[ny][nx] < dist) return true;
            stack.push([nx, ny, dist+1]);
        })
    }
    return dmap;
}

const run = (map, p2 = false) => {
    let dmap = distanceMap(map, p2 ? [[0, 1], [map[0].length-1, map.length-2]] : [[0, 1]]),
        dist = 0;

    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == 'P' && dmap[y][x] > dist) dist = dmap[y][x];
    }))

    return dist;
}

// takes ~5s
const run3 = (map) => {
    let min = Infinity, palms = [];

    map.forEach((row, y) => row.forEach((v, x) => (v == 'P') && palms.push([x, y])))

    map.forEach((row, y) => row.forEach((v, x) => {
        if (v != '.') return true;
        let dmap = distanceMap(map, [[x, y]]);
        min = Math.min(min, palms.reduce((a, [x, y]) => a + dmap[y][x], 0));
    }))
    return min;
}

console.log('p1', run(init(input1)));
console.log('p2', run(init(input2), true));
console.log('p3', run3(init(input3)));
