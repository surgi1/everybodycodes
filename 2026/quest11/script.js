const extractNumeric = line => line.match(/-?\d+/g);

Object.defineProperty(Array.prototype, 'sum', {
    value: function() {
        return this.reduce((a, v) => a + v, 0);
    }
});

const mod = (n, m) => ((n % m) + m) % m;

const permutator = (inputArr) => {
    let result = [];
    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(inputArr)
    return result;
}

const parse = (input, span = 1) => {
    let nodes = [];
    let [s1, s2] = input.split('\n\n');
    let portals = Number(extractNumeric(s1)[0]);
    for (let i = 0; i < portals; i++) {
        let tmp = [];
        for (let rel = 1; rel <= span; rel++) {
            tmp.push(mod(i - rel, portals));
            tmp.push(mod(i + rel, portals));
        }
        nodes[i] = {
            //links: [mod(i-1, portals), mod(i+1, portals)]
            links: tmp
        }
    }
    s2.split('\n').forEach(line => {
        let [n1, n2] = extractNumeric(line).map(n => Number(n) - 1);
        nodes[n1].links.push(n2);
        nodes[n2].links.push(n1);
    })
    return nodes;
}

let seen = {};

const floodfill = (nodes, start, maxLinks = 2, defaultLinks = 6) => {
    let k = start + '_' + maxLinks + '__' + nodes.map(n => n.links).reduce((res, link, i) => i < defaultLinks ? res : res + ',' + link, '');
    if (seen[k] !== undefined) return seen[k];
    let distances = Array.from({length: nodes.length}, () => Infinity);
    let stack = [{id: start, dist: 0}], cur;
    while (cur = stack.shift()) {
        if (distances[cur.id] <= cur.dist) continue;
        distances[cur.id] = cur.dist;
        nodes[cur.id].links.forEach((n, i) => {
            if (i >= maxLinks) return true;
            if (distances[n] > cur.dist+1) stack.push({
                id: n,
                dist: cur.dist+1
            })
        })
    }
    seen[k] = distances.sum();
    return seen[k];
}

const run = (nodes) => nodes.reduce((res, n, i) => res + floodfill(nodes, i, 2) - floodfill(nodes, i, 3), 0)

const run2 = (nodes) => {
    let baseStrain = nodes.reduce((res, n, i) => res + floodfill(nodes, i, 6), 0);
    let min = Infinity;
    for (let n = 0; n < nodes.length-1; n++) for (let m = n+1; m < nodes.length; m++) {
        nodes[n].links.push(m);
        nodes[m].links.push(n);
        let strain = nodes.reduce((res, n, i) => res + floodfill(nodes, i, 100), 0);
        if (strain < min) min = strain;
        nodes[n].links.pop();
        nodes[m].links.pop();
    }
    return baseStrain - min;
}

// slow brute-force, runs for couple of minutes. Kind of ugly, too
const run3 = (nodes) => {
    let baseStrain = nodes.reduce((res, n, i) => res + floodfill(nodes, i, 6), 0);

    let step = Math.round(nodes.length/8);

    let min = Infinity;

    for (let rot = 0; rot < step; rot++) {
        let placements = [];
        for (let j = 0; j < 8; j++) placements.push(mod(rot + j*step, nodes.length));
    
        console.log(placements);

        permutator(placements).forEach(placement => {
            for (let p = 0; p < 4; p++) {
                nodes[placement[2*p]].links.push(placement[2*p+1]);
                nodes[placement[2*p+1]].links.push(placement[2*p]);
            }
            let strain = nodes.reduce((res, n, i) => res + floodfill(nodes, i, 100), 0);
            if (strain < min) {
                min = strain;
                console.log('new min found; strain:', baseStrain - min);
            }
            for (let p = 0; p < 8; p++) nodes[placement[p]].links.pop();
        })
    }

    return baseStrain - min;
}


//console.log('p1', run(parse(input1)));
//console.log('p2', run2(parse(input2, 3)));
console.log('p3', run3(parse(input3, 3)));