---
slug: material-colour-pallette
date: 2016-11-29
title: "Material colour pallette"
---
This is more for my own future reference and noodling with.

I converted it from the aco file with https://github.com/websemantics/Color-Palette-Toolkit
<style>
.box {
  width: 128px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 6px #CCC;
  border-radius: 5px;
  display: inline-block;
  margin: 10px;
}

.box h1 {
  font-weight: 400;
  font-size: 14px;
  color: #494A4A;
  display: block;
  padding: 55px 0px 5px 5px;
  margin: 0px;
}

.box p {
  font-weight: 300;
  font-size: 11px;
  color: #999999;
  display: block;
  padding: 0px 0px 5px 5px;
  margin: 0px;
}

.color-full {
  width: 128px;
  height: 50px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: block;
  float: left;
}

.color-left {
  width: 64px;
  height: 50px;
  border-top-left-radius: 5px;
  display: block;
  float: left;
}

.color-right {
  width: 64px;
  height: 50px;
  border-top-right-radius: 5px;
  display: block;
  float: left;
}

.color-third-left {
  width: 42px;
  height: 50px;
  border-top-left-radius: 5px;
  display: block;
  float: left;
}

.color-third-middle {
  width: 44px;
  height: 50px;
  display: block;
  float: left;
}

.color-third-right {
  width: 42px;
  height: 50px;
  border-top-right-radius: 5px;
  display: block;
  float: left;
}

.color-pomegranate {
  background-color: #f44336;
}

.color-lavender-blush {
  background-color: #ffebee;
}

.color-pastel-pink {
  background-color: #ffcdd2;
}

.color-sea-pink {
  background-color: #ef9a9a;
}

.color-sunglo {
  background-color: #e57373;
}

.color-burnt-sienna {
  background-color: #ef5350;
}

.color-cinnabar {
  background-color: #e53935;
}

.color-persian-red {
  background-color: #d32f2f;
}

.color-tall-poppy {
  background-color: #c62828;
}

.color-thunderbird {
  background-color: #b71c1c;
}

.color-vivid-tangerine {
  background-color: #ff8a80;
}

.color-sunset-orange {
  background-color: #ff5252;
}

.color-torch-red {
  background-color: #ff1744;
}

.color-guardsman-red {
  background-color: #d50000;
}

.color-amaranth {
  background-color: #e91e63;
}

.color-wisp-pink {
  background-color: #fce4ec;
}

.color-chantilly {
  background-color: #f8bbd0;
}

.color-mauvelous {
  background-color: #f48fb1;
}

.color-froly {
  background-color: #f06292;
}

.color-french-rose {
  background-color: #ec407a;
}

.color-amaranth {
  background-color: #d81b60;
}

.color-maroon-flush {
  background-color: #c2185b;
}

.color-jazzberry-jam {
  background-color: #ad1457;
}

.color-rose-bud-cherry {
  background-color: #880e4f;
}

.color-tickle-me-pink {
  background-color: #ff80ab;
}

.color-wild-strawberry {
  background-color: #ff4081;
}

.color-razzmatazz {
  background-color: #f50057;
}

.color-red-violet {
  background-color: #c51162;
}

.color-seance {
  background-color: #9c27b0;
}

.color-snuff {
  background-color: #f3e5f5;
}

.color-french-lilac {
  background-color: #e1bee7;
}

.color-light-wisteria {
  background-color: #ce93d8;
}

.color-amethyst {
  background-color: #ba68c8;
}

.color-amethyst {
  background-color: #ab47bc;
}

.color-seance {
  background-color: #8e24aa;
}

.color-seance {
  background-color: #7b1fa2;
}

.color-seance {
  background-color: #6a1b9a;
}

.color-persian-indigo {
  background-color: #4a148c;
}

.color-heliotrope {
  background-color: #ea80fc;
}

.color-heliotrope {
  background-color: #e040fb;
}

.color-electric-violet {
  background-color: #d500f9;
}

.color-electric-violet {
  background-color: #aa00ff;
}

.color-purple-heart {
  background-color: #673ab7;
}

.color-white-lilac {
  background-color: #ede7f6;
}

.color-prelude {
  background-color: #d1c4e9;
}

.color-cold-purple {
  background-color: #b39ddb;
}

.color-lilac-bush {
  background-color: #9575cd;
}

.color-fuchsia-blue {
  background-color: #7e57c2;
}

.color-purple-heart {
  background-color: #5e35b1;
}

.color-daisy-bush {
  background-color: #512da8;
}

.color-daisy-bush {
  background-color: #4527a0;
}

.color-jacksons-purple {
  background-color: #311b92;
}

.color-heliotrope {
  background-color: #b388ff;
}

.color-electric-violet {
  background-color: #7c4dff;
}

.color-electric-violet {
  background-color: #651fff;
}

.color-electric-violet {
  background-color: #6200ea;
}

.color-san-marino {
  background-color: #3f51b5;
}

.color-white-lilac {
  background-color: #e8eaf6;
}

.color-periwinkle-gray {
  background-color: #c5cae9;
}

.color-cold-purple {
  background-color: #9fa8da;
}

.color-moody-blue {
  background-color: #7986cb;
}

.color-indigo {
  background-color: #5c6bc0;
}

.color-sapphire {
  background-color: #3949ab;
}

.color-sapphire {
  background-color: #303f9f;
}

.color-bay-of-many {
  background-color: #283593;
}

.color-jacksons-purple {
  background-color: #1a237e;
}

.color-malibu {
  background-color: #8c9eff;
}

.color-dodger-blue {
  background-color: #536dfe;
}

.color-dodger-blue {
  background-color: #3d5afe;
}

.color-blue-ribbon {
  background-color: #304ffe;
}

.color-dodger-blue {
  background-color: #2196f3;
}

.color-hawkes-blue {
  background-color: #e3f2fd;
}

.color-sail {
  background-color: #bbdefb;
}

.color-malibu {
  background-color: #90caf9;
}

.color-malibu {
  background-color: #64b5f6;
}

.color-picton-blue {
  background-color: #42a5f5;
}

.color-curious-blue {
  background-color: #1e88e5;
}

.color-denim {
  background-color: #1976d2;
}

.color-denim {
  background-color: #1565c0;
}

.color-tory-blue {
  background-color: #0d47a1;
}

.color-malibu {
  background-color: #82b1ff;
}

.color-dodger-blue {
  background-color: #448aff;
}

.color-dodger-blue {
  background-color: #2979ff;
}

.color-dodger-blue {
  background-color: #2962ff;
}

.color-cerulean {
  background-color: #03a9f4;
}

.color-pattens-blue {
  background-color: #e1f5fe;
}

.color-french-pass {
  background-color: #b3e5fc;
}

.color-malibu {
  background-color: #81d4fa;
}

.color-picton-blue {
  background-color: #4fc3f7;
}

