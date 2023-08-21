import { Geometry } from "../getGeometryFromValueAndDuration";
import { Initiative } from "../getInitiativeRankFromNumberMinted";

export const geometryImages: Record<
	Geometry,
	Record<number, Record<string, string>>
> = {
	Dot: {
		1: {
			imageUrl:
				"https://bafybeib35idlxd3vt7k4ru752nqj5zzqqal2ffy7kvpa5hpwtirmjlqeru.ipfs.nftstorage.link/Dot_1.png",
			blurhash: "UCBoUO1G0+=X]o9?ohxE0g$f}?I;5;-VslI;",
		},
		2: {
			imageUrl:
				"https://bafybeiacgvm3wutfkn4srzp7ehrjj27qiyimg6l4mqvpiiljxqbauygzwa.ipfs.nftstorage.link/Dot_2.png",
			blurhash: "U49s;*~B000LER=_wt9uH=n$}[%21#EM^O~A",
		},
		3: {
			imageUrl:
				"https://bafybeifwrbsplyddknmkp3ksrgsq42hpnwj6ks7zdnly53b7rqr6swlr6q.ipfs.nftstorage.link/Dot_3.png",
			blurhash: "UBAvU[1s0{^8}b4-NF?J5mi^=dS%Bo-q$j9t",
		},
		4: {
			imageUrl:
				"https://bafybeie7gnssz6rofooxaiiyticoy7j5dm5eeob5fmzpjxalvqkv6jtja4.ipfs.nftstorage.link/Dot_4.png",
			blurhash: "UCCrpN^-0hIXEmb1j]xa000wt1=_^%NDE0sS",
		},
		5: {
			imageUrl:
				"https://bafybeia4koxockb7f44gtvl2a35q74a4rzsmgneaiudsgqimshbaywqpti.ipfs.nftstorage.link/Dot_5.png",
			blurhash: "UABV;R9|01}=zT9uks={9^R%^PNIF~%2=s57",
		},
		6: {
			imageUrl:
				"https://bafybeifrm4cu3eoafggqu7eu4evtyybh4k2omqrlvvwpv4pgwgd76jh5w4.ipfs.nftstorage.link/Dot_6.png",
			blurhash: "UFDl4%}[56Nf5mEMa0-U0e56rqxu^*$xt2OF",
		},
		7: {
			imageUrl:
				"https://bafybeidgxjs2tyxgc2al2jssyxhkw4qzqtsc52ueyx535skvjaky6u6lgu.ipfs.nftstorage.link/Dot_7.png",
			blurhash: "U59$;A01R.t1ExEJ=zax0O}?=v9z-B^50~OE",
		},
		8: {
			imageUrl:
				"https://bafybeicuhax46knbpqxsq5cdvizjf6exxtimpwo7np7aq2rejn2rq3jbs4.ipfs.nftstorage.link/Dot_8.png",
			blurhash: "UEBV#E5+0z}sx^pJR%nN0~=}=x56Ost7s;NG",
		},
		9: {
			imageUrl:
				"https://bafybeifaoihfme5zlyii7y7dnnb55mzyvice5gek2xc5so6i3ptnpjk3di.ipfs.nftstorage.link/Dot_9.png",
			blurhash: "U9BWA6Ki01vzn40K%M^*00Q,~CK6PC^*$%0L",
		},
		10: {
			imageUrl:
				"https://bafybeibav5dz444pltqakkexdh7gowcxflff5tqsg5w74yyozkl7qkkpru.ipfs.nftstorage.link/Dot_10.png",
			blurhash: "UAAv%?=L0KT20eJ7$f$*9sEKs*s8~C-VbcNI",
		},
		11: {
			imageUrl:
				"https://bafybeif2ot2qm3iko6aez4axqr7xzz6bws3c4cvzzk3iyxnl3u4fhlewfq.ipfs.nftstorage.link/Dot_11.png",
			blurhash: "UBAcPiKP0K#7-VEMNG-U01RP~AtS9[-V-U5R",
		},
		12: {
			imageUrl:
				"https://bafybeibncwpa4ww7g2aux3tqubgpoluzvvocui5hxpbetjkcwy3f5uyt5e.ipfs.nftstorage.link/Dot_12.png",
			blurhash: "UBA]N#2u1P}SKj%OSxNI0$-U^QAF,oEfbc%1",
		},
		13: {
			imageUrl:
				"https://bafybeigioyjghgxpkeg7eq7ppr4vulwwhc4nremvtvehhjrrjvmyzenc2u.ipfs.nftstorage.link/Dot_13.png",
			blurhash: "U58p[r=q00aT*K,nu4OaS@=z;lEJ3Bbe|uw=",
		},
		14: {
			imageUrl:
				"https://bafybeickitwu6wqouvncfh74kybnh7kwesmyzy2rcmf2q5hrmqvycduabq.ipfs.nftstorage.link/Dot_14.png",
			blurhash: "U9BfImEM0KxZX-o}I;IV00~A^Q4=t3s=juS1",
		},
		15: {
			imageUrl:
				"https://bafybeigkrvny3xg6nx6gnrzznah2fz66k3ld6lcqgkwu5psnrbq525auim.ipfs.nftstorage.link/Dot_15.png",
			blurhash: "UBBy8Vt-0#n5x^}]xH574:$i=|Nt+u9ZS1?H",
		},
		16: {
			imageUrl:
				"https://bafybeiejz32pzkkbpk4zskbessks7ompgcc7sa2zo3kavhec2abtpoten4.ipfs.nftstorage.link/Dot_16.png",
			blurhash: "U78|YS14RO}p;J9|xv$e0J-7#,9|1k^Or;5U",
		},
		17: {
			imageUrl:
				"https://bafybeid4vbce2iawxz5sp2olbor45caqpkgpvknjfc5c5vijdcax4nhd5y.ipfs.nftstorage.link/Dot_17.png",
			blurhash: "U68;ZA9X00-?qvE0%L-r9ZNf^NxYloxcm+IT",
		},
		18: {
			imageUrl:
				"https://bafybeihdbyouhwn72lfjp3uzo45l56laarsgfhfvfuubnsw5j4g4krmbxu.ipfs.nftstorage.link/Dot_18.png",
			blurhash: "U7B3Ni%M00IU2a-p=dE2Ey%3=xNG}uS$Om$1",
		},
		19: {
			imageUrl:
				"https://bafybeigkywv7a6rmlxekilsa5lv2367xsepg54xb4s25ucfwpyryctxz6q.ipfs.nftstorage.link/Dot_19.png",
			blurhash: "UDBDB4~X9E4TOXxawfaL00E1x]x]v}InXStl",
		},
		20: {
			imageUrl:
				"https://bafybeifrsg4djdudukzeyctzvy2pxako3toychfh3vc3ndovtcesr5wnmy.ipfs.nftstorage.link/Dot_20.png",
			blurhash: "UBB{7mAA0L^R-P%5NbIl0f=y}@5QIWng%1oi",
		},
	},
	Line: {
		1: {
			imageUrl:
				"https://bafybeiexm4mbbzo7sotbuixzdlznjbpdawrlrqqjthkrjez2rw4xllurta.ipfs.nftstorage.link/Line_1.png",
			blurhash: "U39Gw70f00}@7MxHH?$$00$j~qOE}H0y%g?G",
		},
		2: {
			imageUrl:
				"https://bafybeiakrqbwonzk4vgm5lpjehvyek674qlneegtacpfda7qc7gqsagkga.ipfs.nftstorage.link/Line_2.png",
			blurhash: "UBAJ1sNG0e={FLNxWAsm0K=y}[5RR*s.t7I:",
		},
		3: {
			imageUrl:
				"https://bafybeih2elwkxabm7u7oa32qym6im6zd43oslvodmevnipwbnumhh2pcfe.ipfs.nftstorage.link/Line_3.png",
			blurhash: "U8AcoVpI00q]kqOZRPZ#00rr~VX-m-Mxo~^,",
		},
		4: {
			imageUrl:
				"https://bafybeifgrwriocqdjo57jazah323aiaerowjvjr6xyyaok6ze52bztdjga.ipfs.nftstorage.link/Line_4.png",
			blurhash: "U8A9$#xb0KNat8?HofE100S5~DxXRiD$s;%g",
		},
		5: {
			imageUrl:
				"https://bafybeic7doxdhp6cqyhpsq45a7wla5c43767hxh52unybrda2cj5lol2r4.ipfs.nftstorage.link/Line_5.png",
			blurhash: "U7BMJdpx009E14R.^Oow008_~D^+^%kVaLIW",
		},
		6: {
			imageUrl:
				"https://bafybeiflesuo5ok4syx3i5r2i7mhxewdtr3ng5whvck5pta7erzcwebuxu.ipfs.nftstorage.link/Line_6.png",
			blurhash: "U8B2+T^k0Jjb5R5QwJ=y0w9t$*s9=|}[-p5Q",
		},
		7: {
			imageUrl:
				"https://bafybeig7boljqfve3rddhy4wlk2wjzzf3f46rldizpgoqtuzehnnerjasi.ipfs.nftstorage.link/Line_7.png",
			blurhash: "U6B3BB^%004r0|=x].EL56sr^Ps$$n9^S]}@",
		},
		8: {
			imageUrl:
				"https://bafybeidcf5hrwnhdwchph37w44vcl6bzjg4dpafvs4huotdypvjc75dmm4.ipfs.nftstorage.link/Line_8.png",
			blurhash: "U69ZyS%$00Q,AZt8w]M_0J=y~DE$^REMR*^P",
		},
		9: {
			imageUrl:
				"https://bafybeibbyof3gzhjmh3ijvmnpyaqryyz4uk2pzdfgp2qboziw2zvqs7a7a.ipfs.nftstorage.link/Line_9.png",
			blurhash: "UBBp9Ip{0dveJWIpI:$%4TDh=|%N%MtP-USQ",
		},
		10: {
			imageUrl:
				"https://bafybeiceer3hmqckyfzjzqzfndxqpp2rl57m7l25ixbgjrjaizmiopvovm.ipfs.nftstorage.link/Line_10.png",
			blurhash: "U87,_kXn0engwHXTbdi]0zjE}tS$XUxvs8In",
		},
		11: {
			imageUrl:
				"https://bafybeidtl5qfzqmfqc6aud62rxzf5rced46z3jrzny43li553naejxtuee.ipfs.nftstorage.link/Line_11.png",
			blurhash: "U9B3T-?b0JE4-??cXQIo0Jks~Dny0f9Z^k?G",
		},
		12: {
			imageUrl:
				"https://bafybeierw2gj6yfmlg2mznuv6ujfbi63xwvauqtp7dvnx7obycmim7t7dm.ipfs.nftstorage.link/Line_12.png",
			blurhash: "U9BM0]kW00RPBCxbRiIo0J$%}[I;={NHShxu",
		},
		13: {
			imageUrl:
				"https://bafybeiasjsnhox2mkt3en5tikplpdfv6lkpeldpebnj7l653coe6rb4jii.ipfs.nftstorage.link/Line_13.png",
			blurhash: "UBBCfZF{0J=YOq-oxHE30K-V~C9^$kE2aw^%",
		},
		14: {
			imageUrl:
				"https://bafybeigc7xzo2f6sn3uc55osylbyhhrr4lbrzi6vkavamozmvrwe5h4d2i.ipfs.nftstorage.link/Line_14.png",
			blurhash: "U6ATHBKi00,u9r%Nx_D~00oh?IjD%M9Fn3~X",
		},
		15: {
			imageUrl:
				"https://bafybeie46xhlc67fysrijaeqz7pm4cfzy7khbgqnlpvq65ioogfzngz53y.ipfs.nftstorage.link/Line_15.png",
			blurhash: "U4AS[E}[004.0g-V^QE1Mvs;^RxC119v=t}@",
		},
		16: {
			imageUrl:
				"https://bafybeiefimbtegzctajnslbvfffvd7qoi34nw3nya4efhmbjhg3sxdzkau.ipfs.nftstorage.link/Line_16.png",
			blurhash: "U87da.RP0Kx^xaX9Rjof0KWX~CadInV@xakD",
		},
		17: {
			imageUrl:
				"https://bafybeiedpbhw7jpcpchbwypeg7trq5i7npqjkfvlkdyyzggxlziihwupt4.ipfs.nftstorage.link/Line_17.png",
			blurhash: "U59P~A?b00DiAD-BNGI:4TnO~WOrTK%2={$j",
		},
		18: {
			imageUrl:
				"https://bafybeicuqtnewfedj4cp3dobtha4fpdqxlkuiqlredenlcsrhnt4iouara.ipfs.nftstorage.link/Line_18.png",
			blurhash: "U7AI}pk=0KrXFz-q-UE10J$l~CSv+[9tJD}[",
		},
		19: {
			imageUrl:
				"https://bafybeih2mx3zyls5kyqlqf2rjj5mxc4baevf2zxyf7we3hzlwpowrxhzfq.ipfs.nftstorage.link/Line_19.png",
			blurhash: "U9A+{otm00zo-=9^D~v#0JRO~BksVDrr%gt,",
		},
		20: {
			imageUrl:
				"https://bafybeife5bycefhnpfngmi6qubhbpf6lhyvmqz7bj3h4xsp3v33ptlcnhu.ipfs.nftstorage.link/Line_20.png",
			blurhash: "U9B2cK$f0gM}$ekVR+M}0gR.}qs.NzE2kC=_",
		},
	},
	Triangle: {
		1: {
			imageUrl:
				"https://bafybeif5jcoylbmbj2qel53rtpgtylr26bn7gx2thltq2rljlkmgpzcacy.ipfs.nftstorage.link/Triangle_1.png",
			blurhash: "U77B.N_3ZPVs~W?us:rEq_xt%L-VR%mm-V?[",
		},
		2: {
			imageUrl:
				"https://bafybeidmi4mldw4famcsrdhlzo6zju4np6rowbgkauw74dogblqgqxktfe.ipfs.nftstorage.link/Triangle_2.png",
			blurhash: "U7A0UcKj01=}-q0xRO}[0KZ$}?J-NF-p-q5S",
		},
		3: {
			imageUrl:
				"https://bafybeifn7e6e6hglekzfu6o6f7z6kdnhcsabqzsyk5d5pqyyqjwpf3hnbe.ipfs.nftstorage.link/Triangle_3.png",
			blurhash: "UCBo],5O0J}]G0RhMv%34m$+xuELr.n+?IEL",
		},
		4: {
			imageUrl:
				"https://bafybeibifyl2ab52vq5btxwc6cwxbehpub45fg6rjvekk3zychafk66p4a.ipfs.nftstorage.link/Triangle_4.png",
			blurhash: "U5AS}Y={00Fy10,=}qTIHqtk^,rWR%TKXn#8",
		},
		5: {
			imageUrl:
				"https://bafybeialkbjsuff6667vbnpwds22ofgv5qsgxgxew5a3drnhb7ezpt34iy.ipfs.nftstorage.link/Triangle_5.png",
			blurhash: "UDDR+{~BM{RkX.-VwIn%0057EMjFI99uEN9u",
		},
		6: {
			imageUrl:
				"https://bafybeibmsgwejoumi6ulqeznxbgvksby5gahsarg4ujzio5wecuze5qkpe.ipfs.nftstorage.link/Triangle_6.png",
			blurhash: "U9Al|bFy0L^O?G0zMy^P0KVs}@J.IB={-:0#",
		},
		7: {
			imageUrl:
				"https://bafybeibpoj5mmzkz6bdlcndixhas2xu6bjqbdx5tfbu3cymjmo2sib4ovy.ipfs.nftstorage.link/Triangle_7.png",
			blurhash: "UHC$WX~BoZ$%J;X8rqs90L4:D+IrX4M{o#xu",
		},
		8: {
			imageUrl:
				"https://bafybeigchaj7jh2nmp762fai6spi3uhvv7sydrljazjg2expdj3udlfivy.ipfs.nftstorage.link/Triangle_8.png",
			blurhash: "U59?UyEf00^70.NF}l$,53e,^mOY-hj^IwNY",
		},
		9: {
			imageUrl:
				"https://bafybeieyjqczmnvjw2xnjwlw7ywhoir3cvg4f2iry2sslwa2evydetzi54.ipfs.nftstorage.link/Triangle_9.png",
			blurhash: "U68}J2~oQVR5~T%xobnQHuoxyV%2oua1%L.6",
		},
		10: {
			imageUrl:
				"https://bafybeige4pmdsmfq5tefbnmevqxqsvefv3lwo5cuzz66ekgw55jfeotxt4.ipfs.nftstorage.link/Triangle_10.png",
			blurhash: "UAB3KQ9[0N-p}]0eRP?H9$NF^hItbc-:-V0M",
		},
		11: {
			imageUrl:
				"https://bafybeibdm5pa5fxm5ufbwahndet33uyqpq33smhly2it427h35pzfmqrcy.ipfs.nftstorage.link/Triangle_11.png",
			blurhash: "UBBfO;5p00}=tSEKv}%M4.s7^Q9~58-p-n56",
		},
		12: {
			imageUrl:
				"https://bafybeifvemydc6xcu7ce4k2cytkhhrhwej6a5i3a3eiqyocxsjwnz5zo6i.ipfs.nftstorage.link/Triangle_12.png",
			blurhash: "U38q1[cZ00Z*_NS^H?m:009a~7=^DhDj%g?u",
		},
		13: {
			imageUrl:
				"https://bafybeihj3baq45s2bzu6youd3loesd6audzmatxks5bidt7qmzbcooqli4.ipfs.nftstorage.link/Triangle_13.png",
			blurhash: "UFC~uV-=MwwI5rR-WV-V4TIAS#tR}.n}InR-",
		},
		14: {
			imageUrl:
				"https://bafybeifyacamqpdca4bm47hvmfq3dambfdgrzvpgpsg3qyxetx7uilvdyy.ipfs.nftstorage.link/Triangle_14.png",
			blurhash: "UDC=lNS}00wN5YsAxTNe0Jwg^lEy~RozIdjE",
		},
		15: {
			imageUrl:
				"https://bafybeibc2whoi4tzzjpxj7kxc7lj2bfaef5noyq4arnydmxu4qablsbilu.ipfs.nftstorage.link/Triangle_15.png",
			blurhash: "U7AAwJ*000DiOtxE#jIU00Z$={oxxub_%hx]",
		},
		16: {
			imageUrl:
				"https://bafybeibh2fx2cuolmjf45nddk2jfibphur6mhs3iyo4ouruvnye5re4edm.ipfs.nftstorage.link/Triangle_16.png",
			blurhash: "U68Wv~0xIAyG}[5Prro#DiNx$*i^I8x^t8D~",
		},
		17: {
			imageUrl:
				"https://bafybeib6xi3jq6q7bz375lb7gmwmxz55tcoec6ehtcziphg6ylua55xuje.ipfs.nftstorage.link/Triangle_17.png",
			blurhash: "U8A^F4T{00VYE2,?xUJ700-W^+I.~BKPbes9",
		},
		18: {
			imageUrl:
				"https://bafybeiahmpz2qgn42lzcjr6wppipkot4fm5ivx2feiilbzjdox2qonv6nq.ipfs.nftstorage.link/Triangle_18.png",
			blurhash: "UDD+A6Ez00=e6AI:#Q-B0JV@?Hbu},wwOaJR",
		},
		19: {
			imageUrl:
				"https://bafybeid2tdvurzhj3jngrubk3wakfqhunppsu3nshdojme5txfxqkqiksu.ipfs.nftstorage.link/Triangle_19.png",
			blurhash: "UFA^LK~DH@D*#9-VxuR-tmR%R4jE9[EeoaxD",
		},
		20: {
			imageUrl:
				"https://bafybeiaae52g5fznkbkzhazdddfu7x4ukt47blmrjyagtpz5pvgrxxqf6y.ipfs.nftstorage.link/Triangle_20.png",
			blurhash: "U5Al@MJi00^R1PEM}S-V-R9a58o}9Z$O-oK3",
		},
	},
	Diamond: {
		1: {
			imageUrl:
				"https://bafybeidmfe5qwit7n7gustjmo4haybuzu3hl7pk45zlwd2baigfqcuh4l4.ipfs.nftstorage.link/Diamond_1.png",
			blurhash: "U7Bf@V004T-?z;0L-T$+VC9u~XIo?baL_30K",
		},
		2: {
			imageUrl:
				"https://bafybeigaceyz4tg4yam7yahti47epfomhcg3iuaulvcho2y6ipcapsmt4i.ipfs.nftstorage.link/Diamond_2.png",
			blurhash: "UDCP|;~B00FfS7r=#jS58_9ZOX%ME+9ZRk-:",
		},
		3: {
			imageUrl:
				"https://bafybeiabuzdkgm2ly4wtknghol6uw3oapkjwudxrmrsex72ondieduj47y.ipfs.nftstorage.link/Diamond_3.png",
			blurhash: "UEBVx39[D%%3~C0ejD=}ni9t={t8%2oz-V9u",
		},
		4: {
			imageUrl:
				"https://bafybeiawqabq2es5p3ni63lbbf6powfq3cohcpkpskxu72ptv4jnrreejy.ipfs.nftstorage.link/Diamond_4.png",
			blurhash: "UG9jfw~CvyRh=z=z-Vxs=G-W-qt6emr?%2%2",
		},
		5: {
			imageUrl:
				"https://bafybeiftoljuds7thijj4is2okx2w4gd3jmbnqpyq6irzagxkharjco7f4.ipfs.nftstorage.link/Diamond_5.png",
			blurhash: "UCCFuA0fivt7pdEL#+WX00?GIoM{H=}[9uWA",
		},
		6: {
			imageUrl:
				"https://bafybeihnesyaa3pjdurgrvelhri5mndhgwzbbu2crztrwd6jd63r5lla7i.ipfs.nftstorage.link/Diamond_6.png",
			blurhash: "UGBD4]9]Imn5}[4-xW%4nM9Z-qtS%gXAxaE1",
		},
		7: {
			imageUrl:
				"https://bafybeigqnbldwcgfkm2xsqz5ghlt6c2vhduhmchedsxt2egtuhxolzvey4.ipfs.nftstorage.link/Diamond_7.png",
			blurhash: "UHBy~z~qRiaKVswb$exFH;v}-Vxt~V?H%g-p",
		},
		8: {
			imageUrl:
				"https://bafybeie6jtgz22k43hhwnxtyjkgmmlqg6mnvac67wqdlivcp3ixbldlae4.ipfs.nftstorage.link/Diamond_8.png",
			blurhash: "U6ATNK00-Voh^95%;_9brE0f~BE1~V0f_4M_",
		},
		9: {
			imageUrl:
				"https://bafybeic7lhtgxy4udey7bjk4vzgcpgqzyeuqceuvidmanzqy35jcuq6puq.ipfs.nftstorage.link/Diamond_9.png",
			blurhash: "UB9?|IBADhw~}]0ynM-qq[9t-okD#*tS-q9Z",
		},
		10: {
			imageUrl:
				"https://bafybeicnclzqr4mfmd25brb5msmnupbq2sfb73eafcsz2qsgt4k5ca7e34.ipfs.nftstorage.link/Diamond_10.png",
			blurhash: "UFCYtI5pM^r^}[0ewu-qv}9Z={R:xaxu-p0g",
		},
		11: {
			imageUrl:
				"https://bafybeifi5c4q773ozyr2ghf4esgn75sz6lxsgo2xmvqncrykmxjruykuja.ipfs.nftstorage.link/Diamond_11.png",
			blurhash: "U59aN:I900?cK7_4veOZ9Yx]?wIT$$R.TKR4",
		},
		12: {
			imageUrl:
				"https://bafybeicthnk7g24uizkaur5x4v2b6u4jkxosapiquaeydovialdh5rtjtq.ipfs.nftstorage.link/Diamond_12.png",
			blurhash: "UBAcxm5l9a-V}@9tjE%2M|Na$fsAs;S2xFkD",
		},
		13: {
			imageUrl:
				"https://bafybeietxhjdbkgtwaulkp7lfbm7jo6zgv73lcp3lkusbqelp3pfaftu2e.ipfs.nftstorage.link/Diamond_13.png",
			blurhash: "U9A0,x?aMcVC?G~WxGD*Mv%3nOR.ib9Dp0%g",
		},
		14: {
			imageUrl:
				"https://bafybeibcvs5hrn77vms7qy3tclnfdkqxgbshi5h5cgfynelkmdmdp7hvqm.ipfs.nftstorage.link/Diamond_14.png",
			blurhash: "UFA,,-_49FDhMIv}%Lo}H?rq-Ut7~W-;gObJ",
		},
		15: {
			imageUrl:
				"https://bafybeic2brmrptc76d74tpxobq6ewtljdtwdrglggbu6ds6diuipumdtei.ipfs.nftstorage.link/Diamond_15.png",
			blurhash: "U8A19h}[U[RhvM^Q^*$~[l~X_4n$_2,nv}-q",
		},
		16: {
			imageUrl:
				"https://bafybeiczbdkmpesvstp6eqsnsanr2eyqcvcaqafavw3pllqyvn3yyukptu.ipfs.nftstorage.link/Diamond_16.png",
			blurhash: "U58q1_5PD#=#}^00t7~DQ+D%-=S}b:^,%30J",
		},
		17: {
			imageUrl:
				"https://bafybeia5yaqsaei4tntegys3j7y4uhr7sobehafuyj3ypj2bntnyq6zvna.ipfs.nftstorage.link/Diamond_17.png",
			blurhash: "UBAA8t57D%-p~C55V@%MeTRis=R-n.SzxuR.",
		},
		18: {
			imageUrl:
				"https://bafybeieve2ryn3q4i6uc5b5gikwqhj7fjln5k77x7kuoe5yfwvacikgafi.ipfs.nftstorage.link/Diamond_18.png",
			blurhash: "U4AT=@^Q009~009F^Ot5+DNELNIT-ps+.TM{",
		},
		19: {
			imageUrl:
				"https://bafybeihnekdio5r4ensletls3onohqzrav7lxxnpuoiq4el6vyzzo5cqn4.ipfs.nftstorage.link/Diamond_19.png",
			blurhash: "UDA^B}_4wcrpkt-q$*xC8wv#xa%3;Krqxu%N",
		},
		20: {
			imageUrl:
				"https://bafybeialbscie2rdvu2vucyf22ohtcxo5u2ltuvrk2wyygeygztgvdqe5i.ipfs.nftstorage.link/Diamond_20.png",
			blurhash: "UAAA2c5;IT-C}s0daK%Nn4IoxbS1oztSxvIo",
		},
	},
};

