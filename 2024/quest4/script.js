let arr = input.split("\n").map(Number);

const median = numbers => {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return (sorted.length % 2 === 0) ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

//let min = Math.min(...arr);
//console.log('p2', arr.reduce((a, v) => a + v-min, 0) );

let med = median(arr);
console.log('p3', arr.reduce((a, v) => a + Math.abs(v-med), 0) )