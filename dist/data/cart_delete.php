<?php
header('Content-Type:application/json;charset=UTF-8');
@$bid = $_REQUEST['bid'] or die('{"code":"3","msg":"bid required"}');
require('kxmd_init.php');
$sql = "DELETE FROM k_cart_detail WHERE bookId=$bid";
$result = mysqli_query($conn,$sql);
echo '{"msg":"succ"}';