// WIDGET FLOTANTE - MESSENGER COMUNIDAD IDMC
(function () {
    if (document.getElementById('_cc_toggle')) return;
    var style = document.createElement('style');
    style.textContent = [
        '#_cc_toggle{position:fixed;bottom:24px;right:84px;z-index:9990;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 18px rgba(37,99,235,0.38);display:flex;align-items:center;justify-content:center;transition:box-shadow 0.2s,transform 0.18s;font-family:Poppins,sans-serif;}',
        '#_cc_toggle:hover{box-shadow:0 6px 24px rgba(37,99,235,0.52);transform:scale(1.07);}',
        '#_cc_toggle:active{transform:scale(0.95);}',
        '#_cc_toggle svg{width:22px;height:22px;flex-shrink:0;}',
        '#_cc_badge{position:absolute;top:-3px;right:-3px;min-width:17px;height:17px;background:#ef4444;border-radius:999px;font-size:0.62rem;font-weight:700;color:#fff;display:none;align-items:center;justify-content:center;padding:0 3px;border:2px solid #fff;}',
        '#_cc_panel{position:fixed;bottom:88px;right:84px;z-index:9989;width:500px;height:520px;background:#fff;border-radius:18px;box-shadow:0 20px 60px rgba(15,23,42,0.16);border:1px solid #e2e8f0;font-family:Poppins,sans-serif;display:flex;flex-direction:column;overflow:hidden;transform-origin:bottom right;transition:transform 0.22s cubic-bezier(.4,0,.2,1),opacity 0.22s ease;}',
        '#_cc_panel._cc_hidden{transform:scale(0.88) translateY(8px);opacity:0;pointer-events:none;}',
        '@media(max-width:560px){#_cc_panel{width:calc(100vw - 16px);right:8px;bottom:80px;height:85vh;}}',
        '#_cc_head{background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:11px 14px;display:flex;align-items:center;gap:10px;flex-shrink:0;}',
        '#_cc_head .cc-icon{width:32px;height:32px;border-radius:50%;flex-shrink:0;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;}',
        '#_cc_head .cc-icon svg{width:16px;height:16px;stroke:#fff;}',
        '#_cc_head .cc-info{flex:1;min-width:0;}',
        '#_cc_head .cc-title{font-size:0.84rem;font-weight:700;color:#fff;line-height:1.2;}',
        '#_cc_head .cc-sub{font-size:0.67rem;color:rgba(255,255,255,0.8);}',
        '#_cc_close{background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:0.84rem;transition:background 0.15s;flex-shrink:0;}',
        '#_cc_close:hover{background:rgba(255,255,255,0.28);}',
        '.cc-banner{padding:8px 12px;font-size:0.72rem;flex-shrink:0;display:none;}',
        '.cc-banner.cfg{background:#fefce8;border-bottom:1px solid #fde047;color:#713f12;}',
        '.cc-banner.login{background:#eff6ff;border-bottom:1px solid #bfdbfe;color:#1e40af;}',
        '.cc-banner a{font-weight:700;}',
        '#_cc_body{display:flex;flex:1;min-height:0;}',
        '#_cc_contacts{width:170px;flex-shrink:0;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;background:#f8fafc;}',
        '#_cc_search{padding:8px 10px;border-bottom:1px solid #e2e8f0;flex-shrink:0;}',
        '#_cc_search input{width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:5px 8px;font-family:Poppins,sans-serif;font-size:0.73rem;color:#1e293b;outline:none;background:#fff;box-sizing:border-box;}',
        '#_cc_search input:focus{border-color:#2563eb;}',
        '#_cc_list{flex:1;overflow-y:auto;padding:4px 0;}',
        '#_cc_list::-webkit-scrollbar{width:3px;}',
        '#_cc_list::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px;}',
        '.cc-contact{display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;transition:background 0.15s;}',
        '.cc-contact:hover{background:#e2e8f0;}',
        '.cc-contact.active{background:#dbeafe;}',
        '.cc-contact-av-wrap{position:relative;flex-shrink:0;}',
        '.cc-contact-av{width:34px;height:34px;border-radius:50%;object-fit:cover;background:#e2e8f0;border:2px solid #fff;}',
        '.cc-online-dot{position:absolute;bottom:1px;right:1px;width:9px;height:9px;border-radius:50%;background:#22c55e;border:2px solid #f8fafc;}',
        '.cc-contact-info{flex:1;min-width:0;}',
        '.cc-contact-name{font-size:0.72rem;font-weight:700;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.cc-contact-last{font-size:0.62rem;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.cc-contact-unread{min-width:16px;height:16px;border-radius:999px;background:#2563eb;color:#fff;font-size:0.58rem;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 3px;flex-shrink:0;}',
        '#_cc_no_contacts{padding:20px 10px;text-align:center;color:#94a3b8;font-size:0.72rem;}',
        '#_cc_conv{flex:1;min-width:0;display:flex;flex-direction:column;}',
        '#_cc_conv_head{padding:8px 12px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:8px;flex-shrink:0;background:#fff;}',
        '#_cc_conv_av{width:30px;height:30px;border-radius:50%;object-fit:cover;background:#e2e8f0;flex-shrink:0;}',
        '#_cc_conv_name{flex:1;font-size:0.8rem;font-weight:700;color:#1e293b;}',
        '#_cc_conv_status{font-size:0.65rem;color:#22c55e;font-weight:600;}',
        '#_cc_placeholder{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#94a3b8;}',
        '#_cc_placeholder svg{width:48px;height:48px;stroke:#cbd5e1;stroke-width:1.5;}',
        '#_cc_placeholder p{font-size:0.78rem;text-align:center;line-height:1.4;}',
        '#_cc_msgs{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;scroll-behavior:smooth;}',
        '#_cc_msgs::-webkit-scrollbar{width:4px;}',
        '#_cc_msgs::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px;}',
        '.ccm{display:flex;gap:7px;align-items:flex-end;max-width:85%;}',
        '.ccm.own{align-self:flex-end;flex-direction:row-reverse;}',
        '.ccm:not(.own){align-self:flex-start;}',
        '.ccm-av{width:24px;height:24px;border-radius:50%;object-fit:cover;background:#e2e8f0;flex-shrink:0;}',
        '.ccm-bubble{padding:7px 11px;border-radius:14px;font-size:0.78rem;line-height:1.45;word-break:break-word;max-width:100%;}',
        '.ccm:not(.own) .ccm-bubble{background:#f1f5f9;color:#1e293b;border-bottom-left-radius:3px;}',
        '.ccm.own .ccm-bubble{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border-bottom-right-radius:3px;}',
        '.ccm-time{font-size:0.58rem;color:#94a3b8;padding:0 2px;flex-shrink:0;align-self:flex-end;padding-bottom:3px;}',
        '#_cc_typing{padding:6px 12px;flex-shrink:0;display:none;align-items:center;gap:6px;}',
        '#_cc_typing .cc-dots span{width:5px;height:5px;border-radius:50%;background:#94a3b8;display:inline-block;animation:_cct 1.2s ease-in-out infinite;}',
        '#_cc_typing .cc-dots span:nth-child(2){animation-delay:0.2s;}',
        '#_cc_typing .cc-dots span:nth-child(3){animation-delay:0.4s;}',
        '@keyframes _cct{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-5px);}}',
        '.cc-dots{display:inline-flex;gap:3px;align-items:center;}',
        '#_cc_typing_txt{font-size:0.68rem;color:#94a3b8;}',
        '#_cc_form{padding:7px 10px;border-top:1px solid #e2e8f0;display:flex;gap:7px;align-items:flex-end;flex-shrink:0;}',
        '#_cc_input{flex:1;border:1px solid #e2e8f0;border-radius:10px;padding:7px 11px;font-family:Poppins,sans-serif;font-size:0.78rem;color:#1e293b;outline:none;resize:none;line-height:1.4;max-height:70px;overflow-y:auto;background:#f8fafc;transition:border-color 0.15s;}',
        '#_cc_input:focus{border-color:#2563eb;background:#fff;}',
        '#_cc_input:disabled{opacity:0.5;cursor:not-allowed;}',
        '#_cc_input::placeholder{color:#94a3b8;}',
        '#_cc_send{width:34px;height:34px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(37,99,235,0.3);transition:box-shadow 0.15s,transform 0.1s;}',
        '#_cc_send:hover{box-shadow:0 4px 12px rgba(37,99,235,0.45);}',
        '#_cc_send:active{transform:scale(0.92);}',
        '#_cc_send:disabled{opacity:0.45;cursor:not-allowed;}',
        '#_cc_send svg{width:13px;height:13px;}',
    ].join('');
    document.head.appendChild(style);

    function getSession() {
        try { var r = localStorage.getItem('sesionUsuario'); if (r) return JSON.parse(r); } catch (e) {}
        var n = localStorage.getItem('nombre') || localStorage.getItem('nombreUsuario') || null;
        var a = localStorage.getItem('perfilAvatar') || localStorage.getItem('avatar') || 'avatar-default.svg';
        if (localStorage.getItem('sesion') === 'activa' && n) return { nombre: n, avatar: a };
        return null;
    }
    var session = getSession();

    var toggle = document.createElement('button');
    toggle.id = '_cc_toggle';
    toggle.title = 'Mensajes';
    toggle.style.position = 'relative';
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span id="_cc_badge"></span>';
    document.body.appendChild(toggle);

    var panel = document.createElement('div');
    panel.id = '_cc_panel';
    panel.className = '_cc_hidden';
    panel.innerHTML = '<div id="_cc_head"><div class="cc-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><div class="cc-info"><div class="cc-title">Mensajes</div><div class="cc-sub" id="_cc_online_lbl">cargando...</div></div><button id="_cc_close" title="Cerrar">&#10005;</button></div><div class="cc-banner cfg" id="_cc_cfg">&#9888; Configura Firebase en <strong>firebase-config.js</strong>.</div><div class="cc-banner login" id="_cc_login_banner">Inicia sesion para chatear &nbsp;<a href="home.html">Entrar</a></div><div id="_cc_body"><div id="_cc_contacts"><div id="_cc_search"><input type="text" placeholder="Buscar..." id="_cc_searchinput"></div><div id="_cc_list"></div></div><div id="_cc_conv"><div id="_cc_conv_head" style="display:none;"><img id="_cc_conv_av" src="avatar-default.svg"><div style="flex:1;min-width:0;"><div id="_cc_conv_name">-</div><div id="_cc_conv_status"></div></div></div><div id="_cc_placeholder"><svg viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg><p>Selecciona un contacto<br>para comenzar a chatear</p></div><div id="_cc_msgs" style="display:none;"></div><div id="_cc_typing" style="display:none;"><div class="cc-dots"><span></span><span></span><span></span></div><span id="_cc_typing_txt"></span></div><div id="_cc_form" style="display:none;"><textarea id="_cc_input" rows="1" placeholder="Escribe un mensaje..." disabled></textarea><button id="_cc_send" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div></div></div>';
    document.body.appendChild(panel);

    var onlineLbl   = panel.querySelector('#_cc_online_lbl');
    var cfgEl       = panel.querySelector('#_cc_cfg');
    var loginBanner = panel.querySelector('#_cc_login_banner');
    var listEl      = panel.querySelector('#_cc_list');
    var searchInput = panel.querySelector('#_cc_searchinput');
    var convHead    = panel.querySelector('#_cc_conv_head');
    var convAv      = panel.querySelector('#_cc_conv_av');
    var convName    = panel.querySelector('#_cc_conv_name');
    var convStatus  = panel.querySelector('#_cc_conv_status');
    var placeholder = panel.querySelector('#_cc_placeholder');
    var msgsEl      = panel.querySelector('#_cc_msgs');
    var typingEl    = panel.querySelector('#_cc_typing');
    var typingTxt   = panel.querySelector('#_cc_typing_txt');
    var formEl      = panel.querySelector('#_cc_form');
    var inputEl     = panel.querySelector('#_cc_input');
    var sendBtn     = panel.querySelector('#_cc_send');

    toggle.addEventListener('click', function () { panel.classList.toggle('_cc_hidden'); });
    panel.querySelector('#_cc_close').addEventListener('click', function () { panel.classList.add('_cc_hidden'); });

    var cfg = (typeof IDMC_FIREBASE_CONFIG !== 'undefined') ? IDMC_FIREBASE_CONFIG : null;
    var configured = cfg && cfg.apiKey && !cfg.apiKey.startsWith('PEGA');

    if (!configured) {
        cfgEl.style.display = 'block';
        onlineLbl.textContent = 'sin configurar';
        listEl.innerHTML = '<div id="_cc_no_contacts">Configura Firebase para ver contactos</div>';
        return;
    }
    if (!session) {
        loginBanner.style.display = 'block';
        onlineLbl.textContent = 'sin sesion';
        listEl.innerHTML = '<div id="_cc_no_contacts">Inicia sesion para chatear</div>';
        return;
    }

    function loadScript(src, cb) { var s = document.createElement('script'); s.src = src; s.onload = cb; document.head.appendChild(s); }
    loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js', function () {
        loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js', function () { initMessenger(); });
    });

    function initMessenger() {
        var app;
        try { app = firebase.app(); } catch (e) { app = firebase.initializeApp(cfg); }
        var db = firebase.database(app);
        var myKey = btoa(unescape(encodeURIComponent(session.nombre))).replace(/[^a-zA-Z0-9]/g,'');
        var onlineRef = db.ref('chat/online');
        var myOnlineRef = db.ref('chat/online/' + myKey);
        var allUsersRef = db.ref('comunidad_usuarios');
        var activeConvo = null;
        var onlineUsers = {};
        var allUsers = {};
        var unreadCounts = {};

        myOnlineRef.set({ nombre: session.nombre, avatar: session.avatar || 'avatar-default.svg', t: firebase.database.ServerValue.TIMESTAMP });
        myOnlineRef.onDisconnect().remove();
        allUsersRef.child(myKey).set({ nombre: session.nombre, avatar: session.avatar || 'avatar-default.svg' });

        onlineRef.on('value', function (snap) {
            onlineUsers = snap.exists() ? snap.val() : {};
            onlineLbl.textContent = Object.keys(onlineUsers).length + ' en linea';
            renderContactList();
        });
        allUsersRef.on('value', function (snap) {
            allUsers = snap.exists() ? snap.val() : {};
            renderContactList();
        });

        function convoKey(a, b) { return [a, b].sort().join('__'); }
        function fmtTime(ts) { if (!ts) return ''; var d = new Date(ts); return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0'); }
        function escH(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

        function renderContactList() {
            var q = (searchInput.value || '').toLowerCase().trim();
            var contacts = [];
            Object.keys(allUsers).forEach(function (k) {
                var u = allUsers[k];
                if (k === myKey) return;
                if (q && !u.nombre.toLowerCase().includes(q)) return;
                contacts.push({ key: k, nombre: u.nombre, avatar: u.avatar || 'avatar-default.svg', online: !!onlineUsers[k] });
            });
            contacts.sort(function (a, b) { return (b.online ? 1 : 0) - (a.online ? 1 : 0) || a.nombre.localeCompare(b.nombre); });
            listEl.innerHTML = '';
            if (!contacts.length) {
                listEl.innerHTML = '<div id="_cc_no_contacts">' + (q ? 'Sin resultados' : 'Aun no hay otros usuarios') + '</div>';
                return;
            }
            contacts.forEach(function (c) {
                var item = document.createElement('div');
                item.className = 'cc-contact' + (activeConvo && activeConvo.nombre === c.nombre ? ' active' : '');
                item.innerHTML = '<div class="cc-contact-av-wrap"><img class="cc-contact-av" src="' + escH(c.avatar) + '" onerror="this.src=\'avatar-default.svg\'">' + (c.online ? '<span class="cc-online-dot"></span>' : '') + '</div><div class="cc-contact-info"><div class="cc-contact-name">' + escH(c.nombre) + '</div><div class="cc-contact-last">' + (c.online ? 'En linea' : 'Desconectado') + '</div></div>' + (unreadCounts[c.key] ? '<span class="cc-contact-unread">' + unreadCounts[c.key] + '</span>' : '');
                item.addEventListener('click', function () { openConvo(c); });
                listEl.appendChild(item);
            });
        }
        searchInput.addEventListener('input', renderContactList);

        function openConvo(contact) {
            if (activeConvo) {
                if (activeConvo.msgsRef) activeConvo.msgsRef.off();
                if (activeConvo.typingRef) activeConvo.typingRef.off();
                if (activeConvo.myTypingRef) activeConvo.myTypingRef.remove();
            }
            activeConvo = { nombre: contact.nombre, avatar: contact.avatar, key: contact.key, ck: convoKey(myKey, contact.key) };
            delete unreadCounts[contact.key];
            updateBadge();
            convHead.style.display = 'flex';
            convAv.src = contact.avatar;
            convAv.onerror = function () { convAv.src = 'avatar-default.svg'; };
            convName.textContent = contact.nombre;
            convStatus.textContent = contact.online ? 'En linea' : 'Desconectado';
            placeholder.style.display = 'none';
            msgsEl.style.display = 'flex';
            formEl.style.display = 'flex';
            inputEl.disabled = false;
            sendBtn.disabled = false;
            msgsEl.innerHTML = '';
            renderContactList();
            var ck = activeConvo.ck;
            var msgsRef = db.ref('chat_dm/' + ck + '/mensajes');
            var typingRef = db.ref('chat_dm/' + ck + '/typing');
            var myTypingRef = typingRef.child(myKey);
            activeConvo.msgsRef = msgsRef;
            activeConvo.typingRef = typingRef;
            activeConvo.myTypingRef = myTypingRef;
            msgsRef.on('value', function (snap) {
                msgsEl.innerHTML = '';
                if (!snap.exists()) return;
                Object.values(snap.val()).forEach(function (m) { appendMsg(m); });
                msgsEl.scrollTop = msgsEl.scrollHeight;
            });
            typingRef.on('value', function (snap) {
                if (!snap.exists()) { typingEl.style.display = 'none'; return; }
                var others = Object.values(snap.val()).filter(function (t) { return t.nombre !== session.nombre && Date.now() - t.t < 4000; });
                if (!others.length) { typingEl.style.display = 'none'; return; }
                typingEl.style.display = 'flex';
                typingTxt.textContent = others[0].nombre + ' escribe...';
            });
            inputEl.focus();
        }

        function watchIncoming(theirKey) {
            var ck = convoKey(myKey, theirKey);
            db.ref('chat_dm/' + ck + '/mensajes').on('child_added', function (snap) {
                var m = snap.val();
                if (m && m.de === theirKey && !(activeConvo && activeConvo.key === theirKey)) {
                    unreadCounts[theirKey] = (unreadCounts[theirKey] || 0) + 1;
                    updateBadge();
                    renderContactList();
                }
            });
        }
        function updateBadge() {
            var total = Object.values(unreadCounts).reduce(function (a, b) { return a + b; }, 0);
            var badge = document.getElementById('_cc_badge');
            if (badge) { badge.textContent = total || ''; badge.style.display = total > 0 ? 'flex' : 'none'; }
        }
        onlineRef.on('child_added', function (snap) { if (snap.key !== myKey) watchIncoming(snap.key); });

        function appendMsg(m) {
            var own = (m.de === myKey);
            var wrap = document.createElement('div'); wrap.className = 'ccm' + (own ? ' own' : '');
            var av = document.createElement('img'); av.className = 'ccm-av'; av.src = m.avatar || 'avatar-default.svg'; av.onerror = function () { av.src = 'avatar-default.svg'; };
            var bubble = document.createElement('div'); bubble.className = 'ccm-bubble'; bubble.textContent = m.texto;
            var time = document.createElement('div'); time.className = 'ccm-time'; time.textContent = fmtTime(m.ts);
            if (own) { wrap.appendChild(bubble); wrap.appendChild(time); wrap.appendChild(av); }
            else { wrap.appendChild(av); wrap.appendChild(bubble); wrap.appendChild(time); }
            msgsEl.appendChild(wrap);
        }

        var typingTimer = null;
        inputEl.addEventListener('input', function () {
            if (!activeConvo || !activeConvo.myTypingRef) return;
            activeConvo.myTypingRef.set({ nombre: session.nombre, t: Date.now() });
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function () { if (activeConvo && activeConvo.myTypingRef) activeConvo.myTypingRef.remove(); }, 2500);
        });

        function sendMsg() {
            if (!activeConvo) return;
            var texto = inputEl.value.trim();
            if (!texto) return;
            inputEl.value = ''; inputEl.style.height = '';
            if (activeConvo.myTypingRef) activeConvo.myTypingRef.remove();
            activeConvo.msgsRef.push({ de: myKey, para: activeConvo.key, nombre: session.nombre, avatar: session.avatar || 'avatar-default.svg', texto: texto, ts: firebase.database.ServerValue.TIMESTAMP });
        }
        sendBtn.addEventListener('click', sendMsg);
        inputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } });
        inputEl.addEventListener('input', function () { this.style.height = ''; this.style.height = Math.min(this.scrollHeight, 70) + 'px'; });
    }
})();