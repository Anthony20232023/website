// Minimal lightbox behavior (moved from index.html)
(function(){
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return; // safe-guard if markup not present
  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('.caption');
  const lbClose = document.getElementById('lbClose');

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.card.portfolio');
    if (!card) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const src = card.dataset.img || card.querySelector('img').src;
    const title = card.querySelector('h3')?.innerText || '';
    lbImg.src = src;
    lbImg.alt = title;
    lbCaption.textContent = title;
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
    lbClose?.focus();
  });

  function closeLB(){
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
  }

  lbClose?.addEventListener('click', closeLB);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLB(); });
})();

/* Protected link / authentication modal (client-side demo) */
(function(){
  const links = document.querySelectorAll('.protected');
  if (!links.length) return;

  // create modal markup
  const modalHTML = `
  <div id="authModal" class="auth-modal" aria-hidden="true">
    <div class="panel" role="dialog" aria-labelledby="authTitle">
      <h4 id="authTitle">Authentication required</h4>
      <form id="authForm">
        <label for="authName">Name</label>
        <input id="authName" name="name" type="text" autocomplete="username" required>
        <label for="authPass">Password</label>
        <input id="authPass" name="password" type="password" autocomplete="current-password" required>
        <div class="msg" id="authMsg"></div>
        <div class="actions">
          <button type="button" class="btn-cancel">Cancel</button>
          <button type="submit" class="btn-submit">Continue</button>
        </div>
      </form>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const authModal = document.getElementById('authModal');
  const authForm = document.getElementById('authForm');
  const authName = document.getElementById('authName');
  const authPass = document.getElementById('authPass');
  const authMsg = document.getElementById('authMsg');
  const btnCancel = authModal.querySelector('.btn-cancel');

  let pendingLink = null;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // allow modifier clicks
      e.preventDefault();
      pendingLink = link;
      authMsg.textContent = '';
      authModal.classList.add('show');
      authModal.setAttribute('aria-hidden', 'false');
      setTimeout(() => authName.focus(), 50);
    });
  });

  function closeModal(){
    authModal.classList.remove('show');
    authModal.setAttribute('aria-hidden', 'true');
    authForm.reset();
    pendingLink = null;
  }

  btnCancel.addEventListener('click', closeModal);
  authModal.addEventListener('click', (ev) => { if (ev.target === authModal) closeModal(); });

  authForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = authName.value.trim();
    const pass = authPass.value;
    if (!pendingLink) { closeModal(); return; }

    // Credentials check: prefer data attributes on the link, otherwise demo defaults
    const wantUser = pendingLink.dataset.protectedUsername || 'admin';
    const wantPass = pendingLink.dataset.protectedPassword || 'secret';

    if (name === wantUser && pass === wantPass) {
      // authorized -> navigate
      const href = pendingLink.href;
      closeModal();
      window.location.href = href;
    } else {
      authMsg.textContent = 'Invalid name or password.';
      authPass.value = '';
      authPass.focus();
    }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (authModal.classList.contains('show')) closeModal(); } });
})();
