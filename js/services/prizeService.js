nobelApp.service("prizeService", function($q) {
  var serviceDef = {};
  //It's important that you use an object or an array here a string or other
  //primitive type can't be updated with angular.copy and changes to those
  //primitives can't be watched.
  serviceDef.prizes = {
    label: '0'
  };
  serviceDef.country = {
    label: ''
  };
  serviceDef.updatePrizes = function(newPrizes) {
    var deferred = $q.defer();
    
    angular.copy({
      label: newPrizes
    }, serviceDef.prizes);
    
    deferred.resolve(serviceDef.prizes);
    return deferred.promise;
  };

  serviceDef.updateCountry = function(newCountry) {
    var deferred = $q.defer();
    
    angular.copy({
      label: newCountry
    }, serviceDef.country);
    
    deferred.resolve(serviceDef.country);
    return deferred.promise;
  };
  return serviceDef;
});