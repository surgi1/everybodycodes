const parse = input => input.split(',').map(Number)

const p1 = (arr, parts = 32) => {
    let res = 0;
    for (let i = 0; i < arr.length-1; i++) {
        if (Math.abs(arr[i]-arr[i+1]) == parts/2) res++;
    }
    return res
}

const getNrKnots = (arr, from, to, bound = arr.length, parts = 256) => {
    //if (Math.abs(arr[i]-arr[i+1]) == parts/2) res++;
    // we need to compute nr of previously added strings that have one number < than both of our pts and one nr greater than both of our pts
    // 1,5 vs 2,7
    // 1,7 vs 2,6
    let cur = [from, to].sort((a, b) => a-b), knots = 0;
    for (let j = 0; j < bound; j++) {
        let prev = [arr[j], arr[j+1]].sort((a, b) => a-b);
        //if (prev[0] < cur[1] && prev[1] > cur[0] && ( (prev[0] < cur[0] && prev[1] < cur[1]) || (prev[0] > cur[0] && prev[1] > cur[1]) ) ) knots++;
        if ((prev[0] == cur[0] && prev[1] == cur[1]) || ( prev[0] < cur[1] && prev[1] > cur[0] && ( (prev[0] < cur[0] && prev[1] < cur[1]) || (prev[0] > cur[0] && prev[1] > cur[1]) )  ) ) knots++;
    }
    return knots;
}

const p2 = (arr, parts = 256) => {
    let res = 0;
    for (let i = 0; i < arr.length-1; i++) res += getNrKnots(arr, arr[i], arr[i+1], i-1, parts);
    return res;
}

const visualize = (arr, parts = 256, id = 'canvas') => {
    let r = 500;
    let angle = 2*Math.PI/parts;
    let canvas = document.getElementById(id), ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(32, 32, 64, 0.2)';

    const coords = pin => {
        pin = pin-1;
        return [500 + r*Math.sin(pin*angle), 500 - r*Math.cos(pin*angle)]
    }

    arr.forEach((pin, id) => {
        if (id != 0) {
            ctx.beginPath();
            ctx.moveTo(...coords(arr[id-1]));
            ctx.lineTo(...coords(pin));
            ctx.stroke();
        }
    })
}

const p3 = (arr, parts = 256) => {
    let max = 0;
    for (k1 = 1; k1 <= parts; k1++) {
        for (k2 = k1+1; k2 <= parts; k2++) {
            let cuts = getNrKnots(arr, k1, k2, arr.length+1, parts);
            if (cuts > max) max = cuts;
        }
    }
    
    return max;
}

visualize(parse(input2), 256);
visualize(parse(input3), 256, 'canvas2');

console.log('p1', p1(parse(input1)));
console.log('p2', p2(parse(input2), 256));
console.log('p3', p3(parse(input3), 256));
