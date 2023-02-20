if (window.console === undefined) window.console = {log:function(){}};

var kp_isSP = false;

;(function($)
{
  $(document).ready(function()
  {
    if (navigator.userAgent.indexOf('iPhone')>0 || navigator.userAgent.indexOf('iPod')>0 || navigator.userAgent.indexOf('iPad')>0 || navigator.userAgent.indexOf('Android')>0)
    {
      //スマホの時
      $("header").css("position", "absolute");

      kp_isSP = true;
    }

    resizing();

    // TweenMax.set($("body"), {css:{scale:0.7}});

    //後から追加されたTDタグにリンクを付ける
    $(document).on('click', "td[data-hrefSelf]", function()
    {
      window.location = $(this).attr("data-hrefSelf");
    });
    $(document).on('click', "td[data-hrefBlank]", function()
    {
      window.open().location.href = $(this).attr("data-hrefBlank");
    });

    //TRタグにリンクを付ける
    $("tr[data-hrefSelf]").click(function()
    {
      window.location = $(this).attr("data-hrefSelf");
    });
    $("tr[data-hrefBlank]").click(function()
    {
      window.open().location.href = $(this).attr("data-hrefBlank");
    });
    //グローバルメニュー表示
    $("._f-menuOpen").click(function()
    {
      $("header ._hamburger").addClass("_u-none");
      TweenMax.to($("header ._menu"), 0.3, {css:{opacity:1, display:"block"}, ease:Sine.easeInOut});
      TweenMax.set($("header ._menu ._search"), {css:{opacity:0, display:"none"}});
      TweenMax.set($("header ._menu ._analysis"), {css:{opacity:0, display:"none"}});
      TweenMax.set($("header ._menu ._datalist"), {css:{opacity:0, display:"none"}});
      TweenMax.to($("header ._menu ._search"), 0.3, {css:{opacity:1, display:"block"}, ease:Back.easeOut, delay:0.0});
      TweenMax.to($("header ._menu ._analysis"), 0.3, {css:{opacity:1, display:"block"}, ease:Back.easeOut, delay:0.1});
      TweenMax.to($("header ._menu ._datalist"), 0.3, {css:{opacity:1, display:"block"}, ease:Back.easeOut, delay:0.2});
    });
    $("._f-menuClose").click(function()
    {
      $("header ._hamburger").removeClass("_u-none");
      TweenMax.to($("header ._menu"), 0.2, {css:{opacity:0, display:"none"}, ease:Sine.easeInOut});
    });

    //用語検索表示
    $("._f-searchTermsOpen").click(function()
    {
      if($("header ._searchTerms").css("display")=="none")
      {
        TweenMax.set($("header ._searchTerms"), {css:{top:70-50}});
        TweenMax.to($("header ._searchTerms"), 0.6, {css:{top:70, opacity:1, display:"block"}, ease:Back.easeOut});
      }
    });
    $("._f-searchTermsClose").click(function()
    {
      TweenMax.to($("header ._searchTerms"), 0.3, {css:{opacity:0, display:"none"}, ease:Sine.easeInOut});
    });

    //言語切り替え
    $("._f-languageJA").click(function()
    {
      $("._language ._ja").addClass("_on");
      $("._language ._ja").removeClass("_off");
      $("._language ._en").removeClass("_on");
      $("._language ._en").addClass("_off");
    });
    $("._f-languageEN").click(function()
    {
      $("._language ._ja").removeClass("_on");
      $("._language ._ja").addClass("_off");
      $("._language ._en").addClass("_on");
      $("._language ._en").removeClass("_off");
    });

    //タイルボタン
    $("._f-tileButton").mouseover(function()
    {
      $(this).addClass("_over");
      $(this).find("img").attr('src', $(this).find("img").attr('src').replace('_off.', '_on.'));
    });
    $("._f-tileButton").mouseout(function()
    {
      $(this).removeClass("_over");
      $(this).find("img").attr('src', $(this).find("img").attr('src').replace('_on.', '_off.'));
    });

    //タイルチェックボックス
    $("._f-tileCheckbox").click(function()
    {
      if($("._tileCheckbox"+$(this).data("id")+":checked").val())
      {
        $("._tileCheckbox"+$(this).data("id")).prop("checked", false);
        $(this).removeClass("_over");
        $(this).find("img").attr('src', $(this).find("img").attr('src').replace('_on.', '_off.'));
      }
      else
      {
        $("._tileCheckbox"+$(this).data("id")).prop("checked", true);
        $(this).addClass("_over");
        $(this).find("img").attr('src', $(this).find("img").attr('src').replace('_off.', '_on.'));
      }
    });
    $("._f-tileCheckbox").mouseover(function()
    {
      $(this).addClass("_over");
      $(this).find("img").attr('src', $(this).find("img").attr('src').replace('_off.', '_on.'));
    });
    $("._f-tileCheckbox").mouseout(function()
    {
      if(!$("._tileCheckbox"+$(this).data("id")+":checked").val())
      {
        $(this).removeClass("_over");
        $(this).find("img").attr('src', $(this).find("img").attr('src').replace('_on.', '_off.'));
      }
    });

    //pc_02_01用
    $("._f-speechBalloon").mouseover(function()
    {
        TweenMax.set($("._speechBalloon_"+$(this).data("id")), {css:{left:-$("._speechBalloon_"+$(this).data("id")).width()/2, bottom:30, opacity:0, display:"none", zIndex:2}});
        TweenMax.set($("._speechArrow_"+$(this).data("id")), {css:{left:$("._speechBalloon_"+$(this).data("id")).width()/2+18}});
        TweenMax.to($("._speechBalloon_"+$(this).data("id")), 0.6, {css:{bottom:50, opacity:1, display:"block"}, ease:Back.easeOut});
    });
    $("._f-speechBalloon").mouseout(function()
    {
        TweenMax.set($("._speechBalloon_"+$(this).data("id")), {css:{zIndex:1}});
        TweenMax.to($("._speechBalloon_"+$(this).data("id")), 0.3, {css:{bottom:30, opacity:0, display:"none"}, ease:Cubic.easeIn});
    });

    //pc_02_01_A用
    $("._f-downloadModalOpen").click(function()
    {
      TweenMax.to($("._downloadModal"), 0.6, {css:{opacity:1, display:"block"}, ease:Back.easeOut});
    });
    $("._f-downloadModalClose").click(function()
    {
      TweenMax.to($("._downloadModal"), 0.3, {css:{opacity:0, display:"none"}, ease:Sine.easeInOut});
    });

    //pc_03_01用、タブボタン(pc_07でも使っていた)
    $("._f-tabButton1").addClass("_on");
    $("._f-tabButton2").removeClass("_on");
    $("._f-tabButton3").removeClass("_on");
    $("._f-tabButton4").removeClass("_on");
    $("._tab1").css("display", "");
    $("._tab2").css("display", "none");
    $("._tab3").css("display", "none");
    $("._tab4").css("display", "none");
    $("._f-tabButton1").click(function()
    {
      $("._f-tabButton1").addClass("_on");
      $("._f-tabButton2").removeClass("_on");
      $("._f-tabButton3").removeClass("_on");
      $("._f-tabButton4").removeClass("_on");

      $("._tab1").css("display", "");
      $("._tab2").css("display", "none");
      $("._tab3").css("display", "none");
      $("._tab4").css("display", "none");
    });
    $("._f-tabButton2").click(function()
    {
      $("._f-tabButton1").removeClass("_on");
      $("._f-tabButton2").addClass("_on");
      $("._f-tabButton3").removeClass("_on");
      $("._f-tabButton4").removeClass("_on");

      $("._tab1").css("display", "none");
      $("._tab2").css("display", "");
      $("._tab3").css("display", "none");
      $("._tab4").css("display", "none");
    });
    $("._f-tabButton3").click(function()
    {
      $("._f-tabButton1").removeClass("_on");
      $("._f-tabButton2").removeClass("_on");
      $("._f-tabButton3").addClass("_on");
      $("._f-tabButton4").removeClass("_on");

      $("._tab1").css("display", "none");
      $("._tab2").css("display", "none");
      $("._tab3").css("display", "");
      $("._tab4").css("display", "none");
    });
    $("._f-tabButton4").click(function()
    {
      $("._f-tabButton1").removeClass("_on");
      $("._f-tabButton2").removeClass("_on");
      $("._f-tabButton3").removeClass("_on");
      $("._f-tabButton4").addClass("_on");

      $("._tab1").css("display", "none");
      $("._tab2").css("display", "none");
      $("._tab3").css("display", "none");
      $("._tab4").css("display", "");
    });

    //pc_04用
    $("._f-selectChange").on("change", function()
    {
      $("._f-selectChangeValue").text($(this).find("option:selected").text());
      $(this).blur();
    });

    //pc_06用
    $("._f-imageChange").mouseover(function()
    {
      $(this).find("img").attr('src', $(this).find("img").attr('src').replace('_off.', '_on.'));
    });
    $("._f-imageChange").mouseout(function()
    {
      $(this).find("img").attr('src', $(this).find("img").attr('src').replace('_on.', '_off.'));
    });

    //pc_06_01用
    $("._f-checkbox").on("change", function()
    {
      if($(this).prop("checked"))
      {
        $("."+$(this).data("id")+" p").addClass("_on");
      }
      else
      {
        $("."+$(this).data("id")+" p").removeClass("_on");
      }
    });
    $("._f-advancedSettingsOpen").click(function()
    {
      // $("._advancedSettings ._advancedSettingsContents").css("display", "block");
      $("._advancedSettings ._advancedSettingsContents").slideDown(600);
      $("._advancedSettings ._open").css("display", "none");
      $("._advancedSettings ._close").css("display", "block");
    });
    $("._f-advancedSettingsClose").click(function()
    {
      // $("._advancedSettings ._advancedSettingsContents").css("display", "none");
      $("._advancedSettings ._advancedSettingsContents").slideUp(300);
      $("._advancedSettings ._open").css("display", "block");
      $("._advancedSettings ._close").css("display", "none");
    });

    //pc_06_01A用
    $("._f-textChange").on("change", function()
    {
      if($(this).val()=="")
      {
        $("._f-textChangeButton").removeClass("_on");
      }
      else
      {
        $("._f-textChangeButton").addClass("_on");
      }
      // $("._f-selectChangeValue").text($(this).find("option:selected").text());
      // $(this).blur();
    });

  });
  $.event.add(window, "load", function()
  {

  });

  $.event.add(window, "resize", function()
  {
    resizing();

  });
  function resizing()
  {
    var window_w = document.documentElement.clientWidth;
    var window_h = document.documentElement.clientHeight;

    $("header ._menu").css("height", window_h-80);

  }

  $.event.add(window, "scroll", function()
  {
    scroll();
  });
  function scroll()
  {
    if(kp_isSP)
    {
      //SP
      $("header").css("left", 0);
    }
    else
    {
      //PC
      $("header").css("left", -$(window).scrollLeft());

      if($("._tableContainer").length)
      {
        var top_ = $(window).scrollTop()-$("._tableContainer").offset().top+$("header").height();
        top_ = (top_<0) ? 0 : top_;
        $("._headContainer").css("top", top_);

        // if($("#k_pc_02").length || $("#k_pc_03A").length)
        // {
        //   $("._alphabetContainer").css("top", top_+75);
        //   $("._syllabaryContainer").css("top", top_+75);
        // }
      }
    }
  }
}
)(jQuery);