.color-dodger-blue {
  background-color: #29b6f6;
}

.color-cerulean {
  background-color: #039be5;
}

.color-lochmara {
  background-color: #0288d1;
}

.color-lochmara {
  background-color: #0277bd;
}

.color-bahama-blue {
  background-color: #01579b;
}

.color-anakiwa {
  background-color: #80d8ff;
}

.color-dodger-blue {
  background-color: #40c4ff;
}

.color-dodger-blue {
  background-color: #00b0ff;
}

.color-azure-radiance {
  background-color: #0091ea;
}

.color-robins-egg-blue {
  background-color: #00bcd4;
}

.color-white-ice {
  background-color: #e0f7fa;
}

.color-blizzard-blue {
  background-color: #b2ebf2;
}

.color-spray {
  background-color: #80deea;
}

.color-turquoise-blue {
  background-color: #4dd0e1;
}

.color-scooter {
  background-color: #26c6da;
}

.color-pacific-blue {
  background-color: #00acc1;
}

.color-bondi-blue {
  background-color: #0097a7;
}

.color-blue-lagoon {
  background-color: #00838f;
}

.color-blue-stone {
  background-color: #006064;
}

.color-anakiwa {
  background-color: #84ffff;
}

.color-cyan-/-aqua {
  background-color: #18ffff;
}

.color-cyan-/-aqua {
  background-color: #00e5ff;
}

.color-cerulean {
  background-color: #00b8d4;
}

.color-persian-green {
  background-color: #009688;
}

.color-aqua-squeeze {
  background-color: #e0f2f1;
}

.color-aqua-island {
  background-color: #b2dfdb;
}

.color-monte-carlo {
  background-color: #80cbc4;
}

.color-fountain-blue {
  background-color: #4db6ac;
}

.color-jungle-green {
  background-color: #26a69a;
}

.color-teal {
  background-color: #00897b;
}

.color-pine-green {
  background-color: #00796b;
}

.color-tropical-rain-forest {
  background-color: #00695c;
}

.color-aqua-deep {
  background-color: #004d40;
}

.color-aero-blue {
  background-color: #a7ffeb;
}

.color-aquamarine {
  background-color: #64ffda;
}

.color-java {
  background-color: #1de9b6;
}

.color-caribbean-green {
  background-color: #00bfa5;
}

.color-fruit-salad {
  background-color: #4caf50;
}

.color-panache {
  background-color: #e8f5e9;
}

.color-zanah {
  background-color: #c8e6c9;
}

.color-moss-green {
  background-color: #a5d6a7;
}

.color-de-york {
  background-color: #81c784;
}

.color-fern {
  background-color: #66bb6a;
}

.color-apple {
  background-color: #43a047;
}

.color-apple {
  background-color: #388e3c;
}

.color-sea-green {
  background-color: #2e7d32;
}

.color-parsley {
  background-color: #1b5e20;
}

.color-magic-mint {
  background-color: #b9f6ca;
}

.color-turquoise-blue {
  background-color: #69f0ae;
}

.color-spring-green {
  background-color: #00e676;
}

.color-malachite {
  background-color: #00c853;
}

.color-sushi {
  background-color: #8bc34a;
}

.color-loafer {
  background-color: #f1f8e9;
}

.color-chrome-white {
  background-color: #dcedc8;
}

.color-deco {
  background-color: #c5e1a5;
}

.color-feijoa {
  background-color: #aed581;
}

.color-celery {
  background-color: #9ccc65;
}

.color-sushi {
  background-color: #7cb342;
}

.color-apple {
  background-color: #689f38;
}

.color-apple {
  background-color: #558b2f;
}

.color-dell {
  background-color: #33691e;
}

.color-reef {
  background-color: #ccff90;
}

.color-green-yellow {
  background-color: #b2ff59;
}

.color-chartreuse {
  background-color: #76ff03;
}

.color-lima {
  background-color: #64dd17;
}

.color-pear {
  background-color: #cddc39;
}

.color-coconut-cream {
  background-color: #f9fbe7;
}

.color-tusk {
  background-color: #f0f4c3;
}

.color-primrose {
  background-color: #e6ee9c;
}

.color-manz {
  background-color: #dce775;
}

.color-wattle {
  background-color: #d4e157;
}

.color-earls-green {
  background-color: #c0ca33;
}

.color-lemon-ginger {
  background-color: #afb42b;
}

.color-lemon-ginger {
  background-color: #9e9d24;
}

.color-trendy-green {
  background-color: #827717;
}

.color-dolly {
  background-color: #f4ff81;
}

.color-golden-fizz {
  background-color: #eeff41;
}

.color-electric-lime {
  background-color: #c6ff00;
}

.color-lime {
  background-color: #aeea00;
}

.color-gorse {
  background-color: #ffeb3b;
}

.color-travertine {
  background-color: #fffde7;
}

.color-lemon-chiffon {
  background-color: #fff9c4;
}

.color-picasso {
  background-color: #fff59d;
}

.color-paris-daisy {
  background-color: #fff176;
}

.color-gorse {
  background-color: #ffee58;
}

.color-bright-sun {
  background-color: #fdd835;
}

.color-lightning-yellow {
  background-color: #fbc02d;
}

.color-sea-buckthorn {
  background-color: #f9a825;
}

.color-ecstasy {
  background-color: #f57f17;
}

.color-dolly {
  background-color: #ffff8d;
}

.color-yellow {
  background-color: #ffff00;
}

.color-turbo {
  background-color: #ffea00;
}

.color-gold {
  background-color: #ffd600;
}

.color-amber {
  background-color: #ffc107;
}

.color-gin-fizz {
  background-color: #fff8e1;
}

.color-buttermilk {
  background-color: #ffecb3;
}

.color-salomie {
  background-color: #ffe082;
}

.color-mustard {
  background-color: #ffd54f;
}

.color-sunglow {
  background-color: #ffca28;
}

.color-selective-yellow {
  background-color: #ffb300;
}

.color-orange-peel {
  background-color: #ffa000;
}

.color-pizazz {
  background-color: #ff8f00;
}

.color-blaze-orange {
  background-color: #ff6f00;
}

.color-kournikova {
  background-color: #ffe57f;
}

.color-bright-sun {
  background-color: #ffd740;
}

.color-amber {
  background-color: #ffc400;
}

.color-web-orange {
  background-color: #ffab00;
}

.color-pizazz {
  background-color: #ff9800;
}

.color-sazerac {
  background-color: #fff3e0;
}

.color-frangipani {
  background-color: #ffe0b2;
}

.color-chardonnay {
  background-color: #ffcc80;
}

.color-texas-rose {
  background-color: #ffb74d;
}

.color-sunshade {
  background-color: #ffa726;
}

.color-pizazz {
  background-color: #fb8c00;
}

.color-gold-drop {
  background-color: #f57c00;
}

