(function () {
    const config = {
        apiKey: "AIzaSyBnvi5ePJJXBlkQL4tNcGl5nMGJUdFrrQc",
        authDomain: "fir-186509.firebaseapp.com",
        databaseURL: "https://fir-186509.firebaseio.com",
        projectId: "firebase-186509",
        storageBucket: "firebase-186509.appspot.com",
        messagingSenderId: "839813029354",
        appId: "1:839813029354:web:d19d7696a21dce6d"
    };
    firebase.initializeApp(config);

    var app = angular.module('app', ['firebase'])

    app.controller('MyCtrl', function ($firebaseObject) {
        const rootRef = firebase.database().ref().child('angular');
        const ref = rootRef.child('object');
        this.object = $firebaseObject(ref);
    });

    app.controller("SampleCtrl", function ($scope, $firebaseArray) {
        var ref = firebase.database().ref().child("angular");
        // create a synchronized array
        // click on `index.html` above to see it used in the DOM!
        $scope.angular = $firebaseArray(ref);
    });
})();