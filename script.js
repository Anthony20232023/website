// Parallax engine (lightweight). Looks for elements with .parallax and data-speed attribute
// Translates background position or element translateY for smoother mobile behavior.

// Throttle helper
function throttle(fn, limit){ let busy=false; return function(...args){ if(busy) return; busy=true; requestAnimationFrame(()=>{fn.apply(this,args); busy=false;}); } }

const parallaxEls = Array.from(document.querySelectorAll('.parallax'));

function updateParallax(){
  const scrolled = window.scrollY;
  const vh = window.innerHeight;
  parallaxEls.forEach(el=>{
    // speed: smaller = slower movement (like background), larger = faster
    const speedAttr = parseFloat(el.getAttribute('data-speed')) || 0.2;
    // compute offset relative to viewport center to avoid jumpy behavior
    const rect = el.getBoundingClientRect();
    const offsetFromCenter = (rect.top + rect.height/2) - (vh/2);
    const translateY = - offsetFromCenter * speedAttr;
    // For elements with background-image, adjust background-position for smoother effect
    const hasBg = window.getComputedStyle(el).backgroundImage !== 'none';
    if(hasBg){
      // Use background-position Y shift (works well on desktops)
      el.style.backgroundPosition = center ${50 + translateY / 30}%;
    } else {
      // Use transform for internal elements
      el.style.transform = translateY(${translateY}px);
    }
  });
}

window.addEventListener('scroll', throttle(updateParallax, 16));
window.addEventListener('resize', throttle(updateParallax, 50));
document.addEventListener('DOMContentLoaded', updateParallax);