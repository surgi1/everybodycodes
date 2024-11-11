let arr = input.split("\n").map(Number);

let min = Math.min(...arr);

function median(numbers) {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

//console.log(arr.reduce((a, v) => a + v-min, 0) )

let med = median(arr);
console.log(arr.reduce((a, v) => a + Math.abs(v-med), 0) )