<template>
  <div class="vertical-step-progress">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="step"
      :class="{ active: currentStep === index + 1, completed: step.isCompleted, pending: step.isPending, danger: step.isDanger }"
    >
      <!-- Step Circle with Tick Animation -->
      <div class="step-indicator">
        <div class="step-circle">
          <span v-if="currentStep > index + 1" class="tick">✔</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="step-line" v-if="index < steps.length - 1"></div>
      </div>

      <!-- Step Content -->
      <div
          class="step-content"
        >
          <h4>{{ step.title }}</h4>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    currentStep: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      // currentStep: 1,
      // steps: [
      //   { title: "Step 1", description: "Description for step 1" },
      //   { title: "Step 2", description: "Description for step 2" },
      //   { title: "Step 3", description: "Description for step 3" },
      //   { title: "Step 4", description: "Description for step 4" },
      // ],
    };
  },
  watch: {
    steps: {
      handler() {
        console.log(this.steps)
      }
    }
  },
  mounted() {
    // this.autoProgress();
  },
  methods: {
    // autoProgress() {
    //   const interval = setInterval(() => {
    //     if (this.currentStep < this.steps.length) {
    //       this.currentStep++;
    //     } else {
    //       clearInterval(interval); // Stop at the last step
    //     }
    //   }, 1000); // 1-second interval
    // },
  },
};
</script>
<style scoped>
/* Base Progress Styles */
.vertical-step-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
  opacity: 1;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ccc;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  position: relative;
  transition: background-color 0.5s ease-in-out, transform 0.5s;
}

.step-circle span {
  position: absolute;
}

.step-circle .tick {
  font-size: 16px;
  transform: scale(0);
  transition: transform 0.5s ease-in-out;
}

.step.completed .step-circle {
  background-color: #4caf50;
}

.step.completed .tick {
  transform: scale(1); /* Show tick mark */
}

.step.pending .step-circle {
  background-color: #F7C500;
}

.step.danger .step-circle {
  background-color: red;
}

.step-line {
  width: 2px;
  height: 50px;
  background-color: #ccc;
  margin-top: 5px;
  transition: background-color 0.5s ease-in-out;
}

.step.completed .step-line {
  background-color: #4caf50;
}

.step-content {
  max-width: 300px;
  margin-top: 5px;
  margin-left: -10px;
  transform: translateY(10px);
}

.step-content h4 {
  font-size: 14px;
  text-align: start;
  font-weight: bold;
}

.step.active .step-content,
.step.completed .step.pending .step-content {
  opacity: 1;
}

.step.pending h4 {
  color: #F7C500;
}

.step.danger h4 {
  color: red;
}

.step.active .step-content,
.step.completed .step-content h4 {
  color: #4caf50;
}

h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

/* Fade Animation for Step Content */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
