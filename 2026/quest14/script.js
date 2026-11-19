const parse = input => input.split('\n').map(line => line.split(''))

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const FRAME = 'FRAME';

const offGrid = (map, x, y) => map[y] === undefined || map[y][x] === undefined;

const toNodes = grid => {
    const rows = grid.length, cols = grid[0].length;
    const nodes = new Map();

    const add = (u, v) => {
        if (!nodes.has(u)) nodes.set(u, new Map());
        const edges = nodes.get(u);
        edges.set(v, (edges.get(v) || 0) + 1);
    };

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const u = grid[y][x];

            DIRS.forEach(([dx, dy]) => {
                let yn = y + dy, xn = x + dx;
                let v = offGrid(grid, xn, yn) ? FRAME : grid[yn][xn];

                if (u !== v) {
                    add(u, v);
                    if (v === FRAME) add(FRAME, u);
                }
            })
        }
    }

    return nodes;
};

// Prim's algo; finds minimum spanning tree
const prim = (nodes, portals = new Set()) => {
    const covered = new Set([FRAME]);
    const best = new Map();

    for (const [v, len] of nodes.get(FRAME)) {
        best.set(v, portals.has(v) ? 0 : len);
    }

    let res = 0;

    while (covered.size < nodes.size) {
        let u, min = Infinity;

        for (const [v, len] of best) {
            if (!covered.has(v) && len < min) {
                min = len;
                u = v;
            }
        }

        if (u === undefined) throw new Error('Disconnected graph');

        covered.add(u);
        res += min;

        for (const [v, len] of nodes.get(u)) {
            if (covered.has(v)) continue;

            const cost = portals.has(u) || portals.has(v) ? 0 : len;
            best.set(v, Math.min(best.get(v) ?? Infinity, cost));
        }
    }

    return res;
};

const run = grid => {
    const nodes = toNodes(grid);
    //console.log(nodes);

    let res = 0;
    for (const edges of nodes.values()) {
        for (const len of edges.values()) res += len;
    }

    return res / 2;
};

const run2 = grid => prim(toNodes(grid));

const run3 = grid => {
    const nodes = toNodes(grid);
    //console.log(nodes);

    const portal = [...new Set(grid.join(''))].sort();
    let res = Infinity;

    for (let i = 0; i < portal.length - 1; i++) {
        for (let j = i + 1; j < portal.length; j++) {
            res = Math.min(
                res,
                prim(nodes, new Set([portal[i], portal[j]]))
            );
        }
    }

    return res;
};


console.log('p1', run(parse(input1)));
console.log('p2', run2(parse(input2)));
console.log('p3', run3(parse(input3)));