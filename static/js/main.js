/* Smart F2C Connect – Main JS */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile nav toggle ──────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  /* ── Sidebar toggle (dashboard) ────────────────────────── */
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar       = document.getElementById('sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target))
        sidebar.classList.remove('open');
    });
  }

  /* ── Auto-dismiss alerts ────────────────────────────────── */
  document.querySelectorAll('.alert[data-auto-dismiss]').forEach(el => {
    setTimeout(() => el.style.cssText = 'opacity:0;transition:.4s;pointer-events:none', 4000);
    setTimeout(() => el.remove(), 4400);
  });

  /* ── OTP Input auto-advance ─────────────────────────────── */
  const otpInputs = document.querySelectorAll('.otp-inputs input');
  otpInputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      if (inp.value.length === 1 && otpInputs[i+1]) otpInputs[i+1].focus();
      syncOtpHidden();
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value && otpInputs[i-1]) otpInputs[i-1].focus();
    });
    inp.addEventListener('paste', e => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,'');
      [...text].slice(0,6).forEach((ch,j) => { if(otpInputs[j]) otpInputs[j].value=ch; });
      if (otpInputs[Math.min(text.length, 5)]) otpInputs[Math.min(text.length, 5)].focus();
      syncOtpHidden();
    });
  });
  function syncOtpHidden() {
    const hidden = document.getElementById('otpHidden');
    if (hidden) hidden.value = [...otpInputs].map(i=>i.value).join('');
  }

  /* ── Role tab switcher (login/register) ─────────────────── */
  document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('roleInput').value = tab.dataset.role;
      // toggle extra fields
      document.querySelectorAll('[data-role-field]').forEach(f => {
        f.closest('.form-group').style.display =
          (f.dataset.roleField === tab.dataset.role || f.dataset.roleField === 'all') ? '' : 'none';
      });
    });
  });

  /* ── Cart quantity updater ──────────────────────────────── */
  document.querySelectorAll('.qty-inc,.qty-dec').forEach(btn => {
    btn.addEventListener('click', function() {
      const wrap   = this.closest('.qty-control-wrap');
      const input  = wrap.querySelector('input[type=number], .qty-display');
      const isInc  = this.classList.contains('qty-inc');
      let val      = parseInt(input.value || input.textContent) || 1;
      const max    = parseInt(input.dataset.max || 9999);
      val = isInc ? Math.min(val+1, max) : Math.max(val-1, 1);
      if (input.tagName === 'INPUT') input.value = val;
      else input.textContent = val;
      const qtyInput = wrap.querySelector('input[name=quantity]');
      if (qtyInput) qtyInput.value = val;
    });
  });

  /* ── Product image preview ──────────────────────────────── */
  const imgInput   = document.getElementById('productImage');
  const imgPreview = document.getElementById('imgPreview');
  if (imgInput && imgPreview) {
    imgInput.addEventListener('change', () => {
      const file = imgInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => { imgPreview.src = e.target.result; imgPreview.style.display = ''; };
        reader.readAsDataURL(file);
      }
    });
  }

  /* ── Confirm delete prompts ─────────────────────────────── */
  document.querySelectorAll('[data-confirm]').forEach(el => {
    el.addEventListener('click', e => {
      if (!confirm(el.dataset.confirm || 'Are you sure?')) e.preventDefault();
    });
  });

  /* ── Update cart count badge ─────────────────────────────── */
  const cartBadge = document.getElementById('cartBadge');
  if (cartBadge) {
    fetch('/api/cart/count')
      .then(r => r.json())
      .then(d => { if (d.count > 0) { cartBadge.textContent = d.count; cartBadge.style.display = ''; } });
  }

  /* ── Highlight active sidebar link ──────────────────────── */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    if (a.getAttribute('href') === currentPath) a.classList.add('active');
  });

  /* ── Search debounce ─────────────────────────────────────── */
  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => searchInput.closest('form').submit(), 600);
    });
  }

  /* ── Admin: order status color update ───────────────────── */
  document.querySelectorAll('select[data-status-select]').forEach(sel => {
    sel.addEventListener('change', function() {
      this.className = `form-control form-select status-select status-${this.value}`;
    });
  });

  /* ── Animate on scroll ───────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }

  /* ── Toast utility ───────────────────────────────────────── */
  window.showToast = (msg, type='success') => {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span>${msg}</span>`;
    Object.assign(t.style, { position:'fixed', bottom:'1.5rem', right:'1.5rem', background: type==='success'?'#065f46':'#7f1d1d', color:'#fff', padding:'.75rem 1.25rem', borderRadius:'10px', fontSize:'.9rem', zIndex:9999, boxShadow:'0 8px 24px rgba(0,0,0,.18)', animation:'fadeInUp .3s ease' });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  };

});
