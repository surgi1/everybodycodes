const init = input => input.split("\n").map(line => line.split(''));
const val = s => s.split('').map(c => c.charCodeAt(0) - 'A'.charCodeAt(0) + 1).reduce((a, v, i) => a+v*(i+1), 0);
const extractMiddle = arr => arr.map(row => row.slice(2, 6)).slice(2, 6).flat();
const isSolved = s => !s.includes('.');

const solve = (arr, returnRaw = false) => {
    arr.forEach((row, y) => row.forEach((v, x) => {
        if (v != '.') return true;
        let col = arr.map(r => r[x]);
        let matches = row.filter(ch => ch != '.' && col.includes(ch));
        if (matches.length == 1) {
            arr[y][x] = matches[0];
        }
    }))

    arr.forEach((row, y) => row.forEach((v, x) => {
        if (v != '.') return true;
        let col = arr.map(r => r[x]);
        if (!(row.includes('?') || col.includes('?'))) return true;
        let letters = {};
        [...row, ...col].filter(l => !['?', '.'].includes(l)).forEach(l => {
            letters[l] = letters[l] == undefined ? 1 : letters[l]+1;
        })

        let missingLetters = Object.entries(letters).filter(([l, count]) => count == 1).map(([l, count]) => l);

        if (missingLetters.length !== 1) return true; // can't do

        arr[y][x] = missingLetters[0];

        // and fill questions marks
        arr[y].forEach((l, pos) => (l == '?') && (arr[y][pos] = missingLetters[0]));
        arr.forEach((r, fy) => (r[x] == '?') && (arr[fy][x] = missingLetters[0]));
    }))

    return returnRaw ? arr : extractMiddle(arr).join('');
}

const extractCard = (marr, col, row, spanX = 9, spanY = 9) => {
    let arr = Array.from({length: 8}, () => []);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) arr[y][x] = marr[row*spanY+y][col*spanX+x];
    return arr;
}

const part2 = (input, cols = 15, rows = 7) => {
    let marr = init(input), res = 0;

    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) 
        res += val(solve(extractCard(marr, x, y)));

    return res;
}

const part3 = (input, cols = 2, rows = 2) => {
    let marr = init(input),
        res = 0, prevRes = 1;

    const updateCard = (col, row, arr) => {
        for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
            if (arr[y][x] != '?') marr[ row*6+y][ col*6+x] = arr[y][x];
        }
    }

    while (prevRes != res) {
        prevRes = res;
        res = 0;

        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
            let solved = solve(extractCard(marr, x, y, 6, 6), true);
            if (isSolved(solved.flat())) {
                updateCard(x, y, solved);
                res += val(extractMiddle(solved).join(''));
            }
        }
    }

    return res;
}

console.log('p1', solve(init(input1)));
console.log('p2', part2(input2));
console.log('p3', part3(input3, 20, 10));
