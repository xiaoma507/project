/**
 * Created by Administrator on 2017/5/13 0013.
 */
$("#register .login").on('click', function () {
	$("#register").hide();
	$("#login").show();
})
$("#login .register").on('click', function () {
	$("#register").show();
	$("#login").hide();
})
//用户注册
$("#register .subbtn").on('click', function () {
	$.ajax({
		type: 'post',
		url: '/api/user/register',
		data: {
			username: $("#register").find('[name=username]').val(),
			password: $("#register").find('[name=password]').val(),
			repassword: $("#register").find('[name=repassword]').val()
		},
		dataType: 'json',
		success: function (result) {
			$("#register .success").html(result.message);
			if (!result.code) {
				setTimeout(function () {
					$("#login").show();
					$("#register").hide();
				}, 2000)
			}
		}
	})
})
//用户登录
$("#login .subbtn").on('click', function () {
	$.ajax({
		type: 'post',
		url: '/api/user/login',
		data: {
			username: $("#login").find('[name=username]').val(),
			password: $("#login").find('[name=password]').val(),
		},
		dataType: 'json',
		success: function (result) {
			$("#login .success").html(result.message);
			if (!result.code) {
				window.location.reload();
			}
		}
	})
})
/*
 * 退出登录状态
 * */
$("#loginout").on('click', function () {
	console.log(1111111)
	$.ajax({
		url: '/api/user/loginout',
		success: function (result) {
			if (!result.code) {
				window.location.reload();
			}
		}
	})
})
