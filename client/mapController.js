angular.module('northApp').controller('MapController', ['$scope', 'leafletData', function($scope, leafletData){
  var mc = this;

  mc.lastClicked = {};

  // eventually will be pulled from server/database
  mc.storedMarkers = {
      m1: {
          lat: 44.996121,
          lng: -93.295845,
          title: 'Mr. Books Bruschetta Machine',
          type: 'one',
          visible: false
      },
      m2:{
        lat: 44.998995,
        lng: -93.291068,
        title: 'Ms. Kitchens Oblique Reference Parlor',
        type: 'two',
        visible: false
      },
      m3: {
          lat: 44.999143,
          lng: -93.297133,
          title: 'Mr. Bones Bruschetta Machine',
          type: 'one',
          visible: false
      },
      m4:{
        lat: 45.002572,
        lng: -93.289515,
        title: 'Ms. Burbakers Oblique Reference Parlor',
        type: 'two',
        visible: false
      }
  };

  mc.markerSize = Object.keys(mc.storedMarkers).length;
  mc.count = mc.markerSize + 1;
  mc.visibleMarkers = {};

  mc.filterMarkers = function(type){
    mc.visibleMarkers = {};
    if(type === 'all'){
      //mc.visibleMarkers = mc.storedMarkers;
      for (marker in mc.storedMarkers){
        mc.storedMarkers[marker].visibility = true;
      }
    } else if (type === 'none'){
      //mc.visibleMarkers = {};
      for (marker in mc.storedMarkers){
        mc.storedMarkers[marker].visibility = false;
      }
    } else {
      //mc.visibleMarkers = {};
      for (marker in mc.storedMarkers){
        if(mc.storedMarkers[marker].type === type){
          mc.storedMarkers[marker].visibility = !mc.storedMarkers[marker].visibility; // toggle visibility
        }
      }
    }
    // loop through storedMarkers and add visible ones to visibleMarkers
    for (marker in mc.storedMarkers){
      if(mc.storedMarkers[marker].visibility){
        mc.visibleMarkers['m' + mc.count] = mc.storedMarkers[marker];
        mc.count++;
      }
    }

    angular.extend(mc, {
      markers: mc.visibleMarkers
    });
    console.log('visiibleMarkers:', mc.visibleMarkers);
  };

  angular.extend(mc, {
        defaults: {
            scrollWheelZoom: false,
            touchZoom: true,
            dragging: true
        },
        center: {
          lat: 44.996121,
          lng: -93.295845,
          zoom: 15
        },
        tiles: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        markers: mc.visibleMarkers
    });

    $scope.$on('leafletDirectiveMarker.map.click', function(event, args){
      // console.log('clicked a marker:', args, '|event:', event);
      console.log('visibleMarkers on click:', mc.visibleMarkers);
      mc.showInfoDrawer = true;
      mc.lastClicked = args.model;
      mc.markerTitle = mc.lastClicked.title;
      mc.mapStyle = {height:'20vh'};

      // update map size
      leafletData.getMap().then(function(map) {
        setTimeout(function(){
          map.invalidateSize();
          console.log('called');
        }, 200);
      });

      angular.extend(mc, {
        center:{
          lat: mc.lastClicked.lat,
          lng: mc.lastClicked.lng,
          zoom: 15
        }
      });
    });

    $scope.$on('leafletDirectiveMap.map.click', function(event, args){
      mc.showInfoDrawer = false;
      mc.mapStyle = {height:'100vh'};
      leafletData.getMap().then(function(map) {
        setTimeout(function(){
          map.invalidateSize();
          console.log('called');
        }, 100);
      });
      angular.extend(mc, {
        center:{
          lat: mc.lastClicked.lat,
          lng: mc.lastClicked.lng,
          zoom: 15
        }
      });
    });

    $scope.$on('leafletDirectiveMap.map.resize', function(event, args){
      console.log('resized map');
    });

  mc.filterMarkers('all');
  console.log('Map controller loaded.');
}]);
