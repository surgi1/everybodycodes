const parse = input => {
    let start = [], end = [];
    input.split('\n').map((line, y) => line.split('').map((v, x) => {
        if (v == '@') start = [x, y];
        if (v == '#') end.push([x, y]);
    }))
    return {start, end}
}

const MOVES = {
    U: [0, -1], // y grows up
    R: [1, 0],
    D: [0, 1], // y grows up
    L: [-1, 0],
}

//const key = v => (v[1]*1000) + v[0];
const key = v => v.join('_');

const run1 = ({start, end}) => {
    let moves = Object.values(MOVES);
    let steps = 0, movePtr = 0;
    let seen = {}, cur = start.slice(0);

    while (cur[0] !== end[0][0] || cur[1] !== end[0][1]) {
        seen[key(cur)] = 1;
        let newPos = cur.map((v, i) => v + moves[movePtr % 4][i]);
        movePtr++;
        while (seen[key(newPos)] !== undefined) {
            newPos = cur.map((v, i) => v + moves[movePtr % 4][i]);
            movePtr++;
        }
        steps++;
        cur = newPos.slice(0);
    }

    return steps;
};

const run2 = ({start, end}) => {

    let steps = 0, movePtr = 0, x = {from: false, to: false}, y = {from: false, to: false};
    let seen = {}, cur = start.slice(0);
    let moves = Object.values(MOVES);

    const endCrit = () => moves.every(d => seen[key([end[0][0] + d[0], end[0][1] + d[1]])] !== undefined)

    const see = pos => {
        seen[key(pos)] = 1;
        if (x.from === false || x.from > pos[0]) x.from = pos[0];
        if (x.to === false || x.to < pos[0]) x.to = pos[0];
        if (y.from === false || y.from > pos[1]) y.from = pos[1];
        if (y.to === false || y.to < pos[1]) y.to = pos[1];
    }

    const isSeen = pos => seen[key(pos)] !== undefined;

    const fillDomain = pos => {
        let tmp = {};
        let queue = [pos.slice(0)], cur;
        while (cur = queue.pop()) {
            if (cur[0] < x.from) return;
            if (cur[0] > x.to) return;
            if (cur[1] < y.from) return;
            if (cur[1] > y.to) return;

            tmp[key(cur)] = 1;
            moves.forEach(d => {
                let newPos = [cur[0] + d[0], cur[1] + d[1]];
                let nk = key(newPos);
                if (tmp[nk] === undefined && seen[nk] === undefined) queue.push(newPos);
            })
        }
        Object.keys(tmp).forEach(k => seen[k] = 1);
    }

    see(end[0]);
    see(cur);

    // change the exit criteria to surrounding of the end pos
    // we will need to store seen limits for both dimmensions
    // after each step, we will need to check in each direction (that is not seen) whether the area in that direction is finite or not
    // we will do that by floodfill that will watch exceeding seen limits in any direction
    
    while (!endCrit()) {
        let newPos = cur.map((v, i) => v + moves[movePtr % 4][i]);
        movePtr++;
        while (isSeen(newPos)) {
            newPos = cur.map((v, i) => v + moves[movePtr % 4][i]);
            movePtr++;
        }
        steps++;
        cur = newPos.slice(0);
        //console.log(cur);
        see(cur);
        
        // fill in the directions
        moves.forEach(d => {
            let pos = cur.map((v, i) => v + d[i]);
            if (!isSeen(pos)) {
                // make a copy of seen
                fillDomain(pos);
            }
        })
    }

    return steps;
};

const draw = seen => {
    let el = document.getElementById('root');
    let s = '';
    Object.keys(seen).forEach(k => {
        let [x, y] = k.split('_').map(Number);
        s += `<div class="spot" style="left:${(x+20)*12}px;top:${(y+20)*12}px">#</div>\n`;
    })
    el.innerHTML = s;
}

const run3 = ({start, end}) => {

    let steps = 0, movePtr = 0, x = {from: false, to: false}, y = {from: false, to: false};
    let seen = {}, cur = start.slice(0);
    let moves = [];
    let dirs = Object.values(MOVES);
    Object.values(MOVES).forEach(move => moves.push(move, move, move));
    let movesLen = moves.length;

    const endCritForPos = (pos) => dirs.every(d => seen[key([pos[0] + d[0], pos[1] + d[1]])] !== undefined)
    const endCrit = () => end.every(pos => endCritForPos(pos));

    const see = pos => {
        seen[key(pos)] = 1;
        if (x.from === false || x.from > pos[0]) x.from = pos[0];
        if (x.to === false || x.to < pos[0]) x.to = pos[0];
        if (y.from === false || y.from > pos[1]) y.from = pos[1];
        if (y.to === false || y.to < pos[1]) y.to = pos[1];
    }

    const isSeen = pos => seen[key(pos)] !== undefined;

    const fillDomain = pos => {
        let tmp = {};
        let queue = [pos.slice(0)], cur;
        while (cur = queue.pop()) {
            if (cur[0] < x.from) return;
            if (cur[0] > x.to) return;
            if (cur[1] < y.from) return;
            if (cur[1] > y.to) return;

            tmp[key(cur)] = 1;
            dirs.forEach(d => {
                let newPos = [cur[0] + d[0], cur[1] + d[1]];
                let nk = key(newPos);
                if (tmp[nk] === undefined && seen[nk] === undefined) queue.push(newPos);
            })
        }
        Object.keys(tmp).forEach(k => seen[k] = 1);
    }

    // let's fill in the already closed domains as well, shall we?
    end.forEach(p => {
        see(p)
        dirs.forEach(d => {
            let pos = [p[0] + d[0], p[1] + d[1]];
            if (!isSeen(pos)) fillDomain(pos);
        })
    })

    see(cur);

    while (!endCrit()) {
        let move = moves[movePtr % movesLen];
        let newPos = [cur[0] + move[0], cur[1] + move[1]];
        movePtr++;
        while (isSeen(newPos)) {
            move = moves[movePtr % movesLen];
            newPos = [cur[0] + move[0], cur[1] + move[1]];
            movePtr++;
        }
        steps++;
        cur = newPos;
        see(cur);
        
        // fill in the directions
        dirs.forEach(d => {
            let pos = [cur[0] + d[0], cur[1] + d[1]];
            if (!isSeen(pos)) fillDomain(pos);
        })
    }

    draw(seen);

    return steps;
};

console.log('p1', run1(parse(input1)));
console.log('p2', run2(parse(input2)));
console.log('p3', run3(parse(input3)));
