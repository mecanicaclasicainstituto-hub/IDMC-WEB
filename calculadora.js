// ===== CALCULADORA CIENTIFICA FLOTANTE =====
(function () {
    if (document.getElementById('_calc_panel')) return;

    // ---- CSS ----
    var style = document.createElement('style');
    style.textContent = [
        '#_calc_toggle{',
            'position:fixed;bottom:24px;right:24px;z-index:9990;',
            'width:52px;height:52px;border-radius:50%;',
            'background:linear-gradient(135deg,#2563eb,#1d4ed8);',
            'color:#fff;border:none;cursor:pointer;',
            'font-size:0.78rem;font-weight:700;letter-spacing:0.02em;',
            'box-shadow:0 4px 18px rgba(37,99,235,0.38),0 1px 4px rgba(37,99,235,0.18);',
            'display:flex;align-items:center;justify-content:center;',
            'transition:box-shadow 0.2s,transform 0.18s;',
            'font-family:Poppins,sans-serif;',
        '}',
        '#_calc_toggle:hover{box-shadow:0 6px 24px rgba(37,99,235,0.5),0 2px 6px rgba(37,99,235,0.25);transform:scale(1.07);}',
        '#_calc_toggle:active{transform:scale(0.95);}',

        '#_calc_panel{',
            'position:fixed;bottom:88px;right:24px;z-index:9989;',
            'width:304px;background:#fff;border-radius:20px;',
            'box-shadow:0 20px 60px rgba(15,23,42,0.14),0 4px 16px rgba(15,23,42,0.06);',
            'border:1px solid #e2e8f0;font-family:Poppins,sans-serif;',
            'overflow:hidden;transform-origin:bottom right;',
            'transition:transform 0.22s cubic-bezier(.4,0,.2,1),opacity 0.22s ease;',
        '}',
        '#_calc_panel._calc_hidden{transform:scale(0.88) translateY(8px);opacity:0;pointer-events:none;}',

        '._calc_head{',
            'background:#fff;padding:12px 14px 11px;',
            'display:flex;align-items:center;justify-content:space-between;',
            'border-bottom:1px solid #e2e8f0;',
        '}',
        '._calc_head span{color:#1e40af;font-size:0.84rem;font-weight:700;letter-spacing:0.03em;}',
        '._calc_head button{',
            'background:none;border:none;color:#94a3b8;',
            'cursor:pointer;font-size:1rem;line-height:1;padding:3px 7px;border-radius:6px;',
            'transition:color 0.15s,background 0.15s;',
        '}',
        '._calc_head button:hover{color:#1e293b;background:#f1f5f9;}',

        '._calc_disp{background:#f8fafc;padding:10px 16px 10px;border-bottom:1px solid #e2e8f0;}',
        '._calc_toprow{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;}',
        '._calc_expr{',
            'color:#94a3b8;font-size:0.75rem;text-align:right;min-height:17px;flex:1;',
            'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
            'font-family:"Courier New",monospace;',
        '}',
        '._calc_res{',
            'color:#1e293b;font-size:1.65rem;font-weight:700;text-align:right;',
            'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
            'font-family:"Courier New",monospace;min-height:38px;',
        '}',

        '#_calc_degbtn{',
            'flex-shrink:0;font-size:0.65rem;font-weight:700;letter-spacing:0.05em;',
            'padding:3px 8px;border-radius:20px;cursor:pointer;border:1px solid #bfdbfe;',
            'background:#eff6ff;color:#1d4ed8;',
            'transition:background 0.15s,color 0.15s,border-color 0.15s;',
            'font-family:Poppins,sans-serif;',
        '}',
        '#_calc_degbtn:hover{background:#dbeafe;}',
        '#_calc_degbtn.rad{background:#f1f5f9;color:#475569;border-color:#cbd5e1;}',
        '#_calc_degbtn.rad:hover{background:#e2e8f0;}',

        '._calc_grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px;}',

        '._cb{',
            'border:1px solid #e2e8f0;cursor:pointer;font-family:Poppins,sans-serif;',
            'font-size:0.84rem;font-weight:600;padding:12px 4px;border-radius:11px;',
            'background:#fff;color:#1e293b;',
            'transition:background 0.13s,transform 0.1s,border-color 0.13s;',
        '}',
        '._cb:hover{background:#f8fafc;border-color:#cbd5e1;}',
        '._cb:active{transform:scale(0.92);}',

        '._cb.fn{background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe;}',
        '._cb.fn:hover{background:#dbeafe;border-color:#93c5fd;}',

        '._cb.op{background:#f1f5f9;color:#334155;border-color:#e2e8f0;}',
        '._cb.op:hover{background:#e2e8f0;border-color:#cbd5e1;}',

        '._cb.act{',
            'background:linear-gradient(135deg,#2563eb,#1d4ed8);',
            'color:#fff;border-color:transparent;',
            'box-shadow:0 3px 10px rgba(37,99,235,0.3);',
        '}',
        '._cb.act:hover{background:linear-gradient(135deg,#1d4ed8,#1e40af);box-shadow:0 4px 14px rgba(37,99,235,0.4);}',

        '._cb.clr{background:#fff1f2;color:#e11d48;border-color:#fecdd3;}',
        '._cb.clr:hover{background:#ffe4e6;border-color:#fda4af;}',
    ].join('');
    document.head.appendChild(style);

    // ---- Boton flotante ----
    var toggle = document.createElement('button');
    toggle.id = '_calc_toggle';
    toggle.title = 'Calculadora cientifica';
    toggle.textContent = 'Calc';
    document.body.appendChild(toggle);

    // ---- Panel ----
    var panel = document.createElement('div');
    panel.id = '_calc_panel';
    panel.className = '_calc_hidden';

    // Cabecera
    var head = document.createElement('div');
    head.className = '_calc_head';
    head.innerHTML = '<span>Calculadora cient\u00edfica</span>';
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '\u2715';
    closeBtn.title = 'Cerrar';
    head.appendChild(closeBtn);

    // Display
    var disp = document.createElement('div');
    disp.className = '_calc_disp';

    var topRow = document.createElement('div');
    topRow.className = '_calc_toprow';

    var exprEl = document.createElement('div');
    exprEl.className = '_calc_expr';
    exprEl.id = '_ce';

    var degBtn = document.createElement('button');
    degBtn.id = '_calc_degbtn';
    degBtn.textContent = 'DEG';
    degBtn.title = 'Cambiar entre grados y radianes';

    topRow.appendChild(exprEl);
    topRow.appendChild(degBtn);

    var resEl = document.createElement('div');
    resEl.className = '_calc_res';
    resEl.id = '_cr';
    resEl.textContent = '0';

    disp.appendChild(topRow);
    disp.appendChild(resEl);

    // Grid
    var grid = document.createElement('div');
    grid.className = '_calc_grid';

    panel.appendChild(head);
    panel.appendChild(disp);
    panel.appendChild(grid);
    document.body.appendChild(panel);

    // ---- Definicion de botones ----
    var BTNS = [
        { l: 'C',   a: 'clear',               c: 'clr' },
        { l: '(',   a: 'i:(',                 c: 'fn'  },
        { l: ')',   a: 'i:)',                 c: 'fn'  },
        { l: 'DEL', a: 'del',                 c: 'clr' },

        { l: 'sin', a: 'i:sin(',             c: 'fn'  },
        { l: 'cos', a: 'i:cos(',             c: 'fn'  },
        { l: 'tan', a: 'i:tan(',             c: 'fn'  },
        { l: 'xy',  a: 'i:**',               c: 'fn'  },

        { l: 'log', a: 'i:log(',             c: 'fn'  },
        { l: 'ln',  a: 'i:ln(',              c: 'fn'  },
        { l: '\u221a',   a: 'i:sqrt(',            c: 'fn'  },
        { l: '\u03c0',   a: 'i:3.14159265358979', c: 'fn'  },

        { l: '7',   a: 'i:7',                c: ''    },
        { l: '8',   a: 'i:8',                c: ''    },
        { l: '9',   a: 'i:9',                c: ''    },
        { l: '\u00f7',   a: 'i:/',                c: 'op'  },

        { l: '4',   a: 'i:4',                c: ''    },
        { l: '5',   a: 'i:5',                c: ''    },
        { l: '6',   a: 'i:6',                c: ''    },
        { l: '\u00d7',   a: 'i:*',                c: 'op'  },

        { l: '1',   a: 'i:1',                c: ''    },
        { l: '2',   a: 'i:2',                c: ''    },
        { l: '3',   a: 'i:3',                c: ''    },
        { l: '\u2212',   a: 'i:-',                c: 'op'  },

        { l: '0',   a: 'i:0',                c: ''    },
        { l: '.',   a: 'i:.',                c: ''    },
        { l: '=',   a: 'equals',             c: 'act' },
        { l: '+',   a: 'i:+',                c: 'op'  },
    ];

    // ---- Estado ----
    var expr    = '';
    var lastRes = '0';
    var evaled  = false;
    var degMode = true;

    function updateDisplay() {
        document.getElementById('_ce').textContent = expr;
        document.getElementById('_cr').textContent = lastRes;
    }

    // ---- Calculo seguro ----
    function safeCalc(str) {
        var s = str;
        if (degMode) {
            s = s
                .replace(/sin\(/g, '_sd(')
                .replace(/cos\(/g, '_cd(')
                .replace(/tan\(/g, '_td(');
        } else {
            s = s
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(');
        }
        s = s
            .replace(/log\(/g,  'Math.log10(')
            .replace(/ln\(/g,   'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(');

        var cleaned = s
            .replace(/Math\.[a-z0-9]+\(/g, '')
            .replace(/_[sct]d\(/g, '')
            .replace(/[0-9+\-*/.() e]/g, '');
        if (cleaned.length > 0) return 'Error';

        try {
            var body = degMode
                ? '"use strict";' +
                  'var _r=Math.PI/180;' +
                  'var _sd=function(x){return Math.sin(x*_r);};' +
                  'var _cd=function(x){return Math.cos(x*_r);};' +
                  'var _td=function(x){return Math.tan(x*_r);};' +
                  'return (' + s + ');'
                : '"use strict"; return (' + s + ');';

            var result = new Function(body)();
            if (typeof result !== 'number' || !isFinite(result)) return 'Error';
            return String(parseFloat(result.toPrecision(12)));
        } catch (e) {
            return 'Error';
        }
    }

    // ---- Manejador de acciones ----
    function handle(action) {
        if (action === 'clear') {
            expr = ''; lastRes = '0'; evaled = false;
        } else if (action === 'del') {
            if (evaled) { expr = ''; lastRes = '0'; evaled = false; }
            else expr = expr.slice(0, -1);
        } else if (action === 'equals') {
            if (!expr) return;
            var r = safeCalc(expr);
            lastRes = r;
            if (r !== 'Error') { expr = r; evaled = true; }
            else { evaled = false; }
        } else if (action.indexOf('i:') === 0) {
            var val = action.slice(2);
            if (evaled && /^[0-9.(]/.test(val)) expr = '';
            evaled = false;
            expr += val;
            var preview = safeCalc(expr);
            if (preview !== 'Error') lastRes = preview;
        }
        updateDisplay();
    }

    // ---- Renderizar botones ----
    BTNS.forEach(function (b) {
        var btn = document.createElement('button');
        btn.className = '_cb' + (b.c ? ' ' + b.c : '');
        btn.textContent = b.l;
        btn.addEventListener('click', function () { handle(b.a); });
        grid.appendChild(btn);
    });

    // ---- Toggle DEG/RAD ----
    degBtn.addEventListener('click', function () {
        degMode = !degMode;
        degBtn.textContent = degMode ? 'DEG' : 'RAD';
        degBtn.className   = degMode ? '' : 'rad';
        if (expr) {
            var p = safeCalc(expr);
            if (p !== 'Error') { lastRes = p; updateDisplay(); }
        }
    });

    // ---- Teclado ----
    document.addEventListener('keydown', function (e) {
        if (panel.classList.contains('_calc_hidden')) return;
        var k = e.key;
        if (k === 'Escape')             { panel.classList.add('_calc_hidden'); return; }
        if (k === 'Enter' || k === '=') { e.preventDefault(); handle('equals'); return; }
        if (k === 'Backspace')          { handle('del'); return; }
        if (/^[0-9+\-*/.()]$/.test(k)) { handle('i:' + k); return; }
    });

    // ---- Abrir / cerrar ----
    toggle.addEventListener('click', function () {
        panel.classList.toggle('_calc_hidden');
    });
    closeBtn.addEventListener('click', function () {
        panel.classList.add('_calc_hidden');
    });

})();