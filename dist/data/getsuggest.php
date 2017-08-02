<?php
header('Content-Type:application/json;charset=UTF-8');
@$kw =$_REQUEST['kw'] or die('{"msg":"kw required"}');
require('kxmd_init.php');
$sql = "SELECT bid,name,author,img FROM k_books WHERE name LIKE '%$kw%' OR author LIKE '%$kw%'";
$result = mysqli_query($conn,$sql);
$list = mysqli_fetch_all($result,1);
echo json_encode($list);
?>