const parse = input => input.split('\n').map(row => row.split(''))

const DRAGON_DIRS = [[-2, -1], [-1, -2], [1, -2], [2, -1],  [-2, 1], [-1, 2], [1, 2], [2, 1]]; // relative to 0,0, as x,y

const p12 = (map, steps = 3, SHEEP_DIRS = [[0, 1]]) => {
    let dragon = {}, sheep = {}, hideouts = {}, eaten = 0;

    let cols = map[0].length, rows = map.length;

    map.map((row, y) => row.map((v, x) => {
        if (v == 'D') dragon[x+'_'+y] = [x, y];
        if (v == 'S') sheep[x+'_'+y] = [x, y];
        if (v == '#') hideouts[x+'_'+y] = [x, y];
    }))

    const advanceBoard = () => {
        const advanceChars = (chars, moves, res = {}) => {
            Object.values(chars).forEach(([x, y]) => moves.forEach(([dx, dy]) => {
                let nx = x+dx, ny = y+dy;
                if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) res[nx+'_'+ny] = [nx, ny];
            }))
            return res;
        }

        const eatSheep = () => Object.keys(dragon).filter(k => sheep[k] !== undefined && hideouts[k] === undefined).forEach(k => {
            eaten++;
            delete sheep[k];
        })

        dragon = advanceChars(dragon, DRAGON_DIRS);
        eatSheep();

        sheep = advanceChars(sheep, SHEEP_DIRS);
        eatSheep();
    }

    for (let t = 0; t < steps; t++) advanceBoard();

    return eaten;
}

const p3 = (map) => {
    let dragon = {}, sheep = [], hideouts = {}, escapes = {};

    let cols = map[0].length, rows = map.length;

    map.map((row, y) => row.map((v, x) => {
        if (v == 'D') dragon = {x:x, y:y};
        if (v == 'S') sheep.push({x:x, y:y});
        if (v == '#') hideouts[x+'_'+y] = [x, y];
    }))

    for (let x = 0; x < cols; x++) {
        let y = rows;
        while (y == rows || hideouts[x+'_'+y] !== undefined) {
            escapes[x+'_'+y] = 1;
            y--;
        }
    }

    const getMoves = state => {
        // all the possible sheep moves; only 1 sheep can move, can move to any place besides dragon location
        // carthesian product with all the possible dragon moves
        let sheepMoves = [], dragonMoves = [], advances = [];

        state.sheep.forEach((shp, id) => {
            let nx = shp.x, ny = shp.y+1, k = nx+'_'+ny;
            if (hideouts[k] || !(nx == state.dragon.x && ny == state.dragon.y)) sheepMoves.push({id:id, x:nx, y:ny});
        })
        
        DRAGON_DIRS.forEach(([dx, dy]) => {
            let nx = state.dragon.x+dx, ny = state.dragon.y+dy;
            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) dragonMoves.push({x:nx, y:ny});
        })

        // all possible combinations, omit every move that would loose the game
        if (sheepMoves.length == 0) {
            advances = dragonMoves.map(dm => ({dragon: dm}))
        } else {
            sheepMoves.filter(sm => escapes[sm.x+'_'+sm.y] === undefined).forEach(sm => dragonMoves.forEach(dm => {
                advances.push({sheep: sm, dragon: dm});
            }))
        }

        return advances;
    }

    let memo = {};

    const winsFromStateMemoized = state => {
        let k = [state.dragon, ...state.sheep].map(k => k.x+','+k.y).join('_');
        if (memo[k] !== undefined) return memo[k];

        let wins = 0;

        getMoves(state).forEach(adv => {
            let processedSheep = [];
            state.sheep.forEach((shp, id) => {
                let x = shp.x, y = shp.y;
                if (adv.sheep && adv.sheep.id == id) {
                    x = adv.sheep.x;
                    y = adv.sheep.y;
                }
                if (hideouts[x+'_'+y] || !(x == adv.dragon.x && y == adv.dragon.y)) processedSheep.push({x:x, y:y});
            });

            if (processedSheep.length == 0) {
                wins++;
            } else {
                wins += winsFromStateMemoized({dragon: adv.dragon, sheep: processedSheep});
            }
        })

        memo[k] = wins;
        return wins;
    }

    return winsFromStateMemoized({dragon: dragon, sheep: sheep});
}

console.log('p1', p12(parse(input1), 4, [[0, 0]]));
console.log('p2', p12(parse(input2), 20));
console.log('p3', p3(parse(input3)));
