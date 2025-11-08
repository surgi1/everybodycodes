const parse = input => input.split(':').map(line => line.split(',').map(Number))

const p1 = ([[id], data], p3 = false) => {
    let nodes = [];

    data.forEach(v => {
        let placed = false;
        for (let nId = 0; nId < nodes.length; nId++) {
            let n = nodes[nId];

            if (v < n[1] && n[0] === null) {
                n[0] = v;
                placed = true;
                break;
            }
            if (v > n[1] && n[2] === null) {
                n[2] = v;
                placed = true;
                break;
            }
        }

        if (!placed) nodes.push([null, v, null])
    })

    let q = Number(nodes.map(n => n[1]).join(''));

    if (!p3) return q;

    return {q: q, levels: nodes.map(n => n.join('')).map(Number)};
}

const p2 = arr => Math.max(...arr.map(v => p1(v))) - Math.min(...arr.map(v => p1(v)));

const p3 = arr => arr
        .map(([[id], data]) => ({id: id, ...p1([[id], data], true)}))
        .sort((a, b) => {
            if (a.q != b.q) return b.q - a.q;

            for (let i = 0; i < Math.min(a.levels.length, b.levels.length); i++)
                if (a.levels[i] !== b.levels[i]) return b.levels[i] - a.levels[i];

            return b.id - a.id;
        })
        .reduce((a, v, i) => a + (i+1)*v.id, 0)

console.log('p1', p1(parse(input1)));
console.log('p2', p2(input2.split('\n').map(parse)))
console.log('p3', p3(input3.split('\n').map(parse)))