$(document).ready(function() {
    var isSending = false,

        telSaver = '',

        isOrdered = {},

        getUrlParam = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r !== null) return unescape(r[2]); return null;
        };

    Parse.initialize("9cw5r2HU1Cr0WgAcIQdZSsTkNkzes8QmLPSXthMC", "7niEeaxl3CQr7GQpNNmYbCdTt2twNobXCfAeUPMV");
    var Thanks = Parse.Object.extend("Thanks");

    router.add('/detail.html',function() {
        $('.index').hide();
        $('.detail').show();
    });

    router.add('/',function() {
        $('.detail').hide();
        $('.index').show();
        isSending = false;
    });
    
    router.start();

    if (getUrlParam('tel')) {
        telSaver = getUrlParam('tel');
    }

    $('.app-order').on('click', function () {
        var pn = $(this).data('pn');

        if (!!gameList[pn]) {
            var template = $('#detailTemplate').html(),
                output = '';

            gameList[pn].pn = pn;
            
            output = Mustache.render(template, gameList[pn]);
            $('.detail').html(output);

            if (telSaver) {
                $('.order-input input').val(telSaver);
            }

            if (isOrdered[pn]) {
                isSending = true;
                $('.submit').css({
                    'background-color': 'transparent',
                    'color': '#3BAA24'
                }).text('预订成功');
            }
        }

        router.goto('#/detail.html');
    });

    $('body').on('click', '.back', function () {
        router.goto('#/');
    }).on('click', '#popcap', function () {
        if (window.campaignPlugin) {
            window.campaignPlugin.openInBrowser(this.href);
        }
    }).on('click', '.submit', function () {

        if (isSending) {
            return;
        }
        isSending = true;

        var pn = $(this).data('pn'),
            tel = $('.order-input input').val(),
            self = $(this);

        if (!!tel) {
            SnapPea.Account.checkUserLoginAsync().then(function () {

                self.css('background-color', '#ddd').text('预订中');

                var userInfo = SnapPea.Account.getUserInfo(),
                    uid = userInfo.uid,
                    user = new Thanks();

                user.save({
                    uid: uid,
                    pn: pn,
                    tel: tel
                }, {
                    success: function(object) {
                        self.css({
                            'background-color': 'transparent',
                            'color': '#3BAA24'
                        }).text('预订成功！');
                        isOrdered[pn] = true;
                    },
                    error: function(object) {
                        self.css({
                            'background-color': 'transparent',
                            'color': 'red'
                        }).text('预订失败！');

                        setTimeout(function () {
                            isSending = false;
                            self.css({
                                'background-color': '#3BAA24',
                                'color': '#fff'
                            }).text('再试试');
                        }, 2000);
                    }
                });
            }).fail(function () {
                var callbackUrl = '';

                callbackUrl = encodeURIComponent('http://m.wandoujia.com/campaign/thanksgiving.html?tel=' + tel);
                location.href = 'http://www.wandoujia.com/account?callback=' + callbackUrl ;
            });
        } else {
            isSending = false;
            return;
        }
    });

});