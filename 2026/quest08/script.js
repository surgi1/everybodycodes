const parse = input => input.trim().split(/\r?\n/).map(line =>
    [...line].map(v => v == '.' ? null : {height: +v, respawnAt: 0})
);

Object.defineProperty(Array.prototype, 'sum', {
    value: function() {
        return this.reduce((a, v) => a + v, 0);
    }
});

const directions = [[1, 1], [-1, 1], [-2, 0], [-1, -1], [1, -1], [2, 0]];

const scan = (map, dx, dy) => {
    let h = map.length, w = map[0].length;
    let rows = [];

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (!map[y][x] || map[y-dy]?.[x-dx]) continue;

            let row = [];
            for (let xx = x, yy = y; map[yy]?.[xx] !== undefined; xx += dx, yy += dy) {
                if (map[yy][xx]) row.push(map[yy][xx]);
            }
            rows.push(row);
        }
    }
    return rows;
};

const processRow = row => {
    let shadow = 0;
    let lit = [];

    row.forEach(cell => {
        if (cell.height > shadow) lit.push(cell);
        shadow = Math.max(0, shadow - 1, cell.height - 1);
    });
    return lit;
};

const run = map => scan(map, 1, 1).map(row => processRow(row).length).sum();

const run2 = map => directions.map(([dx, dy]) =>
    scan(map, dx, dy).map(row => processRow(row).length).sum()
).sum();

const run3 = (map, target = 100000) => {
    const rounds = directions.map(([dx, dy]) => scan(map, dx, dy));
    const cells = map.flat().filter(Boolean);

    let round = 0, warriors = 0, energy = 0;

    while (warriors < target) {
        round++;

        cells.forEach(cell => {
            if (cell.respawnAt == round) {
                cell.height = 1;
                cell.respawnAt = 0;
            }
        });

        let growing = rounds[(round - 1) % 6].flatMap(processRow);
        energy += growing.length;

        growing.forEach(cell => {
            if (cell.height == 9) {
                warriors++;
                cell.height = 0;
                cell.respawnAt = round + 4;
            } else {
                cell.height++;
            }
        });
    }

    return {round, warriors, energy};
};

console.log('p1', run(parse(input1)));
console.log('p2', run2(parse(input2)));
console.log('p3', run3(parse(input3)));
