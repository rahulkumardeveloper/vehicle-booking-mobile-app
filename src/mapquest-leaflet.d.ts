// Extend the Leaflet namespace to include MapQuest methods
declare namespace L {
  namespace mapquest {
    function map(id: string, options: any): any;
    function tileLayer(type: string): any;
    function control(options?: any): any;
  }
}
