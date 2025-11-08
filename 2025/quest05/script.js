const parse = input => input.split(':').map(line => line.split(',').map(Number))

const p1 = ([[id], data], returnRaw = false) => {
    let nodes = [];

    const addNode = v => nodes.push({v: v})

    data.forEach(v => {
        let foundNodeId = -1;
        for (let nId = 0; nId < nodes.length; nId++) {
            let n = nodes[nId];

            if (v < n.v && n.left === undefined) {
                n.left = v;
                foundNodeId = nId;
                break;
            }
            if (v > n.v && n.right === undefined) {
                n.right = v;
                foundNodeId = nId;
                break;
            }
        }

        if (foundNodeId < 0) addNode(v);
    })

    let q = Number(nodes.map(n => n.v).join(''));

    if (!returnRaw) return q;

    return {q: q, levels: nodes.map(n => (n.left !== undefined ? n.left : '') + '' + n.v + '' + (n.right !== undefined ? n.right : '') ).map(Number) };
}

const p2 = arr => {
    let resArr = arr.map(([[id], data]) => p1([[id], data]));
    return Math.max(...resArr) - Math.min(...resArr);
}

const p3 = arr => {
    let resArr = arr.map(([[id], data]) => ({id: id, ...p1([[id], data], true)})).sort((a, b) => {
        if (a.q != b.q) return b.q - a.q;

        for (let i = 0; i < Math.min(a.levels.length, b.levels.length); i++)
            if (a.levels[i] !== b.levels[i]) return b.levels[i] - a.levels[i];

        return b.id - a.id;
    })

    return resArr.reduce((a, v, i) => a + (i+1)*v.id, 0)
}

console.log('p1', p1(parse(input1)));
console.log('p2', p2(input2.split('\n').map(parse)))
console.log('p3', p3(input3.split('\n').map(parse)))