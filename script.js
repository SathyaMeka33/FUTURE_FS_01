const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('shadow', window.scrollY > 8);
}, { passive: true });

const pImg = document.querySelector('.person-img');
let raf;
document.addEventListener('mousemove', e => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const dx = e.clientX / window.innerWidth - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    if (pImg) pImg.style.transform =
      `translate(${dx * 6}px, ${dy * 3}px)`;
  });
});
