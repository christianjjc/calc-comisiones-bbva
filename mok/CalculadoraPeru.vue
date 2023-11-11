<template>
  <div class="calculadoraPe">
    <el-row
      :class="[
        data.inverted ? 'inverted' : '',
        data.titulo || data.subtitulo ? '' : 'no-data',
      ]"
      class="info_wrap"
      type="flex"
      justify="center"
    >
      <el-col :md="22" :sm="23" :xs="23">
        <h1
          class=""
          v-if="data.titulo"
          :inner-html.prop="data.titulo | tieneValor"
        ></h1>
        <h5
          class=""
          v-if="data.subtitulo"
          :inner-html.prop="data.subtitulo | tieneValor"
        ></h5>
        <p class="bienvenida animate__delay-0_5s" v-if="data.descripcion">
          {{ data.descripcion }}
          <el-image
            alt=""
            v-if="data.imgDescription"
            :src="require('@/assets/' + data.imgDescription)"
          ></el-image>
        </p>
        <div class="calc_wrap">
          <div class="calc_content calDistribucion">
            <el-col :md="8">
              <el-image
                alt=""
                data-aos="fade-zoom-in"
                data-aos-easing="ease-in-back"
                data-aos-delay="5"
                data-aos-offset="0"
                class="ico_calc"
                :src="require('@/assets/images/iconos/ico-calc.webp')"
              ></el-image>
              <h3
                class=""
                :inner-html.prop="datos_front.secciones.calcula | tieneValor"
              ></h3>
            </el-col>

            <el-col :md="12">


              <div class="seleccion animate__delay-2s" >
                <select
                  name=""
                  id=""
                  v-model="seleccionadoTipoPasarela"
                  @change="calcular(); seleccionadoBanco='0'; limpiarMontos();"
                >
                  <option
                    value=""
                  >¿Qué producto necesitas?</option>

                  <option
                    value="pasarela_pago"
                    
                  >Pasarela de Pago</option>
                  <option
                    value="link_pago"
                    
                  >Link de Pago</option>
                  <option
                    value="smart_pos"
                    
                  >Openpay Smart</option>
                  <option
                    value="openpay_mini"
                    
                  >Openpay Mini</option>
                </select>
              </div>


              <div class="seleccion animate__delay-2s" v-if="seleccionadoTipoPasarela">
                <select
                  name=""
                  id=""
                  v-model="seleccionadoBanco"
                  @change="calcular(); seleccionadoTipoPago=''; limpiarMontos();"
                >
                  <option
                    value="0"
                  >¿Eres cliente?</option>

                  <option
                    value="1"
                  >BBVA</option>
                  <option
                    value="2"
                    v-if="seleccionadoTipoPasarela == 'pasarela_pago' || seleccionadoTipoPasarela == 'link_pago'"
                  >Otros Bancos</option>
                </select>
              </div>
 
              <div class="seleccion animate__delay-2s" v-if="seleccionadoBanco != '0'">
                <select
                  name=""
                  id=""
                  v-model="seleccionadoTipoPago"
                  @change="calcular(); limpiarMontos();"
                >
                  <option
                    value=""
                  >Método de pago</option>

                  <option
                    value="tarjetas_credito"
                  >Tarjetas de Crédito y Débito Locales</option>
                  <option
                    value="tarjetas_foraneas"
                  >Tarjetas del Extranjero</option>
                  <option
                    value="pagos_alternativos"
                    v-if="seleccionadoTipoPasarela == 'pasarela_pago' || seleccionadoTipoPasarela == 'link_pago'"
                  >Pagos con Efectivo</option>
                </select>
              </div>

              <div class="cobrar animate__delay-2s" v-if="seleccionadoTipoPago">
                <input
                  
                  v-model="montoIngresado"
                  @input="calcular"
                  type="number"
                  :disabled="validarCampos()"
                  name=""
                  min="0"
                  max="1000000000"
                  pattern="^[0-9]+"
                  :placeholder="datos_front.secciones.monto_cobrar | tieneValor"
                />
              </div>

              <div class="datos-monto animate__delay-2s">
                <div class="datos-iva" v-if="false">
                  <div class="titulos-monto">
                    <el-image
                      :src="require('@/assets/images/iconos/ico-igual.webp')"
                      alt=""
                    />
                  </div>

                  <div class="monto">
                    <label
                      for=""
                      :inner-html.prop="
                        datos_front.secciones.SUBCOP | tieneValor
                      "
                    ></label
                    ><label for="">S/{{ montos.subCob | formatoMonto }} </label>
                  </div>
                </div>

                <div class="cuenta">
                  <label
                    for=""
                    :inner-html.prop="
                      datos_front.secciones.recibiras | tieneValor
                    "
                  ></label>
                  <label for=""> S/{{ montos.recibiras | formatoMonto }}</label>
                </div>
              </div>
              <a
                :href="datos_front.secciones.urls.url1.url"
                :target="datos_front.secciones.urls.url1.tipo"
              >
                <p
                  class="conocetext comisiones"
                  :inner-html.prop="datos_front.secciones.conoce | tieneValor"
                ></p>
              </a>

              <p
                class="leyenda"
               
              >
              El cálculo de la comisión puede variar por cuestiones de redondeo. <template v-if="seleccionadoTipoPasarela !== 'smart_pos' && seleccionadoTipoPasarela">La comisión está compuesta por la <b>tasa y el 18% de IGV</b>.</template>
              <br>
              Abonamos tu dinero hasta en 24h hábiles si eres cliente BBVA o 48h para otros bancos.
            </p>
            </el-col>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const montosBase = {
  tasa: 0.0,
  comisionOpenpay: 0.0,
  subComision: 0.0,
  subCob: 0.0,
  comisionTotal: 0.0,
  recibiras: 0.0,
}