.color-clementine {
  background-color: #ef6c00;
}

.color-trinidad {
  background-color: #e65100;
}

.color-grandis {
  background-color: #ffd180;
}

.color-yellow-orange {
  background-color: #ffab40;
}

.color-pizazz {
  background-color: #ff9100;
}

.color-blaze-orange {
  background-color: #ff6d00;
}

.color-orange {
  background-color: #ff5722;
}

.color-linen {
  background-color: #fbe9e7;
}

.color-romantic {
  background-color: #ffccbc;
}

.color-mona-lisa {
  background-color: #ffab91;
}

.color-salmon {
  background-color: #ff8a65;
}

.color-burning-orange {
  background-color: #ff7043;
}

.color-pomegranate {
  background-color: #f4511e;
}

.color-cinnabar {
  background-color: #e64a19;
}

.color-tia-maria {
  background-color: #d84315;
}

.color-tia-maria {
  background-color: #bf360c;
}

.color-vivid-tangerine {
  background-color: #ff9e80;
}

.color-burning-orange {
  background-color: #ff6e40;
}

.color-vermilion {
  background-color: #ff3d00;
}

.color-grenadier {
  background-color: #dd2c00;
}

.color-silver-chalice {
  background-color: #9e9e9e;
}

.color-alabaster {
  background-color: #fafafa;
}

.color-wild-sand {
  background-color: #f5f5f5;
}

.color-gallery {
  background-color: #eeeeee;
}

.color-alto {
  background-color: #e0e0e0;
}

.color-silver {
  background-color: #bdbdbd;
}

.color-boulder {
  background-color: #757575;
}

.color-dove-gray {
  background-color: #616161;
}

.color-tundora {
  background-color: #424242;
}

.color-mine-shaft {
  background-color: #212121;
}

.color-lynch {
  background-color: #607d8b;
}

.color-porcelain {
  background-color: #eceff1;
}

.color-geyser {
  background-color: #cfd8dc;
}

.color-tower-gray {
  background-color: #b0bec5;
}

.color-gull-gray {
  background-color: #90a4ae;
}

.color-regent-gray {
  background-color: #78909c;
}

.color-cutty-sark {
  background-color: #546e7a;
}

.color-fiord {
  background-color: #455a64;
}

.color-limed-spruce {
  background-color: #37474f;
}

.color-outer-space {
  background-color: #263238;
}

.color-roman-coffee {
  background-color: #795548;
}

.color-ebb {
  background-color: #efebe9;
}

.color-swirl {
  background-color: #d7ccc8;
}

.color-silk {
  background-color: #bcaaa4;
}

.color-pharlap {
  background-color: #a1887f;
}

.color-cement {
  background-color: #8d6e63;
}

.color-kabul {
  background-color: #6d4c41;
}

.color-millbrook {
  background-color: #5d4037;
}

.color-rock {
  background-color: #4e342e;
}

.color-english-walnut {
  background-color: #3e2723;
}

.color-black {
  background-color: #000000;
}

.color-white {
  background-color: #ffffff;
}
</style>
<section class="box">
    <section class="color-full color-pomegranate"></section>
    <h1>Pomegranate</h1>
    <p>#f44336</p>
</section>

<section class="box">
    <section class="color-full color-lavender-blush"></section>
    <h1>Lavender blush</h1>
    <p>#ffebee</p>
</section>

<section class="box">
    <section class="color-full color-pastel-pink"></section>
    <h1>Pastel Pink</h1>
    <p>#ffcdd2</p>
</section>

<section class="box">
    <section class="color-full color-sea-pink"></section>
    <h1>Sea Pink</h1>
    <p>#ef9a9a</p>
</section>

<section class="box">
    <section class="color-full color-sunglo"></section>
    <h1>Sunglo</h1>
    <p>#e57373</p>
</section>

<section class="box">
    <section class="color-full color-burnt-sienna"></section>
    <h1>Burnt Sienna</h1>
    <p>#ef5350</p>
</section>

<section class="box">
    <section class="color-full color-cinnabar"></section>
    <h1>Cinnabar</h1>
    <p>#e53935</p>
</section>

<section class="box">
    <section class="color-full color-persian-red"></section>
    <h1>Persian Red</h1>
    <p>#d32f2f</p>
</section>

<section class="box">
    <section class="color-full color-tall-poppy"></section>
    <h1>Tall Poppy</h1>
    <p>#c62828</p>
</section>

<section class="box">
    <section class="color-full color-thunderbird"></section>
    <h1>Thunderbird</h1>
    <p>#b71c1c</p>
</section>

<section class="box">
    <section class="color-full color-vivid-tangerine"></section>
    <h1>Vivid Tangerine</h1>
    <p>#ff8a80</p>
</section>

<section class="box">
    <section class="color-full color-sunset-orange"></section>
    <h1>Sunset Orange</h1>
    <p>#ff5252</p>
</section>

<section class="box">
    <section class="color-full color-torch-red"></section>
    <h1>Torch Red</h1>
    <p>#ff1744</p>
</section>

<section class="box">
    <section class="color-full color-guardsman-red"></section>
    <h1>Guardsman Red</h1>
    <p>#d50000</p>
</section>

<section class="box">
    <section class="color-full color-amaranth"></section>
    <h1>Amaranth</h1>
    <p>#e91e63</p>
</section>

<section class="box">
    <section class="color-full color-wisp-pink"></section>
    <h1>Wisp Pink</h1>
    <p>#fce4ec</p>
</section>

<section class="box">
    <section class="color-full color-chantilly"></section>
    <h1>Chantilly</h1>
    <p>#f8bbd0</p>
</section>

<section class="box">
    <section class="color-full color-mauvelous"></section>
    <h1>Mauvelous</h1>
    <p>#f48fb1</p>
</section>

<section class="box">
    <section class="color-full color-froly"></section>
    <h1>Froly</h1>
    <p>#f06292</p>
</section>

<section class="box">
    <section class="color-full color-french-rose"></section>
    <h1>French Rose</h1>
    <p>#ec407a</p>
</section>

<section class="box">
    <section class="color-full color-amaranth"></section>
    <h1>Amaranth</h1>
    <p>#d81b60</p>
</section>

<section class="box">
    <section class="color-full color-maroon-flush"></section>
    <h1>Maroon Flush</h1>
    <p>#c2185b</p>
</section>

<section class="box">
    <section class="color-full color-jazzberry-jam"></section>
    <h1>Jazzberry Jam</h1>
    <p>#ad1457</p>
</section>

<section class="box">
    <section class="color-full color-rose-bud-cherry"></section>
    <h1>Rose Bud Cherry</h1>
    <p>#880e4f</p>
</section>

<section class="box">
    <section class="color-full color-tickle-me-pink"></section>
    <h1>Tickle Me Pink</h1>
    <p>#ff80ab</p>
