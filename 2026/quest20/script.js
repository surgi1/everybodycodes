Object.defineProperty(Array.prototype, 'sum', {
    value: function() {
        return this.reduce((a, v) => a + v, 0);
    }
});

const parse = input => input.split('\n')

const charSegs = ch => {
    switch (ch) {
        case ' ': return 0;
        case '0':
        case '6':
        case '9':
        case 'A':
            return 6;
        case '1':
        case '+':
        case '=':
            return 2;
        case '-':
            return 1;
        case '2':
        case '3':
        case '5':
            return 5;
        case '4':
            return 4;
        case '7':
            return 3;
        case '8':
            return 7;
    }
}

const check = expr => math.evaluate(fromBase11(Array.isArray(expr) ? expr.join('') : expr).replace('=', '=='));

const segs = s => s.split('').map(char => charSegs(char)).sum()

const run = (data) => data.filter(line => math.evaluate(line.replace('=', '=='))).map(line => segs(line)).sum()

const fromBase11 = s => s.split(' ').map(n => {
    if (['+', '-', '='].includes(n)) return n;
    return parseInt(n, 11) + '';
}).join(' ');

const run2 = (data) => data.filter(line => check(line)).map(line => segs(line)).sum().toString(11)

// for p3, mappings between glyphs (what given glyph transforms to if its added / removed 1 segment) and seg moved in the glyph (total seg count in that glyph stays the same)
const SEG_UP = {
    '0': ['8'],
    '1': ['7'],
    '2': [],
    '3': ['9'],
    '4': [],
    '5': ['6', '9'],
    '6': ['8'],
    '7': [],
    '8': [],
    '9': ['8'],
    'A': ['8'],
    '-': ['+']
}

const SEG_DOWN = {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': ['5'],
    '7': ['1'],
    '8': ['9', '6', '0', 'A'],
    '9': ['3', '5'],
    'A': [],
    '+': ['-']
}

const SEG_MOVE = {
    '0': ['9', '6', 'A'],
    '1': [],
    '2': ['3'],
    '3': ['5', '2'],
    '4': [],
    '5': ['3'],
    '6': ['0', '9', 'A'],
    '7': [],
    '8': [],
    '9': ['6', '0', 'A'],
    'A': ['9', '0', '6']
}

const isFixable = (line, id) => {
    if (check(line)) return true;

    let tmp = line.split('');

    // now, try moving a segment inside a glyph
    for (let i = 0; i < tmp.length; i++) {
        let v = tmp[i];
        if (SEG_MOVE[v] !== undefined && SEG_MOVE[v].length > 0) {
            for (const w of SEG_MOVE[v]) {
                let nTmp = tmp.slice();
                nTmp[i] = w;
                if (check(nTmp)) return true;
            }
        }
    }

    // now, try removing a segment from one glyph and adding it to another glyph
    for (let i = 0; i < tmp.length; i++) {
        let v = tmp[i];
        if (SEG_DOWN[v] !== undefined && SEG_DOWN[v].length > 0) {
            for (const w of SEG_DOWN[v]) {
                let nTmp = tmp.slice();
                nTmp[i] = w;
                for (let j = 0; j < nTmp.length; j++) {
                    if (i === j) continue;
                    let u = nTmp[j];
                    if (SEG_UP[u] !== undefined && SEG_UP[u].length > 0) {
                        for (const x of SEG_UP[u]) {
                            let mTmp = nTmp.slice();
                            mTmp[j] = x;
                            if (check(mTmp)) return true;
                        }
                    }
                }
            }
        }
    }

    return false
}

const run3 = (data) => data.filter((line, id) => isFixable(line, id)).map(line => segs(line)).sum().toString(11)

console.log('p1', run(parse(input1)));
console.log('p2', run2(parse(input2)));
console.log('p3', run3(parse(input3)));