const tasasYComisiones = {

    pasarela_pago: {
      '1': {
        tarjetas_credito: { tasa: 0, comisionOP: 3.49, igvComision: 18 },
        tarjetas_foraneas: { tasa: 0, comisionOP: 3.99, igvComision: 18 },
        pagos_alternativos: { tasa: 0, comisionOP: 3.40, igvComision: 18 },
      },
      '2': {
        tarjetas_credito: { tasa: 1, comisionOP: 3.79, igvComision: 18 },
        tarjetas_foraneas: { tasa: 1, comisionOP: 4.45, igvComision: 18 },
        pagos_alternativos: { tasa: 0, comisionOP: 3.79, igvComision: 18 },
      },
    },
    link_pago: {
      '1': {
        tarjetas_credito: { tasa: 0, comisionOP: 3.49, igvComision: 18 },
        tarjetas_foraneas: { tasa: 0, comisionOP: 3.99, igvComision: 18 },
        pagos_alternativos: { tasa: 0, comisionOP: 3.40, igvComision: 18 },
      },
      '2': {
        tarjetas_credito: { tasa: 1, comisionOP: 3.79, igvComision: 18 },
        tarjetas_foraneas: { tasa: 1, comisionOP: 4.45, igvComision: 18 },
        pagos_alternativos: { tasa: 0, comisionOP: 3.79, igvComision: 18 },
      },
    },
  
    smart_pos: {
      '1': {
        tarjetas_credito: { tasa: 0, comisionOP: 3.39, igvComision: 0 },
        tarjetas_foraneas: { tasa: 0, comisionOP: 3.99, igvComision: 0 },
      },
    },
    openpay_mini: {
      '1': {
        tarjetas_credito: { tasa: 0, comisionOP: 2.99, igvComision: 18 },
        tarjetas_foraneas: { tasa: 0, comisionOP: 2.99, igvComision: 18 },
      }
    }
  
};

