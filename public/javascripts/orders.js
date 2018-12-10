angular.module('orders', ['ui.bootstrap']);

function MainCtrl($scope, $http, $dialog) {
    $scope.customerItems = []; //include item index, autoOrder, reorderPeriod, nextOrder, text, email, mobile
    $scope.items = [];

    $http.get('items.json')
        .then(function(res) {
            $scope.items = res.data;
        });

    var dialogOptions = {
        controller: 'PopupCtrl',
        templateUrl: 'orderPopup.html'
    };

    //edit existing purchase
    $scope.editItem = function($event, item) {
        var edit = true
        $scope.showDialog($event, item, edit);
    }

    $scope.showDialog = function($event, item, edit) {
        console.log("show dialog");
        console.log(item);

        var itemToEdit = item;
        itemToEdit.edit = edit

        $dialog.dialog(
                angular.extend(dialogOptions, { resolve: { item: angular.copy(itemToEdit) } }))
            .open()
            .then(function(result) {
                console.log("then")
                if (result) {
                    angular.copy(result, itemToEdit);
                }
                itemToEdit = undefined;
            });

    }

    //key listener for search bar
    $('.searchBar').keyup(function(e) {
        console.log("keydown");
        $scope.searchResults = [];
        $scope.items.forEach(function(item, index) {
            var regex = new RegExp($scope.searchPhrase, 'gi');
            if (item.name.match(regex)) { //^phrase to check beginning
                item.id = index;
                $scope.searchResults.push(item);
            }
        });
    });

    //select new item from search
    $scope.selectItem = function($event, item) {
        $event.stopPropagation();
        console.log(item);
        var edit = false
        $scope.showDialog($event, item, edit);
    }
    
    $scope.skipOrder = function(item){
        //switch statement. Move date back by item.orderEvery
        $event.stopPropagation();

    }
    
    $scope.orderByDate = function(item) {
        var parts = item.nextOrder.split('-');
        var date = new Date(parseInt(parts[2]), parseInt(parts[1]), parseInt(parts[0]));
        return date;
    }


    //////////////// ROUTE CALLS ///////////////////////////////
    $scope.getAll = function() {
        return $http.get('/items').success(function(data) {
            angular.copy(data, $scope.customerItems);
        });
    };
    $scope.getAll();

    $scope.updateItem = function() {
        console.log("incrememt ordered for " + item); //TODO MAKE THIS WORK
        $http.put('/items/' + item._id + '/update')
            .success(function(data) {
                console.log("inc ordered worked");
            });
    }

    $scope.deleteItem = function($event, item) {
        $event.stopPropagation();
        console.log("deleting");
        $http.delete('/items/' + item._id)
            .success(function(data) {
                console.log("delete worked");
            });
        $scope.getAll();
    }

}

function PopupCtrl($scope, item, dialog, $http) {
    $scope.item = item;
    $scope.today = new Date().toISOString().substr(0, 10);

    $scope.close = function() {
        dialog.close(undefined);
    };


    //click add automated purchase
    $scope.addAutoPurch = function(item) {
        //show auto purchase content
        item.edit = true;
        item.autoOrder = true;
    }

    //click add reminder
    $scope.addReminder = function(item) {
        //show reminder content
        item.edit = true;
        item.autoOrder = false;
    }


    ////////////// ROUTE FUNCTIONS ////////////////
    $scope.addAutoItem = function(item) {
        var newItem = {
            name: item.name,
            price: item.price,
            img: item.img,
            orderEvery: item.orderEvery,
            autoOrder: true,
            text: item.phone,
            email: item.email,
            mobilNotif: item.mobile,
            nextOrder: $('.datePicker').val(),
            vendor: item.vendor
        };
        console.log(newItem);
        $http.post('/add', newItem).success(function(data) {
            window.location.href = '/mainPg.html';
        });
    };

    $scope.addReminderItem = function(item) {
        console.log(typeof $scope.date);
        var newItem = {
            name: item.name,
            price: item.price,
            img: item.img,
            orderEvery: item.orderEvery,
            autoOrder: false,
            text: item.phone,
            email: item.email,
            mobilNotif: item.mobile,
            nextOrder: $('.datePicker').val(),
            vendor: item.vendor
        };
        console.log(newItem);
        $http.post('/add', newItem).success(function(data) {
            window.location.href = '/mainPg.html';
        });
    }


}

function SearchCtrl($scope, $http) {
    $http.get('items.json')
        .then(function(res) {
            $scope.items = res.data;
        });

}
