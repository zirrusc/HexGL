function initPinBox(){$("#pinBoxOk").bind("touchend",sendAddRequest),$("#pinBoxOk").bind("click",sendAddRequestOnClick),$("#pinBox").modal("show"),$("#pinBoxValue").text(""),$("#pinBoxValue").focus(),window.ondeviceorientation=reportMotion}function sendAddRequest(){supportsTouchend=!0;var a=$("#pinBoxValue").val().replace(" ","");ready&&socket.emit("add_room_mobile",{id:id,roomid:a})}function sendAddRequestOnClick(){0==supportsTouchend&&sendAddRequest()}function preventTouchEvents(){function a(a){a.preventDefault()}$(document).bind("touchmove",a),$(document).bind("gesturestart",a),$(document).bind("gesturechange",a),$(document).bind("gestureend",a)}$(function(){var a=hashArgs();initSocket(),window.scrollTo(0,1),preventTouchEvents(),1==a.invalid_pin&&($("#pinBoxAdvice").show(),$("#pinBoxAdvice").text("Pin が違うよ")),initPinBox(),ready=!0});
//# sourceMappingURL=mobile.map