'use strict';

angular.module('confusionApp')

    .controller('MenuController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

        $scope.showMenu = true;
        $scope.message = 'Loading ...';

        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;

        $scope.dishes = {};
        $scope.dishes = menuFactory.getDishes().query();


        $scope.select = function (setTab) {
            $scope.tab = setTab;

            if (setTab === 2) {
                $scope.filtText = "appetizer";
            }
            else if (setTab === 3) {
                $scope.filtText = "mains";
            }
            else if (setTab === 4) {
                $scope.filtText = "dessert";
            }
            else {
                $scope.filtText = "";
            }
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };

        $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('ContactController', ['$scope', function ($scope) {

        $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

        var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

        $scope.channels = channels;
        $scope.invalidChannelSelection = false;

    }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {
        var feedback = feedbackFactory.getFeedback();
        $scope.sendFeedback = function () {

            console.log($scope.feedback);
            feedback.save($scope.feedback);
            if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
                $scope.feedback.mychannel = "";
                $scope.feedbackForm.$setPristine();

            }

        };
    }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function ($scope, $stateParams, menuFactory) {

        $scope.showDish = false;
        $scope.message = "Loading ...";
        $scope.dish = menuFactory.getDishes().get({
                id: parseInt($stateParams.id, 10)
            })
            .$promise.then(
                function (response) {
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

    }])

    .controller('DishCommentController', ['$scope', function ($scope) {

        $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

        $scope.submitComment = function () {

            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);

            $scope.dish.comments.push($scope.mycomment);

            $scope.commentForm.$setPristine();

            $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};
        };
    }])

    // implement the IndexController and About Controller here
    .controller('IndexController', ['$scope', 'corporateFactory', 'menuFactory', function ($scope, corporateFactory, menuFactory) {
        $scope.dish = {};
        $scope.message = "Loading ...";

        menuFactory.getDishes().get(
            {id: 0},
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;

            },
            function (response) {
                $scope.dishError = "Error: " + response.status + " " + response.statusText;
                $scope.showDish = false;
            }
        );
        menuFactory.getPromotion()
            .get({id: 0})
            .$promise.then(
            function (response) {
                $scope.promotion = response;
                $scope.showPromotion = true;
            }
            ,
            function (response) {
                $scope.showPromotion = false;
                $scope.promotionError = "Error: " + response.status + " " + response.statusText;
            }
        );
        corporateFactory.getLeaders()
            .get({id: 0}).$promise.then(
            function (response) {
                $scope.executive = response;
                $scope.showExecutive = true;
            }
            ,
            function (error) {
                $scope.executiveError = "Error: " + response.status + " " + response.statusText;
                $scope.showExecutive = false;
            }
        );
    }])
    .controller('AboutController', ['$scope', 'corporateFactory', 'menuFactory', function ($scope, corporateFactory, menuFactory) {
        corporateFactory.getLeaders()
            .query().$promise.then(
            function (response) {
                $scope.leaders = response;
                $scope.showLeaders = true;
            }
            ,
            function (error) {
                $scope.leaderError = "Error: " + response.status + " " + response.statusText;
                $scope.showLeaders = false;
            }
        );
    }])


;
