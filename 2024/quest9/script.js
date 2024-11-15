const init = input => input.split("\n").map(Number);

const buildTable = (to, stamps) => {
    let arr = Array.from({length: to}, () => Infinity);
    arr[0] = 0;
    for (let n = 1; n <= to; n++) {
        arr[n] = Math.min(...stamps.map(stamp => {
            if (n - stamp < 0) return Infinity;
            return arr[n - stamp]+1;
        }))
    }
    return arr;
}

const run = (arr, stamps) => {
    let memo = buildTable(Math.max(...arr), stamps);
    return arr.reduce((a, v) => a+memo[v], 0);
}

const run3 = (arr, stamps) => {
    let memo = buildTable(Math.max(...arr), stamps);
    
    return arr.reduce((a, v) => {
        let min = Infinity;
        for (let v1 = Math.floor(v/2); v1 <= Math.floor(v/2) + 50; v1++) {
            let v2 = v-v1;
            min = Math.min(min, memo[v1] + memo[v2]);
        }
        return a + min;
    }, 0);
}

console.log('p1', run(init(input1), [1, 3, 5, 10]));
console.log('p2', run(init(input2), [1, 3, 5, 10, 15, 16, 20, 24, 25, 30]));
console.log('p3', run3(init(input3), [1, 3, 5, 10, 15, 16, 20, 24, 25, 30, 37, 38, 49, 50, 74, 75, 100, 101]));