</section>

<section class="box">
    <section class="color-full color-wild-strawberry"></section>
    <h1>Wild Strawberry</h1>
    <p>#ff4081</p>
</section>

<section class="box">
    <section class="color-full color-razzmatazz"></section>
    <h1>Razzmatazz</h1>
    <p>#f50057</p>
</section>

<section class="box">
    <section class="color-full color-red-violet"></section>
    <h1>Red Violet</h1>
    <p>#c51162</p>
</section>

<section class="box">
    <section class="color-full color-seance"></section>
    <h1>Seance</h1>
    <p>#9c27b0</p>
</section>

<section class="box">
    <section class="color-full color-snuff"></section>
    <h1>Snuff</h1>
    <p>#f3e5f5</p>
</section>

<section class="box">
    <section class="color-full color-french-lilac"></section>
    <h1>French Lilac</h1>
    <p>#e1bee7</p>
</section>

<section class="box">
    <section class="color-full color-light-wisteria"></section>
    <h1>Light Wisteria</h1>
    <p>#ce93d8</p>
</section>

<section class="box">
    <section class="color-full color-amethyst"></section>
    <h1>Amethyst</h1>
    <p>#ba68c8</p>
</section>

<section class="box">
    <section class="color-full color-amethyst"></section>
    <h1>Amethyst</h1>
    <p>#ab47bc</p>
</section>

<section class="box">
    <section class="color-full color-seance"></section>
    <h1>Seance</h1>
    <p>#8e24aa</p>
</section>

<section class="box">
    <section class="color-full color-seance"></section>
    <h1>Seance</h1>
    <p>#7b1fa2</p>
</section>

<section class="box">
    <section class="color-full color-seance"></section>
    <h1>Seance</h1>
    <p>#6a1b9a</p>
</section>

<section class="box">
    <section class="color-full color-persian-indigo"></section>
    <h1>Persian Indigo</h1>
    <p>#4a148c</p>
</section>

<section class="box">
    <section class="color-full color-heliotrope"></section>
    <h1>Heliotrope</h1>
    <p>#ea80fc</p>
</section>

<section class="box">
    <section class="color-full color-heliotrope"></section>
    <h1>Heliotrope</h1>
    <p>#e040fb</p>
</section>

<section class="box">
    <section class="color-full color-electric-violet"></section>
    <h1>Electric Violet</h1>
    <p>#d500f9</p>
</section>

<section class="box">
    <section class="color-full color-electric-violet"></section>
    <h1>Electric Violet</h1>
    <p>#aa00ff</p>
</section>

<section class="box">
    <section class="color-full color-purple-heart"></section>
    <h1>Purple Heart</h1>
    <p>#673ab7</p>
</section>

<section class="box">
    <section class="color-full color-white-lilac"></section>
    <h1>White Lilac</h1>
    <p>#ede7f6</p>
</section>

<section class="box">
    <section class="color-full color-prelude"></section>
    <h1>Prelude</h1>
    <p>#d1c4e9</p>
</section>

<section class="box">
    <section class="color-full color-cold-purple"></section>
    <h1>Cold Purple</h1>
    <p>#b39ddb</p>
</section>

<section class="box">
    <section class="color-full color-lilac-bush"></section>
    <h1>Lilac Bush</h1>
    <p>#9575cd</p>
</section>

<section class="box">
    <section class="color-full color-fuchsia-blue"></section>
    <h1>Fuchsia Blue</h1>
    <p>#7e57c2</p>
</section>

<section class="box">
    <section class="color-full color-purple-heart"></section>
    <h1>Purple Heart</h1>
    <p>#5e35b1</p>
</section>

<section class="box">
    <section class="color-full color-daisy-bush"></section>
    <h1>Daisy Bush</h1>
    <p>#512da8</p>
</section>

<section class="box">
    <section class="color-full color-daisy-bush"></section>
    <h1>Daisy Bush</h1>
    <p>#4527a0</p>
</section>

<section class="box">
    <section class="color-full color-jacksons-purple"></section>
    <h1>Jacksons Purple</h1>
    <p>#311b92</p>
</section>

<section class="box">
    <section class="color-full color-heliotrope"></section>
    <h1>Heliotrope</h1>
    <p>#b388ff</p>
</section>

<section class="box">
    <section class="color-full color-electric-violet"></section>
    <h1>Electric Violet</h1>
    <p>#7c4dff</p>
</section>

<section class="box">
    <section class="color-full color-electric-violet"></section>
    <h1>Electric Violet</h1>
    <p>#651fff</p>
</section>

<section class="box">
    <section class="color-full color-electric-violet"></section>
    <h1>Electric Violet</h1>
    <p>#6200ea</p>
</section>

<section class="box">
    <section class="color-full color-san-marino"></section>
    <h1>San Marino</h1>
    <p>#3f51b5</p>
</section>

<section class="box">
    <section class="color-full color-white-lilac"></section>
    <h1>White Lilac</h1>
    <p>#e8eaf6</p>
</section>

<section class="box">
    <section class="color-full color-periwinkle-gray"></section>
    <h1>Periwinkle Gray</h1>
    <p>#c5cae9</p>
</section>

<section class="box">
    <section class="color-full color-cold-purple"></section>
    <h1>Cold Purple</h1>
    <p>#9fa8da</p>
</section>

<section class="box">
    <section class="color-full color-moody-blue"></section>
    <h1>Moody Blue</h1>
    <p>#7986cb</p>
</section>

<section class="box">
    <section class="color-full color-indigo"></section>
    <h1>Indigo</h1>
    <p>#5c6bc0</p>
</section>

<section class="box">
    <section class="color-full color-sapphire"></section>
    <h1>Sapphire</h1>
    <p>#3949ab</p>
</section>

<section class="box">
    <section class="color-full color-sapphire"></section>
    <h1>Sapphire</h1>
    <p>#303f9f</p>
</section>

<section class="box">
    <section class="color-full color-bay-of-many"></section>
    <h1>Bay of Many</h1>
    <p>#283593</p>
</section>

<section class="box">
    <section class="color-full color-jacksons-purple"></section>
    <h1>Jacksons Purple</h1>
    <p>#1a237e</p>
</section>

<section class="box">
    <section class="color-full color-malibu"></section>
    <h1>Malibu</h1>
    <p>#8c9eff</p>
</section>

<section class="box">
    <section class="color-full color-dodger-blue"></section>
    <h1>Dodger Blue</h1>
    <p>#536dfe</p>
</section>

<section class="box">
    <section class="color-full color-dodger-blue"></section>
    <h1>Dodger Blue</h1>
    <p>#3d5afe</p>
</section>

<section class="box">
    <section class="color-full color-blue-ribbon"></section>
    <h1>Blue Ribbon</h1>
    <p>#304ffe</p>
</section>

