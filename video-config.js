// Configura aqui las URLs externas para cada sesion.
// Soportado por entrada:
// - { url: 'https://...mp4' }
// - { driveFileId: '...' }
// - { vimeoId: '123456789' }
// - { vimeoUrl: 'https://vimeo.com/123456789' }
window.EXTERNAL_VIDEO_CONFIG = {
    mecanica_nivel1: {
        modulo1: {
            1: { vimeoId: '1212746824' }
        },
        modulo2: {
            1: { vimeoId: '1212762844' },
            2: { vimeoId: '1212762976' },
            3: { vimeoId: '' },
            4: { vimeoId: '' },
            5: { vimeoId: '' },
            6: { vimeoId: '' },
            7: { vimeoId: '' },
            8: { vimeoId: '' },
            9: { vimeoId: '' }
        },
        modulo3: {
            1: { vimeoId: '' },
            2: { vimeoId: '' },
            3: { vimeoId: '' },
            4: { vimeoId: '' },
            5: { vimeoId: '' },
            6: { vimeoId: '' },
            7: { vimeoId: '' },
            8: { vimeoId: '' },
            9: { vimeoId: '' },
            10: { vimeoId: '' },
            11: { vimeoId: '' },
            12: { vimeoId: '' },
            13: { vimeoId: '' },
            14: { vimeoId: '' },
            15: { vimeoId: '' },
            16: { vimeoId: '' },
            17: { vimeoId: '' },
            18: { vimeoId: '' },
            19: { vimeoId: '' },
            20: { vimeoId: '' },
            21: { vimeoId: '' }
        }
    }
};

