<?php
header('Content-Type:application/json;charset=UTF-8');
@$un = $_REQUEST['uname'] or die('{"msg":"uname required"}');
@$up = $_REQUEST['upwd'] or die('{"msg":"upwd required"}');
require('kxmd_init.php');
$sql = "SELECT * FROM k_user WHERE uname='$un' AND upwd='$up'";
$result =mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
//var_dump($row);
if($row===null){
		$str = '{"code":2,"msg":"用户名或密码错误"}';
		echo $str;
}else{
		$output = ['code'=>1,'uname'=>$row['uname'],'uid'=>$row['uid']];
		echo json_encode($output);
}
?>