const parse = input => input.split('\n').map(line => line.split('|').map(Number))

// p1 is 2025*arr[0]/arr.pop()
// p2 is Math.ceil(10000000000000*arr.pop()/arr[0])

const p3 = arr => {
    let res = arr[0][0]*100, i = 1;
    while (i < arr.length-1) {
        res = res*arr[i][1]/arr[i][0];
        i++;
    }
    return Math.floor(res/arr[arr.length-1][0]);
}

console.log('p3', p3(parse(input3)));
