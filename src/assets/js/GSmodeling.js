if (window.console === undefined) window.console = {log:function(){}};

;(function($)
{
  $(document).ready(function()
  {
    //GSmodeling用
    $("._f-GSmodelingClear").click(function()
    {
      $("._GSmodelingContents input[type='number']").val("");
      $("._GSmodelingContents input[type='checkbox']").prop('checked', false);
    });
    $("._f-GSmodelingOpen").click(function()
    {
      $("._GSmodelingContents").slideDown(600);
      $("._accordionOpen").css("display", "none");
      $("._accordionClose").css("display", "block");
    });
    $("._f-GSmodelingClose").click(function()
    {
      $("._GSmodelingContents").slideUp(300);
      $("._accordionOpen").css("display", "block");
      $("._accordionClose").css("display", "none");
    });
  });
  $.event.add(window, "load", function()
  {

  });
}
)(jQuery);
