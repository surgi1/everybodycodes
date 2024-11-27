const init = (input) => {
    let stars = [];
    input.split("\n").forEach((line, y) => line.split('').forEach((v, x) => {
        if (v === '*') stars.push({
            pos: [x, y], links: [], dists: [],
        })
    }))
    return stars;
}

const dist = (a, b) => a.reduce((res, v, i) => res + Math.abs(v - b[i]), 0);

const crashCons = (cons, stars, getLinks = true, threshold = Infinity) => {
    let links = [],
        i = 0;

    while (cons.length > 1 && i < cons.length) {
        let curr = cons.pop();
        let globalMin = Infinity, mergeWithId, globalLinkTo, globalLinkFrom;
        cons.forEach((con, conId) => {
            // find minimum distance between all stars of curr and stars of con
            let min = Infinity, linkTo, linkFrom;
            cons[conId].forEach(s1 => curr.forEach(s2 => {
                if (stars[s1].dists[s2] < min) {
                    min = stars[s1].dists[s2];
                    linkTo = s1;
                    linkFrom = s2;
                }
            }))
            if (min < globalMin) {
                globalMin = min;
                globalLinkTo = linkTo;
                globalLinkFrom = linkFrom;
                mergeWithId = conId;
            }
        })
        // merge
        if (globalMin < threshold) {
            cons[mergeWithId] = [...cons[mergeWithId], ...curr];
            i = 0;
        } else {
            cons.unshift(curr);
        }
        
        links.push([globalLinkFrom, globalLinkTo]);
        i++;
    }

    return getLinks ? links : cons;
}

const run = (stars, p3 = false) => {
    stars.forEach((s, i) => {
        s.dists = [];
        s.id = i;
    });

    for (let a = 0; a < stars.length; a++) for (let b = 0; b < stars.length; b++) stars[b].dists.push(dist(stars[a].pos, stars[b].pos));

    if (!p3) {
        let links = crashCons(stars.map(star => [star.id]), stars);
        return stars.length + links.reduce((res, [a, b]) => res + stars[a].dists[b], 0);
    } else {
        let cons = crashCons(stars.map(star => [star.id]), stars, false, 6);
        let sizes = cons.map(con => con.map(starId => stars[starId])).map(con => run(con));
        return sizes.sort((b, a) => a-b).slice(0, 3).reduce((a, v) => a*v, 1);
    }
}

console.log('p1', run(init(input1)));
console.log('p2', run(init(input2)));
console.log('p3', run(init(input3), true));
