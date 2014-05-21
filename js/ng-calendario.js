(function(angular) {
  'use strict';

  // src/js/
  var ngCalendario = angular.module('ngCalendario', []);

  ngCalendario.provider('$calendario', [function () {
    this.$get = [function () {
      var defaults = {
        weeks : [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekabbrs : [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
        months : [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        monthabbrs : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        // choose between values in options.weeks or options.weekabbrs
        displayWeekAbbr : false,
        // choose between values in options.months or options.monthabbrs
        displayMonthAbbr : false,
        // left most day in the calendar
        // 0 - Sunday, 1 - Monday, ... , 6 - Saturday
        startIn : 1,
      };
      var calendarioOptions = defaults;

      var $calendario = function() {};

      $calendario.setOptions = function(options) {
        calendarioOptions = $.extend(true, {}, calendarioOptions, options);
      };

      $calendario.getOptions = function() {
        return calendarioOptions;
      };

      return $calendario;
    }];
  }]);


  ngCalendario.directive('calendario', ['$calendario', '$rootScope', function($calendario, $rootScope) {
    return {
      restrict: 'E',
      require: 'ngModel',
      replace: false,
      scope: false,
      template: '<div><div class="custom-header clearfix"><nav><span id="custom-prev" class="custom-prev" ng-click="calendario.gotoPreviousMonth()"></span><span id="custom-next" class="custom-next" ng-click="calendario.gotoNextMonth()"></span></nav><h2 id="custom-month" class="custom-month">{{ calendario.getMonthName() }}</h2><h3 id="custom-year" class="custom-year">{{ calendario.getYear() }}</h3></div><div class="fc-calendar-container"></div><div>',
      link: function($scope, $element, attrs, $ngModel) {

        $scope.onDayClick = function($el, $content, dateProperties) {
          var year   = dateProperties.year;
          var month  = ("00" + dateProperties.month).slice(-2);
          var day    = ("00" + dateProperties.day).slice(-2);
          var dateCalendario = month+'-'+day+'-'+year;
          var dateISO = year+"-"+month+"-"+day
          var data = {};
          data[dateCalendario] = '<div class="ng-hide">Selected</div>';

          $scope.calendario.caldata = {};
          $scope.calendario.setData(data);
          $scope.$apply(function () {
            $ngModel.$setViewValue(dateISO);
          });
        };

        // Specify how UI should be updated
        $ngModel.$render = function() {
          if ($ngModel.$viewValue) {
            var dateParts = $ngModel.$viewValue.match(/(\d\d\d\d)-(\d\d)-(\d\d)/);
            if (dateParts !== null) {
              var dateCalendario = dateParts[2]+'-'+dateParts[3]+'-'+dateParts[1];
              var data = {};
              data[dateCalendario] = '<div class="ng-hide">Selected</div>';
              $scope.calendario.caldata = {};
              $scope.calendario.setData(data);
            }
          }
        };

        $calendario.setOptions({
          onDayClick: $scope.onDayClick
        });
        $scope.calendario = $element.find('.fc-calendar-container').calendario($calendario.getOptions());


      }
    };
  }]);
})(angular);
