<template>
  <div class="d-flex flex-grow-1 flex-column">
    <v-row class="flex-grow-0" dense style="padding-top: 10px">
      <v-btn-toggle
        v-model="topShow"
        mandatory>
        <v-btn
          color="primary"
          text
          :value="true"
        >
          열기
        </v-btn>
        <v-btn
          color="lighten-2"
          text
          :value="false"
        >
          닫기
        </v-btn>
      </v-btn-toggle>
      <!--      <v-btn-->
      <!--        color="orange lighten-2"-->
      <!--        @click="geo"-->
      <!--      >-->
      <!--        geo-->
      <!--      </v-btn>-->

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="topShow = !topShow"
      >
        <v-icon>{{ topShow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-row>

    <v-expand-transition>
      <v-row class="flex-grow-0" dense v-show="topShow">
        <v-col cols="12" md="6" xl="6">
          <notice-card
            label="공지사항"
            class="h-full"
            color="#8c9eff"
            :value="32"
            :percentage="-8.3"
            :percentage-label="$t('dashboard.lastweek')"
          ></notice-card>
        </v-col>

        <v-col cols="12" md="6" xl="6">
        </v-col>
      </v-row>
    </v-expand-transition>


<!--    <v-list-item>-->
<!--      <v-list-item-icon v-if="!productId">-->
<!--        <v-btn color="primary" dark @click="onCaptureProduct = !onCaptureProduct">-->
<!--          킥보드 스캔-->
<!--          <v-icon dark right>mdi-qrcode-scan</v-icon>-->
<!--        </v-btn>-->
<!--      </v-list-item-icon>-->
<!--      <v-list-item-icon v-if="productId">-->
<!--        <v-btn dark @click="productId = null; partsId = null;">-->
<!--          초기화-->
<!--          <v-icon dark right>mdi-replay</v-icon>-->
<!--        </v-btn>-->
<!--      </v-list-item-icon>-->

<!--    </v-list-item>-->


<!--    <v-dialog-->
<!--      v-model="onCaptureProduct"-->
<!--      persistent-->
<!--      max-width="100%"-->
<!--      @click:outside="onCaptureProduct = false" @keydown.esc="onCaptureProduct = false"-->
<!--    >-->
<!--      <v-card>-->
<!--        <qrcode-stream key="qrProduct" @decode="onScanQrCode" :track="paintBoundingBox" @init="onInit" v-if="onCaptureProduct"/>-->
<!--      </v-card>-->
<!--    </v-dialog>-->

  </div>

</template>

<script>
// DEMO Cards for dashboard
import NoticeCard from '../../components/dashboard/NoticeCard'
import _ from "lodash";

import UtilApi from "@/api/UtilApi";

// import { QrcodeStream } from 'vue-qrcode-reader'
import axios from "axios";
// import { WebCam } from "vue-web-cam";

export default {
  components: {
    NoticeCard,
    // QrcodeStream,
    // WebCam
  },
  data() {
    return {
      loadingInterval: null,

      isLoading1: true,
      isLoading2: true,
      isLoading3: true,
      isLoading4: true,

      report: [
        // {
        //   lat: 37.3409214,
        //   lng: 127.9187
        // }
      ],
      mapKey: process.env.VUE_APP_NAVER_APP_KEY,
      map:null,
      mapOptions: {
        lat: 37.3409214,
        lng: 127.9187,
        zoom: 11,
        zoomControl: true,
        zoomControlOptions: {position: 'TOP_RIGHT'},
        mapTypeControl: true,
      },
      marker: null,
      editable: false,
      topShow: true,

      // onCaptureProduct: false,
      // onCaptureParts: false,
      // onCaptureRent: false,
      // partsId: null,
      // productId: null,
      // camera: 'auto',

      timer: null
    }
  },
  computed: {
    theme() {
      return this.$vuetify.theme.isDark
        ? this.$vuetify.theme.defaults.dark
        : this.$vuetify.theme.defaults.light
    }
  },
  mounted() {
    let count = 0

    // DEMO delay for loading graphics
    this.loadingInterval = setInterval(() => {
      this[`isLoading${count++}`] = false
      if (count === 4) this.clear()
    }, 400)

  },
  beforeDestroy() {
    this.clear()
  },
  methods: {
    clear() {
      clearInterval(this.loadingInterval)
    },
    onLoad(vue) {
      this.map = vue;
      this.map.refresh()
    },
    onWindowLoad(that) {
    },
    onMarkerClicked(id) {
      this.$router.push({path:`/report/detail/${id}`})
    },
    onMarkerLoaded(vue) {
      this.marker = vue.marker;
    },


    // async paintBoundingBox (detectedCodes, ctx) {
    //   for (const detectedCode of detectedCodes) {
    //     const { boundingBox: { x, y, width, height } } = detectedCode
    //
    //     ctx.lineWidth = 8
    //     ctx.strokeStyle = '#007bff'
    //     ctx.strokeRect(x, y, width, height)
    //   }
    // },
    // async onScanQrCode (result) {
    //   console.log(result)
    //
    //   if(!companyCode) {
    //     alert("비정상적으로 스캔되었습니다. 다시 시도해주세요.")
    //     this.productId = null
    //     this.onCaptureProduct = false
    //     return
    //   }
    //
    //   const kid = result.split("=").reverse()[0];
    //
    //   UtilApi.flowerLocation(companyCode, kid).then(result => {
    //     console.log(result)
    //   })
    //
    //   if(!this.productId) {
    //     console.log(result)
    //     this.onCaptureProduct = false
    //   }
    // },
    // async onInit (promise) {
    //   try {
    //     await promise
    //   } catch (error) {
    //     if (error.name === 'NotAllowedError') {
    //       alert("ERROR: you need to grant camera access permisson")
    //     } else if (error.name === 'NotFoundError') {
    //       alert("ERROR: no camera on this device")
    //     } else if (error.name === 'NotSupportedError') {
    //       alert("ERROR: secure context required (HTTPS, localhost)")
    //     } else if (error.name === 'NotReadableError') {
    //       alert("ERROR: is the camera already in use?")
    //     } else if (error.name === 'OverconstrainedError') {
    //       alert("ERROR: installed cameras are not suitable")
    //     } else if (error.name === 'StreamApiNotSupportedError') {
    //       alert("ERROR: Stream API is not supported in this browser")
    //     }
    //   }
    // },
    // unpause () {
    //   this.camera = 'auto'
    // },
    // pause () {
    //   this.camera = 'off'
    // },
    timeout (ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    },
  },
  beforeUnmount(){
    clearInterval(this.timer);
  },
  created() {

  }
}
</script>
<style>
.marker-html {
  width: 30px;
  height: 30px;
  position: relative;
  background: white;
  line-height: 30px;
  text-align: center;
  font-weight: bold;
  border-radius: 15px;
  border: 1px solid black;
  transition: 0.5s;

&:hover {
   background-color: black;
   color: white;
   border-color: red;
 }
}

</style>
