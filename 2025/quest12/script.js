const parse = input => input.split('\n').map(row => row.split('').map(Number))

let DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]
let canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

let size = 5;

const draw = map => {
    ctx.clearRect(0, 0, 1000, 1000);
    map.forEach((row, y) => row.forEach((v, x) => {
        ctx.fillStyle = 'rgb(' + v.map(n => n*20).join(',') + ', 1)';
        ctx.fillRect(x*size, y*size, size, size);
    }))
}

const animate = (map, dmap, t = 0) => {
    draw(map.map((row, y) => row.map((v, x) => {
        if (dmap[y][x] === undefined || t < dmap[y][x]) return [v, v, v];
        let r = Math.max(0, 15 - (t - dmap[y][x])/2);
        return [r, 0, 0];
    })))
    setTimeout(() => {
        animate(map, dmap, t+1)
    }, 20)
}

const explode = (map, queue, anim = false) => {
    let rows = map.length, cols = map[0].length;
    let cur, seen = {};
    queue = queue.map(v => [...v, 0]);
    let dmap = map.map(row => row.map(v => undefined));

    while (cur = queue.pop()) {
        let k = cur[0]+'_'+cur[1];
        if (seen[k] !== undefined) continue;
        seen[k] = cur.slice(0);
        dmap[cur[1]][cur[0]] = cur[2];
        DIRS.forEach(d => {
            let nx = cur[0]+d[0], ny = cur[1]+d[1];
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return true;
            if (map[cur[1]][cur[0]] >= map[ny][nx]) queue.push([nx, ny, cur[2]+1]);
        })
    }
    if (anim) animate(map, dmap);
    return seen;
}

const p1 = (map) => Object.keys(explode(map, [[0, 0]])).length;

const p2 = (map) => Object.keys(explode(map, [[0, 0], [map[0].length-1, map.length-1]], false)).length;

const p3 = (map) => {
    let origMap = map.map(row => row.slice(0));
    let rows = map.length, cols = map[0].length, res = 0, queue = [[0,0],[0,0],[0,0]];
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
                queue[phase] = [x, y];
            }
        }
        Object.values(maxSeen).forEach(([x, y]) => map[y][x] = 10)
        res += max;
    }

    explode(origMap, queue, true);

    return res;
}

console.log('p1', p1(parse(input1)));
console.log('p2', p2(parse(input2)));
console.log('p3', p3(parse(input3)));