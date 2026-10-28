const parse = input => input.split(',').map(Number)

const minAreaP1 = n => Math.pow(Math.ceil(Math.sqrt(n)), 2);

const minAreaP2 = n => {
    const conesPerDim = dim => dim*dim - (dim-2)*(dim-2);
    let dim = 3;
    while (conesPerDim(dim) < n) dim++;
    return conesPerDim(dim);
}

const minAreaP3 = n => {
    const conesPerDim = dim => dim*dim - 1;
    let dim = 3;
    while (conesPerDim(dim) < n) dim += 2;
    return conesPerDim(dim);
}

const run = (arr, minAreaFnc) => arr.reduce((res, n) => res + minAreaFnc(n) - n, 0)

console.log('p1', run(parse(input1), minAreaP1));
console.log('p2', run(parse(input2), minAreaP2));
console.log('p3', run(parse(input3), minAreaP3));