<section class="box">
    <section class="color-full color-dodger-blue"></section>
    <h1>Dodger Blue</h1>
    <p>#2196f3</p>
</section>

<section class="box">
    <section class="color-full color-hawkes-blue"></section>
    <h1>Hawkes Blue</h1>
    <p>#e3f2fd</p>
</section>

<section class="box">
    <section class="color-full color-sail"></section>
    <h1>Sail</h1>
    <p>#bbdefb</p>
</section>

<section class="box">
    <section class="color-full color-malibu"></section>
    <h1>Malibu</h1>
    <p>#90caf9</p>
</section>

<section class="box">
    <section class="color-full color-malibu"></section>
    <h1>Malibu</h1>
    <p>#64b5f6</p>
</section>

<section class="box">
    <section class="color-full color-picton-blue"></section>
    <h1>Picton Blue</h1>
    <p>#42a5f5</p>
</section>

<section class="box">
    <section class="color-full color-curious-blue"></section>
    <h1>Curious Blue</h1>
    <p>#1e88e5</p>
</section>

<section class="box">
    <section class="color-full color-denim"></section>
    <h1>Denim</h1>
    <p>#1976d2</p>
</section>

<section class="box">
    <section class="color-full color-denim"></section>
    <h1>Denim</h1>
    <p>#1565c0</p>
</section>

<section class="box">
    <section class="color-full color-tory-blue"></section>
    <h1>Tory Blue</h1>
    <p>#0d47a1</p>
</section>

<section class="box">
    <section class="color-full color-malibu"></section>
    <h1>Malibu</h1>
    <p>#82b1ff</p>
</section>

<section class="box">
    <section class="color-full color-dodger-blue"></section>
    <h1>Dodger Blue</h1>
    <p>#448aff</p>
</section>

<section class="box">
    <section class="color-full color-dodger-blue"></section>
    <h1>Dodger Blue</h1>
    <p>#2979ff</p>
</section>

<section class="box">
    <section class="color-full color-dodger-blue"></section>
    <h1>Dodger Blue</h1>
    <p>#2962ff</p>
</section>

<section class="box">
    <section class="color-full color-cerulean"></section>
    <h1>Cerulean</h1>
    <p>#03a9f4</p>
</section>

<section class="box">
    <section class="color-full color-pattens-blue"></section>
    <h1>Pattens Blue</h1>
    <p>#e1f5fe</p>
</section>

<section class="box">
    <section class="color-full color-french-pass"></section>
    <h1>French Pass</h1>
    <p>#b3e5fc</p>
</section>

<section class="box">
    <section class="color-full color-malibu"></section>
    <h1>Malibu</h1>
    <p>#81d4fa</p>
</section>

<section class="box">
    <section class="color-full color-picton-blue"></section>
    <h1>Picton Blue</h1>
    <p>#4fc3f7</p>
</section>

<section class="box">
    <section class="color-full color-dodger-blue"></section>
    <h1>Dodger Blue</h1>
    <p>#29b6f6</p>
</section>

<section class="box">
    <section class="color-full color-cerulean"></section>
    <h1>Cerulean</h1>
    <p>#039be5</p>
</section>

<section class="box">
    <section class="color-full color-lochmara"></section>
    <h1>Lochmara</h1>
    <p>#0288d1</p>
</section>

<section class="box">
    <section class="color-full color-lochmara"></section>
    <h1>Lochmara</h1>
    <p>#0277bd</p>
</section>

<section class="box">
    <section class="color-full color-bahama-blue"></section>
    <h1>Bahama Blue</h1>
    <p>#01579b</p>
</section>

<section class="box">
    <section class="color-full color-anakiwa"></section>
    <h1>Anakiwa</h1>
    <p>#80d8ff</p>
</section>

<section class="box">
    <section class="color-full color-dodger-blue"></section>
    <h1>Dodger Blue</h1>
    <p>#40c4ff</p>
</section>

<section class="box">
    <section class="color-full color-dodger-blue"></section>
    <h1>Dodger Blue</h1>
    <p>#00b0ff</p>
</section>

<section class="box">
    <section class="color-full color-azure-radiance"></section>
    <h1>Azure Radiance</h1>
    <p>#0091ea</p>
</section>

<section class="box">
    <section class="color-full color-robins-egg-blue"></section>
    <h1>Robin's Egg Blue</h1>
    <p>#00bcd4</p>
</section>

<section class="box">
    <section class="color-full color-white-ice"></section>
    <h1>White Ice</h1>
    <p>#e0f7fa</p>
</section>

<section class="box">
    <section class="color-full color-blizzard-blue"></section>
    <h1>Blizzard Blue</h1>
    <p>#b2ebf2</p>
</section>

<section class="box">
    <section class="color-full color-spray"></section>
    <h1>Spray</h1>
    <p>#80deea</p>
</section>

<section class="box">
    <section class="color-full color-turquoise-blue"></section>
    <h1>Turquoise Blue</h1>
    <p>#4dd0e1</p>
</section>

<section class="box">
    <section class="color-full color-scooter"></section>
    <h1>Scooter</h1>
    <p>#26c6da</p>
</section>

<section class="box">
    <section class="color-full color-pacific-blue"></section>
    <h1>Pacific Blue</h1>
    <p>#00acc1</p>
</section>

<section class="box">
    <section class="color-full color-bondi-blue"></section>
    <h1>Bondi Blue</h1>
    <p>#0097a7</p>
</section>

<section class="box">
    <section class="color-full color-blue-lagoon"></section>
    <h1>Blue Lagoon</h1>
    <p>#00838f</p>
</section>

<section class="box">
    <section class="color-full color-blue-stone"></section>
    <h1>Blue Stone</h1>
    <p>#006064</p>
</section>

<section class="box">
    <section class="color-full color-anakiwa"></section>
    <h1>Anakiwa</h1>
    <p>#84ffff</p>
</section>

<section class="box">
    <section class="color-full color-cyan-/-aqua"></section>
    <h1>Cyan / Aqua</h1>
    <p>#18ffff</p>
</section>

<section class="box">
    <section class="color-full color-cyan-/-aqua"></section>
    <h1>Cyan / Aqua</h1>
    <p>#00e5ff</p>
</section>

<section class="box">
    <section class="color-full color-cerulean"></section>
    <h1>Cerulean</h1>
    <p>#00b8d4</p>
</section>

<section class="box">
    <section class="color-full color-persian-green"></section>
    <h1>Persian Green</h1>
    <p>#009688</p>
</section>

<section class="box">
    <section class="color-full color-aqua-squeeze"></section>
    <h1>Aqua Squeeze</h1>
    <p>#e0f2f1</p>
</section>

<section class="box">
    <section class="color-full color-aqua-island"></section>
    <h1>Aqua Island</h1>
    <p>#b2dfdb</p>
</section>

