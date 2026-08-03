const ROLES = ['Estudiante', 'Instructor', 'Director'];
const ADMIN_KEY = 'admin123';

// Esquema de sesiones por curso (debe coincidir con app.js del sitio web)
const CURSO_ESQUEMA = {
  mecanica_nivel1: [
    { modulo: 1, sesiones: 1 },
    { modulo: 2, sesiones: 9 },
    { modulo: 3, sesiones: 4 },
    { modulo: 4, sesiones: 1 },
    { modulo: 5, sesiones: 1 },
    { modulo: 6, sesiones: 1 },
    { modulo: 7, sesiones: 1 },
    { modulo: 8, sesiones: 1 }
  ],
  mecanica_nivel2: [{ modulo: 1, sesiones: 1 }],
  mecanica_nivel3: [{ modulo: 1, sesiones: 1 }],
  electro_nivel1:  [{ modulo: 1, sesiones: 1 }],
  fluidos_nivel1:  [{ modulo: 1, sesiones: 1 }],
  fluidos_nivel2:  [{ modulo: 1, sesiones: 1 }],
  fluidos_nivel3:  [{ modulo: 1, sesiones: 1 }],
  matematica_nivel1: [{ modulo: 1, sesiones: 1 }]
};

const state = {
  users: [],
  posts: [],
  comments: []
};

