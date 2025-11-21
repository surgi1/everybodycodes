const parse = input => input.split('\n').map(row => row.split('').map(Number))

let DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]
let canvas = document.getElementById('canvas');
let canvas2 = document.getElementById('canvas2'), ctx = canvas.getContext('2d');
let ctxs = [canvas.getContext('2d'), canvas2.getContext('2d')];

let size = 5;

const draw = (map, ctx) => {
    ctx.clearRect(0, 0, 1000, 1000);
    map.forEach((row, y) => row.forEach((v, x) => {
        ctx.fillStyle = 'rgb(' + v.map(n => n*20).join(',') + ')';
        //ctx.fillRect(x*size, y*size, size, size);
        ctx.beginPath();
        let adjust = 0;
        if (v[0] > v[1]) {
            adjust = (v[0]-v[1])/3;
        }
        ctx.arc(x*size - adjust/2, y*size - adjust/2, (size+adjust)/2, 0, 2 * Math.PI);
        ctx.fill();
    }))
}

const animate = (map, dmap, t = 0, ctxId = 0) => {
    draw(map.map((row, y) => row.map((v, x) => {
        if (dmap[y][x] === undefined || t < dmap[y][x]) return [v, v, v];
        let r = Math.max(0, 15 - (t - dmap[y][x])/2);
        return [r, 0, 0];
    })), ctxs[ctxId])
    setTimeout(() => {
        animate(map, dmap, t+1, ctxId)
    }, 20)
}

const explode = (map, queue, anim = false) => {
    let rows = map.length, cols = map[0].length;
    let cur, seen = {};
    let dmap = map.map(row => row.map(v => undefined));

    const spread = (x, y, t) => {
        if (dmap[y][x] !== undefined) return;
        let k = x+'_'+y;
        seen[k] = [x, y];
        dmap[y][x] = t;
        if (x > 0 && map[y][x] >= map[y][x-1]) spread(x-1, y, t+1);
        if (y > 0 && map[y][x] >= map[y-1][x]) spread(x, y-1, t+1);
        if (x < cols-1 && map[y][x] >= map[y][x+1]) spread(x+1, y, t+1);
        if (y < rows-1 && map[y][x] >= map[y+1][x]) spread(x, y+1, t+1);
    }

    queue.forEach(([x, y]) => spread(x, y, 0));

    if (anim !== false) animate(map, dmap, 0, anim);
    return seen;
}

const p1 = (map) => Object.keys(explode(map, [[0, 0]])).length;

const p2 = (map, anim = 0) => Object.keys(explode(map, [[0, 0], [map[0].length-1, map.length-1]], anim)).length;

const p3 = (map, anim = 1) => {
    let origMap = map.map(row => row.slice(0));
    let rows = map.length, cols = map[0].length, res = 0, queue = [[0,0],[0,0],[0,0]];
    for (let phase = 0; phase < 3; phase++) {
        let max = 0, maxSeen = {}, seen = {};

        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
            if (map[y][x] == 10) continue;
            if (seen[x+'_'+y] !== undefined) continue;
            let neighbors = [];
            if (x > 0) neighbors.push(map[y][x-1]);
            if (y > 0) neighbors.push(map[y-1][x]);
            if (x < cols-1) neighbors.push(map[y][x+1]);
            if (y < rows-1) neighbors.push(map[y+1][x]);
            if (map[y][x] < Math.max(...neighbors)) continue;
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

    explode(origMap, queue, anim);

    return res;
}

console.log('p1', p1(parse(input1)));
console.log('p2', p2(parse(input2)));
console.log('p3', p3(parse(input3)));
