const getMap = s => s.split('\n').map(l => l.split('').map(v => v == '.' ? 0 : 1) );
const mapValue = map => map.flat().reduce((a, v) => a+v, 0)

const advanceMap = (map, diagonals = false) => {
    let res = map.map(row => row.slice());
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] == 0) {
            res[y][x] = 0;
            continue;
        }

        let arr = Array.from({length: 9}).map((_, n) => {
            let i = (n % 3) - 1, j = Math.floor(n/3) - 1;
            if (!diagonals && i*j != 0) return map[y][x]; // fake val
            return (y+i < 0 || y+i > map.length-1 || x+j < 0 || x+j > map[0].length-1) ? 0 : map[y+i][x+j]
        })

        res[y][x] = map[y][x] + (arr.every(v => v == map[y][x]) ? 1 : 0);
    }
    return res;
}

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