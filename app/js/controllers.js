var controllers = angular.module('started.controllers', []);

controllers.controller('timelineCtrl',['$scope','$mdDialog','$mdpDatePicker', '$mdpTimePicker','$mdToast','dataTimeline','$timeout',function ($scope,$mdDialog,$mdpDatePicker,$mdpTimePicker,$mdToast,dataTimeline,$timeout) {
  $scope.loading=true;
  $scope.hasSelect=false;
  $scope.eventos=[];
  $scope.evento = {galeria:[]};
  $scope.indexEvento = 0;
  $scope.evntsIzq=0;
  $scope.evntsDerecha=0;
  $scope.mensajeEventos="";
  $scope.showMensajeEventos=false;
  $scope.carouselIndex = 0;
  $scope.idNextEvent="";
  $scope.idPrevEvent="";
  /*CONFIGURACION DE LOS FONDOS DE LA APLICACION*/
  $scope.fondo1="img/fnd.jpg";
  $scope.miStyle={'background-image':'url('+$scope.fondo1+')'};
  $scope.cambiarFondo1=function () {
    $scope.fondo1="img/Champions.jpg";
    $scope.miStyle={'background-image':'url('+$scope.fondo1+')'};
    console.log($scope.miStyle);
  }
  $scope.cambiarFondo2=function (UrlTexture) {
    var cont=document.getElementById('centro');
    console.log(UrlTexture);
    cont.style.backgroundImage="url("+UrlTexture+")";
  }
  $scope.cambiarFondo3=function () {
    var cont=document.getElementById('fondoRegla');
    cont.style.backgroundImage="url('https://image.freepik.com/vector-gratis/diseno-de-fondo-con-textura_1117-108.jpg')";
  }
  var timeline;
  var items;
  $scope.$watch('edicion',function () {
    if($scope.edicion===true)
    {
      timeline.setOptions({editable: {
        add:false,
        updateTime:false,
        updateGroup: false,
        remove: true
      }});
      timeline.setSelection($scope.evento.id, {
        focus: true
      });
      $scope.hasSelect=true;
    }else{
      if(timeline!==undefined){
      timeline.setOptions({editable:false});
      timeline.setSelection($scope.evento.id, {
        focus: true
      });
    }
    }
    console.log('cambioEdicion a: '+ $scope.edicion);
  });
  $scope.$on('eventsLoad',function (event) {
    console.log('deberia cargar los eventos');
    $scope.eventos=dataTimeline.getEventos();
    items = new vis.DataSet($scope.eventos);
    console.log(items);
      //VARIABLES Y FUCIONES NECESARIAS PARA INICIALIZAR EL PLUGIN timeline del script vis.js
      var container = document.getElementById('visualization');
      var itemTemplate = Handlebars.compile(document.getElementById('item-template').innerHTML);
      var options = {
        height: '255px',
        min: new Date(1500, 0, 1),
        max: new Date(2500, 0, 1),
        showCurrentTime: false,
        zoomMin:1000*60*60*24*31*12*5,
        zoomMax:1000*60*60*24*31*12*500,
        editable: false,
        template: itemTemplate,
        onRemove: function (item, callback) {
          if(items.length>1){
            callback(item);
          }
          else{
            callback(null);
          }
        }
      };
      timeline = new vis.Timeline(container, items, options);
      timeline.setSelection(1, {
        focus: true
      });
      var result=dataTimeline.getEvnById('1');
      $scope.evento = result.evento;
      $scope.indexEvento=result.pos;
      items.on('remove',function (evt, properties) {
        $scope.delete(properties.items[0]);
      });
      timeline.on('select', function(properties) {
        console.log(properties);
        if (properties.items.length) {
          $scope.hasSelect=true;
          var id = properties.items.toString();
          var result=dataTimeline.getEvnById(id);
          $scope.evento = result.evento;
          $scope.indexEvento = result.pos;
          $scope.carouselIndex = 0;
          $scope.$digest();
          timeline.setSelection(id, {
            focus: true
          });
        }else {
          $scope.hasSelect=false;
          $scope.$digest();
        }
       });
      timeline.on('rangechange',function () {

        $scope.mensajeEventos="";
        $scope.showMensajeEventos=false;
        var rango=timeline.getWindow();
        var dateInicial=new Date(rango.start);
        var fechaFinal= new Date(rango.end);
        var arrayEventIzq=$scope.eventos.filter(function (obj) {
          return new Date(obj.start)<dateInicial;
        });
        $scope.evntsIzq=arrayEventIzq.length;
        if($scope.evntsIzq>0&&arrayEventIzq[$scope.evntsIzq-1]!==undefined)
        {
          $scope.idPrevEvent=arrayEventIzq[$scope.evntsIzq-1].id;
        }
        var arrayEventDerecha=$scope.eventos.filter(function (obj) {
          return new Date(obj.start)>fechaFinal;
        });
        $scope.evntsDerecha=arrayEventDerecha.length;
        if(arrayEventDerecha[0]!==undefined)
        {
          $scope.idNextEvent=arrayEventDerecha[0].id;
        }
        $scope.$digest();
      });
      timeline.on('rangechanged',function () {
        if(timeline.getVisibleItems().length>0){
          $scope.showMensajeEventos=false;
        }
        else{
          if($scope.evntsIzq>0&&$scope.evntsDerecha>0){
            $scope.mensajeEventos="Tienes mas eventos disponibles a la izquierda y a la derecha";
          }
          else if($scope.evntsIzq>0){
            $scope.mensajeEventos="tienes mas eventos disponibles a la izquierda";
          }
          else{
            $scope.mensajeEventos="tienes mas eventos disponibles a la derecha";
          }
          $scope.showMensajeEventos=true;
        }
        $scope.$digest();
      });
    $scope.loading=false;
    console.log($scope.loading);
  });
  $scope.delete=function (id) {
    var newId=(dataTimeline.deleteEvent(id));
    timeline.setSelection(newId, {
      focus: true
    });
    var result=dataTimeline.getEvnById(newId);
    $scope.evento = result.evento;
    $scope.indexEvento = result.pos;
    $scope.$digest();
  }
  $scope.asha=function (int) {
    timeline._onUp(int);
  }
  $scope.duplicarEvento=function () {
    var obj={};
    var id=""+Math.floor((Math.random() * 100) + 10);
    obj.id=id;
    obj.titulo=$scope.evento.titulo+' [COPIA]';
    obj.fecha=$scope.evento.fecha;
    obj.hora=$scope.evento.hora;
    obj.start=$scope.evento.start;
    obj.imagen=$scope.evento.imagen;
    obj.imagenEvento=$scope.evento.imagenEvento;
    dataTimeline.duplicarAttachment(obj.imagenEvento.idImagen);
    obj.descripcion=$scope.evento.descripcion;
    items.add(obj);
    obj.galeria=$scope.evento.galeria;
    dataTimeline.addEvent(obj);
    timeline.setSelection(id, {
      focus: true
    });
    var result=dataTimeline.getEvnById(id);
    $scope.evento = result.evento;
    $scope.indexEvento = result.pos;
    $scope.carouselIndex = 0;
  }
  $scope.saveTimeline=function () {
    dataTimeline.uploadTimeline();
  }
  $scope.eliminarTemplate=function () {
    if($scope.evento.galeria.length>1){
      $scope.evento.galeria.splice($scope.carouselIndex,1);
      $scope.carouselIndex--;
    }else{
      console.log('el evento debe tener minimo una tempalte');
    }
  }
  $scope.duplicateTemplate=function () {
    console.log($scope.evento);
    var templateAux=$scope.evento.galeria[$scope.carouselIndex];
    var template= {};
    template.descripcion=templateAux.descripcion;
    if(templateAux.titulo.includes('[NUEVO]')||templateAux.titulo.includes('[DUPLICADO]')){
      template.titulo=templateAux.titulo;
    }else{
      template.titulo=templateAux.titulo+' [DUPLICADO]';
    }
    template.imagen=templateAux.imagen;
    template.idImagen=templateAux.idImagen;
    template.tipo=templateAux.tipo;
    if(template.tipo==="tipo4_video"){
      template.id=Math.random().toString(36).substr(2, 9);
      template.url=templateAux.url;
      console.log(template);
    }
    dataTimeline.duplicarAttachment(template.idImagen);
    $scope.evento.galeria.splice($scope.carouselIndex+1,0,template);
    $scope.carouselIndex=$scope.carouselIndex+1;
    $scope.showAddToast();
  }
  $scope.addTemplate=function (tipoTemplate) {
    var template={};
    template.titulo="Nombre de la vista [NUEVO]";
    template.descripcion="Ingresar una descripcion";
    template.tipo=tipoTemplate;
    template.imagen='img/defauld.jpg';
    template.idImagen="";
    if(template.tipo==="tipo4_video"){
      template.id=Math.floor((Math.random() * 1000) + 100);
      template.url="";
      console.log(template.id);
    }
    $scope.evento.galeria.splice($scope.carouselIndex+1,0,template);
    $scope.carouselIndex=$scope.carouselIndex+1;
    $scope.showAddToast();
  }
  $scope.showAddToast=function () {
    $scope.patentEl=angular.element(document.querySelector('#contenedorGaleria'));
    $mdToast.show(
      $mdToast.simple().
      parent($scope.patentEl).
      textContent('Se agrego una nueva nueva Plantilla')
      .position('bottom right')
      .hideDelay(500)
    );
  }
  //define la plantilla que debe renderizar deacuerdo al tipo de template de la galeria
  $scope.getIncludeFile = function(tipo) {
    switch (tipo) {
      case "tipo2_Img":
        return 'templates/template-slider1.html';
      case "tipo1_Img_Texto":
        return 'templates/template-slider2.html';
      case "tipo3_Texto":
        return 'templates/template-texto.html';
      case "tipo4_video":
        return 'templates/template-video.html';
    }
  };
  //funcion para acceder al siguiente evento
  $scope.nextEvent = function() {
      if($scope.evntsDerecha>0){
        $scope.evento=dataTimeline.getEvnById($scope.idNextEvent).evento;
        timeline.setSelection($scope.evento.id, {
          focus: true
        });
        $scope.carouselIndex = 0;
        $scope.hasSelect=true;
        /*if($scope.indexEvento<dataTimeline.getEventos().length-1)
        {
            $scope.indexEvento+=1;
            $scope.evento=dataTimeline.getEvnByIndex($scope.indexEvento);
            timeline.setSelection($scope.evento.id, {
              focus: true
            });
            $scope.carouselIndex = 0;
            $scope.hasSelect=true;
        }else{
            timeline.setSelection($scope.evento.id, {
              focus: true
            });
            $scope.carouselIndex = 0;
            $scope.hasSelect=true;
        }*/
      }
    };
    $scope.getEvenVisible=function () {
      console.log(items);
      console.log('fecha');
      console.log(timeline.getWindow());
      console.log('eventos');
      console.log(timeline.getVisibleItems());
    }
    //funcion para acceder al avento anterior
    $scope.prevEvent = function() {
      if($scope.evntsIzq>0){
        $scope.evento=dataTimeline.getEvnById($scope.idPrevEvent).evento;
        timeline.setSelection($scope.evento.id, {
          focus: true
        });
        $scope.carouselIndex = 0;
        $scope.hasSelect=true;
        /*if($scope.indexEvento>0){
          $scope.indexEvento-=1;
          $scope.evento=dataTimeline.getEvnByIndex($scope.indexEvento);
          timeline.setSelection($scope.evento.id, {
            focus: true
          });
          $scope.carouselIndex = 0;
          $scope.hasSelect=true;
        }else{
          timeline.setSelection($scope.evento.id, {
            focus: true
          });
          $scope.carouselIndex = 0;
          $scope.hasSelect=true;
        }*/
      }

    };
    //funcion para el ZOOM
    $scope.zoom = function(percentage) {
      var range = timeline.getWindow();
      var interval = range.end - range.start;
      timeline.setWindow({
        start: range.start.valueOf() - interval * percentage,
        end: range.end.valueOf() + interval * percentage
      });
    };
    $scope.showDialogTextures=function ($event) {

      $mdDialog.show({
        targetEvent:$event,
        templateUrl:'templates/Texturas.html',
             locals:{
               items:items,
             },
             clickOutsideToClose:true,
             controller:DialogController1
      }).then(function (answer) {
        $scope.cambiarFondo2(answer);
      });
    }
    function DialogController1($scope,$mdDialog,items){
      /*Texturas
      TEXTURAS
      */
      var getTextures=function () {
        var listTexture=[];
        for (var i = 0; i < 41; i++) {
          listTexture.push(i+".png");
        }
        return listTexture;
      }
      $scope.listTexture=getTextures();
      $scope.currentDate = new Date();
  	   this.showDatePicker = function(ev) {
    	    $mdpDatePicker($scope.currentDate, {
            targetEvent: ev
          }).then(function(selectedDate) {
            $scope.currentDate = selectedDate;
          });;
        };
      $scope.closeDialog=function () {
        $mdDialog.cancel();
      };
      $scope.changeTexture=function (UrlTexture) {
        $mdDialog.hide("img/texturas/"+UrlTexture);
      }
      $scope.updateEvent=function () {
      };
    }
    $scope.showDialog=showDialog;
    //DIALOGO PARA AGREGAR EVENTOS
    function showDialog ($event,rol) {
      $scope.patentEl=angular.element(document.querySelector('#contenedorTimeline'));
      var evento={}
      console.log(rol);
      if(rol!=='add'){
        evento.titulo=$scope.evento.titulo;
        evento.descripcion=$scope.evento.descripcion;
        evento.fecha=$scope.evento.start;
        evento.imagen=$scope.evento.imagen;
        evento.start=new Date($scope.evento.start);
        evento.imagenEvento=$scope.evento.imagenEvento;
      }
      $mdDialog.show({
        parent:$scope.patentEl,
        targetEvent:$event,
        templateUrl:'templates/agregarUsuario.html',
             locals:{
               items:items,
               evnt:evento
             },
             clickOutsideToClose:true,
             controller:DialogController
      }).then(function (answer) {
        if(rol==='edit'){
          $scope.evento.titulo=answer.titulo;
          $scope.evento.descripcion=answer.descripcion;
          $scope.evento.fecha=moment(answer.start).format("YYYY-MM-DD");
          $scope.evento.hora=moment(answer.start).format("hh:mm a");
          $scope.evento.start=answer.start;
          $scope.evento.imagen=answer.imagen;
          items.update({id:$scope.evento.id,fecha:$scope.evento.fecha,titulo:answer.titulo,descripcion:answer.descripcion,imagen:answer.imagen,start:answer.start});
          $scope.evento.imagenEvento.idImagen=answer.imagenEvento.idImagen;
          dataTimeline.addAttachment($scope.evento.imagenEvento.idImagen,answer.blob);
        }
        else{
          evento=answer;
          console.log(evento);
          evento.fecha=moment(answer.start).format("YYYY-MM-DD");
          evento.hora=moment(answer.start).format("hh:mm a");
          evento.id=""+Math.floor((Math.random() * 100) + 10);
          evento.galeria=[{
            descripcion:"",
            fecha:"",
            hora:"",
            imagen:"img/defauld.jpg",
            idImagen:"",
            tipo:"tipo2_Img",
            titulo:"Insertar Titulo"
          }];
          dataTimeline.addEvent(evento);
          items.add(evento);
          timeline.setSelection(evento.id, {
            focus: true
          });
          var result=dataTimeline.getEvnById(evento.id);
          $scope.evento = result.evento;
          $scope.indexEvento=result.pos;
          console.log($scope.indexEvento);
          $scope.carouselIndex = 0;
          if($scope.evento.imagenEvento.idImagen!==""){
            dataTimeline.addAttachment($scope.evento.imagenEvento.idImagen,answer.blob);
          }
        }
      });
    }
    function DialogController($scope,$mdDialog,items,evnt){
      $scope.evn=evnt;
      $scope.blob={};
      $scope.format="image/jpeg";
       this.showDatePicker = function(ev) {
          $mdpDatePicker($scope.evn.start, {
            targetEvent: ev
          }).then(function(selectedDate) {
            $scope.evn.start = selectedDate;
            console.log($scope.evn.start);
          });;
        };
      $scope.closeDialog=function () {
        $mdDialog.cancel();
      };
      $scope.updateEvent=function () {
        if($scope.evn.imagenEvento===undefined){
          $scope.evn.imagenEvento={
            idImagen:"",
            referencia:""
          };
          $scope.evn.imagen='img/defauld.jpg';
        }else{
          $scope.evn.imagen=$scope.url;
          $scope.evn.blob=$scope.blob;
        }
        $mdDialog.hide($scope.evn);
      };
    $scope.myImage=$scope.evn.imagen;
    $scope.myCroppedImage='';
    $scope.updateFile=function () {
      var input=document.querySelector('#fileInput');
      input.click();
    }
    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
     reader.onload = function (evt) {
       $scope.$apply(function($scope){
         if($scope.evn.imagenEvento===undefined){
           $scope.evn.imagenEvento={};
         }
         $scope.evn.imagenEvento.idImagen=file.name;
         $scope.myImage=evt.target.result;
       });
     };
     reader.readAsDataURL(file);
    };

    setTimeout(function(){
        angular.element( document.querySelector('#fileInput') ).on( 'change', handleFileSelect );
      });
    }
    //DIALOGO PARA EDITAR LAS PLANTILLAS
    $scope.showDialogTemplate=showDialogTemplate;
    function showDialogTemplate ($event) {
      $scope.patentEl=angular.element(document.querySelector('#contenedorTimeline'));
      var template={};
      var templateAux=$scope.evento.galeria[$scope.carouselIndex];
      template.id=templateAux.id;
      template.titulo=templateAux.titulo;
      template.tipo=templateAux.tipo;
      template.descripcion=templateAux.descripcion;
      template.imagen=templateAux.imagen;
      template.idAttachment=templateAux.idAttachment;
      template.url=templateAux.url;
      templteUrl="";
      console.log(template.tipo);
      switch (template.tipo) {
        case "tipo2_Img":
          templteUrl= 'templates/editTemplateImg.html';
          break;
        case "tipo1_Img_Texto":
          templteUrl=  'templates/editTemplateImgText.html';
          break;
        case "tipo3_Texto":
          templteUrl=  'templates/editTemplateText.html';
          break;
        case "tipo4_video":
          templteUrl=  'templates/editTemplateVideo.html';
          break;
      }
      $mdDialog.show({
        parent:$scope.patentEl,
        targetEvent:$event,
        templateUrl: templteUrl,
             locals:{
               template:template
             },
             clickOutsideToClose:true,
             controller:DialogControllerTemplate
      }).then(function (answer) {
        templateAux.titulo=answer.titulo;
        templateAux.imagen=answer.imagen;
        templateAux.descripcion=answer.descripcion;
        if(templateAux.idAttachment!==answer.idAttachment){
          templateAux.idAttachment=answer.idAttachment;
          dataTimeline.deleteAttachent();
          dataTimeline.addAttachment(templateAux.idAttachment,answer.blob);
        }
        if(templateAux.tipo==='tipo4_video'){
          var id='vis'+templateAux.id;
          templateAux.url=answer.url;
          jwplayer(id).setup({
            file:templateAux.url,
            width: "100%",
            height: "175",
            dash: true,
            primary: "html5"
          });
        };
        //TODO:asignar la logica cunado se cierra el dialog;
      });
    }
    function DialogControllerTemplate($scope,$mdDialog,$timeout,template){
      console.log('estoy desde el dialogo de edicion de templates');

      $scope.template=template;
      $scope.myImage=template.imagen;
      $scope.imagenEditada='';
      $scope.urlImagen='';
      $scope.blob={};
      $scope.format="image/jpeg";
      console.log($scope.template);
    $scope.closeDialog=function () {
      $mdDialog.cancel();
    };
    $scope.updateTemplate=function () {
      $scope.template.imagen=$scope.urlImagen;
      $scope.template.blob=$scope.blob;
      $mdDialog.hide($scope.template);
    }
    if($scope.template.tipo==='tipo4_video')
    $scope.$watch('template.url',function () {
      console.log($scope.template.url);
      jwplayer('previewVideo').setup({
        file:$scope.template.url,
        width: "100%",
        height: "200",
        dash: true,
        primary: "html5"
      });
    });
    $scope.updateFile=function () {
      var input=document.querySelector('#fileInputimg');
      input.click();
    }
    var handleFileSelect1=function(evt) {
      var file=evt.currentTarget.files[0];
     var reader = new FileReader();
     reader.onload = function (evt) {
       $scope.$apply(function($scope){
         $scope.myImage=evt.target.result;
         $scope.template.idAttachment=file.name;
       });
     };
     reader.readAsDataURL(file);
   };
   $timeout(function(){
     angular.element( document.querySelector('#fileInputimg') ).on( 'change', handleFileSelect1 );
   }, 1000)
  }
}]);
