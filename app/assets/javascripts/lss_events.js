//
// jQuery event handlers
//
// Author: Ken Seal
//---------------------------------------------------------------------------//

$(function() {

  _.each(["#tools"], function(e) { $(e).hide(); });
  $("input:checkbox, button", "#results-menu").button();

  // Filters menu.
  _.each(["#filters", "#view-as"], function(e) {
    $(e).button({
      icons: {
        secondary : 'ui-icon-triangle-1-s'
      }
    })
    .click(function() {
      var menu = $(this).parent().next().show().position({
        my: "left top",
        at: "left bottom",
        of: this
      }).css('z-index', 10000);
      $(document).one('click', function() { menu.hide(); });
      return false;
    })
    .parent().next().hide().menu();
  });

  // Remove filters
  $("#remove-filters").click(function() {
    LSS.removeFilters();
    $("#evalue").val('');
  });

  // Top Hits
  $("#top-hits").click(function() {
    LSS.expandTopHits();
  });

  // Top Hits Per Reference Sequence
  $("#top-hits-per-ref-seq").click(function() {
    LSS.expandTopHitPerRefSeq();
  });

  // Top Hits Per Reference
  $("#top-hits-per-ref").click(function() {
    LSS.expandTopHitPerRef();
  });

  // Evalue Filter
  $("#filter-evalue").click(function() {
    var val = $("#evalue").val();
    LSS.evalueFilter(val);
  });

  // Width and height for menu.
  var resultsWidth = $('#results').outerWidth() - 12,
      aboveHeight = $('#results-menu').outerHeight();

  // Enable fixed position menu.
  $(window).scroll(function() {
    if ($(window).scrollTop() > aboveHeight) {
      $('#results-menu').addClass('fixed').css('top','0')
        .css('width',(resultsWidth - 16) + 'px')
        .css('z-index', 1000);
    } else {
      $('#results-menu').removeClass('fixed')
        .css('width','100%');
    }
  });
});

//
// End jQuery Event Handlers
//---------------------------------------------------------------------------//
