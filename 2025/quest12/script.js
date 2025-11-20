const parse = input => input.split('\n').map(row => row.split('').map(Number))

let DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]

const explode = (map, queue) => {
    let rows = map.length, cols = map[0].length;
    let cur, seen = {};

    while (cur = queue.pop()) {
        let k = cur[0]+'_'+cur[1];
        if (seen[k] !== undefined) continue;
        seen[k] = 1;
        DIRS.forEach(d => {
            let nx = cur[0]+d[0], ny = cur[1]+d[1];
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return true;
            if (map[cur[1]][cur[0]] >= map[ny][nx]) queue.push([nx, ny]);
        })
    }
    return seen;
}

const p1 = (map) => Object.keys(explode(map, [[0, 0]])).length;

const p2 = (map) => {
    let rows = map.length, cols = map[0].length;
    return Object.keys(explode(map, [[0, 0], [cols-1, rows-1]])).length;
}

const p3 = (map) => {
    let rows = map.length, cols = map[0].length, res = 0;
    for (let phase = 0; phase < 3; phase++) {
        let max = 0, maxSeen = {}, seen = {};

        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
            if (map[y][x] == 10) continue;
            if (seen[x+'_'+y] !== undefined) continue;
            seen = explode(map, [[x, y]]);
            let count = Object.keys(seen).length;
            if (count > max) {
                max = count;
                maxSeen = seen;
            }
        }
        Object.keys(maxSeen).forEach(k => {
            let [x, y] = k.split('_').map(Number);
            map[y][x] = 10;
        })
        res += max;
    }

    return res;
}

console.log('p1', p1(parse(input1)));
console.log('p2', p2(parse(input2)));
console.log('p3', p3(parse(input3)));