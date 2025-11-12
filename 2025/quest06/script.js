const parse = input => input.split('')

const map = {A: 0, B: 1, C: 2, a: 0, b: 1, c: 2}

const p1 = (data, p1 = true) => {
    let res = [0, 0, 0];
    let masters = [0, 0, 0];
    data.forEach(v => {
        if (v === v.toUpperCase()) masters[map[v]]++;
        if (v === v.toLowerCase()) res[map[v]] += masters[map[v]];
    })
    if (p1) return res[0];
    return res.reduce((a, v) => a+v, 0);
}

const p3 = (s, times = 1000, dist = 1000) => {
    let len = s.length;
    let data = s.repeat(3).split('');
    let mentors = [[], [], []]; // positions

    data.forEach((v, i) => {
        if (v === v.toUpperCase()) mentors[map[v]].push(i);
    })

    let res = [0, 0, 0]; // all types of pairs for each of 3 segments, left middle right

    data.forEach((v, i) => {
        if (v !== v.toLowerCase()) return true;
        let count = mentors[map[v]].filter(m => Math.abs(m-i) <= dist).length;
        if (i < len) res[0] += count;
        else if (i >= len && i < len*2-1) res[1] += count;
        else res[2] += count;
    })

    return res[0] + res[2] + res[1]*(times-2);
}


console.log('p1', p1(parse(input1)));
console.log('p2', p1(parse(input2), false));
console.log('p3', p3(input3))
