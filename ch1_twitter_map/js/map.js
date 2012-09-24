// Twitter Map

$(function() {

    //-- Data ---------------------------------------------------------------------//
    
    var Tweet = Backbone.Model;
    
    var Tweets = Backbone.Collection.extend({
        
        // The search url which will pull in all tweets 1000 miles from roughly the center of the United States
        url: "http://search.twitter.com/search.json?callback=?&count=100&rpp=100&geocode=35.5,-100,1000mi",

        // Filters information before it is passed into the collection
        parse: function(response) {
            
            // Filter all tweets without a specific geolocation
            var filtered = _.filter(response.results, function(d) {
                if (d.geo !== null) {
                    return true;
                }
            });
            
            this.add(filtered);
            
        },
        
        initialize: function() {
            
            // Search for more tweets every 2 seconds
            setInterval(function() {
                console.log("Fetching fresh data...");
                tweets.fetch();
            }, 2000);
            
            this.fetch();
        }
    });

    //-- Views --------------------------------------------------------------------//
    
    var Map = Backbone.View.extend({
        
        el: $('#map_canvas'),
        
        initialize: function() {
            
            // Roughly the center of the United States
            var latlng = new google.maps.LatLng(35.5, -100);
            
            // Google Maps Options
            var myOptions = {
                zoom: 5,
                center: latlng,
                mapTypeControl: false,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.ANDROID
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false,
                styles: [{featureType:"administrative",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"landscape.natural",stylers:[{hue:"#0000ff"},{lightness:-84},{visibility:"off"}]},{featureType:"water",stylers:[{visibility:"on"},{saturation:-61},{lightness:-63}]},{featureType:"poi",stylers:[{visibility:"off"}]},{featureType:"road",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"landscape",stylers:[{visibility:"off"}]},{featureType:"administrative",stylers:[{visibility:"off"}]},{},{}]
                
            };
            
            // Force the height of the map to fit the window
            this.$el.height($(window).height() - $("header").height());
            
            // Add the Google Map to the page
            var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
            
            // Bind an event to add tweets from the collection
            
            this.collection.bind('add', function(model) {
                
                // Stores the tweet's location
                var position = new google.maps.LatLng( model.get("geo").coordinates[0], model.get("geo").coordinates[1]);
                
                // Creates the marker
                // Uncomment the 'icon' property to enable sexy markers. Get the icon Github repo:
                // https://github.com/nhunzaker/twittermap/tree/master/images
                var marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: model.from_user,
                    //icon: 'images/marker.png',
                    description: model.text
                });
                
                
            });
        }
    }); //-- End of Map view


    //-- Initialize ---------------------------------------------------------------//
    
    // Create an instance of the tweets collection
    var tweets = new Tweets({
        model: Tweet
    });

    // Create the Map view, binding it to the tweets collection
    var twitter_map = new Map({
        collection: tweets
    });

});