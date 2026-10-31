const parse = input => input.split('\n').map(line => line.split(''))

const offMap = (map, x, y) => map[y] === undefined || map[y][x] === undefined;

const step = (map, checks = [{vals: ['1', '#'], min: 5}, {vals: ['#'], min: 1}], mark = '#', eligible = ['1', '0', '#'], size = 1, corners = true) => {
    let res = structuredClone(map);

    map.forEach((row, y) => row.forEach((v, x) => {
        if (eligible !== true && !eligible.includes(v)) return true;

        checks.forEach(o => o.sum = 0);

        for (let i = -size; i <= size; i++) for (let j = -size; j <= size; j++) {
            if (i === 0 && j === 0) continue;

            if (!corners && (Math.abs(i) + Math.abs(j) == 2*size)) continue;

            if (offMap(map, x+j, y+i)) {
                checks.forEach(o => {
                    if (o.countOffGrid === true) o.sum++;
                })
                continue;
            }

            checks.forEach(o => {
                if (o.vals.includes(map[y+i][x+j])) o.sum++;
            })
        }

        if (checks.every(o => {
            if (o.min !== undefined) return o.sum >= o.min;
            if (o.max !== undefined) return o.sum <= o.max;
        })) res[y][x] = mark;

    }))

    return res;
}

const getCount = (map, cmp = '#') => map.flat().filter(v => v === cmp).length;

const cssCls = {
    '0': 'water',
    '1': 'water',
    '#': 'land',
    '=': 'sand',
    '@': 'tree',
}

const drawMap = map => {
    let el = document.getElementById('root'), s = '';
    map.map((row, y) => row.map((v, x) => {
        let xp = x*3;
        let yp = y*3;
        s += '<div class="cell ' + cssCls[v] + '" style="left:' + xp + 'px;top:' + yp + 'px;">&nbsp;</div>'
    }))
    el.innerHTML = s;
}

const iterate = (map, stepFnc, v) => {
    let oldCount = getCount(map, v), newCount = 0;
    while (oldCount !== newCount) {
        oldCount = newCount;
        map = stepFnc(map);
        newCount = getCount(map, v);
    }
    return map;
}

const run = (map) => {
    map[Math.floor(map.length/2)][Math.floor(map[0].length/2)] = '#';
    
    map = iterate(map, m => step(m), '#');

    return map;
}

const run2 = map => {
    map = step(run(map), [{vals: ['1', '0'], min: 1, countOffGrid: true}], '=', ['#']);

    map = iterate(map, m => step(m, [{vals: ['='], min: 5}], '=', ['#']), '=');

    return map;
}

const run3 = map => {
    map = step(run2(map), checks = [{vals: ['@', '#'], min: 20}], '@', eligible = ['#'], 2, false);

    for (let n = 0; n < 2; n++) map = step(map, [{vals: ['@'], min: 4}, {vals: ['='], max: 0}], '@', ['#']);

    drawMap(map);
    return map;
}


console.log('p1', getCount(run(parse(input1))));
console.log('p2', getCount(run2(parse(input2)), '='));
console.log('p3', getCount(run3(parse(input3)), '@'));
