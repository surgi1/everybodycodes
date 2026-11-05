const parse = input => {
    let o = {};
    input.split('\n').forEach(line => {
        let tmp = line.split(/:|,/g)
        let res = tmp.shift();
        o[res] = tmp
    })
    return o;
}

const run = (data) => {
    let used = {};
    const recur = k => {
        if (used[k] !== undefined) return;
        used[k] = 1;
        if (data[k] !== undefined) data[k].forEach(ingredient => recur(ingredient))
    }

    recur('NULL');
    return Object.keys(used).length-1;
}

const run2 = (data, v = 'NULL') => {
    let used = {}, ents = Object.entries(data);
    const findParents = ingredient => ents.filter(([k, v]) => v.includes(ingredient)).map(([k, v]) => k)
    const recur = k => {
        if (used[k] !== undefined) return;
        used[k] = 1;
        findParents(k).forEach(parent => recur(parent));
    }

    recur(v);
    return Object.keys(used);
}

const run3 = (data) => {
    let used = [];
    for (let i = 1; i <= 3; i++) used[i] = run2(data, 'NULLv'+i).filter(v => v !== 'NULLv'+i);
    let o = {};
    used.flat().forEach(u => {
        if (o[u] === undefined) o[u] = 0;
        o[u]++;
    })
    return Object.values(o).filter(v => v >= 2).length
}

console.log('p1', run(parse(input1)));
console.log('p2', run2(parse(input2)).length-1);
console.log('p3', run3(parse(input3)));