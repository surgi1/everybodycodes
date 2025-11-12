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
    let rulesO = {}, total = 0;
    rules.forEach(rule => rulesO[rule.left] = rule.right);

    let recur = (left, len) => {
        if (len >= 11) {
            total++;
            return;
        }
        if (len > 6) total++;
        if (rulesO[left] === undefined) return;
        rulesO[left].forEach(right => recur(right, len+1));
    }

    names = p1([names, rules]);

    names.forEach((name, id) => {
        if (names.filter((n, i) => i != id).filter(n => name.indexOf(n) > -1).length == 0) {
            recur(name[name.length-1], name.length)
        }
    });

    return total;
}

console.log('p1', p1(parse(input1))[0]);
console.log('p2', p2(parse(input2)));
console.log('p3', p3(parse(input3)));
