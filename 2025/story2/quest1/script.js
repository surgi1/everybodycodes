const parseSection = input => input.split('\n\n');

const parse = input => {
    let [boardLit, seqs] = parseSection(input);
    return [
        boardLit.split('\n').map(line => line.split('').map(v => v == '.' ? 0 : 1)),
        seqs.split('\n').map(line => line.split(''))
    ]
}

const score = (slotIn, slotOut) => Math.max(0, slotOut*2 - slotIn);

const simulate = (board, seq, x) => {
    let y = 0, i = 0;
    while (y < board.length) {
        if (board[y][x] != 0) {
            if (x == 0) {
                x++;
            } else if (x == board[y].length-1) {
                x--;
            } else {
                if (seq[i] == 'L') x--; else x++;
            }
            i++;
        }
        y++;
    }
    return x;
}

const run = input => {
    let [board, seqs] = parse(input);
    return seqs.reduce((res, seq, i) => res + score(i+1, simulate(board, seq, i*2)/2+1), 0)
}

const run2 = input => {
    let [board, seqs] = parse(input);
    return seqs.reduce((res, seq, i) => {
        res + score(i+1, simulate(board, seq, i*2)/2+1);

        let arr = [];
        for (let n = 0; n <= (board[0].length-1)/2; n++) arr.push( score(n+1, simulate(board, seq, n*2)/2+1) );
        return res + Math.max(...arr)
    }, 0)
}

// with cache for picked input slots combo, runtime ~200ms
const run3 = input => {
    let [board, seqs] = parse(input);
    let lookup = [];

    for (let n = 0; n <= (board[0].length-1)/2; n++) {
        lookup.push(seqs.map((seq, i) => score(n+1, simulate(board, seq, n*2)/2+1)));
    }
    //console.table(lookup);

    let min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY;
    let mins = {}, maxs = {};

    let queue = lookup.map((col, i) => ({sum: col[0], usedIds: [i], depth: 1})), cur;

    while (cur = queue.pop()) {
        if (cur.depth > 5) {
            if (cur.sum < min) min = cur.sum;
            if (cur.sum > max) max = cur.sum;
            continue;
        }

        let k = cur.usedIds.sort().join('_');
        let progress = false;
        if (mins[k] === undefined || mins[k] > cur.sum) {mins[k] = cur.sum; progress = true;}
        if (maxs[k] === undefined || maxs[k] < cur.sum) {maxs[k] = cur.sum; progress = true;}
        if (!progress) continue;

        lookup.forEach((col, i) => {
            if (!cur.usedIds.includes(i)) {
                let tmp = [];
                tmp.sum = cur.sum + col[cur.depth];
                tmp.usedIds = cur.usedIds.slice();
                tmp.usedIds.push(i);
                tmp.depth = cur.depth+1;
                queue.push(tmp);
            }
        })
    }

    return min + ' ' + max;
}

console.log('p1', run(input1));
console.log('p2', run2(input2));
console.log('p3', run3(input3));
