const extractNumeric = line => line.match(/-?\d+/g);

Object.defineProperty(Array.prototype, 'sum', {
    value: function() {
        return this.reduce((a, v) => a + v, 0);
    }
});

const parse = input => input.split('\n\n').map(sectionLit => sectionLit.split('\n').map(line => line.split('')) )

const add = (u, v) => {
    if (u === v) return u;
    let [a, b] = [u, v].sort();
    if (a === 'K' || b === 'K') return 'K';
    if (a === 'C' && b === 'M') return 'B';
    if (a === 'C' && b === 'Y') return 'G';
    if (a === 'M' && b === 'Y') return 'R';
}

const counts = arr => {
    let o = {};
    arr.flat().forEach(v => {
        if (o[v] === undefined) o[v] = 0;
        o[v]++;
    })
    return Object.entries(o).sort((a, b) => b[1] - a[1]);
}

const permutator = (inputArr) => {
    let result = [];
    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(inputArr)
    return result;
}

const run = (data) => {
    let res;
    for (const layer of data) {
        if (res === undefined) {
            res = layer;
            continue;
        }
        res = res.map((row, y) => row.map((v, x) => add(v, layer[y][x])))
    }
    return counts(res).slice(0, 3).reduce((total, o, i) => total * o[1], 1) ;
}

const remap = (arr, mapping) => arr.map(row => row.map(v => mapping[Number(v)-1]))

const run2 = (data) => {
    let max = 0;
    permutator(['C', 'M', 'Y', 'K']).forEach(mapping => {
        max = Math.max(max, run([data[0], remap(data[1], mapping)]))
    })
    return max;
}

// p3: it is easy to reach any non-black (K) color, so assume we'll be able to fill every non-K by any color we want
// so let's compute the nr of possible slots, divide by 3, and multiple
// in case the blacks would be already above this, we would need to take them in. Was not the case tho.
const run3 = ([layer]) => {
    let len = layer.length * layer[0].length;
    let nonKs = layer.flat().filter(v => v !== 'K').length;

    let rem = nonKs % 3;
    let div = Math.floor(nonKs / 3);

    let res = div;
    res *= div + (rem > 0 ? 1 : 0);
    res *= div + (rem > 1 ? 1 : 0);
    return res;
}

console.log('p1', run(parse(input1)));
console.log('p2', run2(parse(input2)));
console.log('p3', run3(parse(input3)));
