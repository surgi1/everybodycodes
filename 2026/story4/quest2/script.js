const extractCoords = line => line.match(/-?\d+/g).map(Number);

const parse = input => {
    let [startLit, aLit, bLit, cLit, movesLit] = input.split('\n');
    return {
        start: extractCoords(startLit),
        A: extractCoords(aLit),
        B: extractCoords(bLit),
        C: extractCoords(cLit),
        moves: movesLit !== undefined ? movesLit.split('=')[1].split('') : []
    }
}

const run1 = (data) => {
    let pos = data.start.slice();
    let seen = new Set();
    seen.add(pos.join(','));
    data.moves.forEach(move => {
        pos = pos.map((v, i) => Math.floor( v + (data[move][i] - v)/2 ) )
        seen.add(pos.join(','));
    })
    return seen;
}

let DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const getSurrounding = p1seen => {
    let seen = new Set();
    for (let v of p1seen) {
        let coords = extractCoords(v);
        DIRS.forEach(d => {
            let pos = coords.map((c, i) => c+d[i]);
            let k = pos.join(',');
            if (!p1seen.has(k)) seen.add(k)
        })
    }
    return seen;
}

const run2 = (data) => getSurrounding(run1(data));

const run3 = (data) => {
    let seen = new Set([data.start.join(',')]);
    let stack = [data.start];

    while (stack.length) {
        let pos = stack.pop();

        for (let move of 'ABC') {
            let next = pos.map((v, i) => Math.floor(v + (data[move][i] - v)/2));
            let k = next.join(',');

            if (seen.has(k)) continue;

            seen.add(k);
            stack.push(next);
        }
    }

    return getSurrounding(seen);
}

console.log('p1', run1(parse(input1)).size);
console.log('p2', run2(parse(input2)).size);
console.log('p3', run3(parse(input3)).size);
