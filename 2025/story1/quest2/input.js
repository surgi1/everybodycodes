let input1 = `ADD id=1 left=[250,V] right=[187,N]
ADD id=2 left=[155,W] right=[127,P]
ADD id=3 left=[149,G] right=[242,F]
ADD id=4 left=[201,Z] right=[182,S]
ADD id=5 left=[251,L] right=[227,F]
ADD id=6 left=[252,Z] right=[104,G]
ADD id=7 left=[233,H] right=[256,X]
ADD id=8 left=[128,G] right=[219,T]
ADD id=9 left=[232,C] right=[153,F]
ADD id=10 left=[178,L] right=[248,M]
ADD id=11 left=[241,K] right=[163,G]
ADD id=12 left=[145,U] right=[189,S]
ADD id=13 left=[216,Z] right=[144,S]
ADD id=14 left=[131,F] right=[103,B]
ADD id=15 left=[276,S] right=[184,B]
ADD id=16 left=[196,A] right=[107,V]
ADD id=17 left=[102,Q] right=[266,X]
ADD id=18 left=[140,F] right=[146,B]
ADD id=19 left=[151,G] right=[100,R]
ADD id=20 left=[270,!] right=[230,S]`;

let inputt = `ADD id=1 left=[10,A] right=[30,H]
ADD id=2 left=[15,D] right=[25,I]
ADD id=3 left=[12,F] right=[31,J]
ADD id=4 left=[5,B] right=[27,L]
ADD id=5 left=[3,C] right=[28,M]
ADD id=6 left=[20,G] right=[32,K]
ADD id=7 left=[4,E] right=[21,N]`

let inputt2 = `ADD id=1 left=[160,E] right=[175,S]
ADD id=2 left=[140,W] right=[224,D]
ADD id=3 left=[122,U] right=[203,F]
ADD id=4 left=[204,N] right=[114,G]
ADD id=5 left=[136,V] right=[256,H]
ADD id=6 left=[147,G] right=[192,O]
ADD id=7 left=[232,I] right=[154,K]
ADD id=8 left=[118,E] right=[125,Y]
ADD id=9 left=[102,A] right=[210,D]
ADD id=10 left=[183,Q] right=[254,E]
ADD id=11 left=[146,E] right=[148,C]
ADD id=12 left=[173,Y] right=[299,S]
ADD id=13 left=[190,B] right=[277,B]
ADD id=14 left=[124,T] right=[142,N]
ADD id=15 left=[153,R] right=[133,M]
ADD id=16 left=[252,D] right=[276,M]
ADD id=17 left=[258,I] right=[245,P]
ADD id=18 left=[117,O] right=[283,!]
ADD id=19 left=[212,O] right=[127,R]
ADD id=20 left=[278,A] right=[169,C]`

let inputt3 = `ADD id=1 left=[10,A] right=[30,H]
ADD id=2 left=[15,D] right=[25,I]
ADD id=3 left=[12,F] right=[31,J]
ADD id=4 left=[5,B] right=[27,L]
ADD id=5 left=[3,C] right=[28,M]
SWAP 1
SWAP 5
ADD id=6 left=[20,G] right=[32,K]
ADD id=7 left=[4,E] right=[21,N]`