export const initiativeImages: Record<Initiative, Record<string, string>> = {
	Trailblazer: {
		imageUrl:
			"https://bafybeiczueqxc2jqczxh2ttpfnwvs7f4uzslwp2a2fuvdmt24dwagiryj4.ipfs.nftstorage.link/Trailblazer.png",
		blurhash: "UVAc3nE2K5ax}@IVOYax^iIoOEay={M|OEay",
	},
	Pioneer: {
		imageUrl:
			"https://bafybeidne4btrznmrvbaizgxdo3tsa6flek5d6c6lip5ifosqdhg5xaeme.ipfs.nftstorage.link/Pioneer.png",
		blurhash: "UJ8D:+9Ibc${~S9Ibc${^~9bbJxo^$D+bJxV",
	},
	Alpha: {
		imageUrl:
			"https://bafybeic34ce6v2eqqku6d5z2e6urmdzxfgd7dn7sbpmpgqiqj2hczjxzhu.ipfs.nftstorage.link/Alpha.png",
		blurhash: "UJ8Nqb4nxuxu~q4nxuxu_39Fxuxu?bD%t7t7",
	},
	Early: {
		imageUrl:
			"https://bafybeigzkjwdqjvcdzxybezknwvm5cb2ascsvsfb74mpzhketzxdowt4ae.ipfs.nftstorage.link/Early.png",
		blurhash: "UJ84JZ4-xuxb~X4-xuxb^,9Yxbxb?ID%t7t7",
	},
	Normie: {
		imageUrl:
			"https://bafybeic673ht7f6qc7rv7rlyctjmtth56rlmx3t2ed3zsm3visnygh6qea.ipfs.nftstorage.link/Normie.png",
		blurhash: "UL8z.G4nof%M~q4nof%M_39Fofxu?bD%ofxu",
	},
};
