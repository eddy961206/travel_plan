// 지도 초기화 및 마커 설정
function initMaps() {
    // 위치 좌표 정의
    const locations = {
        overview: { lat: 46.5, lng: 11.9, zoom: 9 },
        "venice-airport": { lat: 45.5053, lng: 12.3519, name: "베니스 마르코 폴 공항" },
        "milan-airport": { lat: 45.6529, lng: 8.7237, name: "밀라노 말펜사 공항" },
        ortisei: { lat: 46.5768, lng: 11.6709, name: "오르티세이" },
        seceda: { lat: 46.6001, lng: 11.7243, name: "세체다" },
        "alpe-di-siusi": { lat: 46.5422, lng: 11.6558, name: "알페 디 시우시" },
        cortina: { lat: 46.5404, lng: 12.1359, name: "코르티나 담페초" },
        "tre-cime": { lat: 46.6167, lng: 12.3000, name: "트레 치메 디 라바레도" },
        misurina: { lat: 46.5846, lng: 12.2594, name: "미수리나 호수" },
        "cinque-torri": { lat: 46.5275, lng: 12.0500, name: "친퀘 토리" },
        tofana: { lat: 46.5578, lng: 12.0658, name: "토파나" },
        "hotel-gardena": { lat: 46.5768, lng: 11.6709, name: "Hotel Gardena Grödnerhof" },
        "villa-erina": { lat: 46.5768, lng: 11.6709, name: "Villa Erina" },
        "fiori-dolomites": { lat: 46.5404, lng: 12.1359, name: "FIORI DOLOMITES EXPERIENCE HOTEL" },
        "hotel-de-len": { lat: 46.5404, lng: 12.1359, name: "Hotel de Len" },
        route: { lat: 46.5, lng: 11.9, zoom: 9 } // 경로 지도를 위한 기본 좌표
    };

    // 각 지도 초기화
    for (const [id, location] of Object.entries(locations)) {
        const mapElement = document.getElementById(`map-${id}`);
        if (mapElement) {
            const map = new google.maps.Map(mapElement, {
                center: { lat: location.lat, lng: location.lng },
                zoom: location.zoom || 14,
                mapTypeId: id === 'overview' ? google.maps.MapTypeId.TERRAIN : google.maps.MapTypeId.ROADMAP
            });

            if (id !== 'overview' && id !== 'route') {
                new google.maps.Marker({
                    position: { lat: location.lat, lng: location.lng },
                    map: map,
                    title: location.name
                });
            }

            // 개요 지도에 모든 주요 위치 표시
            if (id === 'overview') {
                for (const [locId, loc] of Object.entries(locations)) {
                    if (locId !== 'overview' && locId !== 'route' &&
                        !locId.startsWith('hotel') &&
                        locId !== 'venice-airport' &&
                        locId !== 'milan-airport') {
                        new google.maps.Marker({
                            position: { lat: loc.lat, lng: loc.lng },
                            map: map,
                            title: loc.name
                        });
                    }
                }
            }

            // 경로 지도에 경로 표시
            if (id === 'route') {
                const directionsService = new google.maps.DirectionsService();
                const directionsRenderer = new google.maps.DirectionsRenderer();
                directionsRenderer.setMap(map);

                const waypoints = [
                    { location: new google.maps.LatLng(locations.ortisei.lat, locations.ortisei.lng) },
                    { location: new google.maps.LatLng(locations["alpe-di-siusi"].lat, locations["alpe-di-siusi"].lng) },
                    { location: new google.maps.LatLng(locations.cortina.lat, locations.cortina.lng) },
                    { location: new google.maps.LatLng(locations["tre-cime"].lat, locations["tre-cime"].lng) },
                    { location: new google.maps.LatLng(locations["cinque-torri"].lat, locations["cinque-torri"].lng) },
                    { location: new google.maps.LatLng(locations.tofana.lat, locations.tofana.lng) }
                ];

                directionsService.route({
                    origin: new google.maps.LatLng(locations["venice-airport"].lat, locations["venice-airport"].lng),
                    destination: new google.maps.LatLng(locations["venice-airport"].lat, locations["venice-airport"].lng),
                    waypoints: waypoints,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.DRIVING
                }, function(response, status) {
                    if (status === 'OK') {
                        directionsRenderer.setDirections(response);
                    }
                });
            }
        }
    }
}

// jQuery 문서 준비 핸들러
$(document).ready(function() {
    // 모든 일차 콘텐츠 초기화 (처음에 모두 접혀있음)
    $('.day-content').each(function() {
        $(this).data('original-height', $(this).outerHeight());
    }).addClass('collapsed');

    // 헤더 클릭 시 토글 기능
    $('.day-header').click(function() {
        const content = $(this).next('.day-content');
        content.toggleClass('collapsed');
        $(this).toggleClass('collapsed');
        
        // 아이콘 애니메이션
        if(content.hasClass('collapsed')) {
            $(this).find('h3').css('color', '#666');
        } else {
            $(this).find('h3').css('color', '#333');
        }
    });

    // 첫 번째 일차는 기본으로 펼치기
    $('.day-header:first').click();

    // 사이드바 생성 및 스크롤 감지
    const tocContent = $('.toc').html();
    $('body').append(`<div class="toc-sidebar">${tocContent}</div>`);

    // 스크롤 이벤트 핸들러
    $(window).scroll(function() {
        const currentPosition = $(this).scrollTop() + 100;
        
        $('section').each(function() {
            const sectionTop = $(this).offset().top;
            const sectionBottom = sectionTop + $(this).outerHeight();
            
            if (currentPosition >= sectionTop && currentPosition <= sectionBottom) {
                const id = $(this).attr('id');
                $('.toc-sidebar a').removeClass('active');
                $(`.toc-sidebar a[href="#${id}"]`).addClass('active');
            }
        });
    });

    // 부드러운 스크롤
    $('.toc-sidebar a').click(function(e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
    
});