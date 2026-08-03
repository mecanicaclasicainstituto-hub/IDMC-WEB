// ===== CHAT DE SOPORTE FLOTANTE =====
(function () {
    if (document.getElementById('_chat_panel')) return;

    // ---- CSS ----
    var style = document.createElement('style');
    style.textContent = [
        /* Boton flotante */
        '#_chat_toggle{',
            'position:fixed;bottom:24px;right:88px;z-index:9990;',
            'width:52px;height:52px;border-radius:50%;',
            'background:linear-gradient(135deg,#0ea5e9,#0284c7);',
            'color:#fff;border:none;cursor:pointer;',
            'box-shadow:0 4px 18px rgba(14,165,233,0.38),0 1px 4px rgba(14,165,233,0.18);',
            'display:flex;align-items:center;justify-content:center;',
            'transition:box-shadow 0.2s,transform 0.18s;',
            'font-family:Poppins,sans-serif;',
        '}',
        '#_chat_toggle:hover{box-shadow:0 6px 24px rgba(14,165,233,0.52),0 2px 6px rgba(14,165,233,0.25);transform:scale(1.07);}',
        '#_chat_toggle:active{transform:scale(0.95);}',
        '#_chat_toggle svg{width:22px;height:22px;flex-shrink:0;}',

        /* Burbuja de notificacion */
        '#_chat_badge{',
            'position:absolute;top:-2px;right:-2px;',
            'width:16px;height:16px;border-radius:50%;',
            'background:#e11d48;color:#fff;font-size:0.6rem;font-weight:700;',
            'display:none;align-items:center;justify-content:center;',
            'border:2px solid #fff;font-family:Poppins,sans-serif;',
            'pointer-events:none;',
        '}',

        /* Panel */
        '#_chat_panel{',
            'position:fixed;bottom:88px;right:88px;z-index:9989;',
            'width:320px;background:#fff;border-radius:20px;',
            'box-shadow:0 20px 60px rgba(15,23,42,0.14),0 4px 16px rgba(15,23,42,0.06);',
            'border:1px solid #e2e8f0;font-family:Poppins,sans-serif;',
            'display:flex;flex-direction:column;overflow:hidden;',
            'transform-origin:bottom right;',
            'transition:transform 0.22s cubic-bezier(.4,0,.2,1),opacity 0.22s ease;',
            'max-height:480px;',
        '}',
        '#_chat_panel._chat_hidden{transform:scale(0.88) translateY(8px);opacity:0;pointer-events:none;}',

        /* Cabecera */
        '#_chat_head{',
            'background:#fff;padding:13px 14px 12px;',
            'display:flex;align-items:center;gap:10px;',
            'border-bottom:1px solid #e2e8f0;flex-shrink:0;',
        '}',
        '#_chat_head .ch-avatar{',
            'width:34px;height:34px;border-radius:50%;flex-shrink:0;',
            'background:linear-gradient(135deg,#0ea5e9,#0284c7);',
            'display:flex;align-items:center;justify-content:center;color:#fff;',
        '}',
        '#_chat_head .ch-info{flex:1;min-width:0;}',
        '#_chat_head .ch-name{font-size:0.84rem;font-weight:700;color:#1e293b;line-height:1.2;}',
        '#_chat_head .ch-status{font-size:0.7rem;color:#22c55e;font-weight:600;display:flex;align-items:center;gap:4px;}',
        '#_chat_head .ch-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;}',
        '#_chat_close{',
            'background:none;border:none;color:#94a3b8;cursor:pointer;',
            'font-size:1rem;padding:3px 6px;border-radius:6px;',
            'transition:color 0.15s,background 0.15s;flex-shrink:0;',
        '}',
        '#_chat_close:hover{color:#1e293b;background:#f1f5f9;}',

        /* Mensajes */
        '#_chat_msgs{',
            'flex:1;overflow-y:auto;padding:14px 12px;',
            'display:flex;flex-direction:column;gap:10px;',
            'scroll-behavior:smooth;',
        '}',
        '#_chat_msgs::-webkit-scrollbar{width:4px;}',
        '#_chat_msgs::-webkit-scrollbar-track{background:transparent;}',
        '#_chat_msgs::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px;}',

        '.cm{display:flex;flex-direction:column;max-width:82%;}',
        '.cm.bot{align-self:flex-start;}',
        '.cm.usr{align-self:flex-end;}',

        '.cm-bubble{',
            'padding:9px 13px;border-radius:16px;font-size:0.82rem;',
            'line-height:1.45;word-break:break-word;',
        '}',
        '.cm.bot .cm-bubble{',
            'background:#f1f5f9;color:#1e293b;',
            'border-bottom-left-radius:4px;',
        '}',
        '.cm.usr .cm-bubble{',
            'background:linear-gradient(135deg,#0ea5e9,#0284c7);',
            'color:#fff;border-bottom-right-radius:4px;',
        '}',
        '.cm-time{font-size:0.65rem;color:#94a3b8;margin-top:3px;padding:0 2px;}',
        '.cm.usr .cm-time{text-align:right;}',

        /* Typing indicator */
        '#_chat_typing{',
            'display:none;align-self:flex-start;',
            'padding:9px 14px;background:#f1f5f9;border-radius:16px;border-bottom-left-radius:4px;',
            'gap:4px;align-items:center;',
        '}',
        '#_chat_typing span{',
            'width:6px;height:6px;border-radius:50%;background:#94a3b8;display:inline-block;',
            'animation:_ct 1.2s ease-in-out infinite;',
        '}',
        '#_chat_typing span:nth-child(2){animation-delay:0.2s;}',
        '#_chat_typing span:nth-child(3){animation-delay:0.4s;}',
        '@keyframes _ct{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-5px);}}',

        /* Input */
        '#_chat_form{',
            'padding:10px 10px;border-top:1px solid #e2e8f0;',
            'display:flex;gap:8px;align-items:flex-end;flex-shrink:0;',
        '}',
        '#_chat_input{',
            'flex:1;border:1px solid #e2e8f0;border-radius:12px;',
            'padding:9px 12px;font-family:Poppins,sans-serif;font-size:0.82rem;',
            'color:#1e293b;outline:none;resize:none;line-height:1.4;',
            'max-height:100px;overflow-y:auto;background:#f8fafc;',
            'transition:border-color 0.15s,background 0.15s;',
        '}',
        '#_chat_input:focus{border-color:#0ea5e9;background:#fff;}',
        '#_chat_input::placeholder{color:#94a3b8;}',
        '#_chat_send{',
            'width:38px;height:38px;border-radius:50%;flex-shrink:0;',
            'background:linear-gradient(135deg,#0ea5e9,#0284c7);',
            'color:#fff;border:none;cursor:pointer;',
            'display:flex;align-items:center;justify-content:center;',
            'box-shadow:0 2px 8px rgba(14,165,233,0.3);',
            'transition:box-shadow 0.15s,transform 0.1s;',
        '}',
        '#_chat_send:hover{box-shadow:0 4px 12px rgba(14,165,233,0.45);}',
        '#_chat_send:active{transform:scale(0.92);}',
        '#_chat_send svg{width:16px;height:16px;}',
        '@media(max-width:768px){',
            '#_chat_panel{right:12px;width:calc(100vw - 24px);bottom:88px;max-height:calc(100vh - 110px);}',
        '}',
    ].join('');
    document.head.appendChild(style);

    // ---- Boton flotante ----
    var toggleWrap = document.createElement('div');
    toggleWrap.style.cssText = 'position:fixed;bottom:24px;right:144px;z-index:9990;';

    var toggle = document.createElement('button');
    toggle.id = '_chat_toggle';
    toggle.title = 'Soporte';
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>';

    var badge = document.createElement('div');
    badge.id = '_chat_badge';
    badge.textContent = '1';

    toggleWrap.appendChild(toggle);
    toggleWrap.appendChild(badge);
    document.body.appendChild(toggleWrap);

    // ---- Panel ----
    var panel = document.createElement('div');
    panel.id = '_chat_panel';
    panel.className = '_chat_hidden';

    // Cabecera
    var headHTML = [
        '<div id="_chat_head">',
          '<div class="ch-avatar">',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px">',
              '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>',
              '<circle cx="12" cy="7" r="4"/>',
            '</svg>',
          '</div>',
          '<div class="ch-info">',
            '<div class="ch-name">Soporte IDMC</div>',
            '<div class="ch-status"><span class="ch-dot"></span>En linea</div>',
          '</div>',
          '<button id="_chat_close" title="Cerrar">\u2715</button>',
        '</div>',
    ].join('');

    // Mensajes
    var msgsHTML = '<div id="_chat_msgs"><div id="_chat_typing"><span></span><span></span><span></span></div></div>';

    // Form
    var formHTML = [
        '<div id="_chat_form">',
          '<textarea id="_chat_input" rows="1" placeholder="Escribe tu mensaje..."></textarea>',
          '<button id="_chat_send" title="Enviar">',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
              '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
            '</svg>',
          '</button>',
        '</div>',
    ].join('');

    panel.innerHTML = headHTML + msgsHTML + formHTML;
    document.body.appendChild(panel);

    // ---- Referencias ----
    var msgsEl   = panel.querySelector('#_chat_msgs');
    var inputEl  = panel.querySelector('#_chat_input');
    var sendEl   = panel.querySelector('#_chat_send');
    var closeEl  = panel.querySelector('#_chat_close');
    var typingEl = panel.querySelector('#_chat_typing');

    // ---- Historial en localStorage ----
    var STORE_KEY = 'idmc_chat_history';
    var history   = [];
    try { history = JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch(e) {}

    function saveHistory() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-60))); } catch(e) {}
    }

    function nowTime() {
        var d = new Date();
        return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
    }

    function addBubble(text, who, time) {
        var wrap = document.createElement('div');
        wrap.className = 'cm ' + who;
        var bubble = document.createElement('div');
        bubble.className = 'cm-bubble';
        bubble.textContent = text;
        var t = document.createElement('div');
        t.className = 'cm-time';
        t.textContent = time || nowTime();
        wrap.appendChild(bubble);
        wrap.appendChild(t);
        msgsEl.insertBefore(wrap, typingEl);
        msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    // Cargar historial previo
    if (history.length === 0) {
        // Mensaje de bienvenida
        var welcome = {
            text: 'Hola! \ud83d\udc4b Soy el soporte de IDMC. Escribe tu consulta y te responderemos a la brevedad.',
            who: 'bot',
            time: nowTime()
        };
        history.push(welcome);
        saveHistory();
    }
    history.forEach(function(m) { addBubble(m.text, m.who, m.time); });

    // Respuesta automatica de confirmacion
    var BOT_REPLY = 'Gracias por tu mensaje \u2728 Lo hemos recibido y te responderemos pronto. Si es urgente, escríbenos a contacto@idmc.mx';

    function sendMessage() {
        var text = inputEl.value.trim();
        if (!text) return;
        inputEl.value = '';
        inputEl.style.height = '';

        var t = nowTime();
        addBubble(text, 'usr', t);
        history.push({ text: text, who: 'usr', time: t });
        saveHistory();

        // Ocultar badge si estaba visible
        badge.style.display = 'none';

        // Typing indicator
        typingEl.style.display = 'flex';
        msgsEl.scrollTop = msgsEl.scrollHeight;

        setTimeout(function () {
            typingEl.style.display = 'none';
            var bt = nowTime();
            addBubble(BOT_REPLY, 'bot', bt);
            history.push({ text: BOT_REPLY, who: 'bot', time: bt });
            saveHistory();
        }, 1400);
    }

    // Auto-resize textarea
    inputEl.addEventListener('input', function () {
        this.style.height = '';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    sendEl.addEventListener('click', sendMessage);

    // Abrir / cerrar
    toggle.addEventListener('click', function () {
        panel.classList.toggle('_chat_hidden');
        if (!panel.classList.contains('_chat_hidden')) {
            badge.style.display = 'none';
            setTimeout(function () { inputEl.focus(); }, 250);
            msgsEl.scrollTop = msgsEl.scrollHeight;
        }
    });
    closeEl.addEventListener('click', function () {
        panel.classList.add('_chat_hidden');
    });

    // Mostrar badge con mensaje de bienvenida al cargar (primera vez)
    if (history.length <= 1) {
        badge.style.display = 'flex';
    }

})();