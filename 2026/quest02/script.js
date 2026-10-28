const parse = input => input.split('\n').map(lineLit => lineLit.split(' ').map(cmpLit => cmpLit.split('').map(v => isNaN(v) ? v : Number(v))))

const getCmp = (cmps, a, b) => cmps.filter(o => (o[0] === a && o[2] === b) || (o[0] === b && o[2] === a));
const getCmpAll = (cmps, a) => cmps.filter(o => o[0] === a || o[2] === a);

const relations = (cmps, i, mode = '<') => 
    getCmpAll(cmps, i)
        .filter(o => (o[0] === i && o[1] === (mode === '<' ? '<' : '>')) || (o[2] === i && o[1] === (mode === '<' ? '>' : '<')))
        .map(o => o[0] === i ? o[2] : o[0])

const run = (arr) => arr.reduce((res, cmps) => {
    let max = Math.max(...cmps.map(o => [o[0], o[2]]).flat());

    let nums = Array.from({length: max}, (_, i) => i+1)

    let pairsFull = max*(max-1)/2;

    while (cmps.length < pairsFull) {
        let lastLen = cmps.length;

        for (let i = 1; i <= max; i++) ['<','>'].forEach(mode => 
            relations(cmps, i, mode).forEach(n => relations(cmps, n, mode).forEach(j => {
                if (getCmp(cmps, i, j).length === 0) cmps.push([i, mode, j]); // (i > n > j) => i > j or (i < n < j) => i < j
            }))
        )

        if (lastLen === cmps.length) break;
    }

    nums.sort((a, b) => {
        let cmp = getCmp(cmps, a, b);
        if (cmp.length === 0) {
            console.log('undefined relationship between', a, b);
            return 0;
        }

        if (cmp[0][0] === a) {
            if (cmp[0][1] === '<') return 1; else return -1;
        } else {
            if (cmp[0][1] === '>') return 1; else return -1;
        }
    })

    return res + Number(nums.join(''))
}, 0)

console.log('p1', run(parse(input1)));
console.log('p2', run(parse(input2)));
console.log('p3', run(parse(input3)));
