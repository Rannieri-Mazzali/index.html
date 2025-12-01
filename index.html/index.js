// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form');
  const btnAgendar = document.getElementById('btnAgendar');
  const contactBtn = document.getElementById('contact-btn');

  // definir data mínima como hoje
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  if (btnAgendar) {
    btnAgendar.addEventListener('click', () => {
      document.getElementById('agendamentoSection').scrollIntoView({ behavior: 'smooth' });
      const nameInput = document.getElementById('client-name');
      if (nameInput) nameInput.focus();
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function normalizePhone(raw) {
    if (!raw) return '';
    let p = raw.replace(/[^\d+]/g, '');
    if (p.startsWith('+')) p = p.slice(1);
    if (p.startsWith('351')) p = p.slice(3);
    while (p.length > 0 && p.startsWith('0')) p = p.slice(1);
    return p;
  }

  function showToast(text, time = 3000) {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), time);
  }

  function createModal(messagePreview, onConfirm) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Confirmar mensagem">
        <h4>✨ Confirmar Agendamento</h4>
        <div class="preview">${messagePreview}</div>
        <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px">
          <button id="modal-cancel" class="btn btn-secondary">Editar</button>
          <button id="modal-confirm" class="btn btn-primary">
            <i class="fab fa-whatsapp"></i> Enviar
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const cancel = backdrop.querySelector('#modal-cancel');
    const confirm = backdrop.querySelector('#modal-confirm');
    cancel.focus();

    function remove() { backdrop.remove(); }
    cancel.addEventListener('click', () => { remove(); });
    confirm.addEventListener('click', () => { onConfirm(); remove(); });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) remove();
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name').value.trim();
    const phoneRaw = document.getElementById('client-phone').value.trim();
    const phone = normalizePhone(phoneRaw);
    const service = document.getElementById('service-select').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const notes = document.getElementById('notes').value.trim();

    if (!name || !phone || phone.length !== 9 || !date || !time || service === '') {
      showToast('❌ Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const lines = [
      `👋 Olá, sou ${name}.`,
      `💅 Serviço: ${service}`,
      `📅 Data: ${date}`,
      `⏰ Hora: ${time}`,
      notes ? `📝 Observações: ${notes}` : ''
    ].filter(Boolean);

    const preview = lines.join('\n');
    createModal(preview, () => {
      const text = encodeURIComponent(preview);
      const phoneInternational = '351936745953';
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const whatsappUrl = isMobile
        ? `whatsapp://send?phone=${phoneInternational}&text=${text}`
        : `https://api.whatsapp.com/send?phone=${phoneInternational}&text=${text}`;

      try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        showToast('✅ A abrir WhatsApp...');
        form.reset();
      } catch (err) {
        showToast('❌ Não foi possível abrir o WhatsApp.');
      }
    });
  });

});
// ...existing code...