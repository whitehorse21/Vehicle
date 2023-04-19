import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import {Close} from '../../../../assets';
import styles from './Style';
import CloseModalButton from '../CloseModalButton/Component'

const TermsAndService = ({onClosePress}) => {
  async function openSite() {
    const url = 'https://fecit.com.ar/'
    const isSupported = await Linking.canOpenURL(url)
    if (isSupported) {
      await Linking.openURL(url)
    } else {
      console.log('cant open')
    }
  }

  return (
    <View style={styles.modalContent}>
      <CloseModalButton onPress={onClosePress}/>
      {/* <TouchableOpacity activeOpacity={0.8} onPress={onClosePress} style={styles.closeIconWrapper}>
        <Close style={styles.closeIcon} />
      </TouchableOpacity> */}
      <Text style={styles.titleText}>TERMINOS Y CONDICIONES</Text>
      <ScrollView
        style={styles.scrollContainer}
        bounces={false}
        indicatorStyle={'white'}
      >
        <Text style={styles.tosText}>El presente documento contiene los términos y condiciones para el uso de la aplicación <Text style={styles.textItalic}>Fecit</Text>. Lea atentamente estos términos antes de utilizar la plataforma.</Text>
        
        <Text style={styles.subTitleText}>Qué es Fecit</Text>
        <Text style={styles.tosText}>CUIT 20-32951708-0 en adelante “Fecit” es una plataforma tecnológica de tipo mercado en línea, exclusiva para servicio de transporte de cargas.</Text>
        <Text style={styles.tosText}>Los <Text style={styles.textItalic}>usuarios</Text> deben instalar la aplicación en un dispositivo móvil, y aceptar los siguientes términos y condiciones. </Text>
        <Text style={styles.tosText}>Ante cualquier incumplimiento de este contrato, se pondrá término inmediato al uso de la plataforma.</Text>

        <Text style={styles.subTitleText}>Usuarios</Text>
        <Text style={styles.tosText}><Text style={styles.underlineText}>Cliente:</Text> Son aquellas personas naturales (mayores de 18 años) o jurídicas, que buscan servicios de transporte de cargas; objetos / mercaderías lícitas.</Text>
        <Text style={styles.tosText}><Text style={styles.underlineText}>Transportista:</Text> Son aquellas personas naturales (mayores de 18 años) o jurídicas, cuya actividad comercial es el servicio de transporte de cargas terrestres conforme a la legislación vigente en Argentina, con vehículos de su propiedad.</Text>
        
        <Text style={styles.subTitleText}>Contrato para el Cliente</Text>
        <Text style={[styles.tosText, styles.underlineText]}>Cuenta:</Text>
        <Text style={styles.tosText}>Para crearse una cuenta como cliente debes registrarte en la aplicación. La cuenta es personal, única e intransferible.</Text>
        <Text style={styles.tosText}>El usuario será el único responsable de su cuenta y no revelará la contraseña a ningún tercero. Cualquier uso de la aplicación a través de la cuenta del usuario será considerado realizado por el usuario.</Text>
        <Text style={[styles.tosText, styles.underlineText]}>Como solicitar un flete:</Text>
        <Text style={styles.tosText}>El usuario debe generar una <Text style={styles.textItalicBold}>solicitud</Text> de transporte detallando el origen y destino, fechas a realizar;<Text style={styles.textItalic}> y buscar un transporte mediante dos opciones:</Text></Text> 
        <Text style={styles.tosText}><Text style={styles.textItalic}>- Ayuda con mi traslado:</Text> Encontra el tipo de vehículo adecuado, completando medidas y peso de los objetos.</Text>
        <Text style={styles.tosText}><Text style={styles.textItalic}>- Conozco el vehículo que necesito:</Text> Selecciona el tipo de vehículo dentro de una lista.</Text>
        <Text style={styles.tosText}>Luego accede a la búsqueda de transportistas. Podes filtrar por: Flete Online, precio, distancia, y envía la <Text style={styles.textItalic}>solicitud.</Text></Text>
        <Text style={[styles.tosText, styles.underlineText]}>Comunicación con el Transportista:</Text>
        <Text style={styles.tosText}>Una vez enviada la solicitud, el transportista puede aceptar o rechazar la solicitud. Si la acepta, enviará una cotización y tendrá la posibilidad de abrir un chat online.</Text>
        <Text style={[styles.tosText, styles.underlineText]}>Valor del flete:</Text>
        <Text style={styles.tosText}>El transportista publica un valor de referencia por hora de trabajo, y al enviar una <Text style={styles.textBold}>cotización</Text>, el cliente puede aceptar o rechazar la misma.</Text>
        <Text style={styles.tosText}><Text style={styles.textItalic}>-Rechazar:</Text> Si el cliente rechaza la cotización, puede continuar con la búsqueda.</Text>
        <Text style={styles.tosText}><Text style={styles.textItalic}>-Aceptar:</Text> Si el cliente acepta la cotización, luego debe realizar el <Text style={styles.textBold}>pago.</Text></Text>
        
        <Text style={[styles.tosText, styles.underlineText]}>Pago:</Text>
        <Text style={styles.tosText}>Luego de recibir la cotización del flete solicitado, el cliente puede aceptar o rechazar. En caso de aceptar, se realiza el pago. Todos los cargos serán pagaderos inmediatamente, de manera definitiva y no reembolsable.  Puede tomar la opción de pago efectivo o tarjetas de crédito / débito, a través de mercadopago integrado a Fecit.</Text>
        <Text style={styles.tosText}>Cualquier eventualidad que motive un costo adicional, atribuible al cliente, es sumado a su cargo.</Text>
        <Text style={styles.tosText}>Los usuarios entienden y aceptan que todos los pagos deben realizarse a través de la aplicación de forma obligatoria. Las partes se comprometen a no coordinar pagos por fuera de la aplicación.</Text>
        <Text style={styles.tosText}>El transportista es el responsable de cumplir con los requisitos tributarios que emanan de la actividad de transporte de cargas. Cualquier comprobante que corresponda a la operación deberá ser solicitada al usuario transportista.</Text>
      
        <Text style={[styles.tosText, styles.underlineText]}>Servicio de Transporte:</Text>
        <Text style={styles.tosText}>El transportista según lo acordado en la solicitud, se presenta en el lugar indicado por el cliente para realizar la carga de el/los objetos. Al completar la carga, el transportista traslada los objetos al punto de destino. Al realizar la entrega se da por finalizado el servicio. </Text>
        
        <Text style={[styles.tosText, styles.underlineText]}>Responsabilidad del cliente:</Text>
        <Text style={styles.tosText}>El cliente es el responsable de la correcta entrega y recepción de los objetos.</Text>
        <Text style={styles.tosText}>Debe asegurar que el vehículo tenga un lugar apto para estacionar durante el transcurso de la carga/descarga sin perturbar el orden público y respetando las leyes.</Text>
        <Text style={styles.tosText}>Los clientes entienden y aceptan que toda documentación que resulte necesaria para el traslado de los objetos y/o mercadería, será su responsabilidad tenerla a disposición.</Text>

        <Text style={[styles.tosText, styles.underlineText]}>Cancelación o Modificación del flete:</Text>
        <Text style={styles.tosText}>El cliente puede desistir unilateralmente de la contratación del servicio, a través de la opción <Text style={styles.textItalic}>rechazar</Text>. En caso de haber realizado el pago y luego necesitar cancelar el flete, debe contactarse por mail a consultas@fecit.com.ar </Text>
     
        <Text style={styles.subTitleText}>Contrato para el Transportista</Text>
        <Text style={[styles.tosText, styles.underlineText]}>Cuenta:</Text>
        <Text style={styles.tosText}>Los transportistas deben registrarse y mantener activa una cuenta personal de usuario FECIT TRANSPORTISTA.</Text>
        <Text style={styles.tosText}>No podrá ceder, transferir, ni autorizar a terceros a utilizar su cuenta FECIT TRANSPORTISTA.</Text>
        <Text style={styles.tosText}>Los transportistas para poder activar su cuenta deben brindar a través del sitio web <Text style={styles.linkText} onPress={() => openSite()}>www.fecit.com.ar</Text> la información solicitada, en caso de no cumplir, no podrán ser registrados como usuarios transportistas.</Text>
        <Text style={styles.tosText}>La información a proporcionar no se encuentra limitada a la siguiente lista: </Text>
        <Text style={styles.tosText}>-Nombre, razón social.</Text>
        <Text style={styles.tosText}>-Dni / CUIT / CUIL</Text>
        <Text style={styles.tosText}>-Correo Electrónico</Text>
        <Text style={styles.tosText}>-Cuenta Mercado Pago</Text>
        <Text style={styles.tosText}>-Cedula Automotor</Text>
        <Text style={styles.tosText}>-Seguro Obligatorio</Text>
        <Text style={styles.tosText}>-Fotos del Vehículo</Text>
        <Text style={styles.tosText}>También se solicitará que el transportista ingrese un valor de referencia por hora de trabajo, el cual estará a la vista.</Text>
        <Text style={[styles.tosText, styles.underlineText]}>Como cotizar un flete:</Text>
        <Text style={styles.tosText}>El transportista recibe una solicitud de transporte del cliente, que puede <Text style={styles.textItalic}>aceptar o rechazar.</Text></Text>
        <Text style={styles.tosText}>En caso de aceptar debe responder con una cotización final que incluya la evaluación completa de los requisitos para cumplir con el servicio. También puede comunicarse con el cliente a través de la opción ABRIR CHAT. El cliente puede aceptar o rechazar esta cotización. En caso de recibir la confirmación del flete, el transportista debe coordinar y gestionar el servicio.</Text>
        
        <Text style={[styles.tosText, styles.underlineText]}>Servicio de transporte:</Text>
        <Text style={styles.tosText}>Una vez confirmado el servicio, el transportista debe ir al punto de referencia solicitado por el cliente, para realizar la carga de el/los objetos en la fecha y horario acordado. Al completar la carga, el transportista traslada los objetos al punto de destino. Luego de realizar la entrega se da por finalizado el servicio.</Text>
        <Text style={styles.tosText}>Fecit y el usuario transportista no son responsables de que el receptor del objeto transportado no esté disponible, ubicable, y/o comunicable al momento de su entrega.</Text>
        <Text style={styles.tosText}>Si el transportista no logra contacto y/o comunicación con el destinatario, debe aguardar un lapso de tiempo de 30 minutos. De no recibir una respuesta, podrá retornar los objetos al punto de origen indicado por el cliente. Ante esta circunstancia el cliente debe abonar el monto pautado más un adicional por el traslado de devolución.</Text>
        <Text style={styles.tosText}>El cliente podrá visualizar en un mapa el traslado del flete.</Text>
       
        <Text style={[styles.tosText, styles.underlineText]}>Conducta del Transportista:</Text>
        <Text style={styles.tosText}>El transportista es el responsable de cumplir con las leyes aplicables y los requerimientos tributarios que emanen de la actividad.</Text>
        <Text style={styles.tosText}>El transportista reconoce que sus declaraciones electrónicas a través de la aplicación son verosímiles, y constituyen la voluntad de cumplir con el servicio acordado.</Text>
        <Text style={styles.tosText}>El transportista es el responsable exclusivo de cualquier tipo de daño, robo, hurto o pérdida de la carga del cliente.</Text>
        
        <Text style={[styles.tosText, styles.underlineText]}>Cobro del servicio:</Text>
        <Text style={styles.tosText}>El cobro del servicio puede realizarse en efectivo o con tarjetas de crédito / debito a través de mercadopago.</Text>
        <Text style={styles.tosText}>La aplicación Fecit a través de la plataforma mercadopago integrada, realiza el cobro del servicio al cliente y transfiere a la cuenta mercadopago del transportista.</Text>
        <Text style={styles.tosText}>Los usuarios entienden y aceptan que todos los pagos deberán realizarse a través de la aplicación de forma obligatoria. Las partes se comprometen a no coordinar pagos por fuera de la aplicación.</Text>
      
        <Text style={[styles.tosText, styles.underlineText]}>Cargos del servicio:</Text>
        <Text style={styles.tosText}>Publicar servicios de transporte en Fecit es gratis.</Text>
        <Text style={styles.tosText}>El transportista reconoce que el presente contrato es de carácter oneroso. Cuando una operación sea exitosa, el 10% del total se toma en concepto de cargo por venta.</Text>
        
        <Text style={styles.subTitleText}>Cancelación o Anulación del Servicio:</Text>
        <Text style={styles.tosText}>El cliente puede desistir unilateralmente de la contratación del servicio, a través de la opción rechazar cotización. </Text>
        <Text style={styles.tosText}>El transportista en caso de cancelar un servicio de transporte, incumpliendo un acuerdo con el cliente, debe reintegrar los cargos cobrados.</Text>
        
        <Text style={styles.subTitleText}>Sobre Fecit</Text>
        <Text style={styles.tosText}>Fecit no proporciona ninguna clase de servicios de transporte a los usuarios.</Text>
        <Text style={styles.tosText}>Fecit no garantiza la disponibilidad, puntualidad, ni ningún otro nivel del servicio.</Text>
        <Text style={styles.tosText}>Fecit y 20-32951708-0 no son responsables de cualquier tipo de daño, robo, hurto o perdida de los objetos transportados, ni tampoco de la inutilización o cualquier otra acción u omisión derivada del uso de la aplicación.</Text>
        <Text style={styles.tosText}>Fecit no es responsable de que el cliente o el transportista, no cuenten con un medio de pago valido.</Text>
        <Text style={styles.tosText}>Fecit no garantiza que los transportistas respondan las solicitudes de los clientes.</Text>
        <Text style={styles.tosText}>No se puede imputar a Fecit responsabilidad alguna, ni exigir pago de indemnización, en virtud de perjuicios resultantes de dificultades técnicas o fallas de sistema, internet o de la aplicación.</Text>
        
        <Text style={styles.subTitleText}>Condiciones contractuales</Text>
        <Text style={styles.tosText}>Fecit puede modificar las condiciones y términos cuando lo considere. Las modificaciones serán publicadas y luego efectivas por parte de Fecit. El acceso o uso de los servicios por parte de los usuarios se considera como una aceptación de estos términos y condiciones.</Text>
        
        <Text style={styles.subTitleText}>Propiedad Industrial:</Text>
        <Text style={styles.tosText}>Los usuarios reconocen que el software que ha sido descargado e instalado en su dispositivo es propiedad de Fecit, así como su sitio web, información y diseños que se obtienen en su totalidad.</Text>
        <Text style={styles.tosText}>El software formato aplicación, así como la marca, página web, nombres comerciales, diseños, logotipos, textos, contenido, fotografías, videos, animaciones, la expresión de ideas, procedimientos, métodos de operación y conceptos matemáticos, son propiedad de Fecit.</Text>
        <Text style={styles.tosText}>Es de carácter obligatorio respetar los derechos de propiedad industrial e intelectual indicados en la presente cláusula, como también lo dispuesto por la ley 11723 del Código Civil y comercial argentino.</Text>
        <Text style={styles.tosText}>Los usuarios en ningún caso podrán efectuar copias y/o distribuir información.</Text>
      
        <Text style={styles.subTitleText}>Política de Privacidad</Text>
        <Text style={styles.tosText}>Fecit está comprometido con la seguridad de los datos de sus usuarios.</Text>
        <Text style={styles.tosText}>Fecit usa y protege la información que es proporcionada por sus usuarios al momento de utilizar la aplicación.</Text>
        <Text style={styles.tosText}>Los datos personales solicitados en el registro de usuario, solo se emplearán de acuerdo a los términos de este documento.</Text>
        
        <Text style={styles.subTitleText}>Uso de la información</Text>
        <Text style={styles.tosText}>Fecit utiliza la información exclusivamente para mantener un registro de usuarios, y mejorar los servicios.  Se enviarán correos electrónicos periódicamente, a través de nuestro sitio, con ofertas especiales, nuevos servicios y demás información publicitaria. Estos correos electrónicos serán enviados a la dirección que el usuario proporcione y podrán ser cancelados en cualquier momento.</Text>
        <Text style={styles.tosText}>Fecit está altamente comprometido con mantener la información de los usuarios segura. Fecit cuenta con los sistemas más avanzados y actualizados para asegurar que no exista ningún acceso no autorizado. La información almacenada será exclusiva de Fecit.</Text>
        <Text style={styles.tosText}>Proporcionar datos personales supone la aceptación sin reservas de los términos y condiciones aquí establecidas. Si tiene dudas al respecto, póngase en contacto con Fecit a través de consultas@fecit.com.ar.</Text>
      
        <Text style={styles.subTitleText}>Integridad y normas del contrato</Text>
        <Text style={styles.tosText}>Si alguna de las cláusulas mencionadas en el contrato fuera nula por autoridad judicial y/o administrativa, en ningún caso afectara la validez y exigibilidad del resto del contrato.</Text>
      </ScrollView>
    </View>
  )
};
  
export default TermsAndService