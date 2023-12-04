<style lang="scss" scoped>
.menu {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow-y: hidden;

  &__form {
    width: 50%;
    height: 100%;
    max-width: 250px;
    padding: 20px;
    box-shadow: 5px 0 5px #222;
    left: 0;

    &-heading {
      margin-bottom: 20px;
      font-size: 21px;
      font-weight: 900;
    }
    
    &-submit {
      margin-top: 10px;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
      width: 100%;
      padding: 10px 15px;
      background-color: #06A77D;
    }

    &-input {
      height: 45px;
      color: #222;
      letter-spacing: 2px;
      caret-color: #000;
      background: #fff;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
      padding: 5px 10px;
      z-index: 5;
      margin-bottom: 15px;
    }
  }

  &__chart {
    max-height: 1000px;
  }
}
</style>

<template>
  <div class="menu flex">
    <form class="flex flex-col menu__form" @submit.prevent="fetchData">
      <h1 class="menu__form-heading">Выберите период:</h1>
      <label for="selectedDate">Date: </label>
      <input class="menu__form-input" type="date" v-model="selectedDate">

      <label for="startTime">Start Time: </label>
      <input class="menu__form-input" type="time" v-model="startTime">

      <label for="endTime">End Time: </label>
      <input class="menu__form-input" type="time" v-model="endTime">

      <button class="menu__form-submit" type="submit">Display</button>
    </form>

    <canvas class="menu__chart" ref="chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      selectedDate: new Date(Date.now()).toISOString().split('T')[0],
      startTime: this.formatTime(new Date('2023-12-04T15:02:00')),
      endTime: this.formatTime(new Date('2023-12-04T16:00:00')),
      chartData: {},
      chartInstance: null,
    };
  },
  render() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const json = await useFetch(`/api/data`, {
          method: 'GET',
          params: {
            selectedDate: this.selectedDate,
            startTime: this.startTime,
            endTime: this.endTime,
          }
        });

        this.chartData = json.data;
        this.chartData = {
          ...this.chartData,
          labels: this.chartData.labels.map(this.formatTimeUTC),
        }

        this.renderChart();
      } catch (error) {
        console.error(error);
      }
    },
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const context = this.$refs.chart.getContext('2d');
      this.chartInstance = new Chart(context, {
        type: 'line',
        data: this.chartData,
      })
    },
    formatTime(date) {
      const hours = this.padNumber(date.getHours());
      const minutes = this.padNumber(date.getMinutes());
      return `${hours}:${minutes}`;
    },
    formatTimeUTC(date) {
      const utcDate = new Date(date + ' GMT');
      const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
      return localDate.toISOString().split('T')[1].split('.')[0];
    },
    padNumber(number) {
      return number.toString().padStart(2, '0');
    },
  }
}
</script>