$(document).ready(function(){
  init();
  select_category($("#select-category"));

  var submit_form = false;
  $("#new_memo").submit(function(e){
    if (submit_form){
      return;
    } else {
      $("#modal-insert-password").modal('show');
      e.preventDefault();
    }
  });

  $("#btn-check-password").on('click', function(){
    var password = $('input[name=check-password]').val();
    $('.cs-loader').show();
    $.get('/admin/memo/check-account?password=' + password)
      .done(function(result){
        if (result == 'valid') {
          submit_form = true;
          $("#new_memo").submit();
        } else {
          alert('You have entered invalid password.');
        }
        $('.cs-loader').hide();
      });
  });

  $('select[name=aircraft_registry_id]').on('change', function(){
    memo_filter();
  });

  $('select[name=user_department_id]').on('change', function(){
    memo_filter();
  });

  $('#created_date').on('change', function(){
    memo_filter();
  });

  $("#memo-recipient-select, #memo-recipient-select1, #reason-select, #remarks-select").select2({
    theme: 'bootstrap'
  });

});

function init() {
  $('.has-datetime-picker').datetimepicker({
    format: 'YYYY-MM-DD HH:mm'
  });
  $('.has-time-picker').datetimepicker({
    format: 'HH:mm'
  });
  $('.has-date-picker').datetimepicker({
    format: 'YYYY-MM-DD'
  });
}

function memo_filter() {
  var ac_id = $('select[name=aircraft_registry_id]').val();
  var dept_id = $('select[name=user_department_id]').val();
  var created_date = $('#created_date').val();

  $.get('admin/memo-filters', { ac_id: ac_id, dept_id: dept_id, created_date: created_date })
    .done(function(result){
      $(".panel-body.memo-lists").html(result);
    });
}

function memo_info(id){
  $.get('admin/memo-info', { id: id })
  .done(function(result){
    $(".panel-body.memo-info").html(result.partial);
    $(".panel-heading.memo-title").html(result.title);
  });
}

function select_category(id) {
  var val = $(id).val();
  var id = $(id).closest('.panel-body').data('id')

  if (id) {
    $('#additional-category' + id).find(".div-category").addClass('hidden');
    disable_fields($('#additional-category' + id).find(".div-category"));
    $('#additional-category' + id).find("#category-" + val).removeClass('hidden');
    enable_fields($('#additional-category' + id).find("#category-" + val));
  } else {
    $('#main-category').find(".div-category").addClass('hidden');
    disable_fields($('#main-category').find(".div-category"));
    $('#main-category').find("#category-" + val).removeClass('hidden');
    enable_fields($('#main-category').find("#category-" + val));
  }
  
}

function enable_fields(elem) {
  elem.find("input, select, textarea").removeAttr('disabled');
}

function disable_fields(elem) {
  elem.find("input, select, textarea").attr('disabled','disabled');
}

function flocation(elem){
  var id = $(elem).closest('.panel-body').data('id');
  var form = $('#main-category');

  if (id) {
    form = $('#additional-category' + id);
  }

  var loc1 = form.find('#loc-loc').val() ? form.find('#loc-loc').val() : '';
  var loc2 = form.find('#loc-f1').val() ? form.find('#loc-f1').val() : '';
  var loc3 = form.find('#loc-f2').val() ? form.find('#loc-f2').val() : '';
  form.find('#hidden-location').val(loc1 + ' ' + loc2 + ' ' + loc3);
}

function fmovement(elem){
  var id = $(elem).closest('.panel-body').data('id');
  var form = $('#main-category');

  if (id) {
    form = $('#additional-category' + id);
  }

  var loc1 = form.find('#mvnt-loc').val() ? form.find('#mvnt-loc').val() : '';
  var loc2 = form.find('#mvnt-f1').val() ? form.find('#mvnt-f1').val() : '';
  form.find('#hidden-movement').val(loc1 + ' ' + loc2);
}

function fmaxwnd(elem){
  var id = $(elem).closest('.panel-body').data('id');
  var form = $('#main-category');

  if (id) {
    form = $('#additional-category' + id);
  }

  var f1 = form.find('#mxwnd-f1').val() ? form.find('#mxwnd-f1').val() : '';
  var f2 = form.find('#mxwnd-f2').val() ? form.find('#mxwnd-f2').val() : '';
  form.find('#hidden-max-wind').val(f1 + ' ' + f2);
}
