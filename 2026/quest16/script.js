const extractNumeric = line => line.match(/-?\d+/g);

Object.defineProperty(Array.prototype, 'sum', {
    value: function() {
        return this.reduce((a, v) => a + v, 0);
    }
});

const parse = input => input.split('');

// original naive bruteforce
const run = (data, part = 1) => {
    let changed = true, len = data.length, flips = 0, stonesFlipped = 0;

    let i = 0, s = data[i++];

    while (changed || i < len) {
        changed = false;
        while (i < len && data[i] === s) i++;

        if (i < len) {
            let j = len-1;
            while (j > i && data[j] !== s) j--;

            // flip
            if (j > i) {
                changed = true;
                data = [...data.slice(0, i), ...data.slice(i, j+1).reverse(), ...data.slice(j+1)];
                flips++;
                stonesFlipped += j+1 - i;
                s = data[i++];
            } else {
                s = data[i];
            }
        }
    }
    return part === 1 ? flips : stonesFlipped;
}

// brute force optimized by utilizing randomized balanced binary trees
// for a clever solution see run3 below
const runFast = (data, part = 1) => {
    if (!data.length) return 0;

    const bits = new Map();

    const size = t => t ? t.size : 0;
    const length = t => t ? t.length : 0;
    const mask = t => t ? t.mask : 0n;

    const makeNode = (bit, width) => ({
        bit, width,
        size: 1,
        length: width,
        mask: bit,
        priority: Math.random(),
        left: null,
        right: null,
        reversed: false
    });

    const pull = t => {
        t.size = 1 + size(t.left) + size(t.right);
        t.length = t.width + length(t.left) + length(t.right);
        t.mask = t.bit | mask(t.left) | mask(t.right);
    };

    const push = t => {
        if (!t.reversed) return;

        [t.left, t.right] = [t.right, t.left];

        if (t.left) t.left.reversed = !t.left.reversed;
        if (t.right) t.right.reversed = !t.right.reversed;

        t.reversed = false;
    };

    const merge = (a, b) => {
        if (!a || !b) return a || b;

        if (a.priority > b.priority) {
            push(a);
            a.right = merge(a.right, b);
            pull(a);
            return a;
        }

        push(b);
        b.left = merge(a, b.left);
        pull(b);
        return b;
    };

    const split = (t, k) => {
        if (!t) return [null, null];

        push(t);

        if (k <= size(t.left)) {
            const [a, b] = split(t.left, k);
            t.left = b;
            pull(t);
            return [a, t];
        }

        const [a, b] = split(t.right, k - size(t.left) - 1);
        t.right = a;
        pull(t);

        return [t, b];
    };

    const getBit = (t, i) => {
        push(t);

        const left = size(t.left);

        if (i < left) return getBit(t.left, i);
        if (i === left) return t.bit;

        return getBit(t.right, i - left - 1);
    };

    const firstDifferent = (t, from, bit, offset = 0) => {
        if (!t || offset + t.size <= from || (t.mask & ~bit) === 0n)
            return -1;

        push(t);

        const pos = offset + size(t.left);

        let k = firstDifferent(t.left, from, bit, offset);
        if (k >= 0) return k;

        if (pos >= from && t.bit !== bit) return pos;

        return firstDifferent(t.right, from, bit, pos + 1);
    };

    const lastSame = (t, from, bit, offset = 0) => {
        if (!t || offset + t.size <= from || (t.mask & bit) === 0n)
            return -1;

        push(t);

        const pos = offset + size(t.left);

        let k = lastSame(t.right, from, bit, pos + 1);
        if (k >= 0) return k;

        if (pos >= from && t.bit === bit) return pos;

        return lastSame(t.left, from, bit, offset);
    };

    // build run-length encoded treap
    let root = null, n = 0;

    for (let i = 0; i < data.length;) {
        const c = data[i];

        if (!bits.has(c))
            bits.set(c, 1n << BigInt(bits.size));

        let j = i + 1;
        while (j < data.length && data[j] === c) j++;

        root = merge(root, makeNode(bits.get(c), j - i));
        n++;
        i = j;
    }

    // execute the original reversal strategy
    let i = 1, s = getBit(root, 0);
    let flips = 0, stonesFlipped = 0;

    while (i < n) {
        i = firstDifferent(root, i, s);
        if (i < 0) break;

        const j = lastSame(root, i + 1, s);

        if (j > i) {
            const [a, t] = split(root, i);
            const [b, c] = split(t, j - i + 1);

            const reversedLength = length(b);

            b.reversed = !b.reversed;
            root = merge(a, merge(b, c));

            flips++;
            stonesFlipped += reversedLength;
        } else {
            s = getBit(root, i);
        }
    }

    return part === 1 ? flips : stonesFlipped;
};


// 2 pointers idea based solution
const run3 = input => {
    let data = input.repeat(100);
    let allFlips = 0;

    const getFlips = () => {
        let lst = [];
        let flips = 0;
        let s = 0, e = data.length - 1;
        const A = data[s];

        while (s <= e) {
            while (s <= e && data[s] === A) s++;

            while (s <= e && data[e] !== A) {
                lst.push(data[e]);
                e--;
            }

            flips += e - s + 1;

            while (s <= e && data[e] === A) e--;

            while (s <= e && data[s] !== A) {
                lst.push(data[s]);
                s++;
            }

            flips += e - s + 1;
        }

        data = lst;
        return flips;
    };

    while (data.length > 0) {
        allFlips += getFlips();
    }

    return allFlips;
};

console.log('p1', run(parse(input1)));
console.log('p2', run(input2.repeat(10).split(''), 2));
console.log('p3', runFast(input3.repeat(100).split(''), 2));

//console.log('p3', run3(input3));
