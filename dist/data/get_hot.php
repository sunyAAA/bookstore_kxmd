<?php
//销量查询
//查询出销售数量最多的前十位
 header('Content-Type:application/json;charset=UTF-8');
 require('kxmd_init.php');
 $sql = "SELECT bid,img,name,price,title,sellCount FROM k_books ORDER BY sellCount DESC LIMIT 10";
 $result = mysqli_query($conn,$sql);
 $list = mysqli_fetch_all($result,1);
 echo json_encode($list);
?>