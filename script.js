(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* Theme */
  $('#theme').addEventListener('click', function () {
    var n = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = n;
    try { localStorage.setItem('theme', n); } catch (e) {}
  });

  /* Progress */
  var bar = $('#progress');
  addEventListener('scroll', function () {
    var m = root.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (m > 0 ? scrollY / m : 0) + ')';
  }, { passive: true });

  /* Nav: sliding indicator + active section, and reveal on scroll */
  var nav = $('#nav'), links = $$('a', nav), ind = d.createElement('span'), current = links[0];
  ind.className = 'ind'; nav.appendChild(ind);
  function place(a) {
    if (!a || innerWidth <= 860) return;
    ind.style.opacity = 1; ind.style.width = a.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + a.offsetLeft + 'px)';
  }
  function setActive(a) {
    current = a || current;
    links.forEach(function (l) { l.classList.toggle('on', l === current); });
    place(current);
  }
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) setActive(links.filter(function (l) { return l.hash === '#' + e.target.id; })[0]);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }
  links.forEach(function (l) {
    l.addEventListener('mouseenter', function () { place(l); });
    l.addEventListener('focus', function () { place(l); });
  });
  nav.addEventListener('mouseleave', function () { place(current); });
  addEventListener('resize', function () { place(current); });
  setActive(links[0]);

  /* Card spotlight */
  $$('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px');
      c.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  /* SQL highlighter (escape first, then wrap tokens) */
  var KW = /\b(SELECT|FROM|WHERE|JOIN|ON|GROUP BY|HAVING|ORDER\s+BY|ORDER|WITH|AS|OVER|RANK|SUM|COUNT|NOT IN|IN|UPDATE|SET|SAVEPOINT|COMMIT|ROLLBACK|DESC|BY|AND)\b/g;
  function hl(s) {
    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return s.replace(/(--[^\n]*)|('[^']*')|\b(\d+)\b|\b(SELECT|FROM|WHERE|JOIN|ON|GROUP BY|HAVING|ORDER\s+BY|ORDER|WITH|AS|OVER|RANK|SUM|NOT IN|IN|UPDATE|SET|SAVEPOINT|COMMIT|ROLLBACK|DESC|BY|AND)\b/g,
      function (m, c, str, num, kw) {
        if (c) return '<span class="cm">' + c + '</span>';
        if (str) return '<span class="s">' + str + '</span>';
        if (num) return '<span class="n">' + num + '</span>';
        return '<span class="k">' + kw + '</span>';
      });
  }

  /* Hero: type query, then reveal results */
  var pre = $('#q'), code = $('code', pre), res = $('#res'), text = pre.getAttribute('data-text');
  if (still) { code.innerHTML = hl(text); res.classList.add('show'); }
  else {
    var n = 0;
    setTimeout(function tick() {
      code.innerHTML = hl(text.slice(0, ++n));
      if (n < text.length) setTimeout(tick, 26);
      else setTimeout(function () { res.classList.add('show'); }, 250);
    }, 600);
  }

  /* Interactive SQL workbench (illustrative sample tables and data) */
  var EX = [
    { t: 'JOIN', f: 'stock_report.sql', q: "-- sample tables: items, warehouses, stock\nSELECT i.sku, w.name, s.qty\nFROM   stock s\nJOIN   items i      ON i.id = s.item_id\nJOIN   warehouses w ON w.id = s.wh_id;", h: ['SKU', 'NAME', 'QTY'], r: [['A-100', 'BLR-01', 40], ['A-100', 'DEL-02', 15], ['B-200', 'BLR-01', 8]] },
    { t: 'GROUP BY', f: 'totals.sql', q: "SELECT wh_id, SUM(qty) AS total_qty\nFROM   stock\nGROUP BY wh_id\nHAVING SUM(qty) > 20;", h: ['WH_ID', 'TOTAL_QTY'], r: [[1, 48], [2, 35]] },
    { t: 'Subquery', f: 'unstocked.sql', q: "-- items with no stock rows\nSELECT sku\nFROM   items\nWHERE  id NOT IN (SELECT item_id FROM stock);", h: ['SKU'], r: [['C-300'], ['D-400']] },
    { t: 'CTE', f: 'cte_totals.sql', q: "WITH totals AS (\n  SELECT item_id, SUM(qty) AS qty\n  FROM   stock\n  GROUP BY item_id\n)\nSELECT i.sku, t.qty\nFROM   items i\nJOIN   totals t ON t.item_id = i.id;", h: ['SKU', 'QTY'], r: [['A-100', 55], ['B-200', 8]] },
    { t: 'Window function', f: 'ranking.sql', q: "SELECT sku, qty,\n       RANK() OVER (ORDER BY qty DESC) AS rnk\nFROM   stock_summary;", h: ['SKU', 'QTY', 'RNK'], r: [['A-100', 55, 1], ['E-500', 20, 2], ['B-200', 8, 3]] },
    { t: 'Transaction', f: 'adjust.sql', q: "UPDATE stock SET qty = qty - 5\nWHERE  item_id = 1 AND wh_id = 1;\nSAVEPOINT after_adjust;\n-- verify, then:\nCOMMIT;  -- or ROLLBACK TO after_adjust;", h: ['STATUS'], r: [['1 row updated'], ['Commit complete']] }
  ];
  var list = $('.wb-l'), btns = [], codeEl = $('#wbcode'), out = $('#wbout'), nameEl = $('#wbname');
  function show(i, focus) {
    var e = EX[i];
    codeEl.innerHTML = hl(e.q);
    nameEl.textContent = e.f;
    out.innerHTML = '<tr>' + e.h.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      e.r.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('');
    btns.forEach(function (b, j) { b.setAttribute('aria-selected', i === j); b.tabIndex = i === j ? 0 : -1; });
    if (!still) { var w = $('.wb-r'); w.classList.remove('fade'); void w.offsetWidth; w.classList.add('fade'); }
    if (focus) btns[i].focus();
  }
  EX.forEach(function (e, i) {
    var b = d.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = e.t;
    b.addEventListener('click', function () { show(i); });
    b.addEventListener('keydown', function (k) {
      var step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[k.key];
      if (step) { k.preventDefault(); show((i + step + EX.length) % EX.length, true); }
    });
    list.appendChild(b); btns.push(b);
  });
  show(0);

  /* Copy email */
  var copy = $('#copy');
  copy.addEventListener('click', function () {
    var label = $('span', copy), old = label.textContent, mail = copy.getAttribute('data-mail');
    function ok() { label.textContent = 'Copied ✓'; setTimeout(function () { label.textContent = old; }, 1800); }
    if (navigator.clipboard) navigator.clipboard.writeText(mail).then(ok, function () { location.href = 'mailto:' + mail; });
    else location.href = 'mailto:' + mail;
  });

  /* Project dialog */
  var dlg = $('#dlg');
  $('#open').addEventListener('click', function () { if (dlg.showModal) dlg.showModal(); });
  $('#close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  $('#yr').textContent = new Date().getFullYear();
})();