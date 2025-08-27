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

// super greedy approach, compute cache table and then check all combinations
const run3 = input => {
    let [board, seqs] = parse(input);
    let lookup = [];

    for (let n = 0; n <= (board[0].length-1)/2; n++) {
        lookup.push(seqs.map((seq, i) => score(n+1, simulate(board, seq, n*2)/2+1)));
    }
    console.table(lookup);

    let max = 0, min = 200;

    const iterate = (baseSum = 0, pos = 0, omitIds = []) => {
        if (pos > 5) {
            if (max < baseSum) max = baseSum;
            if (min > baseSum) min = baseSum;
            return;
        }
        for (let n = 0; n < 20; n++) {
            if (!omitIds.includes(n)) iterate(baseSum + lookup[n][pos], pos+1, [...omitIds, n]);
        }
    }

    iterate();

    return min + ' ' + max;
}

//console.log('p1', run(input1));
//console.log('p2', run2(input2));
console.log('p3', run3(input3));
