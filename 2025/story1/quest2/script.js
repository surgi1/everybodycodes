// just p3 here, for parts 1 and 2 check script12.js
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

const initTrees = () => [];

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

const place = (nodes, data, forceRootSide = '') => {
    if (nodes.length == 0) {
        addNode(nodes, data, false, 1);
        return 0;
    }
    let cur = 0; // start from root
    let path = '';
    while (true) {
        if (forceRootSide !== 'left' && (data.val > nodes[cur].val || forceRootSide == 'right')) {
            // go right
            if (nodes[cur].right !== false) {
                path += nodes[cur].name + '-';
                cur = nodes[cur].right;
                forceRootSide = '';
            } else {
                // add new node, return
                let newId = addNode(nodes, data, cur, nodes[cur].layer+1);
                nodes[cur].right = newId;
                //return path+nodes[cur].name;
                return newId;
            }
        } else {
            // go left
            if (nodes[cur].left !== false) {
                path += nodes[cur].name + '-';
                cur = nodes[cur].left;
                forceRootSide = '';
            } else {
                // add new node, return
                let newId = addNode(nodes, data, cur, nodes[cur].layer+1);
                nodes[cur].left = newId;
                //return path+nodes[cur].name;
                return newId;
            }
        }
    }
}

const treeVal = (nodes, branchId) => {
    const sumLayer = id => nodes.filter(n => n.marked === true && n.layer == id).length;

    const layerToText = (s = '', id = 0) => {
        if (nodes[id].layer > mostOccupiedLayer) return s;
        if (nodes[id].layer < mostOccupiedLayer) {
            let left = nodes[id].left !== false ? layerToText(s, nodes[id].left) : '';
            let right = nodes[id].right !== false ? layerToText(s, nodes[id].right) : '';
            return left+right;
        }
        return nodes[id].name;
    }

    const markSubtree = (id, layer = 2) => {
        nodes[id].marked = true;
        nodes[id].layer = layer;
        if (nodes[id].left) markSubtree(nodes[id].left, layer+1);
        if (nodes[id].right) markSubtree(nodes[id].right, layer+1);
    }

    nodes.forEach(n => n.marked = false); // mark subtree and count layer
    markSubtree(branchId);

    let layers = Math.max(...nodes.filter(n => n.marked === true).map(n => n.layer));

    let mostOccupiedLayer = 0, maxSum = sumLayer(0);
    for (let i = 1; i <= layers; i++) {
        let sum = sumLayer(i);        
        if (sum > maxSum) {
            maxSum = sum;
            mostOccupiedLayer = i;
        }
    }

    return layerToText(mostOccupiedLayer, branchId);
}

// p3 needs 1 tree; 1 node storage
// forced first left/right turn option to be able to add new nodes correctly
// a switch of nodes is just the switch of those nodes parent's link (and update of the pointer to parent and recalculate layers at the end)
const part3 = input => {
    let nodes = initTrees();
    let data = parse(input);

    place(nodes, {val: 0, name: 'ROOT'});

    data.forEach(o => {
        if (o.ins == 'SWAP') {
            let swapLine = data.filter(d => d.ins == 'ADD' && d.id == o.id)[0];
            
            let swapNodeLeft = nodes.filter(n => n.val == swapLine.left[0])[0];
            let swapNodeRight = nodes.filter(n => n.val == swapLine.right[0])[0];

            let leftParent = nodes[swapNodeLeft.parent];
            let rightParent = nodes[swapNodeRight.parent];

            if (leftParent.id == rightParent.id) {
                let tmp = leftParent.left;
                leftParent.left = leftParent.right;
                leftParent.right = tmp;
            } else {
                if (leftParent.left === swapNodeLeft.id) {
                    leftParent.left = swapNodeRight.id;
                } else {
                    leftParent.right = swapNodeRight.id;
                }

                if (rightParent.left === swapNodeRight.id) {
                    rightParent.left = swapNodeLeft.id;
                } else {
                    rightParent.right = swapNodeLeft.id;
                }

                swapNodeLeft.parent = rightParent.id;
                swapNodeRight.parent = leftParent.id;
            }
        } else {
            place(nodes, {val: o.left[0], name: o.left[1]}, 'left');
            place(nodes, {val: o.right[0], name: o.right[1]}, 'right');
        }
    })

    console.log(treeVal(nodes, nodes[0].left) + treeVal(nodes, nodes[0].right));
}

//part3(inputt4);
part3(input3);