(function() {
    var VIMEO_SCRIPT_URL = 'https://player.vimeo.com/api/player.js';
    var vimeoScriptPromise = null;

    function buildGoogleDriveVideoUrl(fileId) {
        var normalizedFileId = encodeURIComponent(String(fileId || '').trim());
        return 'https://drive.usercontent.google.com/download?id=' + normalizedFileId + '&export=download&confirm=t';
    }

    function parseVimeoRef(input) {
        var raw = String(input || '').trim();
        if (!raw) return '';
        if (/^\d+$/.test(raw)) return raw;

        try {
            var parsed = new URL(raw);
            var host = String(parsed.hostname || '').toLowerCase();
            if (host.indexOf('vimeo.com') !== -1) {
                var path = String(parsed.pathname || '');
                var fromPlayerPath = path.match(/\/video\/(\d+)/i);
                var fromVimeoPath = path.match(/\/(\d+)(?:\/)?$/i);
                var id = fromPlayerPath && fromPlayerPath[1] ? fromPlayerPath[1] : (fromVimeoPath && fromVimeoPath[1] ? fromVimeoPath[1] : '');
                if (id) {
                    var hash = parsed.searchParams.get('h');
                    if (hash) return id + '?h=' + encodeURIComponent(hash);
                    return id;
                }
            }
        } catch (_err) {
            // no-op
        }

        var fromPlayer = raw.match(/player\.vimeo\.com\/video\/(\d+)(?:\?h=([a-zA-Z0-9]+))?/i);
        if (fromPlayer && fromPlayer[1]) {
            if (fromPlayer[2]) return fromPlayer[1] + '?h=' + encodeURIComponent(fromPlayer[2]);
            return fromPlayer[1];
        }

        var fromUrl = raw.match(/vimeo\.com\/(?:.*\/)?(\d+)(?:$|[?#/])/i);
        if (fromUrl && fromUrl[1]) return fromUrl[1];

        return '';
    }

    function buildVimeoEmbedUrl(vimeoRef) {
        var ref = String(vimeoRef || '').trim();
        // Parametros oficiales del codigo de embed que genera Vimeo.
        return 'https://player.vimeo.com/video/' + ref + '?badge=0&autopause=0&player_id=0&app_id=58479';
    }

    function getExternalVideoEntry(courseId, moduleId, sessionNumber) {
        var courseConfig = window.EXTERNAL_VIDEO_CONFIG && window.EXTERNAL_VIDEO_CONFIG[courseId];
        if (!courseConfig) return '';

        var moduleConfig = courseConfig[moduleId];
        if (!moduleConfig) return '';

        return moduleConfig[sessionNumber] || moduleConfig[String(sessionNumber)] || '';
    }

    function normalizeVideoEntry(entry) {
        if (!entry) return { type: 'none', value: '' };

        if (typeof entry === 'string') {
            var fromText = entry.trim();
            var textVimeoRef = parseVimeoRef(fromText);
            if (textVimeoRef) return { type: 'vimeo', value: textVimeoRef };
            return fromText ? { type: 'url', value: fromText } : { type: 'none', value: '' };
        }

        if (typeof entry.vimeoId === 'string' && entry.vimeoId.trim()) {
            var vimeoRef = parseVimeoRef(entry.vimeoId);
            if (vimeoRef) return { type: 'vimeo', value: vimeoRef };
        }

        if (typeof entry.vimeoUrl === 'string' && entry.vimeoUrl.trim()) {
            var urlVimeoRef = parseVimeoRef(entry.vimeoUrl);
            if (urlVimeoRef) return { type: 'vimeo', value: urlVimeoRef };
        }

        if (typeof entry.url === 'string' && entry.url.trim()) {
            var url = entry.url.trim();
            var directVimeoRef = parseVimeoRef(url);
            if (directVimeoRef) return { type: 'vimeo', value: directVimeoRef };
            return { type: 'url', value: url };
        }

        if (typeof entry.driveFileId === 'string' && entry.driveFileId.trim()) {
            return { type: 'url', value: buildGoogleDriveVideoUrl(entry.driveFileId) };
        }

        return { type: 'none', value: '' };
    }

    function ensureVimeoScriptLoaded() {
        if (window.Vimeo && window.Vimeo.Player) {
            return Promise.resolve(window.Vimeo);
        }

        if (vimeoScriptPromise) return vimeoScriptPromise;

        vimeoScriptPromise = new Promise(function(resolve, reject) {
            var existing = document.querySelector('script[data-vimeo-player-api="1"]');
            if (existing) {
                existing.addEventListener('load', function() { resolve(window.Vimeo || null); }, { once: true });
                existing.addEventListener('error', reject, { once: true });
                return;
            }

            var script = document.createElement('script');
            script.src = VIMEO_SCRIPT_URL;
            script.async = true;
            script.defer = true;
            script.setAttribute('data-vimeo-player-api', '1');
            script.onload = function() {
                if (window.Vimeo && window.Vimeo.Player) {
                    resolve(window.Vimeo);
                } else {
                    reject(new Error('No se pudo inicializar Vimeo Player API.'));
                }
            };
            script.onerror = function(err) { reject(err || new Error('Fallo al cargar Vimeo Player API.')); };
            document.head.appendChild(script);
        });

        return vimeoScriptPromise;
    }

    function createVimeoRuntime(apiPlayer) {
        return {
            type: 'vimeo',
            player: apiPlayer,
            paused: true,
            ended: false,
            duration: 0,
            currentTime: 0,
            volume: 0.8,
            muted: false,
            lastVolumeBeforeMute: 0.8,
            listeners: {
                loadedmetadata: [],
                timeupdate: [],
                play: [],
                pause: [],
                ended: []
            },
            ninetySent: false
        };
    }

    function emit(runtime, eventName) {
        var list = runtime.listeners[eventName] || [];
        for (var i = 0; i < list.length; i++) {
            try { list[i](); } catch (e) { /* no-op */ }
        }
    }

    function addDomLikeVideoShim(targetElement, runtime) {
        var nativeAddEventListener = targetElement.addEventListener ? targetElement.addEventListener.bind(targetElement) : null;
        var nativeRemoveEventListener = targetElement.removeEventListener ? targetElement.removeEventListener.bind(targetElement) : null;

        function defineProp(propName, descriptor) {
            try {
                Object.defineProperty(targetElement, propName, descriptor);
            } catch (e) {
                // Fallback simple assignment when defineProperty is blocked.
                try { targetElement[propName] = descriptor.get ? descriptor.get() : descriptor.value; } catch (_e) { /* no-op */ }
            }
        }

        defineProp('duration', {
            configurable: true,
            get: function() { return Number(runtime.duration || 0); }
        });

        defineProp('currentTime', {
            configurable: true,
            get: function() { return Number(runtime.currentTime || 0); },
            set: function(value) {
                var seconds = Math.max(0, Number(value || 0));
                runtime.currentTime = seconds;
                runtime.player.setCurrentTime(seconds).catch(function() { /* no-op */ });
            }
        });

        defineProp('volume', {
            configurable: true,
            get: function() { return Number(runtime.volume || 0); },
            set: function(value) {
                var vol = Math.max(0, Math.min(1, Number(value || 0)));
                runtime.volume = vol;
                if (vol > 0) {
                    runtime.lastVolumeBeforeMute = vol;
                    runtime.muted = false;
                } else {
                    runtime.muted = true;
                }
                runtime.player.setVolume(vol).catch(function() { /* no-op */ });
            }
        });

        defineProp('muted', {
            configurable: true,
            get: function() { return !!runtime.muted; },
            set: function(value) {
                var shouldMute = !!value;
                runtime.muted = shouldMute;
                if (shouldMute) {
                    if (runtime.volume > 0) runtime.lastVolumeBeforeMute = runtime.volume;
                    runtime.volume = 0;
                    runtime.player.setVolume(0).catch(function() { /* no-op */ });
                } else {
                    var restore = runtime.lastVolumeBeforeMute > 0 ? runtime.lastVolumeBeforeMute : 0.8;
                    runtime.volume = restore;
                    runtime.player.setVolume(restore).catch(function() { /* no-op */ });
                }
            }
        });

        defineProp('paused', {
            configurable: true,
            get: function() { return !!runtime.paused; }
        });

        defineProp('ended', {
            configurable: true,
            get: function() { return !!runtime.ended; }
        });

        targetElement.play = function() {
            runtime.ended = false;
            return runtime.player.play();
        };

        targetElement.pause = function() {
            return runtime.player.pause();
        };

        targetElement.load = function() {
            return true;
        };

        targetElement.requestFullscreen = function() {
            if (HTMLElement.prototype.requestFullscreen) return HTMLElement.prototype.requestFullscreen.call(targetElement);
            return Promise.resolve();
        };

        targetElement.addEventListener = function(eventName, callback) {
            if (!eventName || typeof callback !== 'function') return;
            if (runtime.listeners[eventName]) {
                runtime.listeners[eventName].push(callback);
                return;
            }
            if (nativeAddEventListener) nativeAddEventListener(eventName, callback);
        };

        targetElement.removeEventListener = function(eventName, callback) {
            var list = runtime.listeners[eventName];
            if (list && list.length) {
                runtime.listeners[eventName] = list.filter(function(fn) { return fn !== callback; });
                return;
            }
            if (nativeRemoveEventListener) nativeRemoveEventListener(eventName, callback);
        };
    }

    function moduleIdToNumber(moduleId) {
        var match = String(moduleId || '').match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    function renderVimeoFallback(wrapper, vimeoRef, message) {
        if (!wrapper) return;
        var existing = wrapper.querySelector('[data-vimeo-fallback="1"]');
        if (existing) return;

        var overlay = document.createElement('div');
        overlay.setAttribute('data-vimeo-fallback', '1');
        overlay.style.position = 'absolute';
        overlay.style.inset = '0';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.gap = '10px';
        overlay.style.background = 'rgba(0, 0, 0, 0.7)';
        overlay.style.color = '#fff';
        overlay.style.textAlign = 'center';
        overlay.style.padding = '16px';
        overlay.style.zIndex = '2';

        var text = document.createElement('p');
        text.textContent = message || 'No se pudo mostrar el video embebido en esta pagina.';
        text.style.margin = '0';
        text.style.fontSize = '14px';
        text.style.lineHeight = '1.4';

        var link = document.createElement('a');
        var publicUrl = 'https://vimeo.com/' + String(vimeoRef || '').split('?')[0];
        link.href = publicUrl;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Abrir video en Vimeo';
        link.style.display = 'inline-block';
        link.style.background = '#2563eb';
        link.style.color = '#fff';
        link.style.textDecoration = 'none';
        link.style.padding = '8px 12px';
        link.style.borderRadius = '8px';
        link.style.fontWeight = '700';
        link.style.fontSize = '13px';

        overlay.appendChild(text);
        overlay.appendChild(link);
        wrapper.appendChild(overlay);
    }

    function mountVimeoPlayer(settings, vimeoId) {
        var originalNode = settings.videoId ? document.getElementById(settings.videoId) : null;
        if (!originalNode) return;

        // Evita doble montaje si ya es un iframe
        if (originalNode.tagName && originalNode.tagName.toLowerCase() === 'iframe') return;

        var wrapper = originalNode.parentNode;
        if (!wrapper) return;

        // --- Paso 1: montar el iframe INMEDIATAMENTE, sin esperar ningun Promise ---
        var iframe = document.createElement('iframe');
        iframe.id = settings.videoId;
        iframe.src = buildVimeoEmbedUrl(vimeoId);
        iframe.title = 'Video de la sesion';
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('frameborder', '0');
        iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';

        wrapper.replaceChild(iframe, originalNode);

        // --- Paso 2: cargar API de Vimeo en segundo plano solo para auto-completado al 90% ---
        ensureVimeoScriptLoaded().then(function() {
            if (!window.Vimeo || !window.Vimeo.Player) return;
            var ninetySent = false;
            var apiPlayer;
            try { apiPlayer = new window.Vimeo.Player(iframe); } catch (e) { return; }

            apiPlayer.on('timeupdate', function(payload) {
                if (ninetySent) return;
                var cur = Number(payload && payload.seconds || 0);
                var dur = Number(payload && payload.duration || 0);
                if (dur > 0 && (cur / dur) >= 0.9) {
                    ninetySent = true;
                    var moduleNumber = moduleIdToNumber(settings.moduleId);
                    if (typeof window.marcarSesionCompletada === 'function' && moduleNumber > 0) {
                        window.marcarSesionCompletada(settings.courseId, moduleNumber, settings.sessionNumber, true);
                        if (typeof window.renderEstadoSesion === 'function') window.renderEstadoSesion();
                    }
                }
            });
        }).catch(function() { /* API opcional, no bloquea nada */ });
    }

    window.buildGoogleDriveVideoUrl = buildGoogleDriveVideoUrl;

    window.getExternalVideoSource = function(courseId, moduleId, sessionNumber, fallbackUrl) {
        var normalized = normalizeVideoEntry(getExternalVideoEntry(courseId, moduleId, sessionNumber));
        if (normalized.type === 'none') {
            var fallback = String(fallbackUrl || '').trim();
            return fallback ? { type: 'url', value: fallback } : { type: 'none', value: '' };
        }
        return normalized;
    };

    window.getExternalVideoUrl = function(courseId, moduleId, sessionNumber, fallbackUrl) {
        var source = window.getExternalVideoSource(courseId, moduleId, sessionNumber, fallbackUrl);
        if (source.type === 'vimeo') return buildVimeoEmbedUrl(source.value);
        return source.value || '';
    };

    window.applyExternalVideoSource = function(options) {
        var settings = options || {};
        var video = settings.videoId ? document.getElementById(settings.videoId) : null;
        if (!video) return false;

        // Ya montado como iframe, no hacer nada
        if (video.tagName && video.tagName.toLowerCase() === 'iframe') return false;

        var source = settings.sourceId ? document.getElementById(settings.sourceId) : video.querySelector('source');
        var fallbackUrl = source ? (source.getAttribute('src') || '') : '';
        var resolved = window.getExternalVideoSource(settings.courseId, settings.moduleId, settings.sessionNumber, fallbackUrl);

        if (resolved.type === 'vimeo') {
            mountVimeoPlayer(settings, resolved.value);
            return true;
        }

        if (resolved.type !== 'url' || !resolved.value) return false;
        if (!source) return false;
        if (resolved.value === fallbackUrl) return false;

        source.src = resolved.value;
        video.load();
        return true;
    };
})();