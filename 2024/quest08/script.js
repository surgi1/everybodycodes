const part1 = input => {
    // rectagon a*a, width of the traingle = 2a-1
    let a = Math.ceil(Math.sqrt(input));
    let extraBlocks = a*a - input;
    return (2*a-1)*extraBlocks;
}

const part2 = (p = 3, pa = 5, blocks = 50) => {
    const nextThickness = t => (t*p) % pa;

    let used = 1, w = 1, t = 1;
    while (used < blocks) {
        t = nextThickness(t);
        used += (w + 2)*t;
        w += 2;
    }

    return w*(used-blocks);
}

console.log('p1', part1(4099109));
console.log('p2', part2(815, 1111, 20240000));

// kinda slow
const part3 = (hp = 2, hpa = 5, blocks = 160) => {
    const nextThickness = t => ((t*hp) % hpa)+hpa;

    const toBeRemoved = h => (hp*w*h) % hpa;

    let heights = [1],
        used = 1, w = 1, t = 1;

    while (used < blocks) {
        t = nextThickness(t);
        for (let i = 0; i <= (w+1)/2; i++) {
            if (heights[i] === undefined) heights[i] = 0;
            heights[i] += t;
        }
        used += (w + 2)*t;
        w += 2;
    }

    for (let i = 0; i < heights.length; i++) {
        let upperFrameBlocks = heights[i] - (heights[i+1] || 0);
        let removables = heights[i] - upperFrameBlocks;
        if (removables == 0) continue;
        let removed = Math.min(toBeRemoved(heights[i]), removables);
        if (i > 0) removed = removed*2; // symmetry
        used -= removed;
    }

    //console.log('width', w);
    //console.log(heights);
    return used - blocks; // TODO: in case of negative solve further ¯\_(ツ)_/¯
}

console.log('p3', part3(972562, 10, 202400000)); // bug in the game server had caused the creator to drop the brick count from 202400000000 to 202400000 