<section class="box">
    <section class="color-full color-monte-carlo"></section>
    <h1>Monte Carlo</h1>
    <p>#80cbc4</p>
</section>

<section class="box">
    <section class="color-full color-fountain-blue"></section>
    <h1>Fountain Blue</h1>
    <p>#4db6ac</p>
</section>

<section class="box">
    <section class="color-full color-jungle-green"></section>
    <h1>Jungle Green</h1>
    <p>#26a69a</p>
</section>

<section class="box">
    <section class="color-full color-teal"></section>
    <h1>Teal</h1>
    <p>#00897b</p>
</section>

<section class="box">
    <section class="color-full color-pine-green"></section>
    <h1>Pine Green</h1>
    <p>#00796b</p>
</section>

<section class="box">
    <section class="color-full color-tropical-rain-forest"></section>
    <h1>Tropical Rain Forest</h1>
    <p>#00695c</p>
</section>

<section class="box">
    <section class="color-full color-aqua-deep"></section>
    <h1>Aqua Deep</h1>
    <p>#004d40</p>
</section>

<section class="box">
    <section class="color-full color-aero-blue"></section>
    <h1>Aero Blue</h1>
    <p>#a7ffeb</p>
</section>

<section class="box">
    <section class="color-full color-aquamarine"></section>
    <h1>Aquamarine</h1>
    <p>#64ffda</p>
</section>

<section class="box">
    <section class="color-full color-java"></section>
    <h1>Java</h1>
    <p>#1de9b6</p>
</section>

<section class="box">
    <section class="color-full color-caribbean-green"></section>
    <h1>Caribbean Green</h1>
    <p>#00bfa5</p>
</section>

<section class="box">
    <section class="color-full color-fruit-salad"></section>
    <h1>Fruit Salad</h1>
    <p>#4caf50</p>
</section>

<section class="box">
    <section class="color-full color-panache"></section>
    <h1>Panache</h1>
    <p>#e8f5e9</p>
</section>

<section class="box">
    <section class="color-full color-zanah"></section>
    <h1>Zanah</h1>
    <p>#c8e6c9</p>
</section>

<section class="box">
    <section class="color-full color-moss-green"></section>
    <h1>Moss Green</h1>
    <p>#a5d6a7</p>
</section>

<section class="box">
    <section class="color-full color-de-york"></section>
    <h1>De York</h1>
    <p>#81c784</p>
</section>

<section class="box">
    <section class="color-full color-fern"></section>
    <h1>Fern</h1>
    <p>#66bb6a</p>
</section>

<section class="box">
    <section class="color-full color-apple"></section>
    <h1>Apple</h1>
    <p>#43a047</p>
</section>

<section class="box">
    <section class="color-full color-apple"></section>
    <h1>Apple</h1>
    <p>#388e3c</p>
</section>

<section class="box">
    <section class="color-full color-sea-green"></section>
    <h1>Sea Green</h1>
    <p>#2e7d32</p>
</section>

<section class="box">
    <section class="color-full color-parsley"></section>
    <h1>Parsley</h1>
    <p>#1b5e20</p>
</section>

<section class="box">
    <section class="color-full color-magic-mint"></section>
    <h1>Magic Mint</h1>
    <p>#b9f6ca</p>
</section>

<section class="box">
    <section class="color-full color-turquoise-blue"></section>
    <h1>Turquoise Blue</h1>
    <p>#69f0ae</p>
</section>

<section class="box">
    <section class="color-full color-spring-green"></section>
    <h1>Spring Green</h1>
    <p>#00e676</p>
</section>

<section class="box">
    <section class="color-full color-malachite"></section>
    <h1>Malachite</h1>
    <p>#00c853</p>
</section>

<section class="box">
    <section class="color-full color-sushi"></section>
    <h1>Sushi</h1>
    <p>#8bc34a</p>
</section>

<section class="box">
    <section class="color-full color-loafer"></section>
    <h1>Loafer</h1>
    <p>#f1f8e9</p>
</section>

<section class="box">
    <section class="color-full color-chrome-white"></section>
    <h1>Chrome White</h1>
    <p>#dcedc8</p>
</section>

<section class="box">
    <section class="color-full color-deco"></section>
    <h1>Deco</h1>
    <p>#c5e1a5</p>
</section>

<section class="box">
    <section class="color-full color-feijoa"></section>
    <h1>Feijoa</h1>
    <p>#aed581</p>
</section>

<section class="box">
    <section class="color-full color-celery"></section>
    <h1>Celery</h1>
    <p>#9ccc65</p>
</section>

<section class="box">
    <section class="color-full color-sushi"></section>
    <h1>Sushi</h1>
    <p>#7cb342</p>
</section>

<section class="box">
    <section class="color-full color-apple"></section>
    <h1>Apple</h1>
    <p>#689f38</p>
</section>

<section class="box">
    <section class="color-full color-apple"></section>
    <h1>Apple</h1>
    <p>#558b2f</p>
</section>

<section class="box">
    <section class="color-full color-dell"></section>
    <h1>Dell</h1>
    <p>#33691e</p>
</section>

<section class="box">
    <section class="color-full color-reef"></section>
    <h1>Reef</h1>
    <p>#ccff90</p>
</section>

<section class="box">
    <section class="color-full color-green-yellow"></section>
    <h1>Green Yellow</h1>
    <p>#b2ff59</p>
</section>

<section class="box">
    <section class="color-full color-chartreuse"></section>
    <h1>Chartreuse</h1>
    <p>#76ff03</p>
</section>

<section class="box">
    <section class="color-full color-lima"></section>
    <h1>Lima</h1>
    <p>#64dd17</p>
</section>

<section class="box">
    <section class="color-full color-pear"></section>
    <h1>Pear</h1>
    <p>#cddc39</p>
</section>

<section class="box">
    <section class="color-full color-coconut-cream"></section>
    <h1>Coconut Cream</h1>
    <p>#f9fbe7</p>
</section>

<section class="box">
    <section class="color-full color-tusk"></section>
    <h1>Tusk</h1>
    <p>#f0f4c3</p>
</section>

<section class="box">
    <section class="color-full color-primrose"></section>
    <h1>Primrose</h1>
    <p>#e6ee9c</p>
</section>

<section class="box">
    <section class="color-full color-manz"></section>
    <h1>Manz</h1>
    <p>#dce775</p>
</section>

<section class="box">
    <section class="color-full color-wattle"></section>
    <h1>Wattle</h1>
    <p>#d4e157</p>
</section>

<section class="box">
    <section class="color-full color-earls-green"></section>
    <h1>Earls Green</h1>
    <p>#c0ca33</p>
</section>

<section class="box">
    <section class="color-full color-lemon-ginger"></section>
    <h1>Lemon Ginger</h1>
    <p>#afb42b</p>
</section>

<section class="box">
    <section class="color-full color-lemon-ginger"></section>
    <h1>Lemon Ginger</h1>
    <p>#9e9d24</p>