let inputt4 = `ADD id=1 left=[10,A] right=[30,H]
ADD id=2 left=[15,D] right=[25,I]
ADD id=3 left=[12,F] right=[31,J]
ADD id=4 left=[5,B] right=[27,L]
ADD id=5 left=[3,C] right=[28,M]
SWAP 1
SWAP 5
ADD id=6 left=[20,G] right=[32,K]
ADD id=7 left=[4,E] right=[21,N]
SWAP 2
SWAP 5`
/*
let inputt4 = `ADD id=1 left=[10,A] right=[30,H]
ADD id=2 left=[15,D] right=[25,I]
ADD id=3 left=[12,F] right=[31,J]
ADD id=4 left=[5,B] right=[27,L]
ADD id=5 left=[3,C] right=[28,M]
SWAP 1
SWAP 5
ADD id=6 left=[20,G] right=[32,K]
ADD id=7 left=[4,E] right=[21,N]
SWAP 2`
*/
let input2 = `ADD id=1 left=[617,Y] right=[946,W]
ADD id=2 left=[852,B] right=[856,G]
ADD id=3 left=[786,T] right=[866,Z]
ADD id=4 left=[797,W] right=[815,B]
ADD id=5 left=[875,M] right=[859,X]
SWAP 1
ADD id=6 left=[879,B] right=[851,G]
ADD id=7 left=[887,Y] right=[789,Z]
ADD id=8 left=[846,Z] right=[844,N]
ADD id=9 left=[869,L] right=[874,P]
ADD id=10 left=[792,V] right=[807,F]
SWAP 5
ADD id=11 left=[829,L] right=[850,H]
ADD id=12 left=[834,C] right=[791,V]
ADD id=13 left=[894,L] right=[803,B]
ADD id=14 left=[808,Y] right=[864,A]
ADD id=15 left=[737,P] right=[826,Z]
SWAP 8
ADD id=16 left=[872,W] right=[783,M]
ADD id=17 left=[655,Q] right=[979,F]
ADD id=18 left=[683,M] right=[589,S]
ADD id=19 left=[867,F] right=[585,N]
ADD id=20 left=[670,N] right=[665,Y]
SWAP 19
SWAP 9
ADD id=21 left=[939,P] right=[796,S]
ADD id=22 left=[586,X] right=[932,Y]
ADD id=23 left=[631,H] right=[795,L]
ADD id=24 left=[821,T] right=[400,M]
ADD id=25 left=[733,L] right=[130,J]
SWAP 2
SWAP 1
ADD id=26 left=[136,Z] right=[636,T]
ADD id=27 left=[122,V] right=[843,Y]
ADD id=28 left=[249,J] right=[155,P]
ADD id=29 left=[764,Y] right=[100,M]
ADD id=30 left=[134,S] right=[101,T]
SWAP 4
SWAP 22
SWAP 28
ADD id=31 left=[299,X] right=[325,N]
ADD id=32 left=[153,R] right=[105,P]
ADD id=33 left=[598,N] right=[280,H]
ADD id=34 left=[103,P] right=[210,T]
ADD id=35 left=[162,B] right=[716,X]
SWAP 26
SWAP 14
SWAP 19
ADD id=36 left=[703,Y] right=[594,G]
ADD id=37 left=[248,J] right=[294,B]
ADD id=38 left=[860,L] right=[119,Z]
ADD id=39 left=[128,R] right=[169,P]
ADD id=40 left=[898,S] right=[689,T]
SWAP 13
SWAP 14
SWAP 16
SWAP 11
ADD id=41 left=[662,H] right=[183,N]
ADD id=42 left=[738,T] right=[317,V]
ADD id=43 left=[189,H] right=[142,N]
ADD id=44 left=[659,Z] right=[250,H]
ADD id=45 left=[194,B] right=[117,H]
SWAP 38
SWAP 36
SWAP 4
SWAP 17
ADD id=46 left=[173,M] right=[717,R]
ADD id=47 left=[261,S] right=[592,G]
ADD id=48 left=[203,N] right=[151,V]
ADD id=49 left=[221,R] right=[806,F]
ADD id=50 left=[904,S] right=[111,B]
SWAP 11
SWAP 12
SWAP 25
SWAP 41
SWAP 10
ADD id=51 left=[271,G] right=[321,F]
ADD id=52 left=[886,Y] right=[138,M]
ADD id=53 left=[927,P] right=[309,T]
ADD id=54 left=[161,T] right=[728,B]
ADD id=55 left=[126,M] right=[292,L]
SWAP 53
SWAP 30
SWAP 51
SWAP 41
SWAP 23
ADD id=56 left=[279,N] right=[124,R]
ADD id=57 left=[415,J] right=[441,N]
ADD id=58 left=[328,Z] right=[217,W]
ADD id=59 left=[118,J] right=[943,R]
ADD id=60 left=[926,R] right=[298,S]
SWAP 1
SWAP 48
SWAP 34
SWAP 28
SWAP 12
SWAP 41
ADD id=61 left=[191,Y] right=[419,L]
ADD id=62 left=[329,V] right=[233,S]
ADD id=63 left=[229,W] right=[502,T]
ADD id=64 left=[721,T] right=[602,X]
ADD id=65 left=[645,P] right=[909,Z]
SWAP 31
SWAP 44
SWAP 52
SWAP 50
SWAP 49
SWAP 48
ADD id=66 left=[780,P] right=[310,U]
ADD id=67 left=[800,M] right=[913,R]
ADD id=68 left=[381,F] right=[385,T]
ADD id=69 left=[421,L] right=[293,M]
ADD id=70 left=[771,J] right=[832,H]
SWAP 32
SWAP 4
SWAP 41
SWAP 69
SWAP 63
SWAP 18
SWAP 23
ADD id=71 left=[226,M] right=[367,S]
ADD id=72 left=[394,V] right=[889,H]
ADD id=73 left=[914,N] right=[933,K]
ADD id=74 left=[723,T] right=[412,V]
ADD id=75 left=[302,P] right=[560,Z]
SWAP 17
SWAP 6
SWAP 39
SWAP 33
SWAP 73
SWAP 21
SWAP 26
ADD id=76 left=[934,!] right=[120,Z]
ADD id=77 left=[706,Z] right=[239,L]
ADD id=78 left=[449,V] right=[688,B]
ADD id=79 left=[362,L] right=[304,G]
ADD id=80 left=[148,F] right=[272,G]
SWAP 77
SWAP 75
SWAP 42
SWAP 33
SWAP 32
SWAP 40
SWAP 57
SWAP 39
ADD id=81 left=[937,T] right=[366,G]
ADD id=82 left=[224,G] right=[376,L]
ADD id=83 left=[475,S] right=[446,X]
ADD id=84 left=[915,M] right=[666,Z]
ADD id=85 left=[948,L] right=[245,Z]
SWAP 70
SWAP 75
SWAP 40
SWAP 83
SWAP 66
SWAP 4
SWAP 62
SWAP 48
ADD id=86 left=[698,R] right=[377,Z]
ADD id=87 left=[591,G] right=[997,S]
ADD id=88 left=[205,F] right=[152,G]
ADD id=89 left=[156,H] right=[961,W]
ADD id=90 left=[199,X] right=[401,W]
SWAP 72
SWAP 22
SWAP 87
SWAP 33
SWAP 30
SWAP 14
SWAP 45
SWAP 8
SWAP 42
ADD id=91 left=[779,W] right=[288,J]
ADD id=92 left=[482,L] right=[149,P]
ADD id=93 left=[450,G] right=[782,R]
ADD id=94 left=[884,S] right=[461,M]
ADD id=95 left=[342,T] right=[492,M]
SWAP 32
SWAP 68
SWAP 63
SWAP 16
SWAP 65
SWAP 44
SWAP 59
SWAP 92
SWAP 42
ADD id=96 left=[430,X] right=[347,B]
ADD id=97 left=[958,X] right=[223,S]
ADD id=98 left=[177,G] right=[442,B]
ADD id=99 left=[882,P] right=[115,X]
ADD id=100 left=[805,G] right=[825,F]
SWAP 31
SWAP 1
SWAP 92
SWAP 33
SWAP 62
SWAP 20
SWAP 89
SWAP 35
SWAP 88
SWAP 87`;

