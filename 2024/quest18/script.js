const init = (input) => input.split("\n").map((line, y) => line.split('').map((v, x) => v));

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const distanceMap = (map, froms) => {
    let stack = froms.map(from => ({
        p: [...from],
        dist: 0
    }));

    let filled = map.map(row => row.map(v => Infinity))

    while (stack.length != 0) {
        let cur = stack.pop();
        if (filled[cur.p[1]][cur.p[0]] <= cur.dist) continue;
        filled[cur.p[1]][cur.p[0]] = cur.dist;

        DIRS.forEach(([dx, dy]) => {
            let np = [cur.p[0]+dx, cur.p[1]+dy];
            if (np[0] < 0 || np[0] > map[0].length-1 || np[1] < 0 || np[1] > map.length-1) return true;
            if ('#' == map[np[1]][np[0]]) return true;
            if (filled[np[1]][np[0]] < cur.dist) return true;
            stack.push({
                p: np,
                dist: cur.dist+1
            })
        })
    }
    return filled;
}

const run1 = (map) => {
    let dmap = distanceMap(map, [[0, map.map(row => row[0]).indexOf('.')]]);
    let dists = [];
    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == 'P') dists.push(dmap[y][x]);
    }))
    return Math.max(...dists);
}

const run2 = (map) => {
    let dmap = distanceMap(map, [[0, map.map(row => row[0]).indexOf('.')], [map[0].length-1, map.map(row => row[map[0].length-1]).indexOf('.')]]);
    let dists = [];
    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == 'P') dists.push(dmap[y][x]);
    }))
    return Math.max(...dists);
}

// takes ~5s
const run3 = (map) => {
    let min = Infinity;
    let palms = [];

    map.forEach((row, y) => row.forEach((v, x) => {
        if (v == 'P') palms.push([x, y]);
    }))

    map.forEach((row, y) => row.forEach((v, x) => {
        if (v != '.') return true;
        let dmap = distanceMap(map, [[x, y]]);
        let dist = palms.reduce((a, [x, y]) => a + dmap[y][x], 0);
        if (dist < min) min = dist;
    }))
    return min;
}

console.log('p1', run1(init(input1)));
console.log('p2', run2(init(input2)));
console.time('p3');
console.log('p3', run3(init(input3)));
console.timeEnd('p3');
