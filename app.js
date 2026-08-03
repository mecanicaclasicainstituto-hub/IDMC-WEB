// ==== RESALTAR ENLACE ACTIVO EN SIDEBAR ====
(function () {
    function marcarNavActivo() {
        var pagina = location.pathname.split('/').pop() || 'index.html';
        var links = document.querySelectorAll('.sidebar ul li a');
        links.forEach(function (a) {
            var href = (a.getAttribute('href') || '').split('/').pop();
            if (href && pagina === href) {
                a.classList.add('nav-active');
            } else {
                a.classList.remove('nav-active');
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', marcarNavActivo);
    } else {
        marcarNavActivo();
    }
})();

// ==== MENÚ HAMBURGUESA MÓVIL (aplica en todas las páginas con sidebar) ====
(function () {
    function initHamburger() {
        var sidebar = document.querySelector('.sidebar');
        var topbarLeft = document.querySelector('.topbar-left');
        if (!sidebar || !topbarLeft) return;
        // Evitar duplicar si ya existe
        if (document.getElementById('hamburgerBtn')) return;

        // Inyectar overlay
        var overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebarOverlay';
        var container = document.querySelector('.container');
        if (container && container.parentNode) {
            container.parentNode.insertBefore(overlay, container);
        } else {
            document.body.insertBefore(overlay, document.body.firstChild);
        }

        // Inyectar botón hamburguesa al inicio de topbar-left
        var btn = document.createElement('button');
        btn.className = 'hamburger-btn';
        btn.id = 'hamburgerBtn';
        btn.setAttribute('aria-label', 'Abrir menú');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span></span><span></span><span></span>';
        topbarLeft.insertBefore(btn, topbarLeft.firstChild);

        // Toggle logic
        function openSidebar() {
            sidebar.classList.add('open');
            overlay.classList.add('show');
            btn.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        btn.addEventListener('click', function () {
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });
        overlay.addEventListener('click', closeSidebar);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeSidebar();
        });
        // Cerrar al navegar desde un link del sidebar
        sidebar.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeSidebar);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHamburger);
    } else {
        initHamburger();
    }
}());

// ==== CONFIG FIREBASE (compartida con widgets) ====
(function () {
    var s = document.createElement('script');
    s.src = 'firebase-config.js';
    document.head.appendChild(s);
})();

// ==== CALCULADORA CIENTÍFICA FLOTANTE ====
(function () {
    var s = document.createElement('script');
    s.src = 'calculadora.js';
    s.defer = true;
    document.head.appendChild(s);
})();

// ==== CHAT DE SOPORTE FLOTANTE ====
(function () {
    var s = document.createElement('script');
    s.src = 'chat.js';
    s.defer = true;
    document.head.appendChild(s);
})();



// ==== MODAL PERSONALIZADO (reemplaza alert nativo) ====
(function () {
    var _overlay = null;
    var _pendingCb = null;

    function _build() {
        if (_overlay) return;
        var ov = document.createElement('div');
        ov.style.cssText = [
            'position:fixed;inset:0;z-index:99999;',
            'display:none;align-items:center;justify-content:center;',
            'background:rgba(15,23,42,0.55);backdrop-filter:blur(4px);',
            'padding:20px;box-sizing:border-box;'
        ].join('');
        var card = document.createElement('div');
        card.style.cssText = [
            'background:#fff;border-radius:16px;padding:28px 28px 22px;',
            'max-width:420px;width:100%;',
            'box-shadow:0 24px 60px rgba(15,23,42,0.28);',
            'display:flex;flex-direction:column;gap:18px;',
            'font-family:Poppins,sans-serif;animation:_idmc_pop 0.18s ease;'
        ].join('');
        var style = document.createElement('style');
        style.textContent = '@keyframes _idmc_pop{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}';
        document.head.appendChild(style);
        var msg = document.createElement('p');
        msg.id = '_idmc_modal_msg';
        msg.style.cssText = 'margin:0;color:#1e293b;font-size:0.95rem;line-height:1.6;';
        var footer = document.createElement('div');
        footer.style.cssText = 'display:flex;justify-content:flex-end;';
        var btn = document.createElement('button');
        btn.textContent = 'Aceptar';
        btn.style.cssText = [
            'border:none;background:#2563eb;color:#fff;',
            'border-radius:8px;padding:9px 24px;',
            'font-size:0.9rem;font-weight:700;cursor:pointer;',
            'font-family:inherit;transition:background 0.15s;'
        ].join('');
        btn.onmouseover = function () { btn.style.background = '#1d4ed8'; };
        btn.onmouseout  = function () { btn.style.background = '#2563eb'; };
        btn.onclick = _cerrar;
        ov.addEventListener('click', function (e) { if (e.target === ov) _cerrar(); });
        footer.appendChild(btn);
        card.appendChild(msg);
        card.appendChild(footer);
        ov.appendChild(card);
        document.body.appendChild(ov);
        _overlay = ov;
    }

    function _cerrar() {
        if (_overlay) _overlay.style.display = 'none';
        var cb = _pendingCb;
        _pendingCb = null;
        if (typeof cb === 'function') cb();
    }

    window.mostrarModal = function (mensaje, alCerrar) {
        function _show() {
            _build();
            document.getElementById('_idmc_modal_msg').textContent = String(mensaje || '');
            _pendingCb = alCerrar || null;
            _overlay.style.display = 'flex';
        }
        if (!document.body) { document.addEventListener('DOMContentLoaded', _show); } else { _show(); }
    };

    // Reemplaza window.alert en toda la plataforma
    window.alert = function (mensaje) { window.mostrarModal(String(mensaje || '')); };
}());

// ==== SIDEBAR AUTH (global, aplica en todas las páginas) ====
(function () {
    function _sidebarAuth() {
        var haySesion = localStorage.getItem('sesion') === 'activa' ||
            !!localStorage.getItem('sesionUsuario') ||
            !!localStorage.getItem('usuario');
        var authBtns = document.getElementById('sidebarAuthButtons');
        var logoutBtn = document.getElementById('sidebarLogoutBtn');
        if (authBtns)  authBtns.style.display  = haySesion ? 'none'  : 'flex';
        if (logoutBtn) logoutBtn.style.display  = haySesion ? 'block' : 'none';
    }
    window.updateAuthButtons = _sidebarAuth;
    document.addEventListener('DOMContentLoaded', _sidebarAuth);
}());