let input3 = `ADD id=1 left=[865,J] right=[562,W]
ADD id=2 left=[660,V] right=[582,T]
ADD id=3 left=[680,R] right=[599,M]
ADD id=4 left=[684,P] right=[782,F]
ADD id=5 left=[593,V] right=[615,J]
SWAP 3
ADD id=6 left=[748,V] right=[351,W]
ADD id=7 left=[772,M] right=[770,S]
ADD id=8 left=[669,X] right=[367,R]
ADD id=9 left=[297,Y] right=[369,L]
ADD id=10 left=[157,P] right=[844,H]
SWAP 6
ADD id=11 left=[333,P] right=[741,G]
ADD id=12 left=[134,B] right=[101,H]
ADD id=13 left=[171,Z] right=[334,Y]
ADD id=14 left=[336,B] right=[337,N]
ADD id=15 left=[625,S] right=[583,T]
SWAP 10
ADD id=16 left=[144,X] right=[150,G]
ADD id=17 left=[199,B] right=[759,P]
ADD id=18 left=[730,R] right=[880,X]
ADD id=19 left=[137,K] right=[108,R]
ADD id=20 left=[576,W] right=[649,H]
SWAP 7
SWAP 13
ADD id=21 left=[201,F] right=[140,R]
ADD id=22 left=[425,N] right=[196,B]
ADD id=23 left=[589,T] right=[151,R]
ADD id=24 left=[405,Z] right=[849,T]
ADD id=25 left=[361,G] right=[620,X]
SWAP 15
SWAP 6
ADD id=26 left=[875,B] right=[559,J]
ADD id=27 left=[571,R] right=[785,X]
ADD id=28 left=[703,P] right=[332,V]
ADD id=29 left=[802,V] right=[764,G]
ADD id=30 left=[180,R] right=[411,M]
SWAP 3
SWAP 23
SWAP 19
ADD id=31 left=[886,T] right=[124,Y]
ADD id=32 left=[395,V] right=[245,L]
ADD id=33 left=[751,M] right=[431,Y]
ADD id=34 left=[792,X] right=[119,P]
ADD id=35 left=[836,B] right=[256,J]
SWAP 11
SWAP 32
SWAP 28
ADD id=36 left=[848,B] right=[203,Y]
ADD id=37 left=[676,V] right=[397,S]
ADD id=38 left=[156,W] right=[524,H]
ADD id=39 left=[232,V] right=[348,R]
ADD id=40 left=[192,B] right=[813,J]
SWAP 1
SWAP 20
SWAP 22
SWAP 28
ADD id=41 left=[756,T] right=[510,W]
ADD id=42 left=[686,V] right=[145,G]
ADD id=43 left=[229,J] right=[342,P]
ADD id=44 left=[375,H] right=[506,F]
ADD id=45 left=[267,Y] right=[182,R]
SWAP 6
SWAP 20
SWAP 36
SWAP 39
ADD id=46 left=[202,J] right=[149,Z]
ADD id=47 left=[388,Z] right=[821,X]
ADD id=48 left=[798,L] right=[120,F]
ADD id=49 left=[230,V] right=[834,H]
ADD id=50 left=[128,B] right=[445,M]
SWAP 31
SWAP 48
SWAP 36
SWAP 3
SWAP 49
ADD id=51 left=[646,G] right=[406,R]
ADD id=52 left=[404,N] right=[566,H]
ADD id=53 left=[616,T] right=[838,N]
ADD id=54 left=[251,F] right=[262,J]
ADD id=55 left=[248,N] right=[542,W]
SWAP 12
SWAP 25
SWAP 47
SWAP 22
SWAP 23
ADD id=56 left=[435,F] right=[195,B]
ADD id=57 left=[817,P] right=[249,T]
ADD id=58 left=[513,N] right=[429,C]
ADD id=59 left=[217,G] right=[893,A]
ADD id=60 left=[538,Z] right=[812,S]
SWAP 28
SWAP 29
SWAP 44
SWAP 39
SWAP 9
SWAP 43
ADD id=61 left=[354,J] right=[109,R]
ADD id=62 left=[158,G] right=[786,L]
ADD id=63 left=[485,F] right=[584,T]
ADD id=64 left=[467,T] right=[240,Y]
ADD id=65 left=[729,H] right=[871,G]
SWAP 31
SWAP 38
SWAP 2
SWAP 51
SWAP 57
SWAP 42
ADD id=66 left=[600,B] right=[864,Y]
ADD id=67 left=[451,V] right=[553,G]
ADD id=68 left=[682,N] right=[505,Z]
ADD id=69 left=[833,W] right=[790,X]
ADD id=70 left=[410,X] right=[866,N]
SWAP 42
SWAP 39
SWAP 30
SWAP 12
SWAP 8
SWAP 23
SWAP 58
ADD id=71 left=[884,F] right=[804,W]
ADD id=72 left=[867,H] right=[224,G]
ADD id=73 left=[639,F] right=[177,T]
ADD id=74 left=[331,M] right=[869,V]
ADD id=75 left=[784,N] right=[815,X]
SWAP 25
SWAP 6
SWAP 7
SWAP 37
SWAP 2
SWAP 72
SWAP 4
ADD id=76 left=[362,S] right=[372,N]
ADD id=77 left=[803,M] right=[545,S]
ADD id=78 left=[138,L] right=[447,Z]
ADD id=79 left=[135,S] right=[448,T]
ADD id=80 left=[828,T] right=[847,V]
SWAP 10
SWAP 58
SWAP 42
SWAP 50
SWAP 33
SWAP 32
SWAP 46
SWAP 36
ADD id=81 left=[344,T] right=[852,S]
ADD id=82 left=[882,Y] right=[840,S]
ADD id=83 left=[427,N] right=[853,P]
ADD id=84 left=[736,M] right=[851,H]
ADD id=85 left=[719,V] right=[936,J]
SWAP 38
SWAP 67
SWAP 76
SWAP 64
SWAP 16
SWAP 26
SWAP 44
SWAP 6
ADD id=86 left=[876,Y] right=[358,M]
ADD id=87 left=[494,H] right=[123,M]
ADD id=88 left=[642,Z] right=[343,B]
ADD id=89 left=[173,B] right=[185,V]
ADD id=90 left=[370,L] right=[382,N]
SWAP 39
SWAP 13
SWAP 79
SWAP 26
SWAP 7
SWAP 64
SWAP 67
SWAP 24
SWAP 73
ADD id=91 left=[247,T] right=[491,B]
ADD id=92 left=[962,B] right=[800,F]
ADD id=93 left=[252,L] right=[153,W]
ADD id=94 left=[242,H] right=[816,R]
ADD id=95 left=[898,S] right=[657,W]
SWAP 88
SWAP 57
SWAP 42
SWAP 3
SWAP 29
SWAP 37
SWAP 66
SWAP 9
SWAP 76
ADD id=96 left=[899,L] right=[944,J]
ADD id=97 left=[121,M] right=[216,X]
ADD id=98 left=[238,L] right=[948,V]
ADD id=99 left=[146,H] right=[356,F]
ADD id=100 left=[250,H] right=[529,L]
SWAP 93
SWAP 61
SWAP 43
SWAP 33
SWAP 20
SWAP 85
SWAP 13
SWAP 2
SWAP 10
SWAP 69
ADD id=101 left=[133,F] right=[707,R]
ADD id=102 left=[477,R] right=[218,V]
ADD id=103 left=[236,W] right=[917,B]
ADD id=104 left=[811,T] right=[664,S]
ADD id=105 left=[459,N] right=[908,Z]
SWAP 43
SWAP 78
SWAP 45
SWAP 82
SWAP 51
SWAP 16
SWAP 83
SWAP 5
SWAP 14
SWAP 13
ADD id=106 left=[947,R] right=[523,L]
ADD id=107 left=[656,J] right=[938,R]
ADD id=108 left=[799,V] right=[823,F]
ADD id=109 left=[596,S] right=[214,N]
ADD id=110 left=[949,S] right=[617,P]
SWAP 101
SWAP 17
SWAP 58
SWAP 7
SWAP 38
SWAP 92
SWAP 45
SWAP 68
SWAP 35
SWAP 76
SWAP 96
ADD id=111 left=[148,X] right=[654,R]
ADD id=112 left=[783,Z] right=[215,R]
ADD id=113 left=[859,X] right=[697,W]
ADD id=114 left=[482,P] right=[440,R]
ADD id=115 left=[132,Z] right=[919,R]
SWAP 113
SWAP 33
SWAP 22
SWAP 35
SWAP 21
SWAP 88
SWAP 14
SWAP 63
SWAP 43
SWAP 3
SWAP 100
ADD id=116 left=[670,X] right=[184,H]
ADD id=117 left=[752,J] right=[219,G]
ADD id=118 left=[597,S] right=[384,H]
ADD id=119 left=[563,W] right=[126,P]
ADD id=120 left=[168,Y] right=[539,X]
SWAP 109
SWAP 58
SWAP 9
SWAP 57
SWAP 100
SWAP 98
SWAP 3
SWAP 85
SWAP 117
SWAP 108
SWAP 94
SWAP 55
ADD id=121 left=[900,J] right=[486,Z]
ADD id=122 left=[929,N] right=[239,L]
ADD id=123 left=[244,W] right=[220,S]
ADD id=124 left=[953,V] right=[872,S]
ADD id=125 left=[266,Z] right=[695,T]
SWAP 117
SWAP 73
SWAP 19
SWAP 22
SWAP 70
SWAP 61
SWAP 108
SWAP 43
SWAP 101
SWAP 103
SWAP 118
SWAP 11
ADD id=126 left=[330,X] right=[466,N]
ADD id=127 left=[484,W] right=[829,G]
ADD id=128 left=[629,H] right=[940,W]
ADD id=129 left=[914,Z] right=[113,X]
ADD id=130 left=[728,V] right=[441,M]
SWAP 5
SWAP 57
SWAP 103
SWAP 81
SWAP 46
SWAP 112
SWAP 111
SWAP 43
SWAP 11
SWAP 86
SWAP 44
SWAP 102
SWAP 29
ADD id=131 left=[710,Z] right=[820,X]
ADD id=132 left=[439,X] right=[939,N]
ADD id=133 left=[755,T] right=[974,X]
ADD id=134 left=[574,M] right=[438,L]
ADD id=135 left=[476,N] right=[951,Y]
SWAP 119
SWAP 81
SWAP 67
SWAP 1
SWAP 90
SWAP 65
SWAP 52
SWAP 38
SWAP 112
SWAP 31
SWAP 56
SWAP 96
SWAP 39
ADD id=136 left=[533,L] right=[874,P]
ADD id=137 left=[557,P] right=[104,Y]
ADD id=138 left=[131,B] right=[530,X]
ADD id=139 left=[746,T] right=[376,F]
ADD id=140 left=[186,T] right=[433,W]
SWAP 120
SWAP 92
SWAP 13
SWAP 102
SWAP 118
SWAP 100
SWAP 128
SWAP 86
SWAP 123
SWAP 9
SWAP 97
SWAP 122
SWAP 114
SWAP 50
ADD id=141 left=[930,J] right=[243,R]
ADD id=142 left=[552,L] right=[843,F]
ADD id=143 left=[913,M] right=[830,V]
ADD id=144 left=[235,T] right=[268,B]
ADD id=145 left=[261,J] right=[661,H]
SWAP 60
SWAP 11
SWAP 72
SWAP 25
SWAP 52
SWAP 111
SWAP 97
SWAP 63
SWAP 31
SWAP 115
SWAP 24
SWAP 73
SWAP 91
SWAP 106
ADD id=146 left=[444,Y] right=[810,W]
ADD id=147 left=[964,Y] right=[174,V]
ADD id=148 left=[975,H] right=[512,N]
ADD id=149 left=[969,Y] right=[233,M]
ADD id=150 left=[958,R] right=[623,B]
SWAP 9
SWAP 55
SWAP 102
SWAP 30
SWAP 10
SWAP 21
SWAP 77
SWAP 59
SWAP 20
SWAP 149
SWAP 136
SWAP 17
SWAP 146
SWAP 141
SWAP 18
ADD id=151 left=[894,W] right=[635,T]
ADD id=152 left=[982,M] right=[901,Z]
ADD id=153 left=[714,J] right=[819,Y]
ADD id=154 left=[450,M] right=[167,W]
ADD id=155 left=[210,Z] right=[462,V]
SWAP 143
SWAP 25
SWAP 55
SWAP 59
SWAP 96
SWAP 118
SWAP 30
SWAP 81
SWAP 35
SWAP 42
SWAP 105
SWAP 134
SWAP 73
SWAP 136
SWAP 61
ADD id=156 left=[985,L] right=[768,J]
ADD id=157 left=[976,R] right=[556,S]
ADD id=158 left=[222,P] right=[627,Y]
ADD id=159 left=[454,G] right=[643,M]
ADD id=160 left=[221,V] right=[818,L]
SWAP 16
SWAP 79
SWAP 87
SWAP 95
SWAP 129
SWAP 44
SWAP 52
SWAP 125
SWAP 62
SWAP 64
SWAP 61
SWAP 15
SWAP 89
SWAP 1
SWAP 108
SWAP 12
ADD id=161 left=[550,Y] right=[253,W]
ADD id=162 left=[767,Z] right=[396,F]
ADD id=163 left=[463,J] right=[498,H]
ADD id=164 left=[720,U] right=[399,Y]
ADD id=165 left=[749,W] right=[377,Q]
SWAP 86
SWAP 15
SWAP 19
SWAP 6
SWAP 124
SWAP 157
SWAP 56
SWAP 162
SWAP 66
SWAP 120
SWAP 1
SWAP 35
SWAP 150
SWAP 30
SWAP 25
SWAP 79
ADD id=166 left=[923,P] right=[237,X]
ADD id=167 left=[598,B] right=[548,N]
ADD id=168 left=[796,W] right=[841,!]
ADD id=169 left=[568,P] right=[681,R]
ADD id=170 left=[797,Z] right=[264,V]
SWAP 164
SWAP 75
SWAP 12
SWAP 25
SWAP 99
SWAP 136
SWAP 127
SWAP 14
SWAP 24
SWAP 166
SWAP 131
SWAP 145
SWAP 144
SWAP 143
SWAP 57
SWAP 38
SWAP 150
ADD id=171 left=[668,V] right=[659,X]
ADD id=172 left=[492,W] right=[353,Y]
ADD id=173 left=[540,P] right=[689,F]
ADD id=174 left=[862,N] right=[857,P]
ADD id=175 left=[594,H] right=[984,X]
SWAP 39
SWAP 122
SWAP 3
SWAP 43
SWAP 15
SWAP 25
SWAP 23
SWAP 85
SWAP 74
SWAP 168
SWAP 88
SWAP 79
SWAP 42
SWAP 114
SWAP 77
SWAP 147
SWAP 155
ADD id=176 left=[350,S] right=[478,G]
ADD id=177 left=[671,G] right=[223,B]
ADD id=178 left=[259,T] right=[952,Z]
ADD id=179 left=[258,G] right=[469,V]
ADD id=180 left=[105,V] right=[335,R]
SWAP 103
SWAP 145
SWAP 53
SWAP 88
SWAP 59
SWAP 16
SWAP 122
SWAP 106
SWAP 118
SWAP 150
SWAP 38
SWAP 93
SWAP 143
SWAP 177
SWAP 58
SWAP 165
SWAP 94
SWAP 66
ADD id=181 left=[781,H] right=[340,S]
ADD id=182 left=[255,Z] right=[269,G]
ADD id=183 left=[588,B] right=[690,S]
ADD id=184 left=[165,V] right=[791,G]
ADD id=185 left=[387,Y] right=[694,N]
SWAP 149
SWAP 68
SWAP 165
SWAP 42
SWAP 27
SWAP 40
SWAP 146
SWAP 22
SWAP 50
SWAP 8
SWAP 65
SWAP 38
SWAP 3
SWAP 132
SWAP 125
SWAP 61
SWAP 86
SWAP 1
ADD id=186 left=[632,G] right=[416,S]
ADD id=187 left=[977,J] right=[650,R]
ADD id=188 left=[544,L] right=[471,X]
ADD id=189 left=[263,T] right=[155,M]
ADD id=190 left=[355,N] right=[200,M]
SWAP 24
SWAP 126
SWAP 28
SWAP 38
SWAP 82
SWAP 162
SWAP 161
SWAP 37
SWAP 166
SWAP 44
SWAP 102
SWAP 131
SWAP 98
SWAP 111
SWAP 15
SWAP 51
SWAP 27
SWAP 40
SWAP 144
ADD id=191 left=[257,H] right=[234,J]
ADD id=192 left=[227,F] right=[231,P]
ADD id=193 left=[246,M] right=[270,V]
ADD id=194 left=[225,S] right=[775,J]
ADD id=195 left=[994,F] right=[565,M]
SWAP 42
SWAP 23
SWAP 143
SWAP 31
SWAP 116
SWAP 191
SWAP 43
SWAP 14
SWAP 114
SWAP 79
SWAP 140
SWAP 176
SWAP 135
SWAP 152
SWAP 145
SWAP 170
SWAP 22
SWAP 86
SWAP 137
ADD id=196 left=[931,J] right=[825,Z]
ADD id=197 left=[612,T] right=[733,B]
ADD id=198 left=[634,M] right=[723,N]
ADD id=199 left=[762,B] right=[653,G]
ADD id=200 left=[514,S] right=[100,P]
SWAP 137
SWAP 126
SWAP 194
SWAP 198
SWAP 55
SWAP 113
SWAP 148
SWAP 111
SWAP 186
SWAP 187
SWAP 174
SWAP 162
SWAP 25
SWAP 2
SWAP 158
SWAP 145
SWAP 114
SWAP 172
SWAP 154
SWAP 86`;