import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'calculadoraPeru',
  props: {
    data: '',
  },
  data() {
    return {
      value: 0,
      active: false,
      tipoTarjetaCredito: '1',
      seleccionadoBanco: '0',
      seleccionadoProducto: '',
      seleccionadoTipoPasarela: '',
      seleccionadoTipoPago: '',
      plazoSeleccionado: '0',

      montoIngresado: '',
      montos: JSON.parse(JSON.stringify(montosBase)),

      tasasYComisiones: JSON.parse(JSON.stringify(tasasYComisiones)),

      comisionOPTxt: 0,
      igvTxt: 0,

      
    }
  },

  computed: {
    ...mapState({
      datos_front: (state) => state.frontend.datos_front.secciones.calculadora,
    }),
  },

  methods: {
    validarCampos() {
      if (this.seleccionadoBanco == '0') {
        return true
      }
      return false
    },

    limpiarTodosCampos(){
      this.seleccionadoTipoPasarela= '';
      this.seleccionadoBanco= '0';
      this.seleccionadoTipoPago= '';
      this.limpiarMontos();
    },

    limpiarMontos(){
      this.montoIngresado= '';
      this.montos = JSON.parse(JSON.stringify(montosBase))
    },

    dosDecimales(e) {
      let stringValue = e.target.value.toString()
      let regex = /^\d*(\.\d{1,2})?$/
      if (!stringValue.match(regex) && this.montoIngresado !== '') {
        this.montoIngresado = this.previousPrice
      }
      if (this.montoIngresado.split('.')[0].length > 10) {
        this.montoIngresado = this.previousPrice
      }
      this.previousPrice = this.montoIngresado
    },
    calcular(e) {
      if (e) {
        this.dosDecimales(e)
      }

      //console.log('montoIngresado', this.montoIngresado);
      //console.log('tipoTarjetaCredito', this.tipoTarjetaCredito);
      if (this.montoIngresado <= 0) {
        this.montos = JSON.parse(JSON.stringify(montosBase))
        return false
      }
      if (true) {

        let tasa = 0;
        let comisionOP = 0;
        let igvComision = 0;
        if ( this.seleccionadoTipoPasarela && this.seleccionadoBanco != '0' && this.seleccionadoTipoPago) {
          const tasaComisiones = this.tasasYComisiones[this.seleccionadoTipoPasarela][this.seleccionadoBanco][this.seleccionadoTipoPago];
          tasa = tasaComisiones.tasa;
          comisionOP = tasaComisiones.comisionOP;
          igvComision = tasaComisiones.igvComision;
        }

        this.comisionOPTxt = comisionOP + '%'
        this.igvTxt = igvComision+'%'

        this.montos.comisionOpenpay = (
          this.montoIngresado *
          (comisionOP / 100)
        ).toFixed(2)

        
        this.montos.subComision = parseFloat(this.montos.comisionOpenpay) + tasa
        //--console.log('SUBTOTAL COMISION:',  this.montos.subComision)

        this.montos.subCob = (this.montos.subComision * (igvComision / 100)).toFixed(2)
        //--console.log("🚀  this.montos.subCob", this.montos.subCob)

        this.montos.comisionTotal = (
          this.montoIngresado -
          this.montos.subComision -
          parseFloat(this.montos.subCob)
        ).toFixed(2)
        //--console.log("comisionTotal", this.montos.comisionTotal)

        this.montos.recibiras = this.montos.comisionTotal
      }
    },
  },
}
</script>

<style scoped>
.calDistribucion {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}