// Permitir navegación como invitado
function entrarComoInvitado() {
    localStorage.setItem('usuario_invitado', 'true');
    window.location.href = 'lobby.html';
}
// ==== INICIALIZACIÓN DE EMAILJS ====
if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: "lcpwVT5dW109ewCDq" });
}

function enviarCorreoBienvenida(email, usuario) {
    if (typeof emailjs === 'undefined') {
        return Promise.reject(new Error('EmailJS no está disponible en esta página.'));
    }

    return emailjs.send("service_eo4z8qr", "template_5m56l8b", {
        to_email: email,
        usuario: usuario,
        logo_url: "https://miweb.com/logo.png",
        website_link: "#",
        company_email: "mecanicaclasicainstituto@gmail.com | contacto@institutodemecanicaclasica.com",
        mensaje_bienvenida: "Bienvenido/a al Instituto de Mecánica Clásica"
    });
}

function enviarCodigoVerificacionRegistro(email, usuario, codigo) {
    if (typeof emailjs === 'undefined') {
        return Promise.reject(new Error('EmailJS no está disponible en esta página.'));
    }

    return emailjs.send("service_eo4z8qr", "template_5m56l8b", {
        to_email: email,
        usuario: usuario,
        codigo_verificacion: codigo,
        logo_url: "https://miweb.com/logo.png",
        website_link: "#",
        company_email: "mecanicaclasicainstituto@gmail.com | contacto@institutodemecanicaclasica.com",
        mensaje_bienvenida: "Tu código de verificación para completar el registro"
    });
}

function enviarCodigoRecuperacion(email, usuario, codigo) {
    if (typeof emailjs === 'undefined') {
        return Promise.reject(new Error('EmailJS no está disponible en esta página.'));
    }

    return emailjs.send("service_eo4z8qr", "template_j4ut4n3", {
        to_email: email,
        usuario: usuario,
        codigo_verificacion: codigo,
        codigo_recuperacion: codigo,
        logo_url: "https://miweb.com/logo.png",
        website_link: "#",
        company_email: "mecanicaclasicainstituto@gmail.com | contacto@institutodemecanicaclasica.com",
        mensaje_bienvenida: "Tu código para recuperar la contraseña"
    });
}

function setRegistroMensaje(texto, tipo) {
    var box = document.getElementById('registroMsg');
    if (!box) return;
    box.textContent = texto;
    box.className = 'registro-msg' + (tipo ? (' ' + tipo) : '');
}

function setLoginMensaje(texto, tipo) {
    var box = document.getElementById('loginMsg');
    if (!box) return;
    box.textContent = texto;
    box.className = 'registro-msg' + (tipo ? (' ' + tipo) : '');
}

function mostrarSeccionVerificacion(mostrar) {
    var section = document.getElementById('verificacionSection');
    if (!section) return;
    section.style.display = mostrar ? 'block' : 'none';
}

function mostrarSeccionRecuperacion(mostrar) {
    var section = document.getElementById('recuperacionSection');
    if (!section) return;
    section.style.display = mostrar ? 'block' : 'none';
}

function generarCodigoVerificacion() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

var AVATAR_POR_DEFECTO = 'avatar-default.svg';
var COVER_POR_DEFECTO = 'cover-default.svg';

function obtenerAvatarPorDefecto() {
    return AVATAR_POR_DEFECTO;
}

function obtenerCoverPorDefecto() {
    return COVER_POR_DEFECTO;
}

function obtenerAvatarSeguro(valor) {
    var avatar = String(valor || '').trim();
    return avatar || AVATAR_POR_DEFECTO;
}

function aplicarAvatarSeguro(img, valor) {
    if (!img) return;
    img.onerror = function() {
        this.onerror = null;
        this.src = AVATAR_POR_DEFECTO;
    };
    img.src = obtenerAvatarSeguro(valor);
}

function obtenerCoverSeguro(valor) {
    var cover = String(valor || '').trim();
    return cover || COVER_POR_DEFECTO;
}

function aplicarCoverSeguro(img, valor) {
    if (!img) return;
    img.onerror = function() {
        this.onerror = null;
        this.src = COVER_POR_DEFECTO;
    };
    img.src = obtenerCoverSeguro(valor);
}

function normalizarEstadoSesion() {
    var sesion = localStorage.getItem('sesion');
    if (sesion === 'activa') return;

    var sesionUsuario = localStorage.getItem('sesionUsuario') || '';
    var usuario = localStorage.getItem('usuario') || '';

    if (!sesionUsuario && !usuario) return;

    var usuarioActivo = sesionUsuario || usuario;
    localStorage.setItem('sesion', 'activa');
    localStorage.setItem('sesionUsuario', usuarioActivo);
    localStorage.setItem('usuario', usuarioActivo);
}

// ==== ALMACENAMIENTO MULTIUSUARIO ====
function getUsuariosRegistrados() {
    return JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
}

function saveUsuariosRegistrados(usuarios) {
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
}

function migrarUsuarioLegacy() {
    if (localStorage.getItem('legacyMigracionCompleta') === '1') return;

    var usuarios = getUsuariosRegistrados();
    if (usuarios.length > 0) {
        localStorage.setItem('legacyMigracionCompleta', '1');
        return;
    }

    var legacyUser = localStorage.getItem('usuario') || '';
    var legacyEmail = localStorage.getItem('email') || '';
    var legacyPass = localStorage.getItem('password') || '';

    if (!legacyUser || !legacyPass) {
        localStorage.setItem('legacyMigracionCompleta', '1');
        return;
    }

    var existe = usuarios.some(function(u) { return u.usuario === legacyUser; });
    if (!existe) {
        usuarios.push({ usuario: legacyUser, email: legacyEmail, password: legacyPass });
        saveUsuariosRegistrados(usuarios);
    }

    localStorage.setItem('legacyMigracionCompleta', '1');
}

