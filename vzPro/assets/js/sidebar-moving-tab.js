/*!

 =========================================================
 * Material Dashboard Angular - V1.2.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-angular2
 * Copyright 2017 Creative Tim (https://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-angular/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */


$(document).ready(function(){
    // $moving_tab = $('<div class="moving-tab"/>');
    // $('.sidebar .nav-container').append($moving_tab);
    var y;
    var navElement = $('.sidebar .nav').find('li a');
    for(var i=0;i<navElement.length;i++){
        var l = $(navElement[i]).find('p').text()
        var clickedElement = localStorage.getItem('thisElement')
        if(clickedElement == null || clickedElement == 'Homelocation'){
            if($(navElement[i]).find('p').text() == 'Devices'){
                 navElement.css('background-color','');
                 $(navElement[i]).css('background-color', '#ff9800');
            }
        }
         else if(l == clickedElement){
            $(navElement[i]).css('background-color', '#ff9800');
        }
    }
    navElement.click(function(){
        var x = $(this).find('p').html();
        localStorage.setItem('thisElement', x);
        navElement.css('background-color','');
        $(this).css('background-color','#ff9800');
        y = localStorage.getItem('thisElement');
    })
    // animationSidebar($this, false);
    // $('div').removeClass('.moving-tab');
    // if (window.history && window.history.pushState) {

    //     // console.log('sunt in window.history');
    //     $(window).on('popstate', function() {

    //         // console.log('am apasat pe back, locatia noua: ', window.location.pathname);

    //         setTimeout(function(){
    //             // console.log('incep animatia cu 1ms delay');
    //             $this = $('.sidebar .nav').find('li.active a');
    //             animationSidebar($this,true);
    //         },1);

    //     });

    // }
});
// $(window).resize(function(){
//     $this = $('.sidebar .nav').find('li.active a');
//     animationSidebar($this,true);

// });
// $('.sidebar .nav > li > a').click(function(){
//     $this = $(this);
//     animationSidebar($this, true);
// });

// function animationSidebar($this, animate){
//     // console.log('incep animatia si butonul pe care sunt acum este:', $this[0].href );

//     $current_li_distance = $this.parent('li').position().top - 10;

//     button_text = $this.html();

//     $(".moving-tab").css("width", 230 + "px");

//     // if(animate){
//     //     $('.moving-tab').css({
//     //         'transform':'translate3d(0,' + $current_li_distance + 'px, 0)',
//     //         'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
//     //     });
//     // }else{
//     //     $('.moving-tab').css({
//     //         'transform':'translate3d(0,' + $current_li_distance + 'px, 0)'
//     //     });
//     // }

//     $this.css('background-color','red');

//     setTimeout(function(){
//         $('.moving-tab').html(button_text);
//     }, 100);
// }
