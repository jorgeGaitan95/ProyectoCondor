var services= angular.module('started.services',[]);

//SERVICIO MANAGER DE LAS BASES DE DATOS DE LA APLICACION (LOCAL,REMOTA)
services.factory('pouchDBFactory', [function() {
  var factory={};
  var remote;
//INICIALIZA LA BASE DE DATOS REMOTA
  factory.initRemote = function(url) {
    remote = new PouchDB(url);
  };
  factory.getDBRemote = function() {
    return remote;
  };
  return factory;
}]);

//FACTORY CON LA INFORMACION DE LA LINEA DE TIEMPO
services.factory('dataTimeline',['pouchDBFactory','$q','$window','$rootScope',function (pouchDBFactory,$q,$window,$rootScope) {
  var factDatos={};
  var timeline={
  titulo: "Historia del Computadora",
  fechaInical: "21/12/88",
  fechaFinal: "14/05/2016",
  descripcion: "Esta linea de tiempo muestra el avance en los computadores",
  autor: " Rodriguez",
  calificacion: "5",
  imagenTimeline: {
    idImagen: "historiaComputador.jpg",
    referencia: ""
  },
  _attachments: {}
  };
  timeline.eventos=[{id:'1',titulo:'Barcelona Campeon', descripcion:'Barcelona vs Ars..', imagen:"img/barcelona.jpg",imagenEvento: {idImagen: "primer computador.jpg",referencia: "wikipedia"},galeria:[
    {id:1,titulo:'Barcelona 2-1 Arsenal',tipo: "tipo2_Img",imagen:'img/barcelona2009.jpg',idAttachment: "Charles Babbage.jpg",descripcion:''},
    {id:1,titulo:'Robben termina con la desgracia del Bayern',tipo: "tipo3_Texto" ,descripcion:'Un gol del internacional holandés cuando apenas quedaba tiempo en la final de la Champions en Londres permitió al conjunto germano lograr su quinta Copa de Europa y poner fin a su mala racha en los decisivos encuentros.'},
    {id:2,titulo:'El Milan se venga',tipo: "tipo1_Img_Texto",imagen:'img/milan2007.jpg',idAttachment: "Charles Babbage.jpg",descripcion:'Cuando el conjunto rossoneri logró vengarse después de lo sucedido en 2005 donde el conjunto inglés se impuso en la final por 2-1 en el OACA Spyro Louis Stadium en Atenas, el entrenador Carlo Ancelotti dijo: “Es una gran victoria, nunca hemos perdido de vista lo que queríamos alcanzar. Quizás nadie esperaba que ganáramos y nos lleváramos éste trofeo a casa”, afirmó.'},
    {id:1,titulo:'Resumen Partido',tipo: "tipo4_video",url:'https://www.youtube.com/watch?v=HYSSuS3Hn84',descripcion:'',idAttachment:""},
    {id:2,titulo:'Prueba Varios Videos',tipo: "tipo4_video",url:'https://www.youtube.com/watch?v=uXCtOk5dedI',descripcion:'',idAttachment:""},
    {id:1,titulo:'El Madrid logra la Undécima en otra final agónica',tipo: "tipo1_Img_Texto",imagen:'img/madrid2016.jpg',idAttachment: "Charles Babbage.jpg",descripcion:'El Real Madrid se hizo con su undécima Copa de Europa ante el Atlético Madrid, que volvió a quedarse a las puertas de ganar su primera “Champions League”. El partido acabó decidiéndose en los penales, tras un larguísimo encuentro que dejó extenuados a ambos equipos.'},
    {id:1,titulo:'Robben termina con la desgracia del Bayern',tipo: "tipo1_Img_Texto",imagen:'img/bayer2013.jpg',idAttachment: "Charles Babbage.jpg",descripcion:'Un gol del internacional holandés cuando apenas quedaba tiempo en la final de la Champions en Londres permitió al conjunto germano lograr su quinta Copa de Europa y poner fin a su mala racha en los decisivos encuentros.'}],start: '2006-06'},
  {id:'2',titulo:'Milan Campeon',descripcion:'Milan vs Liverpool', imagen:"img/milan.jpg",imagenEvento: {idAttachment: "primer computador.jpg",referencia: "wikipedia"},galeria:[{id:1,titulo:'El Milan se venga',tipo: "tipo1_Img_Texto",imagen:'img/milan2007.jpg',descripcion:'Cuando el conjunto rossoneri logró vengarse después de lo sucedido en 2005 donde el conjunto inglés se impuso en la final por 2-1 en el OACA Spyro Louis Stadium en Atenas, el entrenador Carlo Ancelotti dijo: “Es una gran victoria, nunca hemos perdido de vista lo que queríamos alcanzar. Quizás nadie esperaba que ganáramos y nos lleváramos éste trofeo a casa”, afirmó.',visible:true},
    {id:1,titulo:'Robben termina con la desgracia del Bayern',tipo: "tipo3_Texto" ,descripcion:'Un gol del internacional holandés cuando apenas quedaba tiempo en la final de la Champions en Londres permitió al conjunto germano lograr su quinta Copa de Europa y poner fin a su mala racha en los decisivos encuentros.'}],start: '2007-07'},
  {id:'3',titulo:'Man. United Campeon ', descripcion:'United vs Chelsea', imagen:"img/united.jpg",imagenEvento: {idAttachment: "primer computador.jpg",referencia: "wikipedia"},galeria:[
    {id:1,titulo:'La suerte favorece al Manchester United',tipo: "tipo1_Img_Texto" ,imagen:'img/man2008.jpg',idAttachment: "Charles Babbage.jpg",descripcion:'Sir Alex Ferguson reconoció que el destino le tendió una mano al Manchester United FC cuando se impuso por 6-5 en los penaltis al Chelsea FC en la final de la UEFA Champions League 2007/08.50 años después de la tragedia aérea de Múnich, Edwin van der Sar detuvo el lanzamiento de Nicolas Anelka permitiendo al Manchester levantar su tercera Copa de Europa.',visible:true}],start: '2008-07'}
];
  var urls=[];
  var arrayAttachments={};
  factDatos.initTimeline=function (idTimeline) {
    pouchDBFactory.getDBRemote().get(idTimeline).then(function (doc) {
      timeline=doc;
      return timeline;
    }).then(function (result) {
      console.log('se tiene la linea de tiempo');
      console.log(result);
      factDatos.generarUrls()
    });
  };
  factDatos.addEvent=function (evento) {
    timeline.eventos.push(evento);
    factDatos.ordenarEventoByDate();
    console.log(timeline);
  };
  factDatos.ordenarEventoByDate=function () {
    timeline.eventos.sort(function (a, b){
      return new Date(a.start) - new Date(b.start);
    });
  };
  factDatos.deleteEvent=function (id) {
    var evnts = timeline.eventos;
    for (var i = 0; i < evnts.length; i++) {
      if(evnts[i].id===id){
        evnts.splice(i,1);
        var a=i==0? i:i-1;
        return evnts[a].id;
      }
    }
  }
  factDatos.getEventos=function () {
    return timeline.eventos;
  }
  factDatos.uploadTimeline=function () {
    pouchDBFactory.getDBRemote().put(timeline).then(function () {
      console.log('el documento ha sido guardado exitosamente');
    });
  }
  factDatos.editDatos=function () {
    console.log(timeline);
  }
  factDatos.getEvnById=function (id) {
    var data={};
    var evnts = timeline.eventos;
    for (var i = 0; i < evnts.length; i++) {
      if(evnts[i].id===id){
        return {evento:evnts[i],pos:i};
      }
    }
  }
  factDatos.getEvnByIndex=function (index) {
    return timeline.eventos[index];
  }
  factDatos.initAttachments=function (attachmentId) {
    if(arrayAttachments[attachmentId]!==undefined){
       arrayAttachments[attachmentId]++;
    }
    else {
      arrayAttachments[attachmentId]=1;
    }
  }
  factDatos.duplicarAttachment=function (attachmentId) {
    arrayAttachments[attachmentId]++;
    console.log(arrayAttachments);
  }
  factDatos.deleteAttachment=function (filename) {
    if(arrayAttachments[filename]>1){
      arrayAttachments[filename]--;
    }
    else {
      delete timeline._attachments[filename];
    }
  }
  factDatos.addAttachment=function (filename,blob) {
    if(arrayAttachments[filename]!==undefined){
        var aux=filename;
        while (arrayAttachments[aux]!==undefined) {
          aux=filename;
          aux=Math.floor((Math.random() * 100) + 1)+filename;
        }
        filename=aux;
    }
    if(timeline._attachments===undefined){
      timeline._attachments={};
    };
    timeline._attachments[filename]={
      content_type:blob.type,
      data:blob
    }
    arrayAttachments[filename]=1;
    console.log(timeline);
  }
  /*LANZA LA PROMESA PARA OBTENER EL ATACHMENT DE LA BASE DE DATOS Y OBTENER LA URL EN DATA 64
  doc._id= id del documento de la liena de tiempo
  attachment=nombre de la imagen ej:rafael.jpg
  bd= base de datos activa en la aplciacion*/
  factDatos.llenarUrl = function(id,evento) {
    console.log(id);
    return pouchDBFactory.getDBRemote().getAttachment(id, evento.imagenEvento.idImagen).then(function(blob) {
      var url = $window.URL || $window.webkitURL;
      resultado = url.createObjectURL(blob);
      evento.imagen=resultado;
      factDatos.initAttachments(evento.imagenEvento.idImagen);
      return;
    },function (error) {
      evento.imagen="img/defauld.jpg";
      return;
    });
  };
  factDatos.llenarUrlGaleria=function (id,itemGaleria) {
    return pouchDBFactory.getDBRemote().getAttachment(id, itemGaleria.idImagen).then(function(blob) {
      var url = $window.URL || $window.webkitURL;
      resultado = url.createObjectURL(blob);
      itemGaleria.imagen=resultado;
      factDatos.initAttachments(itemGaleria.idImagen);
      return;
    },function (error) {
      itemGaleria.imagen="img/defauld.jpg";
      return;
    });
  }
  //GENERA LAS URL DE LAS IMAGENES DE LA APLICACION
  factDatos.generarUrls = function() {
    var promesas=[]
    var evnts = timeline.eventos;
    //RECORRE LOS EVENTOS DE UNA LIENA DE TIEMPO
    for (var i = 0; i < evnts.length; i++) {
      if(evnts[i].imagenEvento.idImagen!==""){
        var promesa=this.llenarUrl(timeline._id, evnts[i]);
        promesas.push(promesa);
      }
      else {
        evnts[i].imagen="img/defauld.jpg";
      }
      if(evnts[i].start===undefined||evnts.start===""){
        evnts[i].start=evnts[i].fecha;
      }
      if (evnts[i].galeria !== undefined) {
        for (var j = 0; j < evnts[i].galeria.length; j++) {
          if (evnts[i].galeria[j].idImagen !== "") {
            this.llenarUrlGaleria(timeline._id, evnts[i].galeria[j]);
          }
          else {
            evnts[i].galeria[j].imagen="img/defauld.jpg";
          }
        }
      }
    }
    var listaPromesas=$q.all(promesas).then(function () {
      console.log('se completo las multiples promesas');
      console.log(timeline);
      console.log(arrayAttachments);
      $rootScope.$broadcast('eventsLoad');
    });
  };

  return factDatos;
}]);