function getPerfilesUsuarios() {
    return JSON.parse(localStorage.getItem('perfilesUsuarios') || '{}');
}

function savePerfilesUsuarios(perfiles) {
    localStorage.setItem('perfilesUsuarios', JSON.stringify(perfiles));
}

function cargarPerfilActualDesdeStorage() {
    var usuario = localStorage.getItem('usuario') || '';
    if (!usuario) return;

    var perfiles = getPerfilesUsuarios();
    var perfil = perfiles[usuario] || {};

    localStorage.setItem('primerNombre', perfil.primerNombre || '');
    localStorage.setItem('apellido', perfil.apellido || '');
    localStorage.setItem('nombreMostrar', perfil.nombreMostrar || '');
    localStorage.setItem('emailPerfil', perfil.emailPerfil || '');
    localStorage.setItem('formacion', perfil.formacion || '');
    localStorage.setItem('biografia', perfil.biografia || '');
    localStorage.setItem('facebook', perfil.facebook || '');
    localStorage.setItem('twitter', perfil.twitter || '');
    localStorage.setItem('youtube', perfil.youtube || '');
    localStorage.setItem('linkedin', perfil.linkedin || '');
    localStorage.setItem('avatar', perfil.avatar || '');
    localStorage.setItem('cover', perfil.cover || '');
}

function persistirPerfilActual() {
    var usuario = localStorage.getItem('usuario') || '';
    if (!usuario) return;

    var perfiles = getPerfilesUsuarios();
    var perfilActual = perfiles[usuario] || {};
    perfiles[usuario] = {
        cursos: Array.isArray(perfilActual.cursos) ? perfilActual.cursos : [],
        primerNombre: localStorage.getItem('primerNombre') || '',
        apellido: localStorage.getItem('apellido') || '',
        nombreMostrar: localStorage.getItem('nombreMostrar') || '',
        emailPerfil: localStorage.getItem('emailPerfil') || '',
        formacion: localStorage.getItem('formacion') || '',
        biografia: localStorage.getItem('biografia') || '',
        facebook: localStorage.getItem('facebook') || '',
        twitter: localStorage.getItem('twitter') || '',
        youtube: localStorage.getItem('youtube') || '',
        linkedin: localStorage.getItem('linkedin') || '',
        avatar: localStorage.getItem('avatar') || '',
        cover: localStorage.getItem('cover') || ''
    };
    savePerfilesUsuarios(perfiles);
}