.info_wrap {
  max-width: 100%;
  overflow: hidden;
  position: relative;
}
.info_wrap:before {
  content: '';
  width: 100%;
  display: block;
  left: 0;
  top: 0;
  height: 10%;
  position: absolute;
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
  z-index: 0;
}
.info_wrap:after {
  content: '';
  width: 100%;
  display: block;
  left: 0;
  bottom: 0;
  height: 10%;
  position: absolute;
  background: linear-gradient(0deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
  z-index: 10;
}
.info_wrap > .el-col {
  z-index: 20;
  position: relative;
}
.info_wrap.inverted {
  flex-direction: row-reverse;
}
.info_wrap.no-data {
  /* padding-top: 450px; 2006 */

  padding-top: 150px;
  padding-bottom: 50px;
}
.info_wrap h1 {
  font-weight: 400;
  font-size: 54px;
  line-height: 58px;
  color: var(--azul-bbva);
  text-align: right;
  width: 80%;
  margin-right: 0;
  margin-left: auto;
}
.info_wrap h5 {
  font-weight: normal;
  font-size: 32px;
  line-height: 36px;
  color: var(--azul-bbva);
  text-align: right;
  width: 64%;
  margin-right: 0;
  margin-left: auto;
  margin-bottom: 20px;
}
.info_wrap h5 >>> #iva {
  font-size: 18px;
}
.info_wrap .bienvenida {
  font-weight: 500;
  font-size: 32px;
  line-height: 36px;
  margin-top: 10px;
  margin-bottom: 70px;
  text-align: right;
  color: var(--azul-bbva);
}
.info_wrap .bienvenida >>> .el-image {
  height: 42px;
  object-fit: contain;
  margin-bottom: -5px;
  overflow: visible;
}
.info_wrap .calc_wrap {
  /* background: rgb(255, 255, 255, 0.92);

  border-radius: 24px;
  padding: 64px 64px 16px;
  width: calc(72% - 128px);
  margin-right: -10%;
  margin-left: auto;
  text-align: center; */
  /* background: rgba(20, 200, 190, 0.7); */

  background: rgb(255, 255, 255, 0.92);
  border-radius: 24px;
  /*  padding: 64px 64px 16px;
  width: calc(72% - 128px); 2006 */
  width: 100%;
  /* margin-right: -10%;
  margin-left: auto; 2006 */
  margin-left: 0;
  text-align: center;
}
.info_wrap.inverted .calc_wrap {
  /* margin-left: -10%;
  margin-right: auto; 2006*/
  margin-left: 0;
  margin-right: 0;
}
.info_wrap .calc_wrap .calc_content {
  max-width: 62%;
  margin: auto;
}
.info_wrap .calc_wrap .calc_content .ico_calc {
  width: 189px;
  height: 189px;
}
.info_wrap .calc_wrap .calc_content h3 {
  font-weight: bold;
  font-size: 32px;
  line-height: 32px;
  color: var(--azul-bbva);
  margin-bottom: 67px;
}
.info_wrap .calc_wrap .calc_content .placeholder {
  width: 100%;
  height: auto;
}
.info_wrap .calc_wrap .calc_content .el-button {
  margin-top: 20px;
}
.info_wrap .calc_wrap .calc_content .leyenda {
  font-weight: normal;
  font-size: 13px;
  line-height: 28px;
  color: #666;
  margin-top: 10px;
}
.info_wrap .comisiones {
  font-weight: bold;
  font-size: 32px;
  line-height: 32px;
  text-align: right;
  padding-right: 6%;
  color: var(--turquesa);
}
.info_wrap.no-data .comisiones {
  display: none;
}
.info_wrap .img_bg {
  position: absolute;
  bottom: 15%;
  left: 0;
  width: 100%;
  z-index: -1;
}

select {
  /* background-image: url('@~/assets/images/iconos/icon-down.webp'); */
  background-repeat: no-repeat;
  background-position-x: right;
  background-position-y: center;
  /* appearance: none; 
  padding: 2%;*/
}
input,
select,
label {
  font-size: 16px;
  outline: none;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #666;
  margin: 0%;
}
input,
select,
option {
  cursor: pointer;
}

option:not(:checked) {
  background-color: #fff;
  color: #666666;
  height: 30px;
}
option:checked {
  color: var(--azul-bbva);
  background: #dbedfa;
}

