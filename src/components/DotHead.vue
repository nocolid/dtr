<template>
  <div class="dothead-wrapper">
    <svg
      viewBox="0 0 120 235"
      xmlns="http://www.w3.org/2000/svg"
      class="dothead-svg"
      aria-hidden="true"
    >
      <!-- Outer sway wrapper -->
      <g class="anim-sway">
        <!-- Inner bob wrapper -->
        <g class="anim-bob">

          <!-- Head: wide horizontal oval -->
          <ellipse cx="60" cy="30" rx="40" ry="26" fill="white" stroke="black" stroke-width="3"/>

          <!-- Eyes -->
          <circle class="eye-left"  cx="47" cy="28" r="4.5" fill="black"/>
          <circle class="eye-right" cx="73" cy="28" r="4.5" fill="black"/>

          <!-- Body -->
          <rect x="30" y="54" width="60" height="88" rx="20" fill="white" stroke="black" stroke-width="3"/>

          <!-- Left arm -->
          <rect x="7"  y="60" width="25" height="70" rx="12" fill="white" stroke="black" stroke-width="3"/>

          <!-- Right arm -->
          <rect x="88" y="60" width="25" height="70" rx="12" fill="white" stroke="black" stroke-width="3"/>

          <!-- Left leg -->
          <rect x="30" y="138" width="25" height="75" rx="12" fill="white" stroke="black" stroke-width="3"/>

          <!-- Right leg -->
          <rect x="65" y="138" width="25" height="75" rx="12" fill="white" stroke="black" stroke-width="3"/>

        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.dothead-wrapper {
  position: fixed;
  bottom: 30px;
  right: 50px;
  width: 110px;
  opacity: 0.18;
  pointer-events: none;
  z-index: 0;
  user-select: none;
}

.dothead-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

/* Sway: gentle left-right lean */
.anim-sway {
  animation: sway 6s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center bottom;
}

/* Bob: subtle up-down float */
.anim-bob {
  animation: bob 3s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center center;
}

/* Blink: eyes squeeze shut briefly */
.eye-left,
.eye-right {
  animation: blink 5s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center center;
}
.eye-right {
  animation-delay: 0.06s;
}

@keyframes bob {
  0%, 100% { transform: translateY(0px);  }
  50%       { transform: translateY(-9px); }
}

@keyframes sway {
  0%, 100% { transform: rotate(0deg);   }
  25%       { transform: rotate(2.5deg); }
  75%       { transform: rotate(-2.5deg); }
}

@keyframes blink {
  0%, 88%, 100% { transform: scaleY(1);   }
  92%            { transform: scaleY(0.08); }
}
</style>
