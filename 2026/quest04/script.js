const extractNumeric = line => line.match(/-?\d+/g);

const parse = (input) => input.split('\n').map(lineLit => {
    let tmp = extractNumeric(lineLit).map(Number);
    return {
        id: tmp[0],
        quest: tmp[1],
        part: tmp[2],
        time: tmp[3]
    }
})

const run = (arr, sortFnc) => {
    let players = {};
    arr.forEach(o => {
        if (players[o.id] === undefined) players[o.id] = {
            parts: 0,
            totalTime: 0,
        };
        players[o.id].totalTime += o.time;
        players[o.id].parts++;
    })
    return Object.values(players).sort(sortFnc).reduce((res, v, i) => res + (i+1)*v.totalTime, 0)
}

const run3 = arr => {
    let quests = {};
    let players = {};

    arr.forEach(o => {
        if (quests[o.quest] === undefined) quests[o.quest] = {};
        if (quests[o.quest][o.id] === undefined) quests[o.quest][o.id] = [];
        if (players[o.id] === undefined) players[o.id] = {points: 0};
        quests[o.quest][o.id][o.part-1] = o.time;
    });

    Object.values(quests).forEach(quest => {
        let ranking = Object.entries(quest).map(([id, times]) => ({id, times, totalTime: 0}));

        for (let part = 1; part <= 3; part++) {
            ranking = ranking.filter(o => o.times[part-1] !== undefined);
            ranking.forEach(o => o.totalTime += o.times[part-1]);
            ranking.sort((a, b) => a.totalTime - b.totalTime);

            let position = 0;
            ranking.forEach((o, i) => {
                if (i === 0 || o.totalTime !== ranking[i-1].totalTime) position = i+1;
                players[o.id].points += Math.max(0, part*50 - position + 1);
            });
        }
    });

    let ranking = Object.values(players).sort((a, b) => b.points - a.points);
    let position = 0;

    return ranking.reduce((res, o, i) => {
        if (i === 0 || o.points !== ranking[i-1].points) position = i+1;
        return res + position*o.points;
    }, 0);
}

console.log('p1', run(parse(input1), (a, b) => a.totalTime - b.totalTime));

console.log('p2', run(parse(input2), (a, b) => {
    if (a.parts != b.parts) return b.parts - a.parts;
    return a.totalTime - b.totalTime;
}));

console.log('p3', run3(parse(input3)));