function normalizarTextoClave(texto) {
    return String(texto || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function getCursosInscritosUsuario(usuario) {
    var user = String(usuario || localStorage.getItem('usuario') || '').trim();
    if (!user) return [];

    var perfiles = getPerfilesUsuarios();
    var perfil = perfiles[user] || {};
    return Array.isArray(perfil.cursos) ? perfil.cursos : [];
}

function usuarioTieneCurso(nombreCurso, usuario) {
    var nombre = normalizarTextoClave(nombreCurso);
    if (!nombre) return false;

    var cursos = getCursosInscritosUsuario(usuario);
    return cursos.some(function(curso) {
        return normalizarTextoClave(curso) === nombre;
    });
}

function limpiarProgresoDelCurso(nombreCurso) {
    var nombre = normalizarTextoClave(nombreCurso);
    var ids = Object.keys(typeof CURSO_UI_MAP === 'object' && CURSO_UI_MAP ? CURSO_UI_MAP : {});

    for (var i = 0; i < ids.length; i++) {
        var cfg = CURSO_UI_MAP[ids[i]] || {};
        if (normalizarTextoClave(cfg.nombre || '') === nombre) {
            var cursoId = ids[i];
            var estado = getEstadoProgresoCursos();
            var regex = new RegExp('^' + cursoId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\|');
            var sesiones = estado.sesionesCompletadas || {};
            var keys = Object.keys(sesiones);
            for (var j = 0; j < keys.length; j++) {
                if (regex.test(keys[j])) {
                    delete sesiones[keys[j]];
                }
            }
            estado.sesionesCompletadas = sesiones;
            saveEstadoProgresoCursos(estado);
            return;
        }
    }
}

function agregarCursoAUsuario(nombreCurso, usuario) {
    var user = String(usuario || localStorage.getItem('usuario') || '').trim();
    var curso = String(nombreCurso || '').trim();
    if (!user || !curso) return false;

    var perfiles = getPerfilesUsuarios();
    var perfilActual = perfiles[user] || {};
    var cursos = Array.isArray(perfilActual.cursos) ? perfilActual.cursos.slice() : [];

    var existe = cursos.some(function(item) {
        return normalizarTextoClave(item) === normalizarTextoClave(curso);
    });
    
    if (!existe) {
        cursos.push(curso);
    }
    
    // Limpiar progreso SIEMPRE (ya sea nuevo o existente)
    limpiarProgresoDelCurso(curso);

    perfiles[user] = {
        primerNombre: perfilActual.primerNombre || '',
        apellido: perfilActual.apellido || '',
        nombreMostrar: perfilActual.nombreMostrar || '',
        emailPerfil: perfilActual.emailPerfil || '',
        formacion: perfilActual.formacion || '',
        biografia: perfilActual.biografia || '',
        facebook: perfilActual.facebook || '',
        twitter: perfilActual.twitter || '',
        youtube: perfilActual.youtube || '',
        linkedin: perfilActual.linkedin || '',
        avatar: perfilActual.avatar || '',
        cover: perfilActual.cover || '',
        cursos: cursos
    };
    savePerfilesUsuarios(perfiles);

    if ((localStorage.getItem('usuario') || '') === user && typeof sincronizarUsuarioComunidad === 'function') {
        sincronizarUsuarioComunidad();
    }
    return true;
}

function procesarCheckoutPendiente() {
    var raw = localStorage.getItem('checkoutPendiente');
    if (!raw) return false;

    var pendiente = null;
    try {
        pendiente = JSON.parse(raw);
    } catch (_e) {
        localStorage.removeItem('checkoutPendiente');
        return false;
    }

    if (!pendiente || !pendiente.title) {
        localStorage.removeItem('checkoutPendiente');
        return false;
    }

    var ahora = Date.now();
    var creado = Number(pendiente.createdAt || 0);
    if (creado > 0 && (ahora - creado) > (24 * 60 * 60 * 1000)) {
        localStorage.removeItem('checkoutPendiente');
        return false;
    }

    var usuarioActivo = String(localStorage.getItem('usuario') || localStorage.getItem('sesionUsuario') || '').trim();
    if (!usuarioActivo) return false;

    var usuarioPendiente = String(pendiente.user || '').trim();
    if (usuarioPendiente && usuarioPendiente !== usuarioActivo) return false;

    var agregado = agregarCursoAUsuario(pendiente.title, usuarioActivo);
    localStorage.removeItem('checkoutPendiente');
    if (agregado) {
        localStorage.setItem('checkoutUltimoCurso', String(pendiente.title));
    }
    return agregado;
}

function alternarVisibilidadPassword(inputId, button) {
    var input = document.getElementById(inputId);
    if (!input || !button) return;

    var mostrar = input.type === 'password';
    input.type = mostrar ? 'text' : 'password';
    button.setAttribute('aria-pressed', mostrar ? 'true' : 'false');
    button.setAttribute('aria-label', mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña');
}

// ==== REGISTRO ====
function registrar() {
    let user = document.getElementById("user").value.trim();
    let email = document.getElementById("email").value.trim().toLowerCase();
    let pass = document.getElementById("pass").value;

    if (user === "" || email === "" || pass === "") {
           setRegistroMensaje("Completa todos los campos para continuar.", "error");
        return;
    }

    // Guardar datos en sistema multiusuario
    var usuarios = getUsuariosRegistrados();
    var userLower = user.toLowerCase();
    var existeUsuario = usuarios.some(function(u) {
        return (u.usuario || '').toLowerCase() === userLower;
    });
    if (existeUsuario) {
            setRegistroMensaje("Ese nombre de usuario ya existe.", "error");
        return;
    }

    var existeEmail = usuarios.some(function(u) {
        return (u.email || '').toLowerCase() === email;
    });
    if (existeEmail) {
            setRegistroMensaje("Ese correo ya está registrado.", "error");
        return;
    }

        var codigo = generarCodigoVerificacion();
        localStorage.setItem('registroPendiente', JSON.stringify({
            usuario: user,
            email: email,
            password: pass,
            codigo: codigo,
            expira: Date.now() + (10 * 60 * 1000)
        }));

        enviarCodigoVerificacionRegistro(email, user, codigo)
        .then(function() {
            setRegistroMensaje("Te enviamos un código a tu correo. Escríbelo abajo para activar tu cuenta.", "ok");
            mostrarSeccionVerificacion(true);
        })
        .catch(function(error) {
            console.error('Error al enviar código de verificación:', error);
            var detalle = (error && (error.text || error.message || error.status)) ? (' Detalle: ' + (error.text || error.message || error.status)) : '';
            setRegistroMensaje("No se pudo enviar el código de verificación." + detalle, "error");
            mostrarSeccionVerificacion(false);
        });
}

    function reenviarCodigoRegistro() {
        var pendiente = JSON.parse(localStorage.getItem('registroPendiente') || 'null');
        if (!pendiente) {
            setRegistroMensaje('No hay un registro pendiente para reenviar.', 'error');
            return;
        }

        var nuevoCodigo = generarCodigoVerificacion();
        pendiente.codigo = nuevoCodigo;
        pendiente.expira = Date.now() + (10 * 60 * 1000);
        localStorage.setItem('registroPendiente', JSON.stringify(pendiente));

        enviarCodigoVerificacionRegistro(pendiente.email, pendiente.usuario, nuevoCodigo)
        .then(function() {
            setRegistroMensaje('Te enviamos un nuevo código de verificación.', 'ok');
            mostrarSeccionVerificacion(true);
        })
        .catch(function(error) {
            console.error('Error al reenviar código:', error);
            var detalle = (error && (error.text || error.message || error.status)) ? (' Detalle: ' + (error.text || error.message || error.status)) : '';
            setRegistroMensaje('No se pudo reenviar el código.' + detalle, 'error');
        });
    }

    function verificarCodigoRegistro() {
        var input = document.getElementById('codigoVerificacion');
        if (!input) return;

        var codigoIngresado = (input.value || '').trim();
        var pendiente = JSON.parse(localStorage.getItem('registroPendiente') || 'null');

        if (!pendiente) {
            setRegistroMensaje('No hay registro pendiente. Completa el formulario de creación de cuenta.', 'error');
            return;
        }
        if (!codigoIngresado) {
            setRegistroMensaje('Ingresa el código de verificación.', 'error');
            return;
        }
        if (Date.now() > Number(pendiente.expira || 0)) {
            setRegistroMensaje('El código expiró. Solicita uno nuevo.', 'error');
            return;
        }
        if (codigoIngresado !== String(pendiente.codigo)) {
            setRegistroMensaje('Código incorrecto. Inténtalo nuevamente.', 'error');
            return;
        }

        var usuarios = getUsuariosRegistrados();
        var yaExiste = usuarios.some(function(u) {
            return (u.usuario || '').toLowerCase() === pendiente.usuario.toLowerCase() ||
                   (u.email || '').toLowerCase() === pendiente.email.toLowerCase();
        });
        if (yaExiste) {
            setRegistroMensaje('Esa cuenta ya existe. Inicia sesión.', 'error');
            localStorage.removeItem('registroPendiente');
            return;
        }

        usuarios.push({ usuario: pendiente.usuario, email: pendiente.email, password: pendiente.password });
        saveUsuariosRegistrados(usuarios);

        localStorage.setItem('usuario', pendiente.usuario);
        localStorage.setItem('email', pendiente.email);
        localStorage.setItem('password', pendiente.password);
        localStorage.setItem('sesionUsuario', pendiente.usuario);
        sincronizarUsuarioComunidad();

        localStorage.removeItem('registroPendiente');
        setRegistroMensaje('Cuenta verificada y creada correctamente ✅ Redirigiendo al inicio de sesión...', 'ok');
        mostrarSeccionVerificacion(false);
        setTimeout(function() {
            window.location.href = 'home.html';
        }, 1200);
    }

// ==== LOGIN ====
function login() {
    let user = document.getElementById("user").value.trim();
    let pass = document.getElementById("pass").value;

    if (!user || !pass) {
        setLoginMensaje('Ingresa tu usuario/correo y tu contraseña.', 'error');
        return;
    }

    var usuarios = getUsuariosRegistrados();
    var userLower = user.toLowerCase();
    var cuenta = usuarios.find(function(u) {
        var email = (u.email || '').toLowerCase();
        return (u.usuario === user || email === userLower) && u.password === pass;
    });

    if (cuenta) {
        localStorage.setItem("sesion", "activa");
        localStorage.setItem("sesionUsuario", cuenta.usuario);
        localStorage.setItem("usuario", cuenta.usuario);
        localStorage.setItem("email", cuenta.email);
        localStorage.setItem("password", cuenta.password);
        cargarPerfilActualDesdeStorage();
        sincronizarUsuarioComunidad();
        window.location.href = "cursos.html";
    } else {
        setLoginMensaje('Usuario o contraseña incorrectos.', 'error');
    }
}

// ==== LOGOUT ====
function logout() {
    persistirPerfilActual();
    localStorage.removeItem("sesion");
    localStorage.removeItem("sesionUsuario");
    localStorage.removeItem("usuario");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("perfilAvatar");
    localStorage.removeItem("avatar");
    localStorage.removeItem("userAvatar");
    localStorage.removeItem("profilePhoto");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("avatarUrl");
    location.reload();
}

// ==== FUNCIONES PARA PÁGINAS CON SESIÓN ====

// Limpia datos de sesión anterior si no hay sesión activa
function limpiarSiNoHaySesion() {
    if (localStorage.getItem("sesion") !== "activa") {
        localStorage.removeItem('usuario');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('perfilAvatar');
        localStorage.removeItem('avatar');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('profilePhoto');
        localStorage.removeItem('profileImage');
        localStorage.removeItem('avatarUrl');
        localStorage.removeItem('sesionUsuario');
    }
}

// Verifica si hay sesión activa, redirige al login si no
function verificarSesion() {
    if (localStorage.getItem("sesion") !== "activa") {
        window.location.href = "home.html";
        return;
    }

    var sesionUsuario = localStorage.getItem('sesionUsuario') || '';
    if (!sesionUsuario) return;

    var usuarios = getUsuariosRegistrados();
    var cuenta = usuarios.find(function(u) { return u.usuario === sesionUsuario; });
    if (!cuenta) return;

    localStorage.setItem('usuario', cuenta.usuario);
    localStorage.setItem('email', cuenta.email || '');
    localStorage.setItem('password', cuenta.password || '');
    cargarPerfilActualDesdeStorage();
}

// Redirige a registro si no hay sesión, o va a la página si hay sesión
function irSiTieneSesion(pagina) {
    if (localStorage.getItem("sesion") !== "activa") {
        window.location.href = "registro.html";
        return;
    }
    window.location.href = pagina;
}

// Función para comprar curso - verifica sesión antes de ir al pago
function comprarCurso(pagoUrl) {
    if (localStorage.getItem("sesion") !== "activa") {
        window.location.href = "registro.html";
        return;
    }
    window.location.href = pagoUrl;
}

// Interceptar clics a perfil.html y comunidad.html sin sesión
document.addEventListener('click', function(e) {
    var perfil = e.target.closest('a[href="perfil.html"]');
    var comunidad = e.target.closest('a[href="comunidad.html"]');
    if ((perfil || comunidad) && localStorage.getItem("sesion") !== "activa") {
        e.preventDefault();
        window.location.href = "registro.html";
    }
}, true);

// Muestra el formulario de recuperar contraseña
function mostrarRecuperar() {
    document.getElementById("recuperar-form").style.display = "block";
    mostrarSeccionRecuperacion(false);
    setLoginMensaje('', '');
}

// Recuperar contraseña usando EmailJS
function recuperarContrasena() {
    const email = document.getElementById("recuperarEmail").value.trim().toLowerCase();
    var usuarios = getUsuariosRegistrados();
    var cuenta = usuarios.find(function(u) { return (u.email || '').toLowerCase() === email; });

    if(email === "") {
        setLoginMensaje('Ingresa tu correo para recuperar la contraseña.', 'error');
        return;
    }

    if (!cuenta) {
        setLoginMensaje('No existe una cuenta registrada con ese correo.', 'error');
        return;
    }

    var codigo = generarCodigoVerificacion();
    localStorage.setItem('recuperacionPendiente', JSON.stringify({
        usuario: cuenta.usuario,
        email: cuenta.email,
        codigo: codigo,
        expira: Date.now() + (10 * 60 * 1000)
    }));

    enviarCodigoRecuperacion(email, cuenta.usuario, codigo)
    .then(function() {
        setLoginMensaje('Te enviamos un código para recuperar tu contraseña.', 'ok');
        mostrarSeccionRecuperacion(true);
    }, function(error) {
        setLoginMensaje('Error al enviar el correo. Inténtalo de nuevo.', 'error');
        console.error(error);
    });
}

function reenviarCodigoRecuperacion() {
    var pendiente = JSON.parse(localStorage.getItem('recuperacionPendiente') || 'null');
    if (!pendiente) {
        setLoginMensaje('No hay una recuperación pendiente.', 'error');
        return;
    }

    var codigo = generarCodigoVerificacion();
    pendiente.codigo = codigo;
    pendiente.expira = Date.now() + (10 * 60 * 1000);
    localStorage.setItem('recuperacionPendiente', JSON.stringify(pendiente));

    enviarCodigoRecuperacion(pendiente.email, pendiente.usuario, codigo)
        .then(function() {
            setLoginMensaje('Te enviamos un nuevo código de recuperación.', 'ok');
            mostrarSeccionRecuperacion(true);
        }, function(error) {
            setLoginMensaje('No se pudo reenviar el código.', 'error');
            console.error(error);
        });
}

function restablecerContrasena() {
    var pendiente = JSON.parse(localStorage.getItem('recuperacionPendiente') || 'null');
    var codigo = (document.getElementById('codigoRecuperacion').value || '').trim();
    var nuevaPassword = document.getElementById('nuevaPassword').value;
    var confirmarPassword = document.getElementById('confirmarPassword').value;

    if (!pendiente) {
        setLoginMensaje('No hay una recuperación pendiente.', 'error');
        return;
    }
    if (!codigo || !nuevaPassword || !confirmarPassword) {
        setLoginMensaje('Completa el código y las nuevas contraseñas.', 'error');
        return;
    }
    if (Date.now() > Number(pendiente.expira || 0)) {
        setLoginMensaje('El código expiró. Solicita uno nuevo.', 'error');
        return;
    }
    if (codigo !== String(pendiente.codigo)) {
        setLoginMensaje('Código de recuperación incorrecto.', 'error');
        return;
    }
    if (nuevaPassword.length < 6) {
        setLoginMensaje('La nueva contraseña debe tener al menos 6 caracteres.', 'error');
        return;
    }
    if (nuevaPassword !== confirmarPassword) {
        setLoginMensaje('Las contraseñas no coinciden.', 'error');
        return;
    }

    var usuarios = getUsuariosRegistrados();
    var cuenta = usuarios.find(function(u) {
        return (u.usuario || '') === pendiente.usuario && (u.email || '').toLowerCase() === String(pendiente.email || '').toLowerCase();
    });

    if (!cuenta) {
        setLoginMensaje('No se encontró la cuenta para actualizar.', 'error');
        return;
    }

    cuenta.password = nuevaPassword;
    saveUsuariosRegistrados(usuarios);

    if ((localStorage.getItem('sesionUsuario') || '') === cuenta.usuario || (localStorage.getItem('usuario') || '') === cuenta.usuario) {
        localStorage.setItem('password', nuevaPassword);
    }

    localStorage.removeItem('recuperacionPendiente');
    document.getElementById('codigoRecuperacion').value = '';
    document.getElementById('nuevaPassword').value = '';
    document.getElementById('confirmarPassword').value = '';
    document.getElementById('recuperarEmail').value = '';
    document.getElementById('recuperar-form').style.display = 'none';
    mostrarSeccionRecuperacion(false);
    setLoginMensaje('Contraseña actualizada correctamente. Ya puedes iniciar sesión.', 'ok');
}

function toggleProfileMenu() {
    ensureProfileDropdownAuthState();
    const dropdown = document.getElementById('profileDropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('show');
}

function closeProfileMenu(event) {
    const dropdown = document.getElementById('profileDropdown');
    const avatar = document.getElementById('topbarAvatar');
    if (!dropdown || !avatar) return;
    if (event.target === avatar || avatar.contains(event.target)) return;
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
}

function updateTopbarAvatar() {
    const avatarImg = document.getElementById('topbarAvatar');
    if (!avatarImg) return;
    const avatar = localStorage.getItem('avatar');
    aplicarAvatarSeguro(avatarImg, avatar);
}

function tieneSesionActiva() {
    return localStorage.getItem('sesion') === 'activa' || !!localStorage.getItem('sesionUsuario') || !!localStorage.getItem('usuario');
}

function ensureProfileDropdownAuthState() {
    var dropdown = document.getElementById('profileDropdown');
    if (!dropdown) return;

    if (tieneSesionActiva()) {
        dropdown.innerHTML = [
            '<a href="cursos.html">Todos los cursos</a>',
            '<a href="perfil.html#mis-cursos">Mis Cursos</a>',
            '<a href="tu_progreso.html">Tu progreso</a>',
            '<a href="lista_deseados.html">Lista de deseados</a>',
            '<a href="perfil.html">Editar perfil</a>',
            '<button type="button" onclick="logout()">Cerrar sesión</button>'
        ].join('');
        return;
    }

    dropdown.innerHTML = [
        '<a href="cursos.html">Todos los cursos</a>',
        '<a href="home.html">Iniciar sesión</a>',
        '<a href="registro.html">Crear cuenta</a>'
    ].join('');
}

function getCarritoCount() {
    var keys = ['carritoCursos', 'misCursosCarrito', 'listaDeseados', 'listaDeseadosCursos'];
    for (var i = 0; i < keys.length; i++) {
        try {
            var arr = JSON.parse(localStorage.getItem(keys[i]) || '[]');
            if (Array.isArray(arr) && arr.length) return arr.length;
        } catch (_e) {}
    }
    return 0;
}

function ensureTopbarQuickActions() {
    var topbarRight = document.querySelector('.topbar-right');
    if (!topbarRight) return;
    if (document.getElementById('topbarQuickActions')) return;

    var wrap = document.createElement('div');
    wrap.className = 'topbar-quick-actions';
    wrap.id = 'topbarQuickActions';

    var soporte = document.createElement('a');
    soporte.className = 'topbar-quick-btn soporte';
    soporte.href = 'contactanos.html';
    soporte.textContent = 'Soporte';

    var carrito = document.createElement('a');
    carrito.className = 'topbar-quick-btn carrito';
    carrito.href = 'lista_deseados.html';
    carrito.textContent = 'Mi carrito';

    var badge = document.createElement('span');
    badge.className = 'topbar-quick-badge';
    badge.id = 'topbarCartBadge';
    badge.textContent = String(getCarritoCount());
    carrito.appendChild(badge);

    var profileMenu = topbarRight.querySelector('.profile-menu');
    wrap.appendChild(soporte);
    wrap.appendChild(carrito);

    if (profileMenu) topbarRight.insertBefore(wrap, profileMenu);
    else topbarRight.appendChild(wrap);
}

document.addEventListener('click', closeProfileMenu);

document.addEventListener('DOMContentLoaded', function() {
    normalizarEstadoSesion();
    migrarUsuarioLegacy();
    ensureProfileDropdownAuthState();
    updateTopbarAvatar();
    ensureTopbarQuickActions();
});

// ==== COMUNIDAD - SINCRONIZAR USUARIO ====
function sincronizarUsuarioComunidad() {
    persistirPerfilActual();

    var usuario = localStorage.getItem('usuario') || '';
    if (!usuario) return;
    var perfiles = getPerfilesUsuarios();
    var perfilActual = perfiles[usuario] || {};
    var primerN   = localStorage.getItem('primerNombre') || '';
    var apellido  = localStorage.getItem('apellido') || '';
    var nombre    = localStorage.getItem('nombreMostrar') ||
                    (primerN ? (primerN + ' ' + apellido).trim() : usuario);
    var avatar    = obtenerAvatarSeguro(localStorage.getItem('avatar') || localStorage.getItem('perfilAvatar') || '');
    var cover     = localStorage.getItem('cover') || '';
    var bio       = localStorage.getItem('biografia') || '';
    var formacion = localStorage.getItem('formacion') || 'Estudiante';
    var email     = localStorage.getItem('emailPerfil') || localStorage.getItem('email') || '';
    var genero    = localStorage.getItem('genero') || '';
    var trabajo   = localStorage.getItem('trabajo') || '';
    var capacitaciones = localStorage.getItem('capacitaciones') || '';
    var gustos    = localStorage.getItem('gustos') || '';
    var facebook  = localStorage.getItem('facebook') || '';
    var twitter   = localStorage.getItem('twitter') || '';
    var youtube   = localStorage.getItem('youtube') || '';
    var linkedin  = localStorage.getItem('linkedin') || '';
    var cursos    = Array.isArray(perfilActual.cursos) ? perfilActual.cursos : [];

    var usuarios = JSON.parse(localStorage.getItem('comunidadUsuarios') || '[]');
    var idx = usuarios.findIndex(function(u) { return u.usuario === usuario; });
    var data = {
        usuario: usuario,
        nombre: nombre || usuario,
        avatar: avatar,
        cover: cover,
        bio: bio,
        formacion: formacion,
        email: email,
        genero: genero,
        trabajo: trabajo,
        capacitaciones: capacitaciones,
        gustos: gustos,
        facebook: facebook,
        twitter: twitter,
        youtube: youtube,
        linkedin: linkedin,
        cursos: cursos,
        fechaRegistro: idx >= 0 ? (usuarios[idx].fechaRegistro || '') :
            new Date().toLocaleDateString('es', { month: 'short', year: 'numeric' })
    };
    if (idx >= 0) { usuarios[idx] = data; }
    else          { usuarios.push(data); }
    localStorage.setItem('comunidadUsuarios', JSON.stringify(usuarios));
}

// ==== PROGRESO DE CURSOS ====
var CURSO_ESQUEMA = {
    mecanica_nivel1: {
        nombre: 'Mecánica Clásica Nivel I',
        modulos: [
            { id: 'm1', sesiones: ['s1'] },
            { id: 'm2', sesiones: ['s1','s2','s3','s4','s5','s6','s7','s8','s9'] },
            { id: 'm3', sesiones: ['s1','s2','s3','s4','s5','s6','s7','s8','s9'] },
            { id: 'm4', sesiones: ['s1'] },
            { id: 'm5', sesiones: ['s1'] },
            { id: 'm6', sesiones: ['s1'] },
            { id: 'm7', sesiones: ['s1'] },
            { id: 'm8', sesiones: ['s1'] }
        ]
    }
};

var CURSO_UI_MAP = {
    mecanica_nivel1: {
        nombre: 'Mecánica Clásica Nivel I',
        detalleUrl: 'curso_mecanica_nivel1.html',
        continuarUrl: 'nivel1.html'
    }
};

function getCursoConfigByNombre(nombreCurso) {
    var nombre = normalizarTextoClave(nombreCurso);
    var ids = Object.keys(CURSO_UI_MAP);

    for (var i = 0; i < ids.length; i++) {
        var cfg = CURSO_UI_MAP[ids[i]];
        if (normalizarTextoClave(cfg.nombre) === nombre) return cfg;
    }

    return null;
}

function getCursoContinuarUrl(nombreCurso) {
    var cfg = getCursoConfigByNombre(nombreCurso);
    return cfg ? cfg.continuarUrl : 'perfil.html#mis-cursos';
}

function getCursoDetalleUrl(nombreCurso) {
    var cfg = getCursoConfigByNombre(nombreCurso);
    return cfg ? cfg.detalleUrl : 'cursos.html';
}

function getEstadoProgresoCursos() {
    return JSON.parse(localStorage.getItem('cursoProgresoEstado') || '{}');
}

function saveEstadoProgresoCursos(estado) {
    localStorage.setItem('cursoProgresoEstado', JSON.stringify(estado));
}

// Devuelve la URL de la sesion donde debe continuar el usuario
function getContinuarSesionUrl(cursoId) {
    var mapa = {
        'mecanica_nivel1': {
            sesiones: [
                { m: 1, s: 1, url: 'modulo1_sesion1.html' },
                { m: 2, s: 1, url: 'modulo2_sesion1.html' },
                { m: 2, s: 2, url: 'modulo2_sesion2.html' },
                { m: 2, s: 3, url: 'modulo2_sesion3.html' },
                { m: 2, s: 4, url: 'modulo2_sesion4.html' },
                { m: 2, s: 5, url: 'modulo2_sesion5.html' },
                { m: 2, s: 6, url: 'modulo2_sesion6.html' },
                { m: 2, s: 7, url: 'modulo2_sesion7.html' },
                { m: 2, s: 8, url: 'modulo2_sesion8.html' },
                { m: 2, s: 9, url: 'modulo2_sesion9.html' },
                { m: 3, s: 1, url: 'modulo3_sesion1.html' },
                { m: 3, s: 2, url: 'modulo3_sesion2.html' },
                { m: 3, s: 3, url: 'modulo3_sesion3.html' },
                { m: 3, s: 4, url: 'modulo3_sesion4.html' },
                { m: 3, s: 5, url: 'modulo3_sesion5.html' },
                { m: 3, s: 6, url: 'modulo3_sesion6.html' },
                { m: 3, s: 7, url: 'modulo3_sesion7.html' },
                { m: 3, s: 8, url: 'modulo3_sesion8.html' },
                { m: 3, s: 9, url: 'modulo3_sesion9.html' }
            ],
            ultimaUrl: 'modulo3_ejercicio4.html'
        }
    };
    var cfg = mapa[cursoId];
    if (!cfg) return null;
    // Busca la primera sesion no completada
    for (var i = 0; i < cfg.sesiones.length; i++) {
        var entrada = cfg.sesiones[i];
        if (!estaSesionCompletada(cursoId, entrada.m, entrada.s)) return entrada.url;
    }
    // Todas completadas — ir al ejercicio final
    return cfg.ultimaUrl;
}

function getSesionKey(cursoId, moduloNumero, sesionNumero) {
    return String(cursoId) + '|m' + String(moduloNumero) + '|s' + String(sesionNumero);
}

function marcarSesionCompletada(cursoId, moduloNumero, sesionNumero, completada) {
    var estado = getEstadoProgresoCursos();
    var sesiones = estado.sesionesCompletadas || {};
    var key = getSesionKey(cursoId, moduloNumero, sesionNumero);

    if (completada) sesiones[key] = true;
    else delete sesiones[key];

    estado.sesionesCompletadas = sesiones;
    // Guardar dos veces seguidas para forzar la actualizacion en todos los listeners
    localStorage.removeItem('cursoProgresoEstado');
    localStorage.setItem('cursoProgresoEstado', JSON.stringify(estado));
}

function estaSesionCompletada(cursoId, moduloNumero, sesionNumero) {
    var estado = getEstadoProgresoCursos();
    var sesiones = estado.sesionesCompletadas || {};
    return Boolean(sesiones[getSesionKey(cursoId, moduloNumero, sesionNumero)]);
}

function getProgresoCurso(cursoId) {
    var cfg = CURSO_ESQUEMA[cursoId];
    if (!cfg) return { totalSesiones: 0, sesionesCompletadas: 0, porcentaje: 0 };

    var total = 0;
    var completas = 0;

    for (var m = 0; m < cfg.modulos.length; m++) {
        var modulo = cfg.modulos[m];
        var sesiones = Array.isArray(modulo.sesiones) ? modulo.sesiones : [];
        for (var s = 0; s < sesiones.length; s++) {
            total += 1;
            if (estaSesionCompletada(cursoId, m + 1, s + 1)) completas += 1;
        }
    }

    var porcentaje = total > 0 ? Math.round((completas / total) * 100) : 0;
    return {
        totalSesiones: total,
        sesionesCompletadas: completas,
        porcentaje: porcentaje
    };
}

function estaModuloDesbloqueado(cursoId, moduloNumero) {
    if (moduloNumero <= 1) return true;

    var cfg = CURSO_ESQUEMA[cursoId];
    if (!cfg) return true;

    var idxPrevio = moduloNumero - 2;
    var moduloPrevio = cfg.modulos[idxPrevio];
    if (!moduloPrevio) return true;

    var sesionesPrevias = Array.isArray(moduloPrevio.sesiones) ? moduloPrevio.sesiones : [];
    for (var s = 0; s < sesionesPrevias.length; s++) {
        if (!estaSesionCompletada(cursoId, moduloNumero - 1, s + 1)) return false;
    }
    return true;
}

function getProgresoGlobalCursos() {
    var ids = Object.keys(CURSO_ESQUEMA);
    var total = 0;
    var completas = 0;

    for (var i = 0; i < ids.length; i++) {
        var p = getProgresoCurso(ids[i]);
        total += p.totalSesiones;
        completas += p.sesionesCompletadas;
    }

    return {
        totalSesiones: total,
        sesionesCompletadas: completas,
        porcentaje: total > 0 ? Math.round((completas / total) * 100) : 0
    };
}

function getResumenModulosCurso(cursoId) {
    var cfg = CURSO_ESQUEMA[cursoId];
    if (!cfg) return { totalModulos: 0, modulosCompletados: 0 };

    var totalModulos = cfg.modulos.length;
    var modulosCompletados = 0;

    for (var m = 0; m < cfg.modulos.length; m++) {
        var sesiones = Array.isArray(cfg.modulos[m].sesiones) ? cfg.modulos[m].sesiones : [];
        var completo = true;

        for (var s = 0; s < sesiones.length; s++) {
            if (!estaSesionCompletada(cursoId, m + 1, s + 1)) {
                completo = false;
                break;
            }
        }

        if (completo) modulosCompletados += 1;
    }

    return {
        totalModulos: totalModulos,
        modulosCompletados: modulosCompletados
    };
}

function irCursoDesdeBuscador() {
    var input = document.getElementById('topbarCourseInput');
    if (!input) return;

    var texto = String(input.value || '').trim().toLowerCase();
    if (!texto) {
        window.location.href = 'cursos.html';
        return;
    }

    if (texto.indexOf('clasica') !== -1 || texto.indexOf('clásica') !== -1 || texto.indexOf('mecanica clasica') !== -1 || texto.indexOf('mecánica clásica') !== -1) {
        window.location.href = 'nivel1.html';
        return;
    }
    if (texto.indexOf('fluidos') !== -1) {
        window.location.href = 'nivel2.html';
        return;
    }
    if (texto.indexOf('matematica') !== -1 || texto.indexOf('matemática') !== -1) {
        window.location.href = 'nivel3.html';
        return;
    }

    window.location.href = 'cursos.html';
}
