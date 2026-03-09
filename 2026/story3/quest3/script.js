const parse = input => {
    let nodes = [];
    input.split('\n').map((line, id) => {
        //id=1, plug=BLUE HEXAGON, leftSocket=GREEN CIRCLE, rightSocket=BLUE PENTAGON, data=?
        let arr = line.split(', ');
        let node = {
            leftId: undefined,
            rightId: undefined,
            parentId: undefined
        };
        arr.forEach(s => {
            let [k, v] = s.split('=');
            node[k] = v;
            if (['plug', 'leftSocket', 'rightSocket'].includes(k)) node[k] = v.split(' ');
        })
        node.id = id; // overwrite the +1 id from input
        nodes.push(node);
    })
    return nodes;
}

const readNode = (nodes, cur = 0) => {
    let res = [];
    if (nodes[cur].leftId !== undefined) res.push(...readNode(nodes, nodes[cur].leftId));
    res.push(cur+1);
    if (nodes[cur].rightId !== undefined) res.push(...readNode(nodes, nodes[cur].rightId));
    return res;
}

const strongBond = (a, b) => a[0] === b[0] && a[1] === b[1];
const weakBond = (a, b) => a[0] === b[0] || a[1] === b[1];

const getSlot = (nodes, node, cmpFnc, cur = 0, prev = undefined) => {
    // we need to recursively walk the connected nodes in the correct way
    // left first, if left is connected, then that node, left first
    // if we branch, we need to store what we've branched into

    let skipLeft = false, skipRight = false;
    if (prev !== undefined) {
        if (prev === nodes[cur].parentId) {
            // no op, coming from parent
        } else if (prev === nodes[cur].leftId) {
            skipLeft = true;
        } else if (prev === nodes[cur].rightId) {
            skipLeft = true;
            skipRight = true;
        }
    }

    if (!skipLeft) {
        if (nodes[cur].leftId !== undefined) {
            return getSlot(nodes, node, cmpFnc, nodes[cur].leftId, cur);
        }
        if (cmpFnc(nodes[cur].leftSocket, node.plug)) return {parentId: cur, slot: 'leftId'};
    }

    if (!skipRight) {
        if (nodes[cur].rightId !== undefined) {
            return getSlot(nodes, node, cmpFnc, nodes[cur].rightId, cur);
        }
        if (cmpFnc(nodes[cur].rightSocket, node.plug)) return {parentId: cur, slot: 'rightId'};
    }

    return getSlot(nodes, node, cmpFnc, nodes[cur].parentId, cur);
}

const run12 = (nodes, cmpFnc) => {
    // let's plug those nodes
    nodes.forEach((node, id) => {
        if (id === 0) return true;
        let {parentId, slot} = getSlot(nodes, node, cmpFnc);
        // make the connection
        nodes[id].parentId = parentId;
        nodes[parentId][slot] = id;
    })

    return readNode(nodes).reduce((a, v, i) => a + v * (i+1), 0);
};

const getBondType = (a, b) => {
    if (a === undefined || b === undefined) return 'none';
    if (strongBond(a, b)) return 'strong';
    if (weakBond(a, b)) return 'weak';
    return 'none';
}

const getSlot3 = (nodes, node, cur = 0, prev = undefined) => {
    // we need to recursively walk the connected nodes in the correct way
    // left first, if left is connected, then that node, left first
    // if we branch, we need to store what we've branched into

    let skipLeft = false, skipRight = false;
    if (prev !== undefined) {
        if (prev === nodes[cur].parentId) {
            // no op, coming from parent
        } else if (prev === nodes[cur].leftId) {
            skipLeft = true;
        } else if (prev === nodes[cur].rightId) {
            skipLeft = true;
            skipRight = true;
        }
    }

    if (!skipLeft) {
        let leftBond = 'none';
        if (nodes[cur].leftId !== undefined) leftBond = getBondType(nodes[cur].leftSocket, nodes[ nodes[cur].leftId ].plug);

        if (leftBond === 'strong') {
            return getSlot3(nodes, node, nodes[cur].leftId, cur);
        }
        
        let newLeftBond = getBondType(nodes[cur].leftSocket, node.plug);

        if (newLeftBond !== 'none') {
            if (leftBond === 'none') {
                return {parentId: cur, slot: 'leftId'};
            } else if (leftBond === 'weak' && newLeftBond === 'strong') {
                return {parentId: cur, slot: 'leftId', pushedOutId: nodes[cur].leftId };
            }
        }

        if (leftBond !== 'none') {
            return getSlot3(nodes, node, nodes[cur].leftId, cur);
        }
    }

    if (!skipRight) {

        let rightBond = 'none';
        if (nodes[cur].rightId !== undefined) rightBond = getBondType(nodes[cur].rightSocket, nodes[ nodes[cur].rightId ].plug);

        if (rightBond === 'strong') {
            return getSlot3(nodes, node, nodes[cur].rightId, cur);
        }
        let newRightBond = getBondType(nodes[cur].rightSocket, node.plug);

        if (newRightBond !== 'none') {
            if (rightBond === 'none') {
                return {parentId: cur, slot: 'rightId'};
            } else if (rightBond === 'weak' && newRightBond === 'strong') {
                return {parentId: cur, slot: 'rightId', pushedOutId: nodes[cur].rightId };
            }
        }

        if (rightBond !== 'none') {
            return getSlot3(nodes, node, nodes[cur].rightId, cur);
        }

    }

    return getSlot3(nodes, node, nodes[cur].parentId, cur);
}

const placeNode = (nodes, node, cur = 0, prev = undefined) => {
    let {parentId, slot, pushedOutId} = getSlot3(nodes, node, cur, prev);
    // make the connection
    nodes[node.id].parentId = parentId;
    nodes[parentId][slot] = node.id;

    if (pushedOutId !== undefined) {
        let origParent = nodes[pushedOutId].parentId;
        nodes[pushedOutId].parentId = undefined;
        placeNode(nodes, nodes[pushedOutId], origParent, node.id)
    }
}

const run3 = (nodes) => {
    nodes.forEach((node, id) => {
        if (id === 0) return true;
        placeNode(nodes, node);
    })

    return readNode(nodes).reduce((a, v, i) => a + v * (i+1), 0);
};


console.log('p1', run12(parse(input1), strongBond));
console.log('p2', run12(parse(input2), weakBond));
console.log('p3', run3(parse(input3)));