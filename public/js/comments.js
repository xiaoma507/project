/**
 * Created by Administrator on 2017/5/13 0013.
 */
    var pages = 0;		//总的页数
    var page = 1;		//当前页数
    var prepage = 5;	//每页显示5条数据
    var comments=[];
    /*
     * 提交评论
     * */
    $("#messageBtn").on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/comment/post',
            data: {
                contentid: $("#contentId").val(),
                content: $("#messageContent").val()
            },
            success: function (responseData) {
                $("#messageContent").val("");
                comments=responseData.data.comments.reverse();
                renderComment();
            }
        })
    })

    $.ajax({
        url: '/api/comment',
        data: {
            contentid: $("#contentId").val(),
        },
        success: function (responseData) {
            comments=responseData.data.reverse();
            renderComment();
        }
    })


    //渲染数据和分页处理
    function renderComment() {
        pages = Math.ceil(comments.length / prepage);
        var star=Math.max(0,(page-1)*prepage);
        var end=Math.min(star+prepage,comments.length);
        var html = '';
        var pagehtml = '';
        for (var i = star; i < end; i++) {
            var obj = comments[i].postTime;
            var values = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key) === true) {
                    values.push(obj[key]);
                }
            }
            var v = formatDate(values.join(""));
            html += `<ul class="pltext">
                    <li><span> 评论者: </span>${comments[i].username}</li>
                    <li><span> 内容: </span>${comments[i].content}</li>
                    <li><span> 时间: </span>${v}</li>
                </ul>`
        }
        $(".plwrap").html(html);
        $("#messageCount").html(comments.length);

        pagehtml += `<ul>
                <li class="prev"></li>
                <li class="center"><strong>${page}/${pages}</strong></li>
                <li class="next"></li>
            </ul>`
        $(".pager").html(pagehtml);

        var lis=$(".pager li");
        if(page<=1){
            page=1;
            lis.eq(0).html('<span>没有上一页</span>' );
        }else{
            lis.eq(0).html('<a href="javascript:;">上一页</a>' );
        }
        if(page>=pages){
            page=pages;
            lis.eq(2).html('<span>没有下一页</span>' );
        }else{
            lis.eq(2).html('<a href="javascript:;">下一页</a>' );
        }

    }
    $(".pager").delegate('a','click',function(){

        if($(this).parent().hasClass('prev')){
            page--;
        }else {
            page++;
        }
        renderComment();
    })

    //处理时间的格式的方法
    function formatDate(d) {
        var date = new Date(d);
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }