document.addEventListener('DOMContentLoaded', function () {
  const agendarBtn = document.getElementById('btnAgendar');
  const contactBtn = document.getElementById('contact-btn');
  const agendamentoSection = document.getElementById('agendamentoSection');
  const bookingForm = document.getElementById('booking-form');

  // segurança: se elemento não existir, não tentar usar
  if (agendarBtn) {
    agendarBtn.addEventListener('click', () => {
      criarPurpurina();
      // rolar suavemente para a seção de agendamento após pequena espera
      setTimeout(() => {
        if (agendamentoSection) agendamentoSection.scrollIntoView({ behavior: 'smooth' });
      }, 700);
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // FORM -> WhatsApp
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = (document.getElementById('client-name') || {}).value || '';
      const phone = (document.getElementById('client-phone') || {}).value || '';
      const service = (document.getElementById('service-select') || {}).value || '';
      const date = (document.getElementById('date') || {}).value || '';
      const time = (document.getElementById('time') || {}).value || '';
      const notes = (document.getElementById('notes') || {}).value || '';

      if (!/^[0-9]{9}$/.test(phone)) {
        alert('Insira um telefone válido de 9 dígitos (ex: 936745953).');
        return;
      }
      if (!date || !time) {
        alert('Escolha data e hora.');
        return;
      }

      const whatsappNumber = '351936745953';
      const message = `Agendamento - Victoria Mazzali\nNome: ${name}\nTelefone: ${phone}\nServiço: ${service}\nData: ${date}\nHora: ${time}\nObservações: ${notes}`;
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  }

  // FUNÇÃO: cria purpurina (peças DOM animadas e removidas)
  function criarPurpurina() {
    const colors = ['#f6e7d7', '#eadff2', '#fbeae6', '#d4af37'];
    const total = 48;
    for (let i = 0; i < total; i++) {
      const el = document.createElement('div');
      el.className = 'glitter';
      // estilo inline para evitar falta de CSS
      const size = 6 + Math.round(Math.random() * 10);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.position = 'fixed';
      el.style.left = `${Math.random() * window.innerWidth}px`;
      el.style.top = `${Math.random() * (window.innerHeight * 0.6)}px`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = '50%';
      el.style.pointerEvents = 'none';
      el.style.opacity = '0.95';
      el.style.zIndex = 9999;
      // animação via JS: movimento + fade
      const dx = (Math.random() - 0.5) * 400;
      const dy = -100 - Math.random() * 300;
      const rot = (Math.random() - 0.5) * 720;
      el.style.transition = 'transform 900ms cubic-bezier(.22,.9,.3,1), opacity 900ms ease-out';
      document.body.appendChild(el);

      // força layout e aplica transform
      requestAnimationFrame(() => {
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${0.9 + Math.random()})`;
        el.style.opacity = '0';
      });

      // remover após animação
      setTimeout(() => {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }, 1100);
    }
  }
});