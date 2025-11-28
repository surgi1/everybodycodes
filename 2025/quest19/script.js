const parse = input => {
    let holes = {}
    input.split('\n').forEach(line => {
        let [x, y, h] = line.split(',').map(Number);
        if (holes[x] === undefined) holes[x] = [];
        holes[x].push([y, y + h - 1]);
    })
    return holes;;
}

// it is a trick; whenever a point p is reachable, it is reachable always in exact same nr of flaps, no less, no more, defined as: 
//     flaps needed to reach its height (p.y) + amount of flaps needed to stay still from that point till p.x is reached (p.x - p.y)/2
//     p.y + (p.x - p.y)/2
/*
      ---------------------------P
     /                           |
    /                            |
   /                             |
  /                              |
 /                               |
S                                |
*/
// points with odd x+y are unreachable at all
// the whole task is reduced to check which openings in the last wall are reachable
// in my p3 input, even the lowest point in the last wall is reachable, si the whole computation was not necessary
const run = holes => {
    let lastX = 0;
    let reachedYs = new Set([0]);
    let wallsXs = Object.keys(holes).map(Number).sort((a, b) => a - b);

    // just get to the lowest possible reachable y in the last hole(s)
    wallsXs.forEach(x => {
        let newReachedYs = new Set();

        holes[x].forEach(([y1, y2]) => {
            for (let y = y1; y <= y2; y++) {
                if ((x + y) % 2 == 1) continue; // can't be reached at all
                reachedYs.forEach(lastY => {
                    if (Math.abs(y - lastY) <= (x - lastX)) newReachedYs.add(y);
                })
            }
        })

        lastX = x;
        reachedYs = newReachedYs;
    })

    let yMin = Math.min(...reachedYs);

    return yMin + Math.floor((lastX - yMin)/2);
}

console.log('p1', run(parse(input1)));
console.log('p2', run(parse(input2)));
console.log('p3', run(parse(input3)));
