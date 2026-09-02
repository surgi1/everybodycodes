let input1t = `width=30
height=10
horizontal-offsets=10011
vertical-offsets=11011`

let input1 = `width=100
height=50
horizontal-offsets=001101010100010111101011110000
vertical-offsets=010110011110010011011000000100`;

let input2t = `width=100
height=70
horizontal-offsets=111101111101101111000100100110
vertical-offsets=110100001110111011101000001111`

let input2 = `width=512
height=512
horizontal-offsets=11011111111
vertical-offsets=1111010110010`

let input3t = ``;

let input3 = `width=31415926
height=577215664
horizontal-offsets=000010100111110011100000010001101101110001111110011011000110001100111110101011011010101111101101010100101101111
vertical-offsets=11000010010000011111101111000001001101100101100111111101010010110010100001110111011010010101101110010111111100110`

/*
horiz-offset.length = 111
vert-offset.length = 113

height / horiz.length = 5200141 with remainder = 13
width / vert.length = 278017 with remainder 5

the whole map needs to be split into 4 segments
A|B
---
C|D

seg A is vert.length x horiz.length, repeated 5200141 x 278017 times
seg B is 5 units wide and horiz.length high, repeated 5200141 times
seg C is 13 units high and vert.length wide, repeated 278017 times
seg D is 5 x 13, repeated 1 times


or maybe a simpler equivalent idea would be to draw just make the map vert.length + 5 wide and horiz.length + 13 high
color it, and then count the holes with multipliers based on belonging to given segment

// let's try 2 runs per each dimmension

horiz-offset.length = 111*2
vert-offset.length = 113*2

height / horiz.length = 5200141 with remainder = 13
width / vert.length = 278017 with remainder 5

width:
31415926/(113*2) = 139008.5221238938

width = 113*2 + 2*113*0.5221238938
width = 344

height:
577215664/(111*2) = 2600070.5585585586
height = 111*2 + 2*111*0.5585585586
height = 346

*/
