const parse = input => input.split('\n').map(Number)

const checksum = arr => arr.reduce((a, v, i) => a + v*(i+1), 0);

const p1 = (arr, steps = 10, p1 = true) => {
    let rounds = 0;

    let moved = true;
    while (moved === true && rounds <= steps) {
        moved = false;
        for (let col = 1; col < arr.length; col++) {
            if (arr[col-1] > arr[col]) {
                arr[col-1]--;
                arr[col]++;
                moved = true;
            }
        }
        rounds++;
    }

    moved = true;
    while (moved === true && rounds <= steps) {
        moved = false;
        for (let col = 1; col < arr.length; col++) {
            if (arr[col-1] < arr[col]) {
                arr[col-1]++;
                arr[col]--;
                moved = true;
            }
        }
        rounds++;
    }

    return p1 ? checksum(arr) : rounds-2;
}

const p3 = arr => {
    let mean = arr.reduce((a, v) => a+v)/arr.length;
    return arr
        .filter(n => n < mean)
        .reduce((sum, n) => sum + (mean - n), 0);
}

console.log('p1', p1(parse(input1)));
console.log('p2', p1(parse(input2), Number.POSITIVE_INFINITY, false));
console.log('p3', p3(parse(input3)));
