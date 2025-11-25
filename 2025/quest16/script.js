const parse = input => input.split(',').map(Number)

let sum = arr => arr.reduce((a, v) => a+v, 0);

const p1 = (data, len = 90) => sum(data.map(v => Math.floor(len/v)))

const p2 = (data, raw = false) => {
    let len = data.length;
    let spell = [], i = 1;
    while (sum(data) > 0) {
        if (data[i-1] == 1) {
            spell.push(i);
            data = data.map((v, j) => {
                if ((i == 1) || ((j+1) % i == 0) && j >= (i-1)) return v-1;
                return v;
            })
        }
        i++;
    }
    if (raw) return spell;
    return spell.reduce((a, v) => a*v, 1)
}

const p3 = (data, blocks = 202520252025000) => {
    let spell = p2(data, true);

    // binary search!
    let len = blocks/2, int = len/2;
    while (int > 1) {
        if (p1(spell, len) < blocks) {
            len += int;
        } else {
            len -= int;
        }
        int = Math.ceil(int/2);
    }

    // fix the tail
    len = len-2;
    while (p1(spell, len) <= blocks) len++

    return len-1;
}

console.log('p1', p1(parse(input1)));
console.log('p2', p2(parse(input2)));
//console.log('p3', p3(parse(input2t)));
console.log('p3', p3(parse(input3)));