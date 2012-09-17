//
// jQuery event handlers
//---------------------------------------------------------------------------//

$(function() {
  _.each(["#view", "#tools"], function(e) { $(e).hide(); });
  $("input:checkbox, button", "#results-menu").button();

  // Filters menu.
  _.each(["#filters", "#view-tree"], function(e) {
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
      });
      $(document).one('click', function() { menu.hide(); });
      return false;
    })
    .parent().next().hide().menu();
  });

  // View
  $("#view").click(function() {
    LSS.data["cached"] = null;
    LSS.renderView(null, null, "#partition");
  });

  // View as partition
  $("#partition").click(function() {
    LSS.renderView(null, LSS.renderPartition, "#partition");
  });

  // View as table
  $("#table").click(function() {
    LSS.renderView(null, LSS.renderTable, "#table");
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
});

//
// End jQuery Event Handlers
//---------------------------------------------------------------------------//
