// ============================================
// DONNÉES DES PROSPECTS
// ============================================
const leadsData = {
    lead1: {
        nom:    'Sophie Martin',
        phone:  '0612345678',
        email:  'sophie.martin@email.com',
    },
    lead2: {
        nom:    'Jean Dupont',
        phone:  '0623456789',
        email:  'jean.dupont@email.com',
    },
    lead3: {
        nom:    'Claire Fontaine',
        phone:  '0634567890',
        email:  'claire.fontaine@email.com',
    },
};

// ============================================
// ÉTAT COURANT
// ============================================
let currentLeadId    = null;
let currentLeadCard  = null;
let currentLeadPhone = null;

// ============================================
// ACTIONS CONTACT (déclenchées par onclick)
// ============================================
function contactWhatsapp() {
    if (!currentLeadPhone) return;
    var digits = currentLeadPhone.replace(/\D/g, '');
    var intl   = digits.charAt(0) === '0' ? '33' + digits.slice(1) : digits;
    window.location.href = 'https://wa.me/' + intl;
}

function contactPhone() {
    if (!currentLeadPhone) return;
    var digits = currentLeadPhone.replace(/\D/g, '');
    window.location.href = 'tel:+33' + digits.slice(1);
}

// ============================================
// OUVERTURE MODALE
// ============================================
function openLeadDetails(leadId) {
    currentLeadId   = leadId;
    currentLeadCard = document.querySelector('[data-lead-id="' + leadId + '"]');

    const lead = leadsData[leadId];
    const modal = document.getElementById('leadModal');

    // Populer les infos du prospect
    if (lead) {
        currentLeadPhone = lead.phone;
        document.getElementById('modalName').textContent  = lead.nom;
        document.getElementById('modalPhone').textContent = lead.phone.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
        document.getElementById('modalEmail').textContent = lead.email;
    }

    // Synchroniser le select de statut avec la carte
    const statusSelect = document.getElementById('statusSelect');
    if (currentLeadCard) {
        const currentStatus = currentLeadCard.classList.contains('status-new')     ? 'new'     :
                              currentLeadCard.classList.contains('status-pending')  ? 'pending' :
                              currentLeadCard.classList.contains('status-success')  ? 'success' :
                              currentLeadCard.classList.contains('status-archive')  ? 'archive' : 'new';
        statusSelect.value = currentStatus;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// FERMETURE MODALE
// ============================================
function closeLeadDetails() {
    document.getElementById('leadModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    currentLeadId    = null;
    currentLeadCard  = null;
    currentLeadPhone = null;
}

// Fermer en cliquant sur le fond
document.getElementById('leadModal').addEventListener('click', function(e) {
    if (e.target === this) closeLeadDetails();
});

// ============================================
// CHANGEMENT DE STATUT EN TEMPS RÉEL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const statusSelect = document.getElementById('statusSelect');

    statusSelect.addEventListener('change', function() {
        if (!currentLeadCard) return;

        const newStatus  = this.value;
        const statusText = currentLeadCard.querySelector('.status-text');

        currentLeadCard.classList.remove('status-new', 'status-pending', 'status-success', 'status-archive');
        currentLeadCard.classList.add('status-' + newStatus);

        if (statusText) {
            const labels = { new: 'Nouveau', pending: 'En cours', success: 'Vente', archive: 'Archivé' };
            statusText.textContent = labels[newStatus] || 'Nouveau';
        }
    });
});
