nobelApp.service("yearService", function($q) {
  var serviceDef = {};
  //It's important that you use an object or an array here a string or other
  //primitive type can't be updated with angular.copy and changes to those
  //primitives can't be watched.
  serviceDef.year = {
    label: '1920'
  };
  serviceDef.update = function(newYear) {
    var deferred = $q.defer();
    
    angular.copy({
      label: newYear
    }, serviceDef.year);
    
    deferred.resolve(serviceDef.year);
    return deferred.promise;
  };
  return serviceDef;
});