<?php
header('Content-Type:application/json;charset=UTF-8');
@$ud = $_REQUEST['uid'] || '1';
@$bd = $_REQUEST['bid'] or die('{"code":"4","msg":"bid required"}');
require('kxmd_init.php');
$sql = "SELECT * FROM k_cart WHERE userId='$ud'";
$result = mysqli_query($conn,$sql);
$row =mysqli_fetch_assoc($result);
if($row===null){
	$sql ="INSERT INTO k_cart VALUES(NULL,$ud)";
	mysqli_query($conn,$sql);
	$cd = mysqli_insert_id($conn);
}else{
	//var_dump($row);
	$cd = $row['cid'];
}
//var_dump($cd);
$sql = "SELECT * FROM k_cart_detail WHERE bookId='$bd' AND cartId='$cd'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
//var_dump($row);
if($row===null){
	$sql = "INSERT INTO k_cart_detail VALUES(null,'$cd','$bd','1')";
	$result = mysqli_query($conn,$sql);
	//var_dump($result);
	$arr = ['bookId'=>$bd,'count'=>1];
	echo json_encode($arr);
}else{
	$ct = $row['count'];
	$sql = "UPDATE k_cart_detail SET count=count+1 WHERE bookId='$bd' AND cartId='$cd'";
	$resutl = mysqli_query($conn,$sql);
	//var_dump($result);
	$ct+=1;
	$arr = ['bookId'=>$bd,'count'=>$ct];
	echo json_encode($arr);
}