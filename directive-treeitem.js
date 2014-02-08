angular.module('tree', [])
.factory('schemaCenter', [function(){
  return function(value){
    var result;
    /*
      value ={
        type: string,
        model: string,
        required: bool,
        displayName: {de: string}
      }
    */

    switch (value.type){

      case "boolean":
      case "bool": {
        result = "<label>" + value.displayName.de + "</label><input " +
        "ng-model='model." + value.model + "'" +
        "type='checkbox' " +
        (value.required ? "required " : "") +
        "></input>";
        break;
      }

      default: {
        result = "<label>" + value.displayName.de + "</label><input " +
        "ng-model='model." + value.model + "'" +
        "type='" + value.type + "' " +
        (value.required ? "required " : "") +
        "></input>";
      }
    }
    return result;
  }
}])
.directive('dbaAutoForm', ['$compile', 'schemaCenter', function($compile, schemaCenter){
  return {
    restrict: "E",
    scope:{
      model: "=",
      schema: "="
    },
    link: function(scope, iElm, iAttrs){
      _(scope.schema)
      .each(function(value, key, list){
        var html;
        html = schemaCenter(value)
        iElm.append($compile(html)(scope));
      })
    }
  };
}])
.directive('tree', [function() {
      return {
        restrict: 'E',
        template: '<div ng-include="\'partials/treeitem.html\'" ng-repeat="item in todos"></div>'
      };
}])
.directive('itemControlBar', [function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/itemControlBar.html'
      };
}])
.directive('dbaSelectionButtonsTiny', [function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/dba-selection-buttons-tiny.html'
      };
}])
.directive('itemDetailView', [function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/itemDetailView.html'
      };
}])
.directive('topBar', [function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/topBar.html'
      };
}])
.directive('itemMainBar', [function() {
      return {
        restrict: 'E',
        templateUrl: 'partials/itemMainBar.html'
      };
}])
.directive('dbaButtonTiny', [function() {
      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: 'partials/dba-button-tiny.html'
      };
}])
.directive('dbaButtonTinyCheck', ["$parse", function($parse) {
      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: 'partials/dba-button-tiny.html',
        link: function(scope, element, attrs){
            var getter, setter;
            scope = scope.$parent;
            getter = $parse(attrs.model);
            setter = getter.assign;
            if (getter(scope)){
              element.addClass(attrs.dbaCheckClass);
            }
            
            element.bind("click", function(){
              scope.$apply(function(){
                setter(scope, !getter(scope));
              });
            });

            scope.$watch(attrs.model, function(){
              element.toggleClass(attrs.dbaCheckClass);
            });
            element.toggleClass(attrs.dbaCheckClass); //das ist um das erste getriggert werden des watchers abzufangen
        }
      };
}])
.factory('Todos', ["$window", function ($window) {
    var storedtree, tree, save, getDoneTasks, getAllTasks;

    storedtree = $window.localStorage.getItem("storedTree");
    if (storedtree !== null){
      storedtree = Tree.deserialize(storedtree, new Counter());
    } else {
      storedtree = new Tree();
    }

    save = function(){
      $window.localStorage.setItem("storedTree", storedtree.serialize(true));      
      console.log("speichere gerade");
    }

    getDoneTasks = function(){
      return this.getAllTasks().filter(function(x){
        return x.content.done;
      });
    };

    getAllTasks = function(){
        return _.values(storedtree).filter(function(x){
          return !!x.content;
        });
    };

    return {
      tree: storedtree,
      save: save,
      getAllTasks: getAllTasks,
      getDoneTasks: getDoneTasks
    };
}])
.factory('UIState', ['$window', function ($window) {
    var state, save;
    state = $window.localStorage.getItem("uistate");
    if (state !== null){
      state = JSON.parse(state);
    } else {
      state = {
        currentSelectionArray: [],
        collapsed: {},
        currentSelection: undefined,
        hide_done: true
        };
    }
    save = function(){
      $window.localStorage.setItem("uistate", angular.toJson(this.state))
    };

  return {
    state: state,
    save: save
  };
}])