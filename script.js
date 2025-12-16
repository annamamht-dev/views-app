document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('premiumForm');
    
    // Configuration des 3 zones d'upload
    setupFileUpload('uploadMutuelle', 'carteMutuelle', 'fileNameMutuelle');
    setupFileUpload('uploadGaranties', 'tableauGaranties', 'fileNameGaranties');
    setupFileUpload('uploadOrdonnance', 'ordonnance', 'fileNameOrdonnance'); // Le nouveau bloc

    // Gestion de la soumission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const btn = form.querySelector('.submit-button');
            const originalHTML = btn.innerHTML;
            
            // Simulation chargement
            btn.disabled = true;
            btn.innerHTML = 'ENVOI EN COURS...';
            
            // Simulation d'envoi (2 secondes)
            setTimeout(() => {
                showSuccessMessage();
                form.reset();
                resetUploads();
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }, 2000);
        }
    });
});

function setupFileUpload(zoneId, inputId, nameId) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    const nameDisplay = document.getElementById(nameId);

    if(!zone || !input) return; // Sécurité si un élément manque

    // Clic sur la zone déclenche l'input
    zone.addEventListener('click', () => input.click());

    // Quand un fichier est choisi
    input.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            nameDisplay.textContent = this.files[0].name;
            zone.classList.add('has-file');
            // Retirer l'état invalid si présent
            zone.classList.remove('invalid');
            zone.style.borderColor = '';
            zone.style.animation = '';
        } else {
            zone.classList.remove('has-file');
            nameDisplay.textContent = '';
        }
    });

    // Drag & Drop
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            input.files = e.dataTransfer.files;
            const event = new Event('change');
            input.dispatchEvent(event);
        }
    });
}

function validateForm() {
    let isValid = true;
    const requiredInputs = document.querySelectorAll('input[required], textarea[required]');
    const requiredFiles = document.querySelectorAll('input[type="file"][required]');
    
    // Validation des champs texte
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid');
            // Retirer l'animation après qu'elle soit terminée pour pouvoir la relancer
            setTimeout(() => {
                input.classList.remove('invalid');
            }, 500);
            setTimeout(() => {
                input.classList.add('invalid');
            }, 10);
        } else {
            input.classList.remove('invalid');
        }
    });
    
    // Validation des fichiers
    requiredFiles.forEach(fileInput => {
        if (!fileInput.files || fileInput.files.length === 0) {
            isValid = false;
            const zone = fileInput.closest('.upload-zone');
            if (zone) {
                zone.classList.add('invalid');
                zone.style.borderColor = 'var(--error-color)';
                zone.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    zone.style.animation = '';
                }, 500);
            }
        } else {
            const zone = fileInput.closest('.upload-zone');
            if (zone) {
                zone.classList.remove('invalid');
            }
        }
    });
    
    if (!isValid) {
        // Message discret sans alert
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(255, 77, 77, 0.95); color: white; padding: 12px 24px;
            border-radius: 8px; font-size: 13px; z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        errorMsg.textContent = 'Veuillez remplir tous les champs obligatoires et ajouter vos documents.';
        document.body.appendChild(errorMsg);
        setTimeout(() => {
            errorMsg.style.opacity = '0';
            setTimeout(() => errorMsg.remove(), 300);
        }, 3000);
    }
    return isValid;
}

function resetUploads() {
    document.querySelectorAll('.file-name').forEach(el => el.textContent = '');
    document.querySelectorAll('.upload-zone').forEach(el => {
        el.classList.remove('has-file', 'invalid');
        el.style.borderColor = '';
        el.style.backgroundColor = '';
        el.style.animation = '';
    });
    // Réinitialiser les inputs de fichiers
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.value = '';
    });
}

function showSuccessMessage() {
    // Modale Monochrome
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center;
        z-index: 1000; animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="text-align: center; color: #fff;">
            <div style="font-size: 50px; margin-bottom: 20px;">✓</div>
            <h2 style="font-size: 24px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">Merci</h2>
            <p style="color: #aaa;">Vos documents ont bien été transmis.</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 500);
    }, 3000);
}