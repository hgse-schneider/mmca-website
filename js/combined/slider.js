// Range slider setup

function createslider(element, lower_state, upper_state) {
    const inputs = element.querySelectorAll('input');
  
    const thumbLeft = element.querySelector('.thumb.left');
    const thumbRight = element.querySelector('.thumb.right');
    const rangeBetween = element.querySelector('.range-between');
    const labelMin = element.querySelector('.range-label-start');
    const labelMax = element.querySelector('.range-label-end');
  
    const [inputStart, inputEnd] = inputs;
  
    setStartValueCustomSlider(inputStart, inputEnd, thumbLeft, rangeBetween);
    setEndValueCustomSlider(inputEnd, inputStart, thumbRight, rangeBetween);
    setEvents(inputStart, inputEnd, thumbLeft, thumbRight, labelMin, labelMax, rangeBetween, lower_state, upper_state);
  }
  
  function setLabelValue(label, input) {
    label.innerHTML = `${input.value}`;
  }
  
  
  function setStartValueCustomSlider(inputStart, inputEnd, pseudoEl, range) {
    const maximum = Math.min(parseInt(inputStart.value), parseInt(inputEnd.value) - 1);
    const percent = ((maximum - inputStart.min) / (inputStart.max - inputStart.min)) * 100;
    pseudoEl.style.left = percent + '%';
    range.style.left = percent + '%';
  }
  
  function setEndValueCustomSlider(inputEnd, inputStart ,pseudoEl, range) {
    const minimun = Math.max(parseInt(inputEnd.value), parseInt(inputStart.value) + 1);
    const percent = ((minimun - inputEnd.min) / (inputEnd.max - inputEnd.min)) * 100;
    pseudoEl.style.right = 100 - percent + '%';
    range.style.right = 100 - percent + '%';   
  }
  
  
  function setEvents(
    inputStart,
    inputEnd,
    thumbLeft,
    thumbRight,
    labelMin,
    labelMax,
    rangeBetween,
    // rangesValues,
    lower_state,
    upper_state
  ) {

    // General function to add something to state from slider
    // inputSide should either be inputStart, inputEnd
    // And state should correspond to filter state that should be updated, e.g. year_lower
    function update_from_slider (inputSide, state) {
        filter_state[state] = parseInt(inputSide.value, 10);
        updateState();
    }

    // Left handle
    inputStart.addEventListener('input', () => {
        setStartValueCustomSlider(inputStart, inputEnd, thumbLeft, rangeBetween);
        setLabelValue(labelMin, inputStart);
        update_from_slider(inputStart, lower_state);
    });
  
    inputEnd.addEventListener('input', () => {
        setEndValueCustomSlider(inputEnd, inputStart, thumbRight, rangeBetween);
        setLabelValue(labelMax, inputEnd);
        console.log("filter state MONDAY")
        console.log(filter_state[upper_state]);
        update_from_slider(inputEnd, upper_state);
    });
  
    // Add css clases on hover and drag
    inputStart.addEventListener('mouseover', function () {
        thumbLeft.classList.add('hover');
    });
    inputStart.addEventListener('mouseout', function () {
        thumbLeft.classList.remove('hover');
    });
    inputStart.addEventListener('mousedown', function () {
        thumbLeft.classList.add('active');
    });
    inputStart.addEventListener('pointerup', function () {
        thumbLeft.classList.remove('active');
    });
  
    inputEnd.addEventListener('mouseover', function () {
        thumbRight.classList.add('hover');
    });
    inputEnd.addEventListener('mouseout', function () {
        thumbRight.classList.remove('hover');
    });
    inputEnd.addEventListener('mousedown', function () {
        thumbRight.classList.add('active');
    });
    inputEnd.addEventListener('pointerup', function () {
        thumbRight.classList.remove('active');
    });
  
    // Mobile
    inputStart.addEventListener('touchstart', function () {
        thumbLeft.classList.add('active');
    });
    inputStart.addEventListener('touchend', function () {
        thumbLeft.classList.remove('active');
    });
    inputEnd.addEventListener('touchstart', function () {
        thumbRight.classList.add('active');
    });
    inputEnd.addEventListener('touchend', function () {
        thumbRight.classList.remove('active');
    });
  }
  
  const year_slider = document.querySelector("#range-slider-year ");
  createslider(year_slider, "year_lower", "year_upper");
  const citation_slider = document.querySelector("#range-slider-citation ");
  createslider(citation_slider, "citation_lower", "citation_upper");