const init = (input) => input.split("\n").map((line, y) => line.split('').map((v, x) => ({v: isNaN(v) ? v : Number(v), level: isNaN(v) ? 0 : Number(v) }) ))

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const solve = (map, startVal = 'S', endVal = 'E') => {
    const mp = pos => map[pos[1]][pos[0]];
    const findStart = () => {
        for (let y = 0; y < map.length; y++) for (let x = 0; x < map[y].length; x++) if (map[y][x].v == startVal) return [x, y];
    }

    let min = Infinity,
        queue = new FastPriorityQueue((a, b) => b.t > a.t),
        seen = {};

    queue.add({
        pos: findStart(),
        visited: [], //'x_y'
        t: 0,
    })

    while (!queue.isEmpty()) {
        let curr = queue.poll();

        if (mp(curr.pos).v == endVal) {
            if (curr.t < min) min = curr.t;
            continue;
        }

        let k = curr.pos.join('_');
        if (seen[k] !== undefined && seen[k] <= curr.t) continue;
        seen[k] = curr.t;

        DIRS.forEach(d => {
            let npos = [0, 1].map(c => curr.pos[c]+d[c]);
            if (npos[0] < 0 || npos[0] > map[0].length-1 || npos[1] < 0 || npos[1] > map.length-1 || mp(npos).v == '#') return true;
            let nk = npos.join('_');
            if (curr.visited.includes(nk)) return true;
            let dist = Math.abs(mp(npos).level - mp(curr.pos).level);
            queue.add({
                pos: npos,
                visited: [...curr.visited, nk],
                t: curr.t + 1 + Math.min( dist, 10-dist )
            })
        })
    }
    return min;
}

console.log('p1', solve(init(input1)));
console.log('p2', solve(init(input2)));
console.log('p3', solve(init(input3), 'E', 'S'));