</section>

<section class="box">
    <section class="color-full color-trendy-green"></section>
    <h1>Trendy Green</h1>
    <p>#827717</p>
</section>

<section class="box">
    <section class="color-full color-dolly"></section>
    <h1>Dolly</h1>
    <p>#f4ff81</p>
</section>

<section class="box">
    <section class="color-full color-golden-fizz"></section>
    <h1>Golden Fizz</h1>
    <p>#eeff41</p>
</section>

<section class="box">
    <section class="color-full color-electric-lime"></section>
    <h1>Electric Lime</h1>
    <p>#c6ff00</p>
</section>

<section class="box">
    <section class="color-full color-lime"></section>
    <h1>Lime</h1>
    <p>#aeea00</p>
</section>

<section class="box">
    <section class="color-full color-gorse"></section>
    <h1>Gorse</h1>
    <p>#ffeb3b</p>
</section>

<section class="box">
    <section class="color-full color-travertine"></section>
    <h1>Travertine</h1>
    <p>#fffde7</p>
</section>

<section class="box">
    <section class="color-full color-lemon-chiffon"></section>
    <h1>Lemon Chiffon</h1>
    <p>#fff9c4</p>
</section>

<section class="box">
    <section class="color-full color-picasso"></section>
    <h1>Picasso</h1>
    <p>#fff59d</p>
</section>

<section class="box">
    <section class="color-full color-paris-daisy"></section>
    <h1>Paris Daisy</h1>
    <p>#fff176</p>
</section>

<section class="box">
    <section class="color-full color-gorse"></section>
    <h1>Gorse</h1>
    <p>#ffee58</p>
</section>

<section class="box">
    <section class="color-full color-bright-sun"></section>
    <h1>Bright Sun</h1>
    <p>#fdd835</p>
</section>

<section class="box">
    <section class="color-full color-lightning-yellow"></section>
    <h1>Lightning Yellow</h1>
    <p>#fbc02d</p>
</section>

<section class="box">
    <section class="color-full color-sea-buckthorn"></section>
    <h1>Sea Buckthorn</h1>
    <p>#f9a825</p>
</section>

<section class="box">
    <section class="color-full color-ecstasy"></section>
    <h1>Ecstasy</h1>
    <p>#f57f17</p>
</section>

<section class="box">
    <section class="color-full color-dolly"></section>
    <h1>Dolly</h1>
    <p>#ffff8d</p>
</section>

<section class="box">
    <section class="color-full color-yellow"></section>
    <h1>Yellow</h1>
    <p>#ffff00</p>
</section>

<section class="box">
    <section class="color-full color-turbo"></section>
    <h1>Turbo</h1>
    <p>#ffea00</p>
</section>

<section class="box">
    <section class="color-full color-gold"></section>
    <h1>Gold</h1>
    <p>#ffd600</p>
</section>

<section class="box">
    <section class="color-full color-amber"></section>
    <h1>Amber</h1>
    <p>#ffc107</p>
</section>

<section class="box">
    <section class="color-full color-gin-fizz"></section>
    <h1>Gin Fizz</h1>
    <p>#fff8e1</p>
</section>

<section class="box">
    <section class="color-full color-buttermilk"></section>
    <h1>Buttermilk</h1>
    <p>#ffecb3</p>
</section>

<section class="box">
    <section class="color-full color-salomie"></section>
    <h1>Salomie</h1>
    <p>#ffe082</p>
</section>

<section class="box">
    <section class="color-full color-mustard"></section>
    <h1>Mustard</h1>
    <p>#ffd54f</p>
</section>

<section class="box">
    <section class="color-full color-sunglow"></section>
    <h1>Sunglow</h1>
    <p>#ffca28</p>
</section>

<section class="box">
    <section class="color-full color-selective-yellow"></section>
    <h1>Selective Yellow</h1>
    <p>#ffb300</p>
</section>

<section class="box">
    <section class="color-full color-orange-peel"></section>
    <h1>Orange Peel</h1>
    <p>#ffa000</p>
</section>

<section class="box">
    <section class="color-full color-pizazz"></section>
    <h1>Pizazz</h1>
    <p>#ff8f00</p>
</section>

<section class="box">
    <section class="color-full color-blaze-orange"></section>
    <h1>Blaze Orange</h1>
    <p>#ff6f00</p>
</section>

<section class="box">
    <section class="color-full color-kournikova"></section>
    <h1>Kournikova</h1>
    <p>#ffe57f</p>
</section>

<section class="box">
    <section class="color-full color-bright-sun"></section>
    <h1>Bright Sun</h1>
    <p>#ffd740</p>
</section>

<section class="box">
    <section class="color-full color-amber"></section>
    <h1>Amber</h1>
    <p>#ffc400</p>
</section>

<section class="box">
    <section class="color-full color-web-orange"></section>
    <h1>Web Orange</h1>
    <p>#ffab00</p>
</section>

<section class="box">
    <section class="color-full color-pizazz"></section>
    <h1>Pizazz</h1>
    <p>#ff9800</p>
</section>

<section class="box">
    <section class="color-full color-sazerac"></section>
    <h1>Sazerac</h1>
    <p>#fff3e0</p>
</section>

<section class="box">
    <section class="color-full color-frangipani"></section>
    <h1>Frangipani</h1>
    <p>#ffe0b2</p>
</section>

<section class="box">
    <section class="color-full color-chardonnay"></section>
    <h1>Chardonnay</h1>
    <p>#ffcc80</p>
</section>

<section class="box">
    <section class="color-full color-texas-rose"></section>
    <h1>Texas Rose</h1>
    <p>#ffb74d</p>
</section>

<section class="box">
    <section class="color-full color-sunshade"></section>
    <h1>Sunshade</h1>
    <p>#ffa726</p>
</section>

<section class="box">
    <section class="color-full color-pizazz"></section>
    <h1>Pizazz</h1>
    <p>#fb8c00</p>
</section>

<section class="box">
    <section class="color-full color-gold-drop"></section>
    <h1>Gold Drop</h1>
    <p>#f57c00</p>
</section>

<section class="box">
    <section class="color-full color-clementine"></section>
    <h1>Clementine</h1>
    <p>#ef6c00</p>
</section>

<section class="box">
    <section class="color-full color-trinidad"></section>
    <h1>Trinidad</h1>
    <p>#e65100</p>
</section>

<section class="box">
    <section class="color-full color-grandis"></section>
    <h1>Grandis</h1>
    <p>#ffd180</p>
</section>

<section class="box">
    <section class="color-full color-yellow-orange"></section>
    <h1>Yellow Orange</h1>
    <p>#ffab40</p>
</section>

<section class="box">
    <section class="color-full color-pizazz"></section>
    <h1>Pizazz</h1>
    <p>#ff9100</p>
</section>

