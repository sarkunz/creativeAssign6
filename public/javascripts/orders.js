angular.module('orders', ['ui.bootstrap']);

function MainCtrl($scope, $http, $dialog) {
    $scope.customerItems = []; //include item index, autoOrder, reorderPeriod, nextOrder, text, email, mobile
    $scope.items = [];
    $scope.orderOpt = "byDate";

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

        $dialog.dialog(angular.extend(dialogOptions, { resolve: { item: angular.copy(itemToEdit) } }))
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
        var count = 0;
        $scope.items.forEach(function(item, index) {
            count = 0;
            var regex = new RegExp($scope.searchPhrase, 'gi');
            if (item.name.match(regex)) { //^phrase to check beginning
                if (index === 9) {
                    console.log("nine");
                    item.multResults = true;
                    console.log(item);
                }
                else item.multResults = false;
                //item.id = index;
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

    $scope.skipOrder = function($event, item) {
        //switch statement. Move date back by item.orderEvery
        $event.stopPropagation();
        $scope.showSkippedDialog(item);

        var parts = item.nextOrder.split('-');
        var date = new Date(parseInt(parts[0]), parseInt(parts[1] - 1), parseInt(parts[2]));
        switch (item.orderEvery) {
            case 'day':
                date.setDate(date.getDate() + 1);
                break;
            case 'week':
                date.setDate(date.getDate() + 7);
                break;
            case 'twoweek':
                date.setDate(date.getDate() + 14);
                break;
            case 'month':
                date.setMonth(date.getMonth() + 1);
                break;
            case 'threemonth':
                date.setMonth(date.getMonth() + 3);
                break;
            case 'sixmonth':
                date.setMonth(date.getMonth() + 6);
                break;
            default:
                // code
        }
        item.nextOrder = date.toISOString().substr(0, 10);

    }

    $scope.showSkippedDialog = function() {
        $dialog.dialog({ templateUrl: '/skippedDialog.html' }).open();
        //TODO: close dialog
    }


    $scope.orderByDate = function(item) {
        if ($scope.orderOpt == "byDate") {
            var parts = item.nextOrder.split('-');
            var date = new Date(parseInt(parts[0]), parseInt(parts[1] - 1), parseInt(parts[2]));
            return date;
        }
        else if ($scope.orderOpt == "price") {
            return item.price;
        }
        else if ($scope.orderOpt == "name") {
            return item.name;
        }

    }


    /////////////////////////// MAINCTRL ROUTE CALLS ///////////////////////////////
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


    ///////////////////////// MAINCTRL AUTHENTICATION STUFF ////////////////////////////
    $scope.login = function($event) {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
    
        firebase.auth().signInWithPopup(provider).then(function(result) {
            window.location.href = '/mainPg.html';
            
        });
    }

    $scope.initApp = function() {
        //listen to get redirect result
        firebase.auth().getRedirectResult().then(function(result) {
            console.log("RETURNED------------");
            if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                
                var token = result.credential.accessToken;
                console.log(token);
                // ...
            }
            // The signed-in user info.
            var user = result.user;
            
        }).catch(function(error) { // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            console.log(errorMessage)
            // ...
        });

        // [START authstatelistener]
        firebase.auth().onAuthStateChanged(function(user) { //move to orders.js so we can put in scope
            if (user) {
                // window.location.href = '/mainPg.html';
                console.log("USER");
                console.log(user);
                // User is signed in.
                $scope.displayName = user.displayName;
                $scope.email = user.email;
                $scope.photoURL = user.photoURL;
                // var isAnonymous = user.isAnonymous;
                // var uid = user.uid;
                // var providerData = user.providerData;
            }


        });

    }


}

function PopupCtrl($scope, item, dialog, $http) {
    $scope.item = item;
    $scope.today = new Date().toISOString().substr(0, 10);
    item.email = globalEmail;
    item.phone = "(555)555-5555";

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


    ////////////// POPUP ROUTE FUNCTIONS ////////////////
    $scope.addAutoItem = function(item) {
        var newItem = {
            name: item.name,
            price: item.price,
            img: item.img,
            orderEvery: item.orderEvery,
            autoOrder: true,
            useEmail: item.useEmail,
            usePhone: item.usePhone,
            text: item.phone,
            email: item.email,
            mobilNotif: item.mobileNotif,
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
            useEmail: item.useEmail,
            usePhone: item.usePhone,
            text: item.phone,
            email: item.email,
            mobilNotif: item.mobileNotif,
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

$(document).ready(function() {
    $('.downArrow').click(function() {
        console.log("Scrolling");
        $("html, body").animate({ scrollTop: 700 }, "slow");
    });


});