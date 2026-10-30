const parse = (input, cut = 4) => input.split('\n').map(lineLit => lineLit.substring(cut).split(' '))

const mod = (n, m) => ((n % m) + m) % m;

const getVal = o => {
    let pow = 0, res = 0;

    for (let i = o[1].length-1; i >= 0; i--) {
        res += o[1][i] * Math.pow( o[0][mod((o[0].length - 1 - pow), o[0].length)], pow)
        pow++;
    }
    return res;
}

const run = arr => arr.reduce((total, o) => total + getVal(o), 0)

const run3 = arr => arr.reduce((total, o) => {
    let val = getVal(o), res = val;

    for (let n = 1 ; n < Number(o[1]); n++) {
        if (getVal([o[0], n+'']) === val) {
            res = 0;
            break;
        }
    }

    return total + res;
}, 0)

console.log('p1', run(parse(input1)));
console.log('p2', run(parse(input2)));
console.log('p3', run3(parse(input3, 5)));