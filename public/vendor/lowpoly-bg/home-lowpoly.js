/* Homepage only — from Canvas菱角背景动画特效 reference */
var lowpolyActive = false;
var lowpolyRaf = 0;
function init() {
  var svg = document.getElementById('home-lowpoly-svg');
  if (!svg) return;
  tesselation.setup(svg);
  gradients.setup();

  var lastTransitionAt, transitionDelay = 5500, transitionDuration = 3000;

  function playNextTransition() {
    if (!lowpolyActive) return;
    tesselation.next(transitionDuration);
    gradients.next(transitionDuration);
  }

  function tick(time) {
    if (!lowpolyActive) return;
    if (!lastTransitionAt || time - lastTransitionAt > transitionDelay) {
      lastTransitionAt = time;
      playNextTransition();
    }
    lowpolyRaf = window.requestAnimationFrame(tick);
  }
  lowpolyRaf = window.requestAnimationFrame(tick);
}

//////////////////////////////
// Delaunay Triangulation
//////////////////////////////

var calcDelaunayTriangulation = (function() {
  var EPSILON = 1.0 / 1048576.0;
  function getSuperT(vertices) {
    var xMin = Number.POSITIVE_INFINITY, yMin = Number.POSITIVE_INFINITY,
        xMax = Number.NEGATIVE_INFINITY, yMax = Number.NEGATIVE_INFINITY,
        i, xDiff, yDiff, maxDiff, xCenter, yCenter;
    for(i = vertices.length; i--; ) {
      if(vertices[i][0] < xMin) xMin = vertices[i][0];
      if(vertices[i][0] > xMax) xMax = vertices[i][0];
      if(vertices[i][1] < yMin) yMin = vertices[i][1];
      if(vertices[i][1] > yMax) yMax = vertices[i][1];
    }
    xDiff = xMax - xMin;
    yDiff = yMax - yMin;
    maxDiff = Math.max(xDiff, yDiff);
    xCenter = xMin + xDiff * 0.5;
    yCenter = yMin + yDiff * 0.5;
    return [
      [xCenter - 20 * maxDiff, yCenter - maxDiff],
      [xCenter, yCenter + 20 * maxDiff],
      [xCenter + 20 * maxDiff, yCenter - maxDiff]
    ];
  }
  function circumcircle(vertices, i, j, k) {
    var xI = vertices[i][0], yI = vertices[i][1],
        xJ = vertices[j][0], yJ = vertices[j][1],
        xK = vertices[k][0], yK = vertices[k][1],
        yDiffIJ = Math.abs(yI - yJ), yDiffJK = Math.abs(yJ - yK),
        xCenter, yCenter, m1, m2, xMidIJ, xMidJK, yMidIJ, yMidJK, xDiff, yDiff;
    // bail condition
    if(yDiffIJ < EPSILON && yDiffJK < EPSILON)
      throw new Error("Can't get circumcircle since all 3 points are y-aligned");
    // calc circumcircle center x/y, radius
    m1  = -((xJ - xI) / (yJ - yI));
    m2  = -((xK - xJ) / (yK - yJ));
    xMidIJ = (xI + xJ) / 2.0;
    xMidJK = (xJ + xK) / 2.0;
    yMidIJ = (yI + yJ) / 2.0;
    yMidJK = (yJ + yK) / 2.0;
    xCenter = (yDiffIJ < EPSILON) ? xMidIJ :
      (yDiffJK < EPSILON) ? xMidJK :
      (m1 * xMidIJ - m2 * xMidJK + yMidJK - yMidIJ) / (m1 - m2);
    yCenter  = (yDiffIJ > yDiffJK) ?
      m1 * (xCenter - xMidIJ) + yMidIJ :
      m2 * (xCenter - xMidJK) + yMidJK;
    xDiff = xJ - xCenter;
    yDiff = yJ - yCenter;
    // return
    return {i: i, j: j, k: k, x: xCenter, y: yCenter, r: xDiff * xDiff + yDiff * yDiff};
  }
  function dedupeEdges(edges) {
    var i, j, a, b, m, n;
    for(j = edges.length; j; ) {
      b = edges[--j]; a = edges[--j];
      for(i = j; i; ) {
        n = edges[--i]; m = edges[--i];
        if((a === m && b === n) || (a === n && b === m)) {
          edges.splice(j, 2); edges.splice(i, 2);
          break;
        }
      }
    }
  }
  return function(vertices) {
    var n = vertices.length,
        i, j, indices, st, candidates, locked, edges, dx, dy, a, b, c;
    // bail if too few / too many verts
    if(n < 3 || n > 2000)
      return [];
    // copy verts and sort indices by x-position
    vertices = vertices.slice(0);
    indices = new Array(n);
    for(i = n; i--; )
      indices[i] = i;
    indices.sort(function(i, j) {
      return vertices[j][0] - vertices[i][0];
    });
    // supertriangle
    st = getSuperT(vertices);
    vertices.push(st[0], st[1], st[2]);
    // init candidates/locked tris list
    candidates = [circumcircle(vertices, n + 0, n + 1, n + 2)];
    locked = [];
    edges = [];
    // scan left to right
    for(i = indices.length; i--; edges.length = 0) {
      c = indices[i];
      // check candidates tris against point
      for(j = candidates.length; j--; ) {
        // lock tri if point to right of circumcirc
        dx = vertices[c][0] - candidates[j].x;
        if(dx > 0.0 && dx * dx > candidates[j].r) {
          locked.push(candidates[j]);
          candidates.splice(j, 1);
          continue;
        }
        // point outside circumcirc = leave candidates
        dy = vertices[c][1] - candidates[j].y;
        if(dx * dx + dy * dy - candidates[j].r > EPSILON)
          continue;
        // point inside circumcirc = break apart, save edges
        edges.push(
          candidates[j].i, candidates[j].j,
          candidates[j].j, candidates[j].k,
          candidates[j].k, candidates[j].i
        );
        candidates.splice(j, 1);
      }
      // new candidates from broken edges
      dedupeEdges(edges);
      for(j = edges.length; j; ) {
        b = edges[--j];
        a = edges[--j];
        candidates.push(circumcircle(vertices, a, b, c));
      }
    }
    // close candidates tris, remove tris touching supertri verts
    for(i = candidates.length; i--; )
      locked.push(candidates[i]);
    candidates.length = 0;
    for(i = locked.length; i--; )
      if(locked[i].i < n && locked[i].j < n && locked[i].k < n)
        candidates.push(locked[i].i, locked[i].j, locked[i].k);
    // done
    return candidates;
  };
})();

