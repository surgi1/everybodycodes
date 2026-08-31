const parse = input => input.split('\n').map(line => line.split(',').map(Number))

const run1 = (data) => {
    const processLine = line => {
        let p = 0, seen = new Set();
        for (let i = 0; i < line.length; i++) {
            seen.add(p);
            let dest = p - line[i];
            if (dest > 0 && !seen.has(dest)) {
                p = dest;
            } else {
                p += line[i];
            }
        }
        return p;
    }

    return data.map(line => processLine(line)).reduce((a, v) => a+v, 0)
}

const run2 = (data) => {
    const processLine = line => {
        let p = 0, seen = new Set();
        for (let i = 0; i < line.length; i++) {
            seen.add(p);
            let dest = p - line[i];
            if (dest > 0 && !seen.has(dest)) {
                p = dest;
            } else {
                p += line[i];
                while (seen.has(p)) p++;
            }
        }
        return p;
    }

    return data.map(line => processLine(line)).reduce((a, v) => a+v, 0)
}

const run3 = (data) => {
    const processLine = line => {
        let p = 0, used = new Set([0]);
        let intervals = { up: [], down: [[0, 0]] };
        let side = 'up';

        const crosses = (from, to, [a, b]) => {
            let lo = Math.min(from, to), hi = Math.max(from, to);
            return (a > lo && a < hi) !== (b > lo && b < hi);
        }

        const isWall = p => intervals[side].some(([a, b]) => p === a || p === b);

        const addInterval = (from, to) => intervals[side].push([Math.min(from, to), Math.max(from, to)]);

        for (let i = 0; i < line.length; i++) {
            let num = line[i];

            // try backwards
            let dest = p - num;

            if (
                dest >= 0 &&
                !isWall(dest) &&
                !intervals[side].some(interval => crosses(p, dest, interval))
            ) {
                addInterval(p, dest);

                p = dest;
                used.add(p);
                side = side === 'up' ? 'down' : 'up';
                continue;
            }

            // try forwards
            dest = p + num;

            while (true) {
                if (used.has(dest)) {
                    dest++;
                    continue;
                }

                let crossing = intervals[side].find(interval => crosses(p, dest, interval));

                if (!crossing) break;

                let [from, to] = crossing;

                // started inside this interval, so moving further can never get us across it legally
                if (from <= p && p < to) {
                    dest = null;
                    break;
                }

                // candidate lies inside an interval ahead of us; skip the whole interval instead of checking its points
                dest = to + 1;
            }

            if (dest !== null) {
                addInterval(p, dest);

                p = dest;
                used.add(p);
                side = side === 'up' ? 'down' : 'up';
            }
        }

        return p;
    }

    return data.map(line => processLine(line)).reduce((a, v) => a+v, 0)
}
console.log('p1', run1(parse(input1)));
console.log('p2', run2(parse(input2)));
console.log('p3', run3(parse(input3)));