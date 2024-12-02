<template>
  <div class="iphone-container">
    <div class="screen">
      <slot></slot>
    </div>
  </div>
</template>
  
<style lang="scss">
.iphone-container {
  width: 325px; /* iPhone width */
  height: 93vh; /* iPhone height */
  border-radius: 30px; /* Rounded corners */
  border: 10px solid #000; /* Black border for iPhone frame */
  background-color: #fff; /* White background inside */
  overflow: hidden; /* Clip overflowing content */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Shadow for 3D effect */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: black;

  .screen {
    width: 100%;
    height: 100%;
    background-color: white; /* Default screen background */
    padding: 30px;
  }
}
</style>
