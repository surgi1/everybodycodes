const init = (input, data = {}) => {
    input.split("\n").map(line => {
        let tmp = line.split(/:|,/g)
        data[tmp[0]] = tmp.slice(1);
    });
    return data;
}

const solve = (data, starting = 'A', days = 4) => {
    let population = {};
    population[starting] = 1;
    for (let i = 0; i < days; i++) {
        let newPop = {};
        Object.entries(population).forEach(([t, c]) => data[t].forEach(nt => newPop[nt] = newPop[nt] === undefined ? c : newPop[nt] + c ));
        population = newPop;
    }
    return Object.values(population).reduce((a, v) => a+v, 0);
}

const part3 = (data, days = 20) => {
    let min = Infinity, max = -Infinity;
    Object.keys(data).forEach(k => {
        let res = solve(data, k, days);
        min = Math.min(min, res);
        max = Math.max(max, res);
    })
    return max-min;
}

console.log('p1', solve(init(input1)));
console.log('p2', solve(init(input2), 'Z', 10));
console.log('p3', part3(init(input3)));
