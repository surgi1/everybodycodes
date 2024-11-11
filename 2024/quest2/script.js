const part1 = (wordsLit, s) => wordsLit.split(',').reduce((a, v) => a+s.split(v).length-1, 0);
const getMap = s => s.split('\n').map(l => l.split(''));
const k = (y, x) => y+'_'+x;
const getRes = o => Object.keys(o).length;

const getWords = s => {
    let res = s.split(','), rev = [];
    res.forEach(w => {
        let rw = w.split('').reverse().join('')
        if (!res.includes(rw)) rev.push(rw);
    })
    return [...res, ...rev];
}

const part2 = (wordsLit, s) => {
    let words = getWords(wordsLit),
        map = getMap(s),
        marked = {};

    map.forEach((arr, y) => {
        words.forEach(word => {
            let wordLen = word.length;
            for (let i = 0; i <= arr.length-wordLen; i++) {
                let cmpWord = '';
                for (let j = i; j < i+wordLen; j++) cmpWord += arr[j];
                if (cmpWord == word) for (let j = i; j < i+wordLen; j++) marked[ k(y,j) ] = 1;
            }
        })
    });

    return getRes(marked);
}

const part3 = (wordsLit, s) => {
    let words = getWords(wordsLit),
        map = getMap(s),
        marked = {};

    map.forEach((arr, y) => {
        words.forEach(word => {
            let wordLen = word.length;
            for (let i = 0; i <= arr.length; i++) {
                let cmpWord = '';
                for (let j = i; j < i+wordLen; j++) cmpWord += arr[j % arr.length];
                if (cmpWord == word) for (let j = i; j < i+wordLen; j++) marked[ k(y,j % arr.length) ] = 1;
            }
        })
    });

    for (let x = 0; x < map[0].length; x++) {
        let arr = map.reduce((a, row) => a+row[x], '').split('');
        words.forEach(word => {
            let wordLen = word.length;
            for (let i = 0; i < arr.length; i++) {
                let cmpWord = '';
                for (let j = i; j < i+wordLen; j++) cmpWord += arr[j];
                if (cmpWord == word) for (let j = i; j < i+wordLen; j++) marked[ k(j,x) ] = 1;
            }
        })
    }

    return getRes(marked);
}

console.log('p1', part1(words1, text1));
console.log('p2', part2(words2, text2));
console.log('p3', part3(words3, text3));