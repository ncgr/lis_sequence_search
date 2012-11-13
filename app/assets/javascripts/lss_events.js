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

  // View
  $("#dual-view").click(function() {
    LSS.renderView();
  });

  // View as partition
  $("#partition-view").click(function() {
    LSS.renderView(null, LSS.renderPartition, "#partition-view");
  });

  // View as table
  $("#table-view").click(function() {
    LSS.renderView(null, LSS.renderTable, "#table-view");
  });

  // Remove filters
  $("#remove-filters").click(function() {
    LSS.removeFilters();
    $("#evalue").val('');
    $("#bit_score").val('');
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
  $("#evalue").keyup(function() {
    setTimeout(function() {
      LSS.renderView();
    }, 500);
  });

  // Bit score Filter
  $("#bit_score").keyup(function() {
    setTimeout(function() {
      LSS.renderView();
    }, 500);
  });

  // Width and height for menu.
  var resultsWidth = $('#results').outerWidth() - 12,
      aboveHeight = $('#results-menu').outerHeight();

  // Enable fixed position menu.
  $(window).scroll(function() {
    if ($(window).scrollTop() > aboveHeight) {
      $('#results-menu').addClass('fixed').css('top','0')
        .css('width',(resultsWidth) + 'px')
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
