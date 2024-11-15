const median = numbers => {
    let sorted = Array.from(numbers).sort((a, b) => a - b);
    let middle = Math.floor(sorted.length / 2);
    return (sorted.length % 2 === 0) ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

const run = (input, useMedian = false) => {
    let arr = input.split("\n").map(Number);
    let cmp = useMedian ? median(arr) : Math.min(...arr);
    return arr.reduce((a, v) => a + Math.abs(v - cmp), 0);
}

console.log('p1', run(input1));
console.log('p2', run(input2));
console.log('p3', run(input, true));