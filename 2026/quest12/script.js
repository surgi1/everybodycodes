const parse = input => input.split('\n').map(line => line.split(''))

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const solve = grid => {
    const rows = grid.length, cols = grid[0].length;

    let total = 0;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x] === '.') continue;

            // floodfill along the whole shape
            const stack = [[x, y]];
            const block = new Set([y * cols + x]);

            let x0 = x, x3 = x, y0 = y, y3 = y;

            while (stack.length) {
                const [cx, cy] = stack.pop();
                grid[cy][cx] = '.';

                x0 = Math.min(x0, cx);
                x3 = Math.max(x3, cx);
                y0 = Math.min(y0, cy);
                y3 = Math.max(y3, cy);

                for (const [dx, dy] of DIRS) {
                    const nx = cx + dx, ny = cy + dy;

                    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
                    if (grid[ny][nx] !== '#') continue;

                    const key = ny * cols + nx;

                    if (!block.has(key)) {
                        block.add(key);
                        stack.push([nx, ny]);
                    }
                }
            }

            // mind the gap
            let x1 = Infinity, x2 = -Infinity;
            let y1 = Infinity, y2 = -Infinity;

            for (let gy = y0; gy <= y3; gy++) {
                for (let gx = x0; gx <= x3; gx++) {
                    if (!block.has(gy * cols + gx)) {
                        x1 = Math.min(x1, gx);
                        x2 = Math.max(x2, gx);
                        y1 = Math.min(y1, gy);
                        y2 = Math.max(y2, gy);
                    }
                }
            }

            if (x1 === Infinity) {
                // no gap
                const width = x3 - x0 + 1;
                const height = y3 - y0 + 1;

                total += Math.min(width, height);
            } else {
                const left = x1 - x0;
                const right = x3 - x2;
                const top = y1 - y0;
                const bottom = y3 - y2;

                const gapWidth = x2 - x1 + 1;
                const gapHeight = y2 - y1 + 1;

                total += Math.min(
                    left + right + Math.min(top, gapWidth) + Math.min(bottom, gapWidth),
                    top + bottom + Math.min(left, gapHeight) + Math.min(right, gapHeight)
                );
            }
        }
    }

    return total;
};

console.log('p1', solve(parse(input1)));
console.log('p2', solve(parse(input2)));
console.log('p3', solve(parse(input3)));
