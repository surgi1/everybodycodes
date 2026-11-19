function solve(input, target = 202620262026) {
    const grid = input.trim().split(/\r?\n/);
    const H = grid.length, W = grid[0].length;
    if (grid.some(row => row.length !== W)) throw new Error('Nonrectangular map');
    if (!Number.isSafeInteger(target) || target < 0) throw new Error('Invalid target');

    // Direction order: east, south, west, north.
    const dr = [0, 1, 0, -1], dc = [1, 0, -1, 0];
    let start = -1, exit = -1;
    const cellId = (r, c) => (r * W + c) * 4;
    const allNodes = H * W * 4 + 1, sink = allNodes - 1;
    const adj = Array.from({ length: allNodes }, () => []);
    const rev = Array.from({ length: allNodes }, () => []);
    function add(u, v, sulphur, time = 1) {
        adj[u].push([v, sulphur, time]);
        rev[v].push(u);
    }

    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
        if (grid[r][c] === '#') continue;
        if (grid[r][c] === 'S') start = cellId(r, c); // heading east
        if (grid[r][c] === 'E') exit = cellId(r, c);
        for (let d = 0; d < 4; d++) {
            const u = cellId(r, c) + d;
            for (const nd of [d, (d + 1) % 4, (d + 3) % 4]) {
                const nr = r + dr[nd], nc = c + dc[nd];
                if (nr < 0 || nr >= H || nc < 0 || nc >= W || grid[nr][nc] === '#') continue;
                add(u, cellId(nr, nc) + nd, Number(grid[nr][nc] === '@'));
            }
        }
    }
    if (start < 0 || exit < 0) throw new Error('Missing S or E');
    for (let d = 0; d < 4; d++) add(exit + d, sink, 0, 0);

    // Keep states which are reachable from S and can reach E.
    const reachable = (roots, graph) => {
        const seen = new Uint8Array(allNodes), stack = roots.slice();
        for (const root of roots) seen[root] = 1;
        while (stack.length) {
            const u = stack.pop();
            for (const edge of graph[u]) {
                const v = Array.isArray(edge) ? edge[0] : edge;
                if (!seen[v]) { seen[v] = 1; stack.push(v); }
            }
        }
        return seen;
    };
    const forward = reachable([start], adj);
    const backward = reachable([sink], rev);
    if (!forward[sink]) throw new Error('E is unreachable');
    const oldToNew = new Int32Array(allNodes).fill(-1);
    let n = 0;
    for (let v = 0; v < allNodes; v++) if (forward[v] && backward[v]) oldToNew[v] = n++;
    const source = oldToNew[start], goal = oldToNew[sink];
    const edges = [], out = Array.from({ length: n }, () => []);
    for (let u = 0; u < allNodes; u++) {
        if (oldToNew[u] < 0) continue;
        for (const [v, fuel, time] of adj[u]) {
            if (oldToNew[v] < 0) continue;
            const e = { u: oldToNew[u], v: oldToNew[v], fuel, time, reduced: 0 };
            edges.push(e);
            out[e.u].push(e);
        }
    }

    // Bellman-Ford with an implicit zero-cost super-source.
    // If P/Q is too small, returns a cycle with greater sulphur/time ratio.
    // Otherwise, returns shortest-path potentials for nonnegative reweighting.
    function bellmanFord(P, Q) {
        const dist = new Float64Array(n);
        const parent = new Int32Array(n).fill(-1);
        let changed = -1;
        for (let pass = 0; pass < n; pass++) {
            changed = -1;
            for (let i = 0; i < edges.length; i++) {
                const e = edges[i];
                const candidate = dist[e.u] + P * e.time - Q * e.fuel;
                if (candidate < dist[e.v]) {
                    dist[e.v] = candidate;
                    parent[e.v] = i;
                    changed = e.v;
                }
            }
            if (changed < 0) return { dist };
        }
        // Predecessor chain from a vertex updated on pass n hits a negative cycle.
        let v = changed;
        for (let i = 0; i < n; i++) v = edges[parent[v]].u;
        const first = v;
        let fuel = 0, time = 0;
        do {
            const e = edges[parent[v]];
            fuel += e.fuel;
            time += e.time;
            v = e.u;
        } while (v !== first);
        return { fuel, time };
    }

    const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
    let P = 0, Q = 1, potentials;
    for (;;) {
        const result = bellmanFord(P, Q);
        if (result.dist) { potentials = result.dist; break; }
        const g = gcd(result.fuel, result.time);
        P = result.fuel / g;
        Q = result.time / g;
    }
    if (!P) throw new Error('No repeatable sulphur cycle');

    // Reduced edge costs are all nonnegative, and a zero-cost cycle
    // is exactly a maximum-density (critical) cycle.
    const zeroOut = Array.from({ length: n }, () => []);
    const zeroRev = Array.from({ length: n }, () => []);
    for (const e of edges) {
        e.reduced = P * e.time - Q * e.fuel + potentials[e.u] - potentials[e.v];
        if (e.reduced < 0) throw new Error('Invalid Bellman-Ford potential');
        if (e.reduced === 0) {
            zeroOut[e.u].push(e);
            zeroRev[e.v].push(e.u);
        }
    }

    // Kosaraju SCCs, with iterative DFS to avoid recursion depth limits.
    const seen = new Uint8Array(n), order = [];
    for (let root = 0; root < n; root++) {
        if (seen[root]) continue;
        seen[root] = 1;
        const stack = [[root, 0]];
        while (stack.length) {
            const top = stack[stack.length - 1];
            const [u, i] = top;
            if (i >= zeroOut[u].length) { order.push(u); stack.pop(); continue; }
            top[1]++;
            const v = zeroOut[u][i].v;
            if (!seen[v]) { seen[v] = 1; stack.push([v, 0]); }
        }
    }
    const component = new Int32Array(n).fill(-1);
    const groups = [];
    for (let i = order.length - 1; i >= 0; i--) {
        const root = order[i];
        if (component[root] !== -1) continue;
        const id = groups.length, group = [];
        const stack = [root];
        component[root] = id;
        while (stack.length) {
            const u = stack.pop();
            group.push(u);
            for (const v of zeroRev[u]) if (component[v] < 0) {
                component[v] = id;
                stack.push(v);
            }
        }
        groups.push(group);
    }

    // One positive-sulphur, zero-reduced-cost cycle per critical SCC.
    // The cycle provides the period in fuel and a state where it can be pumped.
    const critical = [];
    for (let id = 0; id < groups.length; id++) {
        const group = groups[id];
        if (group.length === 1 && !zeroOut[group[0]].some(e => e.v === group[0])) continue;
        const anchor = group[0];
        const firstEdge = zeroOut[anchor].find(e => component[e.v] === id);
        const queue = [firstEdge.v], pred = new Int32Array(n).fill(-1);
        pred[firstEdge.v] = firstEdge.v;
        for (let head = 0; head < queue.length && pred[anchor] < 0; head++) {
            const u = queue[head];
            for (const e of zeroOut[u]) {
                if (component[e.v] !== id || pred[e.v] >= 0) continue;
                pred[e.v] = u;
                queue.push(e.v);
            }
        }
        // Recover the first edge, followed by the path back to anchor.
        let fuel = firstEdge.fuel, time = firstEdge.time;
        let v = anchor;
        while (v !== firstEdge.v) {
            const u = pred[v];
            const e = zeroOut[u].find(e => e.v === v);
            fuel += e.fuel;
            time += e.time;
            v = u;
        }
        if (fuel <= 0 || P * time !== Q * fuel) throw new Error('Critical cycle invalid');
        critical.push({ anchor, fuel, time });
    }
    if (!critical.length) throw new Error('No critical cycles found');

    // Binary min-heap for lexicographic Dijkstra (weight first, then fuel).
    class MinHeap {
        constructor() { this.a = []; }
        push(x) {
            const a = this.a;
            let i = a.length; a.push(x);
            while (i) {
                const p = (i - 1) >> 1;
                if (a[p][0] < x[0] || (a[p][0] === x[0] && a[p][1] <= x[1])) break;
                a[i] = a[p]; i = p;
            }
            a[i] = x;
        }
        pop() {
            const a = this.a, result = a[0], x = a.pop();
            if (a.length) {
                let i = 0;
                while (i * 2 + 1 < a.length) {
                    let j = i * 2 + 1;
                    if (j + 1 < a.length &&
                        (a[j+1][0] < a[j][0] || (a[j+1][0] === a[j][0] && a[j+1][1] < a[j][1]))) j++;
                    if (x[0] < a[j][0] || (x[0] === a[j][0] && x[1] <= a[j][1])) break;
                    a[i] = a[j]; i = j;
                }
                a[i] = x;
            }
            return result;
        }
        get length() { return this.a.length; }
    }
    function dijkstra(root, modulus) {
        const count = n * modulus;
        const dist = new Float64Array(count).fill(Infinity);
        const fuel = new Float64Array(count).fill(Infinity);
        const heap = new MinHeap();
        const first = root * modulus;
        dist[first] = fuel[first] = 0;
        heap.push([0, 0, first]);
        while (heap.length) {
            const [w, f, state] = heap.pop();
            if (w !== dist[state] || f !== fuel[state]) continue;
            const u = Math.floor(state / modulus), residue = state % modulus;
            for (const e of out[u]) {
                const r = (residue + e.fuel) % modulus;
                const next = e.v * modulus + r;
                const nw = w + e.reduced, nf = f + e.fuel;
                if (nw < dist[next] || (nw === dist[next] && nf < fuel[next])) {
                    dist[next] = nw; fuel[next] = nf;
                    heap.push([nw, nf, next]);
                }
            }
        }
        return { dist, fuel };
    }

    let bestW = Infinity, bestWitness = null;
    const sourceCache = new Map();
    for (const { anchor, fuel: periodFuel, time: periodTime } of critical) {
        const A = periodFuel, remainder = target % A;
        let fromStart = sourceCache.get(A);
        if (!fromStart) { fromStart = dijkstra(source, A); sourceCache.set(A, fromStart); }
        const fromAnchor = dijkstra(anchor, A);
        for (let r1 = 0; r1 < A; r1++) {
            const r2 = (remainder - r1 + A) % A;
            const i = anchor * A + r1, j = goal * A + r2;
            const w1 = fromStart.dist[i], w2 = fromAnchor.dist[j];
            const f = fromStart.fuel[i] + fromAnchor.fuel[j];
            if (!Number.isFinite(w1 + w2) || f > target) continue;
            const originalW = w1 + w2 - potentials[source] + potentials[goal];
            if (originalW < bestW) {
                bestW = originalW;
                bestWitness = { anchor, periodFuel, periodTime, baseFuel: f };
            }
        }
    }
    if (!bestWitness) throw new Error('No pumpable path reaches exactly the target');

    // Rigorous large-target certificate: any route beating our candidate
    // must contain a zero-reduced-cost cycle, hence is covered by an anchor.
    const hMin = Math.min(...potentials), hMax = Math.max(...potentials);
    const noCriticalCycleFuelBound = n * (bestW + hMax - hMin + 1);
    const witnessFuelBound = 2 * n * Math.max(...critical.map(c => c.fuel));
    if (target <= Math.max(noCriticalCycleFuelBound, witnessFuelBound)) {
        throw new Error('Target too small for asymptotic proof; use exact fuel-state DP');
    }

    const answerNumerator = BigInt(Q) * BigInt(target) + BigInt(bestW);
    if (answerNumerator % BigInt(P) !== 0n) throw new Error('Noninteger answer');
    const seconds = answerNumerator / BigInt(P);
    console.log({ states: n, criticalComponents: critical.length,
        density: `${P}/${Q}`, bestReducedCost: bestW,
        baseFuel: bestWitness.baseFuel,
        periodFuel: bestWitness.periodFuel, periodSeconds: bestWitness.periodTime,
        certificateBound: noCriticalCycleFuelBound });
    return seconds.toString();
}
