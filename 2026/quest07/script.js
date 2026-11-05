const extractNumeric = line => line.match(/-?\d+/g);

const parse = input => input.split('\n').map(line => {
    let [id, energy, ...conns] = extractNumeric(line).map(Number);
    return {
        id: id,
        energy: energy,
        conns: conns
    }
})

const run = (arr, basePower = 5) => {
    arr.sort((a, b) => b.conns.length - a.conns.length);

    let clouds = {};
    arr.forEach(o => {
        clouds[Number(o.id)] = o;
    })

    let round = Array.from({length: 101}).fill([0, 0]);

    round[arr[0].id] = 1;

    let power = basePower;

    while (power >= 0) {
        let nextRound = Array.from({length: 101}).fill(0);

        round.forEach((cnt, id) => {
            if (cnt > 0) {
                clouds[id].energy += power*cnt;
                clouds[id].conns.forEach(connId => {
                    nextRound[connId] += cnt;
                })
            }
        });

        power--;
        round = nextRound.slice();
    }

    return Object.values(clouds).reduce((res, o) => res + o.energy, 0);
}


const run3 = (arr, startingCloudId = 1, explosionLimit = 100, basePower = 10) => {
    let clouds = {};
    arr.forEach(o => {
        clouds[Number(o.id)] = o;
    })

    let round = {};
    round[startingCloudId] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    round[startingCloudId][basePower] = 1;

    while (Object.values(round).flat().filter(n => n > 0).length > 0) {
        let nextRound = {};

        Object.entries(round).forEach(([id, cnts]) => {
            if (clouds[id].exploded !== true) cnts.forEach((cnt, power) => {
                if (cnt > 0 && power > 0) {
                    clouds[id].energy += power*cnt;
                    if (power > 1) {
                        // set up for next round
                        clouds[id].conns.forEach(connId => {
                            if (clouds[connId].exploded !== true) {
                                if (nextRound[connId] === undefined) {
                                    nextRound[connId] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                                }
                                nextRound[connId][power-1] += cnt;
                            }
                        })
                    }
                }
            })
        });

        Object.entries(clouds).forEach(([id, o]) => {
            if (clouds[id].exploded !== true && clouds[id].energy >= explosionLimit) {
                clouds[id].exploded = true;
                clouds[id].conns.forEach(connId => {
                    if (nextRound[connId] === undefined) {
                        nextRound[connId] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    }
                    nextRound[connId][10] += 1; // sending power=10 signal to its network
                })
            }
        });

        round = nextRound;
    }

    return Object.values(clouds).reduce((res, o) => res + (o.exploded !== true ? o.energy : 0), 0);
}


console.log('p1', run(parse(input1)));
console.log('p2', run(parse(input2), 10));
let arr = [];
for (let n = 1 ; n <= 100; n++) {
    let totalEnergy = run3(parse(input3), n, 1_000_000);
    arr.push(totalEnergy);
    //console.log(n, totalEnergy);
}
console.log('p3', arr.sort((a, b) => b-a)[0])
