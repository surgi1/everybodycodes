const parse = input => input.split('\n').map(line => line.match(/\d+/g).map(Number))

const eni1 = (n, exp, mod) => {
    let score = 1;
    let fck = [];

    while (exp > 0) {
        score = (score * n) % mod;
        fck.push(score);
        exp--;
    }
    
    return Number(fck.reverse().join(''));
};

const fastModularExponentiation = (a, b, n) => {
    a = a % n;
    let result = 1;
    let x = a;

    while (b > 0) {
        let leastSignificantBit = b % 2;
        b = Math.floor(b / 2);

        if (leastSignificantBit == 1) {
            result = result * x;
            result = result % n;
        }

        x = x * x;
        x = x % n;
    }
    return result;
};

const eni2 = (n, exp, mod) => {
    let score = 1;
    let fck = [];

    score = fastModularExponentiation(n, exp-100, mod);
    exp = 100;

    while (exp > 0) {
        score = (score * n) % mod;
        if (exp < 10) {
            fck.push(score);
            if (fck.length > 5) fck.shift();
        }
        exp--;
    }

    while (fck.length > 5) fck.shift();
    
    return Number(fck.reverse().join(''));
};

const eni3 = (n, exp, mod) => {
    let score = 1;
    let fck = [];
    let origExp = exp;

    let sequenceStart = false;

    while (exp > 0) {
        score = (score * n) % mod;
        for (let j = 0; j < fck.length; j++) {
            if (fck[j] == score) {
                sequenceStart = j; // index of first item of the sequence
                break;
            }
        }
        if (sequenceStart !== false) break;
        fck.push(score);
        exp--;
    }

    let sequenceLength = fck.length - sequenceStart;

    let postSequenceLength = (origExp - sequenceStart) % sequenceLength;

    let preSequenceSum = 0, sequenceSum = 0, postSequenceSum = 0;

    for (let j = 0; j < sequenceStart; j++) preSequenceSum += fck[j];
    for (let j = sequenceStart; j < sequenceStart + sequenceLength; j++) sequenceSum += fck[j];
    for (let j = sequenceStart; j < sequenceStart + postSequenceLength; j++) postSequenceSum += fck[j];

    let sequenceReps = Math.floor((origExp - sequenceStart)/sequenceLength);

    let res = preSequenceSum + sequenceReps*sequenceSum + postSequenceSum;
    
    return res;
};


const run = (arr, eni) => Math.max(...arr.map(([A, B, C, X, Y, Z, M]) => eni(A, X, M) + eni(B, Y, M) + eni(C, Z, M)));

console.log('p1', run(parse(input1), eni1));
console.log('p2', run(parse(input2), eni2));
console.log('p3', run(parse(input3), eni3));
