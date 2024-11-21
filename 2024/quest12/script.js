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

const vectUR = [1, -1];
const vectR =  [1, 0];
const vectDR = [1, 1];
const vectDL = [-1, 1];

const canHitTarget = (fromPos, _toPos, moving = 0, shift = 0, maxPower = 50) => {
    let toPos = [..._toPos];
    if (shift == 1) toPos = [0, 1].map(c => toPos[c] + vectDL[c]);
    for (let power = 1; power < maxPower; power++) {
        let from = [...fromPos], to = [...toPos], t = [0, 0];
        // 3 parametric lines intersecting given coordinates
        // 1st line: pos = from + t*vectUR, t from 1 to power
        // 2nd line: pos = (from + power*vectUR) + (t-power)*vectR, t from power to 2*power
        // 3rd line: pos = (from + power*vectUR + power*vectR) + (t-2*power)*vectDR, t from 2*power onwards

        // as for moving targets, the 1st line would look like this: to + t*vectDL = from + t*vectUR => t = (to - from)/(vectUR-vectDL)

        // 1st line, going up
        t = [0, 1].map(c => (to[c] - from[c])/(vectUR[c] - moving*vectDL[c]));

        if (t[0] == t[1] && t[0] == Math.round(t[0]) && t[0] > 0 && t[0] <= power) return power;

        from = [0, 1].map(c => from[c] + power*vectUR[c]);
        to = [0, 1].map(c => to[c] + moving*power*vectDL[c]);

        // 2nd line, horizontal
        if (moving === 0) {
            if (from[1] == to[1]) {
                // only in this case they can possibly hit each other
                t[0] = (to[0] - from[0])/vectR[0];
                if (t[0] == Math.round(t[0]) && t[0] > 0 && t[0] <= power) return power;
            }
        } else {
            t = [0, 1].map(c => (to[c] - from[c])/(vectR[c] - vectDL[c]));
            if (t[0] == t[1] && t[0] == Math.round(t[0]) && t[0] > 0 && t[0] <= power) return power;
        }

        from = [0, 1].map(c => from[c] + power*vectR[c]);
        to = [0, 1].map(c => to[c] + moving*power*vectDL[c]);

        // 3rd line, falling down
        if (moving === 0) {
            t = [0, 1].map(c => (to[c] - from[c])/vectDR[c]);
            if (t[0] == t[1] && t[0] == Math.round(t[0])) return power;
        } else {
            if (from[1] == to[1]) {
                // only in this case they can possibly hit each other
                t[0] = (to[0] - from[0])/(vectDR[0] - vectDL[0]);
                if (t[0] > 0 && t[0] == Math.round(t[0]) && (to[1]+t[0] <= 2)) return power;
            }
        }
    }
    return false;
}

const rank = (catapult, power, target) => (catapult.val.charCodeAt(0) - 'A'.charCodeAt(0) + 1) * power * (target.val == 'H' ? 2 : 1);

const solve = ([catapults, targets], movingTargets = 0) => targets.reduce((sum, target, targetNr) => {
    let dist = Math.abs(catapults[2].pos[0]-target.pos[0]); // *1.5 as a good maximum comes from the projectile movement for lowest cannon; is spends 1/3 of its way going up and right, 1/3 just right, 1/3 going down. So in order to hit something as high as possible, power equal to 1.5*dist is needed
    if (movingTargets) dist = Math.abs(catapults[2].pos[1]-target.pos[1]); // here we need to take into account the movement and the ability to hit the rock on projectile's way up in worst case
    maxPower = Math.ceil(dist*1.5);

    let ranks = [];
    catapults.forEach(catapult => {
        let power = canHitTarget(catapult.pos, target.pos, movingTargets, 0, maxPower);
        if (power !== false) ranks.push(rank(catapult, power, target));
    })
    if (ranks.length == 0) catapults.forEach(catapult => {
        let power = canHitTarget(catapult.pos, target.pos, movingTargets, 1, maxPower);
        if (power !== false) ranks.push(rank(catapult, power, target));
    })

    return sum + Math.min(...ranks);
}, 0)

console.log('p1', solve(init(input1)));
console.log('p2', solve(init(input2)));
console.log('p3', solve(init(input3, targets3), 1));
