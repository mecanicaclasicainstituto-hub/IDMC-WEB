IDMC Admin Desktop (Electron)

Estructura:
- package.json
- main.js
- preload.js
- src/index.html
- src/styles.css
- src/renderer.js

Como ejecutar:
1) Instala Node.js LTS (incluye npm): https://nodejs.org
2) Abre terminal en esta carpeta: admin-desktop
3) Ejecuta: npm install
4) Ejecuta: npm start

Notas:
- Login admin por defecto: admin123
- La base de datos local se guarda en admin-db.json dentro de la carpeta userData de Electron.
- Modulos incluidos: usuarios/roles, cursos por usuario, publicaciones (ver y eliminar).
