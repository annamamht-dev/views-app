let currentLeadId = null;
let currentLeadCard = null;

function openLeadDetails(leadId) {
    currentLeadId = leadId;
    currentLeadCard = document.querySelector(`[data-lead-id="${leadId}"]`);
    
    const modal = document.getElementById('leadModal');
    const statusSelect = document.getElementById('statusSelect');
    
    // Définir le statut actuel dans le select selon la carte
    if (currentLeadCard) {
        const currentStatus = currentLeadCard.classList.contains('status-new') ? 'new' :
                             currentLeadCard.classList.contains('status-pending') ? 'pending' :
                             currentLeadCard.classList.contains('status-success') ? 'success' : 'new';
        statusSelect.value = currentStatus;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLeadDetails() {
    const modal = document.getElementById('leadModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentLeadId = null;
    currentLeadCard = null;
}

// Fermer la modale si on clique en dehors du contenu (sur le fond gris)
document.getElementById('leadModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLeadDetails();
    }
});

// Gérer le changement de statut en temps réel
document.addEventListener('DOMContentLoaded', function() {
    const statusSelect = document.getElementById('statusSelect');
    
    statusSelect.addEventListener('change', function() {
        if (!currentLeadCard) return;
        
        const newStatus = this.value;
        const statusDot = currentLeadCard.querySelector('.status-dot');
        const statusText = currentLeadCard.querySelector('.status-text');
        
        // Retirer toutes les classes de statut
        currentLeadCard.classList.remove('status-new', 'status-pending', 'status-success', 'status-archive');
        
        // Ajouter la nouvelle classe de statut
        currentLeadCard.classList.add(`status-${newStatus}`);
        
        // Mettre à jour le texte du statut
        if (statusText) {
            const statusLabels = {
                'new': 'Nouveau',
                'pending': 'En cours',
                'success': 'Vente',
                'archive': 'Archivé'
            };
            statusText.textContent = statusLabels[newStatus] || 'Nouveau';
        }
        
        // Mettre à jour la couleur de la puce immédiatement
        // Les styles CSS existants gèrent déjà les couleurs via .status-new, .status-pending, etc.
    });
});