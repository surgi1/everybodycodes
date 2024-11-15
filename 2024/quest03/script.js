const getMap = s => s.split('\n').map(l => l.split('').map(v => v == '.' ? 0 : 1));
const mapValue = map => map.flat().reduce((a, v) => a+v, 0)

const advanceMap = (map, diagonals = false, w = map[0].length, h = map.length) => map.map((row, y) => row.map((v, x) => {
    if (v == 0) return 0;
    
    let arr = Array.from({length: 9}).map((_, n) => {
        let j = (n % 3) - 1, i = Math.floor(n/3) - 1;
        if (!diagonals && i*j != 0) return v; // fake val
        return (y+i < 0 || y+i >= h || x+j < 0 || x+j >= w) ? 0 : map[y+i][x+j]
    })

    return v + (arr.every(n => n == v) ? 1 : 0);
}))

const run = (input, diagonals = false) => {
    let res = 0,
        map = getMap(input);

    while (mapValue(map) > res) {
        res = mapValue(map);
        map = advanceMap(map, diagonals);
    }

    return mapValue(map);
}

console.log('p1', run(input1));
console.log('p2', run(input2));
console.log('p3', run(input, true));