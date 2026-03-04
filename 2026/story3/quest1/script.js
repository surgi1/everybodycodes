const parse = input => input.split('\n').map(line => {
    let [id, colorsLit] = line.split(':');
    return {
        id: Number(id),
        color: colorsLit.split(' ').map(s => {
            return Number('0b' + s.split('').map(l => l === l.toUpperCase() ? 1 : 0).join(''))
        })
    }
})

const run1 = (data) => data.filter(o => o.color[1] > o.color[0] && o.color[1] > o.color[2]).reduce((a, o) => a + o.id, 0);

const sumRGB = color => color[0]+color[1]+color[2];

const run2 = data => {
    data.sort((a, b) => {
        if (b.color[3] !== a.color[3]) return b.color[3] - a.color[3];
        return sumRGB(a.color) - sumRGB(b.color);
    });
    return data[0].id;
}

const rgb = ['red', 'green', 'blue'];

const run3 = data => {
    let groups = {}, largestGroupName, largestGroupSize = 0;
    data.forEach(o => {
        let group = '---';
        if (o.color[3] <= 30) group = 'matte';
        if (o.color[3] >= 33) group = 'shiny';

        if (group !== '---') {
            for (let i = 0; i <= 2; i++) {
                let dominant = true;
                for (let j = 0; j <= 2; j++) {
                    if (i == j) continue;
                    if (o.color[j] >= o.color[i]) dominant = false
                }
                if (dominant) group = rgb[i] + '-' + group;
            }
        }
        o.group = group;
        if (groups[group] === undefined) groups[group] = 0;
        groups[group]++;
        if (groups[group] > largestGroupSize) {
            largestGroupSize = groups[group];
            largestGroupName = group;
        }
    })

    return data.filter(o => o.group === largestGroupName).reduce((a, o) => a + o.id, 0)
}

console.log('p1', run1(parse(input1)));
console.log('p2', run2(parse(input2)));
console.log('p3', run3(parse(input3)));