let arr, actors = [], rows, clappingRowIndex, seen = {};

const arr2actors = () => {
    actors = [];
    arr.forEach((row, y) => row.forEach((v, x) => {
        if (v != undefined) actors.push({
            x:x, y:y, v:Number(v)
        })
    }))
}

const actors2arr = () => {
    arr = [];
    actors.forEach(o => {
        if (arr[o.y] == undefined) arr[o.y] = [];
        arr[o.y][o.x] = o.v;
    });
}

const key = () => clappingRowIndex+'_'+JSON.stringify(arr);
const shout = () => arr[0].reduce((s, v, i) => s + '' + actors.filter(o => o.y == 0 && o.x == i)[0].v , '')

const round = () => {
    let clapper = actors.filter(o => o.x == clappingRowIndex && o.y == 0)[0];
    actors.filter(o => o.x == clappingRowIndex).forEach(o => o.y--); // clapper has y = -1 now
    clapper.x = (clapper.x+1) % rows; // add clapper to the next row

    let clapperRowLen = actors.filter(o => o.x == clapper.x && o.y >= 0).length;

    let claps = clapper.v % (2*clapperRowLen);

    if (claps == 0) claps = 2*clapperRowLen;

    if (claps <= clapperRowLen) {
        actors.filter(o => o.x == clapper.x && o.y >= claps-1).forEach(o => o.y++);
        clapper.y = Math.max(0, claps-1);
    } else {
        let rest = claps - clapperRowLen; // 5-3 = 2
        let maxY = Math.max( ...actors.filter(o => o.x == clapper.x).map(o => o.y) ); // 2
        actors.filter(o => o.x == clapper.x && maxY - o.y < rest-1).forEach(o => o.y++);
        clapper.y = Math.max(0, maxY - (rest-2));
    }

    clappingRowIndex = (clappingRowIndex+1) % rows;
}

const init = input => {
    arr = input.split("\n").map(l => l.split(' ').map(Number));
    arr2actors();
    clappingRowIndex = 0;
    rows = arr[0].length;
}

const part1 = () => {
    init(input1);
    for (let rnd = 0; rnd < 10; rnd++) round();
    console.log('p1', shout());
}

// could be sped up by watching the increments, BF works too tho
const part2 = () => {
    let shouts = {}, i = 0;
    init(input2);

    while (true) {
        round();
        i++;
        let s = shout();
        if (shouts[s] === undefined) shouts[s] = 0;
        shouts[s]++;

        if (shouts[s] >= 2024) {
            console.log('p2', i, s, i*s);
            break;
        }
    }
}

const part3 = () => {
    let best = 0;
    init(input);

    while (true) {
        actors2arr();
        let k = key();

        if (seen[k] !== undefined) break;
        seen[k] = 1;

        round();
        let b = Number(shout());
        if (best < b) best = b;
    }

    console.log('p3', best);
}

part1();
part2();
part3();
