const extractNumeric = line => line.match(/-?\d+/g);

const parse = input => input.split('\n').map(line => extractNumeric(line).map(Number))

const growTree = ([id, growth, limit]) => {
    let t = 1, branches = [], splits = 0;

    for (let i = 0; i <= growth; i++) branches[i] = 0;
    branches[1] = 1;
    
    while (branches.reduce((tot, v, i) => tot + v*i, 0) + splits < limit) {
        let newBranches = [];
        for (let i = 1; i <= growth; i++) newBranches[i] = branches[i-1] || 0; // growth
        
        if (newBranches[growth] > 0) {
            newBranches[Math.floor(growth/2)] += 2 * newBranches[growth];
            newBranches[1] += newBranches[growth];
            splits += newBranches[growth];
            newBranches[growth] = 0;
        }

        branches = newBranches.slice();
        t++;
    }

    return t;
}

const growTree2 = ([id, growth, limit]) => {
    if (limit <= 1) return 1;

    let fast = (growth+1)/2, slow = growth-1;
    let events = [[growth, 1]], row = [1];

    for (let n = 1; n <= Math.ceil(Math.log2(limit)); n++) {
        let next = [];

        for (let i = 0; i <= n; i++) {
            next[i] = Math.min(2*(row[i] || 0) + (row[i-1] || 0), limit);
            events.push([growth + (n-i)*fast + i*slow, next[i]]);
        }

        row = next;
    }

    events.sort((a, b) => a[0] - b[0]);

    let leafs = 1;

    for (let [t, splits] of events) {
        leafs += splits;
        if (leafs >= limit) return t;
    }
};

const run = (data, growFnc = growTree) => data.reduce((res, tree) => res + growFnc(tree), 0);

console.log('p1', run(parse(input1)));
console.log('p2', run(parse(input2), growTree2));
console.log('p3', run(parse(input3), growTree2));
