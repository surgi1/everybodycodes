const parse = input => input.split('\n').map(line => line.split(':')[1].split(''))

const findChildren = data => {
    let triplets = []; // parent1, parent2, child ids
    for (let c = 0; c < data.length; c++) {
        for (let p1 = 0; p1 < data.length; p1++) {
            for (let p2 = p1+1; p2 < data.length; p2++) {
                if (p1 == c || p2 == c) continue;
                if (data[c].every((v, i) => data[p1][i] == v || data[p2][i] == v)) triplets.push([p1, p2, c])
            }
        }
    }
    return triplets;
}

const similarity = (a, b) => a.filter((v, i) => v == b[i]).length;

const p1 = data => similarity(data[2], data[0]) * similarity(data[2], data[1]);

const p2 = data => findChildren(data).reduce((res, ids) => res + p1(ids.map(id => data[id])), 0) 

const p3 = data => {
    let triplets = findChildren(data),
        max = 0, maxMembers = 0;

    triplets.forEach(([p1, p2, c]) => {
        let stack = [p1, p2, c], seen = {};
        while (stack.length > 0) {
            let cur = stack.pop();
            if (seen[cur] !== undefined) continue;
            seen[cur] = cur+1;
            stack.push(...triplets.filter(t => t.includes(cur)).flat())
        }

        let members = Object.keys(seen).length;
        if (members > maxMembers) {
            maxMembers = members;
            max = Object.values(seen).reduce((a, v) => a+v, 0);
        }
    })

    return max;
}

console.log('p1', p1(parse(input1)));
console.log('p2', p2(parse(input2)));
console.log('p3', p3(parse(input3)));