// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  // SLIDESHOW
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsContainer = document.getElementById('dots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let current = 0;
  let timer = null;
  const interval = 6000;

  function makeDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.type = 'button';
      d.dataset.index = i;
      d.setAttribute('aria-label', `Slide ${i+1}`);
      dotsContainer.appendChild(d);
    });
  }

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    if (dotsContainer) Array.from(dotsContainer.children).forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  function nextSlide() { showSlide((current + 1) % slides.length); }
  function prevSlideFn() { showSlide((current - 1 + slides.length) % slides.length); }

  function startTimer() {
    stopTimer();
    timer = setInterval(nextSlide, interval);
  }
  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  if (slides.length) {
    makeDots();
    showSlide(0);
    startTimer();
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlideFn(); startTimer(); });

  if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
      const idx = Number(e.target.dataset.index);
      if (!Number.isNaN(idx)) { showSlide(idx); startTimer(); }
    });
  }

  const hero = document.querySelector('.hero-viewport');
  hero?.addEventListener('mouseenter', stopTimer);
  hero?.addEventListener('mouseleave', startTimer);

  /* ---------- Booking form ---------- */
  const form = document.getElementById('booking-form');
  const btnAgendar = document.getElementById('btnAgendar');

  // data mínima hoje
  const dateInput = document.getElementById('date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  if (btnAgendar) {
    btnAgendar.addEventListener('click', () => {
      document.getElementById('agendamentoSection')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('client-name')?.focus();
    });
  }

  function normalizePhone(raw) {
    if (!raw) return '';
    let p = String(raw).replace(/[^\d+]/g, '');
    if (p.startsWith('+')) p = p.slice(1);
    if (p.startsWith('351')) p = p.slice(3);
    while (p.length > 0 && p.startsWith('0')) p = p.slice(1);
    return p;
  }

  function showToast(text, time = 3000) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
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
        <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px">
          <button id="modal-cancel" class="btn btn-ghost">Editar</button>
          <button id="modal-confirm" class="btn btn-cta"><i class="fab fa-whatsapp"></i> Enviar</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    const cancel = backdrop.querySelector('#modal-cancel');
    const confirm = backdrop.querySelector('#modal-confirm');
    cancel?.focus();
    function remove(){ backdrop.remove(); }
    cancel?.addEventListener('click', remove);
    confirm?.addEventListener('click', () => { onConfirm(); remove(); });
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) remove(); });
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name')?.value.trim() ?? '';
    const phoneRaw = document.getElementById('client-phone')?.value.trim() ?? '';
    const phone = normalizePhone(phoneRaw);
    const service = document.getElementById('service-select')?.value ?? '';
    const date = document.getElementById('date')?.value ?? '';
    const time = document.getElementById('time')?.value ?? '';
    const notes = document.getElementById('notes')?.value.trim() ?? '';

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
      const whatsappUrl = isMobile ? `whatsapp://send?phone=${phoneInternational}&text=${text}` : `https://api.whatsapp.com/send?phone=${phoneInternational}&text=${text}`;
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