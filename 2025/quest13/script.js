const parse = input => input.split('\n').map(Number)
const parse2 = input => input.split('\n').map(row => row.split('-').map(Number))

const p1 = (arr, dials = 2025) => {
    let data = Array(arr.length+1);
    data[0] = 1;
    arr.forEach((v, i) => {
        let pos = Math.floor(i/2);
        if (i % 2 == 0) data[1+pos] = v; else data[data.length-1-pos] = v
    })
    return data[dials % data.length]
}

const p2 = (arr, dials = 20252025) => {
    let data = Array(arr.length+1);
    data[0] = [1];
    arr.forEach(([from, to], i) => {
        let pos = Math.floor(i/2);
        let v = [];
        for (let n = from; n <= to; n++) v.push(n);
        if (i % 2 == 0) data[1+pos] = v; else data[data.length-1-pos] = v.reverse()
    })

    let len = data.reduce((a, v) => a+v.length, 0);
    let resPos = dials % len, dataId = 0;

    while (data[dataId].length < resPos) {
        resPos -= data[dataId].length;
        dataId++;
    }

    return data[dataId][resPos];
}

console.log('p1', p1(parse(input1)));
console.log('p2', p2(parse2(input2)));
console.log('p3', p2(parse2(input3), 202520252025));