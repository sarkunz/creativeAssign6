
angular.module('orders', [])
    .controller('MainCtrl', [
        '$scope', '$http', 'ui.bootstrap',
        function($scope, $http, bootstrap) {
            $scope.vendors = [{
                    name: "Amazon",
                    items: [
                        { name: "Dog Food", price: "15.99", reorderPeriod: "month", img: "https://images-na.ssl-images-amazon.com/images/I/81O8cuVRtHL._SL1500_.jpg", itemDescript: "Description of item" },
                        { name: "Shampoo", price: "6.99", reorderPeriod: "2 weeks", img: "https://i5.walmartimages.com/asr/ea8a9842-494e-4aea-9754-a706e23b3d07_1.9810fda58e535786440d9c74895c227b.jpeg", itemDescript: "Description of item" },
                        { name: "Conditioner", price: "6.99", reorderPeriod: "2 weeks", img: "https://i5.walmartimages.com/asr/ea8a9842-494e-4aea-9754-a706e23b3d07_1.9810fda58e535786440d9c74895c227b.jpeg", itemDescript: "Description of item" },
                        { name: "Deodorant", price: "4.05", reorderPeriod: "2 months", img: "https://pics.drugstore.com/prodimg/231228/900.jpg", itemDescript: "Description of item" }
                    ]
                },
                {
                    name: "Wal-Mart",
                    items: [
                        { name: "Milk", price: "2.99", reorderPeriod: "week", img: "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_8139e88d-1814-4ff8-ab19-9ce6e1fb6832.png", itemDescript: "Description of item" },
                        { img: "", name: "Cat Food", price: "13.89", reorderPeriod: "month", itemDescript: "Description of item" },
                    ]
                },
            ];

            $scope.addVendor = function(e) {
                console.log("addVendor");
            };

            $scope.addItem = function(e) {
                console.log("addItem");
            };

            $scope.showDialog = function($event, item) {
                console.log("show dialog");
                // var parent = angular.element(document.body)
                // $mdDialog.show({
                //     parent: parent,
                //     targetEvent: $event,
                //     template: 
                //         '<md-dialog aria-label="Item dialog">' +
                //         '  <md-dialog-content>' +
                //         '   <div class="itemName>{{item.name}}</div>' +
                //         '   <img class="itemImg" src={{item.img}}>' +
                //         '  </md-dialog-content>' +
                //         '  <md-dialog-actions>' +
                //         '    <md-button ng-click="closeDialog()" class="md-primary">' +
                //         '      Close Dialog' +
                //         '    </md-button>' +
                //         '  </md-dialog-actions>' +
                //         '</md-dialog>',
                //     locals: {
                //         item: item
                //     },
                //     controller: DialogController
                // })
            }

            function DialogController($scope, $mdDialog, $items) {
                $scope.item = item;
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                }
            }


        }
    ]);
