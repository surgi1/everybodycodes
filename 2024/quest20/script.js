const init = input => input.split("\n").map(row => row.split(''));

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const mp = (map, pos) => map[pos[1]][pos[0]];
const find = (map, v) => {
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[y].length; x++) if (map[y][x] == v) return [x, y];
}

const altChange = v => {
    if (v == '+') return 1;
    if (v == '-') return -2;
    return -1;
}

// this takes way too long to finish, likely misses better seen states handling
const run1 = (map) => {
    let max = 0,
        queue = new FastPriorityQueue((a, b) => b.alt < a.alt),
        seen = {};

    queue.add({
        pos: find(map, 'S'),
        t: 0,
        alt: 1000,
        path: [],
        dir: undefined
    })

    while (!queue.isEmpty()) {
        let curr = queue.poll();

        if (curr.t == 100) {
            if (curr.alt > max) max = curr.alt;
            continue;
        }

        if (curr.alt <= 0) continue; // crash

        let k = [...curr.pos, curr.t, curr.dir].join('_');
        if (seen[k] !== undefined && seen[k] <= curr.alt) continue;
        seen[k] = curr.alt;

        DIRS.forEach(d => {
            if (curr.dir !== undefined && (d[0] == -curr.dir[0]) && (d[1] == -curr.dir[1])) return true;
            let npos = [0, 1].map(c => curr.pos[c]+d[c]);
            if (npos[0] < 0 || npos[0] > map[0].length-1 || npos[1] < 0 || npos[1] > map.length-1 || mp(map, npos) == '#') return true;
            queue.add({
                pos: npos,
                path: [...curr.path, npos],
                alt: curr.alt + altChange(mp(map, npos)),
                t: curr.t + 1,
                dir: d,
            })
        })
    }

    return max;
}

const distanceMap = (map, x, y, z = 10000, startingDist = 0, startingDk = 1) => {
    let stack = [[x, y, z, startingDist, startingDk]];
    let dmap = [], rows = map.length, cols = map[0].length, cur;
    
    //let zspan = 50, maxDist = 50; // input2t, input2t2
    //let zspan = 100, maxDist = 120; // input2t3, kind of
    let zspan = 200, maxDist = 200; // input2
    
    let zmin = Math.floor(z-zspan/2), zmax = Math.ceil(z+zspan/2);
    
    for (let y = 0; y < map.length; y++) {
        dmap[y] = [];
        for (let x = 0; x < map[0].length; x++) {
            dmap[y][x] = [];
            for (let z = zmin; z < zmax; z++) {
                dmap[y][x][z] = DIRS.map((d, dk) => Infinity);
            }
        } 
    }

    while (cur = stack.pop()) {
        let [x, y, z, dist, odk] = cur;

        dmap[y][x][z][odk] = dist;

        if (dist > maxDist) continue;

        let [odx, ody] = DIRS[odk];

        DIRS.forEach(([dx, dy], dk) => {
            if (dx == -odx && dy == -ody) return true;
            let nx = x+dx, ny = y+dy;
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) return true;
            if ('#' == map[ny][nx]) return true;

            let nz = z + altChange(map[ny][nx]);
            if (nz < zmin || nz >= zmax) return true;

            if (dmap[ny][nx][nz][dk] > dist+1) stack.push([nx, ny, nz, dist+1, dk]);
        })
    }
    return dmap;
}

// this takes even longer, as it does 4-D floodfill. TBD revisit the algo, teminate way more paths
const run2 = map => {
    let x, y, dmap, altsDirs = [{alt: 10000, dk: 1}], totalDist = 0;

    [x, y] = find(map, 'S');

    ['A', 'B', 'C', 'S'].forEach(checkpoint => {
        dmap = distanceMap(map, x, y, altsDirs[0].alt, 0, altsDirs[0].dk);
        [x, y] = find(map, checkpoint);
        altsDirs = [];
        dmap[y][x].forEach((arr, z) => arr.forEach((dist, dk) => altsDirs.push({alt: z, dk: dk, dist: dist})));
        altsDirs.sort((a, b) => (b.alt-b.dist) - (a.alt-a.dist)); // this part is crucial; gives both travel time (dist) and resulting altitude the same relevance
        console.log('Scanned flight to', checkpoint, '; found these options, sorted by relevance', altsDirs, '; taking', altsDirs[0]);
        totalDist += altsDirs[0].dist;
    })

    console.log('Part 2 Total travel time is', totalDist, ', but ending alt is only', altsDirs[0].alt);
    console.log('Since (see map layout) it is quite easy to cycle up into exactly needed alt close to the exit on our (forced) path (and move up to closest even number), chances are the P2 answer is...');
    let candidate = 10000-altsDirs[0].alt+totalDist;
    return candidate + (candidate % 2);
}

console.log('p1', run1(init(input1)));
console.log('p2', run2(init(input2)));
console.log('p3 solved manually, check p3.txt in this repo');
