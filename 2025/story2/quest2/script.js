const parse = input => input.split('')

const SHOT = 'RGB'.split('');

const run = input => {
    let balls = parse(input), shotPtr = 0, ballsPtr = 0, shots = 0;
    while (ballsPtr < balls.length) {
        let shotCol = SHOT[shotPtr % 3]; shotPtr++; shots++;
        while (balls[ballsPtr] == shotCol && ballsPtr < balls.length) ballsPtr++;
        ballsPtr++;
    }
    return shots;
}

const run3 = (input, mult = 100) => {
    let balls = parse(input.repeat(mult));
    let shotPtr = 0, shots = 0, popped = 0, len = balls.length, firstId = 0, halfId = len;
    while (popped < len) {
        let shotCol = SHOT[shotPtr % 3];
        shotPtr++;
        shots++;

        if (balls[firstId] == shotCol && halfId % 2 == 0) {
            balls[halfId/2] = '-';
            popped++;
            halfId++;
        }

        balls[firstId] = '-';
        popped++;
        firstId++;
        halfId++;

        while (balls[firstId] == '-') firstId++;
    }
    return shots;
}

console.log('p1', run(input1));
console.log('p2', run3(input2, 100));
console.log('p3', run3(input3, 100000));