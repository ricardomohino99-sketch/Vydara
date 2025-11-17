document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración Inicial y Variables del DOM
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const authButton = document.getElementById('auth-button');
    const downloadButton = document.getElementById('download-button');
    const authModal = document.getElementById('auth-modal');
    const authForm = document.getElementById('auth-form');
    const doubtForm = document.getElementById('doubt-form');
    const codeRedeemForm = document.getElementById('code-redeem-form');

    // Estado de la autenticación (Simulación inicial: cambiar con la integración del Backend)
    // Para la prueba de frontend, iniciamos como NO logueado.
    let isAuthenticated = false;
    let currentRole = 'user'; // 'user', 'admin', 'dev'
    let userName = ""; // Nombre de usuario logueado

    // 2. Función de Lógica de UI y Autenticación
    function updateAuthUI(isLoggedIn, user = '', role = 'user') {
        isAuthenticated = isLoggedIn;
        currentRole = role;
        userName = user;

        const header = document.querySelector('.main-header');
        
        // Limpiar el menú de perfil existente, si lo hay
        const existingProfile = document.getElementById('user-profile');
        if (existingProfile) existingProfile.remove();

        if (isAuthenticated) {
            // Mostrar botón de Perfil y ocultar Login/Registro
            authButton.style.display = 'none';
            
            const profileMenu = document.createElement('div');
            profileMenu.id = 'user-profile';
            profileMenu.className = 'profile-menu';
            profileMenu.textContent = `${user} (${role.toUpperCase()})`;
            profileMenu.onclick = () => {
                window.location.href = 'perfil.html'; 
            };
            
            header.appendChild(profileMenu);

            // Habilitar el botón de descarga
            if (downloadButton) {
                downloadButton.disabled = false;
                downloadButton.textContent = 'Descargar Juego (¡Jugar Ahora!)';
            }
        } else {
            // Mostrar botón de Login/Registro
            authButton.style.display = 'block';

            // Deshabilitar el botón de descarga
            if (downloadButton) {
                downloadButton.disabled = true;
                downloadButton.textContent = 'Descargar Juego (¡Necesitas registrarte!)';
            }
        }
        
        // Verificar y ajustar elementos de Admin/Dev en todas las páginas
        checkUserRole(currentRole); 
    }
    
    // Función para actualizar elementos de Admin/Dev
    function checkUserRole(role) {
        const adminDevElements = document.querySelectorAll('.admin-only, .admin-dev-only');
        
        if (role === 'admin' || role === 'dev') {
            adminDevElements.forEach(el => {
                el.style.display = 'block';
            });
        } else {
            adminDevElements.forEach(el => {
                el.style.display = 'none';
            });
        }
    }


    // 3. Lógica del Modal (Registro/Inicio de Sesión)
    if (authModal) {
        const closeBtn = authModal.querySelector('.close-btn');

        authButton.onclick = () => {
            authModal.style.display = 'block';
        }

        closeBtn.onclick = () => {
            authModal.style.display = 'none';
        }

        // Cierra el modal si se hace clic fuera
        window.onclick = (event) => {
            if (event.target == authModal) {
                authModal.style.display = 'none';
            }
        }
    }

    // 4. Manejo del Formulario de Autenticación (Simulación de Backend)
    if (authForm) {
        authForm.onsubmit = async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            // Aquí se enviaría la petición al backend para login/registro
            
            // **SIMULACIÓN:**
            // Asumimos éxito. Si el username contiene "admin" o "dev", le asignamos ese rol para la prueba.
            const simulatedRole = username.toLowerCase().includes('admin') ? 'admin' : 
                                  username.toLowerCase().includes('dev') ? 'dev' : 'user';

            if (authModal) authModal.style.display = 'none';
            updateAuthUI(true, username, simulatedRole);
            alert(`¡Bienvenido, ${username}! (Rol: ${simulatedRole.toUpperCase()})`);
            // FIN SIMULACIÓN
        };
    }

    // 5. Lógica de Descarga (Solo en la página de inicio)
    if (downloadButton) {
        downloadButton.onclick = () => {
            if (isAuthenticated) {
                alert("Iniciando la descarga de Vydara...");
            } else {
                alert("Debes iniciar sesión o registrarte para descargar.");
                if (authButton) authButton.click(); // Abrir el modal
            }
        };
    }

    // 6. Funcionalidades de Información (Tienda y Dudas)
    /** Muestra u oculta las pestañas de la tienda */
    window.showShop = function(category) {
        const merch = document.getElementById('merch-items');
        const ingame = document.getElementById('ingame-items');
        
        if (merch && ingame) {
            merch.style.display = 'none';
            ingame.style.display = 'none';
            
            document.querySelectorAll('.shop-tab').forEach(btn => btn.classList.remove('active'));
            
            if (category === 'merch') {
                merch.style.display = 'block';
                document.querySelector('.shop-tab:nth-child(1)').classList.add('active');
            } else if (category === 'ingame') {
                ingame.style.display = 'block';
                document.querySelector('.shop-tab:nth-child(2)').classList.add('active');
            }
        }
    };

    if (doubtForm) {
        doubtForm.onsubmit = (e) => {
            e.preventDefault();
            // LÓGICA DE ENVÍO DE FORMULARIO DE DUDAS AL BACKEND
            alert('Tu duda ha sido enviada al equipo de administración. ¡Gracias! (Backend lo gestionará)');
            doubtForm.reset();
        };
    }

    // 7. Funcionalidades de Perfil (Tabs y Canje de Códigos)
    
    /** Muestra la sección activa en el perfil del usuario */
    window.showProfileSection = function(sectionId) {
        // Oculta todas las secciones
        document.querySelectorAll('.profile-section').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        // Muestra la sección seleccionada
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.style.display = 'block';
            activeSection.classList.add('active');
        }

        // Actualiza los botones de la pestaña
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[onclick="showProfileSection('${sectionId}')"]`).classList.add('active');
    };

    if (codeRedeemForm) {
        codeRedeemForm.onsubmit = (e) => {
            e.preventDefault();
            const code = e.target.querySelector('input').value;
            // LÓGICA PARA ENVIAR EL CÓDIGO AL BACKEND Y VERIFICAR
            alert(`Intentando canjear el código: ${code}. Esperando respuesta del servidor...`);
            e.target.reset();
        };
    }
    
    // 8. Inicializar el estado de la UI (Simulación: Si hay cookie/token, se actualiza)
    // Para probar la UI de perfil: updateAuthUI(true, "Maxucado", "dev");
    updateAuthUI(isAuthenticated, userName, currentRole);
});