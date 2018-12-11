$(document).ready(function() {

    $('.login').click(function($event) {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
    
        firebase.auth().signInWithPopup(provider).then(function(result) {
            window.location.href = '/mainPg.html';
            //pretty useless authentication but hopefully y'all are okay with that
            
        });
        

    });
    


});