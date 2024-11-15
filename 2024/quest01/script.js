const xlate = {A: 0, B: 1, C: 3, x: 0, D: 5}

const baseSum = arr => arr.reduce((a, v) => a+xlate[v], 0);

const run = (s, chunk = 2) => {
    let res = 0, arr = s.split('');

    for (let i = 0; i < arr.length/chunk; i++) {
        let subArr = arr.slice(i*chunk, i*chunk + chunk);
        let nx = subArr.filter(v => v != 'x').length;
        res += baseSum(subArr) + nx*(nx-1);
    }
    return res;
}

console.log('p1', baseSum(input1.split('')));
console.log('p2', run(input2));
console.log('p3', run(input3, 3));