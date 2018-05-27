<template>
  <div> 

        <div class="container"> 
          <vue-slider @callback="scrollTo"  v-model="sliderOptions.value" v-bind="sliderOptions">   

            <div class="diy-tooltip" slot="tooltip" slot-scope="{ value }"> 
                 <slot name="tooly" :value="value"></slot>
            </div>

          </vue-slider>
        </div>
 
  </div>
</template>

<script> 

import Vue from 'vue'
import vueSlider from 'vue-slider-component' 
import VueScrollTo from 'vue-scrollto'
import VueLodash from 'vue-lodash'

const options = { name: '_' }  
  
Vue.use(VueScrollTo)
Vue.use(VueLodash, options) 


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
            max: 1000,
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
            y: true
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
    isElement(val) {
      return Vue._.isElement(val) 
    },
    getElement(val) {
      // element
      if(this.isElement(val)) {
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
      return this.scrollOptions.container;
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
      VueScrollTo.scrollTo(this.ankers[this.sliderOptions.value-1], 100, this.scrollOptions) 
      // VueScrollTo.scrollTo(document.getElementById('item-'+this.sliderOptions.value), 100, this.scrollOptions) 
      // this.$scrollTo(document.getElementById('item-'+this.sliderOptions.value), 100, this.scrollOptions) 
    },
  },
  data() {  
    return {}
  },
  created() { 
    // this.setVal = this._.debounce(this.setVal, 100) 
    // this.scrollTo= this._.debounce(this.scrollTo, 100) 
    this.setVal = Vue._.debounce(this.setVal, this.debounce) 
    this.scrollTo= Vue._.debounce(this.scrollTo, this.debounce) 
  },
  mounted() {     
    let el = this.getContainer();
    $(el).scroll(() => {
      let wrapperOffset = $(el).offset();
      let windowHeight = $(el).height();    

      let first = 1;
      let margin = this.margin; 
      let self = this;

      $(".item").each( function() {
        let offset = $(this).offset(); 
        let height = $(this).height();  

        if(offset.top < (wrapperOffset.top+windowHeight) && offset.top >= (wrapperOffset.top+margin) && offset.top > margin) {   
          // first = $(this).attr("itemid")
          // firstEl = this.getElement("#"+$(this).attr(this.ankerAttr));
          first = Vue._.findIndex(self.ankers, (anker) => {
            return self.getElement(anker) == this;
          });
          return false
        }
      });
      if(first == -1) return;
      this.setVal(++first);

    }); 
  }
}
</script>
<style> 
.popover-wrapper {
  background-color: red;
  min-width: 15rem;
  border: none
}
.popover{
  background-color: white;
  display: inline-block;
  border: 1px solid lightgrey;
  padding: 1rem;
}

.first {
  background-color: red;
}

#app {
  margin: 50px;
}
 

</style>
