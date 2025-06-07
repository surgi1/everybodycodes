const parseNodeLit = s => {
    let [_, _2, v, name] = s.split(/=|\[|\]|,/g)
    return [Number(v), name];
}

const parse = input => input.split('\n').map(line => {
    // ADD id=1 left=[250,V] right=[187,N]
    let [ins, idLit, leftLit, rightLit] = line.split(' ');
    if (ins == 'SWAP') return {
        ins: ins,
        id: Number(idLit)
    }

    return {
        ins: ins,
        id: Number(idLit.substr(idLit.indexOf('=')+1)),
        left: parseNodeLit(leftLit),
        right: parseNodeLit(rightLit),
    }
})

const initTrees = () => ({left: [], right: []})

const addNode = (nodes, params, parent = false, layer = 1) => {
    let newId = nodes.length;
    nodes.push({
        id: newId,
        name: params.name,
        val: params.val,
        left: false,
        right: false,
        layer: layer,
        parent: parent
    })
    return newId;
}

const place = (nodes, data) => {
    if (nodes.length == 0) {
        addNode(nodes, data, false, 1);
        return 0;
    }
    let cur = 0; // start from root
    while (true) {
        if (data.val > nodes[cur].val) {
            // go right
            if (nodes[cur].right !== false) {
                cur = nodes[cur].right;
            } else {
                // add new node, return
                let newId = addNode(nodes, data, cur, nodes[cur].layer+1);
                nodes[cur].right = newId;
                return newId;
            }
        } else {
            // go left
            if (nodes[cur].left !== false) {
                cur = nodes[cur].left;
            } else {
                // add new node, return
                let newId = addNode(nodes, data, cur, nodes[cur].layer+1);
                nodes[cur].left = newId;
                return newId;
            }
        }
    }
}

const treeVal = nodes => {
    const sumLayer = id => nodes.filter(n => n.layer == id).length;

    const layerToText = (s = '', id = 0) => {
        if (nodes[id].layer > mostOccupiedLayer) return s;
        if (nodes[id].layer < mostOccupiedLayer) {
            let left = nodes[id].left !== false ? layerToText(s, nodes[id].left) : '';
            let right = nodes[id].right !== false ? layerToText(s, nodes[id].right) : '';
            return left+right;
        }
        return nodes[id].name;
    }

    let layers = Math.max(...nodes.map(n => n.layer));

    let mostOccupiedLayer = 0, maxSum = sumLayer(0);
    for (let i = 1; i <= layers; i++) {
        let sum = sumLayer(i);        
        if (sum > maxSum) {
            maxSum = sum;
            mostOccupiedLayer = i;
        }
    }

    return layerToText(mostOccupiedLayer);
}

const part12 = input => {
    let trees = initTrees();
    let data = parse(input);

    data.forEach(o => {
        if (o.ins == 'SWAP') {
            let swapLine = data.filter(d => d.ins == 'ADD' && d.id == o.id)[0];
            let swapNodeLeft = trees.left[swapLine.leftId];
            let swapNodeRight = trees.right[swapLine.rightId];
            let tmp = {val: swapNodeLeft.val, name: swapNodeLeft.name};
            swapNodeLeft.val = swapNodeRight.val;
            swapNodeLeft.name = swapNodeRight.name;
            swapNodeRight.val = tmp.val;
            swapNodeRight.name = tmp.name;
        } else {
            o.leftId = place(trees.left, {val: o.left[0], name: o.left[1]});
            o.rightId = place(trees.right, {val: o.right[0], name: o.right[1]});
        }
    })

    console.log(treeVal(trees.left) + treeVal(trees.right));
}

//part12(input1);

//part12(inputt3);
part12(input2);