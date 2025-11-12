const parse = input => {
    let [names, rules] = input.split('\n\n');
    return [names.split(','), rules.split('\n').map(rule => {
        let [left, right] = rule.split(' > ');
        return {
            left: left,
            right: right.split(',')
        }
    })]
}

const validatePair = (left, right, rules) => rules.every(rule => {
    if (rule.left !== left) return true;
    return rule.right.includes(right);
})

const validateName = (name, rules) => name.split('').every((right, i) => i == 0 || validatePair(name[i-1], right, rules));

const p1 = ([names, rules]) => names.filter(name => validateName(name, rules));

const p2 = ([names, rules]) => names.reduce((res, name, id) => res + (validateName(name, rules) ? id+1 : 0), 0);

const p3 = ([names, rules]) => {
    let seen = {}, rulesO = {}, cur;
    let stack = p1([names, rules]);

    rules.forEach(rule => rulesO[rule.left] = rule.right);

    while (cur = stack.pop()) {
        if (seen[cur] !== undefined) continue;
        seen[cur] = 1;
        if (cur.length > 10) continue;
        let left = cur[cur.length-1];
        if (rulesO[left] === undefined) continue;
        stack.push(...rulesO[left].map(r => cur+r));
    }

    return Object.keys(seen).filter(n => n.length > 6).length
}

console.log('p1', p1(parse(input1))[0]);
console.log('p2', p2(parse(input2)));
console.log('p3', p3(parse(input3)));
