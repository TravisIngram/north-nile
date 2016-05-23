angular.module('northApp').controller('MapController', ['$scope', 'leafletData', 'leafletMarkerEvents', '$mdBottomSheet', function($scope, leafletData, leafletMarkerEvents, $mdBottomSheet){
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
            dragging: true,
            tap: true,
            tapTolerance: 100
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

    // open infoDrawer on marker Click
    $scope.$on('leafletDirectiveMarker.map.click', function(event, args){
      // console.log('clicked a marker:', args, '|event:', event);
      // console.log('visibleMarkers on click:', mc.visibleMarkers);

      mc.showInfoDrawer = true;
      mc.lastClicked = args.model;
      mc.markerTitle = mc.lastClicked.title;
      // mc.mapStyle = {height:'20vh'};

      // Angular material bottom sheet testing
      mc.dummyText1 = 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.';
      mc.dummyText2 = 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.';
      mc.dummyText3 = 'Capitalise on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.';
      // $mdBottomSheet.show({
      //   template: '<md-bottom-sheet><md-content stopTouchEvent><h2>' + mc.markerTitle + '</h2><p>' + mc.dummyText1 + '</p><p>' + mc.dummyText2 + '</p><p>' + mc.dummyText3 + '</p></md-content></md-bottom-sheet>'
      // });

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

    // close infoDrawer on map click
    mc.closeInfoDrawer = function(event, args){
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
    }
    $scope.$on('leafletDirectiveMap.map.click', mc.closeInfoDrawer());

  mc.filterMarkers('all');
  console.log('Map controller loaded.');
}]);

angular.module('northApp').directive('stopTouchEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.on('touchmove', function (evt) {
                evt.stopPropagation();
            });
        }
    };
})