var tesselation = (function() {
  var svg, svgW, svgH, prevGroup;

  function createRandomTesselation() {
    var wW = window.innerWidth;
    var wH = window.innerHeight;

    var gridSpacing = 250, scatterAmount = 0.75;
    var gridSize, i, x, y;

    if (wW / wH > svgW / svgH) { // window wider than svg = use width for gridSize
      gridSize = gridSpacing * svgW / wW;
    } else { // window taller than svg = use height for gridSize
      gridSize = gridSpacing * svgH / wH;
    }

    var vertices = [];
    var xOffset = (svgW % gridSize) / 2, yOffset = (svgH % gridSize) / 2;
    for (x = Math.floor(svgW/gridSize) + 1; x >= -1; x--) {
      for (y = Math.floor(svgH/gridSize) + 1; y >= -1; y--) {
        vertices.push(
          [
            xOffset + gridSize * (x + scatterAmount * (Math.random() - 0.5)),
            yOffset + gridSize * (y + scatterAmount * (Math.random() - 0.5))
          ]
        );
      }
    }

    var triangles = calcDelaunayTriangulation(vertices);

    var group = document.createElementNS('http://www.w3.org/2000/svg','g');
    var polygon;
    for(i = triangles.length; i; ) {
      polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
      polygon.setAttribute('points',
        vertices[triangles[--i]][0] + ',' + vertices[triangles[i]][1] + ' ' +
        vertices[triangles[--i]][0] + ',' + vertices[triangles[i]][1] + ' ' +
        vertices[triangles[--i]][0] + ',' + vertices[triangles[i]][1]
      );
      group.appendChild(polygon);
    }

    return group;
  }

  return {
    setup: function(svgElement) {
      svg = svgElement;
      prevGroup = null;
      var vb = svg.getAttribute('viewBox').split(/\D/g);
      svgW = vb[2];
      svgH = vb[3];
    },
    next: function(t) {
      if (!lowpolyActive) return;
      var toRemove, i, n;
      t /= 1000;

      if (prevGroup && prevGroup.children && prevGroup.children.length) {
        toRemove = prevGroup;
        n = toRemove.children.length;
        for (i = n; i--; ) {
          TweenMax.to(toRemove.children[i], t*0.4, {opacity: 0, delay: t*(0.3*i/n)});
        }
        TweenMax.delayedCall(t * (0.7 + 0.05), function(group) { svg.removeChild(group); }, [toRemove], this);
      }
      var g = createRandomTesselation();
      n = g.children.length;
      for (i = n; i--; ) {
        TweenMax.fromTo(g.children[i], t*0.4, {opacity: 0}, {opacity: 0.12 + 0.1 * Math.random(), delay: t*(0.3*i/n + 0.3), ease: Back.easeOut});
      }
      svg.appendChild(g);
      prevGroup = g;
    }
  }
})();

