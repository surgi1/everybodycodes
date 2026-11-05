const extractNumeric = line => line.match(/-?\d+/g);

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
    console.log(data)
}

console.log('p1', run(parse(inputt1)));