.seleccion {
  width: 100%;
  height: 70px;
  /* background-color: #f8f8f8; */
  background: transparent;
  text-align: left;
  display: grid;
  margin-bottom: 10%;
}

.seleccion label,
.seleccion-plazo label {
  font-size: 12px;
  color: #666;
}
.seleccion select,
.seleccion-plazo select {
  height: 60px;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #666;
}
.seleccion option {
  width: 90%;
}

option {
  font-size: 15px;
  height: 46%;
  cursor: pointer;
  appearance: auto;
}
.seleccion-plazo {
  height: 70px;
  background: transparent;
  text-align: left;
  display: grid;
  margin-bottom: 10%;
}
.cobrar {
  text-align: left;
}
.cobrar input {
  width: 100%;
  height: 50px;
  background-color: transparent;
  text-align: right;
  display: flex;
  margin-bottom: 10%;
  align-items: center;

  font-size: 16px;
  border: none;
  border-bottom: 1px solid #666;
  justify-content: space-between;
}
.cobrar input::placeholder {
  text-align: left;
  display: block;
}
.cobrar label {
  margin: 0%;
  position: relative;
  pointer-events: none;
  left: 10px;
  top: 37px;
  font-size: 20px;
  transition: 0.2s ease all;
}
.cobrar input:focus ~ .label,
input:not(:focus):valid ~ .label {
  top: 10px;
  bottom: 5px;
  left: 20px;
  font-size: 12px;
}
.datos-monto {
  width: 100%;
  color: #666;
  align-items: center;
}
.datos-iva {
  width: 100%;
  background: transparent;
  text-align: left;
  display: flex;
  justify-content: space-between;

  align-items: center;
  border: none;
  margin-top: -1%;
}
.datos-iva .img,
label {
  margin: 2%;
}
.titulos-monto {
  align-items: center;
  align-content: center;
  display: flex;
  margin: 2%;
}
.datos-iva label {
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
}
.monto {
  float: right;
  text-align: right;

  margin: 2%;
  display: flex;
  width: 100%;
  justify-content: space-between;
  /* border-bottom: 1px solid #e9e9e9; */
}
.monto.iva {
  border-bottom: 1px solid #e9e9e9;
}
.cuenta {
  background-color: #e7f9f8;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: normal;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  border-radius: 12px;
}
.cuenta label {
  margin: 2%;
  font-weight: bold;
  text-align: center;
  color: #121212;
}
.tarjetas {
  text-align: left;
  align-items: center;
  margin-bottom: 10%;
}
.tarjetas img {
  width: 12%;
  margin: 2%;
}

.ico-tar {
  display: flex;
  align-items: center;
  width: 60%;
}
.botonesradio {
  margin-bottom: 10%;
  display: flex;
}
.conocetext {
  font-size: 15px !important;
  text-align: center !important;
  color: var(--azul-bbva) !important;
  text-decoration: underline;
}

@media (min-width: 1480px) {
  .info_wrap .img_bg {
    bottom: 5%;
  }
}
@media (min-width: 1720px) {
  .info_wrap .img_bg {
    bottom: -6%;
  }
}

@media (max-width: 1023px) {
  .info_wrap .calc_wrap .calc_content {
    max-width: 87%;
  }
}

@media (min-width: 1024px) {
  .info_wrap .calc_wrap .calc_content {
    max-width: 62%;
  }
}