function esc(v) {
  return String(v || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function byId(id) {
  return document.getElementById(id);
}

async function loadState() {
  const fresh = await window.adminApi.getState();
  state.users = Array.isArray(fresh.users) ? fresh.users : [];
  state.posts = Array.isArray(fresh.posts) ? fresh.posts : [];
  state.comments = Array.isArray(fresh.comments) ? fresh.comments : [];
  renderAll();
}

async function persist() {
  const saved = await window.adminApi.saveState(state);
  state.users = saved.users;
  state.posts = saved.posts;
  state.comments = saved.comments;
}

function renderUsers() {
  const body = byId('usersBody');
  if (!state.users.length) {
    body.innerHTML = '<tr><td colspan="4">Sin usuarios</td></tr>';
    return;
  }

  body.innerHTML = state.users.map((u) => {
    const role = u.formacion || 'Estudiante';
    return '<tr>' +
      '<td>' + esc(u.usuario) + '</td>' +
      '<td>' + esc(u.email) + '</td>' +
      '<td>' +
        '<select data-role-user="' + esc(u.usuario) + '">' +
          ROLES.map((r) => '<option value="' + esc(r) + '"' + (r === role ? ' selected' : '') + '>' + esc(r) + '</option>').join('') +
        '</select>' +
      '</td>' +
      '<td><button class="danger" data-del-user="' + esc(u.usuario) + '">Eliminar</button></td>' +
    '</tr>';
  }).join('');
}

function renderCourseUserSelect() {
  const sel = byId('courseUser');
  if (!state.users.length) {
    sel.innerHTML = '<option value="">Sin usuarios</option>';
    byId('courseList').innerHTML = '';
    return;
  }
  const current = sel.value;
  sel.innerHTML = state.users.map((u) => '<option value="' + esc(u.usuario) + '">' + esc(u.usuario) + '</option>').join('');
  if (current) sel.value = current;
  if (!sel.value) sel.selectedIndex = 0;
  renderCourseList();
}

function renderCourseList() {
  const user = byId('courseUser').value;
  const list = byId('courseList');
  const u = state.users.find((x) => x.usuario === user);
  const courses = u && Array.isArray(u.cursos) ? u.cursos : [];
  if (!courses.length) {
    list.innerHTML = '<option value="">Sin cursos</option>';
    return;
  }
  list.innerHTML = courses.map((c) => '<option value="' + esc(c) + '">' + esc(c) + '</option>').join('');
}

function renderProgressUserSelect() {
  const sel = byId('progressUser');
  if (!state.users.length) {
    sel.innerHTML = '<option value="">Sin usuarios</option>';
    byId('progressDetail').value = '';
    return;
  }
  const current = sel.value;
  sel.innerHTML = state.users.map((u) => '<option value="' + esc(u.usuario) + '">' + esc(u.usuario) + '</option>').join('');
  if (current) sel.value = current;
  if (!sel.value) sel.selectedIndex = 0;
}

function getPostSummary(p) {
  if (p.texto && p.texto.trim()) return p.texto.trim();
  if (p.progreso && p.progreso.curso) return 'Progreso en ' + p.progreso.curso;
  if (p.imagen) return '[Publicacion con imagen]';
  return '[Sin texto]';
}

function renderPosts() {
  const body = byId('postsBody');
  if (!state.posts.length) {
    body.innerHTML = '<tr><td colspan="5">Sin publicaciones</td></tr>';
    return;
  }

  body.innerHTML = state.posts.map((p) => {
    const summary = getPostSummary(p);
    const clipped = summary.length > 64 ? summary.slice(0, 64) + '...' : summary;
    return '<tr>' +
      '<td>' + esc(p.usuario) + '</td>' +
      '<td>' + esc(p.fecha) + '</td>' +
      '<td>' + esc(clipped) + '</td>' +
      '<td>' + esc(String(p.likes || 0)) + '</td>' +
      '<td>' +
        '<button class="ghost" data-view-post="' + esc(String(p.id)) + '">Ver</button> ' +
        '<button class="danger" data-del-post="' + esc(String(p.id)) + '">Eliminar</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function renderAll() {
  renderUsers();
  renderCourseUserSelect();
  renderProgressUserSelect();
  renderPosts();
}

function bindStaticEvents() {
  byId('loginBtn').addEventListener('click', async () => {
    const key = (byId('adminKey').value || '').trim();
    if (key !== ADMIN_KEY) {
      byId('authMsg').textContent = 'Codigo incorrecto';
      return;
    }
    byId('authView').classList.add('hidden');
    byId('appView').classList.remove('hidden');
    await loadState();
  });

  byId('logoutBtn').addEventListener('click', () => {
    byId('appView').classList.add('hidden');
    byId('authView').classList.remove('hidden');
    byId('adminKey').value = '';
    byId('authMsg').textContent = '';
  });

  byId('reloadBtn').addEventListener('click', loadState);

  byId('importBtn').addEventListener('click', async () => {
    const data = await window.adminApi.importFile();
    if (!data) return;
    // Combinar: no sobreescribir usuarios existentes, solo agregar nuevos
    const existingNames = new Set(state.users.map((u) => u.usuario));
    const newUsers = (data.users || []).filter((u) => !existingNames.has(u.usuario));
    state.users = state.users.concat(newUsers);

    // Actualizar datos de usuarios que ya existen (cursos, rol)
    (data.users || []).forEach((importedUser) => {
      const existing = state.users.find((u) => u.usuario === importedUser.usuario);
      if (existing && existingNames.has(importedUser.usuario)) {
        existing.formacion = importedUser.formacion || existing.formacion;
        existing.cursos = importedUser.cursos || existing.cursos;
      }
    });

    // Combinar publicaciones
    const existingPostIds = new Set(state.posts.map((p) => p.id));
    const newPosts = (data.posts || []).filter((p) => !existingPostIds.has(p.id));
    state.posts = state.posts.concat(newPosts);

    await persist();
    renderAll();
    alert('Datos importados: ' + (data.users || []).length + ' usuarios, ' + (data.posts || []).length + ' publicaciones.');
  });

  byId('exportBtn').addEventListener('click', async () => {
    const result = await window.adminApi.exportFile();
    if (!result || !result.ok) return;
    alert('Archivo exportado en:\n' + result.filePath + '\n\nSiguiente paso: abre importar-datos.html y pulsa "Importar automático".');
  });

  byId('resetBtn').addEventListener('click', async () => {
    if (!confirm('Reset total de datos?')) return;
    const fresh = await window.adminApi.resetState();
    state.users = fresh.users;
    state.posts = fresh.posts;
    state.comments = fresh.comments;
    renderAll();
    byId('postPreview').classList.add('hidden');
  });

  byId('courseUser').addEventListener('change', renderCourseList);

  byId('progressUser').addEventListener('change', () => {
    byId('progressDetail').value = '';
  });

  byId('viewProgressBtn').addEventListener('click', () => {
    const username = byId('progressUser').value;
    const courseId = (byId('progressCourse').value || '').trim();
    if (!username || !courseId) {
      alert('Selecciona un usuario y un curso.');
      return;
    }
    
    const progressData = JSON.parse(localStorage.getItem('cursoProgresoEstado') || '{}');
    const sessionKeys = Object.keys(progressData.sesionesCompletadas || {});
    const pattern = '^' + courseId.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&') + '\\|';
    const regex = new RegExp(pattern);
    const matchingSessions = sessionKeys.filter((k) => regex.test(k));
    
    const CURSO_ESQUEMA = {
      mecanica_nivel1: { nombre: 'Mecánica Clásica Nivel I', modulos: Array(8).fill(null).map((_, i) => ({ id: 'm' + (i+1), sesiones: ['s1'] })) }
    };
    const config = CURSO_ESQUEMA[courseId];
    const totalSesiones = config ? config.modulos.reduce((sum, m) => sum + m.sesiones.length, 0) : 0;
    
    const porcentaje = totalSesiones > 0 ? Math.round((matchingSessions.length / totalSesiones) * 100) : 0;
    
    byId('progressDetail').value = 
      'Usuario: ' + username + '\n' +
      'Curso: ' + courseId + '\n' +
      'Progreso: ' + porcentaje + '% (' + matchingSessions.length + ' de ' + totalSesiones + ' sesiones)\n\n' +
      'Sesiones completadas:\n' + matchingSessions.join('\n');
  });

  byId('clearProgressBtn').addEventListener('click', () => {
    const courseId = (byId('progressCourse').value || '').trim();
    if (!courseId) {
      alert('Selecciona un curso.');
      return;
    }
    if (!confirm('¿Limpiar todo el progreso de ' + courseId + '?')) return;
    
    const progressData = JSON.parse(localStorage.getItem('cursoProgresoEstado') || '{}');
    const sessionKeys = Object.keys(progressData.sesionesCompletadas || {});
    const pattern = '^' + courseId.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&') + '\\|';
    const regex = new RegExp(pattern);
    
    sessionKeys.forEach((k) => {
      if (regex.test(k)) {
        delete progressData.sesionesCompletadas[k];
      }
    });
    
    localStorage.setItem('cursoProgresoEstado', JSON.stringify(progressData));
    byId('progressDetail').value = 'Progreso de ' + courseId + ' limpiado.';
    alert('Progreso limpiado.');
  });

  byId('addCourseBtn').addEventListener('click', async () => {
    const username = byId('courseUser').value;
    const course = (byId('courseName').value || '').trim();
    if (!username || !course) { alert('Selecciona un usuario y un curso.'); return; }

    const u = state.users.find((x) => x.usuario === username);
    if (!u) return;
    if (!Array.isArray(u.cursos)) u.cursos = [];
    if (u.cursos.some((c) => String(c).toLowerCase() === course.toLowerCase())) return;
    u.cursos.push(course);
    await persist();
    byId('courseName').value = '';
    renderCourseList();
  });

  byId('removeCourseBtn').addEventListener('click', async () => {
    const username = byId('courseUser').value;
    const selected = byId('courseList').value;
    if (!username || !selected || selected === 'Sin cursos') return;

    const u = state.users.find((x) => x.usuario === username);
    if (!u || !Array.isArray(u.cursos)) return;
    u.cursos = u.cursos.filter((c) => c !== selected);
    await persist();
    renderCourseList();
  });

  document.addEventListener('click', async (evt) => {
    const roleSel = evt.target.closest('select[data-role-user]');
    if (roleSel) return;

    const delUserBtn = evt.target.closest('button[data-del-user]');
    if (delUserBtn) {
      const user = delUserBtn.getAttribute('data-del-user');
      if (!confirm('Eliminar usuario ' + user + '?')) return;
      state.users = state.users.filter((u) => u.usuario !== user);
      state.posts = state.posts.filter((p) => p.usuario !== user);
      state.comments = state.comments.filter((c) => c.autor !== user && c.destino !== user);
      await persist();
      renderAll();
      return;
    }

    const viewPostBtn = evt.target.closest('button[data-view-post]');
    if (viewPostBtn) {
      const id = viewPostBtn.getAttribute('data-view-post');
      const p = state.posts.find((x) => String(x.id) === String(id));
      if (!p) return;
      const box = byId('postPreview');
      box.textContent =
        'Usuario: ' + (p.usuario || '') + '\n' +
        'Fecha: ' + (p.fecha || '') + '\n' +
        'Likes: ' + String(p.likes || 0) + '\n\n' +
        (p.texto || '[Sin texto]');
      box.classList.remove('hidden');
      return;
    }

    const delPostBtn = evt.target.closest('button[data-del-post]');
    if (delPostBtn) {
      const id = delPostBtn.getAttribute('data-del-post');
      if (!confirm('Eliminar publicacion?')) return;
      state.posts = state.posts.filter((p) => String(p.id) !== String(id));
      await persist();
      renderPosts();
      return;
    }
  });

  document.addEventListener('change', async (evt) => {
    const roleSel = evt.target.closest('select[data-role-user]');
    if (!roleSel) return;
    const user = roleSel.getAttribute('data-role-user');
    const role = roleSel.value;
    const u = state.users.find((x) => x.usuario === user);
    if (!u) return;
    u.formacion = role;
    await persist();
  });
  byId('completeAllBtn').addEventListener('click', async () => {
    const username = byId('progressUser').value;
    const courseId = (byId('progressCourse').value || '').trim();
    if (!username || !courseId) { alert('Selecciona un usuario y un curso.'); return; }

    const esquema = CURSO_ESQUEMA[courseId];
    if (!esquema) { alert('Curso no encontrado en el esquema.'); return; }

    const u = state.users.find((x) => x.usuario === username);
    if (!u) { alert('Usuario no encontrado.'); return; }

    if (!confirm('¿Marcar TODAS las sesiones de "' + courseId + '" como completadas para ' + username + '?')) return;

    const sesionesCompletadas = {};
    esquema.forEach(({ modulo, sesiones }) => {
      for (let s = 1; s <= sesiones; s++) {
        sesionesCompletadas[courseId + '|m' + modulo + '|s' + s] = true;
      }
    });

    if (!u.progreso) u.progreso = {};
    u.progreso[courseId] = { sesionesCompletadas };

    await persist();
    byId('progressDetail').value =
      'Completadas todas las sesiones de ' + courseId + ' para ' + username + '.\n\n' +
      Object.keys(sesionesCompletadas).join('\n') +
      '\n\nExporta desde "Exportar para Web" e importa en importar-datos.html para aplicar al navegador.';
  });

  byId('removeAllBtn').addEventListener('click', async () => {
    const username = byId('progressUser').value;
    const courseId = (byId('progressCourse').value || '').trim();
    if (!username || !courseId) { alert('Selecciona un usuario y un curso.'); return; }

    const u = state.users.find((x) => x.usuario === username);
    if (!u) { alert('Usuario no encontrado.'); return; }

    if (!confirm('¿Quitar TODAS las sesiones completadas de "' + courseId + '" para ' + username + '?')) return;

    if (u.progreso && u.progreso[courseId]) {
      u.progreso[courseId] = { sesionesCompletadas: {} };
    }

    await persist();
    byId('progressDetail').value =
      'Progreso de ' + courseId + ' eliminado para ' + username + '.\n\n' +
      'Exporta desde "Exportar para Web" e importa en importar-datos.html para aplicar al navegador.';
  });

}

bindStaticEvents();
