var pos = 0;
var intv;
var flippedElement;
var opcionesHoteles = [{opciones:[{opcion:'Cuarto individual'},{opcion:'Alberca privada'},
					 {opcion:'Jacuzzi con burbujas'}],costo: '350',paquete:'Paquete medio'},
					 {opciones:[{opcion:'Cuarto individual'},{opcion:'Alberca privada'},
					 {opcion:'Jacuzzi de plata'}],costo: '500',paquete:'Paquete premium'},
					 {opciones:[{opcion:'Cuarto individual'},
					 {opcion:'Alberca privada'},{opcion:'Jacuzzi'}],costo: '300',paquete:'Paquete económico'}];
$(document).on('ready', function(){
	init();
});
$(window).on('resize', init);
window.addEventListener('orientationChange', init);
function init(){
	if ($('html').width() > 900) {
		$.stellar({
			'horizontalScrolling':false,
			hideDistantElements: false
		});		
	}
	$('#navegacionPrincipal').localScroll();
	$('.slide_controls li').on('click', handleClick);
	var width = $('.slider_container').width();

	$('.slide').each(function(a,e){
		addBackground(e,width, true);
	});
	$('.image-food').on('click', changeViewport)
	$('.image-food').each(function(i,e){
		addBackground(e,width,false);
		if($(e).hasClass('viewport')) return true
		$(e).data('top',((i)*100));
		$(e).css({
			'top': $(e).data('top')+'px'
		});
	})
	$(document).on('click', '.ver-mas', flipElement);

	// clearInterval(intv); A trabajar
	intv = setInterval(handleClick, 10000);
}

function initMap() {
	var map;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  });
  navigator.geolocation.getCurrentPosition(function(position){
  	var geolocalizacion = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  	// var marcador = new google.maps.Marker({
  	// 	map: map,
  	// 	animation: google.maps.Animation.DROP,
  	// 	draggable: true,
  	// 	position: geolocalizacion,
  	// 	visible:true
  	// });
  	map.setCenter(geolocalizacion);
  	calcRoute(geolocalizacion, map);
  });
}

function calcRoute(inicioRuta, map){
	var service = new google.maps.DirectionsService();
	var display = new google.maps.DirectionsRenderer();
	display.setMap(map);
	var posicionHotel = new google.maps.LatLng(-14.0448544,-75.7019123);
	// var marker = new google.maps.Marker({
	// 	map: map,
	// 	animation: google.maps.Animation.DROP,
	// 	draggable: false,
	// 	position: posicionHotel,
	// 	visible:true
	// });
	var request = {
		origin: inicioRuta,
	  destination: posicionHotel,
	  travelMode: google.maps.TravelMode.DRIVING
	};
	service.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      display.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function changeViewport(){
	var e = $('.viewport');
	e.css('top', $(e).data('top'));
	e.removeClass('viewport');
	$(this).addClass('viewport');
	$(this).css('top', 0);
}

function addBackground(element, width, setSize){
	if (!width) width = $('html').width();
	if (setSize) {
		$(element).css({
			'width': width,
			'height': $('html').height()
		});
	}
	var image = $(element).data('background');
	if($('html').width() > 900){
		image+'-movil.jpg';
	}else{
		image+ '.jpg';
	}
	$(element).css('background-image', 'url('+(image+'.jpg')+')');
	if($(element).height()> $(element).width()){
		$(element).css('background-size', 'auto 100%');
	}
}

function flipElement(){
	if(flippedElement != null){
		$(flippedElement).revertFlip();
		flippedElement = null;
	}
	$(flippedElement).remove();
	var padre = $(this).parent();
	flippedElement = padre;
	$('#precioTemplate').template('CompiledTemplate');
	$(padre).flip({
		direction: 'rl',
		speed:500,
		content: $('#precioTemplate').tmpl(opcionesHoteles[$(this).data('number')]).html(),
		color: '#f7f7f7',
		onEnd: function(){
			$('#regresar-ventana').on('click', function(){
				$(flippedElement).revertFlip();
				flippedElement = null;
			})
		}
	});
}

function handleClick(){
	var slide_target = 0;
	if($(this).parent().hasClass('slide_controls')){
		slide_target = $(this).index();
		pos = slide_target;
		clearInterval(intv);
		intv = setInterval(handleClick, 10000);
	} else {
		pos++;
		if (pos >= $('.slide').length) {
			pos = 0;
		}
		slide_target = pos;
	}
	// Se ve el efecto de desplazamiento a la izquierda de las imagenes
	$('.slideContainer').animate({
		'margin-left': -(slide_target * $('.slider_container').width())+'px'
	}, 'slow');

	//El desplaciamiento no se nota, aqui se oscurece todo
	/*$('.slideContainer').fadeOut('slow', function(){
		$(this).animate({
			'margin-left': -(slide_target * $('.slider_container').width())+'px'
		}, 'slow', function(){
			$(this).fadeIn();
		});
	});*/
}
