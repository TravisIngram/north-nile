angular.module('northApp').controller('MapController', ['UserTrackFactory', '$scope', 'leafletData', 'leafletMarkerEvents', '$mdBottomSheet', function(UserTrackFactory, $scope, leafletData, leafletMarkerEvents, $mdBottomSheet){
  var mc = this;

  UserTrackFactory.getUserData();

  mc.user = UserTrackFactory.user;



  // test data - eventually will be pulled from server/database
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

  // start count at a number higher than any keys present in the object - this ensures no duplicates
  mc.markerSize = Object.keys(mc.storedMarkers).length;
  mc.count = mc.markerSize + 1;
  mc.visibleMarkers = {};

  // filter visibility of markers
  mc.filterMarkers = function(type){
    mc.visibleMarkers = {};

    if(type === 'all'){
      for (marker in mc.storedMarkers){
        mc.storedMarkers[marker].visibility = true;
      }
    } else if (type === 'none'){
      for (marker in mc.storedMarkers){
        mc.storedMarkers[marker].visibility = false;
      }
    } else {
      // loop through the list of markers from the database, and toggle visibility based on type
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

    // write changes to map
    angular.extend(mc, {
      markers: mc.visibleMarkers
    });
  };

  // configure map defaults
  angular.extend(mc, {
        defaults: {
            scrollWheelZoom: false,
            touchZoom: true,
            dragging: true,
            tap: true,
            tapTolerance: 100 // may not be necessary after angular material skipClickHijack() fix
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

  mc.lastClicked = {};

  // open infoDrawer on marker Click
  mc.openInfoDrawer = function(event, args){
    mc.showInfoDrawer = true;

    // grab last marker clicked to recenter map later
    mc.lastClicked = args.model;

    // test text
    mc.markerTitle = mc.lastClicked.title;
    // test text to force overflow and scrolling
    mc.dummyText1 = 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.';
    mc.dummyText2 = 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.';
    mc.dummyText3 = 'Capitalise on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.';

    // update map size - needed if we are shrinking the map to recenter the icon/marker in the top middle
    mc.mapStyle = {height:'30vh'};
    leafletData.getMap().then(function(map) {
      setTimeout(function(){ // may not be best practice - seems to result in the map moving too much
        map.invalidateSize();
        console.log('called');
      }, 200);
    });

    // this centers the map on the marker clicked
    angular.extend(mc, {
      center:{
        lat: mc.lastClicked.lat,
        lng: mc.lastClicked.lng,
        zoom: 15
      }
    });
  };

  // close infoDrawer on map click
  mc.closeInfoDrawer = function(event, args){
    mc.showInfoDrawer = false;

    // update map size - needed if we are shrinking the map to recenter the icon/marker in the top middle
    mc.mapStyle = {height:'100vh'};
    leafletData.getMap().then(function(map) {
      setTimeout(function(){
        map.invalidateSize();
        console.log('called');
      }, 100);
    });

    // this centers the map on the marker that initiated the click that this is 'undoing'
    angular.extend(mc, {
      center:{
        lat: mc.lastClicked.lat,
        lng: mc.lastClicked.lng,
        zoom: 15
      }
    });
  };

  // bind event handlers
  $scope.$on('leafletDirectiveMarker.map.click', mc.openInfoDrawer);
  $scope.$on('leafletDirectiveMap.map.click', mc.closeInfoDrawer);


  // set all markers to visible on page load
  mc.filterMarkers('all');
  console.log('Map controller loaded.');



}]);

//user factory//
angular.module('northApp').factory('UserTrackFactory', ['$http', function($http){

  var user={};

  var getUserData=function(){
    console.log('Called service');
    $http.get('/auth').then(function(response){
      console.log('response from getUserData', response);
      // user.info=response.data;
    })
  }
  return {
    user: user,
    getUserData: getUserData
  };
}]);
