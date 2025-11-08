const parse = input => input.split(',').map(Number)

const p1 = arr => arr.sort((a, b) => b-a).reduce((a, v, i) => a + (i > 0 ? (v < arr[i-1] ? v : 0) : v), 0)

const p2 = arr => {
    let res = 0, size = 0;
    arr.sort((a, b) => a-b);
    for (let i = 0; i < arr.length; i++) {
        if (i == 0 || arr[i] > arr[i-1]) {
            res += arr[i];
            size++;
        }
        if (size == 20) break;
    }
    return res;
}

const p3 = arr => {
    arr.sort((a, b) => b-a)
    let res = 0;
    while (arr.length > 0) {
        arr = arr.filter((v, i) => !(i == 0 || arr[i] < arr[i-1]));
        res++;
    }
    return res;
}

console.log('p1', p1(parse(input1)));
console.log('p2', p2(parse(input2)));
console.log('p3', p3(parse(input3)));
