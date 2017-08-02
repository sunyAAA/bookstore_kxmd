<?php
header('Content-Type:application/json;charset=UTF-8');
@$ud = $_REQUEST['uid'] || '1';
require('kxmd_init.php');
$sql = "SELECT cid FROM k_cart WHERE userId='$ud'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
//var_dump($row);
if($row===null){
	die('{"code":"2","msg":"购物车空空如也"}');
}
$cartId = $row['cid'];
$sql = "SELECT * FROM k_cart_detail,k_books WHERE bid=bookId AND cartId=$cartId";
$result = mysqli_query($conn,$sql);
$list = mysqli_fetch_all($result,MYSQLI_ASSOC);
//var_dump($list);
echo json_encode($list);