<section class="box">
    <section class="color-full color-blaze-orange"></section>
    <h1>Blaze Orange</h1>
    <p>#ff6d00</p>
</section>

<section class="box">
    <section class="color-full color-orange"></section>
    <h1>Orange</h1>
    <p>#ff5722</p>
</section>

<section class="box">
    <section class="color-full color-linen"></section>
    <h1>Linen</h1>
    <p>#fbe9e7</p>
</section>

<section class="box">
    <section class="color-full color-romantic"></section>
    <h1>Romantic</h1>
    <p>#ffccbc</p>
</section>

<section class="box">
    <section class="color-full color-mona-lisa"></section>
    <h1>Mona Lisa</h1>
    <p>#ffab91</p>
</section>

<section class="box">
    <section class="color-full color-salmon"></section>
    <h1>Salmon</h1>
    <p>#ff8a65</p>
</section>

<section class="box">
    <section class="color-full color-burning-orange"></section>
    <h1>Burning Orange</h1>
    <p>#ff7043</p>
</section>

<section class="box">
    <section class="color-full color-pomegranate"></section>
    <h1>Pomegranate</h1>
    <p>#f4511e</p>
</section>

<section class="box">
    <section class="color-full color-cinnabar"></section>
    <h1>Cinnabar</h1>
    <p>#e64a19</p>
</section>

<section class="box">
    <section class="color-full color-tia-maria"></section>
    <h1>Tia Maria</h1>
    <p>#d84315</p>
</section>

<section class="box">
    <section class="color-full color-tia-maria"></section>
    <h1>Tia Maria</h1>
    <p>#bf360c</p>
</section>

<section class="box">
    <section class="color-full color-vivid-tangerine"></section>
    <h1>Vivid Tangerine</h1>
    <p>#ff9e80</p>
</section>

<section class="box">
    <section class="color-full color-burning-orange"></section>
    <h1>Burning Orange</h1>
    <p>#ff6e40</p>
</section>

<section class="box">
    <section class="color-full color-vermilion"></section>
    <h1>Vermilion</h1>
    <p>#ff3d00</p>
</section>

<section class="box">
    <section class="color-full color-grenadier"></section>
    <h1>Grenadier</h1>
    <p>#dd2c00</p>
</section>

<section class="box">
    <section class="color-full color-silver-chalice"></section>
    <h1>Silver Chalice</h1>
    <p>#9e9e9e</p>
</section>

<section class="box">
    <section class="color-full color-alabaster"></section>
    <h1>Alabaster</h1>
    <p>#fafafa</p>
</section>

<section class="box">
    <section class="color-full color-wild-sand"></section>
    <h1>Wild Sand</h1>
    <p>#f5f5f5</p>
</section>

<section class="box">
    <section class="color-full color-gallery"></section>
    <h1>Gallery</h1>
    <p>#eeeeee</p>
</section>

<section class="box">
    <section class="color-full color-alto"></section>
    <h1>Alto</h1>
    <p>#e0e0e0</p>
</section>

<section class="box">
    <section class="color-full color-silver"></section>
    <h1>Silver</h1>
    <p>#bdbdbd</p>
</section>

<section class="box">
    <section class="color-full color-boulder"></section>
    <h1>Boulder</h1>
    <p>#757575</p>
</section>

<section class="box">
    <section class="color-full color-dove-gray"></section>
    <h1>Dove Gray</h1>
    <p>#616161</p>
</section>

<section class="box">
    <section class="color-full color-tundora"></section>
    <h1>Tundora</h1>
    <p>#424242</p>
</section>

<section class="box">
    <section class="color-full color-mine-shaft"></section>
    <h1>Mine Shaft</h1>
    <p>#212121</p>
</section>

<section class="box">
    <section class="color-full color-lynch"></section>
    <h1>Lynch</h1>
    <p>#607d8b</p>
</section>

<section class="box">
    <section class="color-full color-porcelain"></section>
    <h1>Porcelain</h1>
    <p>#eceff1</p>
</section>

<section class="box">
    <section class="color-full color-geyser"></section>
    <h1>Geyser</h1>
    <p>#cfd8dc</p>
</section>

<section class="box">
    <section class="color-full color-tower-gray"></section>
    <h1>Tower Gray</h1>
    <p>#b0bec5</p>
</section>

<section class="box">
    <section class="color-full color-gull-gray"></section>
    <h1>Gull Gray</h1>
    <p>#90a4ae</p>
</section>

<section class="box">
    <section class="color-full color-regent-gray"></section>
    <h1>Regent Gray</h1>
    <p>#78909c</p>
</section>

<section class="box">
    <section class="color-full color-cutty-sark"></section>
    <h1>Cutty Sark</h1>
    <p>#546e7a</p>
</section>

<section class="box">
    <section class="color-full color-fiord"></section>
    <h1>Fiord</h1>
    <p>#455a64</p>
</section>

<section class="box">
    <section class="color-full color-limed-spruce"></section>
    <h1>Limed Spruce</h1>
    <p>#37474f</p>
</section>

<section class="box">
    <section class="color-full color-outer-space"></section>
    <h1>Outer Space</h1>
    <p>#263238</p>
</section>

<section class="box">
    <section class="color-full color-roman-coffee"></section>
    <h1>Roman Coffee</h1>
    <p>#795548</p>
</section>

<section class="box">
    <section class="color-full color-ebb"></section>
    <h1>Ebb</h1>
    <p>#efebe9</p>
</section>

<section class="box">
    <section class="color-full color-swirl"></section>
    <h1>Swirl</h1>
    <p>#d7ccc8</p>
</section>

<section class="box">
    <section class="color-full color-silk"></section>
    <h1>Silk</h1>
    <p>#bcaaa4</p>
</section>

<section class="box">
    <section class="color-full color-pharlap"></section>
    <h1>Pharlap</h1>
    <p>#a1887f</p>
</section>

<section class="box">
    <section class="color-full color-cement"></section>
    <h1>Cement</h1>
    <p>#8d6e63</p>
</section>

<section class="box">
    <section class="color-full color-kabul"></section>
    <h1>Kabul</h1>
    <p>#6d4c41</p>
</section>

<section class="box">
    <section class="color-full color-millbrook"></section>
    <h1>Millbrook</h1>
    <p>#5d4037</p>
</section>

<section class="box">
    <section class="color-full color-rock"></section>
    <h1>Rock</h1>
    <p>#4e342e</p>
</section>

<section class="box">
    <section class="color-full color-english-walnut"></section>
    <h1>English Walnut</h1>
    <p>#3e2723</p>
</section>

<section class="box">
    <section class="color-full color-black"></section>
    <h1>Black</h1>
    <p>#000000</p>
</section>

<section class="box">
    <section class="color-full color-white"></section>
    <h1>White</h1>
    <p>#ffffff</p>
</section>

</body>
</html>