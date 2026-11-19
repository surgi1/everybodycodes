const extractNumeric = line => line.match(/-?\d+/g);

const parse = input => input.split('\n').map(line => extractNumeric(line).map(Number))

const run = (data) => {
    const wallsAtH = h => {
        let res = [];
        data.filter(([x, wh, w]) => wh >= h).forEach(([x, wh, w]) => {
            res.push(x);
            if (w > 1) res.push(x + w - 1);
        })
        return res;
    }

    let total = 0, ys = [];

    data.forEach(([x, h, w]) => {
        if (!ys.includes(h)) ys.push(h);
        total += h;
        if (w > 1) total += h;
    })

    ys.sort((a, b) => b - a);

    for (let y = 0; y < ys.length; y++) {
        let wallsY0 = wallsAtH(ys[y]);

        if (wallsY0.length <= 1) continue;

        let h = ys[y+1] !== undefined ? ys[y] - ys[y+1] : ys[y]; // height of the layer

        for (let x = 1; x < wallsY0.length; x++) {
            let w = wallsY0[x] - wallsY0[x-1] - 1;
            if (w <= 0) continue;
            total += w*h;
        }
    }
    
    return total;
}

console.log('p1', run(parse(input1)));
console.log('p2', run(parse(input2)));
console.log('p3', run(parse(input3)));
