const getMap = s => s.split('\n').map(l => l.split('').map(v => v == '.' ? 0 : 1) );
let map = getMap(input);

let getVal = map => map.flat().reduce((a, v) => a+v, 0)

let advanceMap12 = map => {
    let res = map.map(row => row.slice());
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] == 0) res[y][x] = 0;
        else res[y][x] = map[y][x] + ( [ map[y-1][x], map[y+1][x], map[y][x-1], map[y][x+1] ].every(v => Math.abs(v - (map[y][x]+1)) <= 1) ? 1 : 0 ); 
    }
    return res;
}


let advanceMap = map => {
    let res = map.map(row => row.slice());
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] == 0) res[y][x] = 0;
        else {
            let arr = [];
            for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
                if (j == 0 && i == 0) continue;
                if (y+i < 0 || y+i > map.length-1 || x+j < 0 || x+j > map[0].length-1) {arr.push(0); continue;}
                arr.push(map[y+i][x+j]);
            }
            res[y][x] = map[y][x] + ( arr.every(v => Math.abs(v - (map[y][x]+1)) <= 1) ? 1 : 0 ); 
        }
    }
    return res;
}



let res = getVal(map);
map = advanceMap(map);
console.log(map, res);
let iters = 0;
while (getVal(map) > res) {
    res = getVal(map);
    map = advanceMap(map);
    console.log(map, res);
    iters++;
    //if (iters > 300) break;
}
console.log(getVal(map));

// p3: 11338 len wrong, first char wrong