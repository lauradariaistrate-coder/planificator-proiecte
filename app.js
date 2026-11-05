(() => {
"use strict";
/* ---------- Limite sectoare (OSM, x=(lon-26)*1e4, y=(lat-44)*1e4) ---------- */
const SECT_RAW = {"1":"701,4382 749,4357 787,4345 788,4366 804,4366 803,4359 812,4358 831,4366 840,4349 837,4346 846,4346 848,4352 873,4347 865,4352 875,4348 875,4353 883,4348 886,4351 899,4347 896,4351 905,4354 907,4347 936,4348 936,4352 947,4348 953,4355 967,4354 967,4348 983,4348 994,4350 996,4356 1018,4361 1038,4359 1048,4365 1039,4380 1016,4376 1021,4380 1017,4386 1012,4384 1010,4390 1015,4392 1007,4401 1011,4406 1008,4413 1016,4412 1011,4422 1032,4430 1034,4441 1030,4448 1036,4446 1043,4454 1032,4477 1035,4487 1041,4490 1029,4494 1041,4495 1040,4498 1033,4501 1031,4512 1015,4514 1016,4523 1011,4527 1014,4532 1010,4535 1023,4535 1009,4547 1015,4571 1008,4585 1011,4601 1014,4600 1025,4658 1022,4661 1025,4670 1034,4671 1027,4675 1034,4678 1030,4679 1036,4688 1050,4684 1038,4691 1043,4692 1044,4701 1052,4699 1055,4704 1048,4706 1055,4718 1063,4717 1055,4721 1051,4738 1038,4756 1049,4758 1046,4767 1059,4771 1036,4793 1023,4789 1017,4798 1027,4805 1017,4817 1024,4861 1038,4807 1030,4849 1056,4847 1077,4830 1057,4849 1055,4876 1093,4870 1107,4871 1108,4876 1148,4871 1149,4876 1106,4907 1107,4914 1117,4923 1089,4968 1078,4964 1072,4969 1056,5004 1044,5016 1048,5023 1098,5034 1087,5059 1041,5049 1031,5077 1028,5096 1045,5166 1049,5166 1048,5156 1055,5155 1062,5184 1050,5186 1044,5198 1050,5264 1033,5295 1045,5395 1019,5396 1018,5407 1009,5407 1007,5414 978,5412 977,5405 967,5404 969,5392 837,5382 777,5371 767,5407 730,5414 693,5394 686,5349 502,5301 495,5313 488,5310 492,5298 335,5236 293,5277 240,5259 225,5230 246,5203 253,5201 129,5152 120,5160 112,5156 107,5160 86,5148 89,5141 85,5138 95,5127 87,5117 64,4997 24,4988 -14,4990 -52,4959 -123,4996 -132,4989 -167,4981 -170,4971 -157,4966 -164,4950 -135,4931 -120,4927 -139,4914 -122,4921 -161,4831 -193,4780 -200,4702 -100,4783 -79,4790 -4,4797 41,4791 186,4741 256,4698 278,4701 288,4710 308,4706 305,4700 294,4703 283,4686 292,4689 290,4693 299,4690 296,4682 300,4690 310,4687 303,4680 368,4663 407,4639 414,4645 417,4637 437,4628 441,4622 460,4631 469,4625 461,4615 523,4582 530,4586 556,4575 560,4572 553,4569 569,4550 581,4555 596,4549 577,4538 591,4542 594,4533 604,4533 610,4508 624,4495 616,4508 618,4516 631,4519 633,4508 624,4493 629,4483 647,4477 656,4480 653,4473 662,4472 664,4464 674,4466 676,4456 682,4461 686,4458 680,4453 695,4450 694,4443 703,4450 699,4439 704,4444 705,4435 715,4437 710,4431 716,4425 725,4434 730,4431 719,4421 730,4420 722,4416 733,4407 725,4401 728,4396 701,4382","2":"1148,4874 1849,4791 1814,4789 1787,4776 1641,4652 1560,4554 1572,4545 1608,4541 1625,4531 1637,4535 1665,4529 1691,4507 1744,4536 1761,4539 1774,4536 1772,4498 1745,4469 1743,4460 1747,4450 1758,4444 1773,4443 1817,4460 1878,4438 1915,4466 1931,4469 1958,4457 1975,4426 1929,4413 1914,4395 1910,4397 1884,4371 1871,4368 1854,4352 1845,4376 1831,4371 1819,4356 1820,4364 1808,4370 1809,4380 1797,4377 1796,4367 1777,4363 1752,4371 1739,4366 1697,4372 1676,4368 1679,4352 1671,4355 1620,4344 1605,4344 1603,4349 1595,4340 1584,4344 1586,4340 1549,4332 1547,4327 1493,4321 1457,4319 1454,4326 1448,4318 1408,4316 1405,4323 1384,4319 1381,4325 1320,4318 1279,4324 1280,4330 1249,4327 1234,4339 1222,4330 1201,4337 1201,4333 1178,4334 1179,4341 1174,4335 1152,4339 1151,4332 1146,4332 1126,4349 1096,4345 1086,4337 1064,4360 1038,4359 1049,4371 1039,4380 1016,4376 1021,4380 1017,4386 1012,4384 1010,4390 1015,4392 1007,4400 1007,4406 1011,4406 1008,4413 1016,4412 1011,4422 1032,4430 1034,4441 1030,4448 1036,4446 1043,4454 1032,4477 1035,4487 1041,4490 1029,4494 1041,4495 1040,4498 1033,4501 1031,4512 1015,4514 1016,4523 1011,4525 1014,4532 1010,4535 1023,4535 1009,4547 1015,4571 1008,4585 1025,4670 1034,4671 1027,4675 1034,4678 1030,4679 1036,4688 1050,4684 1038,4691 1043,4692 1044,4701 1052,4699 1055,4704 1048,4706 1055,4718 1063,4717 1055,4721 1051,4738 1038,4756 1049,4758 1046,4767 1059,4771 1036,4793 1023,4789 1017,4798 1027,4805 1017,4817 1024,4861 1038,4807 1030,4849 1056,4847 1077,4830 1057,4849 1055,4876 1093,4870 1107,4871 1108,4876 1148,4874","3":"1038,4359 1018,4361 980,4349 983,4344 971,4339 969,4331 963,4332 956,4316 967,4310 960,4306 966,4295 1013,4286 1012,4261 1084,4252 1116,4187 1225,4090 1249,4079 1619,3983 1778,3943 1818,3938 2121,3951 2117,3986 2138,3987 2141,3992 2133,3996 2123,4032 2104,4041 2096,4040 2091,4030 2080,4034 2085,4051 2119,4046 2112,4064 2181,4075 2185,4089 2178,4170 2183,4186 2216,4181 2229,4224 2245,4245 2208,4255 2209,4264 2228,4263 2256,4324 2245,4326 2225,4316 2191,4312 2176,4320 2151,4350 2115,4330 2092,4335 2065,4356 2049,4388 2000,4387 1978,4394 1967,4410 1978,4421 1975,4426 1929,4413 1914,4395 1910,4397 1884,4371 1871,4368 1854,4352 1845,4376 1831,4371 1819,4356 1820,4364 1808,4370 1809,4380 1797,4377 1796,4367 1777,4363 1752,4371 1739,4366 1697,4372 1676,4368 1679,4352 1671,4355 1620,4344 1605,4344 1603,4349 1595,4340 1584,4344 1586,4340 1549,4332 1547,4327 1493,4321 1457,4319 1454,4326 1448,4318 1408,4316 1405,4323 1384,4319 1381,4325 1320,4318 1279,4324 1280,4330 1249,4327 1234,4339 1222,4330 1201,4337 1201,4333 1178,4334 1179,4341 1174,4335 1152,4339 1151,4332 1146,4332 1126,4349 1096,4345 1086,4337 1064,4360 1038,4359","4":"1462,3377 1463,3373 1475,3374 1520,3342 1565,3355 1572,3376 1562,3394 1640,3418 1632,3427 1641,3426 1668,3436 1643,3468 1613,3456 1522,3575 1508,3606 1486,3635 1477,3636 1446,3672 1437,3684 1442,3687 1437,3694 1428,3695 1449,3720 1435,3726 1436,3729 1485,3782 1475,3786 1512,3839 1518,3836 1541,3868 1536,3870 1543,3880 1566,3902 1570,3918 1620,3984 1241,4081 1207,4102 1116,4187 1083,4253 1012,4261 1013,4286 997,4292 966,4295 959,4293 958,4286 950,4287 954,4281 933,4279 932,4266 944,4266 948,4260 937,4255 934,4259 924,4252 925,4247 904,4241 902,4224 889,4225 887,4204 877,4195 888,4182 883,4180 898,4178 912,4161 933,4156 936,4150 931,4141 919,4138 910,4142 892,4112 906,4122 916,4119 911,4110 927,4090 950,4076 946,4063 957,4056 968,4036 940,4026 948,4018 920,3998 926,3993 944,4003 964,3996 954,3974 916,3965 954,3968 946,3967 940,3955 947,3953 940,3954 932,3943 929,3936 937,3938 930,3932 909,3882 915,3881 909,3869 915,3867 909,3855 920,3853 912,3850 878,3816 856,3846 836,3833 853,3825 857,3807 870,3808 871,3802 881,3801 914,3802 914,3796 906,3794 911,3786 906,3786 902,3769 896,3765 905,3762 899,3758 890,3722 897,3719 873,3722 886,3692 881,3692 895,3672 906,3672 935,3629 948,3632 955,3600 960,3600 961,3613 979,3623 991,3676 1136,3656 1123,3609 1304,3512 1274,3483 1462,3377","5":"966,4295 960,4306 967,4310 956,4316 963,4326 960,4328 983,4344 980,4349 967,4348 967,4354 953,4355 947,4348 936,4352 936,4348 907,4347 905,4354 896,4347 866,4353 873,4348 862,4351 860,4346 848,4352 846,4346 837,4346 840,4349 831,4366 812,4358 803,4359 804,4366 788,4366 787,4345 749,4357 701,4382 703,4374 690,4376 690,4370 688,4374 639,4354 598,4345 598,4317 617,4280 604,4274 602,4262 608,4251 599,4242 604,4240 600,4223 603,4210 594,4210 602,4207 605,4199 592,4192 591,4185 577,4182 580,4177 561,4173 567,4163 545,4154 537,4166 530,4164 537,4149 525,4145 528,4128 484,4114 437,4111 438,4102 462,4104 465,4098 468,4085 453,4074 393,4085 392,4097 389,4093 368,4102 337,4061 298,4075 311,4098 306,4100 344,4140 325,4136 286,4098 317,4133 310,4130 309,4136 288,4133 279,4124 270,4123 279,4132 273,4131 262,4121 270,4131 259,4122 254,4124 258,4130 244,4118 240,4120 250,4129 227,4122 221,4125 194,4104 189,4106 206,4123 193,4117 188,4121 172,4107 164,4108 160,4117 164,4103 150,4085 126,4087 120,4108 98,4101 95,4109 100,4084 2,4072 -8,4096 -3,4081 -9,4080 -7,4071 -38,4067 -27,4028 25,4035 33,4017 109,4058 285,3897 296,3898 313,3884 341,3898 350,3909 394,3871 330,3832 458,3750 470,3777 540,3761 561,3795 690,3746 694,3762 717,3790 770,3781 753,3720 808,3701 886,3692 873,3722 897,3719 890,3722 899,3758 905,3762 896,3765 902,3769 906,3786 911,3786 906,3794 914,3796 914,3802 881,3801 871,3802 870,3808 857,3807 853,3825 836,3833 856,3846 878,3816 912,3850 920,3853 909,3855 915,3867 909,3869 915,3881 909,3882 930,3932 937,3938 929,3936 932,3943 940,3954 947,3953 940,3955 946,3967 954,3968 916,3965 954,3974 964,3996 944,4003 926,3993 920,3998 948,4018 940,4026 968,4036 957,4056 946,4063 950,4076 927,4090 911,4110 916,4119 906,4122 892,4112 910,4142 919,4138 931,4141 936,4150 933,4156 912,4161 898,4178 883,4180 888,4182 877,4195 887,4204 889,4225 902,4224 904,4241 925,4247 924,4252 934,4259 937,4255 948,4260 944,4266 932,4266 933,4279 954,4281 950,4287 958,4286 959,4293 966,4295","6":"-38,4067 -45,4093 -110,4074 -178,4074 -237,4064 -292,4160 -304,4196 -323,4317 -328,4317 -333,4407 123,4429 193,4460 198,4484 180,4497 160,4491 147,4497 149,4509 136,4521 132,4541 159,4554 134,4580 66,4583 19,4605 -179,4670 -239,4656 -240,4664 -227,4671 -236,4677 -100,4783 -79,4790 -13,4797 27,4794 186,4741 251,4699 278,4701 288,4710 308,4706 305,4700 294,4703 283,4686 292,4689 290,4693 299,4690 296,4682 300,4690 310,4687 303,4680 368,4663 407,4639 414,4645 417,4637 437,4628 441,4622 460,4631 469,4625 461,4615 523,4582 530,4586 556,4575 560,4572 553,4569 569,4550 581,4555 596,4549 577,4538 591,4542 594,4533 604,4533 610,4508 624,4495 616,4508 618,4516 631,4519 633,4508 624,4493 629,4483 647,4477 656,4480 653,4473 662,4472 664,4464 674,4466 676,4456 682,4461 686,4458 680,4453 695,4450 694,4443 703,4450 699,4439 704,4444 705,4435 715,4437 710,4431 716,4425 725,4434 730,4431 719,4421 721,4417 728,4421 722,4416 733,4407 725,4401 728,4396 700,4381 703,4374 690,4376 690,4370 688,4374 639,4354 598,4345 598,4317 617,4280 604,4274 602,4262 608,4251 599,4242 604,4240 600,4223 603,4210 594,4210 602,4207 605,4199 592,4192 591,4185 577,4182 580,4177 561,4173 567,4163 545,4154 537,4166 530,4164 537,4149 525,4145 528,4128 484,4114 437,4111 438,4102 462,4104 465,4098 468,4085 453,4074 393,4085 392,4097 389,4093 368,4102 337,4061 298,4075 311,4098 306,4100 344,4140 325,4136 286,4098 317,4133 310,4130 309,4136 288,4133 279,4124 270,4123 279,4132 273,4131 262,4121 270,4131 259,4122 254,4124 258,4130 244,4118 240,4120 250,4129 227,4122 221,4125 194,4104 189,4106 206,4123 193,4117 188,4121 172,4107 164,4108 160,4117 164,4103 150,4085 126,4087 120,4108 98,4101 95,4109 100,4084 2,4072 -8,4096 -3,4081 -9,4080 -7,4071 -38,4067"};
const POLY = {}; for (const k in SECT_RAW) POLY[k] = SECT_RAW[k].split(" ").map(p => p.split(",").map(Number));
const MX = 7.95, MY = 11.12; // metri per unitate (1e-4 grade) la lat 44.43
const toXY = (lat, lon) => [(lon - 26) * 1e4, (lat - 44) * 1e4];
function pip([x, y], r) { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c; } return c; }
function edgeDist([x, y], r) { let m = Infinity; for (let i = 0; i < r.length - 1; i++) { const ax = r[i][0] * MX, ay = r[i][1] * MY, bx = r[i + 1][0] * MX, by = r[i + 1][1] * MY, px = x * MX, py = y * MY; const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy; let t = L ? ((px - ax) * dx + (py - ay) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); m = Math.min(m, Math.hypot(px - ax - t * dx, py - ay - t * dy)); } return m; }
function sectorOf(lat, lon) { const p = toXY(lat, lon); for (const k in POLY) if (pip(p, POLY[k])) return { s: k, edge: edgeDist(p, POLY[k]) }; return null; }

/* ---------- Instituții ---------- */
const INST = {
  prim: { 1: { n: "Primăria Sectorului 1", e: "registratura@primarias1.ro", w: "https://primariasector1.ro/sesizari-petitii-reclamatii/" },
          2: { n: "Primăria Sectorului 2", e: "infopublice@ps2.ro", w: "https://www.ps2.ro" },
          3: { n: "Primăria Sectorului 3", e: "relatiipublice@primarie3.ro", w: "https://www.primarie3.ro" },
          4: { n: "Primăria Sectorului 4", e: "contact@ps4.ro", w: "https://www.ps4.ro" },
          5: { n: "Primăria Sectorului 5", e: "primarie@sector5.ro", w: "https://www.sector5.ro" },
          6: { n: "Primăria Sectorului 6", e: "prim6@primarie6.ro", w: "https://www.primarie6.ro" } },
  pol:  { 1: { n: "Poliția Locală Sector 1", e: "", t: "021 9540", w: "https://politialocalasector1.ro/informatii-de-interes-public/petitii-online/" },
          2: { n: "Poliția Locală Sector 2", e: "", t: "021 9941", w: "" },
          3: { n: "Poliția Locală Sector 3", e: "secretariat.dgpl@primarie3.ro", t: "021 9543", w: "" },
          4: { n: "Poliția Locală Sector 4", e: "sesizari@politialocala4.ro", t: "021 9441", w: "" },
          5: { n: "Poliția Locală Sector 5", e: "politialocala@sector5.ro", t: "031 9885", w: "" },
          6: { n: "Poliția Locală Sector 6", e: "contact@politia6.ro", t: "021 9546", w: "" } },
  pmb:  { n: "Primăria Municipiului București", e: "registratura@pmb.ro", w: "https://www.pmb.ro/interes-public/informatii/formuleaza-petitie" },
  plmb: { n: "Poliția Locală a Municipiului București", e: "office@plmb.ro", w: "https://www.plmb.ro/depune-o-sesizare" }
};

/* ---------- Normativ: extrase pentru analiză ---------- */
const NORME = `
NP 051-2012 (Normativ privind adaptarea clădirilor civile și spațiului urban la nevoile individuale ale persoanelor cu handicap), Capitolul IV – Spațiul urban accesibil:
- IV.1 (3) traseele nu trebuie să aibă obstacole, întreruperi sau piedici care compromit utilitatea; (4) căile pietonale separate distinct de cele rutiere și de piste de bicicliști.
- IV.2.1 (1) trotuare plane; (2) suprafață rigidă, stabilă, antiderapantă, fără materiale deformabile (nisip, pietriș); (3) COF min. 0,4; (4) trasee continue din materiale cu aceeași rezistență la alunecare; (5) evitate grătare/rigole/capace care blochează bastonul sau roata; (6) rosturi pavaj și orificii grătare max. 1,5 cm.
- IV.2.2 (1) lățime trotuar: 1,80 m trafic constant dublu sens; 1,50 m trafic frecvent dublu sens (+ buzunare 1,80x2,00 m la max. 25 m); 1,20 m trafic scăzut dublu sens (+ buzunare); 0,90 m sens unic (+ buzunare).
- IV.2.3 (2) pantă longitudinală max. 5%; (4) pantă transversală max. 2%; (5) trotuar la peste 20 cm față de carosabil → balustradă cu mână curentă 0,90-1,00 m (și 0,60-0,75 m); (8) rampe: max. 10 m la 5%, max. 6 m la 5-8%; (9) zone de odihnă min. 1,50 m.
- IV.2.4 Obstacole: (1) evitate pe trasee: mobilier urban, bolarzi, stâlpi; (2) obstacolele sub 75 cm periculoase pt. nevăzători; (3) dacă sunt necesare: marcaje contrastante la ≥7,5 cm, 0,90-1,00 m și 1,50-1,60 m; (4) detectabile cu bastonul alb; (6) obiecte care ies >10 cm din plan, între 0,30 și 2,10 m înălțime → vizibile și detectabile; (7) înălțime liberă sub obstacole min. 2,10 m.
- IV.3.1 Rampe trotuar-carosabil: (2) în dreptul trecerilor de pietoni; (3) lățime recomandată 1,50 m, min. 1,00 m; (4) diferență de nivel max. 20 cm, pantă recomandată 8%, max. 15%; (5) la joncțiunea cu carosabilul max. 2 cm, teșit/rotunjit; (6) antiderapant COF 0,4; (7) suprafețe tactilo-vizuale de avertizare; (8) fără trecere marcată → benzi diagonale pe carosabil contra parcării; (9) fără guri de scurgere pe rampă, fără băltire.
- IV.4.1 (2) benzi de ghidaj tactilo-vizuale pe traseu; (3) TOATE trecerile de pietoni cu rampe; (4) semafor cu timp prelungit, buton la 1,00 m, semnal sonor; (5) stâlpul semaforului marcat contrastant; (6) străzi > 4 benzi: insule de refugiu min. 1,50x1,50 m.
- IV.5 Stații transport în comun: (3) semnalizate, vizibile de departe; (5) acces la nivel, max. 2 cm; (6) acces marcat cu suprafețe tactilo-vizuale; (7) finisaj antiderapant.
- IV.6 Parcaje: (1) locuri rezervate persoanelor cu handicap; (3) 4%, min. 2 locuri; IV.6.2 (1) 3,70x5,40 m; (2) bandă de transfer 1,20 m; (4) marcaj pe carosabil + panou; (7) rampă trotuar-carosabil la parcare.
- IV.7.2 (3) avertizare tactilo-vizuală galbenă la diferențe de nivel (trepte etc.).
- IV.8.4 bănci la max. 60 m pe trasee; IV.8.5 (1) mobilier urban în consolă interzis; (3) panouri suspendate cu limita inferioară min. 2,10 m; (2) panouri pe sol cu limita inferioară max. 30 cm.
- IV.8.6 Bolarzi: (2) bază min. 10x10 cm, înălțime 70-90 cm; (3) culoare contrastantă + benzi reflectorizante sus și jos; (4) interzis bolarzi tubulari cu diametru sub 8 cm; (5) interzisă legarea bolarzilor cu lanțuri sau cabluri.

NP 068-02 (Normativ privind proiectarea clădirilor civile din punct de vedere al cerinței de siguranță în exploatare), cap. 2.(A) Siguranța circulației pietonale – 2.(A).2.1 circulația exterioară pe căi pietonale:
- 2.(A).2.1.a alunecare: strat de uzură nealunecos și umed; pantă max. 5% longitudinal, max. 2% transversal.
- 2.(A).2.1.b împiedicare: denivelări admise max. 2,5 cm; rosturi dale / orificii grătare max. 1,5 cm.
- 2.(A).2.1.c coliziune cu obstacole: lățime liberă cale pietonală 1,50 m (min. 1,00 m, cu spațiu de manevră 1,50x1,50 m la intersecții); înălțime liberă sub obstacole min. 2,10 m.
- 2.(A).2.1.e coliziune cu vehicule: între clădire și carosabil trebuie să existe trotuar; căi pietonale bine diferențiate de cele carosabile; înălțime trotuar față de carosabil max. 0,20 m, cu acces local pt. scaun rulant la trecerea de pietoni; în zone cu trafic intens balustradă de protecție 0,90 m sau spațiu verde de siguranță; ieșiri din garaje/parcaje marcate și semnalizate.

Legea 448/2006: art. 62 alin. (1) – căile de acces, stațiile de transport în comun, spațiile de parcare, străzile și drumurile publice se adaptează pentru acces neîngrădit; art. 64 alin. (4) lit. a) – adaptarea trecerilor de pietoni, inclusiv pavaj tactil; lit. b) – semnalizare sonoră și vizuală la intersecțiile cu trafic intens; art. 64 alin. (1) lit. b) – stații adaptate, pavaj tactil spre ușa vehiculului; art. 65 alin. (1) – min. 4% locuri de parcare rezervate, min. 2.

OUG 195/2002 privind circulația pe drumurile publice și regulamentul de aplicare (HG 1391/2006): oprirea/staționarea pe trotuar doar unde administratorul drumului a permis-o prin marcaj/semnalizare; în lipsa acesteia, doar dacă rămâne liber un culoar de minimum 1 m pentru pietoni. Constatarea și sancționarea: Poliția Locală (și Poliția Rutieră).
`;

const COMPETENTE = `Competențe (București): starea trotuarelor, bordurilor, rampelor, pavajului, mobilierului urban, bolarzilor și semnalizării pe străzile locale → Primăria sectorului (direcția de administrare a domeniului public / drumuri). Pe arterele principale (bulevarde, magistrale, categoria I-II, ex. Magheru, Kogălniceanu, Calea Victoriei, Șos. Kiseleff) → PMB (Administrația Străzilor). Autovehicule staționate ilegal pe trotuar, ocuparea ilegală a domeniului public (terase, tarabe, materiale de construcții), lucrări fără semnalizare → Poliția Locală a sectorului. Capace/cămine ale rețelelor → operatorul rețelei, prin primărie.`;

function buildPrompt(ctx) {
  return `Ești un arhitect verificator care analizează o fotografie dintr-un spațiu urban din București pentru o sesizare către autorități. Analizezi DOAR ce se vede în fotografie, în raport cu extrasele de normativ de mai jos. Nu inventa articole sau valori care nu sunt în extrase.

EXTRASE NORMATIVE:
${NORME}

${COMPETENTE}

CONTEXT DE LA UTILIZATOR:
- Adresă: ${ctx.adresa || "nespecificată"}
- Sector: ${ctx.sector || "nedeterminat"}
- Data fotografiei: ${ctx.data || "necunoscută"}
- Observații / măsurători ale utilizatorului: ${ctx.nota || "niciuna"}

REGULI:
1. Estimează dimensiunile din reperele vizibile (bordură standard ~15-20 cm înălțime, dală 30-40 cm, mașină ~1,8 m lățime, ușă ~2 m). Spune explicit că e o estimare.
2. O problemă se trece doar dacă o vezi. Dacă imaginea nu permite o concluzie, folosește certitudine "de_verificat" și pune ce trebuie măsurat în "de_masurat".
3. Pentru fiecare problemă citează referința exactă din extrase (ex. "NP 051-2012, IV.2.4 (7)").
4. Gravitate: "ridicata" = blochează trecerea sau pericol de cădere/coliziune; "medie" = îngreunează deplasarea persoanelor cu dizabilități; "scazuta" = abatere minoră.
5. Scrie în limba română, formal, fără diacritice lipsă.
6. Protecția datelor: marchează în "zone_private" TOATE fețele de persoane și TOATE numerele de înmatriculare vizibile (inclusiv mici, din fundal), ca dreptunghiuri cu coordonate relative la imagine (0–1): x,y = colțul stânga-sus, w,h = lățimea și înălțimea. Mai bine prea mare decât prea mic. Listă goală dacă nu există.

Răspunde DOAR cu un obiect JSON, fără alt text, exact cu această formă:
{"verdict":"neconform"|"posibil_neconform"|"conform"|"imagine_neclara",
 "rezumat":"1-2 propoziții",
 "tip_spatiu":"trotuar"|"trecere_pietoni"|"statie_transport"|"parcare"|"alee"|"intersectie"|"altul",
 "probleme":[{"titlu":"scurt","constatare":"ce se vede, cu valori estimate","cerinta":"ce cere norma, cu valoarea","referinta":"NP 051-2012, IV.x (y)","gravitate":"ridicata"|"medie"|"scazuta","certitudine":"sigur"|"probabil"|"de_verificat"}],
 "de_masurat":["ce trebuie măsurat pe teren"],
 "responsabil":"primarie_sector"|"politia_locala"|"pmb"|"operator_retea",
 "responsabil_secundar":"primarie_sector"|"politia_locala"|"pmb"|"operator_retea"|null,
 "motiv_responsabil":"o propoziție",
 "adresa_vizibila":"text de pe plăcuțe/indicatoare din poză sau null",
 "descriere_sesizare":"paragraf de 3-6 propoziții pentru petiție, la persoana I, care descrie situația constatată",
 "solicitari":["măsuri concrete solicitate autorității, 2-4 puncte"],
 "zone_private":[{"tip":"fata"|"numar","x":0.0,"y":0.0,"w":0.0,"h":0.0}]}`;
}

/* ---------- Stare ---------- */
const $ = id => document.getElementById(id);
const PHOTO_URL = window.TL_PHOTO_URL || null; // varianta GitHub: link semnat pentru poze private
const S = { zones: [], pub: null, bmp: null, file: null, blob: null, thumb: null, lat: null, lon: null, sectorAuto: null, edge: null, date: null, result: null, recips: [], chosen: null, savedId: null, records: [] };
let cap = { sample: null, db: null, assets: null, user: null, downloads: null, uid: null };
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function toast(msg) { const t = $("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => t.hidden = true, 2600); }
const ls = { get(k) { try { return localStorage.getItem(k) } catch { return null } }, set(k, v) { try { localStorage.setItem(k, v) } catch {} } };

/* ---------- Tabs ---------- */
document.querySelectorAll("nav.tabs button").forEach(b => b.addEventListener("click", () => showView(b.dataset.view)));
function showView(v) {
  document.querySelectorAll("nav.tabs button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.view === v)));
  ["nou", "harta", "registru", "profil"].forEach(x => $("view-" + x).hidden = x !== v);
  if (v === "harta") renderBigMap();
  if (v === "registru") renderRegistry();
}

/* ---------- Hartă SVG ---------- */
const BB = { x0: -350, x1: 2275, y0: 3325, y1: 5430 }, KX = 0.714;
const vbW = (BB.x1 - BB.x0) * KX, vbH = BB.y1 - BB.y0;
const sx = x => (x - BB.x0) * KX, sy = y => BB.y1 - y;
const SECT_FILL = { 1: "#c9cfd6", 2: "#d6cfc4", 3: "#c6d3c8", 4: "#d8ccd0", 5: "#cdd0db", 6: "#d4d4c4" };
const SECT_FILL_D = { 1: "#2f3640", 2: "#3a352d", 3: "#2c3a30", 4: "#3b3035", 5: "#30333f", 6: "#37372c" };
function isDark() { const r = document.documentElement.getAttribute("data-theme"); if (r) return r === "dark"; return matchMedia("(prefers-color-scheme: dark)").matches; }
function centroid(r) { let x = 0, y = 0; r.forEach(p => { x += p[0]; y += p[1]; }); return [x / r.length, y / r.length]; }
const LABEL_FIX = { 1: [450, 5000], 2: [1450, 4650], 3: [1750, 4150], 4: [1250, 3850], 5: [550, 3950], 6: [-80, 4400] };
function mapSVG(pins, opts = {}) {
  const fills = isDark() ? SECT_FILL_D : SECT_FILL;
  let s = `<svg viewBox="0 0 ${vbW.toFixed(0)} ${vbH}" role="img" aria-label="Harta sectoarelor Bucureștiului">`;
  for (const k in POLY) s += `<polygon class="sec" fill="${fills[k]}" points="${POLY[k].map(p => sx(p[0]).toFixed(0) + "," + sy(p[1])).join(" ")}"/>`;
  for (const k in POLY) { const [cx, cy] = LABEL_FIX[k]; s += `<text class="sec-label" x="${sx(cx)}" y="${sy(cy)}">S${k}</text>`; }
  pins.forEach(p => { const [x, y] = toXY(p.lat, p.lon); s += `<circle class="pin" data-id="${esc(p.id || "")}" cx="${sx(x).toFixed(0)}" cy="${sy(y).toFixed(0)}" r="${opts.r || 26}" style="fill:${p.color}"><title>${esc(p.title || "")}</title></circle>`; });
  return s + "</svg>";
}
function renderPickMap() {
  const pins = S.lat != null ? [{ lat: S.lat, lon: S.lon, color: "var(--tactile)", title: "Locația constatării" }] : [];
  $("pickMap").innerHTML = mapSVG(pins, { r: 34 });
  const svg = $("pickMap").querySelector("svg");
  svg.addEventListener("click", e => {
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const x = p.x / KX + BB.x0, y = BB.y1 - p.y;
    setLocation(44 + y / 1e4, 26 + x / 1e4, "harta");
  });
}
function gravColor(r) {
  if (r.status === "rezolvata") return "var(--ok)";
  const g = (r.analiza?.probleme || []).map(p => p.gravitate);
  return g.includes("ridicata") ? "var(--bad)" : g.includes("medie") ? "var(--warn)" : "var(--info)";
}
function renderBigMap() {
  const pins = S.records.filter(r => r.lat != null).map(r => ({ id: r._id, lat: r.lat, lon: r.lon, color: gravColor(r), title: (r.adresa || "") + " — S" + (r.sector || "?") }));
  $("bigMap").innerHTML = mapSVG(pins);
  $("bigMap").querySelectorAll(".pin").forEach(c => c.addEventListener("click", () => { showView("registru"); highlight(c.dataset.id); }));
}

/* ---------- Locație ---------- */
function setLocation(lat, lon, src) {
  if (!(lat > 44.3 && lat < 44.6 && lon > 25.9 && lon < 26.3)) { locNote("bad", "Coordonatele nu sunt în București. Verifică ordinea: latitudine (~44,4), longitudine (~26,1)."); return; }
  S.lat = +lat.toFixed(6); S.lon = +lon.toFixed(6);
  $("coords").value = S.lat + ", " + S.lon;
  const r = sectorOf(S.lat, S.lon);
  S.sectorAuto = r ? r.s : null; S.edge = r ? r.edge : null;
  if (r) $("sector").value = r.s;
  const srcTxt = { exif: "din fotografie (GPS)", manual: "introduse manual", harta: "alese pe hartă (aproximativ)", gps: "din GPS-ul telefonului" }[src];
  if (!r) locNote("warn", `Coordonate ${srcTxt}. Punctul pare în afara limitelor celor 6 sectoare (Ilfov?). Alege sectorul manual.`);
  else if (r.edge < 60) locNote("warn", `Coordonate ${srcTxt}. Sector ${r.s} — dar punctul e la ~${Math.round(r.edge)} m de limita sectorului. Verifică pe <a href="https://www.google.com/maps?q=${S.lat},${S.lon}" target="_blank" rel="noopener">Google Maps</a> înainte de trimitere.`);
  else locNote("ok", `Coordonate ${srcTxt}. Sector ${r.s} (la ~${Math.round(r.edge)} m de limită). <a href="https://www.google.com/maps?q=${S.lat},${S.lon}" target="_blank" rel="noopener">Vezi pe Google Maps</a>`);
  renderPickMap(); updateButtons(); if (S.result) buildLetter();
}
function locNote(kind, html) { const n = $("locStatus"); n.className = "note" + (kind === "ok" ? "" : " " + kind); n.innerHTML = html; }
$("coords").addEventListener("change", () => {
  const v = $("coords").value.replace(/%2C/gi, ",");
  const m = v.match(/(4[34][.,]\d{3,})\s*[,;\s]\s*(2[56][.,]\d{3,})/);
  if (m) setLocation(parseFloat(m[1].replace(",", ".")), parseFloat(m[2].replace(",", ".")), "manual");
  else if (v.trim()) locNote("bad", "Nu recunosc coordonatele. Format: 44.4268, 26.1025 sau un link Google Maps care conține „@44.42…,26.10…”.");
});
$("sector").addEventListener("change", () => { if (S.result) { buildRecips(); buildLetter(); } updateButtons(); });
$("adresa").addEventListener("change", () => { if (S.result) buildLetter(); });


/* ---------- Cititor EXIF propriu (GPS + data), fără biblioteci externe ---------- */
async function readExif(file) {
  const buf = await file.slice(0, 256 * 1024).arrayBuffer(); const v = new DataView(buf);
  if (v.byteLength < 4 || v.getUint16(0) !== 0xFFD8) return null;
  let o = 2;
  while (o + 4 < v.byteLength) {
    const mk = v.getUint16(o), len = v.getUint16(o + 2);
    if (mk === 0xFFE1 && v.getUint32(o + 4) === 0x45786966) return parseTiff(v, o + 10);
    if ((mk & 0xFF00) !== 0xFF00) break; o += 2 + len;
  }
  return null;
}
function parseTiff(v, t) {
  const le = v.getUint16(t) === 0x4949; const u16 = a => v.getUint16(a, le), u32 = a => v.getUint32(a, le);
  const ifd = off => { const out = {}; const a = t + off; if (a + 2 > v.byteLength) return out; const n = u16(a);
    for (let i = 0; i < n; i++) { const e = a + 2 + i * 12; if (e + 12 > v.byteLength) break; out[u16(e)] = { type: u16(e + 2), count: u32(e + 4), at: e + 8 }; } return out; };
  const rat = (e, i) => { const p = t + u32(e.at) + i * 8; return u32(p) / (u32(p + 4) || 1); };
  const str = e => { const p = e.count > 4 ? t + u32(e.at) : e.at; let s = ""; for (let i = 0; i < e.count - 1 && p + i < v.byteLength; i++) s += String.fromCharCode(v.getUint8(p + i)); return s; };
  const res = {}; const i0 = ifd(u32(t + 4));
  if (i0[0x8769]) { const ex = ifd(u32(i0[0x8769].at)); if (ex[0x9003]) { const m = str(ex[0x9003]).match(/(\d{4}):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/); if (m) res.date = new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +m[6]); } }
  if (i0[0x8825]) { const g = ifd(u32(i0[0x8825].at));
    if (g[2] && g[4]) { const d = e => rat(e, 0) + rat(e, 1) / 60 + rat(e, 2) / 3600;
      let lat = d(g[2]), lon = d(g[4]); if (g[1] && str(g[1]).startsWith("S")) lat = -lat; if (g[3] && str(g[3]).startsWith("W")) lon = -lon;
      if (isFinite(lat) && isFinite(lon) && (lat || lon)) { res.lat = lat; res.lon = lon; } } }
  return res;
}
/* ---------- Locația curentă (doar în varianta GitHub; în Claude e blocată) ---------- */
if (window.claude && window.claude.__shim && navigator.geolocation) {
  $("geoRow").hidden = false;
  $("geoBtn").addEventListener("click", () => {
    $("geoBtn").disabled = true; locNote("ok", "Caut locația… (acceptă permisiunea de localizare)");
    navigator.geolocation.getCurrentPosition(
      p => { $("geoBtn").disabled = false; setLocation(p.coords.latitude, p.coords.longitude, "gps"); if (p.coords.accuracy > 40) toast(`Precizie ~${Math.round(p.coords.accuracy)} m – verifică pe hartă`); },
      e => { $("geoBtn").disabled = false; locNote("bad", e.code === 1 ? "Localizarea e refuzată. Permite-o din setările browserului pentru acest site." : "Nu am putut afla locația. Încearcă afară sau lipește coordonatele."); },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
  });
}

/* ---------- Fotografie ---------- */
["photo", "photoCam", "photoGal"].forEach(id => $(id).addEventListener("change", async e => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  try { await loadPhoto(f); } finally { e.target.value = ""; }
}));
// Decodare robustă: întâi micșorat direct la decodare (poze de 50–200 MP), apoi variante de rezervă.
async function decodeScaled(f, max) {
  try { // 1) createImageBitmap cu micșorare la decodare
    const probe = await createImageBitmap(f, { imageOrientation: "from-image", resizeWidth: max, resizeQuality: "high" });
    if (probe.height <= max) return probe;
    probe.close && probe.close();
    return await createImageBitmap(f, { imageOrientation: "from-image", resizeHeight: max, resizeQuality: "high" });
  } catch {}
  try { return await createImageBitmap(f, { imageOrientation: "from-image" }); } catch {} // 2) fără micșorare
  const url = URL.createObjectURL(f); // 3) prin element <img>
  try { const im = new Image(); im.src = url; await im.decode(); return im; } finally { setTimeout(() => URL.revokeObjectURL(url), 5000); }
}
async function loadPhoto(f) {
  if (/hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name || "")) { toast("Poza e HEIC. Setează camera pe JPEG („Cel mai compatibil”) sau alege altă poză."); }
  $("dropEmpty").innerHTML = `<div class="thinking"><span class="dots"><i></i><i></i><i></i></span> Se încarcă poza…</div>`;
  S.file = f; S.result = null; $("analysis").innerHTML = ""; $("step4").hidden = true; $("privStep").hidden = true; S.savedId = null; S.zones = []; S.pub = null; if (S.bmp && S.bmp.close) S.bmp.close(); S.bmp = null;
  try {
    const bmp = await decodeScaled(f, 1800);
    S.blob = await scaled(bmp, 1800, 0.86, "blob");
    S.thumb = await scaled(bmp, 360, 0.7, "dataurl");
    bmp.close && bmp.close();
    if (!S.blob) throw new Error("blob");
  } catch (err) {
    resetDrop();
    toast(`Poza nu a putut fi deschisă (${f.type || "tip necunoscut"}, ${(f.size / 1048576).toFixed(1)} MB). Încearcă altă poză sau „Fă o poză”.`);
    return;
  }
  $("preview").src = URL.createObjectURL(S.blob); $("preview").hidden = false; $("dropEmpty").hidden = true; $("drop").classList.add("has");
  let meta = [];
  try {
    const ex = await readExif(f);
    if (ex && ex.date) { S.date = ex.date; meta.push(`<span class="chip">${S.date.toLocaleString("ro-RO", { dateStyle: "medium", timeStyle: "short" })}</span>`); }
    if (ex && ex.lat != null) { meta.push(`<span class="chip ok">GPS din poză</span>`); setLocation(ex.lat, ex.lon, "exif"); }
    else { meta.push(`<span class="chip warn">fără GPS în poză</span>`); if (S.lat == null) locNote("warn", "Poza nu conține coordonate (telefonul sau browserul le-a eliminat). Lipește coordonatele din Google Maps sau atinge harta."); }
  } catch {}
  if (!S.date) S.date = new Date(f.lastModified || Date.now());
  $("photoMeta").innerHTML = meta.join(""); $("photoMeta").hidden = !meta.length;
  updateButtons();
}
const DROP_EMPTY_HTML = document.getElementById("dropEmpty").innerHTML;
function resetDrop() { $("dropEmpty").innerHTML = DROP_EMPTY_HTML; $("dropEmpty").hidden = false; $("preview").hidden = true; $("drop").classList.remove("has"); }
function scaled(bmp, max, q, kind) {
  const W = bmp.naturalWidth || bmp.width, Hh = bmp.naturalHeight || bmp.height;
  const k = Math.min(1, max / Math.max(W, Hh));
  const c = document.createElement("canvas"); c.width = Math.round(W * k); c.height = Math.round(Hh * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  if (kind === "dataurl") return Promise.resolve(c.toDataURL("image/jpeg", q));
  return new Promise(res => c.toBlob(res, "image/jpeg", q));
}
function updateButtons() { $("analyze").disabled = !(S.blob && cap.sample); }

/* ---------- Protecția datelor: estompare fețe / numere ---------- */
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));
let privHist = [], privT = null, privPending = null;
async function initPrivacy(r) {
  try { S.bmp = await createImageBitmap(S.blob); } catch { S.bmp = null; return; }
  S.zones = (Array.isArray(r.zone_private) ? r.zone_private : []).map(z => {
    let x = clamp01(z.x), y = clamp01(z.y), w = clamp01(z.w), h = clamp01(z.h);
    const px = w * .15, py = h * .15; // margine de siguranță
    x = clamp01(x - px); y = clamp01(y - py); w = Math.min(1 - x, w + 2 * px); h = Math.min(1 - y, h + 2 * py);
    return { tip: z.tip === "numar" ? "numar" : "fata", x, y, w, h };
  }).filter(z => z.w > .003 && z.h > .003);
  privHist = [];
  const police = r.responsabil === "politia_locala" || r.responsabil_secundar === "politia_locala";
  $("blurPlates").checked = !police;
  $("privStep").hidden = false;
  privChanged(true);
}
function activeZones() { return S.zones.filter(z => z.tip !== "numar" || $("blurPlates").checked); }
function pixelate(ctx, img, W, H, z) {
  const x = Math.round(z.x * W), y = Math.round(z.y * H), w = Math.max(2, Math.round(z.w * W)), h = Math.max(2, Math.round(z.h * H));
  const bs = Math.max(8, Math.round(Math.max(w, h) / 7));
  const t = document.createElement("canvas"); t.width = Math.max(1, Math.ceil(w / bs)); t.height = Math.max(1, Math.ceil(h / bs));
  const tc = t.getContext("2d"); tc.drawImage(img, x, y, w, h, 0, 0, t.width, t.height);
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(t, 0, 0, t.width, t.height, x, y, w, h); ctx.restore();
}
function renderPublic(cv, withMarks) {
  const W = S.bmp.width, H = S.bmp.height; cv.width = W; cv.height = H;
  const c = cv.getContext("2d"); c.drawImage(S.bmp, 0, 0);
  activeZones().forEach(z => pixelate(c, S.bmp, W, H, z));
  if (withMarks) {
    const lw = Math.max(3, Math.round(W / 300));
    S.zones.forEach(z => {
      const on = z.tip !== "numar" || $("blurPlates").checked;
      c.save(); c.lineWidth = lw; c.setLineDash(on ? [] : [lw * 3, lw * 2]);
      c.strokeStyle = on ? "#f2c200" : "rgba(255,255,255,.85)";
      c.strokeRect(z.x * W, z.y * H, z.w * W, z.h * H);
      c.fillStyle = on ? "#f2c200" : "rgba(255,255,255,.85)"; c.font = `600 ${lw * 6}px sans-serif`;
      c.fillText(z.tip === "numar" ? "număr" : z.tip === "fata" ? "față" : "zonă", z.x * W + lw, Math.max(lw * 6, z.y * H - lw * 1.5));
      c.restore();
    });
  }
}
function privChanged(now) {
  if (!S.bmp) return;
  renderPublic($("privCanvas"), true);
  const nf = S.zones.filter(z => z.tip === "fata").length, nn = S.zones.filter(z => z.tip === "numar").length, nm = S.zones.filter(z => z.tip === "manual").length;
  $("privCount").textContent = `${nf} ${nf === 1 ? "față" : "fețe"} · ${nn} ${nn === 1 ? "număr" : "numere"}${nm ? ` · ${nm} ${nm === 1 ? "zonă adăugată" : "zone adăugate"}` : ""}`;
  $("plateNote").hidden = $("blurPlates").checked || !nn;
  $("privUndo").disabled = !privHist.length;
  clearTimeout(privT); S.pub = null;
  privPending = new Promise(res => { privT = setTimeout(async () => { await buildPublic(); res(); }, now ? 0 : 250); });
}
async function buildPublic() {
  const cv = document.createElement("canvas"); renderPublic(cv, false);
  S.pub = await new Promise(r => cv.toBlob(r, "image/jpeg", .86));
  const t = document.createElement("canvas"); const k = Math.min(1, 360 / Math.max(cv.width, cv.height));
  t.width = Math.round(cv.width * k); t.height = Math.round(cv.height * k); t.getContext("2d").drawImage(cv, 0, 0, t.width, t.height);
  S.thumb = t.toDataURL("image/jpeg", .7);
  if (S.result) $("shareRow").hidden = !canShareFile();
}
async function privReady() { if (privPending) await privPending; }
$("blurPlates").addEventListener("change", () => privChanged());
$("privUndo").addEventListener("click", () => { const prev = privHist.pop(); if (prev) { S.zones = prev; privChanged(); } });
(() => {
  const cv = $("privCanvas"); let st = null;
  const pt = e => { const r = cv.getBoundingClientRect(); return { x: clamp01((e.clientX - r.left) / r.width), y: clamp01((e.clientY - r.top) / r.height) }; };
  cv.addEventListener("pointerdown", e => { if (!S.bmp) return; cv.setPointerCapture(e.pointerId); st = pt(e); });
  cv.addEventListener("pointermove", e => {
    if (!st) return; const p = pt(e); privChanged.preview = true;
    renderPublic(cv, true); const c = cv.getContext("2d"); c.save(); c.strokeStyle = "#f2c200"; c.lineWidth = Math.max(3, cv.width / 300); c.setLineDash([10, 6]);
    c.strokeRect(Math.min(st.x, p.x) * cv.width, Math.min(st.y, p.y) * cv.height, Math.abs(p.x - st.x) * cv.width, Math.abs(p.y - st.y) * cv.height); c.restore();
  });
  cv.addEventListener("pointerup", e => {
    if (!st) return; const p = pt(e); const a = st; st = null;
    const dx = Math.abs(p.x - a.x), dy = Math.abs(p.y - a.y);
    privHist.push(S.zones.map(z => ({ ...z })));
    if (dx < .02 && dy < .02) { // atingere: scoate zona de sub deget
      const i = S.zones.map((z, k) => [z, k]).reverse().find(([z]) => p.x >= z.x && p.x <= z.x + z.w && p.y >= z.y && p.y <= z.y + z.h);
      if (i) { S.zones.splice(i[1], 1); toast("Zonă scoasă – „Anulează” o readuce"); } else { privHist.pop(); }
    } else {
      S.zones.push({ tip: "manual", x: Math.min(a.x, p.x), y: Math.min(a.y, p.y), w: dx, h: dy });
    }
    privChanged();
  });
  cv.addEventListener("pointercancel", () => { st = null; privChanged(); });
})();

/* ---------- Analiză ---------- */
let ctl = null;
$("stop").addEventListener("click", () => ctl && ctl.abort());
$("analyze").addEventListener("click", async () => {
  if (!cap.sample || !S.blob) return;
  ctl = new AbortController();
  $("analyze").disabled = true; $("stop").hidden = false;
  $("analysis").innerHTML = `<div class="thinking"><span class="dots"><i></i><i></i><i></i></span> Claude verifică fotografia față de normative… (de obicei 20–60 s)</div>`;
  try {
    const ctx = { adresa: $("adresa").value.trim(), sector: $("sector").value, nota: $("nota").value.trim(), data: S.date ? S.date.toLocaleDateString("ro-RO") : "" };
    const r = await cap.sample.json(buildPrompt(ctx), { images: [S.blob], signal: ctl.signal });
    if (!r || typeof r !== "object" || !Array.isArray(r.probleme)) throw { code: "invalid_json" };
    S.result = r; renderAnalysis(r);
    if (!$("adresa").value.trim() && r.adresa_vizibila) $("adresa").value = r.adresa_vizibila;
    $("step4").hidden = false; buildRecips(); buildLetter();
    await initPrivacy(r);
  } catch (e) {
    const msg = {
      cancelled: "Analiza a fost oprită.", not_granted: "Analiza are nevoie de permisiunea de a folosi Claude. O poți acorda din meniul de permisiuni al paginii.",
      rate_limited: "Prea multe cereri sau limita de utilizare a contului. Încearcă din nou peste puțin timp.",
      image_rejected: "Imaginea a fost refuzată (format sau dimensiune). Încearcă o altă fotografie.",
      images_unavailable: "Această vizualizare nu poate trimite imagini către Claude (deschide pagina în claude.ai).",
      invalid_json: "Răspunsul nu a avut formatul așteptat. Apasă din nou „Analizează”.", refused: "Claude nu a putut analiza această imagine."
    }[e && e.code] || "Analiza nu a reușit. Încearcă din nou.";
    const det = e && e.message && !["cancelled"].includes(e.code) ? `<br><span class="mono" style="font-size:.8rem">Detaliu: ${esc(e.code || "")} – ${esc(e.message)}</span>` : "";
    $("analysis").innerHTML = `<div class="note ${e && e.code === "cancelled" ? "" : "bad"}">${msg}${det}</div>`;
  } finally { $("stop").hidden = true; updateButtons(); }
});
const VERD = { neconform: ["Neconform", "bad"], posibil_neconform: ["Posibil neconform", "warn"], conform: ["Fără abateri vizibile", "ok"], imagine_neclara: ["Imagine neclară", "info"] };
const GRAV = { ridicata: ["ridicată", "bad"], medie: ["medie", "warn"], scazuta: ["scăzută", "info"] };
const CERT = { sigur: "sigur", probabil: "probabil", de_verificat: "de verificat pe teren" };
function analysisHTML(r) {
  const v = VERD[r.verdict] || ["—", "info"];
  let h = `<div class="verdict"><strong style="color:var(--${v[1]})">${v[0]}</strong><span class="chip">${esc((r.tip_spatiu || "").replace("_", " "))}</span></div><p style="margin:0">${esc(r.rezumat)}</p>`;
  if (r.probleme.length) {
    h += `<ul class="issues">` + r.probleme.map(p => {
      const g = GRAV[p.gravitate] || ["—", "info"];
      return `<li class="issue g-${esc(p.gravitate)}"><div class="row" style="justify-content:space-between"><h3>${esc(p.titlu)}</h3><span class="row" style="gap:6px"><span class="chip ${g[1]}">${g[0]}</span><span class="chip">${esc(CERT[p.certitudine] || p.certitudine)}</span></span></div>
      <dl><dt>Constatat</dt><dd>${esc(p.constatare)}</dd><dt>Cerință</dt><dd>${esc(p.cerinta)}</dd><dt>Bază</dt><dd class="ref">${esc(p.referinta)}</dd></dl></li>`;
    }).join("") + `</ul>`;
  }
  if (r.de_masurat && r.de_masurat.length) h += `<div class="note warn"><b>De măsurat pe teren:</b><ul style="margin:4px 0 0;padding-left:20px">${r.de_masurat.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
  return h;
}
function renderAnalysis(r) { $("analysis").innerHTML = analysisHTML(r); }

/* ---------- Destinatari ---------- */
function instFor(code, sec) {
  if (code === "politia_locala") return sec ? INST.pol[sec] : INST.plmb;
  if (code === "pmb") return INST.pmb;
  return sec ? INST.prim[sec] : INST.pmb; // primarie_sector, operator_retea
}
function buildRecips() {
  const sec = $("sector").value, r = S.result || {};
  const list = [], seen = new Set();
  const add = (code, tag) => { const i = instFor(code, sec); if (i && !seen.has(i.n)) { seen.add(i.n); list.push({ ...i, tag }); } };
  add(r.responsabil || "primarie_sector", "recomandat");
  if (r.responsabil_secundar) add(r.responsabil_secundar, "în copie");
  add("primarie_sector", ""); add("politia_locala", ""); add("pmb", "");
  S.recips = list; if (!S.chosen || !list.find(x => x.n === S.chosen)) S.chosen = list[0].n;
  $("recips").innerHTML = (r.motiv_responsabil ? `<p class="hint">${esc(r.motiv_responsabil)}</p>` : "") + list.map((x, i) => `
    <label class="recip"><input type="radio" name="recip" value="${i}" ${x.n === S.chosen ? "checked" : ""}>
      <div style="min-width:0"><div class="who">${esc(x.n)} ${x.tag ? `<span class="chip ${x.tag === "recomandat" ? "ok" : "info"}">${x.tag}</span>` : ""}</div>
      ${x.e ? `<div class="addr">${esc(x.e)}</div>` : `<div class="hint">fără adresă de e-mail publicată${x.t ? ` · dispecerat ${esc(x.t)}` : ""}</div>`}
      ${x.w ? `<a href="${esc(x.w)}" target="_blank" rel="noopener" style="font-size:.85rem">formular / site</a>` : ""}</div></label>`).join("");
  $("recips").querySelectorAll("input").forEach(inp => inp.addEventListener("change", () => { S.chosen = S.recips[+inp.value].n; buildLetter(); }));
}
function chosenRecip() { return S.recips.find(x => x.n === S.chosen) || S.recips[0]; }

/* ---------- Text sesizare ---------- */
/* ---------- Profil (obligatoriu: nume + prenume, e-mail) ---------- */
const PF = ["pNume", "pEmail", "pTel", "pAdr"];
PF.forEach(id => { const v = ls.get("tl_" + id); if (v) $(id).value = v; $(id).addEventListener("input", () => { ls.set("tl_" + id, $(id).value); profileState(); }); });
document.addEventListener("click", e => { const g = e.target.closest("[data-goto]"); if (g) showView(g.dataset.goto); });
function profileOk() {
  const n = $("pNume").value.trim(), m = $("pEmail").value.trim();
  if (n.split(/\s+/).filter(Boolean).length < 2) return "Scrie numele și prenumele (minim două cuvinte).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)) return "Scrie o adresă de e-mail validă pentru răspuns.";
  return "";
}
function profileState() {
  const err = profileOk();
  $("profDot").hidden = !err; $("profBanner").hidden = !err;
  $("signedAs").className = "note" + (err ? " bad" : "");
  $("signedAs").innerHTML = err
    ? `<b>Profil incomplet.</b> ${esc(err)} <button class="btn small" type="button" data-goto="profil">Completează profilul</button>`
    : `Semnat: <b>${esc($("pNume").value.trim())}</b> · ${esc($("pEmail").value.trim())}${$("pAdr").value.trim() ? " · " + esc($("pAdr").value.trim()) : ""} <button class="btn small" type="button" data-goto="profil">Modifică</button>`;
  ["copyLetter", "shareMail"].forEach(id => $(id).disabled = !!err);
  $("mailto").style.pointerEvents = err ? "none" : ""; $("mailto").style.opacity = err ? ".45" : "";
  if (S.result) buildLetter();
  return !err;
}
async function fillProfile() {
  const put = (id, v) => { if (v && !$(id).value.trim()) { $(id).value = v; ls.set("tl_" + id, v); } };
  // 1) profilul salvat de tine (Claude: în baza ta privată; GitHub: în contul Supabase)
  try {
    if (cap.db && cap.uid && !(window.claude && window.claude.__shim)) {
      const d = await cap.db.doc("data/users/" + cap.uid + "/profile").get();
      if (d.exists) { const p = d.data(); put("pNume", p.nume); put("pEmail", p.email); put("pTel", p.tel); put("pAdr", p.domiciliu); }
    }
  } catch {}
  // 2) din contul cu care ești logată
  if (cap.user && cap.user.me) {
    const me = await cap.user.me().catch(() => null);
    if (me) { put("pNume", me.name); put("pEmail", me.email); put("pTel", me.tel); put("pAdr", me.domiciliu); }
  }
  $("profWhere").textContent = window.claude && window.claude.__shim ? "se salvează în contul tău – apare pe toate dispozitivele" : (cap.db && cap.uid ? "se salvează privat, în contul tău Claude" : "se salvează în acest browser");
  profileState();
}
$("saveProf").addEventListener("click", async () => {
  const err = profileOk(); $("profErr").textContent = err; if (err) return;
  const data = { nume: $("pNume").value.trim(), email: $("pEmail").value.trim(), tel: $("pTel").value.trim(), domiciliu: $("pAdr").value.trim() };
  PF.forEach(id => ls.set("tl_" + id, $(id).value));
  try {
    if (cap.user && cap.user.saveProfile) await cap.user.saveProfile({ full_name: data.nume, contact_email: data.email, tel: data.tel, domiciliu: data.domiciliu });
    else if (cap.db && cap.uid) await cap.db.doc("data/users/" + cap.uid + "/profile").set(data);
    toast("Profil salvat"); profileState(); showView("nou");
  } catch { toast("Profilul s-a salvat doar în acest browser."); }
});
profileState();
/* ---------- Administrare utilizatori (doar varianta GitHub, doar administrator) ---------- */
const MST = { pending: ["în așteptare", "warn"], approved: ["aprobat", "ok"], blocked: ["blocat", "bad"] };
async function loadUsers() {
  if (!cap.user || !cap.user.isAdmin || !cap.user.isAdmin()) return;
  $("usersStep").hidden = false;
  let list = [];
  try { list = await cap.user.listMembers(); } catch (e) { $("usersList").innerHTML = `<div class="note bad">${esc(e.message)}</div>`; return; }
  const pend = list.filter(m => m.status === "pending").length;
  $("pendingBanner").hidden = !pend;
  $("pendingBanner").innerHTML = `<b>${pend} ${pend === 1 ? "cerere nouă" : "cereri noi"} de acces.</b> <button class="btn small" type="button" data-goto="profil">Vezi utilizatorii</button>`;
  $("usersList").innerHTML = list.map(m => {
    const st = MST[m.status] || ["?", "info"]; const self = cap.uid === m.user_id;
    const btns = self ? `<span class="chip">tu · administrator</span>`
      : m.status === "pending" ? `<button class="btn small dark" data-u="${esc(m.user_id)}" data-s="approved">Aprobă</button><button class="btn small danger" data-u="${esc(m.user_id)}" data-s="blocked">Respinge</button>`
      : m.status === "approved" ? `<button class="btn small danger" data-u="${esc(m.user_id)}" data-s="blocked">Blochează</button>`
      : `<button class="btn small" data-u="${esc(m.user_id)}" data-s="approved">Reactivează</button>`;
    return `<div class="recip" style="cursor:default;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:0"><div class="who">${esc(m.nume || "(fără nume)")} <span class="chip ${st[1]}">${st[0]}</span></div><div class="addr">${esc(m.email || "")}</div><div class="hint mono" style="font-size:.75rem">înscris ${new Date(m.created_at).toLocaleDateString("ro-RO")}</div></div><div class="row" style="gap:6px">${btns}</div></div>`;
  }).join("") || `<div class="empty">Niciun utilizator încă.</div>`;
  $("usersList").querySelectorAll("[data-u]").forEach(b => b.addEventListener("click", async () => {
    b.disabled = true;
    try { await cap.user.setMemberStatus(b.dataset.u, b.dataset.s); toast(b.dataset.s === "approved" ? "Cont aprobat" : "Acces oprit"); }
    catch (e) { toast(e.message || "Nu s-a putut schimba."); }
    loadUsers();
  }));
}
$("usersRefresh").addEventListener("click", loadUsers);
$("copyAppLink").addEventListener("click", () => copy(location.origin + location.pathname, "Linkul aplicației a fost copiat"));

$("pwSave").addEventListener("click", async () => {
  const a = $("pw1").value, b = $("pw2").value; $("pwErr").textContent = "";
  if (a.length < 10) { $("pwErr").textContent = "Parola trebuie să aibă minim 10 caractere."; return; }
  if (a !== b) { $("pwErr").textContent = "Cele două parole nu coincid."; return; }
  $("pwSave").disabled = true;
  try { await cap.user.changePassword(a); $("pw1").value = $("pw2").value = ""; toast("Parola a fost schimbată"); }
  catch (e) { $("pwErr").textContent = (e && e.message) || "Parola nu a putut fi schimbată."; }
  finally { $("pwSave").disabled = false; }
});

function subject() {
  const r = S.result || {}; const sec = $("sector").value;
  return `Sesizare – trasee pietonale neconforme (siguranță în exploatare și accesibilitate) – ${$("adresa").value.trim() || "locație cu coordonatele anexate"}${sec ? ", Sector " + sec : ""}`;
}
function buildLetter() {
  const r = S.result; if (!r) return;
  const rc = chosenRecip(); const sec = $("sector").value;
  const nume = $("pNume").value.trim() || "[Nume Prenume]", email = $("pEmail").value.trim() || "[e-mail]";
  const tel = $("pTel").value.trim(), dom = $("pAdr").value.trim();
  const loc = $("adresa").value.trim() || "[adresa]";
  const coord = S.lat != null ? `coordonate GPS ${S.lat}, ${S.lon} – https://www.google.com/maps?q=${S.lat},${S.lon}` : "[coordonate]";
  const data = S.date ? S.date.toLocaleDateString("ro-RO") : new Date().toLocaleDateString("ro-RO");
  const probs = (r.probleme || []).filter(p => p.certitudine !== "de_verificat");
  const verif = (r.probleme || []).filter(p => p.certitudine === "de_verificat");
  const refs = [...new Set((r.probleme || []).map(p => p.referinta))].join("; ");
  let t = `Către: ${rc.n}\n\nSubiect: ${subject()}\n\n`;
  t += `Subsemnatul/Subsemnata ${nume}${dom ? `, cu domiciliul în ${dom}` : ""}, e-mail ${email}${tel ? `, telefon ${tel}` : ""}, în temeiul Ordonanței Guvernului nr. 27/2002 privind reglementarea activității de soluționare a petițiilor, vă aduc la cunoștință următoarele:\n\n`;
  t += `În data de ${data}, pe traseul pietonal de la adresa ${loc}${sec ? ", Sector " + sec : ""} (${coord}), am constatat situația din fotografia anexată.\n\n${r.descriere_sesizare || ""}\n\n`;
  if (probs.length) { t += `Deficiențe constatate:\n`; probs.forEach((p, i) => t += `${i + 1}. ${p.titlu} – ${p.constatare} Cerința aplicabilă: ${p.cerinta} (${p.referinta}).\n`); t += `\n`; }
  if (verif.length) { t += `Aspecte care necesită verificare prin măsurători în teren:\n`; verif.forEach(p => t += `– ${p.titlu}: ${p.cerinta} (${p.referinta}).\n`); t += `\n`; }
  t += `Situația contravine obligației prevăzute de art. 62 alin. (1) din Legea nr. 448/2006 privind protecția și promovarea drepturilor persoanelor cu handicap, potrivit căreia căile de acces, străzile și drumurile publice se adaptează astfel încât să permită accesul neîngrădit, precum și prevederilor ${refs || "normativelor NP 051-2012 și NP 068-02"}.\n\n`;
  t += `Vă solicit:\n`; (r.solicitari && r.solicitari.length ? r.solicitari : ["verificarea situației în teren", "dispunerea măsurilor de remediere"]).forEach(s => t += `– ${s};\n`);
  t += `– comunicarea răspunsului la adresa de e-mail de mai sus, în termenul legal de 30 de zile prevăzut de art. 8 din OG nr. 27/2002.\n\nAnexă: fotografia locației (${data}).\n\nCu stimă,\n${nume}\n${new Date().toLocaleDateString("ro-RO")}`;
  $("letter").value = t;
  $("shareRow").hidden = !canShareFile();
  const m = $("mailto");
  if (rc.e) { m.hidden = false; m.href = `mailto:${rc.e}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(t)}`; }
  else m.hidden = true;
}
function photoFile() { const b = S.pub || S.blob; return b ? new File([b], `sesizare-${(S.date || new Date()).toISOString().slice(0, 10)}-S${$("sector").value || "x"}.jpg`, { type: "image/jpeg" }) : null; }
function canShareFile() { try { const f = photoFile(); return !!(window.claude && window.claude.__shim && f && navigator.canShare && navigator.canShare({ files: [f] })); } catch { return false; } }
$("shareMail").addEventListener("click", async () => {
  await privReady(); const f = photoFile(); if (!f) return;
  const rc = chosenRecip();
  if (rc && rc.e) { try { await navigator.clipboard.writeText(rc.e); toast("Adresa " + rc.e + " e copiată – lipește-o la „Către”"); } catch {} }
  try { await navigator.share({ files: [f], title: subject(), text: $("letter").value }); }
  catch (e) { if (e && e.name !== "AbortError") toast("Partajarea nu a mers. Salvează fotografia și atașeaz-o manual."); }
});
async function copy(text, okMsg) { try { await navigator.clipboard.writeText(text); toast(okMsg); } catch { $("letter").focus(); $("letter").select(); toast("Textul e selectat — copiază-l manual."); } }
$("copyLetter").addEventListener("click", () => copy($("letter").value, "Textul sesizării a fost copiat"));
$("copySubject").addEventListener("click", () => copy(subject(), "Subiectul a fost copiat"));
$("savePhoto").addEventListener("click", async () => {
  if (!cap.downloads || !S.blob) return; await privReady();
  try { await cap.downloads.save({ filename: `sesizare-${(S.date || new Date()).toISOString().slice(0, 10)}-S${$("sector").value || "x"}.jpg`, data: S.pub || S.blob }); }
  catch (e) { toast("Fotografia nu a fost salvată."); }
});

/* ---------- Salvare în registru ---------- */
$("saveRec").addEventListener("click", async () => {
  if (!cap.db) { toast("Registrul nu e disponibil în această vizualizare."); return; }
  if (!S.result) return;
  $("saveRec").disabled = true;
  try {
    let photoId = null;
    await privReady();
    if (cap.assets && (S.pub || S.blob)) { try { photoId = (await cap.assets.upload(S.pub || S.blob, { type: "image/jpeg" })).id; } catch {} }
    const rc = chosenRecip();
    const doc = {
      createdAt: new Date().toISOString(), fotoData: S.date ? S.date.toISOString() : null,
      lat: S.lat, lon: S.lon, sector: $("sector").value || null, sectorAuto: S.sectorAuto,
      adresa: $("adresa").value.trim(), nota: $("nota").value.trim(),
      photoId, thumb: S.thumb, analiza: S.result, destinatar: rc.n, destinatarEmail: rc.e || "",
      subiect: subject(), text: $("letter").value, status: "noua", nrInreg: "", by: cap.uid || null
    };
    const ref = S.savedId ? cap.db.collection("sesizari").doc(S.savedId) : cap.db.collection("sesizari").doc();
    await ref.set(doc); S.savedId = ref.id;
    toast("Salvat în registru");
  } catch (e) { toast(e && e.code === "quota_exceeded" ? "Registrul e plin." : "Nu s-a putut salva. Încearcă din nou."); }
  finally { $("saveRec").disabled = false; }
});
$("reset").addEventListener("click", () => {
  Object.assign(S, { file: null, blob: null, thumb: null, lat: null, lon: null, sectorAuto: null, edge: null, date: null, result: null, savedId: null, zones: [], pub: null, bmp: null }); $("privStep").hidden = true;
  ["coords", "adresa", "nota", "letter"].forEach(id => $(id).value = ""); $("sector").value = "";
  $("photo").value = ""; resetDrop();
  $("photoMeta").hidden = true; $("analysis").innerHTML = ""; $("step4").hidden = true;
  locNote("ok", "Coordonatele vin din fotografie. Dacă poza nu le are, lipește-le din Google Maps sau atinge harta de mai jos.");
  renderPickMap(); updateButtons(); window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- Registru ---------- */
const STATUS = { noua: "nouă", trimisa: "trimisă", raspuns: "răspuns primit", rezolvata: "rezolvată", respinsa: "respinsă" };
$("exportBtn").addEventListener("click", async () => {
  if (!cap.downloads) return;
  const out = S.records.map(({ thumb, ...r }) => r);
  try { await cap.downloads.save({ filename: `trotuar-liber-registru-${new Date().toISOString().slice(0, 10)}.json`, data: JSON.stringify(out, null, 2) }); toast("Registru exportat"); }
  catch (e) { if (e && e.code !== "declined") toast("Exportul nu a reușit."); }
});
$("fSector").addEventListener("change", renderRegistry); $("fStatus").addEventListener("change", renderRegistry);
function renderRegistry() {
  $("regCount").textContent = S.records.length ? `(${S.records.length})` : "";
  if ($("view-registru").hidden) return;
  const fs = $("fSector").value, fst = $("fStatus").value;
  const list = S.records.filter(r => (!fs || r.sector === fs) && (!fst || r.status === fst));
  const box = $("regList");
  if (!cap.db) { box.innerHTML = `<div class="empty">Registrul comun se încarcă… Dacă nu apare, deschide pagina în claude.ai, autentificat.</div>`; return; }
  if (!list.length) { box.innerHTML = `<div class="empty"><b>Nicio constatare ${S.records.length ? "pentru filtrul ales" : "încă"}.</b><br>Fă o poză în fila „Constatare”, analizeaz-o și apasă „Salvează în registru”.</div>`; return; }
  box.innerHTML = list.map(r => {
    const v = VERD[r.analiza?.verdict] || ["—", "info"];
    const src = r.photoId && !PHOTO_URL ? "/_blob/" + r.photoId : (r.thumb || "");
    const n = (r.analiza?.probleme || []).length;
    return `<article class="reg-card" id="rec-${esc(r._id)}">
      <img src="${esc(src)}" data-photo="${esc(r.photoId || "")}" alt="" loading="lazy">
      <div class="meta">
        <div class="addr">${esc(r.adresa || "Adresă nespecificată")}</div>
        <div class="row" style="gap:6px"><span class="chip sector">S${esc(r.sector || "?")}</span><span class="chip ${v[1]}">${v[0]}</span><span class="chip">${n} ${n === 1 ? "problemă" : "probleme"}</span></div>
        <div class="hint mono">${new Date(r.createdAt).toLocaleDateString("ro-RO")} → ${esc(r.destinatar || "")}</div>
        <div class="row" style="gap:6px">
          <select data-act="status" data-id="${esc(r._id)}" aria-label="Stare" style="width:auto;padding:6px 8px">${Object.entries(STATUS).map(([k, l]) => `<option value="${k}" ${r.status === k ? "selected" : ""}>${l}</option>`).join("")}</select>
          <input type="text" data-act="nr" data-id="${esc(r._id)}" value="${esc(r.nrInreg || "")}" placeholder="nr. înregistrare" aria-label="Număr de înregistrare" style="width:150px;padding:6px 8px">
        </div>
      </div>
      <details><summary>Analiza și textul sesizării</summary>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">${r.analiza ? analysisHTML(r.analiza) : ""}
        <pre>${esc(r.text || "")}</pre>
        <div class="row"><button class="btn small" data-act="copy" data-id="${esc(r._id)}">Copiază textul</button>
        ${r.lat != null ? `<a class="btn small" href="https://www.google.com/maps?q=${r.lat},${r.lon}" target="_blank" rel="noopener">Google Maps</a>` : ""}
        <span class="inline-confirm" data-del="${esc(r._id)}"><button class="btn small danger" data-act="del" data-id="${esc(r._id)}">Șterge</button></span></div></div>
      </details></article>`;
  }).join("");
  box.querySelectorAll(".reg-card img").forEach(im => im.addEventListener("error", () => { const rec = S.records.find(x => "rec-" + x._id === im.closest("article").id); if (rec && rec.thumb && im.src !== rec.thumb) im.src = rec.thumb; }, { once: true }));
  if (PHOTO_URL) box.querySelectorAll("img[data-photo]").forEach(im => { if (im.dataset.photo) PHOTO_URL(im.dataset.photo).then(u => { if (u) im.src = u; }).catch(() => {}); });
  box.querySelectorAll("[data-act]").forEach(el => {
    const id = el.dataset.id, ref = () => cap.db.collection("sesizari").doc(id);
    if (el.dataset.act === "status") el.addEventListener("change", () => ref().update({ status: el.value }).catch(() => toast("Nu s-a putut actualiza.")));
    if (el.dataset.act === "nr") el.addEventListener("change", () => ref().update({ nrInreg: el.value.trim() }).catch(() => toast("Nu s-a putut actualiza.")));
    if (el.dataset.act === "copy") el.addEventListener("click", () => { const r = S.records.find(x => x._id === id); copy(r?.text || "", "Text copiat"); });
    if (el.dataset.act === "del") el.addEventListener("click", () => {
      const span = box.querySelector(`[data-del="${CSS.escape(id)}"]`);
      span.innerHTML = `Ștergi definitiv? <button class="btn small danger" data-yes>Da, șterge</button><button class="btn small" data-no>Nu</button>`;
      span.querySelector("[data-no]").onclick = () => renderRegistry();
      span.querySelector("[data-yes]").onclick = async () => {
        const r = S.records.find(x => x._id === id);
        try { await ref().delete(); if (r?.photoId && cap.assets) cap.assets.delete(r.photoId).catch(() => {}); toast("Șters"); } catch { toast("Nu s-a putut șterge."); }
      };
    });
  });
}
function highlight(id) { requestAnimationFrame(() => { const el = $("rec-" + id); if (el) { el.classList.add("hl"); el.scrollIntoView({ behavior: "smooth", block: "center" }); el.querySelector("details").open = true; setTimeout(() => el.classList.remove("hl"), 2500); } }); }

/* ---------- Pornire ---------- */
renderPickMap();
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { renderPickMap(); if (!$("view-harta").hidden) renderBigMap(); });
(async () => {
  if (!window.claude || !claude.use) { $("analysis").innerHTML = `<div class="note warn">Analiza și registrul funcționează doar când pagina e deschisă în claude.ai.</div>`; return; }
  const [sample, db, assets, user, downloads] = await Promise.all(["sample", "db", "assets", "user", "downloads"].map(n => claude.use(n).catch(() => null)));
  cap = { sample, db, assets, user, downloads, uid: null };
  if (user) { try { cap.uid = await user.id(); } catch {} }
  if (sample) { const lim = await sample.limits().catch(() => null); if (!lim || !lim.images) { cap.sample = null; $("analysis").innerHTML = `<div class="note warn">Această vizualizare nu poate trimite imagini către Claude. Deschide pagina în aplicația Claude sau pe claude.ai.</div>`; } }
  else $("analysis").innerHTML = `<div class="note warn">Analiza cu Claude nu e disponibilă în această vizualizare.</div>`;
  $("savePhoto").hidden = !downloads; $("exportBtn").hidden = !downloads;
  $("pwStep").hidden = !(user && user.changePassword);
  loadUsers();
  if (user && user.recovery && user.recovery()) { showView("profil"); setTimeout(() => { $("pwStep").scrollIntoView({ behavior: "smooth", block: "center" }); $("pw1").focus(); }, 300); toast("Alege parola nouă"); }
  fillProfile();
  updateButtons();
  if (db) {
    const timer = setTimeout(() => { if (!S.records.length) $("regList").innerHTML = `<div class="empty">Registrul nu răspunde încă. Verifică conexiunea.</div>`; }, 10000);
    db.collection("sesizari").orderBy("createdAt", "desc").onSnapshot(snap => {
      if (!snap.metadata.fromCache) clearTimeout(timer);
      S.records = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
      renderRegistry(); if (!$("view-harta").hidden) renderBigMap();
    }, () => { clearTimeout(timer); $("regList").innerHTML = `<div class="empty">Registrul nu e disponibil.</div>`; });
  }
  renderRegistry();
})();
})();
