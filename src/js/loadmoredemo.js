<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>InfiniteScroll</title>
    <meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" name="viewport"/>
    <meta content="yes" name="apple-mobile-web-app-capable"/>
    <meta content="black" name="apple-mobile-web-app-status-bar-style"/>
    <meta content="telephone=no" name="format-detection"/>
    <link rel="stylesheet" href="../css/ydui.css?rev=a4b9d6e8c9c1cae7ea4676f911682af7"/>
    <link rel="stylesheet" href="../css/demo.css"/>
    <script src="../js/ydui.flexible.js"></script>
</head>
<body>
<section class="g-flexview">

    <header class="m-navbar">
        <a href="list.html" class="navbar-item"><i class="back-ico"></i></a>
        <div class="navbar-center"><span class="navbar-title">InfiniteScroll</span></div>
    </header>

    <section class="g-scrollview" id="J_List">
        <div id="J_ListContent" class="m-list list-theme1"></div>
    </section>

</section>
<script id="J_ListHtml" type="text/html">
    {{each list as data}}
    <a href="{{data.url}}" class="list-item">
        <div class="list-img">
            <img src="../img/goods_default.jpg" data-url="{{data.img}}">
        </div>
        <div class="list-mes">
            <h3 class="list-title">{{data.title}}</h3>
            <div class="list-mes-item">
                <div>
                    <span class="list-price"><em>¥</em>{{data.marketprice}}</span>
                    <span class="list-del-price">¥{{data.productprice}}</span>
                </div>
            </div>
        </div>
    </a>
    {{/each}}
</script>
<script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="../js/template.js"></script>
<script src="../js/ydui.js"></script>
<script>
    !function () {

        // 根据实际情况自定义获取数据方法
        var page = 1, pageSize = 10;
        var loadMore = function (callback) {
            $.ajax({
                url: '../json/getdata_backposition.json',
                dataType: 'json',
                data: {
                    page: page,
                    pagesize: pageSize
                },
                success: function (ret) {
                    setTimeout(function () {
                        typeof callback == 'function' && callback(ret);
                    }, 2000);
                }
            });
        };

        $('#J_List').infiniteScroll({
            binder: '#J_List',
            pageSize: pageSize,
            initLoad: true,
            loadingHtml: '<img src="../img/loading.svg"/>',
            loadListFn: function () {
                var def = $.Deferred();

                loadMore(function (listArr) {

                    var html = template('J_ListHtml', {list: listArr});
                    $('#J_ListContent').append(html).find('img').lazyLoad({binder: '#J_List'});

                    def.resolve(listArr);

                    ++page;
                });

                return def.promise();
            }
        });
    }();
</script>
</body>
</html>
