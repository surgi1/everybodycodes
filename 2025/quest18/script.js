const parse = input => {
    let plants = [], branches = [], tests = [];
    let chapters = input.split('\n\n\n');

    chapters[0].split('\n\n').forEach(section => {
        let tmp = section.split('\n').map(line => line.match(/(-)*(\d)+/g).map(Number));
        let base = tmp.shift();
        let plant = {
            id: base[0],
            thick: base[1],
            input: 0,
            output: 0
        }
        plants.push(plant);
        tmp.forEach(branchData => {
            branches.push({
                from: plant.id,
                to: branchData.length == 1 ? undefined : branchData[0],
                thick: branchData.length == 1 ? branchData[0] : branchData[1]
            })
        })
    })
    if (chapters[1] !== undefined) {
        tests = chapters[1].split('\n').map(t => t.split(' ').map(Number));
    }
    return [plants, branches, tests];
}

const byId = (plants, id) => plants.filter(p => p.id == id)[0];

const plantInput = (id, plants, branches) => branches.filter(b => b.from == id).reduce((a, b) => {
    let plant = byId(plants, b.to);
    if (plant.output == 0) return a;
    return a + plant.output*b.thick;
}, 0)

const p1 = ([plants, branches], initCfg = false) => {
    plants.forEach(p => {
        p.output = 0;
        p.input = 0;
        p.processed = false;
    })

    // light up orphans
    branches.filter(b => b.to === undefined).forEach((b, id) => {
        let plant = byId(plants, b.from);
        plant.input = b.thick;
        if (initCfg === false) {
            if (plant.thick <= plant.input) plant.output = plant.thick;
        } else {
            if (initCfg[id] === 1 && plant.thick <= plant.input) plant.output = plant.thick;
        }
        plant.processed = true;
    })

    let changed = true;

    while (changed) {
        changed = false;
        plants.forEach(plant => {
            if (plant.processed) return true;
            let input = plantInput(plant.id, plants, branches);
            if (input >= plant.thick) {
                changed = true;
                plant.output = input;
            }
            plant.processed = true;
        })
    }
    return plants.filter(plant => !branches.some(b => b.to == plant.id))[0].output
}

const p2 = ([plants, branches, tests]) => tests.reduce((a, test) => a + p1([plants, branches], test), 0)

const p3 = ([plants, branches, tests]) => {
    let testResults = [], maxCfg, max = 0, newMax = 0;
    tests.forEach(test => {
        let res = p1([plants, branches], test);
        testResults.push(res);
        if (res > newMax) {
            maxCfg = test.slice(0);
            newMax = res;
        }
    })

    while (newMax > max) {
        max = newMax;
        // naively check just 1-bit-difference variants - works like a charm :shrug:
        let baseCfg = maxCfg.slice(0);
        for (let i = 0; i < baseCfg.length; i++) {
            let testCfg = baseCfg.slice(0);
            testCfg[i] = (testCfg[i] == 1 ? 0 : 1);
            let res = p1([plants, branches], testCfg);
            if (res > newMax) {
                newMax = res;
                maxCfg = testCfg.slice(0);
            }
        }
    }
    return testResults.reduce((a, v) => a + (v > 0 ? max-v : 0), 0)
}


console.log('p1', p1(parse(input1)));
console.log('p2', p2(parse(input2)));
console.log('p3', p3(parse(input3)));
