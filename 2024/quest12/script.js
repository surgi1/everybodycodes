const init = (input, targetsLit = false) => {
    let catapults = [], targets = [];
    input.split("\n").map((line, y) => line.split('').forEach((v, x) => {
        if (['.', '='].includes(v)) return true;
        if (['A', 'B', 'C'].includes(v)) catapults.push({ pos: [x, y], val: v });
        if (['T', 'H'].includes(v)) targets.push({ pos: [x, y], val: v });
    }))
    if (targetsLit !== false) targets = targetsLit.split("\n").map(line => {
        let pos = line.split(' ').map(Number);
        return { pos: [ catapults[2].pos[0] + pos[0], catapults[2].pos[1] - pos[1]], val: 'T' }
    })
    return [catapults, targets];
}

// this is pure bruteforce simulation, p3 takes about 30s to finish
// optimization would come from parametrization of the projectile curves and looking for intersections with targets
// TBD
const canHitTarget = (fromPos, _toPos, movingTarget = false, shift = 0, maxPower = 50) => {
    for (let power = 1; power < maxPower; power++) {
        let toPos = [..._toPos];
        if (movingTarget && shift != 0) {
            toPos[0] -= shift;
            toPos[1] += shift;
        }
        let t = 0, pos = [...fromPos];
        while (pos[0] < toPos[0] && fromPos[1]+2 > pos[1]) {
            pos[0]++;

            if (t < power)
                pos[1]--;
            else if (t > 2*power-1) 
                pos[1]++;

            if (movingTarget) {
                toPos[0]--;
                toPos[1]++;
            }
            t++;
        }
        if (pos[0] == toPos[0] && pos[1] == toPos[1]) return power;
    }
    return false;
}

const rank = (v, p) => (v.charCodeAt(0) - 'A'.charCodeAt(0) + 1)*p;

const solve = ([catapults, targets], movingTargets = false) => {
    let res = 0;

    targets.forEach(target => {
        let dist = Math.abs(catapults[2].pos[0]-target.pos[0]); // *1.5 as a good maximum comes from the projectile movement for lowest cannon; is spends 1/3 of its way going up and right, 1/3 just right, 1/3 going down. So in order to hit something as high as possible, power equal to 1.5*dist is needed
        if (movingTargets) dist = Math.abs(catapults[2].pos[1]-target.pos[1]); // here we need to take into account the movement and the ability to hit the rock on projectile's way up in worst case
        maxPower = Math.ceil(dist*1.5);

        let ranks = [];
        catapults.forEach(catapult => {
            let power = canHitTarget(catapult.pos, target.pos, movingTargets, 0, maxPower);
            if (power !== false) {
                //console.log('catapult', catapult.val, 'can hit target at [x, y]', target.pos, 'with power', power);
                ranks.push((target.val == 'H' ? 2 : 1) * rank(catapult.val, power));
            }
        })
        if (ranks.length == 0) catapults.forEach(catapult => {
            let power = canHitTarget(catapult.pos, target.pos, movingTargets, 1, maxPower);
            if (power !== false) {
                //console.log('catapult', catapult.val, 'can hit shifted target at [x, y]', target.pos, 'with power', power);
                ranks.push((target.val == 'H' ? 2 : 1) * rank(catapult.val, power));
            }
        })

        res += Math.min(...ranks);
    })

    //console.log(targets);
    return res;
}

console.log('p1', solve(init(input1)));
console.log('p2', solve(init(input2)));
console.log('p3', solve(init(input3, targets3), true));