//////////////////////////////
// Gradients
//////////////////////////////

var gradients = (function() {
  var grad1, grad2, showingGrad1;

  /** 色相分明的浅色 stop（左→右渐变两端各抽一色，跨度拉大才不显单调） */
  var colors = [
    '#dbeafe',
    '#e0f2fe',
    '#cffafe',
    '#dbeafe',
    '#e0e7ff',
    '#ede9fe',
    '#f3e8ff',
    '#faf5ff',
    '#eef2ff',
    '#d1fae5',
    '#ccfbf1',
    '#dcfce7',
    '#ecfccb',
    '#fef9c3',
    '#fef3c7',
    '#ffedd5',
    '#fce7f3',
    '#fae8ff',
    '#ffe4e6',
    '#e0f2fe'
  ];

  function assignRandomColors(gradObj) {
    var n = colors.length;
    var rA = Math.floor(n * Math.random());
    var offset = Math.floor(Math.random() * (n - 4)) + 4;
    var rB = (rA + offset * (Math.random() < 0.5 ? 1 : -1) + n * 10) % n;
    gradObj.stopA.setAttribute('stop-color', colors[rA]);
    gradObj.stopB.setAttribute('stop-color', colors[rB]);
  }

  return {
    setup: function() {
      showingGrad1 = false;
      grad1 = {
        stopA: document.getElementById('home-lp-stop-0a'),
        stopB: document.getElementById('home-lp-stop-0b'),
        rect:  document.getElementById('home-lp-rect-0')
      };
      grad2 = {
        stopA: document.getElementById('home-lp-stop-1a'),
        stopB: document.getElementById('home-lp-stop-1b'),
        rect:  document.getElementById('home-lp-rect-1')
      };
      grad1.rect.style.opacity = 0;
      grad2.rect.style.opacity = 0;
    },
    next: function(t) {
      if (!lowpolyActive) return;
      t /= 1000;

      var show, hide;
      if (showingGrad1) {
        hide = grad1;
        show = grad2;
      } else {
        hide = grad2;
        show = grad1;
      }
      showingGrad1 = !showingGrad1;

      TweenMax.to(hide.rect, 0.55*t, {opacity: 0, delay: 0.2*t, ease: Sine.easeOut});
      assignRandomColors(show);
      TweenMax.to(show.rect, 0.65*t, {opacity: 0.76, ease: Sine.easeIn});
    }
  };
})();

//////////////////////////////
// Start
//////////////////////////////

function homeLowpolyShouldRun() {
  return (
    window.location.pathname === '/' &&
    document.documentElement.getAttribute('data-theme') === 'light' &&
    document.documentElement.getAttribute('data-home-lowpoly') === 'true'
  );
}

function destroyHomeLowpoly() {
  lowpolyActive = false;
  if (lowpolyRaf) {
    cancelAnimationFrame(lowpolyRaf);
    lowpolyRaf = 0;
  }
  if (typeof TweenMax !== 'undefined') {
    TweenMax.killAll(false, true, true);
  }
  var svg = document.getElementById('home-lowpoly-svg');
  if (svg) {
    svg.querySelectorAll('g').forEach(function (g) {
      g.remove();
    });
  }
}

function startHomeLowpoly() {
  destroyHomeLowpoly();
  if (!homeLowpolyShouldRun()) return;
  lowpolyActive = true;
  init();
}

document.addEventListener('astro:page-load', startHomeLowpoly);
document.addEventListener('site-theme-reflected', startHomeLowpoly);
startHomeLowpoly();
