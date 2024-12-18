const init = (input) => {
    let [rots, gridLines] = input.split("\n\n");
    return [rots.split(''), gridLines.split("\n").map(line => line.split(''))];
}

const el = document.getElementById('root');

// applies for R; L is just reversed; [x, y]
const ROT = [
    {from: [-1, -1], to: [0, -1]},
    {from: [0, -1], to: [1, -1]},
    {from: [1, -1], to: [1, 0]},
    {from: [1, 0], to: [1, 1]},
    {from: [1, 1], to: [0, 1]},
    {from: [0, 1], to: [-1, 1]},
    {from: [-1, 1], to: [-1, 0]},
    {from: [-1, 0], to: [-1, -1]},
]

const rotate = (grid, center, dir) => {
    let tmp = [[], [], []];
    for (y = 0; y <= 2; y++) for (x = 0; x <= 2; x++) tmp[y][x] = grid[center[1]+y-1][center[0]+x-1];
    ROT.forEach(o => {
        let from = dir == 'R' ? o.from : o.to, to = dir == 'R' ? o.to : o.from;
        grid[center[1] + to[1]][center[0] + to[0]] = tmp[from[1]+1][from[0]+1];
    })
    return grid;
}

const run = ([rots, grid], repeats = 1, returnRaw = false) => {
    for (let n = 0; n < repeats; n++) {
        let i = 0;
        for (let y = 1; y < grid.length-1; y++) for (let x = 1; x < grid[0].length-1; x++) {
            grid = rotate(grid, [x, y], rots[i % rots.length]);
            i++;
        }
    }
    return returnRaw ? grid : findQuack(grid)
}

const xformGrid = (grid, xform) => xform.map((row, y) => row.map(([origX, origY], x) => grid[origY][origX] ))

const findQuack = grid => {
    let found = false;
    let row = grid.filter(row => row.includes('>') && row.includes('<'))?.[0];
    if (row !== undefined) found = row.slice( row.indexOf('>')+1, row.indexOf('<') ).join('');
    return found;
}

const run3 = ([rots, grid], repeats = 1) => {
    let mult = 1;
    while (Math.round(repeats/(Math.pow(2, mult))) == repeats/(Math.pow(2, mult))) mult++;
    // 1048576000/(Math.pow(2, 23)) = 125

    // estabilish 2nd level transformation
    let xform = run([rots, grid.map((row, y) => row.map((_, x) => [x, y]))], 1, true);
    
    // and 2^mult level of transformation
    for (let m = 0; m < mult-1; m++) xform = xformGrid(xform, xform);

    for (let n = 0; n < repeats/Math.pow(2, mult-1); n++) grid = xformGrid(grid, xform);

    el.innerHTML = grid.map(line => line.join('')).join("\n");

    return findQuack(grid);
}

console.log('p1', run(init(input1)));
console.log('p2', run(init(input2), 100));
console.log('p3', run3(init(input3), 1048576000));
//run3(init(input4), 1024);