@media (max-width: 768px) {
  .info_wrap h1 {
    font-size: 52px;
    line-height: 52px;
    width: 100%;
    text-align: center;
  }
  .info_wrap h5 {
    width: 100%;
    text-align: center;
  }
  .info_wrap .bienvenida {
    text-align: center;
  }
  .info_wrap .img_bg {
    width: 140%;
    bottom: 6%;
    left: -10%;
  }
  .info_wrap .calc_wrap {
    /* width: calc(85% - 128px); */
    width: 100%;
  }
  .info_wrap .calc_wrap .calc_content {
    max-width: 90%;
  }
  .info_wrap.inverted .img_bg {
    right: -25%;
    bottom: 28%;
    left: unset;
  }
  .info_wrap .comisiones {
    text-align: center;
    padding-right: 0;
  }
  .info_wrap .calc_wrap .calc_content h3 {
    font-size: 30px;
    line-height: 30px;
  }
  .info_wrap .calc_wrap .calc_content .ico_calc {
    width: 120px;
    height: 120px;
  }
}
@media (max-width: 576px) {
  .calDistribucion {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .info_wrap .img_bg {
    display: none;
  }
  .info_wrap h1 {
    font-size: 25px;
    line-height: 1.1;
    text-align: center;
  }
  .info_wrap h5 {
    font-size: 18px;
    line-height: 1.1;
    text-align: center;
  }
  .info_wrap .calc_wrap .calc_content h3 {
    font-size: 22px;
    line-height: 1;
  }
  .info_wrap .bienvenida {
    text-align: center;
    font-size: 26px;
    line-height: 26px;
  }
  .info_wrap .calc_wrap {
    width: 80%;
    margin-right: auto;
    margin-left: auto;
    padding: 20px 30px;
  }
  .info_wrap .calc_wrap .calc_content {
    max-width: 100%;
    margin: auto;
  }
  .info_wrap.no-data {
    padding-top: 120px;
    padding-bottom: 30px;
  }
  .info_wrap.inverted .calc_wrap {
    margin: auto;
  }
  .info_wrap .calc_wrap .calc_content .ico_calc {
    width: 80px;
    height: 80px;
  }
  input,
  select,
  label {
    font-size: 13px;
  }
  .datos-iva label,
  .cobrar label,
  .cobrar input {
    font-size: 13px;
  }
  .seleccion {
    width: 100%;
    height: 50px;
  }
}
@media (min-width: 1920px) {
  .calculadoraPe {
    max-width: 1920px;
    margin-right: auto;
    margin-left: auto;
  }
  .info_wrap {
    margin-right: auto;
    margin-left: auto;
  }
}

@media (max-height: 576px) and (max-width: 768px) {
  .info_wrap h2 {
    font-size: 36px;
    line-height: 42px;
    width: 100%;
    text-align: center;
  }
  .info_wrap h5 {
    font-weight: normal;
    font-size: 22px;
    line-height: 26px;
  }
  .info_wrap .calc_wrap .calc_content h3 {
    font-size: 20px;
    line-height: 30px;
  }
  .info_wrap .calc_wrap {
    width: calc(70% - 128px);
  }
}

@media (max-height: 575px) and (max-width: 575px) {
  .info_wrap .img_bg {
    display: none;
  }
  .info_wrap h1 {
    font-size: 25px;
    line-height: 1.1;
    text-align: center;
  }
  .info_wrap h5 {
    font-size: 18px;
    line-height: 1.1;
    text-align: center;
  }
  .info_wrap .calc_wrap .calc_content h3 {
    font-size: 22px;
    line-height: 1;
  }
  .info_wrap .bienvenida {
    text-align: center;
    font-size: 26px;
    line-height: 26px;
  }
  .info_wrap .calc_wrap {
    width: 80%;
    margin-right: auto;
    margin-left: auto;
    padding: 20px 30px;
  }
  .info_wrap .calc_wrap .calc_content {
    max-width: 100%;
    margin: auto;
  }
  .info_wrap.no-data {
    padding-top: 120px;
    padding-bottom: 30px;
  }
  .info_wrap.inverted .calc_wrap {
    margin: auto;
  }
  .info_wrap .calc_wrap .calc_content .ico_calc {
    width: 80px;
    height: 80px;
  }
  input,
  select,
  label {
    font-size: 13px;
  }
  .datos-iva label,
  .cobrar label,
  .cobrar input {
    font-size: 13px;
  }
  .seleccion {
    width: 100%;
    height: 50px;
  }
}
</style>
