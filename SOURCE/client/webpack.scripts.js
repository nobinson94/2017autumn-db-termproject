import geolib from 'geolib';


exports.getCoordPathLength = (coord1, coord2) => {
  let distance = geolib.getDistance(
    {latitude: coord1.f_LAT, longitude: coord1.f_LNG},
    {latitude: coord2.f_LAT, longitude: coord2.f_LNG}
  );

  return distance;
}
