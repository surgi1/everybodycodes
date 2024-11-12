const init = (input, nodes = {}) => {
    input.split("\n").map(line => {
        let tmp = line.split(/:|,/);
        nodes[tmp[0]] = tmp.slice(1);
    });
    return nodes;
}

const run = (input, p1 = false) => {
    const getPaths = (tree, current, path) => {
        if (path.includes(current)) {
            //console.log('cycle detected, stopping traverse', current, path);
            return;
        }
        path.push(current);
        if (tree[current] === undefined) return paths.push(path);
        tree[current].forEach(n => getPaths(tree, n, path.slice()))
    }

    let tree = init(input),
        paths = [];

    getPaths(tree, 'RR', []);
    
    let withApples = paths.filter(p => p[p.length-1] == '@');
    let res = withApples.filter(p => withApples.filter(r => r.length == p.length).length === 1)

    return p1 ? res[0].join('') : res[0].map(v => v[0]).join('');
}

console.log('p1', run(input1, true));
console.log('p2', run(input2));
console.log('p3', run(input3));
