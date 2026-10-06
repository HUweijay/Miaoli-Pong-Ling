(() => {
  // 14 hand-made, multi-angle photographs form the tactile 360-degree record.
  // They are ordered from the nearest front view, around the helmet, then back.
  const frames = [
    'view-14.jpg', 'view-02.jpg', 'view-13.jpg', 'view-03.jpg',
    'view-04.jpg', 'view-11.jpg', 'view-09.jpg', 'view-08.jpg',
    'view-07.jpg', 'view-06.jpg', 'view-05.jpg', 'view-01.jpg',
    'view-12.jpg', 'view-10.jpg'
  ].map(file => `./assets/helmet/${file}`);

  const image = document.querySelector('#helmetImage');
  const windowEl = document.querySelector('#imageWindow');
  const hint = document.querySelector('#turnHint');
  const progress = document.querySelector('#progressFill');
  const readout = document.querySelector('#angleReadout');
  let frame = 0;
  let pointerStart = 0;
  let startingFrame = 0;
  let isDragging = false;
  let hintDismissed = false;
  let imageReady = false;

  frames.forEach(src => { const preload = new Image(); preload.src = src; });

  function wrap(value) {
    return ((value % frames.length) + frames.length) % frames.length;
  }

  function setFrame(next, shouldAnimate = true) {
    const index = wrap(next);
    if (index === frame && imageReady) return;
    frame = index;
    if (shouldAnimate) image.classList.add('frame-change');
    image.src = frames[frame];
    const degrees = Math.round((frame / frames.length) * 360);
    progress.style.width = `${(frame / (frames.length - 1)) * 100}%`;
    readout.textContent = `${String(degrees).padStart(2, '0')}°`;
  }

  image.addEventListener('load', () => {
    imageReady = true;
    requestAnimationFrame(() => image.classList.remove('frame-change'));
  });

  function hideHint() {
    if (!hintDismissed) {
      hintDismissed = true;
      hint.classList.add('is-hidden');
    }
  }

  windowEl.addEventListener('pointerdown', event => {
    isDragging = true;
    pointerStart = event.clientX;
    startingFrame = frame;
    windowEl.setPointerCapture(event.pointerId);
    hideHint();
  });

  windowEl.addEventListener('pointermove', event => {
    if (!isDragging) return;
    // A short horizontal drag advances one view; movement wraps continuously.
    const delta = event.clientX - pointerStart;
    const step = Math.round(delta / 24);
    setFrame(startingFrame - step, false);
  });

  function finishDrag(event) {
    if (!isDragging) return;
    isDragging = false;
    if (windowEl.hasPointerCapture(event.pointerId)) windowEl.releasePointerCapture(event.pointerId);
  }
  windowEl.addEventListener('pointerup', finishDrag);
  windowEl.addEventListener('pointercancel', finishDrag);

  windowEl.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { hideHint(); setFrame(frame - 1); }
    if (event.key === 'ArrowRight') { hideHint(); setFrame(frame + 1); }
  });

  setFrame(0, false);
})();
