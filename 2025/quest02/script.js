const parse = input => input.split('\n\n').map(row => row.split(','))

const add = (a, b) => [a[0]+b[0], a[1]+b[1]];//a.map((v, i) => v+b[i]);
const mul = (a, b) => [a[0]*b[0] - a[1]*b[1], a[0]*b[1] + a[1]*b[0]];
const div = (a, b) => [Math.trunc(a[0]/b[0]), Math.trunc(a[1]/b[1])];//a.map((v, i) => Math.trunc(v/b[i]));

const p1 = (a, times = 3, divBy = [10, 10]) => {
    let res = [0, 0];
    for (let i = 0; i < times; i++) {
        res = add(a, div(mul(res, res), divBy));
    }
    return res;
}

const p2 = (a, inc = 10) => {
    let canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1000, 1000);

    let engraveds = 0;
    for (let x = a[0]; x <= a[0]+1000; x += inc) for (let y = a[1]; y <= a[1]+1000; y += inc) {
        let res = [0, 0], valid = true;
        for (let i = 0; i < 100; i++) {
            res = add([x, y], div(mul(res, res), [100000,100000]));
            if (res[0] > 1000000 || res[0] < -1000000 || res[1] > 1000000 || res[1] < -1000000) {
                valid = false;
                break;
            }
        }
        if (valid) {
            engraveds++;
        }
        let color = [Math.floor(256*(res[0]+100000)/2000000), Math.floor(256*(res[1]+100000)/2000000), Math.floor(256*(res[1]+res[0]+10000)/200000)]
        ctx.fillStyle = 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
        ctx.fillRect(x-a[0], y-a[1], inc, inc);
    }
    return engraveds;
}

console.log('p1', p1([149,56]));
//console.log('p2', p2([35300,-64910]));
console.log('p2', p2([-79107,14068]));
//console.log('p3', p2([35300,-64910], 1));
console.log('p3', p2([-79107,14068], 1));
