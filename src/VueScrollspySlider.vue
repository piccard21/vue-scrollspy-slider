<template>
  <div @mouseover="initSlider"> 
    <div class="container"> 
      <vue-slider @callback="scrollTo" v-model="sliderOptions.value" v-bind="sliderOptions" ref="slider">  
        <div slot="tooltip"> 
             <slot name="slider-text" v-bind="sliderOptions"></slot>
        </div>
      </vue-slider>
    </div>
  </div>
</template>

<script> 

import Vue from 'vue'
import vueSlider from 'vue-slider-component' 
import VueScrollTo from 'vue-scrollto' 
import _ from 'lodash'
 
Vue.use(VueScrollTo) 


export default {
  components: {
    vueSlider
  },
  name: 'vue-scrollspy-slider', 
  props: {
    sliderOptions: {
      type: Object,
      default: function () {
        return {
          sliderOptions: {
            min: 1,
            max: this.ankers.length,
            value: 1,
            interval: 1,  
            tooltip:"always", 
            height:"320px", 
            width: 4,        
            reverse: true,
            direction:"vertical",
            tooltipDir: "right"
          }
        }
      }
    },
    scrollOptions: {
      type: Object,
      default: function () {
        return {
            container: "#wrapper", 
            cancelable: false,
            offset: 0,
            x: false,
            y: true,
            duration: 100
        }
      }
    },
    margin: {
      type: Number,
      default: -15
    },
    debounce: {
      type: Number,
      default: 100
    } ,
    ankers: {
      type: Array,
      default: function() {
        return[]
      }
    }
  },
  methods: {
    prev() { 
        this.setVal(--this.sliderOptions.value);  
        this.scrollTo();
    },
    next() { 
        this.setVal(++this.sliderOptions.value);  
        this.scrollTo();
    },
    initSlider() { 
        this.$refs.slider.refresh()
    },
    getElement(val) {
      // element
      if( _.isElement(val)) {
          return val;
      } 
      // id
      else if (/^#/.test(val)) {
        let id = val.replace(/^#/, '');
        return document.getElementById(id);
      }
      // class
      else if (/^\./.test(val)) { 
        let cl = val.replace(/^\./, '');
        let els = document.getElementsByClassName(cl);
        return els[0];
      }
      // tag
      else {
        let els = document.getElementsByTagName(val);
        return els[0]
      } 
    },
    getContainer() {
      return this.getElement(this.scrollOptions.container);
    },
    setVal(val) { 
      this.sliderOptions.value = val; 
    },
    scrollBack() { 
      let val = (this.sliderOptions.value > this.sliderOptions.min) ? --this.sliderOptions.value : this.sliderOptions.value;
      this.setVal(val);  
      this.scrollTo();  
    },
    scrollForward() {
      let val = (this.sliderOptions.value < this.sliderOptions.max)  ? ++this.sliderOptions.value : this.sliderOptions.value;
      this.setVal(val);  
      this.scrollTo();  
    },
    scrollTo() {  
      VueScrollTo.scrollTo(this.ankers[this.sliderOptions.value-1], this.scrollOptions.duration, this.scrollOptions) 
    },
  },
  data() {  
    return {}
  },
  created() { 
    this.setVal = _.debounce(this.setVal, this.debounce) 
    this.scrollTo= _.debounce(this.scrollTo, this.debounce) 
    this.initSlider = _.debounce(this.initSlider, this.debounce) 
  },
  mounted() {     
    let el = this.getContainer();

    el.addEventListener("scroll", () => { 
      let cRect = el.getBoundingClientRect();  
      let containerOffsetTop = cRect.top + document.body.scrollTop;
      let containerOffsetHeight = el.offsetHeight;
      let first = -1; 

      for (let [i, anker] of this.ankers.entries()) {
          let el = this.getElement(anker) 
          let rect = el.getBoundingClientRect(); 
          let offsetTop = rect.top + document.body.scrollTop; 

          if(offsetTop < (containerOffsetTop+containerOffsetHeight) && offsetTop >= (containerOffsetTop+this.margin) && offsetTop > this.margin) {   
            first =  i;
            break;
          } 
      }

      if(first == -1) return;
      this.setVal(++first);

    }); 
  }
}
</script>
