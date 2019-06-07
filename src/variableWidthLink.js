import { sum } from "d3-array";
import { path } from "d3-path";


// function linkHeights_old(link, node, siblings) {
//   if( siblings.length == 1 ) {
//     return [ node.y0, node.y1 ];
//   }
//   var k = (node.y1 - node.y0) / sum(siblings, (l) => l.value);
//   var v0 = sum(siblings.filter((l) => l.index < link.index), (l) => l.value);
//   var v1 = v0 + link.value;
//   return [ node.y0 + k * v0 , node.y0 + k * v1 ];
// }

// valueacc is svalue or tvalue

function linkHeights(link, valueacc, node, siblings) {
  if( siblings.length == 1 ) {
    return [ node.y0, node.y1 ];
  }
  var v0 = sum(siblings.filter((l) => l.index < link.index), valueacc);
  return [ node.y0 + v0 , node.y0 + v0 + valueacc(link) ];

}



export default function () {
  return ( d ) => {
    const s = d.source;
    const t = d.target;
    // note: s.x1 is the right side of the source
    // t.x0 is the left side of the target
    const sy = linkHeights(d, (d) => d.swidth, d.source, d.source.sourceLinks);
    const ty = linkHeights(d, (d) => d.twidth, d.target, d.target.targetLinks);
    const xm = (s.x1 + t.x0) / 2;
    const p = path();
    p.moveTo(s.x1, sy[0]);
    p.bezierCurveTo(xm, sy[0], xm, ty[0], t.x0, ty[0]);
    p.lineTo(t.x0, ty[1]);
    p.bezierCurveTo(xm, ty[1], xm, sy[1], s.x1, sy[1]);
    p.closePath();
    return p.toString();
  }
}