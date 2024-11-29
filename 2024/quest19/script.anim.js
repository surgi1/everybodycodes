const init = (input) => {
    let [rots, gridLines] = input.split("\n\n");
    return [rots.split(''), gridLines.split("\n").map(line => line.split(''))];
}

function createHiPPICanvas(width, height) {
    const ratio = 2;
    const canvas = document.getElementById('root');

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.getContext("2d").scale(ratio, ratio);

    return canvas;
}

//const canvas = document.getElementById('root');
const canvas = createHiPPICanvas(window.innerWidth, window.innerHeight);
const ctx = canvas.getContext("2d");

const resizeCanvas = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    const ratio = 2;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}

window.addEventListener('resize', resizeCanvas, false);

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
    resizeCanvas();

    let mult = 1;
    while (Math.round(repeats/(Math.pow(2, mult))) == repeats/(Math.pow(2, mult))) mult++;
    // 1048576000/(Math.pow(2, 23)) = 125

    // estabilish 2nd level transformation
    let xform = run([rots, grid.map((row, y) => row.map((_, x) => [x, y]))], 1, true);
    
    // and 2^mult level of transformation
    //for (let m = 0; m < mult-1; m++) xform = xformGrid(xform, xform);

    //for (let n = 0; n < repeats/Math.pow(2, mult-1); n++) grid = xformGrid(grid, xform);

    let n = 0;
    const loop = () => {
        //el.innerHTML = grid.map(line => line.join('')).join("\n");
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 36px Courier New";
        ctx.fillStyle = '#000';
        ctx.fillText('Iterations: '+n, 20, 32);
        grid.forEach((row, y) => {
            row.forEach((v, x) => {
                if ('><123456789'.includes(v)) {
                    ctx.save();
                    ctx.font = "bold 32px Courier New";
                    ctx.shadowColor = "green";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 20;
                    ctx.fillStyle = 'green';
                    ctx.fillText(v, 20+14*x-2, 66+y*18);
                    ctx.restore();
                } else if (v != '.') {
                    ctx.font = "bold 24px Courier New";
                    ctx.fillStyle = '#fecc28';
                    ctx.fillText(v, 20+14*x, 66+y*18);
                }
            })
        })
        requestAnimationFrame(loop);
        grid = xformGrid(grid, xform);
        n++;
    }

    requestAnimationFrame(loop);
}

run3(init(input3), 1048576000);
