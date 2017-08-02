<?php
//新书查询
//查询出类型为 ‘1’的 ‘最后添加的8条记录’
 header('Content-Type:application/json;charset=UTF-8');
 require('kxmd_init.php');
 $sql = "SELECT bid,img,name,price,title FROM k_books WHERE type=1 ORDER BY bid DESC LIMIT 8";
 $result = mysqli_query($conn,$sql);
 $list = mysqli_fetch_all($result,1);
 echo json_encode($list);
?>