function GeojsonMapService(){

    //this.map = map;
    this.urlData = 'https://raw.githubusercontent.com/geochicasosm/lascallesdelasmujeres/master';

    this.loadGeojson = function(map, tilecount, folder){    
    
        for(var i=0; i<tilecount; i++){
    
            fetch(this.urlData+ '/data/'+folder+'/final_tile'+i+'.geojson').then(function(res){
                return res.json();
            }).then(addGeojsonSource.bind(this, map));
        }    
    };

    function addGeojsonSource(map, geojson, sourcename = Date.now()){
           
        map.addLayer({
            "id": `${sourcename}`,
            "type": "line",
            "source": {
                "type": "geojson",
                "data": geojson
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                //"line-color":  "#76ef0a",
                'line-color': ['case', ['==', ['get', 'gender'], 'Female'], '#ffca3a', '#00B99E'],
                "line-width": ['case', ['==', ['get', 'gender'], 'Female'], 5, 4],
            }
        });
    
        map.on('click', `${sourcename}`, function (e) {

            var link = e.features[0].properties.wikipedia_link;
            var name = e.features[0].properties.name;
            var gender = e.features[0].properties.gender;
    
            var color = "#0e9686f2";

            var html = '<div class="row">'+
                        '<div class="col-sm">'+
                            '<div class="popup-male"><p>'+name+'</p></div>'+
                        '</div>'+
                    '</div>';

            if (gender === 'Female'){
                color = "#ffca3af2";

                var txtLink = '<p class=""><a  class="btn btn-light" target="_blank" href=\''+link+'\'><i class="fab fa-wikipedia-w"></i></a></p>';
                if(link === ''){
                    txtLink = '<p class=""><a  class="btn btn-light disabled" target="_blank" href=\''+link+'\'><i class="fab fa-wikipedia-w"></i></a></p>'+
                    '<span class="badge badge-secondary"><i class="fas fa-exclamation"></i>&nbsp;Calle sin artículo</span>';
                }

                html = '<div class="row">'+
                            '<div class="col-sm">'+
                                '<div class="popup-female">'+
                                    '<p>'+name+'</p>'+
                                    txtLink+
                                '</div>'+
                            '</div>'+
                        '</div>';

                //html = '<div class="popup-female"><p>'+name+'</p><p>( mujer )</p> <p><a target="_blank" href=\''+link+'\'><img src="./css/images/wikipedia.svg"/></a></p></div>';
            }
            
            
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(html)
                .addTo(map);
            $(".mapboxgl-popup-content").css("background-color", color);


        });        
    }

}