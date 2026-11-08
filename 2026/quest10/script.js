const extractNumeric = line => line.match(/-?\d+/g);

const DIR = {
    RIGHT: 0,
    DOWN: 1,
    LEFT: 2,
    UP: 3
}

const DIRS = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
]

const SIGN_DIR = {
    '>': 0,
    'v': 1,
    '<': 2,
    '^': 3
}

const parse = input => {
    let ghosts = [];
    let map = input.split('\n').map((rowLit, y) => rowLit.split('').map((v, x) => {
        if (v === '#') return '#';
        if (v === '.') return '.';
        ghosts.push({
            id: ghosts.length,
            x: x,
            y: y,
            hits: 0,
            dir: SIGN_DIR[v]
        })
        return '.';
    }))

    return [map, ghosts];
}

const run = ([map, ghosts], rounds = 10) => {
    let collisions = 0;

    for (let rnd = 0; rnd < rounds; rnd++) {
        // movement
        let rndCols = 0;
        let occupied = {};
        ghosts.forEach(ghost => {
            let nx = ghost.x + DIRS[ghost.dir][0],
                ny = ghost.y + DIRS[ghost.dir][1];
            if (map[ny][nx] === '#') {
                ghost.dir = (ghost.dir+1) % 4;
                rndCols++;
            } else {
                ghost.x = nx;
                ghost.y = ny;
            }
            let k = ghost.y + '_'+ghost.x;
            ghost.k = k;
            if (occupied[k] === undefined) occupied[k] = 0;
            occupied[k]++;
        })


        // collisions
        Object.entries(occupied).forEach(([k, n]) => {
            if (n <= 1) return true;
            rndCols += n;
            // u-turns
            ghosts.filter(ghost => ghost.k === k).forEach(ghost => {
                ghost.dir = (ghost.dir + 2) % 4;
            })
        })

        collisions += rndCols;  
    }

    return collisions;
}


const run2 = ([map, ghosts], maxHits = 10) => {
    let collisions = 0, rnd = 0;

    while (ghosts.length > 0) {
        // movement
        let rndCols = 0;
        let occupied = {};
        ghosts.forEach(ghost => {
            let nx = ghost.x + DIRS[ghost.dir][0],
                ny = ghost.y + DIRS[ghost.dir][1];
            if (map[ny][nx] === '#') {
                ghost.dir = (ghost.dir+1) % 4;
                rndCols++;
                ghost.hits++;
            } else {
                ghost.x = nx;
                ghost.y = ny;
            }

            if (ghost.hits < maxHits) {
                let k = ghost.y + '_'+ghost.x;
                ghost.k = k;
                if (occupied[k] === undefined) occupied[k] = 0;
                occupied[k]++;
            }
        })

        ghosts = ghosts.filter(ghost => ghost.hits < maxHits);

        // collisions
        Object.entries(occupied).forEach(([k, n]) => {
            if (n <= 1) return true;
            rndCols += n;
            // u-turns
            ghosts.filter(ghost => ghost.k === k).forEach(ghost => {
                ghost.dir = (ghost.dir + 2) % 4;
                ghost.hits++;
            })
        })

        collisions += rndCols;

        ghosts = ghosts.filter(ghost => ghost.hits < maxHits);
        rnd++;
    }

    return rnd;
}

const run3 = ([map, ghosts], maxHits = 10) => {
    let collisions = 0, rnd = 0, seen = [];

    while (ghosts.length > 0) {
        // movement
        let rndCols = 0;
        let occupied = {};
        ghosts.forEach(ghost => {
            let nx = ghost.x + DIRS[ghost.dir][0],
                ny = ghost.y + DIRS[ghost.dir][1];
            if (map[ny][nx] === '#') {
                ghost.dir = (ghost.dir+1) % 4;
                rndCols++;
                ghost.hits++;
            } else {
                ghost.x = nx;
                ghost.y = ny;
            }

            if (ghost.hits < maxHits) {
                let k = ghost.y + '_'+ghost.x;
                ghost.k = k;
                if (occupied[k] === undefined) occupied[k] = 0;
                occupied[k]++;
            }
        })

        ghosts = ghosts.filter(ghost => ghost.hits < maxHits);

        // collisions
        Object.entries(occupied).forEach(([k, n]) => {
            if (n <= 1) return true;
            rndCols += n;
            // u-turns
            ghosts.filter(ghost => ghost.k === k).forEach(ghost => {
                ghost.dir = (ghost.dir + 2) % 4;
                ghost.hits++;
            })
        })

        collisions += rndCols;

        ghosts = ghosts.filter(ghost => ghost.hits < maxHits);
        rnd++;

        let stateVal = ghosts.map(g => [g.x, g.y, g.dir].join('_')).join('__');

        seen.push({
            val: stateVal,
            hits: ghosts.map(g => g.hits),
            round: rnd,
        })

        let matching = seen.filter(o => o.val === stateVal);

        if (matching.length > 1) {
            let cycleRounds = matching[1].round - matching[0].round;
            
            // determine the first ghost to fade away
            let fades = matching[1].hits.map((hits2, i) => hits2 - matching[0].hits[i]);
            
            let maxFadePerCycle = Math.max(...fades);

            let maxCurrentHits = Math.max(...ghosts.map(g => g.hits));
            
            let advanceCycles = Math.floor((maxHits - maxCurrentHits)/maxFadePerCycle);

            if (advanceCycles > 0) {
                
                let overMaxHits = false; // ugly but simple
                ghosts.forEach((g, i) => {
                    if (g.hits + fades[i]*advanceCycles >= maxHits) {
                        overMaxHits = true;
                        return false;
                    };
                })

                if (!overMaxHits) {
                    console.log('cycle detected; advancing', advanceCycles, 'cycles, meaning', cycleRounds*advanceCycles, 'rounds');

                    ghosts.forEach((g, i) => {
                        g.hits += fades[i]*advanceCycles;
                    })

                    rnd += cycleRounds*advanceCycles;
                    seen = [];
                }
            }

        }

    }

    return rnd;
}

console.log('p1', run(parse(input1)));
console.log('p2', run2(parse(input2), 10_000));
console.log('p3', run3(parse(input3), 1_000_000_000_000));
