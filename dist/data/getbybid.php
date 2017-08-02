<?php
header('Content-Type:application/json;charset=UTF-8');
@$bid = $_REQUEST['bid'] or die('{"msg":"bid required"}');
require('kxmd_init.php');
$sql  = "SELECT * FROM k_books WHERE bid=$bid";
$result=mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
echo json_encode($row);
?>